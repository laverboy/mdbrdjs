App = Backbone.Router.extend({
	routes: {
		"/search" : "startSearch",
		"*page" : "start"
	},
	start: function(){
		var starttmplt = _.template($('#start').html());
		$('#contents').html(starttmplt);
	},
	startSearch: function(){
		searchView = new SearchView;
	}
});