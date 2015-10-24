(function(){

  'use strict';

  angular
    .module('SampleApp.routes', [
      'SampleApp.AuthenticationService',
      'SampleApp.signin',
      'ui.router'
    ])

    // We'll configure the main abstract routes/states in this file...
    //
    // ...each app section routes/states will be declared in the 'app/routes'
    // files, split up in a way that makes some sense.
    .config([  '$stateProvider', '$urlRouterProvider',
      function ($stateProvider,   $urlRouterProvider) {

        console.log("Configuring app routes...");

        $urlRouterProvider.otherwise('/');

        $stateProvider
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

          .state('authenticated', {
            abstract: true,
            templateUrl: 'app/views/layouts/authenticated.html',
            resolve: {
              auth: ['AuthenticationService', function(AuthenticationService) {
                AuthenticationService.authenticateUser();
              }]
            }
          })

          // The signin Route:
          .state('signin', {
            url: '/signin',
            parent: 'unauthenticated',
            templateUrl: 'app/views/signin.html',
            controller: 'SignInController'
          })

          // The home Route:
          .state('home', {
            url: '/',
            parent: 'authenticated',
            templateUrl: 'app/views/home.html'
          });
      }
    ]);

})();
