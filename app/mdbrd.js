MdbrdImage = Backbone.Model.extend({});
window.Mdbrd = Backbone.Collection.extend({
	model: MdbrdImage,
	localStorage: new Store("Mdbrd")
});

window.MdbrdShotView = Backbone.View.extend({
	
	tagName: 'li',
	className: 'mdbrdshot',
	template: _.template($('#mdbrdshot-template').html()),
	events: {
		"click a" : "clicked"
	},
	initialize: function() {
		this.model.bind("remove", this.remove, this);
	},
	render: function(){
		var img = this.model.get("img"),
		html = this.template({
			id: this.cid,
			shotid: this.model.get("shotId"),
			url: img['src'],
			link: this.model.get("href"),
			alt: img['alt']
		});

		$(this.el).append(html);
		return this;
	},
	clicked: function(e) {
		e.preventDefault();
		$(e.currentTarget).parent().toggleClass('selected');
		this.model.toggle();
	},
	remove: function() {
		$(this.el).remove();
	}

});