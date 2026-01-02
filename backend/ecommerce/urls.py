from django.urls import path, include
from .views import home

urlpatterns = [
    path('', home, name='home'),
    path('auth/', include('ecommerce.auth.urls')),
]
