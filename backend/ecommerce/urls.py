from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .import views
from .views import ContactMessageCreateView
from .import views_payment as views2

urlpatterns = [
    path('', views.home, name='home'),
    path('seller_dashboard/', views.seller_dashboard, name='seller_dashboard'),
    path('api/products/', views.product_list, name='product_list'),
    path('api/register/', views.register),
    path('api/login/', views.login),
    path('api/logout/', views.logout),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("api/product/<str:public_product_id>/",views.product_detail,name="product_detail"),
    path("api/apply-offer/", views.apply_offer, name="apply_offer"),

    path('api/sync-cart-wishlist/', views.sync_cart_wishlist, name='sync_cart_wishlist'),
    path('api/cart/', views.manage_cart, name='manage_cart'),
    path('api/wishlist/', views.manage_wishlist, name='manage_wishlist'),
    path('api/transfer-to-cart/', views.transfer_to_cart, name='transfer_to_cart'),
    path('api/user-orders/', views.user_orders, name='user_orders'),
    path('api/transfer-to-wishlist/', views.transfer_to_wishlist, name='transfer_to_wishlist'),

    # Razorpay payment urls
    path('api/create-order/', views2.CreateRazorpayOrderView.as_view(), name='create-razorpay-order'),
    path('api/verify-payment/', views2.VerifyRazorpayPaymentView.as_view(), name='verify-razorpay-payment'),
    path('webhook/razorpay/', views2.RazorpayWebhookView.as_view(), name='razorpay-webhook'),
    # Contact us urls
    path("api/contact/", ContactMessageCreateView.as_view(), name="contact-create"),

]
