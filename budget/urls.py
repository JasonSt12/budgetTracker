from django.urls import path
from . import views

app_name="budget"

urlpatterns = [
    path('', views.index, name='index'),
    path('createAccount/', views.createAccount, name='createAccount'),
    path('logout/', views.logout_view, name='logout'),
    path('home/', views.home, name='home'),
    path('monthSelector/', views.monthSelector, name='monthSelector'),
]
