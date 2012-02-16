window.SearchView = Backbone.View.extend({
					
	el: $("#contents"),
	template: _.template($('#search-template').html()),
	events: {
		"keypress #entrybox": "searchOnEnter"
	},
	initialize: function() {
		if(mdbrd.length === 0){
			mdbrd.bind('add',this.addToMdbrd);
			mdbrd.bind('change',this.onchange);
		} else {
			mdbrd.each(function (mdbrd) {
				var mdbrdShotView = new MdbrdShotView({model: mdbrd});
				$('#mdbrd').append(mdbrdShotView.render().el);
			});
		}
		this.render();
	},
	render: function(){
		$(this.el).html(this.template);
	},
	searchOnEnter: function(e) {
		if(e.keyCode !=13) return;
		$('#search').addClass('loading');
		
		Backbone.sync = Backbone.ajaxSync;
		
		Shots.search = encodeURIComponent($('#entrybox').val());
		Shots.fetch({success: this.searchSuccess, error: this.searchError});
	},
	searchSuccess: function(){
		$('#search').removeClass('loading');
	},
	searchError: function(){
		$('#search').removeClass('loading');
		$('#results').html("Sorry no results for that search - try again!");
	},
	addToMdbrd: function(mdbrd) {
		var mdbrdShotView = new MdbrdShotView({model: mdbrd});
		$('#mdbrd').append(mdbrdShotView.render().el);
	},
	onchange: function(){
		var length = mdbrd.length;
		if(length > 0){
			$('#count').html(length);
			$('#showMdbrd').show();
		}else{
			$('#showMdbrd').hide();
		}
	}

});