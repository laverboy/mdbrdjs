window.AppView = Backbone.View.extend({

	el: $('#contents'),

	initialize: function () {
		this.render();
	},
	render: function () {
		searchView.render();
		mdbrdView.render();
	}
});