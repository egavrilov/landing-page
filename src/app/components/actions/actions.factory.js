export default /*@ngInject*/function ActionsFactory($http, $rootScope) {
  var factory = {
    actions: [],
    actionsById: {}
  };

  factory.getById = getById;

  function getActions() {
    return $http.get('http://api.love.sl/v1/actions/actions/').then((response) => {
      if (!response.data.results) return;
      factory.actions = factory.actions.concat(response.data.results);

      response.data.results.reduce((actions, action) => {
        actions[action.id] = action;
        return actions;
      }, factory.actionsById);

      $rootScope.$emit('actionsFetched');
    });
  }

  function getById(id) {
    if (!factory.actions || !factory.actionsById)
      return;
    if (angular.isArray(id)) {
      return id.map(getById);
    }
    return factory.actionsById[id];
  }

  getActions();
  return factory;
}
