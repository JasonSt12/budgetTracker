# Generated by Django 5.0.1 on 2024-05-10 20:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('budget', '0003_goal'),
    ]

    operations = [
        migrations.RenameField(
            model_name='expense',
            old_name='date_creaeted',
            new_name='date_created',
        ),
    ]
