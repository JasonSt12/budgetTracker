from django.shortcuts import render, redirect
from django.http import HttpResponse
from budget.models import Expense, Goal
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from datetime import datetime
from dateutil.relativedelta import relativedelta
from budget.forms import LoginForm, CreateAccountForm

# Create your views here.

def index(request):
    
    if request.user.is_authenticated:
        return redirect('budget:home', permanent=True)
    
    context = dict()
    error = ''
    if request.method == 'POST':
        form = LoginForm(request.POST)

        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)

            if user is not None:
                login(request, user)
                return redirect('budget:home', permanent=True)
            else:
                error = 'username and password do not match'
        else:
            error = 'Invalid form data'


    context['error'] = error
    return render(request, 'budget/index.html', context)

def createAccount(request):

    context = dict()
    error = ''

    if request.method == 'POST':
        form = CreateAccountForm(request.POST)

        if form.is_valid():

            username = form.cleaned_data['username']
            pwd = form.cleaned_data['password']
            confirm_pwd = form.cleaned_data['confirm_password']

            if User.objects.filter(username=username):
                error = 'Username Is Taken'
            elif pwd != confirm_pwd:
                error = 'Passwords Do Not Match'
            else:
                user = User.objects.create_user(username=username, password=pwd)
                login(request, user)

                return redirect('budget:home', permanent=True)
        else:
            error = 'Invalid form data'

    context['error'] = error
    return render(request, 'budget/createAccount.html', context)

def logout_view(request):
    logout(request)
    return redirect('budget:index')

@login_required
def home(request):

    expenses = Expense.objects.all()
    goal = Goal.objects.get(pk=1)
    categories = set()

    time_period_budget = goal.yearly_income / (12 / goal.timeSpan)
    goal_json = goal.goal

    category_data = dict()
    for i in goal_json:
        category_data[i] = [round(int(goal_json[i]) / 100 * time_period_budget, 2)]

    spent_per_category = dict()
    for exp in expenses:
        categories.add(exp.category)
        spent_per_category[exp.category] = spent_per_category.get(exp.category, 0) + exp.value
    
    for i in spent_per_category:
        category_data[i].append(spent_per_category[i])
        category_data[i].append(round(category_data[i][0] - category_data[i][1], 2))
        category_data[i].append(round(category_data[i][1] / category_data[i][0] * 100, 2))

    # category data
    # category_data[i][0] == total budget for category
    # category_data[i][1] == spent per category
    # category_data[i][2] == Remaining per category
    # category_data[i][3] == percent spent
    context = { 
        "expenses" : expenses,
        "categories": categories,
        "category_data": category_data
    }

    return render(request, 'budget/home.html', context)


