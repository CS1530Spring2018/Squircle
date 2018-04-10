//test game code

// dynamically load url
var getUrl = window.location;
var baseUrl = getUrl.protocol + "//" + getUrl.host + "/static/";

var assets = {
	'image': 'images/gameAssets/test/',
}
var platforms;
var inputTimer = 0;
var receiving = false;
var receiving2 = false;
var receiving4 = false;
var player1;
var fire;
var stars1;
var stars2;
var player2;
var cursors;
var bombs;
var enemy;
var drone;
var xDig1;
var yDig1;
var log1;
var jumping1 = false;
var jumping2 = false;

var xDig4;
var xDig4;
var log4;

var xDig2;
var yDig2;
var log2;

var redSwitch = 0;
var bombHit = false;
var player1Score = 0;
var player2Score = 0;

var player1ScoreText;
var player2ScoreText;

var drone;
drone = new ScaleDrone('JX2gIREeJoi7FDzN')
createSockets();

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
	parent: "game",
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
	this.load.image('start', url_for('image', 'star.png'));
	/**
	 * this loads a sprite sheet
	 * each sprite frame is 32x48 pixels
	*/
	this.load.spritesheet('dude', url_for('image', 'dude.png',),
	{frameWidth: 32, frameHeight: 48});

	this.load.spritesheet('dude2', url_for('image', 'dude2.png',),
	{frameWidth: 32, frameHeight: 48});

	
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
	player2.name = 'player2';
	player2.data = {health: 3, justHit: false, hitAnim: 'turn2',
	rightAnim: 'right2',
	leftAnim: 'left2'};

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
	player1.setBounce(0.2);
	player1.setCollideWorldBounds(true);
	player1.name = 'player1';
	player1.data = {health: 3, justHit: false, 
		hitAnim: 'turn',
		rightAnim: 'right',
		leftAnim: 'left'};

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

	player1.body.setGravity(300);
}

function createCollisions(ctx) {
	ctx.physics.add.collider(player1, platforms);
	ctx.physics.add.collider(player2, platforms);
	ctx.physics.add.collider(enemy, player1);
	ctx.physics.add.collider(enemy, player2);
	ctx.physics.add.collider(player1, player2);
	ctx.physics.add.collider(stars1, platforms);
	ctx.physics.add.collider(stars2, platforms);
	ctx.physics.add.collider(stars1, stars2);
	ctx.physics.add.collider(stars2, stars2);
	ctx.physics.add.collider(stars1, stars1);

	ctx.physics.add.overlap(player1, stars1, collectStar, null, this);
	ctx.physics.add.overlap(player2, stars1, collectStar, null, this);

	ctx.physics.add.overlap(player1, stars2, collectStar, null, this);
	ctx.physics.add.overlap(player2, stars2, collectStar, null, this);

	
}

function createSockets() {
	drone.on('open', function(error) {

		//checking for errors
		if(error){
			return console.error(error);
		}

		var room = drone.subscribe('player_one');

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
			xDig1 = data.xdig;
			yDig1 = data.ydig;
			log1 = data.log;
		});

	});

	drone.on('error', function(error){
		console.log(error);
	});

	drone.on('open', function(error) {

		//checking for errors
		if(error){
			return console.error(error);
		}

		var room = drone.subscribe('player_four');

		room.on('open', function (error) {
			if (error) {
				console.error(error);
			} else {
				console.log('Connected to room');
			}
		});

		room.on('data', function (data) {
			inputTimer = 0;
			receiving4 = true;
			// Record controller state
			xDig4 = data.xdig;
			yDig4 = data.ydig;
			log4 = data.log;
		});

	});

	drone.on('error', function(error){
		console.log(error);
	});

	drone.on('open', function(error) {

		//checking for errors
		if(error){
			return console.error(error);
		}

		var room = drone.subscribe('player_two');

		room.on('open', function (error) {
			if (error) {
				console.error(error);
			} else {
				console.log('Connected to room');
			}
		});

		room.on('data', function (data) {
			inputTimer = 0;
			receiving2 = true;
			// Record controller state
			xDig2 = data.xdig;
			yDig2 = data.ydig;
			log2 = data.log;
		});

	});

	drone.on('error', function(error){
		console.log(error);
	});
}

function collectStar (player, star)
{
	star.disableBody(true, true);
	//star.destroy();
	
	if (player.name === 'player1') {
		player1Score++;
		player1ScoreText.setText('Player 1 Score: '+player1Score);
	} else if (player.name === 'player2') {
		player2Score++;
		player2ScoreText.setText('Player 2 Score: '+player2Score);
	}

	if (stars1.countActive(true) === 0 && stars2.countActive(true) === 0)
    {
        stars1.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
		});
		stars2.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
		});

		var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;
	}

	console.log("player 1: "+player1Score
				+" player 2: "+player2Score);
}

function create() {
	this.add.image(400, 300, 'sky');
	player1 = this.physics.add.sprite(100, 450, 'dude');
	player2 = this.physics.add.sprite(200, 450, 'dude2');
	platforms = this.physics.add.staticGroup();

	stars1 = this.physics.add.group({
		key: 'star',
		repeat: 6,
		setXY: {x: 150, y: 0, stepX: Phaser.Math.Between(10, 120)}
	});

	stars1.children.iterate(function (child){
		child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
		child.setBounceX(Phaser.Math.FloatBetween(0.4, 0.8));
		child.setCollideWorldBounds(true);
		child.setCollideWorldBounds(true);
	});

	stars2 = this.physics.add.group({
		key: 'star',
		repeat: 5,
		setXY: {x: 150, y: 0, stepX: Phaser.Math.Between(10, 120)}
	});

	stars2.children.iterate(function (child){
		child.setBounceY(Phaser.Math.FloatBetween(0.5, 0.8));
		child.setBounceX(Phaser.Math.FloatBetween(0.5, 0.8));
		child.setCollideWorldBounds(true);
		child.setCollideWorldBounds(true);
	});

	//this line makes multiple lines spanning the bottom
	createWorld();

	createPlayer1(this);
	createPlayer2(this);

	enemy = this.physics.add.sprite(400, 800, 'cannon');
	enemy.setCollideWorldBounds(true);
	enemy.visible = true;

	createCollisions(this);

	cursors = this.input.keyboard.createCursorKeys();

	bombs = this.physics.add.group();

	this.physics.add.collider(bombs, platforms);

	this.physics.add.collider(player1, bombs, hitBomb, null, this);
	this.physics.add.collider(player2, bombs, hitBomb, null, this);

	fire = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

	player1ScoreText = this.add.text(16, 16, 'Player 1 Score: 0', { fontSize: '16px', fill: '#000' });
	player2ScoreText = this.add.text(16, 32, 'Player 2 Score: 0', { fontSize: '16px', fill: '#000' });

}

function hitBomb (player, bomb)
{
	if(!bombHit) {
		this.physics.pause();
		player.setTint(0xff0000);
		player.anims.play(player.data.hitAnim);
		player.data.health -= 1;
		player.data.justHit = true;
		if (player.data.health <= 0) {
			gameOver = true;
		} else {
			this.physics.resume();
		}
	}
	redSwitch = 0;
	bombHit = true;
}

function resetBomb(bomb) {
	bomb.kill();
}

/**
 * this will be what controls the player and interprets
 * data from the incoming socket signal
*/
var player1Jump = 0;
function player1Controller() {

	if(xDig1 > 0 && receiving) {
		moveRight(160, player1);
		//console.log("TEST");
	} else if (xDig1 < 0 && receiving) {
		moveLeft(160, player1);
	} else {
		idle(player1);
	}
	
	if(log1 === 'tapFunction' && player1Jump < 1) {
		jump(500, player1);
		player1Jump ++;
	} else {
		if (log1 === undefined) {
			player1Jump = 0;
		}
	}
}

function testPlayerController(player) {
	if(cursors.left.isDown && cursors.right.isDown) {
		idle();
	}

	if (cursors.right.isDown && !cursors.left.isDown){
		moveRight(160);
	}

	if (cursors.left.isDown && !cursors.right.isDown){
		moveLeft(160);
	}
	
	if(!cursors.left.isDown && !cursors.right.isDown) {
		idle();
	}

	if (cursors.up.isDown && player.body.touching.down){
		jump(500);
	}
}

function moveRight(velocity, player) {
	player.setVelocityX(velocity);
	player.anims.play(player.data.rightAnim, true);
}

function moveLeft(velocity, player) {
	player.setVelocityX(-velocity);
	player.anims.play(player.data.leftAnim, true);
}

function jump(velocity, player) {
	player.setVelocityY(-velocity);
}

function idle(player) {
	player.setVelocityX(0);
	player.anims.play(player.data.hitAnim);
}

function enemyController() {


	
}

function fireBomb() {
		
	bombs.toggleVisible();
	bombs.getChildren();
}
var player2Jump = 0;
function player2Controller() {

	if(xDig2 > 0 && receiving2) {
		moveRight(160, player2);
		//console.log("TEST");
	} else if (xDig2 < 0 && receiving) {
		moveLeft(160, player2);
	} else {
		idle(player2);
	}

	if(log2 === 'tapFunction' && player2Jump < 1) {
		jump(500, player2);
		player2Jump ++;
	} else {
		if (log2 === undefined) {
			player2Jump = 0;
		}
	}


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
	
	if (redSwitch>=100) {
		if (bombHit){
			bombHit = false;
			redSwitch = 0;
			if(player1.data.justHit === true){
				player1.data.justHit = false;
				player1.setTint(0xffffff);
			} else if (player2.data.justHit === true) {
				player2.data.justHit = false;
				player2.setTint(0xffffff);
			}
		}
	}
	//enemyController();
	//testPlayerController(player1);
	player1Controller();
	player2Controller();
	redSwitch ++;
}