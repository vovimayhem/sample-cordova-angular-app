(function(){

  'use strict';

  angular
    .module('SampleApp.Home', [
       // All of the routes in the 'SampleApp.Home' module are children of
       // the 'SampleApp.Authentication' module:
      'SampleApp.Authentication',
      'ui.router'
    ])

    // Configure the 'SampleApp.Home' module routes/states:
    .config([                '$stateProvider', '$urlRouterProvider',
    function HomeRoutesConfig($stateProvider,   $urlRouterProvider) {

      console.log("Configuring Home routes...");

      $stateProvider
        // The home Route:
        .state('home', {
          url: '/',
          parent: 'authenticated',
          templateUrl: 'app/views/home.html'
        });
    }]);

})();
