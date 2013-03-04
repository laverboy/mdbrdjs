var app = angular.module('mdbrd', ['ngResource'], function ($provide) {
    $provide.factory('db', ['$http', function(http) {
        var items = [];
        var modify = {
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
                http.jsonp('http://api.dribbble.com/shots/' + item.id + '?callback=JSON_CALLBACK')
                .success(function (response) {
                    item.bigImageUrl = response.image_url
                });
            }
            
        };
        return modify;
    }]);
});

app.run( function($rootScope) {
    $rootScope.full = false;
});

function searchCtrl ($scope, $resource, db) {

    $scope.shots = [];
    $scope.loading = false;

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
                    'alt' : 'http:' + num.div.noscript.img.alt,
                    'href': num.a[0].href,
                    'id'  : num.a[0].href.substr(7).split("-")[0],
                    'selected' : false
                };
                return newNum;
            });
            $scope.shots.push(shotsArray);
            $scope.loading = false;
            console.log('shots: ', $scope.shots);
        });
    }

    $scope.toggleSelected = function (shot, $event) {
        $event.preventDefault();
        // shot.selected = !shot.selected;
        db.toggleItem(shot);
    }

    $scope.isSelected = function (item) {
        return db.hasItem(item);
    }
}

function mdbrdCtrl ($scope, db, $rootScope) {
    
    $scope.images = db.getItems();

    $scope.toggleFullScreen = function () {
        $rootScope.full = !$rootScope.full;
    }
    $scope.removeItem = function (item) {
        db.removeItem(item);
    }
}