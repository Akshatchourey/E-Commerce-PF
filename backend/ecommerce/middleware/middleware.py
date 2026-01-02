from django.http import JsonResponse
from django.conf import settings

class RoleMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        path = request.path
        public = getattr(settings, "PUBLIC_PATHS", [])
        for p in public:
            if path.startswith(p):
                return self.get_response(request)
        rules = getattr(settings, "ROLE_ACCESS_RULES", {})
        for prefix, roles in rules.items():
            if path.startswith(prefix):
                if not request.user.is_authenticated:
                    return JsonResponse({"error": "Unauthorized"}, status=401)
                if getattr(request.user, "role", None) not in roles:
                    return JsonResponse({"error": "Forbidden"}, status=403)
                break

        response = self.get_response(request)
        return response
