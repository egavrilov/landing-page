/*global angular*/
function MainFactory($log, $http, $timeout, $q) {
  let outlets = [];
  let regions = [];
  let defaultRegion = '91eae2f5-b1d7-442f-bc86-c6c11c581fad';
  let factory = {
    base: 'http://api.love.sl/v1/',
    modern: 'http://api.love.sl/v2/',
    outlets: [],
    filterOutlets: filterOutlets
  };
  let outletsById;

  factory.init = () => {
    return $q.all({
      location: $q.when(factory.region ? null : getLocation()),
      regions: $q.when(factory.regions ? null : getRegions()),
      outlets: $q.when(factory.outlets.length ? null : getOutlets())
    }).then((response) => {
      let _regions = response.regions ? response.regions.data : factory.regions;

      if (response.location) {
        let regionId = response.location.data && response.location.data.region_id || defaultRegion;
        regions = _regions.reduce((regionsObject, region) => {
          regionsObject[region.id] = region;
          return regionsObject;
        }, {});

        factory.region = { id: regionId, name: regions[regionId].name };
      }

      if (response.regions && response.outlets) {
        factory.regions = {};
        outlets = response.outlets.data.filter((outlet) => !outlet.is_franchise);
        //available regions with filtered outlets
        outlets.forEach((outlet) => {
          if (outlet.region_id && outlet.region_id[0]) {
            let regionId = outlet.region_id[0];
            factory.regions[regionId] = regions[regionId];
          }
        });
      }
    }, error).then(filterOutlets);
  };

  factory.filterById = function (ids) {
    if(!angular.isArray(ids)) {
      ids = [ids];
    }

    factory.outlets = factory.outlets.filter((outlet) => ids.indexOf(outlet.id) !== -1);
  };

  factory.getById = function (id) {
    outletsById = outletsById || outlets.reduce((outletsById, outlet) => {
        outletsById[outlet.id] = outlet;
        return outletsById;
      }, {});

    return outletsById[id] || null;
  };

  function getLocation() {
    return $http.get(factory.base + 'geo/get_location/', { timeout: 5000 });
  }

  function getRegions() {
    return $http.get(factory.modern + 'outlets/regions/');
  }

  function getOutlets() {
    return $http.get(factory.modern + 'outlets/');
  }

  function filterOutlets(){
    factory.outlets = outlets.filter((outlet) =>
      outlet.region_id && outlet.region_id.indexOf(factory.region.id) !== -1);
  }

  let debouncedInit = debounce(factory.init, 2000);
  function error(response) {
    if (response.status === -1) {
      $log.warn('Request timeout, try again');
      debouncedInit();
    }

    if (response.data && response.data.error) {
      $log.warn(response.data.error);
    }

    if (!angular.isString(response.data)) {
      $log.warn('Server error ' + response.status);
      $log.warn(response.data);
      $timeout(debouncedInit, 5000);
    }

    return $q.reject();
  }

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      $timeout.cancel(timeout);
      timeout = $timeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  return factory;
}

export default /*@ngInject*/ MainFactory;
