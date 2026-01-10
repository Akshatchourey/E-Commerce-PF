from django.urls import path
from .import views

urlpatterns = [
    path('', views.home, name='home'),
    path('seller_dashboard/', views.seller_dashboard, name='seller_dashboard'),
    path('api/products/', views.product_list, name='product_list'),
    path('api/register/', views.register),
    path('api/login/', views.login),
    path('api/logout/', views.logout),
    path(
        "api/products/<str:public_product_id>/",
        views.product_detail,
        name="product_detail"
    ),
    path("api/apply-offer/", views.apply_offer, name="apply_offer"),

    path('api/sync-cart-wishlist/', views.sync_cart_wishlist, name='sync_cart_wishlist'),
    path('api/cart/', views.manage_cart, name='manage_cart'),
    path('api/wishlist/', views.manage_wishlist, name='manage_wishlist'),
    path('api/transfer-to-cart/', views.transfer_to_cart, name='transfer_to_cart'),

]
