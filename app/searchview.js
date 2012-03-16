window.SearchView = Backbone.View.extend({
					
	el: $("#contents"),
	template: _.template($('#search-template').html()),
	events: {
		"keypress #entrybox": "searchOnEnter",
		"click #x": "hide",
		"click #open": "open"
	},
	initialize: function() {
		_.bindAll(this, 'searchSuccess');
	},
	render: function(){
		this.$el.append(this.template);
	},
	searchOnEnter: function(e) {
		if(e.keyCode !=13) return;
		$('#search').addClass('loading');
		$('p.noresults').remove();
		
		Backbone.sync = Backbone.ajaxSync;
		
		Shots.page = 1;
		Shots.search = encodeURIComponent($('#entrybox').val());
		Shots.fetch({success: this.searchSuccess, error: this.searchError});

		Backbone.sync = Backbone.localSync;
	},
	searchSuccess: function(){
		this.$el.find('#search').removeClass('loading');
		if (Shots.models.length === 0 ) {
			this.searchEmpty();
		} else {
			this.$el.find('#entrybox').blur();
			this.$el.find('#results').find('li').first().children('a').focus();
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
		$('#search').removeClass('loading');
		$('#results').html("Sorry no results for that search - try again!");
	},
	hide: function () {
		$('#searchView').animate({
			'margin-left': '-=25%'
		},1000);
		$('#open').animate({
			'left': '-=25%'
		},1000);
		$('#mdbrdView').animate({
			'margin-left': '-=25%',
			'width': '100%'
		},1000);
	},
	open: function () {
		$('#searchView').animate({
			'margin-left': '0%'
		},1000);
		$('#open').animate({
			'left': '25%'
		},1000);
		$('#mdbrdView').animate({
			'margin-left': '25%',
			'width': '75%'
		},1000);
	}

});