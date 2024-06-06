from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from budget.models import Expense, Goal
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from datetime import datetime, date
from dateutil.relativedelta import relativedelta
from budget.forms import LoginForm, CreateAccountForm, SelectMonthForm, AddExpenseForm, CreateGoalForm

def index(request):
    if request.user.is_authenticated:
        return redirect("budget:home")
    
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
                return redirect("budget:home")
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
                Goal.objects.create(user=user, goal_name="Default Goal")
                return redirect("budget:home")
        else:
            error = 'Invalid form data'

    context['error'] = error
    return render(request, 'budget/createAccount.html', context)

def logout_view(request):
    logout(request)
    return redirect('budget:index')

@login_required
def home(request):

    context = dict()
    if Expense.objects.filter(user=request.user).exists():
        expenses = Expense.objects.filter(user=request.user).all()
        goal = None
        expense_months = set()
        category_data, spent_per_category = dict(), dict()
        total_spent, monthly_budget = 0, 0
        months = ["Jan, ", "Feb, ", "Mar, ", "Apr, ", "May, ", "Jun, ", 
                  "Jul, ", "Aug, ", "Sep, ", "Oct, ", "Nov, ", "Dec, "]
        selected_month = months[date.today().month - 1] + str(date.today().year)
        if request.session.get('selected_month'):
            selected_month = request.session.get('selected_month')
    
        if Goal.objects.filter(user=request.user).exists():
            goal = Goal.objects.get(pk=2)
            # goal = Goal.objects.filter(user=request.user).get()
            # monthly_budget = goal.yearly_income / 12
            for i in goal.goal:
                # total budget for a category
                category_data[i] = [round(int(goal.goal[i]) / 100 * goal.monthly_budget, 2)] 

        for exp in expenses:
            if selected_month == months[exp.date_created.month - 1] + str(exp.date_created.year):
                spent_per_category[exp.category] = spent_per_category.get(exp.category, 0) + exp.value
                total_spent += exp.value
            expense_months.add(months[exp.date_created.month - 1] + str(exp.date_created.year))
        
        for i in spent_per_category:
            if goal == None:
                category_data[i] = []
                category_data[i].append('')
                category_data[i].append(spent_per_category[i])
                category_data[i].append('')
                category_data[i].append('')

            if goal != None:
                category_data[i].append(spent_per_category[i])
                # total budget for cat - spent for cat = remaining
                category_data[i].append(round(category_data[i][0] - category_data[i][1], 2)) 
                # percent of budget for cat spent
                category_data[i].append(round(category_data[i][1] / category_data[i][0] * 100, 2))
            
        total_remaining = 0
        if goal != None:
            total_remaining = round(goal.monthly_budget - total_spent, 2)

        context = { 
            "expenses" : expenses,
            "category_data": category_data,
            "time_period_budget": goal.monthly_budget,
            "total_spent": round(total_spent, 2),
            "total_remaining": total_remaining,
            "expense_months": expense_months,
            "selected_month": selected_month
        }

    return render(request, 'budget/home.html', context)

def monthSelector(request):
    
    if request.method == 'GET':
        form = SelectMonthForm(request.GET)
    if form.is_valid():
        request.session['selected_month'] = form.cleaned_data['selected_month']
        return redirect('budget:home')
    else:
        print("invalid form: ", form.errors)

    return redirect('budget:home')


def addExpense(request):

    if request.method =='GET':
        print('get request')

    if request.method == 'POST':
        form = AddExpenseForm(request.POST)
        
        if form.is_valid():
            category = form.cleaned_data['category']
            value = form.cleaned_data['value']
            description = form.cleaned_data['description']

            if Goal.objects.filter(user=request.user).exists():
                goal = Goal.objects.filter(user=request.user).get()
                # add category to the goal with negative value to allow for
                # category_data processing to be done in home

                # need to hvae user create goal first before adding any expenses
                # can create empty goal if necessary

                # or create a default goal on account creation
                if category not in goal.goal.keys():
                    goal.goal[category] = "-1"
                goal.save()

            Expense.objects.create(user=request.user, value=value, 
                                   category=category, description=description)

        else:
            print('invalid form: ', form.errors)
    return redirect('budget:home')


def deleteExpense(request, expense_id):

    if request.method == 'POST':
        expense = get_object_or_404(Expense, id=expense_id)
        # request.session['category'] = expense.category
        expense.delete()

        return redirect('budget:home')
    
    return redirect('budget:home')


def editExpense(request, expense_id):

    if request.method == 'POST':
        form = AddExpenseForm(request.POST)

        if form.is_valid():
            expense = get_object_or_404(Expense, id=expense_id)
            expense.value = form.cleaned_data['value']
            expense.description = form.cleaned_data['description']      
            expense.save()
        else:
            print("Invalid form:", form.errors)

        return redirect('budget:home')

    return redirect('budget:home')

def goal(request):

    context = dict()
    if Goal.objects.filter(user=request.user).exists():
        goals = Goal.objects.filter(user=request.user)

        for i in goals:
            print(i.goal_name)

        context = {
            'goals': goals,
        }

    return render(request, 'budget/goal.html', context)

def createGoal(request):

    if request.method == 'POST':
        form = CreateGoalForm(request.POST)

        if form.is_valid():
            goal_values = form.cleaned_data['new_goal_values']
            monthly_budget = form.cleaned_data['monthly_budget']
            goal_name = form.cleaned_data['goal_name']
            active_month = form.cleaned_data['active_month']
            active_year = form.cleaned_data['active_year']

            activeFor = active_month + " " + str(active_year)

            Goal.objects.create(user=request.user, 
                                goal=goal_values, 
                                monthly_budget=monthly_budget, 
                                activeFor=activeFor, 
                                goal_name=goal_name)
        else:
            print("Invalid form: ", form.errors)

    return redirect('budget:goal')

    
