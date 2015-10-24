(function(){

  'use strict';

  angular
    .module('SampleApp.AuthenticationService', [
      'SampleApp.DatabaseService', // Needed by methods that check the database
      'SampleApp.signin',          // Needed by the authenticateUser method to re-route the user to the signin state
      'ui.router'                  // Needed by the authenticateUser method to route the user to any state
    ])
    .factory('AuthenticationService', [    "$rootScope", "$q", "$state", "DatabaseService",
      function AuthenticationServiceFactory($rootScope,   $q,   $state,   DatabaseService) {

        // We'll define the 'currentUser' variable here, to keep it private* from
        // other javascript scopes... we'll use this *IF* performance is decreased
        // by repeatedly querying the database by calling getCurrentUser method,
        // and if that's the case, we'll implement some sort of mnemoization, storing
        // the data here.
        //
        // *Private means that is only accessible from within this whole
        // (function(){})(); madness:
        var currentUser = null;

        return {

          authenticateUser: function(creds) {

            console.log('AuthenticationService.authenticateUser called');
            console.log(creds);

            if (typeof creds !== 'undefined' && creds !== null) {

              // This should instead go to a web service of some sort...
              if (creds.username == 'test' && creds.password == 'test') {
                var testUser = { name: "Test User", token: "Wachumara" };
                return this.setCurrentUser(testUser);
              } else {
                var deferred = $q.defer();
                deferred.reject("Invalid username/password");
                return deferred.promise;
              }
            } else {
              console.log('AuthenticationService.authenticateUser -> checking for current user...');
              // Check if there's a logged-in user:
              return this.getCurrentUser().then(
                function(user) {
                  // return true if the user is authenticated:
                  console.log('AuthenticationService.authenticateUser Success!');
                  return user;
                },

                // On promise rejected since there's no user signed in,
                // navigate to the signin state:
                function(error) {

                  console.log('AuthenticationService.authenticateUser Error: ' + error.message);

                  // Since the user is not authenticated, stow the state they
                  // wanted before we send them to the signin state, so we can
                  // return them when we're done:
                  $rootScope.returnToState = $rootScope.toState;
                  $rootScope.returnToStateParams = $rootScope.toStateParams;

                  // Now, we'll send them to the signin state so they can log in:
                  return $state.go('signin');
                }
              );
            }
          },

          getCurrentUser: function() {

            // Create a DB 'get' request for the current session object:
            return DatabaseService.getObjectStore('sessions').then(
              function(store) {

                var deferred = $q.defer();

                var getRequest = store.get('current_user');

                getRequest.onsuccess = function(event) {
                  var user = event.target.result;
                  if (typeof user !== 'undefined' && user !== null) {
                    console.log("current user found on DB");
                    deferred.resolve(user);
                  } else {
                    var msg = "No authenticated user found on DB";
                    console.log(msg);
                    deferred.reject({message: msg});
                  }
                };

                getRequest.onerror = function(err) {
                  deferred.reject(err);
                };

                return deferred.promise;
              }
            );
          },

          setCurrentUser: function(user) {

            // Set the received session object 'key' value to 'current':
            user.key = "current_user";

            // Create a DB 'add' request for the received session object:
            DatabaseService.getObjectStore('sessions', 'readwrite').then(
              function(store) {
                var deferred = $q.defer();
                var request = store.add(user);

                request.onsuccess = function(event) { deferred.resolve(event); };
                request.onerror   = function(error) { deferred.reject(error);  };
              }
            );

            return deferred.promise;
          },

          clearCurrentUser: function() {

            return DatabaseService.getObjectStore('sessions', 'readwrite').then(
              function(store) {
                var deferred = $q.defer();
                var request = store.clear();

                request.onsuccess = function(event) { deferred.resolve(event); };
                request.onerror   = function(error) { deferred.reject(error);  };

                return deferred.promise;
              }
            );
          },

        };
      }
    ]);

})();
