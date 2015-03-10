from django.conf.urls import patterns, include, url
from django.views.generic.base import TemplateView

urlpatterns = patterns('',
    url(r'^api/', include('api.urls')),
    url(r'^.*$', TemplateView.as_view(template_name='base.html'), name='home'),
)
