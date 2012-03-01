window.MdbrdView = Backbone.View.extend({
	el: $('#contents'),
	template: _.template($('#mdbrdview-template').html()),
	events: {
		'click #save': 'saveMdbrd' 
	},
	initialize: function(){
		this.render();
	},
	render: function(){
		$(this.el).html(this.template);
		mdbrd.each(this.addOne);
	},
	addOne: function(mdbrdshot){
		var fullshotview = new FullShotView({model: mdbrdshot}); 
		this.$('#contents').append(fullshotview.render().el);
	},
	saveMdbrd: function () {
		var save = $.ajax({
			url: 'data/save.php',
			data: JSON.stringify(mdbrd.toJSON()),
			type: 'POST',
			dataType: 'json'
		});
		save.done(function (response) {
			console.log("response: ", window.response = response);
		});
	}
});

window.FullShotView = Backbone.View.extend({
	tagName: 'div',
	className: 'fullShot',
	template: _.template($('#fullshot-template').html()),
	events: {
		
	},
	render: function(){
		$(this.el).append(this.template(this.model.toJSON()));
		return this;
	}
});