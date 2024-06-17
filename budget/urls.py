from django.urls import path
from . import views

app_name = "budget"

urlpatterns = [
    path("", views.index, name="index"),
    path("createAccount/", views.createAccount, name="createAccount"),
    path("logout/", views.logout_view, name="logout"),
    path("home/", views.home, name="home"),
    path("monthSelector/", views.monthSelector, name="monthSelector"),
    path("addExpense/", views.addExpense, name="addExpense"),
    path("deleteExpense/<int:expense_id>", views.deleteExpense, name="deleteExpense"),
    path("editExpense/<int:expense_id>", views.editExpense, name="editExpense"),
    path("goal/", views.goal, name="goal"),
    path("createGoal/", views.createGoal, name="createGoal"),
    path("updateGoal/", views.updateGoal, name="updateGoal"),
    path("deleteGoal/", views.deleteGoal, name="deleteGoal"),
]
