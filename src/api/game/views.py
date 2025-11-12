from drf_spectacular.utils import extend_schema
from django.shortcuts import get_object_or_404, render
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import (
    UserSerializer,
    GameSerializer,
    PasswordSerializer,
    JoinSerializer,
    TurnSerializer,
    ResponseSerializer,
    NextSerializer,
)
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Game


# Create your views here.
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class CreateGameView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=PasswordSerializer,
        responses={201: GameSerializer},
        description="Create a new game. Optionally provide a password.",
    )
    def post(self, request, *args, **kwargs):
        serializer = GameSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(playerOne=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class CreateNextGameView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=NextSerializer,
        responses={201: GameSerializer},
        description="Create a new game. Optionally provide a password.",
    )
    def post(self, request, *args, **kwargs):
        pre = get_object_or_404(Game, id=self.request.data.get("id"))
        if pre.playerOne != self.request.user and pre.playerTwo != self.request.user:
            return Response({"error": "you must be part of a game"}, status=400)
        if not pre.ended:
            return Response(
                {"error": "you cannot start upon a running game"}, status=400
            )

        if pre.next:
            return Response(
                {"error": "this game already has a next one started"}, status=400
            )

        serializer = GameSerializer(data=request.data)
        if serializer.is_valid():
            pre.next = serializer.save(playerOne=request.user, previous=pre)

            pre.save()

            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class GetGameView(generics.RetrieveAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    permission_classes = [AllowAny]
    lookup_field = "id"


class GetUserByIdView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    lookup_field = "id"


class GetUserByNameView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    lookup_field = "username"


class GetGamesView(generics.ListAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    permission_classes = [AllowAny]


class GetUsersView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class GetGamesUserView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = GameSerializer

    def get_queryset(self):
        user = get_object_or_404(User, id=self.kwargs["id"])

        games1 = Game.objects.filter(playerOne=user)
        games2 = Game.objects.filter(playerTwo=user)

        queryset = games1.union(games2)
        return queryset


class JoinGameView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=JoinSerializer,  # <-- tell Swagger the request body
        responses={201: GameSerializer},
        description="Create a new game. Optionally provide a password.",
    )
    
    def post(self, request, *args, **kwargs):
        gid = self.request.data.get("id")

        if not isinstance(gid, int):
            return Response({"error": "invalid ID"}, status=400)

        game = get_object_or_404(Game, id=gid)

        if game.ended:
            return Response(
                {"error": "this game has ended use /game/get/<id> instead"}, status=400
            )
            
        if game.playerTwo != None:
            return Response(
                {"error": "this game already has 2 players participating"}
            )

        if game.password != self.request.data.get("password"):
            return Response({"error": "invalid password"}, status=400)

        p = self.request.user

        if p == game.playerOne:
            return Response({"error": "cannot join the same game twice"}, status=400)

        game.playerTwo = p
        game.save()

        seriealizer = GameSerializer(game)
        return Response(seriealizer.data)


class MakeTurnView(APIView):
    permission_classes = [IsAuthenticated]

    def checkGame(self, board, turn):
        for y in range(3):
            if (
                abs(sum(board[y])) == 3
                or abs(sum(board[x][y] for x in range(3))) == 3
                or abs(sum(board[i][i] for i in range(3))) == 3
                or abs(sum(board[i][2 - i] for i in range(3))) == 3
            ):
                return 1

        if turn >= 9:
            return -1

        return 0

    @extend_schema(
        request=TurnSerializer,
        responses={201: ResponseSerializer},
        description="Make a turn in the game",
    )
    def post(self, request, *args, **kwargs):
        serializer = TurnSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        gid = serializer.validated_data["id"]
        x = serializer.validated_data["x"]
        y = serializer.validated_data["y"]

        game = get_object_or_404(Game, id=gid)
        user = request.user

        if game.ended:
            return Response({"error": "this game has already ended"}, status=400)

        if (game.playerOne != user) and (game.playerTwo != user):
            return Response({"error": "you are not part of this game"}, status=403)

        player_number = 1 if game.playerOne == user else 2

        if (game.turn % 2) + 1 == player_number:
            return Response({"error": "it is not your turn"}, status=400)

        if game.board[y][x] != 0:
            return Response(
                {"error": "the position you chose was already taken"}, status=400
            )

        game.board[y][x] = 1 if game.turn % 2 == 1 else -1
        check = self.checkGame(game.board, game.turn)

        if check == 0:
            game.turn += 1
        else:
            game.ended = True
            if check == -1:
                game.winner = 0
            else:
                game.winner = 1 if game.turn % 2 == 1 else -1

        game.save()

        response_data = {"status": check, "board": game.board}
        return Response(ResponseSerializer(response_data).data, status=201)

def home(request):
    return render(request, "home.html")