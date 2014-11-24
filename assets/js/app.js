
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
				templateUrl: '/partials/register.html'
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
 		var self = this;

		return {
			register: function(email, password, username) {
				return $http.post('/api/v1/accounts/', {
					username: username,
					password: password,
					email: email
				});
			}
		};
 	}]);

