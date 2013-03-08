/*global angular, _ */

// 5139f762e4b0ee7b4c2c069e

var app = angular.module('mdbrd', ['ngResource']);

app.config( function ($routeProvider) {
    $routeProvider.
        when('/:id', { controller: function($route) { console.log('controller'); } }).
        otherwise({redirectTo: '/'});
} );

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
            item.bigImageUrl = this.getBigImage(item);
            items.push(item);
        },
        removeItem: function (item) { items.splice(items.indexOf(item), 1); },
        toggleItem: function (item) {
            ( this.hasItem(item) ) ? this.removeItem(item) : this.addItem(item);
        },
        getItems: function () { return items; },
        hasItem: function (item) {
            return ( _.find(items, function (i) { return i.id === item.id; }) ) ? true : false;
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

            var json = angular.toJson(items);

            Mongodb.save({"x" : json}, function (response) {
                console.log(response._id.$oid);
                $location.path('/' + response._id.$oid);
            });
        }
    };

    return mdbrddb;
}]);

app.run( function($rootScope, mdbrddb) {
    $rootScope.full = false;

});

function toolsCtrl ($scope, mdbrddb) {
    $scope.saveMdbrd = function ($event) {
        $event.preventDefault();
        mdbrddb.save();
    };
}

function searchCtrl ($scope, $resource, mdbrddb) {

    $scope.shots = [];
    $scope.loading = false;
    $scope.page = 0;

    $scope.dribbble = $resource('https://query.yahooapis.com/v1/public/yql',
            {q: '', format: 'json', callback:'JSON_CALLBACK'},
            {get:{method: 'JSONP'}}
        );

    var searchUrl = "select * from html where url='http://dribbble.com/search?q=",
        searchUrlEnd = "' and xpath='//div[@class=\"dribbble-img\"]'";

    $scope.startSearch = function () {
        var newSearchUrl = searchUrl + encodeURIComponent($scope.search) + searchUrlEnd;
        $scope.loading = true;
        $scope.dribbble.get({q: newSearchUrl}, function(data){
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

    // $scope.$on('$routeChangeSuccess', function () {
    //     console.log($route.current);
    // });
}