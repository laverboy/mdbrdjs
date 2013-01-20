var MdbrdView = Backbone.View.extend({
	el: $('#mdbrdView'),
	template: _.template($('#mdbrdview-template').html()),
	initialize: function(){
		_.bindAll(this, 'addOne', 'addAll');
		mdbrd.bind('reset', this.addAll, this);
		mdbrd.bind('change:bigImage', this.addOne, this);
	},
	events: {
    	"click #full" : "fullToggle"
	},
	addOne: function(selectedShot){
		var fullshotview = new FullShotView({model: selectedShot});
		this.$el.find('.bigShots').append(fullshotview.render().el);
	},
	addAll: function () {
		mdbrd.each(this.addOne);
	},
	fullToggle: function (e) {
    	e.preventDefault();
    	$('#contents').toggleClass('full');
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
		this.model.bind('remove', this.removeView, this);
	},
	render: function(){
		this.$el.append(this.template(this.model.toJSON()));
		return this;
	},
	clear: function (e) {
    	e.preventDefault();
		mdbrd.remove(this.model);
	},
	removeView: function () {
		this.$el.remove();
	}
});