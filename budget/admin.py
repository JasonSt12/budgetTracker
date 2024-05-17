from django.contrib import admin
import budget.models as Models

# Register your models here.
admin.site.register(Models.Goal)
admin.site.register(Models.Expense)