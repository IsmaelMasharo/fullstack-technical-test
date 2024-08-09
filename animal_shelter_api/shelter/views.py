from rest_framework import viewsets, status, generics
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.serializers import (
    TokenRefreshSerializer,
    TokenObtainPairSerializer,
)
from django.contrib.auth import get_user_model
from rest_framework.permissions import BasePermission, AllowAny, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import CustomUser, Animal, Adoption
from .serializers import (
    VolunteerSerializer,
    AdopterSerializer,
    AnimalSerializer,
    AdoptionSerializer,
    RegisterSerializer,
)

User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data["user_type"] = self.user.user_type
        return data

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token["usertype"] = user.user_type

        return token


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
        if response.data.get("refresh"):
            cookie_max_age = 3600 * 24 * 14  # 14 days
            response.set_cookie(
                key="refresh_token",
                value=response.data["refresh"],
                max_age=cookie_max_age,
                httponly=True,
                samesite="Lax",
                secure=False,
            )
            del response.data["refresh"]
        return super().finalize_response(request, response, *args, **kwargs)


class CookieTokenRefreshView(TokenRefreshView):
    def finalize_response(self, request, response, *args, **kwargs):
        if response.data.get("refresh"):
            cookie_max_age = 3600 * 24 * 14  # 14 days
            response.set_cookie(
                key="refresh_token",
                value=response.data["refresh"],
                max_age=cookie_max_age,
                httponly=True,
                samesite="Lax",
                secure=False,
            )
            del response.data["refresh"]
        return super().finalize_response(request, response, *args, **kwargs)

    serializer_class = CookieTokenRefreshSerializer


class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and (request.user.is_superuser or request.user.user_type == "administrador")
        )


class IsVolunteerOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.user_type == "volunteer"
        )


class IsVolunteerOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and (
                request.user.is_superuser
                or request.user.user_type == "volunteer"
                or request.user.user_type == "admin"
            )
        )


class IsAdopterOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.user_type == "adopter"
        )


class VolunteerViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.filter(user_type="volunteer")
    serializer_class = VolunteerSerializer
    permission_classes = [IsAdminOrReadOnly]


class AdopterViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.filter(user_type="adopter")
    serializer_class = AdopterSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsVolunteerOrAdmin]


class AnimalViewSet(viewsets.ModelViewSet):
    queryset = Animal.objects.all()
    serializer_class = AnimalSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=["get"], permission_classes=[IsAdopterOrReadOnly])
    def available_for_adoption(self, request):
        animals = Animal.objects.filter(status="awaiting_adoption")
        serializer = self.get_serializer(animals, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["post"], permission_classes=[IsAdopterOrReadOnly])
    def request_adoption(self, request, pk=None):
        animal = self.get_object()
        if animal.status == "awaiting_adoption":
            adoption = Adoption(
                animal=animal,
                adopter=request.user,
                volunteer=None,
                status="pending_adoption",
            )
            adoption.save()

            animal.status = "pending_adoption"
            animal.save()

            return Response(
                {"status": "adoption requested"}, status=status.HTTP_201_CREATED
            )
        return Response(
            {"status": "animal not available for adoption"},
            status=status.HTTP_400_BAD_REQUEST,
        )


class AdoptionViewSet(viewsets.ModelViewSet):
    queryset = Adoption.objects.all()
    serializer_class = AdoptionSerializer
    permission_classes = [IsVolunteerOrAdmin]

    @action(detail=True, methods=["post"])
    def change_status(self, request, pk=None):
        adoption = self.get_object()
        status = request.data.get("status")
        manager = request.user
        animal = adoption.animal
        if status not in ["pending_adoption", "adopted"]:
            return Response(
                {"status": "invalid status"}, status=status.HTTP_400_BAD_REQUEST
            )

        adoption.status = status
        adoption.volunteer = manager
        adoption.save()

        animal.status = status
        animal.save()
        return Response({"status": "adoption updated"})


class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
