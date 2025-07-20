from django.contrib import admin
from django.contrib.auth import get_user_model
from .models import HourRecord, Event, Assignment,Mentor
User = get_user_model()
# Register your models here.
admin.site.register(User)
admin.site.register(HourRecord)
admin.site.register(Mentor)
admin.site.register(Event)
admin.site.register(Assignment)