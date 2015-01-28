from django.conf.urls import patterns, include, url 

from rest_framework_nested import routers

from .views import (
	AccountViewSet, 
	LoginView, 
	MobileClientLoginView,
	LogoutView,
	CategoryViewSet,
	PresentationViewSet,
	UserPresentationsViewSet,
	FileViewSet,
	UserFilesViewSet,
	WebLinkViewSet,
	UserWebLinksViewSet,
	ResourceByCategoryView,
	
	#categorized resource with sorting
	AllCategorizedResourceByCategoryView,
	CategorizedPresentationViewSet,
	CategorizedFileViewSet,
	CategorizedWebLinkViewSet,
)

router = routers.SimpleRouter()
router.register(r'accounts', AccountViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'presentations', PresentationViewSet)
router.register(r'files', FileViewSet)
router.register(r'links', WebLinkViewSet)

#Categorized content
router.register(r'categorized_presentations', CategorizedPresentationViewSet)
router.register(r'categorized_files', CategorizedFileViewSet)
router.register(r'categorized_links', CategorizedWebLinkViewSet)

#AccountRouter provide the nested routing needed to access entries for
#a specific user
account_router = routers.NestedSimpleRouter(
	router, r'accounts', lookup='user')

account_router.register(r'presentations', UserPresentationsViewSet)
account_router.register(r'files', UserFilesViewSet)
account_router.register(r'links', UserWebLinksViewSet)

urlpatterns = patterns('',
	url(r'v1/', include(router.urls)),
	url(r'v1/login/$', LoginView.as_view(), name='login'),
	url(r'v1/ios-login/$', MobileClientLoginView.as_view(), name='ios_login'),
	url(r'v1/logout/$', LogoutView.as_view(), name='logout'),
	url(r'v1/categorized_resources/$', ResourceByCategoryView.as_view(), name='categorized_resources'),
	url(r'v1/all_categorized_resources/$', AllCategorizedResourceByCategoryView.as_view(), name='all_categorized_resources'),
	url(r'v1/', include(account_router.urls)),
)