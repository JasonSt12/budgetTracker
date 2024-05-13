from django.shortcuts import render
from django.http import HttpResponse
from budget.models import Expense, Goal
from django.contrib.auth.models import User
from datetime import datetime
from dateutil.relativedelta import relativedelta

# Create your views here.

def index(request):
    return render(request, 'budget/index.html')

def createAccount(request):
    return render(request, 'budget/createAccount.html')

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


