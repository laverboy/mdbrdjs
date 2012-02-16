window.SearchView = Backbone.View.extend({
					
	el: $("#contents"),
	template: _.template($('#search-template').html()),
	events: {
		"keypress #entrybox": "searchOnEnter"
	},
	initialize: function() {
		console.log('SearchView intialised');
		window.Shots = new ShotsList;

		_.bindAll(this, 'addOne', 'addAll');
		
		Shots.bind('add', this.addOne);
		Shots.bind('reset', this.addAll);
		this.render();
	},
	render: function(){
		this.el.html(this.template);
	},
	searchOnEnter: function(e) {
		if(e.keyCode !=13) return;
		Shots.search = encodeURIComponent($('#entrybox').val());
		$('#search').addClass('loading');
		Shots.fetch({success: this.searchSuccess, error: this.searchError});

	},
	addOne: function(shot) {
		var view = new ShotView({model: shot});
		this.$('#results').append(view.render().el);
	},
	addAll: function(collection){
		console.log('addAll');
		$('#results').html('<div style="clear:both;"></div>');
		Shots.each(this.addOne);
	},
	searchSuccess: function(){
		$('#search').removeClass('loading');
	},
	searchError: function(){
		$('#search').removeClass('loading');
		$('#results').html("Sorry no results for that search - try again!");
	}

});