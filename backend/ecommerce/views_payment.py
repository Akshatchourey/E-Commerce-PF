import razorpay
import json
from decimal import Decimal
from django.conf import settings
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from rest_framework import status, serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Product, Order, OrderItem, CartItem, Offer
from .serializers import OrderCreationSerializer, PaymentVerificationSerializer
from .mailers import send_order_completed_email

# Initialize Razorpay Client
razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))


class CreateRazorpayOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = OrderCreationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        user = request.user
        items_data = data['items']
        coupon_code = data.get('coupon')
        gift_wrap_requested = data.get('gift_wrap', False)

        subtotal = Decimal('0.00')
        order_items_to_prepare = []

        # 1. Securely calculate subtotal based on current product prices
        for item in items_data:
            try:
                product = Product.objects.get(public_product_id=item['product_id'], is_active=True)
                item_total = product.price * item['quantity']
                subtotal += item_total
                order_items_to_prepare.append({
                    'product': product,
                    'quantity': item['quantity'],
                    'price_at_purchase': product.price
                })
            except Product.DoesNotExist:
                return Response({"error": f"Product {item['product_id']} not found."}, status=400)

        # 2. Apply Coupon Logic (if provided)
        discount = Decimal('0.00')
        if coupon_code:
            try:
                offer = Offer.objects.get(coupon=coupon_code)
                if offer.type == "PERCENT":
                    discount = (subtotal * Decimal(offer.unit)) / Decimal(100)
                elif offer.type == "DIRECT":
                    # Direct discount with 50% cap as per your OfferApplySerializer logic
                    max_allowed_discount = subtotal * Decimal("0.50")
                    discount = min(Decimal(offer.unit), max_allowed_discount)

                # Safety: discount should never exceed subtotal
                discount = min(discount, subtotal)
            except Offer.DoesNotExist:
                return Response({"error": "Invalid coupon code."}, status=400)

        total_final_amount = subtotal - discount

        if gift_wrap_requested:
            total_final_amount += Decimal('10.00')

        # 3. Create Order in local DB and Razorpay
        try:
            with transaction.atomic():
                order = Order.objects.create(
                    user=user,
                    total_amount=total_final_amount,
                    shipping_address=data['shipping_address'],
                    phone_number=data['phone_number'],
                    gift_wrap=gift_wrap_requested,
                    status="PENDING",
                    payment_provider="RAZORPAY"
                )

                for item_info in order_items_to_prepare:
                    OrderItem.objects.create(order=order, **item_info)

                # Razorpay expects amount in paise
                amount_paise = int(total_final_amount * 100)

                razorpay_order = razorpay_client.order.create({
                    'amount': amount_paise,
                    'currency': 'INR',
                    'receipt': order.public_order_id,
                    'payment_capture': 1
                })

                order.razorpay_order_id = razorpay_order['id']
                order.save()

            return Response({
                "razorpay_order_id": razorpay_order['id'],
                "amount": amount_paise,
                "currency": "INR",
                "key_id": settings.RAZORPAY_KEY_ID,
                "discount_applied": float(discount)
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": f"Order creation failed: {str(e)}"}, status=500)


class VerifyRazorpayPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = PaymentVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        try:
            razorpay_client.utility.verify_payment_signature(data)

            # Update order status
            order = Order.objects.get(razorpay_order_id=data['razorpay_order_id'], user=request.user)
            if order.status != "VERIFIED":
                order.status = "PAID"
            order.razorpay_payment_id = data['razorpay_payment_id']
            order.razorpay_signature = data['razorpay_signature']
            order.save()

            # Clean up the cart after successful purchase
            CartItem.objects.filter(user=request.user).delete()

            # Send Email
            try:
                send_order_completed_email(order)
            except Exception as e:
                print(f"Failed to send email: {e}")

            return Response({"status": "success", "message": "Payment verified and order confirmed."})

        except razorpay.errors.SignatureVerificationError:
            return Response({"error": "Signature verification failed."}, status=400)
        except Order.DoesNotExist:
            return Response({"error": "Order not found."}, status=404)


@method_decorator(csrf_exempt, name='dispatch')
class RazorpayWebhookView(APIView):
    permission_classes = []

    def post(self, request, *args, **kwargs):
        payload = request.body
        signature = request.headers.get('X-Razorpay-Signature')
        secret = settings.RAZORPAY_WEBHOOK_SECRET

        try:
            razorpay_client.utility.verify_webhook_signature(
                payload.decode('utf-8'), signature, secret
            )
            data = json.loads(payload)
            event = data.get('event')

            if event == "order.paid":
                order_id = data['payload']['order']['entity']['id']
                payment_id = data['payload']['payment']['entity']['id']

                try:
                    order = Order.objects.get(razorpay_order_id=order_id)
                    order.status = "VERIFIED"
                    order.razorpay_payment_id = payment_id
                    order.save()

                     # Clean up the cart after successful backend verification
                    CartItem.objects.filter(user=request.user).delete()

                    try:
                        send_order_completed_email(order)
                    except Exception as e:
                        print(f"Webhook Email Failed: {e}")

                    print(f"Webhook Success: Order {order_id} verified.")
                except Order.DoesNotExist:
                    pass

            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)
