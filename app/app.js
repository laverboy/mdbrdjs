App = Backbone.Router.extend({
	initialize: function () {
		$(document).on('click', 'button.link', function () {
			document.location = '#/' + $(this).data('target');
		});
	},
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
		searchView.render();
	},
	showMdbrd: function(){
		mdbrdView.render();
	}
});