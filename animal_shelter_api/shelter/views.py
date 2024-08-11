from rest_framework import viewsets, status, generics
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import CustomUser, Animal, Adoption
from .permissions import (
    IsAdopter,
    IsAdminOrReadOnly,
    IsVolunteerOrAdmin,
    IsAdminOrReadOnlyVolunteer,
)
from .serializers import (
    CustomUserSerializer,
    AnimalSerializer,
    AdoptionSerializer,
    RegisterSerializer,
)


class VolunteerViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.filter(user_type=CustomUser.VOLUNTEER)
    serializer_class = CustomUserSerializer
    permission_classes = [IsAdminUser]


class AdopterViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.filter(user_type=CustomUser.ADOPTER)
    serializer_class = CustomUserSerializer
    permission_classes = [IsAdminOrReadOnlyVolunteer]


class AnimalViewSet(viewsets.ModelViewSet):
    queryset = Animal.objects.all()
    serializer_class = AnimalSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = ["status"]

    @action(detail=True, methods=["post"], permission_classes=[IsAdopter])
    def request_adoption(self, request, pk=None):
        animal = self.get_object()
        if animal.status == Animal.AWAITING:
            Adoption.objects.create(animal=animal, adopter=request.user)
            animal.status = Animal.PENDING
            animal.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class AdoptionViewSet(viewsets.ModelViewSet):
    queryset = Adoption.objects.all()
    serializer_class = AdoptionSerializer
    permission_classes = [IsAdminOrReadOnlyVolunteer]

    @action(
        detail=True,
        methods=["patch"],
        url_path="status",
        permission_classes=[IsVolunteerOrAdmin],
    )
    def update_status(self, request, pk=None):
        adoption = self.get_object()
        new_status = request.data.get("status")
        adoption.status = new_status
        adoption.volunteer = request.user
        adoption.save()
        adoption.animal.status = new_status
        adoption.animal.save()
        return Response(status=status.HTTP_200_OK)


class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class LogoutView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.COOKIES.get("refresh_token")
            token = RefreshToken(refresh_token)
            token.blacklist()
            response = Response(status=status.HTTP_205_RESET_CONTENT)
            response.delete_cookie("refresh_token")
            return response
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)
