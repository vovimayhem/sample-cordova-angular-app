/*
 * Configures the start of the AngularJS application:
 */

(function(){

  angular
    // Declare the dependencies for the Angular 'run' method in this file:
    .module('SampleApp', [
      'ui.router',
      'SampleApp.Home', // Will load the 'SampleApp.Authentication' module, as it's a defined dependency...
    ])

    // RUN: ====================================================================
    .run([          '$rootScope', '$state', '$stateParams',
    function SampleAppRun ($rootScope,   $state,   $stateParams) {
      console.log("Executing the angular app's 'run' method...");
      // It's very handy to add references to $state and $stateParams to the $rootScope
      // so that you can access them from any scope within your applications.For example,
      // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
      // to active whenever 'contacts.list' or one of its decendents is active.
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;

      $rootScope.$on('$stateChangeStart',
      function(event, toState, toParams, fromState, fromParams) {

        console.log("========= Transitioning from state '" +
          fromState.name +
          "' to state '" +
          toState.name + "'..."
        );

        $rootScope.toState       = toState;
        $rootScope.toStateParams = toParams;
      });

      $rootScope.$on('$stateChangeSuccess',
      function(event, toState, toParams, fromState, fromParams){
        console.log("========= Transition from state '" +
          fromState.name +
          "' to state '" +
          toState.name + "' successful!"
        );
      });

      $rootScope.$on('$stateChangeError',
      function(event, toState, toParams, fromState, fromParams, error){
        console.log("========= Transition from state '" +
          fromState.name +
          "' to state '" +
          toState.name + "' Failed: " +
          error
        );
      });

    }]);

})();
