MdbrdImage = Backbone.Model.extend({});
window.Mdbrd = Backbone.Collection.extend({
	model: MdbrdImage,
	localStorage: new Store("Mdbrds"),
	initialize: function () {
		this.bind("add", this.addBigImage);
	},
	addBigImage: function (mdbrdModel) {
		var id = mdbrdModel.get('shotId');
		var bigData = $.getJSON('http://api.dribbble.com/shots/' + id + '?callback=?');
		bigData.success(function (response) {
			mdbrdModel.set({
				bigImage: response.image_url
			});
			mdbrd.create(mdbrdModel.toJSON());
			mdbrdView.addOne(mdbrdModel);
		});
	}
});