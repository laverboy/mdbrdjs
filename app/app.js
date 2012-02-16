App = Backbone.Router.extend({
	routes: {
		"/search" : "startSearch",
		"/mdbrd" : "showMdbrd",
		"*page" : "start"
	},
	start: function(){
		var starttmplt = _.template($('#start').html());
		$('#contents').html(starttmplt);
	},
	startSearch: function(){
		searchView = new SearchView;
	},
	showMdbrd: function(){
		mdbrdView = new MdbrdView;
	}
});