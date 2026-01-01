from django.shortcuts import render, HttpResponse
from django.contrib.auth.models import Group
from .decorators import allowed_users

# Create your views here.
def home(request):
    return HttpResponse("Hi This is home page of our website!!")


# example: page only allowed for seller
@allowed_users(allowed_roles=['seller'])
def seller_dashboard(request):

    return HttpResponse("only seller logged can see this")
