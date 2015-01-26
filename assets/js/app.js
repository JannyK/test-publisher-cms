
'use strict';

var app = angular.module('ControlPanelApp', 
	['publisherControllers','ngRoute', 'ngCookies', 'ngDialog'])
	.config(['$routeProvider', '$locationProvider', '$httpProvider', '$interpolateProvider', function($routeProvider, $locationProvider, $httpProvider, $interpolateProvider) {

		$httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
		$httpProvider.defaults.xsrfCookieName = 'csrftoken';

		$interpolateProvider.startSymbol('[[');
		$interpolateProvider.endSymbol(']]');

		//$locationProvider.html5Mode(true);
		//$locationProvider.hashPrefix('!');

		$routeProvider
			.when('/', {
				controller: 'MainController',
				controllerAs: 'ctrl',
				templateUrl: '/static/partials/start.html'
			})
			.when('/register', {
				controller: 'RegistrationController',
				controllerAs: 'ctrl',
				templateUrl: '/static/partials/register.html'
			})
			.when('/login', {
				controller: 'LoginController',
				controllerAs: 'ctrl',
				templateUrl: '/static/partials/login.html'
			})
			.when('/dashboard', {
				controller: 'DashboardController',
				controllerAs: 'ctrl',
				templateUrl: '/static/partials/dashboard.html'
			})
			.when('/presentations', {
				controller: 'PresentationListController',
				controllerAs: 'ctrl',
				templateUrl: '/static/partials/presentations.html'
			})
			.when('/presentations/new', {
				controller: 'PresentationCreateController',
				controllerAs: 'ctrl',
				templateUrl: '/static/partials/new-presentation.html'
			})
			.when('/presentations/:presentationId', {
				controller: 'PresentationDetailController',
				controllerAs: 'ctrl',
				templateUrl: '/static/partials/detail-presentation.html'
			})
			.when('/links', {
				controller: 'LinkListController',
				controllerAs: 'ctrl',
				templateUrl: '/static/partials/links.html'
			})
			.when('/links/new', {
				controller: 'LinkCreateController',
				controllerAs: 'ctrl',
				templateUrl: '/static/partials/new-link.html'
			})
			.when('/links/:linkID', {
				controller: 'WeblinkDetailController',
				controllerAs: 'ctrl',
				templateUrl: '/static/partials/detail-link.html'
			})
			.when('/files', {
				controller: 'FileListController',
				controllerAs: 'ctrl',
				templateUrl: '/static/partials/files.html'
			})
			.when('/files/new', {
				controller: 'FileCreateController',
				controllerAs: 'ctrl',
				templateUrl: '/static/partials/new-file.html'
			})
			.when('/files/:fileId', {
				controller: 'FileDetailController',
				controllerAs: 'ctrl',
				templateUrl: '/static/partials/detail-file.html'
			})
			.when('/categories', {
				controller: 'CategoryListController',
				controllerAs: 'ctrl',
				templateUrl: '/static/partials/categories.html'
			})
			.when('/categories/new', {
				controller: 'CategoryCreateController',
				controllerAs: 'ctrl',
				templateUrl: '/static/partials/new-category.html'
			})
			.when('/categories/:categoryId', {
				controller: 'CategoryDetailController',
				controllerAs: 'ctrl',
				templateUrl: '/static/partials/detail-category.html'
			})
			.when('/users', {
				controller: 'UserListController',
				controllerAs: 'ctrl',
				templateUrl: '/static/partials/users.html'
			})
			.when('/users/new', {
				controller: 'UserCreateController',
				controllerAs: 'ctrl',
				templateUrl: '/static/partials/new-user.html'
			})
			.when('/users/:uId', {
				controller: 'UserDetailController',
				controllerAs: 'ctrl',
				templateUrl: '/static/partials/user-details.html'
			})
			.otherwise({
				redirectTo: '/'
			});
	}]);

/**
 * @ngdoc service
 * @name AuthenticationServiceProvider
 *
 * @description
 * Service that handle user authentication
 *
 */
app.factory('AuthenticationService', ['$http', '$cookies', function($http, $cookies) {

		return {

			register: function(email, password, country) {
				var self = this;

				return $http.post('/api/v1/accounts/', {
					country: country,
					password: password,
					email: email
				}).then(function(resp) {
					self.login(email, password);
				}, function(errorResp) {
					console.error('Epic failure');
				});
			},

			login: function(email, password) {
				var self = this;

				return $http.post('/api/v1/login/', {
					email: email, password: password
				}).then(function(resp) {
					self.setAuthenticatedUser(resp.data);
					window.location = '/';
				}, function(errorResp) {
					console.log('Epic failure...');
				});
			},

			logout: function() {
				var self = this;

				return $http.post('/api/v1/logout/')
					.then(function(resp) {
						//redirect to loginView
						self.unAuthenticate();
						window.location = '/';

					}, function(errorResp) {
						console.error('Error occured while logging out');
					});
			},

			getAuthenticatedUser: function() {
				if (!$cookies.authenticatedUser) {
					return;
				}
				return JSON.parse($cookies.authenticatedUser);
			},

			getSelectedCountry: function() {
				if (!$cookies.selectedCountry) {
					return null;
				}
				return JSON.parse($cookies.selectedCountry);
			},

			setSelectedCountry: function(country) {
				$cookies.selectedCountry = JSON.stringify(country);
				return true;
				//window.location('/login');
			},

			isAuthenticated: function() {
				return !!$cookies.authenticatedUser;
			},

			setAuthenticatedUser: function(user) {
				$cookies.authenticatedUser = JSON.stringify(user);
			},

			unAuthenticate: function() {
				delete $cookies.authenticatedUser;
				delete $cookies.selectedCountry;
			}
		};
 	}]);

app.factory('CorePublisherService', ['$http', function($http) {
	return {
		allCategories: function(countryCode) {
			return $http.get('/api/v1/categories/?country=' +countryCode+ '&format=json');
		},

		allUsers: function() {
			return $http.get('/api/v1/accounts/?format=json');
		},

		allPresentations: function(countryCode) {
			return $http.get('/api/v1/presentations/?country=' +countryCode+ '&format=json');
		},

		allFiles: function(countryCode) {
			return $http.get('/api/v1/files/?country=' +countryCode+ '&format=json');
		},

		allWebLinks: function(countryCode) {
			return $http.get('/api/v1/links/?country=' +countryCode+ '&format=json');
		},

		newCategory: function(data) {
			return $http.post('/api/v1/categories/', data, {
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined}
			});
		},

		fetchCategory: function(cId) {
			return $http.get('/api/v1/categories/'+ cId + '/?format=json');
		},

		updateCategory: function(cId, data) {
			return $http.patch('/api/v1/categories/'+ cId +'/', data, {
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined}
			});
		},

		deleteCategory: function(cId) {
			return $http.delete('/api/v1/categories/'+ cId + '/?format=json');
		},

		newUser: function(data) {
			return $http.post('/api/v1/accounts/', data);
		},
		fetchUser: function(uId) {
			return $http.get('/api/v1/accounts/'+ uId + '/?format=json');
		},
		updateUser: function(uId, data) {
			return $http.patch('/api/v1/accounts/'+ uId +'/', data);
		},
		deleteUser: function(uId) {
			return $http.delete('/api/v1/accounts/'+ uId + '/?format=json');
		},

		newPresentation: function(data) {
			return $http.post('/api/v1/presentations/', data, {
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined}
			});
		},

		fetchPresentation: function(pID) {
			return $http.get('/api/v1/presentations/' + pID + '/?format=json');
		},

		updatePresentation: function(pID, data) {
			return $http.patch('/api/v1/presentations/' + pID + '/', data, {
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined}
			});
		},

		deletePresentation: function(pID) {
			return $http.delete('/api/v1/presentations/' + pID + '/?format=json');
		},

		newFile: function(data) {
			return $http.post('/api/v1/files/', data, {
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined}
			});
		},

		fetchFile: function(fID) {
			return $http.get('/api/v1/files/' + fID + '/?format=json');
		},

		updateFile: function(fID, data) {
			return $http.patch('/api/v1/files/' + fID + '/', data, {
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined}
			});
		},

		deleteFile: function(fID) {
			return $http.delete('/api/v1/files/' + fID + '/?format=json');
		},

		newWebLink: function(data) {
			return $http.post('/api/v1/links/', data, {
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined}
			});
		},

		fetchWeblink: function(itemID) {
			return $http.get('/api/v1/links/' + itemID + '/?format=json');
		},

		updateWeblink: function(itemID, data) {

			return $http.patch('/api/v1/links/' + itemID + '/', data, {
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined}
			});		
		},

		deleteWeblink: function(itemID) {
			return $http.delete('/api/v1/links/' + itemID + '/?format=json');
		}

		//Fetch Items by country (from current logged user)
		/*
		getPresentations: function(user_country) {
			return $http.get('/api/v1/accounts/' + user_country + 'presentations');
		},

		getFiles: function(user_country) {
			return $http.get('/api/v1/accounts/' + user_country + 'files');
		},

		getWebLinks: function(user_country) {
			return $http.get('/api/v1/accounts/' + user_country + 'links');
		}
		*/
	}
}]);

/*
* Utility services: Snackbar
* For displaying Message à la Google plus 
*/

app.factory('MessageNotificationService', ['$', '_', function($, _) {
	return {
		_snackbar: function(content, options) {
			options = _.extends({timeout: 3000}, options);
			options.content = content;

			$.snackbar(options);
		},

		errorMessage: function(content, options) {
			_snackbar('Error' + content, options);
		},

		show: function(content, options) {
			_snackbar(content, options);
		}
	}
}])

/**
* Custome directives
**/

app.directive('fileField', ['$parse', function($parse) {
	return {
		restrict: 'A',
		link: function($scope, element, attrs) {

			var field = $parse(attrs.fileField);
			var fieldSetter = field.assign;

			element.bind('change', function() {
				$scope.$apply(function() {
					fieldSetter($scope, element[0].files[0]);
					console.log('FILE: ' + JSON.stringify(element[0].files[0]));
				});
			});
		}
	};
}]);
