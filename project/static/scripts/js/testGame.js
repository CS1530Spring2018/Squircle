//test game code

// dynamically load url?
var baseUrl = "http://127.0.0.1:5000/static/";

var assets = {
	'image': '/images/gameAssets/test/',
}

function url_for(type, name) {
	return baseUrl + assets[type] + name;
}

/**
 * the type is how the game trys to load
 * by default, it tries to load a webGL
 * application
 * 
 * if the web page doesn't support that, then it loads 
 * a canvas
*/
var config = {
	type: Phaser.AUTO, 
	width: 800,
	height: 600,
	scene: {
		preload: preload,
		create: create,
		update: update
	}
};

var game = new Phaser.Game(config);

function preload() {
	this.load.image('sky', url_for('image', 'sky.png'));
}

function create() {
	this.add.image(400, 300, 'sky');
}

function update() {

}
