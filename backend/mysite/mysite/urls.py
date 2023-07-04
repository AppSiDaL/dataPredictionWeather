"""
URL configuration for mysite project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from myapp import views

urlpatterns = [
    path('api/', views.my_view, name='my_view'),
    path('api/apiBridge',views.apiBridge, name='apiBridge'),
    path('api/bridge',views.bridge,name='bridge'),
    path('api/currentValues',views.currentValues, name="currentValues"),
    path('api/next48Values',views.next48Values,name="next48Values")
]
