window.MdbrdView = Backbone.View.extend({
	el: $('#contents'),
	template: _.template($('#mdbrdview-template').html()),
	events: {
	
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