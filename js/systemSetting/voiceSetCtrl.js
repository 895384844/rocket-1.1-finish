var voiceSetModule = angular.module('voiceSetModule', []);
voiceSetModule.controller('voiceSetCtrl',function($scope, $http,ModalService,gridServices){
	$scope.importVoice = function(){
        $http.get('/system/settingsAction!uploadWarningWav.action').then(function(resp){
			if(resp.data){
                ModalService.showModal({
	                templateUrl: 'modals/systemSetting/import.html',
	                controller: 'importVoiceCtrl'
	            }).then(function(modal) {
	                modal.element.modal();	                
	            });
			}
		});
    }
	$scope.testVoice = function(){
		var v=document.getElementById('voice');
			v.src="/audio/alarm.wav?timestamp="+new Date();
			v.play();
	}
});