(function(){

  'use strict';

  angular

    // Declare the dependencies for the Angular controller defined in this file:
    .module('SampleApp.signin', [
      'SampleApp.AuthenticationService',
      'ui.router'
    ])

    // Configure the angular UI routes/states for the home routes:
    .controller('SignInController', [ "$state", "$rootScope", "AuthenticationService",
      function   SignInController   (  $state,   $rootScope,   AuthenticationService) {

        console.log("Configuring app's 'signin' controller...");

        var vm = this;
        vm.signin = signin;

        // clear any saved credentials...
        (function initSignInController() {
          // reset login status
          AuthenticationService.clearCurrentUser();
        })();

        function signin() {
          vm.dataLoading = true;

          AuthenticationService.authenticateUser({
            username: vm.username,
            password: vm.password
          }).then(
            // auth success:
            function(user) {
              var returnToState = ($rootScope.returnToState || '/');
              var returnToStateParams = ($rootScope.returnToStateParams || {});
              return $state.go(returnToState, returnToStateParams);
            },

            function(errorObject) {
              // FlashService.Error(errorObject.message);
              vm.dataLoading = false;
            }
          );
        };


      }
    ]);

})();
