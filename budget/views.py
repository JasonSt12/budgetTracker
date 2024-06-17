from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from budget.models import Expense, Goal
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from datetime import datetime, date
from dateutil.relativedelta import relativedelta
from budget.forms import (
    LoginForm,
    CreateAccountForm,
    SelectMonthForm,
    AddExpenseForm,
    CreateGoalForm,
    UpdateGoalForm,
)
import json
from django.core.serializers.json import DjangoJSONEncoder


def index(request):
    if request.user.is_authenticated:
        return redirect("budget:home")

    context = dict()
    error = ""
    if request.method == "POST":
        form = LoginForm(request.POST)

        if form.is_valid():
            username = form.cleaned_data["username"]
            password = form.cleaned_data["password"]
            user = authenticate(request, username=username, password=password)

            if user is not None:
                login(request, user)
                return redirect("budget:home")
            else:
                error = "username and password do not match"
        else:
            error = "Invalid form data"

    context["error"] = error
    return render(request, "budget/index.html", context)


def createAccount(request):

    context = dict()
    error = ""
    if request.method == "POST":
        form = CreateAccountForm(request.POST)

        if form.is_valid():

            username = form.cleaned_data["username"]
            pwd = form.cleaned_data["password"]
            confirm_pwd = form.cleaned_data["confirm_password"]

            if User.objects.filter(username=username):
                error = "Username Is Taken"
            elif pwd != confirm_pwd:
                error = "Passwords Do Not Match"
            else:
                user = User.objects.create_user(username=username, password=pwd)
                login(request, user)
                return redirect("budget:home")
        else:
            error = "Invalid form data"

    context["error"] = error
    return render(request, "budget/createAccount.html", context)


def logout_view(request):
    logout(request)
    return redirect("budget:index")


@login_required
def home(request):

    context = dict()
    if Expense.objects.filter(user=request.user).exists():
        goal = None
        expense_months = set()
        category_data, spent_per_category = dict(), dict()
        total_spent, monthly_budget = 0, 0
        selected_month = getCurrentMonth()
        # makes sure current month will show up in month dropdown even
        # if there are no expenses for the current month
        expense_months.add(selected_month)
        if request.session.get("selected_month"):
            selected_month = request.session.get("selected_month")

        all_expenses = Expense.objects.filter(user=request.user).all()
        current_month_expenses = []

        if Goal.objects.filter(user=request.user, activeFor=selected_month).exists():

            goal = Goal.objects.filter(
                user=request.user, activeFor=selected_month
            ).get()
            monthly_budget = goal.monthly_budget
            for category in goal.goal:
                # total budget for a category
                category_data[category] = [
                    round(int(goal.goal[category]) / 100 * goal.monthly_budget, 2)
                ]

        # stores expenses by their categories in spent_per_category
        for exp in all_expenses:
            if selected_month == exp.month_created:
                spent_per_category[exp.category] = (
                    spent_per_category.get(exp.category, 0) + exp.value
                )
                current_month_expenses.append(exp)
                total_spent += exp.value
            expense_months.add(exp.month_created)

        for category in spent_per_category:
            if goal == None:
                category_data[category] = []
                category_data[category].append("")
                category_data[category].append(spent_per_category[category])
                category_data[category].append("")
                category_data[category].append("")

            if goal != None:
                if category not in category_data:
                    category_data[category] = [-1]

                category_data[category].append(spent_per_category[category])
                # total budget for cat - spent for cat = remaining
                category_data[category].append(
                    round(category_data[category][0] - category_data[category][1], 2)
                )
                # percent of budget for spent for a category
                category_data[category].append(
                    round(
                        category_data[category][1] / category_data[category][0] * 100, 2
                    )
                )

        total_remaining = 0
        if goal != None:
            print("here  ", total_spent)
            total_remaining = round(goal.monthly_budget - total_spent, 2)

        context = {
            "expenses": current_month_expenses,
            "category_data": category_data,
            "monthly_budget": monthly_budget,
            "total_spent": round(total_spent, 2),
            "total_remaining": total_remaining,
            "expense_months": expense_months,
            "selected_month": selected_month,
        }

    return render(request, "budget/home.html", context)


@login_required
def monthSelector(request):

    if request.method == "GET":
        form = SelectMonthForm(request.GET)
    if form.is_valid():
        request.session["selected_month"] = form.cleaned_data["selected_month"]
        return redirect("budget:home")
    else:
        print("invalid form: ", form.errors)

    return redirect("budget:home")


@login_required
def addExpense(request):

    selected_month = getCurrentMonth()
    if request.session.get("selected_month"):
        selected_month = request.session.get("selected_month")

    if request.method == "POST":
        form = AddExpenseForm(request.POST)

        if form.is_valid():
            category = form.cleaned_data["category"]
            value = form.cleaned_data["value"]
            description = form.cleaned_data["description"]

            Expense.objects.create(
                user=request.user,
                value=value,
                category=category,
                description=description,
                month_created=selected_month,
            )

        else:
            print("invalid form: ", form.errors)
    return redirect("budget:home")


@login_required
def deleteExpense(request, expense_id):

    if request.method == "POST":
        expense = get_object_or_404(Expense, id=expense_id)
        # request.session['category'] = expense.category
        expense.delete()

        return redirect("budget:home")

    return redirect("budget:home")


@login_required
def editExpense(request, expense_id):

    if request.method == "POST":
        form = AddExpenseForm(request.POST)

        if form.is_valid():
            expense = get_object_or_404(Expense, id=expense_id)
            expense.value = form.cleaned_data["value"]
            expense.description = form.cleaned_data["description"]
            expense.save()
        else:
            print("Invalid form:", form.errors)

        return redirect("budget:home")

    return redirect("budget:home")


@login_required
def goal(request):

    context = dict()

    selected_month = getCurrentMonth()

    if Goal.objects.filter(user=request.user).exists():
        goals = Goal.objects.filter(user=request.user)
        current_goal = ""

        for goal in goals:
            # convert to javascript JSON string format
            goal.goal = json.dumps(goal.goal)
            if goal.activeFor == selected_month:
                current_goal = goal

        context = {
            "goals": goals,
            "current_goal": current_goal,
        }

    return render(request, "budget/goal.html", context)


@login_required
def createGoal(request):

    if request.method == "POST":
        form = CreateGoalForm(request.POST)

        if form.is_valid():
            goal_values = form.cleaned_data["new_goal_values"]
            monthly_budget = form.cleaned_data["monthly_budget"]
            goal_name = form.cleaned_data["goal_name"]
            active_month = form.cleaned_data["active_month"]
            active_year = form.cleaned_data["active_year"]

            activeFor = active_month + " " + str(active_year)

            Goal.objects.create(
                user=request.user,
                goal=goal_values,
                monthly_budget=monthly_budget,
                activeFor=activeFor,
                goal_name=goal_name,
            )
        else:
            print("Invalid form: ", form.errors)

    return redirect("budget:goal")


@login_required
def updateGoal(request):

    if request.method == "POST":
        form = UpdateGoalForm(request.POST)

        if form.is_valid():
            goal_id = form.cleaned_data["goal_id"]
            goal = Goal.objects.get(pk=goal_id)

            goal.goal = form.cleaned_data["goal_values"]
            goal.monthly_budget = form.cleaned_data["monthly_budget"]
            goal.goal_name = form.cleaned_data["goal_name"]
            goal.active_for = form.cleaned_data["active_for"]
            goal.save()

        else:
            print("error: ", form.errors)

    return redirect("budget:goal")


@login_required
def deleteGoal(request):

    if request.method == "POST":
        goal_id = request.POST.get("goal_id")
        Goal.objects.filter(id=goal_id).delete()
    return redirect("budget:goal")


# In the format month 'space' year
# ex. June 2024
def getCurrentMonth():

    months = [
        "January ",
        "February ",
        "March ",
        "April ",
        "May ",
        "June ",
        "July ",
        "August ",
        "September ",
        "October ",
        "November ",
        "December ",
    ]
    selected_month = months[date.today().month - 1] + str(date.today().year)

    return selected_month
