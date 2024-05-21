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