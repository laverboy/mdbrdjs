var MdbrdImage = Backbone.Model.extend({
    initialize: function () {
        this.bind("destroy", this.checkForShot);
    },
    clear: function () {
        this.destroy();
    },
    checkForShot: function () {
        // when a model is removed check if there is a
        // corresponding shot visible and ticked, if so untick it
        var shot = Shots.get(this.id);
        if (shot && shot.get("selected") === true){ shot.toggle();}
    }
});
var Mdbrd = Backbone.Collection.extend({
	model: MdbrdImage,
	localStorage: new Store("Mdbrds"),
	initialize: function () {
		this.bind("add", this.addBigImage);
	},
	addBigImage: function (mdbrdModel) {
		var id = mdbrdModel.get('shotId');
		var bigData = $.getJSON('http://api.dribbble.com/shots/' + id + '?callback=?');
		bigData.done(function (response) {
			mdbrdModel.save({
				bigImage: response.image_url
			});
		});
	},
    saveToDb: function () {
        var save = $.ajax({
            url: 'data/save.php',
            data: JSON.stringify(mdbrd.toJSON()),
            type: 'POST'
        });
        save.done(function (response) {
            console.log("response: ", window.response = response);
        });
    }
});