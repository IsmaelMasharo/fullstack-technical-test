from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    VolunteerViewSet,
    AdopterViewSet,
    AnimalViewSet,
    AdoptionViewSet,
    RegisterView,
    CookieTokenRefreshView,
    CookieTokenObtainPairView,
)

router = DefaultRouter()
router.register(r"volunteers", VolunteerViewSet, basename="volunteer")
router.register(r"adopters", AdopterViewSet, basename="adopter")
router.register(r"animals", AnimalViewSet)
router.register(r"adoptions", AdoptionViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("register/", RegisterView.as_view(), name="register"),
    path("auth/token/", CookieTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/token/refresh/", CookieTokenRefreshView.as_view(), name="token_refresh"),
]
