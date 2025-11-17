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
from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
)
from game.views import (
    CreateGameView,
    CreateUserView,
    GetGameView,
    JoinGameView,
    GetGamesView,
    GetGamesUserView,
    GetUserByIdView,
    GetUserByNameView,
    GetUsersView,
    CreateNextGameView,
    MakeTurnView,
    home,
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api-auth/", include("rest_framework.urls")),
    path("token/", TokenObtainPairView.as_view(), name="get_token"),
    path("token/refresh/", TokenRefreshView.as_view(), name="refresh_token"),
    path("user/register/", CreateUserView.as_view(), name="register"),
    path("user/", GetUsersView.as_view(), name="get_users"),
    path("user/<int:id>/", GetUserByIdView.as_view(), name="get_user_by_id"),
    path("user/<str:username>/", GetUserByNameView.as_view(), name="get_user_by_name"),
    path("game/create/", CreateGameView.as_view(), name="create_game"),
    path("game/next/", CreateNextGameView.as_view(), name="next_game"),
    path("game/join/", JoinGameView.as_view(), name="join_game"),
    path("game/", GetGamesView.as_view(), name="get_games"),
    path(
        "game/by-user/<int:id>/",
        GetGamesUserView.as_view(),
        name="get_games_from_user",
    ),
    path("game/make-turn/", MakeTurnView.as_view(), name="make_turn"),
    path("docs/download/", SpectacularAPIView.as_view(), name="schema"),

    path("game/<int:id>/", GetGameView.as_view(), name="get_game"),    
    path(
        "docs/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="docs",
    ),
    path("", home, name="home"),
]
