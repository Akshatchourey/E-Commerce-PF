from django.http import HttpResponse
from django.contrib.auth.models import Group

from rest_framework.decorators import api_view
from rest_framework.response import Response

from .decorators import allowed_users
from .models import Product
from .serializers import ProductListSerializer



# Create your views here.
def home(request):

    return HttpResponse("Hi This is home page of our website!!")



@allowed_users(allowed_roles=['seller'])
def seller_dashboard(request):

    return HttpResponse("only seller logged can see this")


@api_view(["GET"])
def product_list(request):
    products = Product.objects.filter(is_active=True).order_by("-created_at")

    serializer = ProductListSerializer(
        products,
        many=True,
        context={"request": request}
    )

    return Response({
        "count": products.count(),
        "products": serializer.data
    })
