
'use strict';

var app = angular.module('ControlPanelApp', 
	['publisherControllers','ngRoute', 'ngCookies'])
	.config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider) {

		$httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
		$httpProvider.defaults.xsrfCookieName = 'csrftoken';

		//$locationProvider.html5Mode(true);
		//$locationProvider.hashPrefix('!');

		$routeProvider
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

			register: function(email, password, username) {
				var self = this;

				return $http.post('/api/v1/accounts/', {
					username: username,
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

			isAuthenticated: function() {
				return !!$cookies.authenticatedUser;
			},

			setAuthenticatedUser: function(user) {
				$cookies.authenticatedUser = JSON.stringify(user);
			},

			unAuthenticate: function() {
				delete $cookies.authenticatedUser;
			}
		};
 	}]);