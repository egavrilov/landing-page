class Outlets {
  constructor() {
    this.restrict = 'A';
    this.scope = true;
    this.bindToController = true;
    this.templateUrl = 'app/components/slOutlets/slOutlets.html';
    this.controller = OutletsController;
    this.controllerAs = 'outlets';
  }
}

class OutletsController {
  /**
   *@ngInject
   */
  constructor($document, $scope, $q, $timeout, $window, NgMap, Main) {
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.$document = $document;
    this.$window = $window;
    this.model = Main;

    $q.all({
      map: NgMap.getMap(),
      model: this.model.init()
    }).then((results) => {
      this.map = results.map;
      this.render();
    });
  }

  render() {
    this.bounds = this.gm('LatLngBounds');
    this.model.outlets.forEach((outlet) => {
      if (outlet.geo && outlet.geo.length) {
        let marker = this.gm('LatLng', outlet.geo[0], outlet.geo[1]);
        this.bounds.extend(marker);
      }
    });
    this.$scope.google.maps.event.trigger(this.map, 'resize');
    this.map.fitBounds(this.bounds);
    this.map.panToBounds(this.bounds);
    if (this.map.zoom > 15 ) this.map.setZoom(15);
  }

  showcase(refresh){
    if (refresh) {
      this._showcase = refresh;
      this.$timeout(() => {
        this.render();
      });
    }

    return this._showcase || 'list';
  }

  trackRegion() {
    this.model.filterOutlets();
    this.render();
  }

  addMarker(lat, lng) {
    if (!this.map) return;
    return this.gm('Marker', {
      position: this.gm('LatLng', lat, lng),
      map: this.map
    });
  }

  openInfo(event, outlet, outletsScope) {
    let id = outlet.id;
    let map = this.map;
    let infoWindow = map.infoWindows[`info_${id}`];
    let marker = map.markers[`outlet_${id}`];
    let anchor = marker ? marker : (this.getPosition ? this : null);
    let scope = outletsScope.$scope;

    scope.current = outlet;
    scope.getKeys = (some) => Object.keys(some).join('\n');
    outlet.icon = 'http://cdn1.love.sl/love.sl/common/actions/charm/assets/marker_active.png';
    infoWindow.__open(map, scope, anchor);

    if (event !== null) {
      outletsScope.select(outlet);
      outletsScope.$timeout(() => outletsScope.scroll());
    }

    if (map.singleInfoWindow) {
      if (map.lastInfoWindow && map.lastInfoWindow !== id) {
        map.infoWindows[`info_${map.lastInfoWindow}`].close();
        outletsScope.model.getById(map.lastInfoWindow).icon = '';
      }
      map.lastInfoWindow = id;
    }
  }

  select(selectedOutlet) {
    this.model.outlets.forEach((outlet) => {
      outlet.selected = (outlet.id === selectedOutlet.id);
    });

    this.openInfo(null, selectedOutlet, this);
  }

  scroll() {
    let list = document.querySelector('.outlets--wrapper'); //eslint-disable-line angular/document-service
    let selected = list.querySelector('.outlet-selected');
    angular.element(list).animate({
      scrollTop: selected.offsetTop - selected.offsetHeight
    });
    angular.element(document).scrollTop(window.pageYOffset + list.parentNode.getBoundingClientRect().top);  //eslint-disable-line angular/document-service,angular/window-service
  }

  filter(outlet) {
    let belongsToMap;
    let matchPattern = true;
    if (!this)  return;

    if (this.map) {
      let bounds = this.map.getBounds();
      belongsToMap = bounds.contains(this.map.markers[`outlet_${outlet.id}`].getPosition());
    }

    if (this.outletsFilter)
      matchPattern = angular.toJson(outlet).toLowerCase().indexOf(this.outletsFilter) !== 1;

    return belongsToMap && matchPattern;
  }

  zoomChanged() {
    this.scope.$apply();
  }

  gm(googleMapsMethod) {
    let args = [null].concat(Array.prototype.slice.call(arguments, 1));
    return new (Function.prototype.bind.apply(this.$window.google.maps[googleMapsMethod], args));
  }
}

export default Outlets;
