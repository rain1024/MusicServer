from music.models import Song
from music.serializers import SongSerializer

__author__ = 'rain'

from rest_framework import viewsets

class SongViewSet(viewsets.ModelViewSet):
    queryset = Song.objects.all()
    serializer_class = SongSerializer
