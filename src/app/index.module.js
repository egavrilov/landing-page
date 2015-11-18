/*global angular*/
import './components/actions/actions.module';
import MainFactory from './main/main.factory';
import MainController from './main/main.controller';
import Outlets from './components/slOutlets/slOutlets.directive';

angular.module('slCatalog', ['ngMap', 'sl.actions'])
  .factory('Main', MainFactory)
  .directive('slOutlets', () => new Outlets())
  .controller('MainController', MainController);
