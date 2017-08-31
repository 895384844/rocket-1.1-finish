modalModule.controller('deleteTelCtrl',function($scope, $http, rows ,close){

	$scope.close = function(result) {
 	    close(result,500); 
    };

    $scope.sure = function(){
    	var ids = [];

        for(var i=0; i<rows.length; i++){
        	var obj = { templateId : rows[i]['templateId']};
            ids.push(obj);
        }

        $http({  
			url:'/query/MessageTemplateAction!deleteTemplate.action',
			method:'POST',
			params:{ 'data' : [ids] }
		}).then(function(resp){
			if(resp.data.status == 'success'){
				close(null,500); 
			}else{
                alert('删除失败！');
			}			
		});
    };
}); 

modalModule.controller('addMesTelCtrl',function($scope, httpServices, close){

	$scope.mesTel = {
        templateName : '',
        type : '0',
        templateString : ''
	};

	$scope.sure = function(){
    	var obj = {
    		templateName : $scope.mesTel.templateName,
            used : 0,
            defaultUsed : 0,
            type : $scope.mesTel.type,
            templateString : $scope.mesTel.templateString,
    	};   

		httpServices.promise('/query/MessageTemplateAction!saveTemplate.action', obj ).then(function(resp){
			if(resp.data.status == 'success'){
                close(null,500); 
			}else{
                alert('该用户已经存在！');
			}
			
		});
    };

	$scope.clear = function(){

		$scope.mesTel = {
            templateName : '',
            type : '0',
            templateString : ''
		};
    	
    };

	$scope.close = function(result) {
 	    close(result, 500); 
    };
});

modalModule.controller('editMesTelCtrl',function($scope, httpServices, row, close){

    var selected = row;

	if(selected.type == '目标告警模板'){
        selected.tel = '0';
	}else if(selected.type == '设备告警模板'){
		selected.tel = '1';
	}else{
		selected.tel = '2';
	}

	$scope.mesTel = {
        templateName : selected.templateName,
        type : selected.tel,
        templateString : selected.templateString
	};

	$scope.sure = function(){
		var obj = {
			templateId : selected.templateId,
    		templateName : $scope.mesTel.templateName,
            used : selected.used == '启用' ? 1:0,
            defaultUsed : 0,
            type : $scope.mesTel.type,
            templateString : $scope.mesTel.templateString,
    	};  

    	httpServices.promise('/query/MessageTemplateAction!saveTemplate.action', obj ).then(function(resp){
			if(resp.data.status == 'success'){
                close(null,500); 
			}else{
                alert('编辑失败！');
			}			
		});

	};

	$scope.clear = function(){
    	$scope.mesTel = {
            templateName : '',
            type : '0',
            templateString : ''
		};
    };

	$scope.close = function(result) {
 	    close(result, 500); 
    };

});

modalModule.controller('addTimeCtrl',function($scope, $http, close){

    $scope.time = {
        startTime : '',
        endTime : ''
    };

   

    $scope.close = function(result) {
        close(result,500); 
    };

    $scope.sure = function(){       
        result = $scope.time;
        close(result,500); 
    };
}); 

modalModule.controller('importVoiceCtrl',function($scope, $http, close,Upload){

	
	$scope.errorMessage="";
	$scope.fileName="";
	$scope.name="";
    $scope.close = function(result) {
 	    close(result,500); 
    };

    $scope.onFileSelect = function($file) { 
            if(!$file){
                return;
            }   
            var file = $file;
            $scope.errorMessage="";
            $scope.fileName=file.name;
            //$scope.name=file.warningWav;
            Upload.upload({
            	url:'/system/settingsAction!uploadWarningWav.action',
            	headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'},
                data: {"warningWav": $scope.licenseFile},
                file: file
            }).progress(function(evt) {       
                $scope.isWaiting=true;
                
            }).success(function(data,status,headers,config){ 
            	if(data.status == "success"){
            		alert("音频文件替换成功！")           		
            		return;
            	}
      			$scope.errorMessage=data.info;
            }).error(function(data,status,headers,config){ 
            	$scope.errorMessage="音频文件上传失败!";
            }).finally(function(){
                $scope.isWaiting=false;
            });   
    
        };
});