var AppView = Backbone.View.extend({

	el: $('#contents'),

	initialize: function () {
        this.render();
	},
	render: function () {
        var searchView = new SearchView(),
        mdbrdView = new MdbrdView();
	}
});

var AppRouter = Backbone.Router.extend({
    routes: {
        '': 'default',
        '/:id': 'view'
    },
    initialize: function () {

        //setup models
        window.Shots = new ShotList();
        window.mdbrd = new Mdbrd();

        //show
        var appView = new AppView();
    },
    view: function (id) {
       var load = $.ajax({
            url: 'data/save.php',
            data: {id: id},
            type: 'GET',
            dataType: 'json'
       });
       load.success(function (response) {
            if(response === null) console.log('no response');
           // !!! deal with null repsonse
           _.each($(mdbrd.models).toArray(), function (model) {
                model.clear();
            });

           _.each(response, function (model) {
               console.log(model);
               mdbrd.create(model);
           });
       });
    },
    default: function () {
        console.log(Backbone.sync);
        mdbrd.fetch();
    }
});

var app = new AppRouter();
Backbone.history.start({root: '/webdev/Test%20Area/mdbrdjs/'});

// What's Needed
// - back pagination button
// - flickr/etsy search?
// - sort out styling, repsonsive
// - way of rearranging images on the final screen
// - saving properly and getting share link