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
	.controller('MainController', ['AuthenticationService', function(AuthenticationService) {
		var self = this;

		self.logout = function() {
			AuthenticationService.logout();
		};
	}])
 	.controller('RegistrationController', 
 		['AuthenticationService', '$location', function(AuthenticationService, $location) {

 		var self = this;
 		

		self.email = "";
		self.password = "";
		self.username = "";
		
		self.register = function() {
			AuthenticationService.register(self.email, self.password, self.username);
		};

		self.activate = function() {
			if (AuthenticationService.isAuthenticated()) {
				$location.url('/');
			};
		};

		self.activate();
 	}])

 	.controller('LoginController', 
 		['AuthenticationService', '$location', function(AuthenticationService, $location) {

 		var self = this;

 		self.activate = function() {
 			if (AuthenticationService.isAuthenticated()) {
 				$location.url('/');
 			}
 		};

 		self.login = function() {
 			AuthenticationService.login(self.email, self.password);
 		};

 		self.activate();
 	}])

 	.controller('CorePublisherController', [function() {
 		//TODO - Implement
 	}])

 	.controller('PresentationController', 
 		['AuthenticationService', 'CorePublisherService', 'NotificationMessageService', function(AuthenticationService ,CorePublisherService, NotificationMessageService) {

 		//ToDO -Implement
 		var self = this;

 		self.isAuthenticated = AuthenticationService.isAuthenticated();
 		self.presentations = [];

 		//fetch all presentations
 		CorePublisherService.allPresentations().then(function(resp) {
 			self.presentations = resp.data;
 		}, function(errorResp) {
 			NotificationMessageService.error(errorResp.error);
 		});

 		self.$on('presentation.created', function(event, pub) {
 			self.presentations.unshift(pub);
 		});

 		self.$on('presentation.created.error', function() {
 			self.presentations.shift();
 		});
 	}])

