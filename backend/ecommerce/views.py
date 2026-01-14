from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import Group
from .models import Order
from .serializers import OrderSerializer
from .models import Product, Offer, CartItem, Wishlist
from .decorators import allowed_users
from .serializers import ProductListSerializer, RegisterSerializer, LoginSerializer, ProductDetailSerializer, \
    OfferApplySerializer, CartItemSerializer, WishlistSerializer, AddToCartSerializer, UpdateCartSerializer, \
    AddToWishlistSerializer, RemoveFromWishlistSerializer, RemoveFromCartSerializer, TransferToCartSerializer, \
    TransferToWishlistSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from rest_framework.decorators import api_view, permission_classes

# Create your views here.
def home(request):

    return HttpResponse("Hi This is home page of our website!!")


@allowed_users(allowed_roles=['seller'])
def seller_dashboard(request):

    return HttpResponse("only seller logged can see this")


class ProductPagination(PageNumberPagination):
    page_size = 9
    page_size_query_param = "page_size"
    max_page_size = 30


@api_view(["GET"])
def product_list(request):
    products = Product.objects.filter(is_active=True).order_by("-created_at")

    min_price = request.GET.get("min_price")
    max_price = request.GET.get("max_price")
    category = request.GET.get("category")
    search = request.GET.get("search")
    if min_price:
        products = products.filter(price__gte=min_price)
    if max_price:
        products = products.filter(price__lte=max_price)
    if category:
        products = products.filter(category__iexact=category)
    if search:
        products = products.filter(title__icontains=search)

    paginator = ProductPagination()
    paginated_products = paginator.paginate_queryset(products, request)

    serializer = ProductListSerializer(
        paginated_products,
        many=True,
        context={"request": request}
    )

    return paginator.get_paginated_response({
        "products": serializer.data
    })

@api_view(["POST"])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User registered successfully"})
    return Response(serializer.errors, status=400)

@api_view(["POST"])
def login(request):
    serializer = LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    return Response(serializer.validated_data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        refresh_token = request.data["refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"message": "Logged out successfully"})
    except Exception:
        return Response({"error": "Invalid token"}, status=400)
    

@api_view(["GET"])
def product_detail(request, public_product_id):
    product = get_object_or_404(
        Product,
        public_product_id=public_product_id,
        is_active=True
    )

    serializer = ProductDetailSerializer(
        product,
        context={"request": request}
    )

    return Response(serializer.data)


@api_view(["POST"])
def apply_offer(request):
    """
    Body:
    {
        "coupon": "FLAT500",
        "cart_total": 600
    }
    """
    serializer = OfferApplySerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    return Response(serializer.validated_data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def sync_cart_wishlist(request):
    user = request.user
    cart_items = CartItem.objects.filter(user=user)
    wishlist_items = Wishlist.objects.filter(user=user)

    cart_serializer = CartItemSerializer(cart_items, many=True, context={"request": request})
    wishlist_serializer = WishlistSerializer(wishlist_items, many=True, context={"request": request})

    return Response({
        "cart": cart_serializer.data,
        "wishlist": wishlist_serializer.data
    })

@api_view(["POST", "PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def manage_cart(request):
    user = request.user

    if request.method == "POST":
        # Add to cart
        serializer = AddToCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product_id = serializer.validated_data["product_id"]
        quantity = serializer.validated_data["quantity"]

        try:
            product = Product.objects.get(public_product_id=product_id, is_active=True)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=404)

        cart_item, created = CartItem.objects.get_or_create(
            user=user,
            product=product,
            defaults={"quantity": quantity}
        )
        if not created:
            cart_item.quantity += quantity
            cart_item.save()

        return Response({"message": "Item added to cart", "quantity": cart_item.quantity})

    elif request.method == "PATCH":
        # Update cart item quantity
        serializer = UpdateCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product_id = serializer.validated_data["product_id"]
        quantity = serializer.validated_data["quantity"]

        try:
            product = Product.objects.get(public_product_id=product_id, is_active=True)
            cart_item = CartItem.objects.get(user=user, product=product)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=404)
        except CartItem.DoesNotExist:
            return Response({"error": "Item not in cart"}, status=404)

        cart_item.quantity = quantity
        cart_item.save()

        return Response({"message": "Cart item updated", "quantity": cart_item.quantity})

    elif request.method == "DELETE":
        # Remove item from cart
        serializer = RemoveFromCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product_id = serializer.validated_data["product_id"]

        try:
            product = Product.objects.get(public_product_id=product_id, is_active=True)
            cart_item = CartItem.objects.get(user=user, product=product)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=404)
        except CartItem.DoesNotExist:
            return Response({"error": "Item not in cart"}, status=404)

        cart_item.delete()
        return Response({"message": "Item removed from cart"})

@api_view(["POST", "DELETE"])
@permission_classes([IsAuthenticated])
def manage_wishlist(request):
    user = request.user

    if request.method == "POST":
        # Add to wishlist
        serializer = AddToWishlistSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product_id = serializer.validated_data["product_id"]

        try:
            product = Product.objects.get(public_product_id=product_id, is_active=True)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=404)

        wishlist_item, created = Wishlist.objects.get_or_create(
            user=user,
            product=product
        )
        if created:
            return Response({"message": "Item added to wishlist"})
        else:
            return Response({"message": "Item already in wishlist"})

    elif request.method == "DELETE":
        # Remove from wishlist
        serializer = RemoveFromWishlistSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product_id = serializer.validated_data["product_id"]

        try:
            product = Product.objects.get(public_product_id=product_id, is_active=True)
            wishlist_item = Wishlist.objects.get(user=user, product=product)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=404)
        except Wishlist.DoesNotExist:
            return Response({"error": "Item not in wishlist"}, status=404)

        wishlist_item.delete()
        return Response({"message": "Item removed from wishlist"})

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def transfer_to_cart(request):
    """
    Transfer item from wishlist to cart
    Body: {"product_id": "PRD-...", "quantity": 1}
    """
    user = request.user
    serializer = AddToCartSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    product_id = serializer.validated_data["product_id"]
    quantity = serializer.validated_data["quantity"]

    try:
        product = Product.objects.get(public_product_id=product_id, is_active=True)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=404)

    # Check if item is in wishlist
    try:
        wishlist_item = Wishlist.objects.get(user=user, product=product)
    except Wishlist.DoesNotExist:
        return Response({"error": "Item not in wishlist"}, status=404)

    # Add to cart
    cart_item, created = CartItem.objects.get_or_create(
        user=user,
        product=product,
        defaults={"quantity": quantity}
    )
    if not created:
        cart_item.quantity += quantity
        cart_item.save()

    # Remove from wishlist
    wishlist_item.delete()

    return Response({"message": "Item transferred from wishlist to cart", "cart_quantity": cart_item.quantity})

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_orders(request):
    """
    Fetch all orders for the authenticated user
    """
    user = request.user
    orders = Order.objects.filter(user=user).order_by("-created_at")
    serializer = OrderSerializer(orders, many=True, context={"request": request})
    return Response({
        "count": orders.count(),
        "orders": serializer.data
    })

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def transfer_to_wishlist(request):
    """
    Transfer item from cart to wishlist
    Body: {"product_id": "PRD-...", "quantity": 1}
    """
    user = request.user
    serializer = TransferToWishlistSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    product_id = serializer.validated_data["product_id"]
    quantity = serializer.validated_data["quantity"]

    try:
        product = Product.objects.get(public_product_id=product_id, is_active=True)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=404)

    # Check if item is in cart
    try:
        cart_item = CartItem.objects.get(user=user, product=product)
    except CartItem.DoesNotExist:
        return Response({"error": "Item not in cart"}, status=404)

    # Add to wishlist
    wishlist_item, created = Wishlist.objects.get_or_create(
        user=user,
        product=product
    )
    if created:
        # Remove from cart
        cart_item.delete()
        return Response({"message": "Item transferred from cart to wishlist"})
    else:
        return Response({"message": "Item already in wishlist"})
