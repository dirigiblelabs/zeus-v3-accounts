angular.module('page', []);
angular.module('page').controller('PageController', function ($scope, $http) {

	var api = '/services/v3/js/zeus-accounts/api/Accounts.js';
	var partnerOptionsApi = '/services/v3/js/zeus-accounts/api/Partners.js';

	$scope.partnerOptions = [];

	$http.get(partnerOptionsApi)
	.success(function(data) {
		$scope.partnerOptions = data;
	});

	function load() {
		$http.get(api)
		.success(function(data) {
			$scope.data = data;
		});
	}
	load();

	$scope.openNewDialog = function() {
		$scope.actionType = 'new';
		$scope.entity = {};
		toggleEntityModal();
	};

	$scope.openEditDialog = function(entity) {
		$scope.actionType = 'update';
		$scope.entity = entity;
		toggleEntityModal();
	};

	$scope.openDeleteDialog = function(entity) {
		$scope.actionType = 'delete';
		$scope.entity = entity;
		toggleEntityModal();
	};

	$scope.close = function() {
		load();
		toggleEntityModal();
	};

	$scope.create = function() {
		$http.post(api, JSON.stringify($scope.entity))
		.success(function(data) {
			load();
			toggleEntityModal();
		}).error(function(data) {
			alert(JSON.stringify(data));
		});
			
	};

	$scope.update = function() {
		$http.put(api + '/' + $scope.entity.Id, JSON.stringify($scope.entity))

		.success(function(data) {
			load();
			toggleEntityModal();
		}).error(function(data) {
			alert(JSON.stringify(data));
		})
	};

	$scope.delete = function() {
		$http.delete(api + '/' + $scope.entity.Id)
		.success(function(data) {
			load();
			toggleEntityModal();
		}).error(function(data) {
			alert(JSON.stringify(data));
		});
	};

	$scope.partnerOptionValue = function(optionKey) {
		for (var i = 0 ; i < $scope.partnerOptions.length; i ++) {
			if ($scope.partnerOptions[i].Id === optionKey) {
				return $scope.partnerOptions[i].Email;
			}
		}
		return null;
	};

	function toggleEntityModal() {
		$('#entityModal').modal('toggle');
	}
});