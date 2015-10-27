(function(){

  'use strict';

  angular

    // Refer to the 'SampleApp.Authentication' angular module already defined in
    // the 'routes/authentication.js' file:
    .module('SampleApp.Authentication')

    // Setup the Angular Controller for the 'signin' state/route:
    .controller('SignInController', [ "$scope", "$state", "$rootScope", "AuthenticationService",
      function   SignInController   (  $scope,   $state,   $rootScope,   AuthenticationService) {

        // clear any saved credentials...
        AuthenticationService.clearCurrentUser();

        $scope.signin = function() {

          $scope.dataLoading = true;

          return AuthenticationService.authenticateUser({
            username: $scope.username,
            password: $scope.password
          }).then(
            // auth success:
            function(user) {
              var returnToState = ($rootScope.returnToState || 'home');
              var returnToStateParams = ($rootScope.returnToStateParams || {});
              return $state.go(returnToState, returnToStateParams);
            },

            function(errorObject) {
              // FlashService.Error(errorObject.message);
              $scope.dataLoading = false;
            }
          );
        };

      }
    ]);

})();
