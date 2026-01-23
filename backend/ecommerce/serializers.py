# ModelSerializer is used to convert your model instances to JSON and vice versa.

from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User, Group
from rest_framework_simplejwt.tokens import RefreshToken
from decimal import Decimal


class ProductListSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    seller = serializers.CharField(source="seller.username")

    class Meta:
        model = Product
        fields = [
            "public_product_id",
            "title",
            "price",
            "description",
            "image",
            "category",
            "seller",
            "created_at",
        ]

    def get_image(self, obj):
        request = self.context.get("request")
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url).replace(
                "127.0.0.1", "localhost"
            )
        return None
    
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"]
        )

        # Assign default role = user
        user_group = Group.objects.get(name="user")
        user.groups.add(user_group)

        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        from django.contrib.auth import authenticate

        user = authenticate(
            username=data["username"],
            password=data["password"]
        )

        if not user:
            raise serializers.ValidationError("Invalid credentials")

        refresh = RefreshToken.for_user(user)

        return {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "username": user.username,
            "role": user.groups.first().name if user.groups.exists() else "user"
        }


class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Review
        fields = ["user", "rating", "comment", "created_at"]


class ProductDetailSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    seller = serializers.CharField(source="seller.username")
    stock_quantity = serializers.IntegerField(
        source="inventory.stock_quantity", read_only=True
    )
    reviews = ReviewSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "public_product_id",
            "title",
            "price",
            "description",
            "image",
            "category",
            "seller",
            "stock_quantity",
            "average_rating",
            "reviews",
            "created_at",
        ]

    def get_image(self, obj):
        request = self.context.get("request")
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None

    def get_average_rating(self, obj):
        reviews = obj.reviews.all()
        if reviews.exists():
            return round(sum(r.rating for r in reviews) / reviews.count(), 1)
        return 0


class OfferApplySerializer(serializers.Serializer):
    coupon = serializers.CharField()
    cart_total = serializers.DecimalField(max_digits=10, decimal_places=2)

    def validate(self, data):
        coupon_code = data["coupon"]
        cart_total = Decimal(data["cart_total"])

        try:
            offer = Offer.objects.get(coupon=coupon_code)
        except Offer.DoesNotExist:
            raise serializers.ValidationError("Invalid coupon code")

        discount = Decimal("0.00")

        if offer.type == "PERCENT":
            # Percentage discount
            discount = (cart_total * Decimal(offer.unit)) / Decimal(100)

        elif offer.type == "DIRECT":
            # Direct discount with 50% cap
            max_allowed_discount = cart_total * Decimal("0.50")
            discount = min(Decimal(offer.unit), max_allowed_discount)

        # Safety: discount should never exceed cart total
        discount = min(discount, cart_total)

        final_amount = cart_total - discount

        return {
            "coupon": offer.coupon,
            "discount_type": offer.type,
            "discount_value": offer.unit,
            "cart_total": round(cart_total, 2),
            "discount_amount": round(discount, 2),
            "final_amount": round(final_amount, 2),
        }


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer()

    class Meta:
        model = CartItem
        fields = ['product', 'quantity']

class WishlistSerializer(serializers.ModelSerializer):
    product = ProductListSerializer()

    class Meta:
        model = Wishlist
        fields = ['product']

class AddToCartSerializer(serializers.Serializer):
    product_id = serializers.CharField()
    quantity = serializers.IntegerField(min_value=1)

class UpdateCartSerializer(serializers.Serializer):
    product_id = serializers.CharField()
    quantity = serializers.IntegerField(min_value=1)

class AddToWishlistSerializer(serializers.Serializer):
    product_id = serializers.CharField()

class RemoveFromWishlistSerializer(serializers.Serializer):
    product_id = serializers.CharField()

class RemoveFromCartSerializer(serializers.Serializer):
    product_id = serializers.CharField()

class TransferToCartSerializer(serializers.Serializer):
    product_id = serializers.CharField()
    quantity = serializers.IntegerField(min_value=1)

class OrderSerializer(serializers.ModelSerializer):
    items = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            "public_order_id",
            "status",
            "total_amount",
            "razorpay_order_id",
            "razorpay_payment_id",
            "razorpay_signature",
            "payment_provider",
            "shipping_address",
            "phone_number",
            "created_at",
            "items"
        ]

    def get_items(self, obj):
        order_items = obj.items.all()
        return OrderItemSerializer(order_items, many=True).data

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer()

    class Meta:
        model = OrderItem
        fields = ["product", "quantity", "price_at_purchase"]

class TransferToWishlistSerializer(serializers.Serializer):
    product_id = serializers.CharField()
    quantity = serializers.IntegerField(min_value=1)


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.CharField(source="user.email", read_only=True)
    date_joined = serializers.DateTimeField(source="user.date_joined", read_only=True)

    class Meta:
        model = UserProfile
        fields = [
            "public_user_id",
            "username",
            "email",
            "phone_number",
            "address_line_1",
            "address_line_2",
            "city",
            "state",
            "postal_code",
            "country",
            "date_joined",
        ]

# Payment serializers
class OrderItemCreationSerializer(serializers.Serializer):
    product_id = serializers.CharField(max_length=30)
    quantity = serializers.IntegerField(min_value=1)


class OrderCreationSerializer(serializers.Serializer):
    items = OrderItemCreationSerializer(many=True)
    shipping_address = serializers.CharField(max_length=255)
    phone_number = serializers.CharField(max_length=15)
    coupon = serializers.CharField(max_length=20, required=False, allow_blank=True)
    gift_wrap = serializers.BooleanField(default=False)


class PaymentVerificationSerializer(serializers.Serializer):
    razorpay_order_id = serializers.CharField(max_length=255)
    razorpay_payment_id = serializers.CharField(max_length=255)
    razorpay_signature = serializers.CharField(max_length=255)

from rest_framework import serializers
from .models import ContactMessage


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = [
            "id",
            "name",
            "email",
            "phone",
            "subject",
            "message",
        ]

    def validate_message(self, value):
        if len(value.strip()) < 10:
            raise serializers.ValidationError(
                "Message must be at least 10 characters."
            )
        return value

class SellerProductSerializer(serializers.ModelSerializer):
    stock = serializers.IntegerField(write_only=True, required=False)
    image = serializers.SerializerMethodField()
    stock_quantity = serializers.IntegerField(
        source="inventory.stock_quantity", read_only=True, allow_null=True
    )

    class Meta:
        model = Product
        fields = [
            "id",
            "public_product_id",
            "title",
            "price",
            "description",
            "image",
            "category",
            "stock",
            "stock_quantity",
            "created_at",
        ]
        read_only_fields = ["id", "public_product_id", "created_at", "stock_quantity"]

    def get_image(self, obj):
        request = self.context.get("request")
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url).replace(
                "127.0.0.1", "localhost"
            )
        return None

    def create(self, validated_data):
        stock = validated_data.pop("stock", 0)
        product = Product.objects.create(**validated_data)
        Inventory.objects.create(product=product, stock_quantity=stock)
        return product

    def update(self, instance, validated_data):
        stock = validated_data.pop("stock", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if stock is not None:
            inventory, _ = Inventory.objects.get_or_create(product=instance)
            inventory.stock_quantity = stock
            inventory.save()

        return instance

class SellerOrderSerializer(serializers.ModelSerializer):
    customer = serializers.CharField(source="user.username", read_only=True)
    items = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            "id",
            "public_order_id",
            "status",
            "total_amount",
            "created_at",
            "customer",
            "items",
        ]

    def get_items(self, obj):
        order_items = obj.items.all()
        return OrderItemSerializer(order_items, many=True).data
