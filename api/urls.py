from django.conf.urls import patterns, include, url 

from rest_framework_nested import routers

from .views import AccountViewSet, LoginView, LogoutView

router = routers.SimpleRouter()
router.register(r'accounts', AccountViewSet)

urlpatterns = patterns('',
	url(r'v1/', include(router.urls)),
	url(r'v1/login/$', LoginView.as_view(), name='login'),
	url(r'v1/logout/$', LogoutView.as_view(), name='logout'),
)