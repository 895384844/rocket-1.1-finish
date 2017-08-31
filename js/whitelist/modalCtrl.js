modalModule.controller('deletewhitelistCtrl',function($scope, $http, rows ,close){

	$scope.sure = function(){		
		var ids = [];
        for(var i=0; i<rows.length; i++){
            ids.push(rows[i]['id']);
        }

        $http({  
			url:'/query/whiteList!deleteWhiteList.action',
			method:'POST',
			params:{ 'ids' : ids.join()}
		}).then(function(resp){
			if(resp.data.status == 'success'){
			    close(null,500); 
			}else{
                alert('删除失败！');
			}			
		});

	};

	$scope.close = function(result) {
 	    close(result,500); 
    };
});

modalModule.controller('addwhitelistCtrl',function($scope, httpServices, close){

	$scope.addWhitelist = {
		name : '',
		imei : '',
		imsi : ''
	};

	$scope.sure = function(){

		var obj = {
			name : $scope.addWhitelist.name,
			imei : $scope.addWhitelist.imei,
			imsi : $scope.addWhitelist.imsi,
			iswhitelist : true
		};

		httpServices.promise('/query/whiteList!addWhiteList.action',obj).then(function(resp){
			if(resp.data.status == 'success'){
				close(null,500);
			}else{
				alert('添加失败！');
			}
		});
    };


	$scope.close = function(result) {
 	    close(result, 500); 
    };

});

modalModule.controller('editwhitelistCtrl',function($scope, httpServices, row, close){



	$scope.addwhitelist = {
		name : row.name,
		imei : row.imei,
		imsi : row.imsi
	};

	$scope.sure = function(){

		var obj = {
			id : row.id,
			name : $scope.addwhitelist.name,
			imei : $scope.addwhitelist.imei,
			imsi : $scope.addwhitelist.imsi,
			iswhitelist : true
		};

		httpServices.promise('/query/whiteList!editWhiteList.action',obj).then(function(resp){
			if(resp.data.status == 'success'){
				close(null,500);
			}else{
				alert('编辑失败！');
			}
		});
    };

    $scope.close = function(result) {
 	    close(result, 500); 
    };
});
modalModule.controller('downLoadCtrlwhitelist',function($scope,  gridServices, rows ,close){

    $scope.list = rows;

	$scope.downLoad = function(index){

        var obj = { fileName : $scope.list[index]};        
        document.location.href = gridServices.exportAction('/system/downloadAction!downloadFile.action',obj); 
        
	};

	$scope.close = function(result) {
 	    close(result,500);  
    };
});
modalModule.controller('importWhitelistCtrl',function($scope, $http, close,Upload){

	$scope.errorMessage="";
	$scope.fileName="";
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
            Upload.upload({
            	url:'/query/whiteList!addWhiteListByExcel.action',
            	headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'},
                data: {"whiteList": $scope.whitelistFile},
                file: file
            }).progress(function(evt) {       
                $scope.isWaiting=true;
            }).success(function(data,status,headers,config){ 
            	if(data.status == 'success'){
            		close(result,500); 
            		return;
            	}else{
            		alert(data.info);
            	}
      			$scope.errorMessage="导入文件验证失败!";
            }).error(function(data,status,headers,config){ 
            	$scope.errorMessage="导入文件上传失败!";
            }).finally(function(){
                $scope.isWaiting=false;
            });   
    
        };
});
