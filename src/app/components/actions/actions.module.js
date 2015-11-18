/* global angular */
import Actions from './actions.factory';
import ActionsDirective from './actions.directive';

angular.module('sl.actions', ['ngRoute'])
  .config(/*@ngInject*/ function ($routeProvider, $locationProvider) {
    let mainPage = {
      templateUrl: 'app/main/main.html',
      controller: 'MainController',
      controllerAs: 'main'
    };
    $routeProvider
      .when('/actions/:id', angular.extend({
        resolve: {
          current: /*@ngInject*/(Actions, $route, $rootScope, $q) => {
            let deferred = $q.defer();
            let setAction = () => {
              Actions.current = Actions.getById($route.current.params.id);
              deferred.resolve();
            };
            if (Actions.actions.length) {
              setAction();
            } else {
              let actionsFetchedEvent = $rootScope.$on('actionsFetched', setAction);
              $rootScope.$on('$destroy', actionsFetchedEvent);
            }

            return deferred.promise;
          }
        }
      }, mainPage))
      .when('/', angular.extend({
        resolve: {
          current: /*@ngInject*/ (Actions, $rootScope, $q) => {
            let deferred = $q.defer();
            let clear = () => {
              Actions.current = null;
              deferred.resolve();
            };

            if (Actions.actions.length) {
              clear()
            } else {
              let actionsFetchedEvent = $rootScope.$on('actionsFetched', clear);
              $rootScope.$on('$destroy', actionsFetchedEvent);
            }

            return deferred.promise;
          }
        }
      }, mainPage));

    $locationProvider.hashPrefix('!');
  })
  .directive('slActions', ActionsDirective)
  .factory('Actions', Actions);
