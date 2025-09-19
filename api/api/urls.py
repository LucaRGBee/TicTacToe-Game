"""URL configuration for aaa project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/

Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')

Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')

Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))

"""

from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from game.views import CreateGameView, CreateUserView, GetGameView, JoinGameView, GetGamesView, GetGamesUserView, GetUserView, GetUsersView, CreateNextGameView, MakeTurnView

urlpatterns = [
    path("api/admin/", admin.site.urls),
    path("api/api-auth/", include("rest_framework.urls")),
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh_token"),
    
    path("api/user/register/", CreateUserView.as_view(), name="register"),
    path("api/user/get/", GetUsersView.as_view(), name="get_user"),
    path("api/user/get/<int:id>/", GetUserView.as_view(), name="get_user"),
    
    path("api/game/create/", CreateGameView.as_view(), name="create_game"),
    path("api/game/next/", CreateNextGameView.as_view(), name="next_game"),
    path("api/game/join/", JoinGameView.as_view(), name="join_game"),
    
    path("api/game/get/", GetGamesView.as_view(), name="get_games"),
    path("api/game/get/user/<int:id>/", GetGamesUserView.as_view(), name="get_games_from_user"),
    path("api/game/get/<int:id>/", GetGameView.as_view(), name="get_game"),
    
    path("api/game/make-turn/", MakeTurnView.as_view(), name="make_turn"),

    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    # Optional UI:
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]

"""
    {
        "id": 4,
        "password": "test",
        "x": "y",
        "y": "x"
    }
"""
