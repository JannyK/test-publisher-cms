'use strict';

/**
 * The root ControlPanel module.
 *
 * @type {ControlPanelApp|*|{}}
 */
var ControlPanelApp = ControlPanelApp || {};

/**
 * @ngdoc module
 * @name publisherServices
 *
 * @description
 * Angular module for services.
 *
 */
ControlPanelApp.services = angular.module('publisherServices', ['ngCookies']);


/**
 * @ngdoc service
 * @name AuthenticationService
 *
 * @description
 * A service used to handle user authentication
 */
ControlPanelApp.services
 	.factory('AuthenticationService', ['$http', '$cookies', function($http, $cookies) {
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