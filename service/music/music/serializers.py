from music.models import Song

__author__ = 'rain'

from rest_framework import serializers


class SongSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Song
        fields = ('id', 'title', 'author', 'link')
