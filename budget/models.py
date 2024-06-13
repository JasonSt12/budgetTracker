from django.db import models
from django.contrib.auth.models import User

# Create your models here.
# class Goal(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     goal = models.JSONField()
#     timeSpan = models.IntegerField(default=1) # goal timespan in months
#     startDate = models.DateTimeField() # start month
#     finishDate = models.DateTimeField() # end Month
#     yearly_income = models.FloatField()


class Expense(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    value = models.FloatField()
    category = models.CharField(max_length=30)
    description = models.CharField(max_length=100)
    month_created = models.CharField()
    date_created = models.DateTimeField(auto_now_add=True)


class Goal(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    goal = models.JSONField()
    monthly_budget = models.FloatField()
    date_created = models.DateField(auto_now_add=True)
    activeFor = models.CharField()
    goal_name = models.CharField()
