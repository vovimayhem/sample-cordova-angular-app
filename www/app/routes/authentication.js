(function(){

  'use strict';

  angular

    // Define the 'SampleApp.Authentication' Angular Module:
    .module('SampleApp.Authentication', [
      'SampleApp.AuthenticationService',
      'ui.router'
    ])

    // Configure the 'SampleApp.Authentication' module routes/states:
    .config([                           '$stateProvider', '$urlRouterProvider',
    function AuthenticationRoutesConfig ($stateProvider,   $urlRouterProvider) {

      console.log("Configuring Authentication routes...");

      $urlRouterProvider.otherwise('/');

      $stateProvider

        // The 'unauthenticated' abstract state:
        .state('unauthenticated', {
          // With abstract set to true, that means this state can not be
          // explicitly activated. It can only be implicitly activated by
          // activating one of its children.
          abstract: true,

          // Example of loading a template from a file. This is also a top level state,
          // so this template file will be loaded and then inserted into the ui-view
          // within index.html.
          templateUrl: 'app/views/layouts/unauthenticated.html'
        })

        // The 'authenticated' abstract state:
        .state('authenticated', {
          abstract: true,
          templateUrl: 'app/views/layouts/authenticated.html',
          resolve: {
            auth: ['AuthenticationService', function(AuthenticationService) {
              AuthenticationService.authenticateUser();
            }]
          }
        })

        // The signin state:
        .state('signin', {
          url: '/signin',
          parent: 'unauthenticated',
          templateUrl: 'app/views/signin.html',
          controller: 'SignInController'
        });
    }]);

})();
