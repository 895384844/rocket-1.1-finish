modalModule.controller('deleteBlacklistCtrl',function($scope, $http, rows ,close){

	$scope.sure = function(){		
		var ids = [];
        for(var i=0; i<rows.length; i++){
            ids.push(rows[i]['id']);
        }

        $http({  
			url:'/query/TerminalAction!deleteTerminal.action',
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

modalModule.controller('addBlacklistCtrl',function($scope, httpServices, close){

	$scope.addBlacklist = {
		name : '',
		imei : '',
		imsi : ''
	};

	$scope.sure = function(){

		var obj = {
			name : $scope.addBlacklist.name,
			imei : $scope.addBlacklist.imei,
			imsi : $scope.addBlacklist.imsi,
			isblacklist : true
		};

		httpServices.promise('/query/TerminalAction!addTerminal.action',obj).then(function(resp){
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

modalModule.controller('editBlacklistCtrl',function($scope, httpServices, row, close){



	$scope.addBlacklist = {
		name : row.name,
		imei : row.imei,
		imsi : row.imsi
	};

	$scope.sure = function(){

		var obj = {
			id : row.id,
			name : $scope.addBlacklist.name,
			imei : $scope.addBlacklist.imei,
			imsi : $scope.addBlacklist.imsi,
			isblacklist : true
		};

		httpServices.promise('/query/TerminalAction!editTerminal.action',obj).then(function(resp){
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
modalModule.controller('downLoadCtrlBlacklist',function($scope,  gridServices, rows ,close){

    $scope.list = rows;

	$scope.downLoad = function(index){

        var obj = { fileName : $scope.list[index]};        
        document.location.href = gridServices.exportAction('/system/downloadAction!downloadFile.action',obj); 
        
	};

	$scope.close = function(result) {
 	    close(result,500);  
    };
});
modalModule.controller('importBlacklistCtrl',function($scope, $http, close,Upload){

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
            	url:'/query/TerminalAction!addTerminalByExcel.action',
            	headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'},
                data: {"terminalLists": $scope.blacklistFile},
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
