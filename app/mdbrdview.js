var MdbrdView = Backbone.View.extend({
	el: $('#contents'),
	template: _.template($('#mdbrdview-template').html()),
	initialize: function(){
		_.bindAll(this, 'addOne', 'addAll');
		mdbrd.bind('reset', this.addAll, this);
        mdbrd.bind('change:bigImage', this.addOne, this);

        this.render();
	},
	render: function(){
		this.$el.append(this.template);
		mdbrd.each(this.addOne);
	},
	addOne: function(selectedShot){
		var fullshotview = new FullShotView({model: selectedShot});
		this.$el.find('#mdbrdView').append(fullshotview.render().el);
	},
	addAll: function () {
		mdbrd.each(this.addOne);
	}
});

var FullShotView = Backbone.View.extend({
	tagName: 'div',
	className: 'fullShot',
	template: _.template($('#fullshot-template').html()),
	events: {
		'click .trash' : 'clear'
	},
	initialize: function () {
		this.model.bind('destroy', this.removeView, this);
	},
	render: function(){
		this.$el.append(this.template(this.model.toJSON()));
		return this;
	},
	clear: function () {
		this.model.clear();
	},
	removeView: function () {
		this.$el.remove();
	}
});