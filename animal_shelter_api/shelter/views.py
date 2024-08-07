from rest_framework import viewsets
from .models import CustomUser, Animal, Adoption
from .serializers import (
    VolunteerSerializer,
    AdopterSerializer,
    AnimalSerializer,
    AdoptionSerializer,
)


class VolunteerViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.filter(user_type="volunteer")
    serializer_class = VolunteerSerializer


class AdopterViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.filter(user_type="adopter")
    serializer_class = AdopterSerializer


class AnimalViewSet(viewsets.ModelViewSet):
    queryset = Animal.objects.all()
    serializer_class = AnimalSerializer


class AdoptionViewSet(viewsets.ModelViewSet):
    queryset = Adoption.objects.all()
    serializer_class = AdoptionSerializer
