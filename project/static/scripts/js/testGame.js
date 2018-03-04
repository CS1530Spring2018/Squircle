//test game code

var canvasWidth;

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
	this.load.image('sky', 'http://127.0.0.1:5000/static/images/gameAssets/test/sky.png');
}

function create() {
	this.add.image(400, 300, 'sky');
}

function update() {

}
