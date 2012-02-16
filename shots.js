Shot = Backbone.Model.extend({});

window.ShotsList = Backbone.Collection.extend({
	
	model: Shot,
	parse: function(response){
		if(response.query.count > 0){
			return response.query.results.a;	
		}else{
			console.log("No results");
			console.log(response);
		}
		
	},
	url: function() {
		var searchRoot = "http://query.yahooapis.com/v1/public/yql?q=";
		var searchUrl = "select * from html where url='http://dribbble.com/search?page=1&q=";
		searchUrl += this.search;
		searchUrl += "' and xpath='//div[@class=\"dribbble-img\"]/a[1]'";
		searchEnd = "&format=json&callback";
		//console.log(searchRoot + encodeURIComponent(searchUrl) + searchEnd);

		return searchRoot + encodeURIComponent(searchUrl) + searchEnd;
		//return "http://api.dribbble.com/players/" + encodeURIComponent(this.search) +"/shots?per_page=18";
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
		var img = this.model.get("img");
		$(this.el).html(this.template({
			id: this.id,
			url: img['src'],
			link: this.model.get("href")
		}));
		return this;
	},
	clicked: function(e) {
		e.preventDefault();
		var id = $(e.currentTarget).data("id");
		console.log(e.currentTarget);
	}

});