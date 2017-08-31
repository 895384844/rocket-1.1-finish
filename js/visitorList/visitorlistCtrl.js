var visitorlistModule = angular.module('visitorlistModule', ['gridModule']);
visitorlistModule.controller('visitorlistCtrl',function($scope, $http, $filter,gridServices, httpServices, ModalService){
    
    //实现表格呈现
	$scope.paginationOptions = {
        pageNumber: 1,
        pageSize: 20,
        sort: null
    };
	$scope.gridOptions = {
        paginationPageSizes: [20, 30],
        paginationPageSize: 20,
        useExternalPagination: true,
        enableSorting: false,
        enableColumnResize: true,
        multiSelect: true,
        rowHeight : 35,
        columnDefs : [
	        { field:'name',displayName: '姓名',maxWidth:600,minWidth:150 },
	        { field:'phoneNumber',displayName: '手机号',maxWidth:600,minWidth:150 },
	        { field:'imei',displayName:'IMEI',maxWidth:600,minWidth:150 },
	        { field:'imsi',displayName: 'IMSI',maxWidth:600,minWidth:150 },
	        { field:'startTime',displayName: '到访时间',maxWidth:600,minWidth:150 },
	        { field:'endTime',displayName: '到访结束时间',maxWidth:600,minWidth:150 },
	        { field:'createTime',displayName: '创建时间',maxWidth:600,minWidth:150 }
	    ]
    };

    $scope.promise = gridServices.promiseDefault('/query/visitor!listVisitor.action');

    $scope.gridOptions.onRegisterApi = function(gridApi){
		$scope.gridApi = gridApi;
        //分页变化事件
        gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize){
            $scope.newPage = newPage;
            
            $scope.promise = gridServices.promiseNew('/query/visitor!listVisitor.action',{
                name : $scope.visitorlist.name,
                phoneNumber : $scope.visitorlist.phoneNumber,
                imsi : $scope.visitorlist.imsi,
                imei : $scope.visitorlist.imei,
                startTime : $filter('date')($scope.visitorlist.startTime, 'yyyy-MM-dd HH:mm:ss'),
                endTime : $filter('date')($scope.visitorlist.endTime, 'yyyy-MM-dd HH:mm:ss'),
                createTime  : $filter('date')($scope.visitorlist.createTime, 'yyyy-MM-dd HH:mm:ss'),              
                page: newPage,
                rows: pageSize,
                sort: 'id',
                order: 'desc'
            });
	        $scope.getPage($scope.promise);
        });

        //表中行选择变化事件 
        gridApi.selection.on.rowSelectionChanged($scope,function(){
            $scope.rows = gridApi.selection.getSelectedRows();
            $scope.row = $scope.rows[0];
        });

        //表中行全选事件 
        gridApi.selection.on.rowSelectionChangedBatch($scope, function() {
            $scope.rows = gridApi.selection.getSelectedRows();
        });
	};

	$scope.getPage = function(promise){
		promise.then(function(resp){
            $scope.gridOptions.totalItems = resp.data.total;
            $scope.gridOptions.data = resp.data.rows;
		});
        $scope.rows = null;
	};

    $scope.getPage($scope.promise);

    $scope. visitorlist = {
        name : '',
        phoneNumber : '',
        imei : '',
        imsi : '',
        startTime : '',
        endTime : '',
        createTime : ''
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

    $scope.search = function(){
        var obj = {
            name : $scope.visitorlist.name,
            phoneNumber : $scope.visitorlist.phoneNumber,
            imsi : $scope.visitorlist.imsi,
            startTime : $filter('date')($scope.visitorlist.startTime, 'yyyy-MM-dd HH:mm:ss'),
            endTime : $filter('date')($scope.visitorlist.endTime, 'yyyy-MM-dd HH:mm:ss'),
            page : 1,
            rows : 20,
            sort: 'id',
            order: 'desc'
        };

        $scope.promise = gridServices.promiseNew('/query/visitor!listVisitor.action',obj);
        $scope.getPage($scope.promise);

        //查询后将当前页重新设置为第一页
        $scope.gridApi.pagination.seek(1);
    };

    $scope.export = function(){
        var obj = {
            name : $scope.visitorlist.name,
            phoneNumber : $scope.visitorlist.phoneNumber,
            imsi : $scope.visitorlist.imsi,
            startTime : $filter('date')($scope.visitorlist.startTime, 'yyyy-MM-dd HH:mm:ss'),
            endTime : $filter('date')($scope.visitorlist.endTime, 'yyyy-MM-dd HH:mm:ss'),
            sort: 'id',
            order: 'desc'
        };
        document.location.href = gridServices.exportAction('/query/visitor!exportExcel.action',obj);
    };

    $scope.downLoad = function(){
        $http.get('/system/downloadAction!listFileName.action').then(function(resp){
			if(resp.data){
                ModalService.showModal({
	                templateUrl: 'modals/downLoad.html',
	                controller: 'downLoadCtrlvisitorlist',
	                inputs: { 
	                    rows: resp.data 
	                }
	            }).then(function(modal) {
	                modal.element.modal();
	                modal.close.then(function(result) {
	                });
	            });
			}
		});
	};
    $scope.add = function(){
        ModalService.showModal({
            templateUrl: 'modals/visitorlist/add.html',
            controller: 'addvisitorlistCtrl'
        }).then(function(modal) {
            modal.element.modal();
            modal.close.then(function() {                
                $scope.promise = gridServices.promiseNew('/query/visitor!listVisitor.action',{
                    page: $scope.newPage ? $scope.newPage : 1,
                    rows: 20,
		            sort: 'id',
		            order: 'desc'
                });
                $scope.getPage($scope.promise);
            });
        });
    };

    $scope.edit = function(){
        if( $scope.rows == null || $scope.rows.length != 1){
            alert('请选择其中一条处理！');
        }else{
            ModalService.showModal({
                templateUrl: 'modals/visitorlist/edit.html',
                controller: 'editvisitorlistCtrl',
                inputs: { 
                    row: $scope.row
                }
            }).then(function(modal) {
                modal.element.modal();
                modal.close.then(function(result) {
                    $scope.promise = gridServices.promiseNew('/query/visitor!listVisitor.action',{
                        page: $scope.newPage ? $scope.newPage : 1,
                        rows: 20,
			            sort: 'id',
			            order: 'desc'
                    });
                    $scope.getPage($scope.promise);
                });
            });
        }
    };

    $scope.delete = function() {

        if( $scope.rows != null){
            ModalService.showModal({
                templateUrl: 'modals/delete.html',
                controller: 'deletevisitorlistCtrl',
                inputs: { 
                    rows: $scope.rows
                }
            }).then(function(modal) {
                modal.element.modal();
                modal.close.then(function(result) {
                    $scope.promise = gridServices.promiseNew('/query/visitor!listVisitor.action',{
                        page: $scope.newPage ? $scope.newPage : 1,
                        rows: 20,
			            sort: 'id',
			            order: 'desc'
                    });
                    $scope.getPage($scope.promise);
                });
            });
        }else{
            alert('请至少选择一条删除！');
        }

    };
    $scope.import = function(){
        ModalService.showModal({
            templateUrl: 'modals/visitorlist/import.html',
            controller: 'importvisitorlistCtrl'
        }).then(function(modal) {
            modal.element.modal();
            modal.close.then(function() {
                $scope.promise = gridServices.promiseDefault('/query/visitor!listVisitor.action');
                $scope.getPage($scope.promise);	
            });
        });
    };   
     $scope.device_downLoad = function(){   	
    	document.location.href = gridServices.exportAction('/system/downloadAction!downloadVisitorTemplate.action');
	};
});