from django.db import models
import uuid
from django.core.exceptions import ValidationError

def validate_uuid(value):
    try:
        uuid.UUID(str(value))
    except ValueError:
        raise ValidationError("Badly formed hexadecimal UUID string")

class identity_informations(models.Model):
    temp_id = models.UUIDField(default=uuid.uuid4, editable=False)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, validators=[validate_uuid])
    first_name = models.CharField(max_length=99, blank=True)
    last_name = models.CharField(max_length=99, blank=True)
    sexe_choice = [
        ("MA", "Men"),
        ("FE", "women"),
    ]
    sexe = models.CharField(max_length=2, choices=sexe_choice, blank=True)
    date_of_birth = models.DateField(blank=True)           
    addresses = models.CharField(max_length=99, blank=True)
    city = models.CharField(max_length=99, blank=True)
    date_depot = models.DateField(blank=True)  
    date_expirated = models.DateField(blank=True)
    current_step = models.PositiveIntegerField(default=1)
    confidentiality = models.BooleanField(default=False)
    image_recto = models.ImageField(upload_to='images/', null=True, blank=True)
    image_verso = models.ImageField(upload_to='images/', null=True, blank=True)
