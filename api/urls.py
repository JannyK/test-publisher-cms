from django.conf.urls import patterns, include, url 

from rest_framework_nested import routers

from .views import (
	AccountViewSet, 
	LoginView, 
	UserPasswordChangeView,
	MobileClientLoginView,
	LogoutView,
	CategoryViewSet,
	FileViewSet,
	WebLinkViewSet,
	ResourceByCategoryView,
	#categorized resource with sorting
	AllCategorizedResourceByCategoryView,
	CategorizedFileViewSet,
	CategorizedWebLinkViewSet,
	ApplicationVariableViewSet,
	ApplicationVariableByNameView,
)

router = routers.SimpleRouter()
router.register(r'accounts', AccountViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'files', FileViewSet)
router.register(r'links', WebLinkViewSet)
router.register(r'application-variables', ApplicationVariableViewSet)

#Categorized content
router.register(r'categorized_files', CategorizedFileViewSet)
router.register(r'categorized_links', CategorizedWebLinkViewSet)

urlpatterns = patterns('',
	url(r'v1/', include(router.urls)),
	url(r'v1/login/$', LoginView.as_view(), name='login'),
	url(r'v1/ios-login/$', MobileClientLoginView.as_view(), name='ios_login'),
	url(r'v1/change-password/$', UserPasswordChangeView.as_view(), name="change_password"),
	url(r'v1/logout/$', LogoutView.as_view(), name='logout'),
	url(r'v1/categorized_resources/$', ResourceByCategoryView.as_view(), name='categorized_resources'),
	url(r'v1/all_categorized_resources/$', AllCategorizedResourceByCategoryView.as_view(), name='all_categorized_resources'),
	url(r'v1/get-application-variable/$', ApplicationVariableByNameView.as_view(), name="get_application_variable"),
)