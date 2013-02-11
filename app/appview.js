var AppView = Backbone.View.extend({

	el: $('#contents'),
	initialize: function () {
        var mdbrdView = new MdbrdView(),
        searchView = new SearchView();
	}
});

var AppRouter = Backbone.Router.extend({
    routes: {
        '/:id': 'view',
        '': "start"
    },
    initialize: function () {
        //setup models
        window.Shots = new ShotList();
    },
    start : function() {
        window.mdbrd = new Mdbrd();
        var appView = new AppView();   
    },
    view: function (id) {
        $('.bigShots').html('');
        window.mdbrd = new Mdbrd({id: id});
        mdbrd.fetch({
            data: {id: id},
            success: function() {
                $('#contents').addClass('full');
            },
            error: function() {
                console.log('error');
                window.location.hash = '';
            }
        });
        var appView = new AppView();
        
    }
});

jQuery(document).ready(function ($) {
    var app = new AppRouter();
    Backbone.history.start({root: '/webdev/Test%20Area/mdbrdjs/'});    
});

// What's Needed
// - back pagination button
// - flickr/etsy search?
// - sort out styling, repsonsive
// - way of rearranging images on the final screen
// - saving properly and getting share link