window.SearchView = Backbone.View.extend({
					
	el: $("#contents"),
	template: _.template($('#search-template').html()),
	events: {
		"keypress #entrybox": "searchOnEnter",
		"click #x": "hide",
		"click #open": "open",
		"click #more": "search",
		"click #clear": "reset"
	},
	initialize: function() {
		_.bindAll(this, 'searchSuccess', 'preSearch');
	},
	render: function(){
		this.$el.append(this.template);
	},
	search: function () {
		this.$el.find('#more').remove();
		Backbone.sync = Backbone.ajaxSync;
		Shots.fetch({success: this.searchSuccess, error: this.searchError});
		Backbone.sync = Backbone.localSync;
	},
	searchOnEnter: function(e) {
		if(e.keyCode !=13) return;
		this.$el.find('#search').addClass('loading');
		this.$el.find('p.noresults').remove();
		
		Shots.page = 1;
		Shots.search = encodeURIComponent($('#entrybox').val());
		this.search();
		
	},
	searchSuccess: function(){
		this.$el.find('#search').removeClass('loading');
		if (Shots.models.length === 0 ) {
			this.searchEmpty();
		} else {
			this.$el.find('#entrybox').blur();
			this.$el.find('#results').find('li').first().children('a').focus();
			this.preSearch();
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
		this.$el.find('#search').removeClass('loading');
		this.$el.find('#results').html("Sorry no results for that search - try again!");
	},
	hide: function () {
		this.$el.find('#searchView').animate({'margin-left': '-=25%'},1000);
		this.$el.find('#open').animate({'left': '-=25%'},1000);
		this.$el.find('#mdbrdView').animate({
			'margin-left': '-=25%',
			'width': '100%'
		},1000);
	},
	open: function () {
		this.$el.find('#searchView').animate({'margin-left': '0%'},1000);
		this.$el.find('#open').animate({'left': '25%'},1000);
		this.$el.find('#mdbrdView').animate({
			'margin-left': '25%',
			'width': '75%'
		},1000);
	},
	preSearch: function () {
		Shots.page = Shots.page + 1;
		var searchN = $.get(Shots.url());
		searchN.success(function (response) {
			var count = response.query.count;
			if(count > 0) searchView.addMoreButton();
		});
	},
	addMoreButton: function () {
		this.$el.find('#results').append(
			$('<button></button>', {
				class: 'orange',
				text: 'More',
				id: 'more'
			})
		);
	},
	reset: function (e) {
		e.preventDefault();
		mdbrd.reset();
	}

});