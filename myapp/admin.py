from django.contrib import admin
from myapp.models import *

# Register your models here.
class identity_informationsAdmin(admin.ModelAdmin):
    list_display = ('id', 'first_name', 'last_name', 'sexe', 'date_of_birth', 'addresses', 'city', 'date_depot', 'date_expirated', 'current_step')

admin.site.register(identity_informations, identity_informationsAdmin)
