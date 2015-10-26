(function(){

  'use strict';

  angular
    .module('SampleApp.DatabaseService', [])
    .factory('DatabaseService', [    "$window", "$q",
      function DatabaseServiceFactory($window,   $q) {

        // Constants:
        var DB_NAME = "sample_app";

        // Be sure to increment this value whenever you add or change your DB
        // structure!! Only when changed the 'openReq.onupgradeneeded' will run!
        var DB_VERSION = 1;

        // The object in which we'll store the database:
        var db;

        // This works on all browsers, and only uses IndexedDBShim as a final fallback
        var indexedDB = $window.indexedDB       ||
                        $window.mozIndexedDB    ||
                        $window.webkitIndexedDB ||
                        $window.msIndexedDB     ||
                        $window.shimIndexedDB;

        return {

          getDatabase: function() {
            var deferred = $q.defer();

            if (typeof db !== 'undefined' && db !== null) {
              // Resolve the already initialized database:
              deferred.resolve(db);
            } else {
              // Initialize the database:
              // Make a request to open the database:
              var openReq = indexedDB.open(DB_NAME, DB_VERSION);

              // The callback used when the DB was opened successfully, but changes where
              // required:
              openReq.onupgradeneeded = function (event) {
                event.target.result.createObjectStore(
                  "sessions", { keyPath: "key", autoIncrement: false }
                );
                console.log("Database '" + DB_NAME + "' upgraded to version '" + DB_VERSION + "'");
              };

              // The callback used when the DB was opened successfully, and no changes where
              // required:
              openReq.onsuccess = function (event) {
                db = event.target.result;
                deferred.resolve(db);
                console.log("Database '" + DB_NAME + "' opened.");
              };

              // The callback used when the DB failed to open:
              openReq.onerror = function (event) {
                var msg = "openReq.onerror: Operation failed: " + event.target.error.message;
                alert(msg);
                console.log(msg);

                // alert(errorCallback);
                deferred.reject(event);
              };
            }

            return deferred.promise;
          },

          // Returns the object store inside a transaction:
          getObjectStore: function(name, mode) {
            if (!mode) { mode = "readonly"; }
            return this.getDatabase().then(
              function(database) {
                return database.transaction(name, mode).objectStore(name);
              }
            );
          }
        };

      }
    ])
})();
