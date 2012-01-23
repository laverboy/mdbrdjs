window.SearchView = Backbone.View.extend({
					
	el: $("#contents"),
	template: _.template($('#search-template').html()),
	events: {
		"keypress #entrybox": "searchOnEnter"
	},
	initialize: function() {
		window.Shots = new ShotList;
		this.render();
	},
	render: function(){
		this.el.html(this.template);
	},
	searchOnEnter: function(e) {
		if(e.keyCode !=13) return;
		$('#search').addClass('loading');

		Shots.search = encodeURIComponent($('#entrybox').val());
		Shots.fetch({success: this.searchSuccess, error: this.searchError});
	},
	searchSuccess: function(){
		$('#search').removeClass('loading');
	},
	searchError: function(){
		$('#search').removeClass('loading');
		$('#results').html("Sorry no results for that search - try again!");
	}

});