//test game code

// dynamically load url?
// pitt ip: 10.215.97.21:5000
var baseUrl = "http://localhost:5000/static/";

var assets = {
	'image': 'images/gameAssets/test/',
}
var platforms;
var inputTimer = 0;
var receiving = false;
var player;
var player2;
var cursors;
var enemy;
var drone;
var xDig;
var yDig;
var log;

var drone;

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
	this.load.image('cannon', url_for('image', 'cannon.png'));
	/**
	 * this loads a sprite sheet
	 * each sprite frame is 32x48 pixels
	*/
	this.load.spritesheet('dude', url_for('image', 'dude.png',),
	{frameWidth: 32, frameHeight: 48});

	this.load.spritesheet('dude2', url_for('image', 'dude2.png',),
	{frameWidth: 32, frameHeight: 48});

	drone = new ScaleDrone('JX2gIREeJoi7FDzN')
}

function createWorld() {
	platforms.create(400, 550, 'ground').setScale(3).refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
	platforms.create(750, 220, 'ground');
}

function createPlayer2(ctx) {

	player2.setBounce(0.2);
	player2.setCollideWorldBounds(true);

	ctx.anims.create({
		key: 'left2',
		frames: ctx.anims.generateFrameNumbers('dude2', { start: 0, end: 3 }),
		frameRate: 10,
		repeat: -1
	});
	
	ctx.anims.create({
		key: 'turn2',
		frames: [ { key: 'dude2', frame: 4 } ],
		frameRate: 5
	});
	
	ctx.anims.create({
		key: 'right2',
		frames: ctx.anims.generateFrameNumbers('dude2', { start: 5, end: 8 }),
		frameRate: 10,
		repeat: -1
	});

	player2.body.setGravity(300);
}

function createPlayer1(ctx) {
	
	player.setBounce(0.2);
	player.setCollideWorldBounds(true);

	ctx.anims.create({
		key: 'left',
		frames: ctx.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
		frameRate: 10,
		repeat: -1
	});
	
	ctx.anims.create({
		key: 'turn',
		frames: [ { key: 'dude', frame: 4 } ],
		frameRate: 5
	});
	
	ctx.anims.create({
		key: 'right',
		frames: ctx.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
		frameRate: 10,
		repeat: -1
	});

	player.body.setGravity(300);
}

function createCollisions(ctx) {
	ctx.physics.add.collider(player, platforms);
	ctx.physics.add.collider(player2, platforms);
	ctx.physics.add.collider(enemy, player);
	ctx.physics.add.collider(enemy, player2);
	ctx.physics.add.collider(player, player2);
}

function createSockets() {
	drone.on('open', function(error) {

		//checking for errors
		if(error){
			return console.error(error);
		}

		var room = drone.subscribe('my_game');

		room.on('open', function (error) {
			if (error) {
				console.error(error);
			} else {
				console.log('Connected to room');
			}
		});

		room.on('data', function (data) {
			inputTimer = 0;
			receiving = true;
			// Record controller state
			xDig = data.xdig;
			yDig = data.ydig;
			log = data.log;
		});

	});

	drone.on('error', function(error){
		console.log(error);
	});
}

function create() {
	this.add.image(400, 300, 'sky');
	player = this.physics.add.sprite(100, 450, 'dude');
	player2 = this.physics.add.sprite(200, 450, 'dude2');
	platforms = this.physics.add.staticGroup();

	//this line makes multiple lines spanning the bottom
	createWorld();

	createPlayer1(this);
	createPlayer2(this);
	
	enemy = this.physics.add.sprite(550, 800, 'cannon');
	enemy.setCollideWorldBounds(true);

	createCollisions(this);

	cursors = this.input.keyboard.createCursorKeys();

	createSockets();

}


/**
 * this will be what controls the player and interprets
 * data from the incoming socket signal
*/

function playerController() {
	inputTimer ++;
	
	//console.log(log);
	if(inputTimer > 7) {
			
		// inputTimer = 0;
		// receiving = false;
		// xDig = 0;
		// yDig = 0;
		// log = null;
	}
	if(xDig > 0 && receiving) {
		moveRight(160);
		//console.log("TEST");
	} else if (xDig < 0 && receiving) {
		moveLeft(160);
	} else {
		idle();
	}

	if(log === 'tapFunction') {
		jump(500);
	}
}

function moveRight(velocity) {
	player.setVelocityX(velocity);
	player.anims.play('right', true);
}

function moveLeft(velocity) {
	player.setVelocityX(-velocity);
	player.anims.play('left', true);
}

function jump(velocity) {
	player.setVelocityY(-velocity);
}

function idle() {
	player.setVelocityX(0);
	player.anims.play('turn');
}

function enemyController() {
	if(cursors.left.isDown && cursors.right.isDown) {
		enemy.setVelocityX(0);
	}

	if (cursors.right.isDown && !cursors.left.isDown){
		enemy.setVelocityX(160);
	}

	if (cursors.left.isDown && !cursors.right.isDown){
		enemy.setVelocityX(-160);
	}
	
	if(!cursors.left.isDown && !cursors.right.isDown) {
		enemy.setVelocityX(0);
	}

	if (cursors.up.isDown && player.body.touching.down){
		
	}
}

function player2Controller() {
	player2.setVelocityX(0);
	player2.anims.play('turn2');
}

function update() {

	// if(cursors.left.isDown && cursors.right.isDown) {
	// 	idle();
	// }

	// if (cursors.right.isDown && !cursors.left.isDown){
	// 	moveRight(160);
	// }

	// if (cursors.left.isDown && !cursors.right.isDown){
	// 	moveLeft(160);
	// }
	
	// if(!cursors.left.isDown && !cursors.right.isDown) {
	// 	idle();
	// }

	// if (cursors.up.isDown && player.body.touching.down){
	// 	jump(500);
	// }
	enemyController();
	playerController();
	player2Controller();
}