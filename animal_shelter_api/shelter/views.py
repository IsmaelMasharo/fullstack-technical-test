from rest_framework import viewsets, status, generics
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import BasePermission, AllowAny, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import update_last_login
from .models import CustomUser, Animal, Adoption
from .serializers import (
    VolunteerSerializer,
    AdopterSerializer,
    AnimalSerializer,
    AdoptionSerializer,
    RegisterSerializer,
)


class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and (request.user.is_superuser or request.user.user_type == "administrador")
        )


class IsVolunteerOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        print(request.user)
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
        print(animal, manager, status, adoption)
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
