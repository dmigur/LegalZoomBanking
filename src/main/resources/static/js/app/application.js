'use strict';

var cardApp = angular.module('cardApp', ['ngRoute', 'ui.router', 'ngResource','720kb.datepicker'
]);

cardApp.config(['$httpProvider', function ($httpProvider, $locationProvider) {

    $httpProvider.defaults.timeout = 500000000;

}]);

console.log("provider");
cardApp.config(['$locationProvider',

    function ($locationProvider) {

        $locationProvider.hashPrefix('!');

    }
]).directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                scope.$apply(function () {
                    scope.fileread = changeEvent.target.files[0];
                });
            });
        }
    }
}]);


