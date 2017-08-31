modalModule.controller('deletevisitorlistCtrl',function($scope, $filter, $http, rows ,close){

	$scope.sure = function(){		
		var ids = [];
        for(var i=0; i<rows.length; i++){
            ids.push(rows[i]['id']);
        }

        $http({  
			url:'/query/visitor!deleteVisitor.action',
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

modalModule.controller('addvisitorlistCtrl',function($scope, $filter, httpServices, close){

	$scope.visitorlist = {
		name : '',
		phoneNumber : '',
		imei : '',
		imsi : '',
		startTime : '',
		endTime : ''
	};
	
	$scope.endDateBeforeRender = function ($view, $dates) {          
        if ($scope.visitorlist.startTime) {               
            var activeDate = moment($scope.visitorlist.startTime).subtract(1, $view).add(1, 'minute');
            $dates.filter(function (date) {
                  return date.localDateValue() <= activeDate.valueOf();
            }).forEach(function (date) {
                  date.selectable = false;
            })
        }
    };
    $scope.startDateOnSetTime = function () {
        $scope.$broadcast('start-date-changed');
    };   
    $scope.endDateOnSetTime = function () {
        $scope.$broadcast('end-date-changed');
    };
    $scope.startDateBeforeRender = function ($dates) {           
        if ($scope.visitorlist.endTime) {                
            var activeDate = moment($scope.visitorlist.endTime);
            $dates.filter(function (date) {
                  return date.localDateValue() >= activeDate.valueOf();
            }).forEach(function (date) {
                  date.selectable = false;
            })
        }
    };

	$scope.sure = function(){

		var obj = {
			name : $scope.visitorlist.name,
			phoneNumber : $scope.visitorlist.phoneNumber,
			imei : $scope.visitorlist.imei,
			imsi : $scope.visitorlist.imsi,
			startTime : $filter('date')($scope.visitorlist.startTime, 'yyyy-MM-dd HH:mm:ss'),
            endTime : $filter('date')($scope.visitorlist.endTime, 'yyyy-MM-dd HH:mm:ss')
		};

		httpServices.promise('/query/visitor!addVisitor.action',obj).then(function(resp){
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

modalModule.controller('editvisitorlistCtrl',function($scope, $filter, httpServices, row, close){



	$scope.visitorlist = {
		name : row.name,
		phoneNumber : row.phoneNumber,
		imei : row.imei,
		imsi : row.imsi,
		startTime : new Date(row.startTime),
		endTime : new Date(row.endTime)
	};

	$scope.sure = function(){

		var obj = {
			id : row.id,
			name : $scope.visitorlist.name,
			phoneNumber : $scope.visitorlist.phoneNumber,
			imei : $scope.visitorlist.imei,
			imsi : $scope.visitorlist.imsi,
			startTime : $filter('date')($scope.visitorlist.startTime, 'yyyy-MM-dd HH:mm:ss'),
            endTime : $filter('date')($scope.visitorlist.endTime, 'yyyy-MM-dd HH:mm:ss')
		};

		httpServices.promise('/query/visitor!editVisitor.action',obj).then(function(resp){
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
modalModule.controller('downLoadCtrlvisitorlist',function($scope,  gridServices, rows ,close){

    $scope.list = rows;

	$scope.downLoad = function(index){

        var obj = { fileName : $scope.list[index]};        
        document.location.href = gridServices.exportAction('/system/downloadAction!downloadFile.action',obj); 
        
	};

	$scope.close = function(result) {
 	    close(result,500);  
    };
});
modalModule.controller('importvisitorlistCtrl',function($scope, $http, close,Upload){

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
            	url:'/query/visitor!addVisitorByExcel.action',
            	headers:{'Content-Type':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'},
                data: {"visitorFile": $scope.visitorlistFile},
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
