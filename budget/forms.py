from django import forms

class LoginForm(forms.Form):
    username = forms.CharField(max_length=60)
    password = forms.CharField(widget=forms.PasswordInput())

class CreateAccountForm(forms.Form):
    username = forms.CharField(max_length=60)
    password = forms.CharField(widget=forms.PasswordInput)
    confirm_password = forms.CharField(widget=forms.PasswordInput)

class SelectMonthForm(forms.Form):
    selected_month = forms.CharField()

class AddExpenseForm(forms.Form):
    category = forms.CharField(max_length=30)
    value = forms.FloatField()
    description = forms.CharField(max_length=100)

class CreateGoalForm(forms.Form):
    monthly_budget = forms.IntegerField()
    new_goal_values = forms.JSONField()
    goal_name = forms.CharField()
    active_month = forms.CharField()
    active_year = forms.IntegerField()

class UpdateGoalForm(forms.Form):
    monthly_budget = forms.IntegerField()
    goal_values = forms.JSONField()
    goal_name = forms.CharField()
    active_for = forms.CharField() # actvie month and year
    goal_id = forms.IntegerField()