window.SearchView = Backbone.View.extend({
					
	el: $("#contents"),
	template: _.template($('#search-template').html()),
	events: {
		"keypress #entrybox": "searchOnEnter"
	},
	initialize: function() {
		_.bindAll(this, 'searchSuccess');
		this.render();
		if(mdbrd.length === 0){
			mdbrd.bind('add',this.addToMdbrd);
			mdbrd.bind('change',this.onchange);
		} else {
			$('#currentMdbrd').prepend($('<h2></h2>', {text: "Currently in your Mdbrd"}));
			mdbrd.each(function (mdbrd) {
				var mdbrdShotView = new MdbrdShotView({model: mdbrd});
				$('#currentMdbrd').append(mdbrdShotView.render().el);
			});
		}
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
		if (Shots.models.length === 0 ) {
			console.log(this);
			$(this.el).find('#results').append(
				$('<p></p>', { 
					class: 'noresults', 
					text: "Sorry no results for that search - please try again!"
				})
			);	
		}
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