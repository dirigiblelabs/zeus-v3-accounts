angular.module('page', ['ngAnimate', 'ui.bootstrap']);
angular.module('page')
.factory('$messageHub', [function(){
	var messageHub = new FramesMessageHub();

	var message = function(evtName, data){
		messageHub.post({data: data}, 'zeus.zeus-accounts.Clusters.' + evtName);
	};

	var on = function(topic, callback){
		messageHub.subscribe(callback, topic);
	};

	return {
		message: message,
		on: on,
		onEntityRefresh: function(callback) {
			on('zeus.zeus-accounts.Clusters.refresh', callback);
		},
		onAccountsModified: function(callback) {
			on('zeus.zeus-accounts.Accounts.modified', callback);
		},
		messageEntityModified: function() {
			message('modified');
		}
	};
}])
.controller('PageController', function ($scope, $http, $messageHub) {

	var api = '/services/v3/js/zeus-accounts/api/Clusters.js';
	var accountOptionsApi = '/services/v3/js/zeus-accounts/api/Accounts.js';

	$scope.accountOptions = [];

	$scope.dateOptions = {
		startingDay: 1
	};
	$scope.dateFormats = ['yyyy/MM/dd', 'dd-MMMM-yyyy', 'dd.MM.yyyy', 'shortDate'];
	$scope.dateFormat = $scope.dateFormats[0];

	function accountOptionsLoad() {
		$http.get(accountOptionsApi)
		.success(function(data) {
			$scope.accountOptions = data;
		});
	}
	accountOptionsLoad();

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
			$messageHub.messageEntityModified();
		}).error(function(data) {
			alert(JSON.stringify(data));
		});
			
	};

	$scope.update = function() {
		$http.put(api + '/' + $scope.entity.Id, JSON.stringify($scope.entity))

		.success(function(data) {
			load();
			toggleEntityModal();
			$messageHub.messageEntityModified();
		}).error(function(data) {
			alert(JSON.stringify(data));
		})
	};

	$scope.delete = function() {
		$http.delete(api + '/' + $scope.entity.Id)
		.success(function(data) {
			load();
			toggleEntityModal();
			$messageHub.messageEntityModified();
		}).error(function(data) {
			alert(JSON.stringify(data));
		});
	};

	$scope.accountOptionValue = function(optionKey) {
		for (var i = 0 ; i < $scope.accountOptions.length; i ++) {
			if ($scope.accountOptions[i].Id === optionKey) {
				return $scope.accountOptions[i].Name;
			}
		}
		return null;
	};

	$messageHub.onEntityRefresh(load);
	$messageHub.onAccountsModified(accountOptionsLoad);

	function toggleEntityModal() {
		$('#entityModal').modal('toggle');
	}
});