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
 			var selectedCountry = AuthenticationService.getSelectedCountry();

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
	 		CorePublisherService.allCategories(selectedCountry.code).then(function(resp) {
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
			var selectedCountry = AuthenticationService.getSelectedCountry();

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
	 		CorePublisherService.allCategories(selectedCountry.code).then(function(resp) {
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
			var selectedCountry = AuthenticationService.getSelectedCountry();
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
	 		CorePublisherService.allCategories(selectedCountry.code).then(function(resp) {
	 			self.categories = resp.data;
	 		}, function(errorResp) {
	 			console.error('Failed to fetch categories:');
	 		});

	 		self.create = function() {
	 			
	 			if (self.isAuthenticated) {

	 				var fd = new FormData();

	 				fd.append('title', self.newLink.title);
	 				fd.append('description', self.newLink.description);
	 				fd.append('thumbnail', self.newLink.thumbnail);
	 				fd.append('link', self.newLink.link);
	 				fd.append('pub_date', self.newLink.pub_date);
	 				fd.append('expiry_date', self.newLink.expiry_date);
	 				fd.append('categories', self.newLink.categories);

	 				CorePublisherService.newWebLink(fd).then(function(resp) {
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
 		['AuthenticationService', 'CorePublisherService', '$location', 'ngDialog',function(AuthenticationService, CorePublisherService, $location, ngDialog) {

 		//ToDO -Implement
 		var self = this;
 		var selectedCountry = AuthenticationService.getSelectedCountry();

 		self.presentations = [];

 		if (AuthenticationService.isAuthenticated()) {


	 		//fetch all presentations
	 		CorePublisherService.allPresentations(selectedCountry.code).then(function(resp) {
	 			self.presentations = resp.data;
	 			console.log('allPresentations loaded successfully:');
	 		}, function(errorResp) {
	 			//MessageNotificationService.error(errorResp.error);
	 			console.error('Error fetching data...');
	 		});
	 	}
 	}])

 	.controller('FileListController', ['AuthenticationService', 'CorePublisherService', '$location', function(AuthenticationService, CorePublisherService, $location) {
 		var self = this;
 		var selectedCountry = AuthenticationService.getSelectedCountry();

 		self.files = [];

 		if (AuthenticationService.isAuthenticated()) {

	 		CorePublisherService.allFiles(selectedCountry.code).then(function(resp) {
	 			self.files = resp.data;
	 			console.log('Files loaded successfully...');
	 		}, function(errorResp) {
	 			console.error('Error fetching files...');
	 		});
	 	}
 	}])

 	.controller('LinkListController', ['AuthenticationService','CorePublisherService', '$location', function(AuthenticationService, CorePublisherService, $location) {
 		var self = this;
 		var selectedCountry = AuthenticationService.getSelectedCountry();
 		self.links = [];

 		if (AuthenticationService.isAuthenticated()) {

	 		CorePublisherService.allWebLinks(selectedCountry.code).then(function(resp) {
	 			self.links = resp.data;
	 			console.log('Liks loaded successfully');
	 		}, function(errorResp) {
	 			console.error('Error fetching links...');
	 		});
	 	}
 	}])

 	.controller('PresentationDetailController', 
 		['AuthenticationService', 'CorePublisherService', '$location', '$routeParams', 'ngDialog', function(AuthenticationService, CorePublisherService, $location, $routeParams, ngDialog) {

 			var self = this;
 			var selectedCountry = AuthenticationService.getSelectedCountry();

 			self.isAuthenticated = AuthenticationService.isAuthenticated();
 			self.objectID = $routeParams.presentationId;
 			self.object = {};
 			self.categories = [];

 			//fetch all categories and make them availbale for use
	 		CorePublisherService.allCategories(selectedCountry.code).then(function(resp) {
	 			self.categories = resp.data;
	 		}, function(errorResp) {
	 			console.error('Failed to fetch categories:');
	 		});

 			self.retrieve = function(objID) {
 				CorePublisherService.fetchPresentation(objID).then(function(resp) {
 					self.object = resp.data;
 					console.log('Object fecthed and set correctly:'+  JSON.stringify(self.object));
 				}, function(errorResp) {
 					console.error('Failed to load resource from the remote server');
 				});
 			};

 			self.update = function() {
	 			if (self.isAuthenticated) {

	 				var fd = new FormData();
	 				//var isMultipart = false;

	 				fd.append('title', self.object.title);
	 				fd.append('description', self.object.description);

	 				//Hack---> Append the file attribute only if updated
	 				if (typeof(self.object.thumbnail) === 'object') {
	 					console.log('SENDING MULTIPART');

	 					fd.append('thumbnail', self.object.thumbnail);
	 					//isMultipart = true;
	 				}

	 				if (typeof(self.object.file) === 'object') {
	 					console.log('SENDING MULTIPART');
	 					fd.append('file', self.object.file);
	 				}

	 				fd.append('pub_date', self.object.pub_date);
	 				fd.append('expiry_date', self.object.expiry_date);
	 				fd.append('categories', self.object.categories);

	 				CorePublisherService.updatePresentation(self.objectID, fd).then(function(resp) {
	 					console.log('Presentation updated successfully');
	 					//$location.url('/links');

	 				}, function(errorResp) {
	 					console.error('Failed to update presentation:');
	 				});

		 		} else {
		 			//redirect to the login page
		 			$location.url('#/login');
		 		}
 			};

 			self.delete = function() {
 				if (self.isAuthenticated) {
	 				CorePublisherService.deletePresentation(self.objectID).then(function(resp) {
	 					console.log('Presentation deleted successfully');
	 					$location.url('/presentations');

	 				}, function(errorResp) {
	 					console.error('Failed to delete the presentation');
	 				});
	 			} else {
	 				console.error('Does not have permission');
	 			}
 			};

 			//fetch the object after instanciation
 			self.retrieve(self.objectID);

 	}])

	.controller('FileDetailController', 
 		['AuthenticationService', 'CorePublisherService', '$location', '$routeParams', 'ngDialog', function(AuthenticationService, CorePublisherService, $location, $routeParams, ngDialog) {

 			var self = this;
 			var selectedCountry = AuthenticationService.getSelectedCountry();

 			self.isAuthenticated = AuthenticationService.isAuthenticated();
 			self.objectID = $routeParams.fileId;
 			self.object = {};
 			self.categories = [];

 			//fetch all categories and make them availbale for use
	 		CorePublisherService.allCategories(selectedCountry.code).then(function(resp) {
	 			self.categories = resp.data;
	 		}, function(errorResp) {
	 			console.error('Failed to fetch categories:');
	 		});

 			self.retrieve = function(objID) {
 				CorePublisherService.fetchFile(objID).then(function(resp) {
 					self.object = resp.data;
 					console.log('Object fecthed and set correctly');
 				}, function(errorResp) {
 					console.error('Failed to load resource from the remote server');
 				});
 			};

 			self.update = function() {
	 			if (self.isAuthenticated) {

	 				var fd = new FormData();
	 				//var isMultipart = false;

	 				fd.append('title', self.object.title);
	 				fd.append('description', self.object.description);

	 				//Hack---> Append the file attribute only if updated
	 				if (typeof(self.object.thumbnail) === 'object') {
	 					console.log('SENDING MULTIPART');

	 					fd.append('thumbnail', self.object.thumbnail);
	 					//isMultipart = true;
	 				}

	 				if (typeof(self.object.file) === 'object') {
	 					fd.append('file', self.object.file);
	 				}

	 				fd.append('pub_date', self.object.pub_date);
	 				fd.append('expiry_date', self.object.expiry_date);
	 				fd.append('categories', self.object.categories);

	 				CorePublisherService.updateFile(self.objectID, fd).then(function(resp) {
	 					console.log('File updated successfully');
	 					//$location.url('/links');

	 				}, function(errorResp) {
	 					console.error('Failed to update file:');
	 				});

		 		} else {
		 			//redirect to the login page
		 			$location.url('/login');
		 		}
 			};


 			self.delete = function() {
 				if (self.isAuthenticated) {
	 				CorePublisherService.deleteFile(self.objectID).then(function(resp) {
	 					console.log('File deleted successfully');
	 					$location.url('/files');

	 				}, function(errorResp) {
	 					console.error('Failed to delete the file');
	 				});
	 			} else {
	 				console.error('Does not have permission');
	 			}
 			};

 			//fetch the object after instanciation
 			self.retrieve(self.objectID);

 	}])

	.controller('WeblinkDetailController', 
 		['AuthenticationService', 'CorePublisherService', '$location', '$routeParams', 'ngDialog', function(AuthenticationService, CorePublisherService, $location, $routeParams, ngDialog) {

 			var self = this;
 			var selectedCountry = AuthenticationService.getSelectedCountry();

 			self.isAuthenticated = AuthenticationService.isAuthenticated();
 			self.objectID = $routeParams.linkID;
 			self.categories = [];
 			self.object = {};

 			//fetch all categories and make them availbale for use
	 		CorePublisherService.allCategories(selectedCountry.code).then(function(resp) {
	 			self.categories = resp.data;
	 		}, function(errorResp) {
	 			console.error('Failed to fetch categories:');
	 		});

 			self.retrieve = function(objID) {
 				CorePublisherService.fetchWeblink(objID).then(function(resp) {
 					self.object = resp.data;
 					console.log('Object fecthed and set correctly: '+ JSON.stringify(self.object));
 				}, function(errorResp) {
 					console.error('Failed to load resource from the remote server');
 				});
 			};

 			self.update = function() {
	 			if (self.isAuthenticated) {

	 				var fd = new FormData();
	 				//var isMultipart = false;

	 				fd.append('title', self.object.title);
	 				fd.append('description', self.object.description);
	 				
	 				fd.append('link', self.object.link);

	 				//Hack---> Append the file attribute only if updated
	 				if (typeof(self.object.thumbnail) === 'object') {
	 					console.log('SENDING MULTIPART');

	 					fd.append('thumbnail', self.object.thumbnail);
	 					//isMultipart = true;
	 				}

	 				fd.append('pub_date', self.object.pub_date);
	 				fd.append('expiry_date', self.object.expiry_date);
	 				fd.append('categories', self.object.categories);

	 				CorePublisherService.updateWeblink(self.objectID, fd).then(function(resp) {
	 					console.log('Link updated successfully');
	 					//$location.url('/links');

	 				}, function(errorResp) {
	 					console.error('Failed to create Presdentation:');
	 				});

		 		} else {
		 			//redirect to the login page
		 			$location.url('/login');
		 		}
 			};

 			self.delete = function() {
 				if (self.isAuthenticated) {
	 				CorePublisherService.deleteWeblink(self.objectID).then(function(resp) {
	 					$location.url('/links');

	 				}, function(errorResp) {
	 					console.error('Failed to delete the link');
	 				});
	 			} else {
	 				console.error('Does not have permission');
	 			}
 			};

 			self.isSelectedCategory = function(c) {
 				if (self.object) {
 					return self.object.categories.indexOf(c.id) > -1;
 				}
 				return false;
 			};

 			//fetch the object after instanciation
 			self.retrieve(self.objectID);
 	}])

	.controller('CategoryListController', 
		['AuthenticationService', 'CorePublisherService', '$location', function(AuthenticationService, CorePublisherService, $location) {
		var self = this;
		var selectedCountry = AuthenticationService.getSelectedCountry();

		self.categories = [];

		if (AuthenticationService.isAuthenticated()) {
			//var user = AuthenticationService.getAuthenticatedUser();

			CorePublisherService.allCategories(selectedCountry.code).then(function(resp) {
				self.categories = resp.data;
				console.log('categories load successfully: '+ JSON.stringify(self.categories));
			}, function(errorResp) {
				console.error('Failed loading categories...');
			});
		}
	}])

	.controller('CategoryCreateController', 
		['AuthenticationService', 'CorePublisherService', '$location', function(AuthenticationService, CorePublisherService, $location) {

		var self = this;
		self.isAuthenticated = AuthenticationService.isAuthenticated();

		self.newCategory = {
 			name: '',
 			description: '',
 			picture: '',
 			priority: 0
 		};

 		self.create = function() {
 			
 			if (self.isAuthenticated) {

 				var fd = new FormData();

 				fd.append('name', self.newCategory.name);
 				fd.append('description', self.newCategory.description);
 				fd.append('priority', self.newCategory.priority);
 				fd.append('picture', self.newCategory.picture);

 				CorePublisherService.newCategory(fd).then(function(resp) {
 					console.log('Product Category created successfully');
 					$location.url('/categories');

 				}, function(errorResp) {
 					console.error('Failed to create Category:');
 				});

	 		} else {
	 			//redirect to the login page
	 			$location.url('/login');
	 		}
 		};
	}])

	.controller('CategoryDetailController', 
		['AuthenticationService', 'CorePublisherService', '$location', '$routeParams', 'ngDialog', function(AuthenticationService, CorePublisherService, $location, $routeParams, ngDialog) {

		var self = this;

		self.isAuthenticated = AuthenticationService.isAuthenticated();
		self.objectID = $routeParams.categoryId;
		self.object = {};

		self.retrieve = function(objID) {
			CorePublisherService.fetchCategory(objID).then(function(resp) {
				self.object = resp.data;
				console.log('Object fecthed and set correctly: '+ JSON.stringify(self.object));
			}, function(errorResp) {
				console.error('Failed to load resource from the remote server');
			});
		};

		self.update = function() {
			if (self.isAuthenticated) {
				
				var fd = new FormData();
				//var isMultipart = false;

				fd.append('name', self.object.name);
				fd.append('description', self.object.description);
				fd.append('priority', self.object.priority);

				//Hack---> Append the file attribute only if updated
				if (typeof(self.object.picture) === 'object') {
					console.log('SENDING MULTIPART');

					fd.append('picture', self.object.picture);
					//isMultipart = true;
				}

				CorePublisherService.updateCategory(self.objectID, fd).then(function(resp) {
					console.log('Category updated successfully');
					//$location.url('/links');

				}, function(errorResp) {
					console.error('Failed to update category');
				});

	 		} else {
	 			//redirect to the login page
	 			$location.url('/login');
	 		}
		};

		self.delete = function() {
			if (self.isAuthenticated) {
				CorePublisherService.deleteCategory(self.objectID).then(function(resp) {
					$location.url('/categories');

				}, function(errorResp) {
					console.error('Failed to delete category');
				});
			} else {
				console.error('Does not have permission');
			}
		};

		//fetch the object after instanciation
		self.retrieve(self.objectID);
	}]);