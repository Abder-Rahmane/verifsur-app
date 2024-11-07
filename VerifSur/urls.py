"""
URL configuration for VerifSur project.

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
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path
from myapp.views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('verify_face_idenity', verify_face_idenity, name='verify_face_idenity'),
    path('verify_card_idenity', verify_card_idenity, name='verify_card_idenity'),
    path('step_zero/',step_zero, name='step_zero'),
    path('step_zero/<uuid:user_id>/', step_zero, name='step_zero_with_id'),
    path('step_one/<uuid:user_id>/', step_one, name='step_one'),
    path('step_two/<uuid:user_id>/', step_two, name='step_two'),
    path('', welcome_page, name='welcome_page'),
    path('welcome_page/<uuid:user_id>/', welcome_page, name='welcome_page'),
    path('verification/<uuid:user_id>/', verification, name='verification'),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)