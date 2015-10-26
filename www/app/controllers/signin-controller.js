(function(){

  'use strict';

  angular

    // Declare the dependencies for the Angular controller defined in this file:
    .module('SampleApp.signin', [
      'SampleApp.AuthenticationService',
      'ui.router'
    ])

    // Configure the angular UI routes/states for the home routes:
    .controller('SignInController', [ "$scope", "$state", "$rootScope", "AuthenticationService",
      function   SignInController   (  $scope,   $state,   $rootScope,   AuthenticationService) {

        // clear any saved credentials...
        AuthenticationService.clearCurrentUser();

        $scope.signin = function() {
          console.log("SignInController.signin");
          console.log("Username: '" + $scope.username + "'; Password: '" + $scope.password + "'");
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
