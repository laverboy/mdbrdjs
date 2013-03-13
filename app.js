/*global angular, _ */

var app = angular.module('mdbrd', ['ngResource']);

app.config( ['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode(true);
} ] );

app.factory('Mongodb', function ($resource) {
    var mongolab = $resource('https://api.mongolab.com/api/1/databases' +
        '/moodboards/collections/mdbrds/:id',
        { apiKey: 'dj1dHpCLgc0tT_9wzAE2d2670XleOZsX' }, {
            update: { method: 'PUT' }
        }
    );

    return mongolab;
});

app.factory('mdbrddb', ['$http', 'Mongodb', '$location', function($http, Mongodb, $location) {
    var items = [];
    var mdbrddb = {
        addItem: function  (item) {
            if ( !_.has(item, "bigImageUrl")) {
                item.bigImageUrl = this.getBigImage(item);
            }
            items.push(item);
        },
        removeItem: function (item) {
            var found = _.findWhere(items, {id: item.id});
            items.splice(items.indexOf(found), 1); 
        },
        toggleItem: function (item) {
            ( this.hasItem(item) ) ? this.removeItem(item) : this.addItem(item);
        },
        getItems: function () { return items; },
        clearItems: function () { items.length = 0; },
        hasItem: function (item) {
            return ( _.findWhere(items, {id: item.id}) ) ? true : false;
        },
        getBigImage: function (item) {
            $http.jsonp('http://api.dribbble.com/shots/' + item.id + '?callback=JSON_CALLBACK')
            .success(function (response) {
                item.bigImageUrl = response.image_url;
            });
        },
        save: function () {
            // if no items yet just return
            if (items.length === 0) return false;

            Mongodb.save({"x" : angular.toJson(items)}, function (response) {
                $location.hash(response._id.$oid);
            });
        }
    };

    return mdbrddb;
}]);

app.run( function($rootScope, mdbrddb) {
    $rootScope.full = false;
});

function toolsCtrl ($scope, mdbrddb, $location, Mongodb, $rootScope) {
    $scope.$watch(function(){ return $location.hash(); },
      function(id){ $scope.id = id; }
    );
    $scope.$watch('id', function(id){
      if(id){
        // handle scenario when there's id available
        mdbrddb.clearItems();
        $rootScope.full = true;
        Mongodb.get({id: id}, function (resp) {
            var items = angular.fromJson(resp.x);
            _.each(items, function (item) {
                mdbrddb.addItem(item);
            });
        });
        return;
      }
    });
    $scope.saveMdbrd = function ($event) {
        $event.preventDefault();
        mdbrddb.save();
    };
    $scope.clearMdbrd = function ($event) {
        $event.preventDefault();
        mdbrddb.clearItems();
        $rootScope.full = false;
    };
}

function searchCtrl ($scope, $resource, mdbrddb) {

    $scope.shots = [];
    $scope.loading = false;
    $scope.page = 0;

    $scope.dribbble = $resource('http://query.yahooapis.com/v1/public/yql/mattl/dribbble',
            {query: '', format: 'json', callback:'JSON_CALLBACK'},
            {get:{method: 'JSONP'}}
        );

    $scope.startSearch = function () {
        var newSearchUrl = "http://dribbble.com/search?q=" + encodeURIComponent($scope.search);
        $scope.loading = true;
        $scope.dribbble.get({query: newSearchUrl, diagnostics: true}, function(data){
            console.log('yql results: ', data);
            // handle 0 result
            var shotsArray = _.map(data.query.results.div, function(num){
                var newNum = {
                    'url' : 'http:' + num.div.noscript.img.src,
                    'alt' : num.div.noscript.img.alt,
                    'href': num.a[0].href,
                    'id'  : num.a[0].href.substr(7).split("-")[0]
                };
                return newNum;
            });
            $scope.shots.push(shotsArray);
            $scope.loading = false;
            $scope.page = $scope.shots.length - 1;
            console.log('shots: ', $scope.shots);
        });
    };

    $scope.toggleSelected = function (shot, $event) {
        $event.preventDefault();
        mdbrddb.toggleItem(shot);
    };

    $scope.isSelected = function (item) {
        return mdbrddb.hasItem(item);
    };

    $scope.changePage = function (page, $event) {
        $event.preventDefault();
        $scope.page = page;
    };
}

function mdbrdCtrl ($scope, mdbrddb, $rootScope) {

    $scope.images = mdbrddb.getItems();

    $scope.toggleFullScreen = function () {
        $rootScope.full = !$rootScope.full;
    };
    $scope.removeItem = function (item) {
        mdbrddb.removeItem(item);
    };

}