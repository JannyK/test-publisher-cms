from django.conf.urls import patterns, include, url 

from rest_framework_nested import routers

from .views import AccountViewSet

router = routers.SimpleRouter()
router.register(r'accounts', AccountViewSet)

urlpatterns = patterns('',
	url(r'v1/', include(router.urls)),
)