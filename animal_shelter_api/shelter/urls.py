from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .authentication import CookieTokenRefreshView, CookieTokenObtainPairView
from .views import (
    VolunteerViewSet,
    AdopterViewSet,
    AnimalViewSet,
    AdoptionViewSet,
    RegisterView,
    LogoutView,
)

router = DefaultRouter()
router.register(r"volunteers", VolunteerViewSet, basename="volunteer")
router.register(r"adopters", AdopterViewSet, basename="adopter")
router.register(r"animals", AnimalViewSet)
router.register(r"adoptions", AdoptionViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("register/", RegisterView.as_view(), name="register"),
    path("auth/logout/", LogoutView.as_view(), name="logout"),
    path("auth/login/", CookieTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/login/refresh/", CookieTokenRefreshView.as_view(), name="token_refresh"),
]
