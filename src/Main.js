// var game = new Phaser.Game(window.innerWidth,window.innerHeight,Phaser.AUTO,'')
var game = new Phaser.Game(400, 400, Phaser.AUTO, "gameDiv");

var mainState = {

    preload: function() {  
        this.game.load.image("nave", "img/nave.png");
		this.game.load.spritesheet("nave2", "img/ship.png",32,32);
        this.game.load.image("base", "img/base.png", 200,375);
		this.game.load.image("pizza", "img/pizza1.gif");
		this.game.load.spritesheet("asteroid", "img/asteroid1.png",72,72,19);
		this.load.bitmapFont('minecraftia','fonts/minecraftia/minecraftia.png','fonts/minecraftia/minecraftia.xml');
        //this.ROTATION_SPEED = 90;
    },

    create: function() { 
        
        //Pongo el color del stage
        this.game.stage.backgroundColor = 0x333333;
		
		//Inicializo el segundo en el que inicia la ronda:
		this.timerStartTime=this.game.time.totalElapsedSeconds();
		this.timerMaxTime=30;
		this.timerText= this.game.add.bitmapText(10,10,'minecraftia','Time: '+ getRemainingTime(this.timerMaxTime, this.timerStartTime, this.game));
		
        //Agrego la nave
        nave = this.game.add.sprite(this.game.width/2-50, this.game.height-50, "nave2");
        nave.anchor.setTo(0.5,0.5);
		nave.angle = 45;
        //Agrego fisica a la nave
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		//this.game.physics.arcade.gravity.y=400;
		this.game.physics.arcade.enableBody(nave)
		//nave.body.drag.set(100);
		nave.body.maxVelocity.set(200);
        
        //Agrego la base
        base = this.game.add.sprite(this.game.width/2, this.game.height-75, "base");
        
		//Agrego asteroides
		asteroids= this.game.add.group();
		for (var z = 0; z < 4; z++) {
			asteroid= new Asteroid(this.game,0,0);
			asteroid.animations.add('turn');
			asteroid.animations.play('turn', 5, true);
			var x= this.game.rnd.integerInRange(50,this.game.world.width-100);
			var y= this.game.rnd.integerInRange(50,this.game.world.height-100);
			asteroid.reset(x,y);
			asteroid.revive();
			asteroids.add(asteroid);
		}
		
		//Agrego pizza en la base cuando alguien la pida.
		this.packageCaptured=false;
		pizzas= this.game.add.group();
		if (onmousedown) {
        
        this.pizza= new Package(this.game,0,0);
		pizzas.add(this.pizza);
		var x= 200;
		var y= 350;
		this.pizza.reset(x,y);
		this.pizza.revive();
        }
		
        //Agrego teclas
        this.game.input.keyboard.addKeyCapture([
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.UP,
            Phaser.Keyboard.DOWN
        ]);
		
		//  Game input
		cursors = game.input.keyboard.createCursorKeys();

    },

    update: function() {
        
		if (cursors.up.isDown) {
			game.physics.arcade.accelerationFromRotation(nave.rotation, 200, nave.body.acceleration);
			// Show the frame from the spritesheet with the engine on
			nave.frame = 1;
		} else {
			nave.body.acceleration.set(0);
			// Show the frame from the spritesheet with the engine off
			nave.frame = 0;
		}
		if (cursors.left.isDown) {
			nave.body.angularVelocity = -300;
		} else if (cursors.right.isDown) {
			nave.body.angularVelocity = 300;
		} else {
			nave.body.angularVelocity = 0;
		}
		
		screenWrap(nave);
		//hitting coins
		this.game.physics.arcade.overlap(nave,pizzas, pickPackage,null,this);
		
		this.game.physics.arcade.overlap(nave,asteroids, leavePackage,null,this);
		
		if (this.packageCaptured) {
			this.pizza.x=nave.x+10;
			this.pizza.y=nave.y-10;
		}
		
		var remainingTime=getRemainingTime(this.timerMaxTime, this.timerStartTime, this.game);
		if (remainingTime>0) {
			this.timerText.text='Time: '+ remainingTime;
		} else {
			nave.kill();
			this.pizza.kill();
			var scoreboard= new Scoreboard(this.game);
			scoreboard.show(50);
		};
    },
	shutdown: function() {
		asteroids.destroy();
		pizzas.destroy();
		this.score=0;		
	}
};

function getRemainingTime(maxTime, startTime, _game) {
	return Math.floor(maxTime - (_game.time.totalElapsedSeconds() - startTime));

};


function pickPackage(_ship,_package) {
	this.packageCaptured=true;
};

function leavePackage(_ship,_asteroid) {
	if (this.packageCaptured) {
		this.packageCaptured=false;
		this.pizza.x=_asteroid.x+15;
		this.pizza.y=_asteroid.y-15;
	}
};

function screenWrap (sprite) {

    if (sprite.x < 0){
        sprite.x = game.width;
    } else if (sprite.x > game.width) {
        sprite.x = 0;
    }

    if (sprite.y < 0) {
        sprite.y = game.height;
    } else if (sprite.y > game.height) {
        sprite.y = 0;
    }

}

game.state.add('main', mainState);  
game.state.start('main');  