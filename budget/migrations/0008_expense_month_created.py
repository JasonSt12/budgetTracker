# Generated by Django 5.0.1 on 2024-06-12 19:57

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('budget', '0007_rename_monthly_income_goal_monthly_budget'),
    ]

    operations = [
        migrations.AddField(
            model_name='expense',
            name='month_created',
            field=models.CharField(default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
