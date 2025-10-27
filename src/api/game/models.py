from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone


def default_board():
    return [[0, 0, 0], [0, 0, 0], [0, 0, 0]]


class Game(models.Model):
    board = models.JSONField(default=default_board)
    created_at = models.DateTimeField(default=timezone.now)
    password = models.CharField(max_length=50, blank=True, null=True)
    turn = models.IntegerField(default=1)
    ended = models.BooleanField(default=False)
    playerOne = models.ForeignKey(
        User, on_delete=models.SET_NULL, related_name="first", null=True
    )
    playerTwo = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="second", null=True
    )
    previous = models.ForeignKey(
        "self", null=True, on_delete=models.SET_NULL, related_name="previousGame"
    )
    next = models.ForeignKey(
        "self", null=True, on_delete=models.SET_NULL, related_name="nextGame"
    )
    winner = models.IntegerField(null=True, blank=True)

    def __str__(self) -> str:
        return str({"board": self.board, "turn": self.turn, "ended": self.ended})
