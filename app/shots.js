//create the model, but details will be added from the search results
Shot = Backbone.Model.extend({
	defaults: function() {
		return {
			selected: false
		}
	},
	toggle: function() {
		this.set({selected: !this.get("selected")});
	},
	initialize: function() {
		this.bind('change:selected', this.record);
	},
	record: function() {
	
		Backbone.sync = Backbone.localSync;
		
		var selected = this.get("selected");
		if(selected === true){
			mdbrd.add(this);
		}
		else if(selected === false){
			mdbrd.remove(this);
		}
		
	}
});

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
			console.log("parse no results", response);
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
		//pass the individual model to a new shotview then render
		var view = new ShotView({model: shot});
		$(this.el).append(view.render().el);
		
	},
	render: function(collection){
		$(this.el).html('');
		this.each(this.addOne);
		$(this.el).append('<div style="clear:both;"></div>');
		//Shots.render();
	}
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
		href = this.model.get("href"),
		id = href.substr(7).split("-"),
		html = this.template({
			id: id[0],
			url: img['src'],
			link: href,
			alt: img['alt']
		});
		
		this.model.set({shotId: id[0]});

		$(this.el).append(html);
		return this;
	},
	clicked: function(e) {
		e.preventDefault();
		$(e.currentTarget).parent().toggleClass('selected');
		this.model.toggle();
	}

});