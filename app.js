/*global angular, _, console */
/*jshint globalstrict: true*/
'use strict';

var app = angular.module('mdbrd', ['ngResource']);

app.config( ['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode(true);
} ] );

app.factory('Mongodb', function ($resource) {
    var mongolab = $resource('https://api.mongolab.com/api/1/databases' +
        '/moodboards/collections/mdbrds/:id',
        { apiKey: 'dj1dHpCLgc0tT_9wzAE2d2670XleOZsX', fo: true }, {
            update: { method: 'PUT' }
        }
    );

    return mongolab;
});

app.factory('mdbrddb', ['$http', 'Mongodb', '$location', '$rootScope', function($http, Mongodb, $location, $rootScope) {
    var items = [];
    var mdbrddb = {
        generateUID: function () {
            return ("00000" + (Math.random()*Math.pow(36,5) << 0).toString(36)).substr(-5);
        },
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
            
            $rootScope.active = true;
            Mongodb.save({
                "x" : angular.toJson(items),
                "xid" : this.generateUID()
            }, function (response) {
                $location.hash(response.xid);
                $rootScope.active = false;
            });
        }
    };

    return mdbrddb;
}]);

app.run( function($rootScope, mdbrddb) {
    $rootScope.full = false;
    $rootScope.active = false;
});

function toolsCtrl ($scope, mdbrddb, $location, Mongodb, $rootScope) { 
    $scope.hasid = false;
    $scope.$watch(function(){ return $location.hash(); },
        function(id){ $scope.id = id; }
    );
    $scope.$watch('id', function(id){
      if(id){
        // handle scenario when there's id available
        mdbrddb.clearItems();
        $rootScope.full = true;
        var s = JSON.stringify({'xid': id});
        Mongodb.get({q: s}, function (resp) {
            var items = angular.fromJson(resp.x);
            _.each(items, function (item) {
                mdbrddb.addItem(item);
            });
            $scope.tweettext = escape("Check out the mood board I made at http://mdbrd.net/#" + id);
            $scope.hasid = true;
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
    $scope.reload = function () {
        document.location.reload(true);
    };
    
    
}

function searchCtrl ($scope, $resource, mdbrddb) {

    $scope.shots = [];
    $scope.loading = false;
    $scope.page = 0;

    $scope.query = {
        get url() { return "http://dribbble.com/search?page=" + this.page + "&q="; },
        page: 1,
        hasNextPage: false,
        nextPageArray: []
    };

    $scope.dribbble = $resource('http://query.yahooapis.com/v1/public/yql/mattl/dribbble',
            {query: '', format: 'json', callback:'JSON_CALLBACK'},
            {get:{method: 'JSONP'}}
        );

    $scope.startSearch = function () {
        $scope.query.page = 1;
        $scope.query.hasNextPage = false;
        var newSearchUrl = $scope.query.url + encodeURIComponent($scope.search);
        $scope.loading = true;
        $scope.dribbble.get({query: newSearchUrl, diagnostics: true},
            // Success
            function(data){
                console.log('yql results: ', data);
                if ( !data.query.count )
                {
                    $scope.loading = false;
                    $scope.flash("No results for that search. I'm terribly sorry.");
                    return false;
                }
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

                checkForNextPage();
                console.log('shots: ', $scope.shots);
            },
            // Failure
            function(){
                $scope.loading = false;
                $scope.flash("There seems to be some kind of problem with the search system. It's probably Yahoo messing us around again!");
            }
        );
    };

    var checkForNextPage = function () {
        $scope.query.page++;
        var newSearchUrl = $scope.query.url + encodeURIComponent($scope.search);
        $scope.dribbble.get({query: newSearchUrl, diagnostics: true},
            // Success
            function(data){
                console.log('next page results: ', data);
                if ( data.query.count )
                {
                    $scope.query.nextPageArray = _.map(data.query.results.div, function(num){
                        var newNum = {
                            'url' : 'http:' + num.div.noscript.img.src,
                            'alt' : num.div.noscript.img.alt,
                            'href': num.a[0].href,
                            'id'  : num.a[0].href.substr(7).split("-")[0]
                        };
                        return newNum;
                    });
                    $scope.query.hasNextPage = true;
                }
                else
                {
                    $scope.query.hasNextPage = false;
                }
            }
        );
    };

    $scope.addNextPage = function () {
        $scope.shots.push($scope.query.nextPageArray);
        $scope.query.nextPageArray = [];
        $scope.query.hasNextPage = false;
        $scope.page = $scope.shots.length - 1;
        checkForNextPage();
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

    $scope.flash = function (message) {
        console.log(message);
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