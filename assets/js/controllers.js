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
			AuthenticationService.logout();
		};

		//PUB-SUB
		/*
		$scope.$on('LOADIND', function() {
			self.loading = true;
		});

		$scope.$on('NOT_LOADING', function() {
			self.loading = false;
		});
		*/

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
 		['AuthenticationService', 'CorePublisherService', '$location', 'toastr', function(AuthenticationService, CorePublisherService, $location, toastr) {
 			var self = this;

 			self.delay = 0;
			self.minDuration = 0;
			self.message = "";
			self.backdrop = true;
			self.promise = null;

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
	 			zink_number: 0,
	 			categories: []
	 		};

	 		//fetch all categories and make them availbale for use
	 		self.message = "Loading Product Categories";
	 		self.promise = CorePublisherService.allCategories(selectedCountry.code).then(function(resp) {
	 			self.categories = resp.data;
	 		}, function(errorResp) {
	 			toastr.error('Error fetching product categories: '+ errorResp.data.detail, 'Error!');
	 		});

	 		self.create = function() {
	 			
	 			if (self.isAuthenticated) {

	 				var fd = new FormData();

	 				fd.append('title', self.presentationItem.title);
	 				fd.append('description', self.presentationItem.description);
	 				fd.append('thumbnail', self.presentationItem.thumbnail);
	 				fd.append('file', self.presentationItem.file);
	 				fd.append('pub_date', self.presentationItem.pub_date);
	 				fd.append('expiry_date', self.presentationItem.expiry_date);
	 				fd.append('zink_number', self.presentationItem.zink_number);
	 				fd.append('categories', self.presentationItem.categories);

	 				self.message = "Please while we're uploading your file...";
	 				self.promise = CorePublisherService.newPresentation(fd).then(function(resp) {
	 					toastr.success('Resource created successfully', 'Success!');
	 					$location.url('/presentations');

	 				}, function(errorResp) {
	 					toastr.error('Error: '+ errorResp.data.detail, 'Error!');
	 				});

		 		} else {
		 			//redirect to the login page
		 			$location.url('/login');
		 		}
	 		};
 	}])

	.controller('FileCreateController', 
		['AuthenticationService', 'CorePublisherService', '$location', 'toastr', function(AuthenticationService, CorePublisherService, $location, toastr) {
			var self = this;
			self.delay = 0;
			self.minDuration = 0;
			self.message = "";
			self.backdrop = true;
			self.promise = null;

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
	 			zink_number: 0,
	 			categories: []
	 		};

	 		//fetch all categories and make them availbale for use
	 		self.message = "Fetching product categories...";
	 		self.promise = CorePublisherService.allCategories(selectedCountry.code).then(function(resp) {
	 			self.categories = resp.data;
	 		}, function(errorResp) {
	 			toastr.error('Error fetching product categories: '+ errorResp.data.detail, 'Error!');
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
	 				fd.append('zink_number', self.newFile.zink_number);
	 				fd.append('categories', self.newFile.categories);

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
	 			zink_number: 0,
	 			categories: []
	 		};

	 		//fetch all categories and make them availbale for use
	 		self.message = "Fatching product categories...";
	 		CorePublisherService.allCategories(selectedCountry.code).then(function(resp) {
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
	 				fd.append('pub_date', self.newLink.pub_date);
	 				fd.append('expiry_date', self.newLink.expiry_date);
	 				fd.append('zink_number', self.newLink.zink_number);
	 				fd.append('categories', self.newLink.categories);

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
	
 	.controller('PresentationListController', 
 		['AuthenticationService', 'CorePublisherService', '$location', 'ngDialog', 'toastr', function(AuthenticationService, CorePublisherService, $location, ngDialog, toastr) {

 		var self = this;
 		self.delay = 0;
		self.minDuration = 0;
		self.message = "";
		self.backdrop = true;
		self.promise = null;

 		var selectedCountry = AuthenticationService.getSelectedCountry();

 		self.presentations = [];

 		if (AuthenticationService.isAuthenticated()) {

	 		//fetch all presentations
	 		self.message = "fetching presentations";

	 		self.promise = CorePublisherService.allPresentations(selectedCountry.code).then(function(resp) {
	 			self.presentations = resp.data;
	 		}, function(errorResp) {
	 			//MessageNotificationService.error(errorResp.error);
	 			toastr.error('Error fetching data: '+ errorResp.data.detail, 'Error!');
	 		});
	 	}
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

 	.controller('PresentationDetailController', 
 		['AuthenticationService', 'CorePublisherService', '$location', '$routeParams', 'ngDialog', 'toastr', function(AuthenticationService, CorePublisherService, $location, $routeParams, ngDialog, toastr) {

 			var self = this;

 			self.delay = 0;
			self.minDuration = 0;
			self.message = "Updating...";
			self.backdrop = true;
			self.promise = null;

 			var selectedCountry = AuthenticationService.getSelectedCountry();

 			self.isAuthenticated = AuthenticationService.isAuthenticated();
 			self.objectID = $routeParams.presentationId;
 			self.object = {};
 			self.categories = [];

 			//fetch all categories and make them availbale for use
 			self.message = "Fecthing product categories...";
	 		self.promise = CorePublisherService.allCategories(selectedCountry.code).then(function(resp) {
	 			self.categories = resp.data;
	 		}, function(errorResp) {
	 			toastr.warning('Product Categories not availbale: '+ errorResp.data.detail, 'Error!');
	 		});

 			self.retrieve = function(objID) {
 				self.message = "Updating...";
 				self.promise = CorePublisherService.fetchPresentation(objID).then(function(resp) {
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
	 				fd.append('zink_number', self.object.zink_number);
	 				fd.append('categories', self.object.categories);

	 				self.message = "Updating...";
	 				self.promise = CorePublisherService.updatePresentation(self.objectID, fd).then(function(resp) {
	 					toastr.success('Resource updated successfully!', 'Success!');

	 				}, function(errorResp) {
	 					toastr.error('An error occured while updating resource: '+ errorResp.data.detail, 'Error!');
	 				});

		 		} else {
		 			//redirect to the login page
		 			$location.url('#/login');
		 		}
 			};

 			self.delete = function() {
 				if (self.isAuthenticated) {
 					self.message = "Deleting...";
	 				self.promise = CorePublisherService.deletePresentation(self.objectID).then(function(resp) {
	 					toastr.success('Resource updated successfully', 'Success!');
	 					$location.url('/presentations');
	 				}, function(errorResp) {
	 					toastr.error('Failed deleting resource! Please try again later: '+ errorResp.data.detail, 'Error!');
	 				});
	 			} else {
	 				toastr.warning('You are not allowed to perform this action', 'Warning!');
	 			}
 			};

 			//fetch the object after instanciation
 			self.retrieve(self.objectID);

 	}])

	.controller('FileDetailController', 
 		['AuthenticationService', 'CorePublisherService', '$location', '$routeParams', 'ngDialog', 'toastr', function(AuthenticationService, CorePublisherService, $location, $routeParams, ngDialog, toastr) {

 			var self = this;

 			self.delay = 0;
			self.minDuration = 0;
			self.message = "Updating...";
			self.backdrop = true;
			self.promise = null;

 			var selectedCountry = AuthenticationService.getSelectedCountry();

 			self.isAuthenticated = AuthenticationService.isAuthenticated();
 			self.objectID = $routeParams.fileId;
 			self.object = {};
 			self.categories = [];

 			//fetch all categories and make them availbale for use
 			self.message = "Fetching product categories...";
	 		self.promise = CorePublisherService.allCategories(selectedCountry.code).then(function(resp) {
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

	 				fd.append('pub_date', self.object.pub_date);
	 				fd.append('expiry_date', self.object.expiry_date);
	 				fd.append('zink_number', self.object.zink_number);
	 				fd.append('categories', self.object.categories);

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

 			var selectedCountry = AuthenticationService.getSelectedCountry();

 			self.isAuthenticated = AuthenticationService.isAuthenticated();
 			self.objectID = $routeParams.linkID;
 			self.categories = [];
 			self.object = {};

 			//fetch all categories and make them availbale for use
 			self.message = "Fetching product categories...";
	 		self.promise = CorePublisherService.allCategories(selectedCountry.code).then(function(resp) {
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

	 				fd.append('pub_date', self.object.pub_date);
	 				fd.append('expiry_date', self.object.expiry_date);
	 				fd.append('zink_number', self.object.zink_number);
	 				fd.append('categories', self.object.categories);

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
 			priority: 0
 		};

 		self.create = function() {
 			
 			if (self.isAuthenticated) {

 				var fd = new FormData();

 				fd.append('name', self.newCategory.name);
 				fd.append('description', self.newCategory.description);
 				fd.append('priority', self.newCategory.priority);
 				fd.append('picture', self.newCategory.picture);
 				fd.append('icon', self.newCategory.icon);

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
		self.objectID = $routeParams.categoryId;
		self.object = {};

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
 			country: ''
 		};

 		self.create = function() {
 			
 			if (self.isAuthenticated) {

 				var fd = {
 					email: self.newUser.email,
 					first_name: self.newUser.first_name,
 					last_name: self.newUser.last_name,
 					user_type: self.newUser.user_type,
 					country: self.newUser.country
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