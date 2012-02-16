App = Backbone.Router.extend({
	routes: {
		"/search" : "startSearch",
		"*page" : "start"
	},
	start: function(){
		console.log('start');
		var starttmplt = _.template($('#start').html());
		$('#contents').html(starttmplt);
	},
	startSearch: function(){
		console.log('start search function');
		searchView = new SearchView;
	}
});