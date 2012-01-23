//create the model, but details will be added from the search results
Shot = Backbone.Model.extend({});

//manage the collection of shot models and render results on reset
ShotList = Backbone.Collection.extend({
	model: Shot,
	el: '#results',
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
			console.log("No results");
			console.log(response);
		}
		
	},
	//fetch shots from dribble. 'search' is set in the view.
	url: function() {
		var searchRoot = "http://query.yahooapis.com/v1/public/yql?q=";
		var searchUrl = "select * from html where url='http://dribbble.com/search?page=1&q=";
		searchUrl += this.search;
		searchUrl += "' and xpath='//div[@class=\"dribbble-img\"]/a[1]'";
		searchEnd = "&format=json&callback";
		//console.log(searchRoot + encodeURIComponent(searchUrl) + searchEnd);

		return searchRoot + encodeURIComponent(searchUrl) + searchEnd;
		//return "http://api.dribbble.com/players/" + encodeURIComponent(this.search) +"/shots?per_page=18";
	},
	addOne: function(shot) {
		//pass the individual model to a new shotvie then render
		var view = new ShotView({model: shot});
		$(this.el).append(view.render().el);
		
	},
	render: function(collection){
		$(this.el).html('<div style="clear:both;"></div>');
		this.each(this.addOne);
		//Shots.render();
	},
}); 

window.ShotView = Backbone.View.extend({
	
	tagName: 'li',
	className: 'shot',
	template: _.template($('#shot-template').html()),
	events: {
		"click a" : "clicked"
	},
	render: function(){
		var img = this.model.get("img"),
		html = this.template({
			id: this.id,
			url: img['src'],
			link: this.model.get("href")
		});

		$(this.el).append(html);
		return this;
	},
	clicked: function(e) {
		e.preventDefault();
		console.log(e.currentTarget);
	}

});