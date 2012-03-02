MdbrdImage = Backbone.Model.extend({});
window.Mdbrd = Backbone.Collection.extend({
	model: MdbrdImage,
	localStorage: new Store("Mdbrd"),
	initialize: function () {
		this.bind("add", this.addBigImage);
	},
	addBigImage: function (mdbrd) {
		var id = mdbrd.get('shotId');
		var bigData = $.getJSON('http://api.dribbble.com/shots/' + id + '?callback=?');
		bigData.success(function (response) {
			mdbrd.set({
				bigImage: response.image_url
			});
			mdbrdView.addOne(mdbrd);
		});
	}
});