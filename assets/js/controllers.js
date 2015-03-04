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
		['AuthenticationService', '$location', 'toastr', function(AuthenticationService, $location, toastr) {

		var self = this;

		self.isCountrySet = !!AuthenticationService.getSelectedCountry();
		self.isAuthenticated = AuthenticationService.isAuthenticated();
		self.canDisplayMeny = false;
		self.loading = false;

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
				//$location.url('/login');	
				if (self.isAuthenticated) {
					$location.url('/dashboard');
				}else {
					$location.url('/login');
				}
			}
		};

		self.logout = function() {
			AuthenticationService.logout().then(function(resp) {
				//redirect to loginView
				AuthenticationService.unAuthenticate();
				
				toastr.success('Your are now successfully logged out', 'Thanks!');
				window.location = '/';

			}, function(errorResp) {
				toastr.error('An error occured while logging out!', 'Logout Error!');
			});
		};

	}])
 	.controller('RegistrationController', 
 		['AuthenticationService', '$location', 'toastr', function(AuthenticationService, $location, toastr) {

 		var self = this;

 		self.delay = 0;
		self.minDuration = 0;
		self.message = "";
		self.backdrop = true;
		self.promise = null;

 		self.countries = [
			{name: 'NORWAY', code: 'NO'},
			{name: 'SWEDEN', code: 'SE'},
			{name: 'DANMARK', code: 'DK'}
		];

		self.email = "";
		self.password = "";
		self.countryCode = "";
		
		self.register = function() {
			self.message = 'Registering new user...';
			self.promise = AuthenticationService.register(self.email, self.password, self.countryCode).then(function(resp) {

				self.promise = AuthenticationService.login(self.email, self.password).then(function(resp) {
					AuthenticationService.setAuthenticatedUser(resp.data);
					window.location = '/';
					//$location.url('#/files');
				}, function(errorResp) {
					toastr.error('Error authenticating: '+ errorResp.data.message, 'Authentication failed!');
				});
			}, function(errorResp) {
				toastr.error('Error authenticating: '+ errorResp.data.message, 'Authentication failed!');
			});
		};

		self.activate = function() {
			if (AuthenticationService.isAuthenticated()) {
				$location.url('/');
			};
		};

		self.activate();
 	}])

 	.controller('LoginController', 
 		['AuthenticationService', '$location', 'toastr', function(AuthenticationService, $location, toastr) {

 		var self = this;

 		//configure the busy loadingView
 		self.delay = 0;
		self.minDuration = 0;
		self.message = "";
		self.backdrop = true;
		self.promise = null;

 		self.activate = function() {
 			if (AuthenticationService.isAuthenticated()) {
 				$location.url('/');
 			}
 		};

 		self.login = function() {
 			self.message = 'Authenticating...';

 			self.promise = AuthenticationService.login(self.email, self.password).then(function(resp) {

				AuthenticationService.setAuthenticatedUser(resp.data);
				window.location = '/';
			}, function(errorResp) {
				toastr.error('Error authenticating: '+ errorResp.data.message, 'Authentication failed!');
			});
 		};

 		self.activate();
 	}])

 	.controller('DashboardController', [function() {
 		//TODO
 		var self = this;
 		self.message = 'This is the dashboard: Content coming soon...';
 		window.location = '#/files';
 	}])
	.controller('FileCreateController', 
		['AuthenticationService', 'CorePublisherService', '$location', 'toastr', function(AuthenticationService, CorePublisherService, $location, toastr) {
			var self = this;
			self.delay = 0;
			self.minDuration = 0;
			self.message = "";
			self.backdrop = true;
			self.promise = null;

			self.selectedCountry = AuthenticationService.getSelectedCountry();

			self.isAuthenticated = AuthenticationService.isAuthenticated();
			self.categories = [];

			self.audiences = [
				{name: 'Developers', code: 'DEVELOPER'},
				{name: 'Lilly Users', code: 'LILLY_USER'},
				{code: 'PUBLIC', name: 'Public audience'}
			];

			self.countries = [
				{name: 'norway', code: 'NO'},
				{name: 'sweden', code: 'SE'},
				{name: 'danmark', code: 'DK'}
			];

			self.newFile = {
	 			title: '',
	 			description: '',
	 			thumbnail: '',
	 			file: '',
	 			pub_date: '',
	 			expiry_date: '',
	 			zink_number: 0,
	 			country: self.selectedCountry.code,
	 			categories: [],
	 			audience: ''
	 		};

	 		self.today = new Date();
	 		self.dateFormat = 'yyyy-MM-dd';
	 		self.pubDatePickerOpened = false;
	 		self.expiryDatePickerOpened = false;

	 		self.openPubDatePicker = function($event) {
			    $event.preventDefault();
			    $event.stopPropagation();

			    self.pubDatePickerOpened = true;
			 };

			 self.openExpiryDatePicker = function($event) {
			    $event.preventDefault();
			    $event.stopPropagation();

			    self.expiryDatePickerOpened = true;
			 };

	 		//fetch all categories and make them availbale for use
	 		self.message = "Fetching product categories...";
	 		self.promise = CorePublisherService.allCategories(self.selectedCountry.code).then(function(resp) {
	 			self.categories = resp.data;
	 		}, function(errorResp) {
	 			toastr.error('Error fetching product categories: '+ errorResp.data.detail, 'Error!');
	 		});

	 		self.create = function() {

	 			if (self.isAuthenticated) {

	 				var fd = new FormData();

	 				fd.append('title', self.newFile.title);
	 				fd.append('description', self.newFile.description);
	 				fd.append('thumbnail', self.newFile.thumbnail);
	 				fd.append('file', self.newFile.file);
	 				fd.append('pub_date', JSON.stringify(self.newFile.pub_date).replace('"', '').replace('"', '').trim());
	 				fd.append('expiry_date', JSON.stringify(self.newFile.expiry_date).replace('"', '').replace('"', '').trim());
	 				fd.append('zink_number', self.newFile.zink_number);
	 				fd.append('country', self.newFile.country);
	 				fd.append('categories', self.newFile.categories);
	 				fd.append('audience', self.newFile.audience);

	 				self.message = "Please wait while we're uploading your file...";
	 				self.promise = CorePublisherService.newFile(fd).then(function(resp) {
	 					toastr.success('Resource created successfully!', 'Success!');
	 					$location.url('/files');

	 				}, function(errorResp) {
	 					toastr.error('Error: '+ errorResp.data.detail, 'Error!');
	 				});

		 		} else {
		 			//redirect to the login page
		 			$location.url('/login');
		 		}
	 		};
	}])

	.controller('LinkCreateController', 
		['AuthenticationService', 'CorePublisherService', '$location', 'toastr', function(AuthenticationService, CorePublisherService, $location, toastr) {
			var self = this;

			self.delay = 0;
			self.minDuration = 0;
			self.message = "Please wait...";
			self.backdrop = true;
			self.promise = null;

			self.selectedCountry = AuthenticationService.getSelectedCountry();
			self.isAuthenticated = AuthenticationService.isAuthenticated();
			self.categories = [];

			self.audiences = [
				{name: 'Developers', code: 'DEVELOPER'},
				{name: 'Lilly Users', code: 'LILLY_USER'},
				{code: 'PUBLIC', name: 'Public audience'}
			];

			self.countries = [
				{name: 'norway', code: 'NO'},
				{name: 'sweden', code: 'SE'},
				{name: 'danmark', code: 'DK'}
			];

			self.newLink = {
	 			title: '',
	 			description: '',
	 			thumbnail: '',
	 			link: '',
	 			pub_date: '',
	 			expiry_date: '',
	 			zink_number: 0,
	 			country: self.selectedCountry.code,
	 			categories: [],
	 			audience: ''
	 		};

	 		self.today = new Date();
	 		self.dateFormat = 'yyyy-MM-dd';
	 		self.pubDatePickerOpened = false;
	 		self.expiryDatePickerOpened = false;

	 		self.openPubDatePicker = function($event) {
			    $event.preventDefault();
			    $event.stopPropagation();

			    self.pubDatePickerOpened = true;
			};

			 self.openExpiryDatePicker = function($event) {
			    $event.preventDefault();
			    $event.stopPropagation();

			    self.expiryDatePickerOpened = true;
			};

	 		//fetch all categories and make them availbale for use
	 		self.message = "Fatching product categories...";
	 		CorePublisherService.allCategories(self.selectedCountry.code).then(function(resp) {
	 			self.categories = resp.data;
	 		}, function(errorResp) {
	 			toastr.error('Product categories not availbale: '+ errorResp.data.detail, 'Error!');
	 		});

	 		self.create = function() {
	 			
	 			if (self.isAuthenticated) {

	 				var fd = new FormData();

	 				fd.append('title', self.newLink.title);
	 				fd.append('description', self.newLink.description);
	 				fd.append('thumbnail', self.newLink.thumbnail);
	 				fd.append('link', self.newLink.link);
	 				fd.append('pub_date', JSON.stringify(self.newLink.pub_date).replace('"', '').replace('"', '').trim());
	 				fd.append('expiry_date', JSON.stringify(self.newLink.expiry_date).replace('"', '').replace('"', '').trim());
	 				fd.append('zink_number', self.newLink.zink_number);
	 				fd.append('country', self.newLink.country);
	 				fd.append('categories', self.newLink.categories);
	 				fd.append('audience', self.newLink.audience);

	 				self.message = "Please wait a moment...";
	 				self.promise = CorePublisherService.newWebLink(fd).then(function(resp) {
	 					toastr.success('Resource created successfully!', 'Success!');
	 					$location.url('/links');

	 				}, function(errorResp) {
	 					toastr.error('Error creating resource: '+ errorResp.data.detail, 'Error!');
	 				});

		 		} else {
		 			//redirect to the login page
		 			$location.url('/login');
		 		}
	 		};
	}])
 	.controller('FileListController', ['AuthenticationService', 'CorePublisherService', '$location', 'toastr', function(AuthenticationService, CorePublisherService, $location, toastr) {
 		var self = this;
 		self.delay = 0;
		self.minDuration = 0;
		self.message = "Fetching data...";
		self.backdrop = true;
		self.promise = null;

 		var selectedCountry = AuthenticationService.getSelectedCountry();

 		self.files = [];

 		if (AuthenticationService.isAuthenticated()) {

	 		self.promise = CorePublisherService.allFiles(selectedCountry.code).then(function(resp) {
	 			self.files = resp.data;
	 		}, function(errorResp) {
	 			toastr.error('Error fetching data: '+ errorResp.data.detail, 'Error!');
	 		});
	 	}
 	}])

 	.controller('LinkListController', ['AuthenticationService','CorePublisherService', '$location', 'toastr', function(AuthenticationService, CorePublisherService, $location, toastr) {
 		var self = this;
 		self.delay = 0;
		self.minDuration = 0;
		self.message = "Fetching data...";
		self.backdrop = true;
		self.promise = null;

 		var selectedCountry = AuthenticationService.getSelectedCountry();
 		self.links = [];

 		if (AuthenticationService.isAuthenticated()) {

	 		self.promise = CorePublisherService.allWebLinks(selectedCountry.code).then(function(resp) {
	 			self.links = resp.data;
	 		}, function(errorResp) {
	 			toastr.error('Error fetching data: '+ errorResp.data.detail, 'Error!');
	 		});
	 	}
 	}])

	.controller('FileDetailController', 
 		['AuthenticationService', 'CorePublisherService', '$location', '$routeParams', 'ngDialog', 'toastr', function(AuthenticationService, CorePublisherService, $location, $routeParams, ngDialog, toastr) {

 			var self = this;

 			self.delay = 0;
			self.minDuration = 0;
			self.message = "Updating...";
			self.backdrop = true;
			self.promise = null;

 			self.selectedCountry = AuthenticationService.getSelectedCountry();

 			self.isAuthenticated = AuthenticationService.isAuthenticated();
 			self.objectID = $routeParams.fileId;
 			self.object = {};

 			self.categories = [];

 			self.audiences = [
				{name: 'Developers', code: 'DEVELOPER'},
				{name: 'Lilly Users', code: 'LILLY_USER'},
				{code: 'PUBLIC', name: 'Public audience'}
			];

			self.countries = [
				{name: 'norway', code: 'NO'},
				{name: 'sweden', code: 'SE'},
				{name: 'danmark', code: 'DK'}
			];

			self.today = new Date();
	 		self.dateFormat = 'yyyy-MM-dd';
	 		self.pubDatePickerOpened = false;
	 		self.expiryDatePickerOpened = false;

	 		self.openPubDatePicker = function($event) {
			    $event.preventDefault();
			    $event.stopPropagation();

			    self.pubDatePickerOpened = true;
			};

			 self.openExpiryDatePicker = function($event) {
			    $event.preventDefault();
			    $event.stopPropagation();

			    self.expiryDatePickerOpened = true;
			};

 			//fetch all categories and make them availbale for use
 			self.message = "Fetching product categories...";
	 		self.promise = CorePublisherService.allCategories(self.selectedCountry.code).then(function(resp) {
	 			self.categories = resp.data;
	 		}, function(errorResp) {
	 			toastr.warning('Product categories not available!', 'Warning!');
	 		});

 			self.retrieve = function(objID) {
 				self.message = "Updating...";
 				self.promise = CorePublisherService.fetchFile(objID).then(function(resp) {
 					self.object = resp.data;

 				}, function(errorResp) {
 					toastr.error('Failed to load resource from the remote server: '+ errorResp.data.detail, 'Error!');
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
	 					fd.append('thumbnail', self.object.thumbnail);
	 					//isMultipart = true;
	 				}

	 				if (typeof(self.object.file) === 'object') {
	 					fd.append('file', self.object.file);
	 				}

	 				fd.append('pub_date', JSON.stringify(self.object.pub_date).replace('"', '').replace('"', '').trim());
	 				fd.append('expiry_date', JSON.stringify(self.object.expiry_date).replace('"', '').replace('"', '').trim());
	 				fd.append('zink_number', self.object.zink_number);
	 				fd.append('country', self.object.country);
	 				fd.append('categories', self.object.categories);
	 				fd.append('audience', self.object.audience);

	 				self.message = "Updating...";
	 				self.promise = CorePublisherService.updateFile(self.objectID, fd).then(function(resp) {
	 					toastr.success('File updated successfully', 'Success!');
	 				}, function(errorResp) {
	 					toastr.error('An error occured while updating this file: '+ errorResp.data.detail, 'Error!');
	 				});

		 		} else {
		 			//redirect to the login page
		 			$location.url('/login');
		 		}
 			};


 			self.delete = function() {
 				if (self.isAuthenticated) {
 					self.message = "Deleting...";
	 				self.promise = CorePublisherService.deleteFile(self.objectID).then(function(resp) {
	 					toastr.success('File deleted successfully', 'Success!');
	 					$location.url('/files');

	 				}, function(errorResp) {
	 					toastr.error('Failed to delete the file: '+ errorResp.data.detail, 'error');
	 				});
	 			} else {
	 				toastr.warning('You are not allowed to perform this action', 'warning');
	 			}
 			};

 			//fetch the object after instanciation
 			self.retrieve(self.objectID);

 	}])

	.controller('WeblinkDetailController', 
 		['AuthenticationService', 'CorePublisherService', '$location', '$routeParams', 'ngDialog','toastr', function(AuthenticationService, CorePublisherService, $location, $routeParams, ngDialog, toastr) {

 			var self = this;
 			self.delay = 0;
			self.minDuration = 0;
			self.message = "Updating...";
			self.backdrop = true;
			self.promise = null;

 			self.selectedCountry = AuthenticationService.getSelectedCountry();

 			self.isAuthenticated = AuthenticationService.isAuthenticated();
 			self.objectID = $routeParams.linkID;
 			self.categories = [];

 			self.audiences = [
				{name: 'Developers', code: 'DEVELOPER'},
				{name: 'Lilly Users', code: 'LILLY_USER'},
				{code: 'PUBLIC', name: 'Public audience'}
			];

			self.countries = [
				{name: 'norway', code: 'NO'},
				{name: 'sweden', code: 'SE'},
				{name: 'danmark', code: 'DK'}
			];

			self.today = new Date();
	 		self.dateFormat = 'yyyy-MM-dd';
	 		self.pubDatePickerOpened = false;
	 		self.expiryDatePickerOpened = false;

	 		self.openPubDatePicker = function($event) {
			    $event.preventDefault();
			    $event.stopPropagation();

			    self.pubDatePickerOpened = true;
			};

			 self.openExpiryDatePicker = function($event) {
			    $event.preventDefault();
			    $event.stopPropagation();

			    self.expiryDatePickerOpened = true;
			};

 			self.object = {};

 			//fetch all categories and make them availbale for use
 			self.message = "Fetching product categories...";
	 		self.promise = CorePublisherService.allCategories(self.selectedCountry.code).then(function(resp) {
	 			self.categories = resp.data;
	 		}, function(errorResp) {
	 			toastr.warning('Product categories not availbale: '+ errorResp.data.detail, 'warning');
	 		});

 			self.retrieve = function(objID) {
 				self.message = "Updating...";
 				self.promise = CorePublisherService.fetchWeblink(objID).then(function(resp) {
 					self.object = resp.data;
 				}, function(errorResp) {
 					toastr.error('Failed fetching Weblink: '+ errorResp.data.detail, 'Error!');
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

	 					fd.append('thumbnail', self.object.thumbnail);
	 					//isMultipart = true;
	 				}

	 				fd.append('pub_date', JSON.stringify(self.object.pub_date).replace('"', '').replace('"', '').trim());
	 				fd.append('expiry_date', JSON.stringify(self.object.expiry_date).replace('"', '').replace('"', '').trim());
	 				fd.append('zink_number', self.object.zink_number);
	 				fd.append('country', self.object.country);
	 				fd.append('categories', self.object.categories);
	 				fd.append('audience', self.object.audience);

	 				self.message = "Updating...";
	 				self.promise = CorePublisherService.updateWeblink(self.objectID, fd).then(function(resp) {
	 					toastr.success('Link updated successfully', 'success!')

	 				}, function(errorResp) {
	 					toastr.error('Failed to create weblink:'+ errorResp.data.detail, 'Error!');
	 				});

		 		} else {
		 			//redirect to the login page
		 			$location.url('/login');
		 		}
 			};

 			self.delete = function() {
 				if (self.isAuthenticated) {
 					self.message = "Deleting";
	 				self.promise = CorePublisherService.deleteWeblink(self.objectID).then(function(resp) {
	 					toastr.success('Web link deleted successfully', 'Success');
	 					$location.url('/links');

	 				}, function(errorResp) {
	 					toastr.error('Error occured while deleting...:'+ errorResp.data.detail, 'Error!');
	 				});
	 			} else {
	 				toastr.warning('You are allowed to perform this action', 'Warning!');
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
		['AuthenticationService', 'CorePublisherService', '$location','toastr', function(AuthenticationService, CorePublisherService, $location, toastr) {
		var self = this;

		self.delay = 0;
		self.minDuration = 0;
		self.message = "";
		self.backdrop = true;
		self.promise = null;

		var selectedCountry = AuthenticationService.getSelectedCountry();

		self.categories = [];

		if (AuthenticationService.isAuthenticated()) {
			//var user = AuthenticationService.getAuthenticatedUser();
			self.message = "Fetching product categories...";
			self.promise = CorePublisherService.allCategories(selectedCountry.code).then(function(resp) {
				self.categories = resp.data;
			}, function(errorResp) {
				toastr.error('Error occured while fetching products: '+ errorResp.data.detail, 'Error!');
			});
		}
	}])

	.controller('CategoryCreateController', 
		['AuthenticationService', 'CorePublisherService', '$location', 'toastr', function(AuthenticationService, CorePublisherService, $location, toastr) {

		var currentCountry = AuthenticationService.getSelectedCountry();

		var self = this;
		self.delay = 0;
		self.minDuration = 0;
		self.msg = "Please wait a moment...";
		self.backdrop = true;
		self.promise = null;

		self.isAuthenticated = AuthenticationService.isAuthenticated();

		self.newCategory = {
 			name: '',
 			description: '',
 			picture: '',
 			priority: 0,
 			country: currentCountry.code
 		};

 		self.create = function() {
 			
 			if (self.isAuthenticated) {

 				var fd = new FormData();

 				fd.append('name', self.newCategory.name);
 				fd.append('description', self.newCategory.description);
 				fd.append('priority', self.newCategory.priority);
 				fd.append('picture', self.newCategory.picture);
 				fd.append('icon', self.newCategory.icon);
 				fd.append('country', self.newCategory.country);

 				self.promise = CorePublisherService.newCategory(fd).then(function(resp) {
 					toastr.success('Product created successfully', 'Success!!');
 					$location.url('/categories');

 				}, function(errorResp) {
 					toastr.error('Error occured while creating product: '+ errorResp.data.detail, 'Error!');
 				});

	 		} else {
	 			//redirect to the login page
	 			$location.url('/login');
	 		}
 		};
	}])

	.controller('CategoryDetailController', 
		['AuthenticationService', 'CorePublisherService', '$location', '$routeParams', 'ngDialog', 'toastr', function(AuthenticationService, CorePublisherService, $location, $routeParams, ngDialog, toastr) {

		var self = this;
		self.delay = 0;
		self.minDuration = 0;
		self.msg = "Updating...";
		self.backdrop = true;
		self.promise = null;

		self.isAuthenticated = AuthenticationService.isAuthenticated();
		self.selectedCountry = AuthenticationService.getSelectedCountry();
		self.objectID = $routeParams.categoryId;
		self.object = {};

		self.categorizedFiles = null;
		self.categorizedWeblinks = null;

		self.retrieve = function(objID) {
			self.promise = CorePublisherService.fetchCategory(objID).then(function(resp) {
				self.object = resp.data;
			}, function(errorResp) {
				toastr.warning('Product categories not availbale: '+ errorResp.data.detail, 'Warning!');
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
					fd.append('picture', self.object.picture);
				}

				if (typeof(self.object.icon) === 'object') {
				
					fd.append('icon', self.object.icon);
				}

				self.promise = CorePublisherService.updateCategory(self.objectID, fd).then(function(resp) {
					toastr.success('Product Category updated successfully!', 'Success!');

				}, function(errorResp) {
					toastr.error('An Error occurred while updating! :'+ errorResp.data.detail, 'Error!');
				});

	 		} else {
	 			//redirect to the login page
	 			$location.url('/login');
	 		}
		};

		self.delete = function() {
			if (self.isAuthenticated) {
				self.msg = "Deleting...";
				self.promise = CorePublisherService.deleteCategory(self.objectID).then(function(resp) {
					toastr.success('Product category deleted successfully!', 'success');
					$location.url('/categories');

				}, function(errorResp) {
					toastr.error('Error occured while deleting...: '+ errorResp.data.detail, 'Error!');
				});
			} else {
				toastr.warning('You are not allowed to perform this action', 'Error!');
			}
		};

		self.getCategorizedFiles = function() {

			console.log('Fetching...');
			if (self.categorizedFiles === null) {
				if (self.object !== null) {

					self.msg = 'Fetching files in thie category';
					self.promise = CorePublisherService.fetchCategorizedFiles(self.objectID, self.selectedCountry.code).then(function(resp) {
						self.categorizedFiles = resp.data;
						
					}, function(errorResp) {
						toastr.error('An error occured while fetching data: '+ errorResp.data.detail, 'Error');
					});
				}
			}
		};

		self.getCategorizedWeblinks = function() {
			console.log('Fetching...');

			if (self.categorizedWeblinks === null) {
				if (self.object !== null) {

					self.msg = 'Fetching links in thie category';
					self.promise = CorePublisherService.fetchCategorizedWeblinks(self.objectID, self.selectedCountry.code).then(function(resp) {

						self.categorizedWeblinks = resp.data;
					}, function(errorResp) {
						toastr.error('An error occured while fetching data: '+ errorResp.data.detail, 'Error');
					});
				}
			}
		};

		self.updateFilesPositions = function() {

			for (var i = 0; i < self.categorizedFiles.length; i++) {
				var f = self.categorizedFiles[i];

				self.msg = 'Updating position of: '+ f.file_resource.title;
				self.promise = CorePublisherService.updateFilePosition(f.id, {position: f.position}).then(function(resp) {
					console.log('Update complete...');
				}, function(errorResp) {
					toastr.error('An error occured while updating position '+ errorResp.data.detail, 'Error');
				});
			}
		};

		self.updateWeblinksPositions = function() {
			
			for (var i = 0; i < self.categorizedWeblinks.length; i++) {
				var f = self.categorizedWeblinks[i];

				self.msg = 'Updating position of: '+ f.weblink.title;
				self.promise = CorePublisherService.updateWeblinkPosition(f.id, {position: f.position}).then(function(resp) {
					console.log('Update complete...');
				}, function(errorResp) {
					toastr.error('An error occured while updating position '+ errorResp.data.detail, 'Error');
				});
			}
		};

		//fetch the object after instanciation
		self.retrieve(self.objectID);
	}])
	
	.controller('UserListController', 
		['AuthenticationService', 'CorePublisherService', '$location', 'toastr', function(AuthenticationService, CorePublisherService, $location, toastr) {
		var self = this;

		self.delay = 0;
		self.minDuration = 0;
		self.message = "";
		self.backdrop = true;
		self.promise = null;


		self.registered_users = [];

		if (AuthenticationService.isAuthenticated()) {
			//var user = AuthenticationService.getAuthenticatedUser();
			self.message = "Fetching users...";
			self.promise = CorePublisherService.allUsers().then(function(resp) {
				self.registered_users = resp.data;
			}, function(errorResp) {
				toastr.error('Error occured while fetching users: '+ errorResp.data.detail, 'Error!');
			});
		}
	}])

	.controller('UserCreateController', 
		['AuthenticationService', 'CorePublisherService', '$location', 'toastr', function(AuthenticationService, CorePublisherService, $location, toastr) {

		var self = this;
		self.delay = 0;
		self.minDuration = 0;
		self.message = "";
		self.backdrop = true;
		self.promise = null;

		self.isAuthenticated = AuthenticationService.isAuthenticated();

		self.countries = [
			{name: 'norway', code: 'NO'},
			{name: 'sweden', code: 'SE'},
			{name: 'danmark', code: 'DK'}
		];

		self.user_groups = [
			{name: 'Developer', code: 'DEVELOPER'},
			{name: 'Lilly User', code: 'LILLY_USER'},
			{name: 'Test user', code: 'TEST_USER'}
		];

		self.newUser = {
 			email: '',
 			first_name: '',
 			last_name: '',
 			user_type: '',
 			country: '',
 			password: '',
 			confirm_password: ''
 		};

 		self.create = function() {
 			
 			if (self.isAuthenticated) {

 				var fd = {
 					email: self.newUser.email,
 					first_name: self.newUser.first_name,
 					last_name: self.newUser.last_name,
 					user_type: self.newUser.user_type,
 					country: self.newUser.country,
 					password: self.newUser.password,
 					confirm_password: self.newUser.confirm_password
 				};

 				self.message = "Please wait a moment...";
 				self.promise = CorePublisherService.newUser(fd).then(function(resp) {
 					toastr.success('User created successfully!', 'Success');
 					$location.url('/users');

 				}, function(errorResp) {
 					toastr.error('Error occured while creating user: '+ errorResp.data.detail, 'Error!');
 				});

	 		} else {
	 			//redirect to the login page
	 			$location.url('/login');
	 		}
 		};
	}])

	.controller('UserDetailController', 
		['AuthenticationService', 'CorePublisherService', '$location', '$routeParams', 'ngDialog', 'toastr', function(AuthenticationService, CorePublisherService, $location, $routeParams, ngDialog, toastr) {

		var self = this;

		self.delay = 0;
		self.minDuration = 0;
		self.message = "Updating...";
		self.backdrop = true;
		self.promise = null;

		self.countries = [
			{name: 'norway', code: 'NO'},
			{name: 'sweden', code: 'SE'},
			{name: 'danmark', code: 'DK'}
		];

		self.user_groups = [
			{name: 'Developer', code: 'DEVELOPER'},
			{name: 'Lilly User', code: 'LILLY_USER'},
			{name: 'Test user', code: 'TEST_USER'}
		];

		self.isAuthenticated = AuthenticationService.isAuthenticated();
		self.objectID = $routeParams.uId;
		self.object = {};

		self.retrieve = function(objID) {
			self.promise = CorePublisherService.fetchUser(objID).then(function(resp) {
				self.object = resp.data;

			}, function(errorResp) {
				toastr.error('Error occured while fetching user: '+ errorResp.data.detail, 'Error!');
			});
		};

		self.update = function() {
			if (self.isAuthenticated) {

 				var fd = {
 					email: self.object.email,
 					first_name: self.object.first_name,
 					last_name: self.object.last_name,
 					user_type: self.object.user_type,
 					country: self.object.country
 				};

				self.promise = CorePublisherService.updateUser(self.objectID, fd).then(function(resp) {
					toastr.success('User updated successfully', 'Success');

				}, function(errorResp) {
					toastr.error('An Error occurred while updating! :'+ errorResp.data.detail, 'Error!');
				});

	 		} else {
	 			//redirect to the login page
	 			$location.url('/login');
	 		}
		};

		self.delete = function() {
			if (self.isAuthenticated) {
				self.message = "Deleting...";
				self.promise = CorePublisherService.deleteUser(self.objectID).then(function(resp) {
					toastr.success('User deleted successfully!', 'Succes!');
					$location.url('/users');

				}, function(errorResp) {
					toastr.error('An Error occurred while deleting! :'+ errorResp.data.detail, 'Error!');
				});
			} else {
				toastr.warning('You are not allow to perform this action!', 'Warning!')
			}
		};

		//fetch the object after instanciation
		self.retrieve(self.objectID);
	}]);