from django.contrib.auth.models import AbstractUser, Group, Permission
from django.contrib.auth.base_user import BaseUserManager
from django.db import models
from django.utils import timezone
import string
import random

from django.utils.translation import gettext_lazy as _

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password, group="Student" , **extra_fields):
        if not email:
            raise ValueError(_("The Email must be set"))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError(_("Superuser must have is_staff=True."))
        if extra_fields.get("is_superuser") is not True:
            raise ValueError(_("Superuser must have is_superuser=True."))
        return self.create_user(email, password, group="Admin",**extra_fields)

class CustomUser(AbstractUser):
    email = models.EmailField(_("email address"), unique=True)
    date_joined = models.DateTimeField(default=timezone.now)
    age=models.CharField(max_length=2, default=0)
    userType=models.CharField(max_length=200, default="Student")
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email


    
class HourRecord(models.Model):
    user_id = models.CharField(max_length=5000,null=True)
    hours = models.IntegerField()
    work_description = models.CharField(max_length=500)
    Organizer_Email = models.EmailField(_("email address"), null=True,default="email@gmail.com")
    approved = models.BooleanField(default=False)
    denied = models.BooleanField(default=False)
    date = models.CharField(max_length=5000)

    def __str__(self):
        return f"{self.id} {self.user_id} {self.date}"
        
class Organization(models.Model):
    user_id = models.CharField(max_length=5000)
    Organization_Name = models.CharField(max_length=500)
    Organization_Email = models.EmailField(_("email address"))
    Organization_Description = models.CharField(max_length=500)

    def __str__(self):
        return self.Organization_Name


from django.contrib.auth import get_user_model

User = get_user_model()

class Event(models.Model):
    
    user_id = models.CharField(max_length=5000)
    Event_Name = models.CharField(max_length=500)
    Event_Description = models.CharField(max_length=2000)
    Event_Location = models.CharField(max_length=2000)
    Event_Time = models.CharField(max_length=2000)
    Meet_Code = models.CharField(max_length=10)
    participants = models.ManyToManyField(CustomUser, related_name='events_participated', blank=True)

    def __str__(self):
        return self.Event_Name


class Mentor(models.Model):
    user_id = models.CharField(max_length=500, unique=True)
    name = models.CharField(max_length=500)
    address = models.CharField(max_length=500)
    studyField = models.CharField(max_length=200)
    Experience = models.CharField(max_length=1000)


    def __str__(self):
        return self.user_id + self.name



class Assignment(models.Model):
    event_id = models.CharField(max_length=500, unique=True)
    assignment_name = models.CharField(max_length=500)
    assignment_description = models.CharField(max_length=500)
    assignment_due_date = models.CharField(max_length=20)
    assignment_submission_link = models.CharField(max_length=1000)


    def __str__(self):
        return self.event_id + "-" + self.assignment_name