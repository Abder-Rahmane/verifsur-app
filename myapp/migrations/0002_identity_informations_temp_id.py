# Generated by Django 4.2.5 on 2023-10-25 21:34

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='identity_informations',
            name='temp_id',
            field=models.UUIDField(default=uuid.uuid4, editable=False),
        ),
    ]
