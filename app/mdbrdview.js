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
	render: function(){
		mdbrd.each(this.addOne);
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