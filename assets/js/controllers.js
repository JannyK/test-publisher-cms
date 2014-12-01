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

 	.controller('PresentationCreateController',
 		['AuthenticationService', 'CorePublisherService', '$location', function(AuthenticationService, CorePublisherService, $location) {
 			var self = this;
 			self.isAuthenticated = AuthenticationService.isAuthenticated();
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
	 		}, function(errorResp) {
	 			console.error('Failed to fetch categories:');
	 		});

	 		self.create = function() {
	 			console.log('DATA TO BE POSTED: '+ JSON.stringify(self.presentationItem));
	 			
	 			if (self.isAuthenticated) {

	 				var fd = new FormData();

	 				fd.append('title', self.presentationItem.title);
	 				fd.append('description', self.presentationItem.description);
	 				fd.append('thumbnail', self.presentationItem.thumbnail);
	 				fd.append('file', self.presentationItem.file);
	 				fd.append('pub_date', self.presentationItem.pub_date);
	 				fd.append('expiry_date', self.presentationItem.expiry_date);
	 				fd.append('categories', self.presentationItem.categories);

	 				CorePublisherService.newPresentation(fd).then(function(resp) {
	 					console.log('Presentation created successfully');
	 					$location.url('/presentations');

	 				}, function(errorResp) {
	 					console.error('Failed to create Presdentation:');
	 				});

		 		} else {
		 			//redirect to the login page
		 			$location.url('/login');
		 		}
	 		};
 	}])

	.controller('FileCreateController', 
		['AuthenticationService', 'CorePublisherService', '$location', function(AuthenticationService, CorePublisherService, $location) {
			var self = this;
			self.isAuthenticated = AuthenticationService.isAuthenticated();
			self.categories = [];

			self.newFile = {
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
	 		}, function(errorResp) {
	 			console.error('Failed to fetch categories:');
	 		});

	 		self.create = function() {
	 			console.log('DATA TO BE POSTED: '+ JSON.stringify(self.newFile));
	 			
	 			if (self.isAuthenticated) {

	 				var fd = new FormData();

	 				fd.append('title', self.newFile.title);
	 				fd.append('description', self.newFile.description);
	 				fd.append('thumbnail', self.newFile.thumbnail);
	 				fd.append('file', self.newFile.file);
	 				fd.append('pub_date', self.newFile.pub_date);
	 				fd.append('expiry_date', self.newFile.expiry_date);
	 				fd.append('categories', self.newFile.categories);

	 				CorePublisherService.newFile(fd).then(function(resp) {
	 					console.log('Presentation created successfully');
	 					$location.url('/files');

	 				}, function(errorResp) {
	 					console.error('Failed to create Presdentation:');
	 				});

		 		} else {
		 			//redirect to the login page
		 			$location.url('/login');
		 		}
	 		};
	}])

	.controller('LinkCreateController', 
		['AuthenticationService', 'CorePublisherService', '$location', function(AuthenticationService, CorePublisherService, $location) {
			var self = this;
			self.isAuthenticated = AuthenticationService.isAuthenticated();
			self.categories = [];

			self.newLink = {
	 			title: '',
	 			description: '',
	 			thumbnail: '',
	 			link: '',
	 			pub_date: '',
	 			expiry_date: '',
	 			categories: []
	 		};

	 		//fetch all categories and make them availbale for use
	 		CorePublisherService.allCategories().then(function(resp) {
	 			self.categories = resp.data;
	 		}, function(errorResp) {
	 			console.error('Failed to fetch categories:');
	 		});

	 		self.create = function() {
	 			console.log('DATA TO BE POSTED: '+ JSON.stringify(self.newLink));
	 			
	 			if (self.isAuthenticated) {

	 				var fd = new FormData();

	 				fd.append('title', self.newLink.title);
	 				fd.append('description', self.newLink.description);
	 				fd.append('thumbnail', self.newLink.thumbnail);
	 				fd.append('link', self.newLink.link);
	 				fd.append('pub_date', self.newLink.pub_date);
	 				fd.append('expiry_date', self.newLink.expiry_date);
	 				fd.append('categories', self.newLink.categories);

	 				CorePublisherService.newLink(fd).then(function(resp) {
	 					console.log('Presentation created successfully');
	 					$location.url('/links');

	 				}, function(errorResp) {
	 					console.error('Failed to create Presdentation:');
	 				});

		 		} else {
		 			//redirect to the login page
		 			$location.url('/login');
		 		}
	 		};
	}])
	
 	.controller('PresentationListController', 
 		['CorePublisherService', '$location', 'ngDialog',function(CorePublisherService, $location, ngDialog) {

 		//ToDO -Implement
 		var self = this;
 		self.presentations = [];

 		//fetch all presentations
 		CorePublisherService.allPresentations().then(function(resp) {
 			self.presentations = resp.data;
 			console.log('allPresentations loaded successfully:');
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
 	}])

 	.controller('FileListController', ['CorePublisherService', '$location', function(CorePublisherService, $location) {
 		var self = this;
 		self.files = [];

 		CorePublisherService.allFiles().then(function(resp) {
 			self.files = resp.data;
 			console.log('Files loaded successfully...');
 		}, function(errorResp) {
 			console.error('Error fetching files...');
 		});
 	}])

 	.controller('LinkListController', ['CorePublisherService', '$location', function(CorePublisherService, $location) {
 		var self = this;
 		self.links = [];

 		CorePublisherService.allWebLinks().then(function(resp) {
 			self.links = resp.data;
 			console.log('Liks loaded successfully');
 		}, function(errorResp) {
 			console.error('Error fetching links...');
 		});

 	}])

