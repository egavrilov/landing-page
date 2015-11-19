/*global angular*/
export default /*@ngInject*/function ActionsFactory($http, $rootScope, $q) {
  var factory = {
    actions: [],
    actionsBySlug: {}
  };

  factory.getBySlug = getBySlug;
  factory.getActions = getActions;

  function getActions() {
    return $q.when(factory.actions.length ? {data: factory.actions} : $http.get('http://api.love.sl/v1/actions/actions/'))
      .then((response) => {
      if (!response.data.results) return;
      factory.actions = factory.actions.concat(response.data.results);

      response.data.results.reduce((actions, action) => {
        actions[action.slug] = action;
        return actions;
      }, factory.actionsBySlug);

      $rootScope.$emit('actionsFetched');
    });
  }

  function getBySlug(slug) {
    if (!factory.actions || !factory.actionsBySlug)
      return;
    if (angular.isArray(slug)) {
      return slug.map(getBySlug);
    }
    return factory.actionsBySlug[slug];
  }

  getActions();
  return factory;
}
