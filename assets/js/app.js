
'use strict';

var app = angular.module('ControlPanelApp', 
	['ngAnimate', 'ngRoute', 'ngCookies', 'ngDialog', 'cgBusy', 'toastr', 'ui.bootstrap', 'revolunet.stepper', 'publisherControllers'])
	.run(function($rootScope) {
		$rootScope.isAuthenticated = false;
	})
	.config(['$routeProvider', '$locationProvider', '$httpProvider', '$interpolateProvider', function($routeProvider, $locationProvider, $httpProvider, $interpolateProvider) {

		$httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
		$httpProvider.defaults.xsrfCookieName = 'csrftoken';

		$interpolateProvider.startSymbol('[[');
		$interpolateProvider.endSymbol(']]');

		$routeProvider
			.when('/', {
				controller: 'MainController',
				controllerAs: 'ctrl',
				templateUrl: '/static/partials/start.html'
			})
			.when('/login', {
				controller: 'LoginController',
				controllerAs: 'ctrl',
				templateUrl: '/static/partials/login.html'
			})
			.when('/select-country', {
				controller: 'CountryListController',
				controllerAs: 'ctrl',
				templateUrl: '/static/partials/country-list.html'
			})
			.when('/dashboard', {
				controller: 'DashboardController',
				controllerAs: 'ctrl',
				templateUrl: '/static/partials/dashboard.html'
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
			.when('/application-variables', {
				controller: 'ApplicationVariableListController',
				controllerAs: 'ctrl',
				templateUrl: '/static/partials/app-variables.html'
			})
			.when('/application-variables/new', {
				controller: 'ApplicationVariableCreateController',
				controllerAs: 'ctrl',
				templateUrl: '/static/partials/new-app-variable.html'
			})
			.when('/application-variables/:variableID', {
				controller: 'ApplicationVariableDetailController',
				controllerAs: 'ctrl',
				templateUrl: '/static/partials/app-variable-detail.html'
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
			.when('/accounts/:uId', {
				controller: 'UserAccountController',
				controllerAs: 'ctrl',
				templateUrl: '/static/partials/user-account.html'
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
			login: function(email, password) {
				var self = this;

				return $http.post('/api/v1/login/', {
					email: email, password: password
				});
			},

			logout: function() {
				var self = this;

				return $http.post('/api/v1/logout/');
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

		allFiles: function(countryCode) {
			return $http.get('/api/v1/files/?country=' +countryCode+ '&origin=web&format=json');
		},

		allWebLinks: function(countryCode) {
			return $http.get('/api/v1/links/?country=' +countryCode+ '&origin=web&format=json');
		},

		allApplicationVariables: function(countryCode) {
			return $http.get('/api/v1/application-variables/?country=' +countryCode+ '&format=json');	
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
		updateUserPassword: function(uId, data) {
			return $http.post('/api/v1/change-password/?uid='+ uId, data);
		},
		deleteUser: function(uId) {
			return $http.delete('/api/v1/accounts/'+ uId + '/?format=json');
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
			return $http.patch('/api/v1/files/' + fID + '/?format=json', data, {
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined}
			});
		},
		newApplicationVariable: function(data) {
			return $http.post('/api/v1/application-variables/', data);
		},

		fetchApplicationVariable: function(vID) {
			return $http.get('/api/v1/application-variables/' + vID + '/?format=json');
		},
		updateApplicationVariable: function(vId, data) {
			return $http.patch('/api/v1/application-variables/'+ vId +'/', data);
		},

		deleteApplicationVariable: function(vID) {
			return $http.delete('/api/v1/application-variables/' + vID + '/?format=json');
		},

		deleteFile: function(fID) {
			return $http.delete('/api/v1/files/' + fID + '/?format=json');
		},

		newWebLink: function(data, country) {
			return $http.post('/api/v1/links/', data, {
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined}
			});
		},

		fetchWeblink: function(itemID) {
			return $http.get('/api/v1/links/' + itemID + '/?format=json');
		},

		updateWeblink: function(itemID, data, country) {

			return $http.patch('/api/v1/links/' + itemID + '/', data, {
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined}
			});		
		},

		deleteWeblink: function(itemID) {
			return $http.delete('/api/v1/links/' + itemID + '/?format=json');
		},

		fetchCategorizedFiles: function(categoryId, country) {
			return $http.get('/api/v1/categorized_files/?categoryId='+ categoryId +'&country='+ country +'&format=json');
		},

		fetchCategorizedWeblinks: function(categoryId, country) {
			return $http.get('/api/v1/categorized_links/?categoryId='+ categoryId +'&country='+ country +'&format=json');
		},
		updateWeblinkPosition: function(id, data) {
			return $http.patch('/api/v1/categorized_links/' + id + '/', data);
		},
		updateFilePosition: function(id, data) {
			return $http.patch('/api/v1/categorized_files/' + id + '/', data);
		}
	}
}]);

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
					//console.log('FILE: ' + JSON.stringify(element[0].files[0]));
				});
			});
		}
	};
}]);
