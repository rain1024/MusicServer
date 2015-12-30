__author__ = 'rain'


from django.db import models

class Song(models.Model):
    title = models.CharField(max_length=100)
    author = models.CharField(max_length=100)
    link = models.CharField(max_length=100)
