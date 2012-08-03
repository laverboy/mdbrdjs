//create the model, but details will be added from the search results
Shot = Backbone.Model.extend({
	defaults: function() {
		return {
			selected: false
		};
	},
	toggle: function() {
		this.set({selected: !this.get("selected")});
	},
	initialize: function() {
		this.bind('change:selected', this.record);
	},
	record: function() {
		
		var selected = this.get("selected");
		if(selected === true){
			mdbrd.create(this.toJSON());
		}
		else if(selected === false){
			
            var mdbrdImage = mdbrd.get(this.id);
            if (mdbrdImage) mdbrdImage.clear();
		}
		
	}
});

//manage the collection of shot models and render results on reset
ShotList = Backbone.Collection.extend({
	model: Shot,
	el: $('#results'),
	initialize: function() {
		_.bindAll(this, 'addOne', 'render');
		this.bind('add', this.addOne);
		this.bind('reset', this.render);
	},
	//this limits results when collection is fetched
	parse: function(response){
		if(response.query.count > 0){
			return response.query.results.a;
		}else{
			console.log("parse no results", response);
		}
		
	},
	page: 1,
	//fetch shots from dribble. 'search' is set in the view.
	url: function() {
		var searchRoot = "http://query.yahooapis.com/v1/public/yql?q=",
			searchUrl = "select * from html where url='http://dribbble.com/search?page=",
			searchEnd = "&format=json&callback";
		
		searchUrl += this.page;
		searchUrl += "&q=";
		searchUrl += this.search;
		searchUrl += "' and xpath='//div[@class=\"dribbble-img\"]/a[1]'";
		
		//console.log(searchRoot + encodeURIComponent(searchUrl) + searchEnd);

		return searchRoot + encodeURIComponent(searchUrl) + searchEnd;
		//return "http://api.dribbble.com/players/" + encodeURIComponent(this.search) +"/shots?per_page=18";
	},
	addOne: function(shot) {
		//pass the individual model to a new shotview then render
		var view = new ShotView({model: shot});
		$('#results').append(view.render().el);
		
	},
	render: function(collection){
		$('#results').html('');
		this.each(this.addOne);
		$('#results').append('<div style="clear:both;"></div>');
	}
});

window.ShotView = Backbone.View.extend({
	
	tagName: 'li',
	className: 'shot',
	template: _.template($('#shot-template').html()),
	initialize: function () {
		_.bindAll(this, 'toggleClass');
		this.model.bind('change:selected', this.toggleClass);
	},
	events: {
		"click a" : "clicked"
	},
	render: function(){
		var img = this.model.get("img"),
		href = this.model.get("href"),
		id = href.substr(7).split("-"),
		html = this.template({
			id: id[0],
			url: img['src'],
			link: href,
			alt: img['alt']
		});
		
		this.model.set({shotId: id[0], id: id[0]});

		this.$el.append(html);
		return this;
	},
	clicked: function(e) {
		e.preventDefault();
		this.model.toggle();
	},
	toggleClass: function () {
		this.$el.toggleClass('selected');
	}

});

/*********************************************** 
     Begin searchview.js 
***********************************************/ 

var SearchView = Backbone.View.extend({
					
	el: $("#searchView"),
	template: _.template($('#search-template').html()),
	events: {
		"keypress #entrybox": "searchOnEnter",
		"click #more" : "search",
		"click #clear": "reset",
        "click #save" : "saveMdbrd"
	},
	initialize: function() {
		_.bindAll(this, 'searchSuccess', 'preSearch');
	},
	search: function () {
		this.$el.find('#more').remove();
        this.$el.find('#results').html('');
		Backbone.sync = Backbone.ajaxSync;
		Shots.fetch({success: this.searchSuccess, error: this.searchError});
		Backbone.sync = Backbone.localSync;
	},
	searchOnEnter: function(e) {
		if(e.keyCode !=13) return;
		this.$el.find('#search').addClass('loading');
		this.$el.find('p.noresults').remove();
		
		Shots.page = 1;
		Shots.search = encodeURIComponent($('#entrybox').val());
		this.search();
		
	},
	searchSuccess: function(){
		this.$el.find('#search').removeClass('loading');
		if (Shots.models.length === 0 ) {
			this.searchEmpty();
		} else {
			this.$el.find('#entrybox').blur();
			this.$el.find('#results').find('li').first().children('a').focus();
			this.preSearch();
		}
	},
	searchEmpty: function () {
		this.$el.find('#results').append(
			$('<p></p>', {
				class: 'noresults',
				text: "Sorry no results for that search - please try again!"
			})
		);
	},
	searchError: function(){
		this.$el.find('#search').removeClass('loading');
		this.$el.find('#results').html("Sorry no results for that search - try again!");
	},
	preSearch: function () {
        var that = this;
		Shots.page++;
		var searchN = $.get(Shots.url());
		searchN.done(function (response) {
			var count = response.query.count;
			if(count > 0) that.addMoreButton();
		});
	},
	addMoreButton: function () {
		this.$el.find('#results').append(
			$('<button></button>', {
				class: 'orange',
				text: 'More',
				id: 'more'
			})
		);
	},
	reset: function (e) {
		e.preventDefault();
		_.each($(mdbrd.models).toArray(), function (model) {
            model.clear();
        });
	},
    saveMdbrd: function (e) {
        e.preventDefault();
        mdbrd.saveToDb();
    }

});

/*********************************************** 
     Begin mdbrdview.js 
***********************************************/ 

var MdbrdView = Backbone.View.extend({
	el: $('#mdbrdView'),
	template: _.template($('#mdbrdview-template').html()),
	initialize: function(){
		_.bindAll(this, 'addOne', 'addAll');
		mdbrd.bind('reset', this.addAll, this);
		mdbrd.bind('change:bigImage', this.addOne, this);
	},
	events: {
    	"click #full" : "fullToggle"
	},
	render: function(){
		mdbrd.each(this.addOne);
	},
	addOne: function(selectedShot){
		var fullshotview = new FullShotView({model: selectedShot});
		this.$el.find('.bigShots').append(fullshotview.render().el);
	},
	addAll: function () {
		mdbrd.each(this.addOne);
	},
	fullToggle: function (e) {
    	e.preventDefault();
    	$('#contents').toggleClass('full');
	}
});

var FullShotView = Backbone.View.extend({
	tagName: 'div',
	className: 'fullShot',
	template: _.template($('#fullshot-template').html()),
	events: {
		'click .trash' : 'clear'
	},
	initialize: function () {
		this.model.bind('destroy', this.removeView, this);
	},
	render: function(){
		this.$el.append(this.template(this.model.toJSON()));
		return this;
	},
	clear: function () {
		this.model.clear();
	},
	removeView: function () {
		this.$el.remove();
	}
});

/*********************************************** 
     Begin mdbrd.js 
***********************************************/ 

var MdbrdImage = Backbone.Model.extend({
    initialize: function () {
        this.bind("destroy", this.checkForShot);
    },
    clear: function () {
        this.destroy();
    },
    checkForShot: function () {
        // when a model is removed check if there is a
        // corresponding shot visible and ticked, if so untick it
        var shot = Shots.get(this.id);
        if (shot && shot.get("selected") === true){ shot.toggle();}
    }
});
var Mdbrd = Backbone.Collection.extend({
	model: MdbrdImage,
	localStorage: new Store("Mdbrds"),
	initialize: function () {
		this.bind("add", this.addBigImage);
	},
	addBigImage: function (mdbrdModel) {
		var hasBigImage = mdbrdModel.get('bigImage');
		if (!hasBigImage) {
			console.log(false);
			var id = mdbrdModel.get('shotId');
			var bigData = $.getJSON('http://api.dribbble.com/shots/' + id + '?callback=?');
			bigData.done(function (response) {
				mdbrdModel.save({
					bigImage: response.image_url
				});
			});
		} else {
			mdbrdModel.trigger('change:bigImage');
		}
	},
    saveToDb: function () {
        var save = $.ajax({
            url: 'data/save.php',
            data: JSON.stringify(mdbrd.toJSON()),
            type: 'POST'
        });
        save.done(function (response) {
            console.log("response: ", window.response = response);
        });
    }
});

/*********************************************** 
     Begin appview.js 
***********************************************/ 

var AppView = Backbone.View.extend({

	el: $('#contents'),
	initialize: function () {
        this.render();
	},
	render: function () {
        var mdbrdView = new MdbrdView(),
        searchView = new SearchView();
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