from django.shortcuts import render, redirect
from myapp.forms import *
from myapp.models import *
from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator


# Create your views here.
def verify_face_idenity(request):
    return render(request, 'verify_face_idenity.html')



def welcome_page(request, user_id=None):
    if user_id:
        user_info = get_object_or_404(identity_informations, id=user_id)
        if user_info.current_step == 1:
            return redirect('step_zero', user_id=user_info.id)
        elif user_info.current_step > 1:
            return redirect('step_one', user_id=user_info.id)
    else:
        # Logique pour les utilisateurs qui n'ont pas encore commencé le processus
        return render(request, 'welcome_page.html')


def step_zero(request, user_id=None):
    if user_id:
        user_info = get_object_or_404(identity_informations, id=user_id)
        if user_info.current_step > 1:
            return redirect('step_one', user_id=user_info.id)
    else:
        user_info = None

    if request.method == 'POST':
        form = IdentityInformationsForm(request.POST, instance=user_info)
        if form.is_valid():
            user_info = form.save(commit=False)
            user_info.current_step = 1
            user_info.save()
            return redirect('step_one', user_id=user_info.id)
    else:
        form = IdentityInformationsForm(instance=user_info)

    context = {'form': form}
    return render(request, 'step_zero.html', context)

@method_decorator(csrf_exempt, name='dispatch')
def step_one(request, user_id=None):
    user_info = get_object_or_404(identity_informations, id=user_id)
    
    # Si l'utilisateur a déjà validé cette étape, on le redirige vers l'étape suivante
    if user_info.current_step == 2:
        return redirect('step_two', user_id=user_info.id)

    if request.method == 'POST':
        image_recto = request.FILES.get('image_recto')
        image_verso = request.FILES.get('image_verso')
        if image_recto:
            user_info.image_recto = image_recto
        if image_verso:
            user_info.image_verso = image_verso
        user_info.current_step = 2  
        user_info.save()
        return JsonResponse({'success': True})
    
    return render(request, 'step_one.html')

def step_two(request, user_id=None):
    return render(request, 'step_two.html')

def verify_card_idenity(request):
    return render(request, 'verify_card_idenity.html')

def verification(request, user_id=None):
    return render(request, 'verification.html')