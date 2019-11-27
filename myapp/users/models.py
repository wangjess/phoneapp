# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class User(models.Model):
    email = models.CharField(max_length=255)
    codename = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    profilePic = models.ImageField(upload_to='images/', blank=True)
