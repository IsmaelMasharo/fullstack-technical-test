from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import InvalidToken
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView
from rest_framework_simplejwt.serializers import (
    TokenRefreshSerializer,
    TokenObtainPairSerializer,
)


def handle_cookie(response):
    if response.data.get("refresh"):
        cookie_max_age = 3600 * 24 * 14
        response.set_cookie(
            key="refresh_token",
            value=response.data["refresh"],
            max_age=cookie_max_age,
            httponly=True,
            samesite="Lax",
            secure=False,
        )
        del response.data["refresh"]
    return response


User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data["user_type"] = self.user.user_type
        return data


class CookieTokenRefreshSerializer(TokenRefreshSerializer):
    refresh = None

    def validate(self, attrs):
        attrs["refresh"] = self.context["request"].COOKIES.get("refresh_token")
        if attrs["refresh"]:
            data = super().validate(attrs)
            refresh = RefreshToken(attrs["refresh"])
            user_id = refresh["user_id"]
            user = User.objects.get(id=user_id)
            data["user_type"] = user.user_type
            return data
        else:
            raise InvalidToken("No valid token found in cookie 'refresh_token'")


class CookieTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def finalize_response(self, request, response, *args, **kwargs):
        response = handle_cookie(response)
        return super().finalize_response(request, response, *args, **kwargs)


class CookieTokenRefreshView(TokenRefreshView):
    serializer_class = CookieTokenRefreshSerializer

    def finalize_response(self, request, response, *args, **kwargs):
        response = handle_cookie(response)
        return super().finalize_response(request, response, *args, **kwargs)
