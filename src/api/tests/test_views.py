from rest_framework.test import APIClient
from game.models import Game, User

import pytest
    
@pytest.fixture
def api_client():
    return APIClient()

def test_home(api_client):
    response = api_client.get("")
    assert response.status_code == 200
    assert "Welcome to the TicTacToe-Api" in response.text
    
def test_docs(api_client):
    response = api_client.get("/docs/")
    assert response.status_code == 200

def test_games(api_client, db):
    Game.objects.create()
    User.objects.create(username="testuser")

    response = api_client.get("/game/")
    assert response.status_code == 200
    
    response = api_client.get("/game/2/")
    assert response.status_code == 404

    response = api_client.get("/game/1/")
    assert response.status_code == 200
    
    response = api_client.get("/game/by-user/2/")
    assert response.status_code == 404
    
    response = api_client.get("/game/by-user/1/")
    assert response.status_code == 200

def test_user(api_client, db):
    User.objects.create(username="testuser")
    response = api_client.get("/user/")
    assert response.status_code == 200
    
    response = api_client.get("/user/2/")
    assert response.status_code == 404

    response = api_client.get("/user/1/")
    assert response.status_code == 200
    
    response = api_client.get("/user/asdasdadasd/")
    assert response.status_code == 404

    response = api_client.get("/user/testuser/")
    assert response.status_code == 200
    
    payload = {
        "username": "testUser2",
        "password": "password",
    }
    response = api_client.post("/user/register/", data=payload, format="json")
    assert response.status_code == 201
    
    response = api_client.get("/user/2/")
    assert response.status_code == 200
    
    response = api_client.get("/user/testUser2/")
    assert response.status_code == 200

@pytest.fixture
def test_authentication(api_client, db):
    response = api_client.get("/admin/login/")
    assert response.status_code == 200
    
    response = api_client.get("/api-auth/login/")
    assert response.status_code == 200
    
    user = User.objects.create_user(username="testUser", password="testPassword")
    
    payload = {
        "username": "testUser",
        "password": "testPassword"
    }
    response = api_client.post("/token/", data=payload, format="json")
    assert response.status_code == 200
    token = response.data["refresh"]
    
    response = api_client.post("/token/refresh/", data={"refresh":token})
    assert response.status_code == 200
    token = response.data["access"]
    
    return token, user
    
def test_create_and_next_game(api_client, test_authentication, db):
    response = api_client.post("/game/create/")
    assert response.status_code == 401

    response = api_client.post("/game/next/")
    assert response.status_code == 401

    token, _ = test_authentication
    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    
    response = api_client.post("/game/create/")
    assert response.status_code == 201
    
    response = api_client.post("/game/create/", data={"password": {"test": "test"}}, format="json")
    assert response.status_code == 400
    
    response = api_client.post("/game/next/", data={"id": 2}, format="json")
    assert response.status_code == 404

    game2 = Game.objects.create()
    response = api_client.post("/game/next/", data={"id": 2}, format="json")
    assert response.status_code == 400
    
    response = api_client.post("/game/next/", data={"id": 1}, format="json")
    assert response.status_code == 400
    
    game = Game.objects.get(id=1)
    _ = str(game)
    game.ended = True
    game.next = game2
    
    game.save()
    
    response = api_client.post("/game/next/", data={"id": 1}, format="json")
    assert response.status_code == 400
    
    game.next = None
    game.save()
    
    response = api_client.post("/game/next/", data={"id": 1, "password": {2,"asdasd"}}, format="json")
    assert response.status_code == 400
    
    response = api_client.post("/game/next/", data={"id": 1}, format="json")
    assert response.status_code == 201
    
def test_join_game(api_client, test_authentication, db):
    response = api_client.post("/game/join/")
    assert response.status_code == 401
    
    token, user = test_authentication
    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    
    response = api_client.post("/game/join/", data={"id": "hello"})
    assert response.status_code == 400

    response = api_client.post("/game/join/", data={"id": 1}, format="json")
    assert response.status_code == 404
    
    Game.objects.create(ended=True)
    
    response = api_client.post("/game/join/", data={"id": 1}, format="json")
    assert response.status_code == 400
    
    Game.objects.create(playerTwo=user)
    
    response = api_client.post("/game/join/", data={"id": 2}, format="json")
    assert response.status_code == 400
    
    Game.objects.create(playerOne=user)
    
    response = api_client.post("/game/join/", data={"id": 3}, format="json")
    assert response.status_code == 400
    
    Game.objects.create(password="password")
    
    response = api_client.post("/game/join/", data={"id": 4, "password": "kasdhjaksdjhaskdjh"}, format="json")
    assert response.status_code == 400
    
    response = api_client.post("/game/join/", data={"id": 4, "password": "password"}, format="json")
    assert response.status_code == 200

def test_make_turn(api_client, test_authentication, db):
    response = api_client.post("/game/make-turn/")
    assert response.status_code == 401
    
    token, user = test_authentication
    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    
    response = api_client.post("/game/make-turn/")
    assert response.status_code == 400
    
    response = api_client.post("/game/make-turn/", data={"id": 1, "x": 0, "y": 0}, format="json")
    assert response.status_code == 404
    
    Game.objects.create(ended=True)
    
    response = api_client.post("/game/make-turn/", data={"id": 1, "x": 0, "y": 0}, format="json")
    assert response.status_code == 400
    
    Game.objects.create()
    
    response = api_client.post("/game/make-turn/", data={"id": 2, "x": 0, "y": 0}, format="json")
    assert response.status_code == 403
    
    Game.objects.create(playerTwo=user)
    
    response = api_client.post("/game/make-turn/", data={"id": 3, "x": 0, "y": 0}, format="json")
    assert response.status_code == 400
    
    Game.objects.create(playerOne=user, board=[[1, 0, 0], [0, 0, 0], [0, 0, 0]])
    
    response = api_client.post("/game/make-turn/", data={"id": 4, "x": 0, "y": 0}, format="json")
    assert response.status_code == 400
    
    response = api_client.post("/game/make-turn/", data={"id": 4, "x": 1, "y": 0}, format="json")
    assert response.status_code == 201
    
    Game.objects.create(playerOne=user, board=[[1, 0, 1], [0, 0, 0], [0, 0, 0]])
    
    response = api_client.post("/game/make-turn/", data={"id": 5, "x": 1, "y": 0}, format="json")
    assert response.status_code == 201
    
    Game.objects.create(playerOne=user, board=[[0, 0, 0], [0, 0, 0], [0, 0, 0]], turn=9)
    
    response = api_client.post("/game/make-turn/", data={"id": 6, "x": 1, "y": 0}, format="json")
    print(response.data)
    assert response.status_code == 201