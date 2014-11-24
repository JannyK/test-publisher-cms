'use strict';

/**
 * The root ControlPanel module.
 *
 * @type {ControlPanelApp|*|{}}
 */
var ControlPanelApp = ControlPanelApp || {};

/**
 * @ngdoc module
 * @name publisherControllers
 *
 * @description
 * Angular module for controllers.
 *
 */
ControlPanelApp.controllers = angular.module('publisherControllers', []);


/**
 * @ngdoc controller
 * @name RegistrationController
 *
 * @description
 * A controller used for User registration
 */
ControlPanelApp.controllers
 	.controller('RegistrationController', ['AuthenticationService', function(AuthenticationService) {
 		var self = this;

		self.email = "";
		self.password = "";
		self.password = "";
		
		self.register = function() {
			AuthenticationService.register(self.email, self.password, self.username);
		};
 	}]);