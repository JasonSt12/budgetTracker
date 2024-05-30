from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from budget.models import Expense, Goal
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from datetime import datetime, date
from dateutil.relativedelta import relativedelta
from budget.forms import LoginForm, CreateAccountForm, SelectMonthForm, AddExpenseForm

def index(request):
    print("in index")
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
    print("in createAccount")

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
        total_spent = 0
        months = ["Jan, ", "Feb, ", "Mar, ", "Apr, ", "May, ", "Jun, ", 
                  "Jul, ", "Aug, ", "Sep, ", "Oct, ", "Nov, ", "Dec, "]
        selected_month = months[date.today().month - 1] + str(date.today().year)
        if request.session.get('selected_month'):
            selected_month = request.session.get('selected_month')
    
        if Goal.objects.filter(user=request.user).exists():
            goal = Goal.objects.filter(user=request.user).get()
            monthly_budget = goal.yearly_income / 12
            for i in goal.goal:
                # total budget for a category
                category_data[i] = [round(int(goal.goal[i]) / 100 * monthly_budget, 2)] 

        for exp in expenses:
            if selected_month == months[exp.date_created.month - 1] + str(exp.date_created.year):
                spent_per_category[exp.category] = spent_per_category.get(exp.category, 0) + exp.value
                total_spent += exp.value
            expense_months.add(months[exp.date_created.month - 1] + str(exp.date_created.year))
        
        for i in spent_per_category:
            if goal == None:
                category_data[i].append('')
                category_data[i].append(spent_per_category[i])
                category_data[i].append('')
                category_data[i].append('')

            if goal != None:
                category_data[i].append(spent_per_category[i])
                category_data[i].append(round(category_data[i][0] - category_data[i][1], 2)) # remaining
                category_data[i].append(round(category_data[i][1] / category_data[i][0] * 100, 2)) # percent spent
            
        context = { 
            "expenses" : expenses,
            "category_data": category_data,
            "time_period_budget": round(monthly_budget, 2),
            "total_spent": round(total_spent, 2),
            "total_remaining": round(monthly_budget - total_spent, 2),
            "expense_months": expense_months,
            "selected_month": selected_month
        }

        print(category_data.keys())
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
        goal = Goal.objects.filter(user=request.user).get()
       
        if form.is_valid():
            category = form.cleaned_data['category']
            value = form.cleaned_data['value']
            description = form.cleaned_data['description']

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

    return render(request, 'budget/goal.html')

    
