from django.http import JsonResponse

def home(request):
    return JsonResponse({"message": "Welcome to the E-Commerce API", "status": "running"})
