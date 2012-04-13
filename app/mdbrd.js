MdbrdImage = Backbone.Model.extend({});
window.Mdbrd = Backbone.Collection.extend({
	model: MdbrdImage,
	localStorage: new Store("Mdbrds"),
	initialize: function () {
		this.bind("add", this.addBigImage);
		this.bind("remove", this.deleteModel);
	},
	addBigImage: function (mdbrdModel) {
		var id = mdbrdModel.get('shotId');
		var bigData = $.getJSON('http://api.dribbble.com/shots/' + id + '?callback=?');
		bigData.success(function (response) {
			mdbrdModel.save({
				bigImage: response.image_url
			});
			mdbrdView.addOne(mdbrdModel);
		});
	},
	deleteModel: function (mdbrdModel) {
		mdbrdModel.destroy();
		return false;
	}
});