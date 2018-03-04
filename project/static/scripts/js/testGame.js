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
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', 
		{
			preload: preload,
			create: create,
			update: update
		});

function preload() {
	
	this.load.image('sky', 'http://127.0.0.1:5000/static/images/gameAssets/test/sky.png');
}

function create() {

	this.add.image(400, 300, 'sky');
}

function update() {

}
