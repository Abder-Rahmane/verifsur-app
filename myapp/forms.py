from django import forms
from django.contrib.admin.widgets import AdminDateWidget
from myapp.models import identity_informations

class CustomAdminDateBirthWidget(AdminDateWidget):
    def __init__(self, attrs=None):
        default_attrs = {'placeholder': 'Date of birth'}
        if attrs:
            default_attrs.update(attrs)
        super(CustomAdminDateBirthWidget, self).__init__(attrs=default_attrs)

class CustomAdminDateDepotWidget(AdminDateWidget):
    def __init__(self, attrs=None):
        default_attrs = {'placeholder': 'Deposit date'}
        if attrs:
            default_attrs.update(attrs)
        super(CustomAdminDateDepotWidget, self).__init__(attrs=default_attrs)

class CustomAdminDateExpirWidget(AdminDateWidget):
    def __init__(self, attrs=None):
        default_attrs = {'placeholder': 'Expiration date'}
        if attrs:
            default_attrs.update(attrs)
        super(CustomAdminDateExpirWidget, self).__init__(attrs=default_attrs)



class IdentityInformationsForm(forms.ModelForm):
    class Meta:
        model = identity_informations
        fields = ['first_name', 'last_name', 'sexe', 'date_of_birth', 'addresses', 'city', 'date_depot', 'date_expirated', 'confidentiality']
        widgets = {
            'first_name': forms.TextInput(attrs={'placeholder': 'First name'}),
            'last_name': forms.TextInput(attrs={'placeholder': 'Last name'}),
            'addresses': forms.TextInput(attrs={'placeholder': 'Addresse'}),
            'city': forms.TextInput(attrs={'placeholder': 'City'}),
            'date_of_birth': CustomAdminDateBirthWidget(),
            'date_depot': CustomAdminDateDepotWidget(),
            'date_expirated': CustomAdminDateExpirWidget(),
        }

    confidentiality = forms.BooleanField(required=True)

    def __init__(self, *args, **kwargs):
        super(IdentityInformationsForm, self).__init__(*args, **kwargs)
        for field in self.fields.values():
            field.required = True