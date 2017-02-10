(function (ng, window, document, undefined) {
    'use strict';
    
    /* this module allows to execute js code loaded dynamically from the bp */
    ng.module('ngLoadScript', [])
         .directive('script', function() {
             return {
                 restrict: 'E',
                 scope: false,
                 link: function(scope, elem, attr) {

                     if (attr.type === 'text/javascript-lazy') {
                         var code = elem.text();
                         var f = new Function(code);
                         f();
                     }
                 }
             };
         });

    ng.module('rnApp', ['ngLoadScript'])
        /* main controller that load the tools and the blueprints */
        .controller('mainController', ['dataFactory', 'getServicesStatus', '$scope', function(dataFactory, getServicesStatus, $scope){
                var controller = this;

                dataFactory().success(function(data){ 
                    controller.core = data.objects;
//                    $scope.codeJSON = data.objects;
console.log(data);
//console.log(controller.core);

                    //controller.core.forEach(function(element, index, array){
			//console.log(controller.core);
			//generateUrls(data);
                        //generateUrls(element.components);
                    //});
                    //getServicesStatus(controller.core);
                    //setInterval(function(){
                    //    getServicesStatus(controller.core);
                    //},10000);
                });                
            }]
        )

        .controller('extensionControler', function($scope, $http) {
            $scope.installExtension = function(value) {
                var data = { 'id' : value };
                var config = {
                    headers : {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                    }
                }
                $http.post('http://requestb.in/1a58b8s1', JSON.stringify(data), config).then(function (response) {
                    // This function handles success
                }, function (response) {
                    // This function handles errors
                });
            };
        })

        /* load the components/tools */
        .directive('componentList', function(){
            var app = this;
            return{
                restrict: 'E',
                templateUrl: 'dir/component-list.html',
                controller: function(){
                   
                }
            };
        })
        /* replace the missing image with text*/
        .directive('errSrc', function() {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {                                        
                    element.bind('error', function() {
                        var parent = element.parent();
                        if(parent.find("span").length === 0){
                            var span = ng.element('<span></span>');
                            span.text(attrs.title);
                            parent.append(span);
                        }
                        parent.addClass("no-image");
                        
                    });
                }
            };
        });

    /* fetch the data from the descriptor file */
    ng.module('rnApp').factory('dataFactory', ['$http', function($http){
        return function () { return $http.get('../catalog/api/metadata'); 
	};
    }]);
  
  
    function generateUrls(data){
        //data.forEach(function(element, index, array){
        //    if(element.linkCreate){
        //        element.link = createUrl(element.linkCreate.host) + element.linkCreate.endPath;
        //    }
        //});        
    }
    
    function createUrl(host){
        return "http://"+ host + "." + window.location.host+ (window.location.host.indexOf(".xip.io") > -1 ? "" : ".xip.io/");
    }
         
    function getStatusClass(status,node_status){

        if (status === "passing" && node_status === "passing"){
            return "bs-callout-success";
        }else{
           return "bs-callout-danger";
        }
    }
    /* check the status of the services */
    ng.module('rnApp').factory('getServicesStatus', ['$http', function($http){
        return function (objects) {     
        };
    }]);
    
    ng.module('rnApp').filter('cut', function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                  /* Also remove . and , so its gives a cleaner result. */
                  if (value.charAt(lastspace-1) == '.' || value.charAt(lastspace-1) == ',') {
                    lastspace = lastspace - 1;
                  }
                  value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        };
    });


//http://cmt1.westeurope.cloudapp.azure.com/jenkins/job/Test/job/Third/job/Cartridge_Management/job/Load_Cartridge/

})(angular, window, document);
