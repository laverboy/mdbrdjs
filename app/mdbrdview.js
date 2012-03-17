window.MdbrdView = Backbone.View.extend({
	el: $('#contents'),
	template: _.template($('#mdbrdview-template').html()),
	events: {
		'click #save': 'saveMdbrd'
	},
	initialize: function(){
		_.bindAll(this, 'addOne', 'addAll');
		mdbrd.bind('reset', this.addAll, this);

		mdbrd.fetch();
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
		'click .trash' : 'removeFromMdbrd'
	},
	initialize: function () {
		this.model.bind('remove', this.remove, this);
	},
	render: function(){
		this.$el.append(this.template(this.model.toJSON()));
		return this;
	},
	removeFromMdbrd: function () {
		var shot = Shots.get(this.model.get("id"));
		if (shot) shot.toggle();
		this.model.destroy();
	},
	remove: function () {
		this.$el.remove();
	}
});