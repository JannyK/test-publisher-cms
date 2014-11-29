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
	.controller('MainController', 
		['AuthenticationService', '$location', function(AuthenticationService, $location) {

		var self = this;


		self.isCountrySet = !!AuthenticationService.getSelectedCountry();
		self.isAuthenticated = AuthenticationService.isAuthenticated();
		self.canDisplayMeny = false;

		self.countries = [
			{name: 'norway', code: 'NO'},
			{name: 'sweden', code: 'SE'},
			{name: 'danmark', code: 'DK'}
		];

		if (self.isCountrySet) {
			if (self.isAuthenticated) {
				$location.url('/dashboard');
			}else {
				$location.url('/login');
			}
		}

		self.setCurrentCountry = function(country) {
			self.isCountrySet = true;

			if (AuthenticationService.setSelectedCountry(country)) {
				$location.url('/login');	
			}
		};

		self.logout = function() {
			AuthenticationService.logout();
		};
	}])
 	.controller('RegistrationController', 
 		['AuthenticationService', '$location', function(AuthenticationService, $location) {

 		var self = this;

 		self.countries = [
			{name: 'NORWAY', code: 'NO'},
			{name: 'SWEDEN', code: 'SE'},
			{name: 'DANMARK', code: 'DK'}
		];

		self.email = "";
		self.password = "";
		self.countryCode = "";
		
		self.register = function() {
			AuthenticationService.register(self.email, self.password, self.countryCode);
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

 	.controller('DashboardController', [function() {
 		//TODO
 		var self = this;
 		self.message = 'This is the dashboard: Content coming soon...';
 	}])

 	.controller('PresentationController', 
 		['AuthenticationService', 
 		'CorePublisherService', 
 		//'MessageNotificationService', 
 		'$location', 
 		'ngDialog',
 		function(AuthenticationService ,CorePublisherService, $location, ngDialog) {

 		//ToDO -Implement
 		var self = this;

 		self.isAuthenticated = AuthenticationService.isAuthenticated();
 		self.presentations = [];
 		self.categories = [];

 		self.presentationItem = {
 			title: '',
 			description: '',
 			thumbnail: '',
 			file: '',
 			pub_date: '',
 			expiry_date: '',
 			categories: []
 		};

 		//fetch all categories and make them availbale for use
 		CorePublisherService.allCategories().then(function(resp) {
 			self.categories = resp.data;
 			console.log('Categories loaded successfully: '+ resp.data);
 		}, function(errorResp) {
 			console.error('Failed to fetch categories:');
 		});

 		//fetch all presentations
 		CorePublisherService.allPresentations().then(function(resp) {
 			self.presentations = resp.data;
 			console.log('allPresentations loaded successfully: '+ resp.data);
 		}, function(errorResp) {
 			//MessageNotificationService.error(errorResp.error);
 			console.error('Error fetching data...');
 		});

 		/*
 		self.createNewItem = function() {
 			ngDialog.open({
 				template: '/static/partials/new-presentation.html',
 				controller: 'PresentationController'
 			});
 		};
 		*/

 		self.submitNewPresentation = function() {

 			console.log('Submit function called');
 			if (self.isAuthenticated) {

 				var fd = new FormData();

 				fd.append('title', self.presentationItem.title);
 				fd.append('description', self.presentationItem.description);
 				fd.append('thumbnail', self.presentationItem.thumbnail);
 				fd.append('file', self.presentationItem.file);
 				fd.append('pub_data', self.presentationItem.pub_date);
 				fd.append('expiry_date', self.presentationItem.expiry_date);
 				fd.append('categories', self.presentationItem.categories);

 				CorePublisherService.newPresentation(fd).then(function(resp) {
 					console.log('Presentation created successfully');
 				}, function(errorResp) {
 					console.error('Failed to create Presdentation: '+ JSON.stringify(errorResp));
 				});


 				/*
	 			CorePublisherService.newPresentation({
	 				title: self.presentationItem.title,
	 				description: self.presentationItem.description,
	 				thumbnail: self.presentationItem.thumbnail,
	 				file: self.presentationItem.file,
	 				pub_date: self.presentationItem.pub_date,
	 				categories: self.presentationItem.categories

	 			}).then(function(resp) {
	 				//Hande the response...

	 				console.log('Presentation created successfully...');
	 			}, function(errorResp) {
	 				//Error handling...
	 				console.error('Failed creating a new presentation');
	 			});
				*/
	 		} else {
	 			//redirect to the login page
	 			$location.url('/login');
	 		}
 		};

 		/*
 		self.$on('presentation.created', function(event, pub) {
 			self.presentations.unshift(pub);
 		});

 		self.$on('presentation.created.error', function() {
 			self.presentations.shift();
 		});
		*/
 	}]);

