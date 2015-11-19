/*global angular*/
export default function Actions() {
  return {
    scope: true,
    bindToController: true,
    templateUrl: 'app/components/actions/actions.html',
    controller: ActionsController,
    controllerAs: 'actions'
  };
}

class ActionsController {
  /**
   *@ngInject
   */
  constructor(Actions, $http, $interval) {
    this.model = Actions;
    this.$http = $http;
    this.$interval = $interval;
  }

  getImage(action, type) {
    let image = action.images.filter((image) => image.name.toLowerCase() == type.toLowerCase());
    return image[0] && image[0].img;
  }

  registerInAction(action) {
    action = action || this.current;
    return this.$http.post('http://promo.love.sl/submitjson/{id}', {
      id: '{some_form_id_for_all_actions}',
      action: angular.isString(action) ? action : action.id
    });
  }
}
