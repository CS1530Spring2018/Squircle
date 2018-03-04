//test game code

// dynamically load url?
var baseUrl = "http://127.0.0.1:5000/static/";

var assets = {
	'image': 'images/gameAssets/test/',
}
var platforms;
var player;
var cursors;

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
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {y: 300},
			debug: false
		}
	},
	scene: {
		preload: preload,
		create: create,
		update: update
	}
};

var game = new Phaser.Game(config);

function preload() {
	this.load.image('sky', url_for('image', 'sky.png'));
	this.load.image('ground', url_for('image', 'platform.png'));
	this.load.image('star', url_for('image', 'star.png'));
	this.load.image('bomb', url_for('image', 'bomb.png'));
	/**
	 * this loads a sprite sheet
	 * each sprite frame is 32x48 pixels
	*/
	this.load.spritesheet('dude', url_for('image', 'dude.png',),
	{frameWidth: 32, frameHeight: 48});
}

function create() {
	this.add.image(400, 300, 'sky');

	platforms = this.physics.add.staticGroup();

	//this line makes multiple lines spanning the bottom
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
	platforms.create(750, 220, 'ground');

	player = this.physics.add.sprite(100, 450, 'dude');

	player.setBounce(0.2);
	player.setCollideWorldBounds(true);

	//setting up animation for the character
	this.anims.create({
		key: 'left',
		frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
		frameRate: 10,
		repeat: -1
	});
	
	this.anims.create({
		key: 'turn',
		frames: [ { key: 'dude', frame: 4 } ],
		frameRate: 20
	});
	
	this.anims.create({
		key: 'right',
		frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
		frameRate: 10,
		repeat: -1
	});

	player.body.setGravity(300);

	this.physics.add.collider(player, platforms);

	cursors = this.input.keyboard.createCursorKeys();
}

function update() {

	if(cursors.left.isDown && cursors.right.isDown) {
		player.setVelocityX(0);

		player.anims.play('turn');
	}

	if (cursors.right.isDown && !cursors.left.isDown){
		player.setVelocityX(160);

		player.anims.play('right', true);
	}

	if (cursors.left.isDown && !cursors.right.isDown){
		player.setVelocityX(-160);

		player.anims.play('left', true);
	}
	
	if(!cursors.left.isDown && !cursors.right.isDown) {
		player.setVelocityX(0);

		player.anims.play('turn');
	}

	if (cursors.up.isDown && player.body.touching.down){
		player.setVelocityY(-330);
	}
}
