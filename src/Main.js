// var game = new Phaser.Game(window.innerWidth,window.innerHeight,Phaser.AUTO,'')
var game = new Phaser.Game(400, 400, Phaser.AUTO, "gameDiv");

var mainState = {

    preload: function() {  
        this.game.load.image("nave", "img/nave.png");
		this.game.load.spritesheet("nave2", "img/ship.png",32,32);
		//many pizzas:
		this.game.load.image("pizza", "img/pizza1.gif");
		this.game.load.image("pizza2", "img/pizza2.png");
		this.game.load.image("pizza3", "img/pizza3.png");
		this.game.load.spritesheet("asteroid", "img/asteroid1.png",72,72,19);
		this.game.load.spritesheet("asteroid2", "img/asteroid2.png",72,72,19);
		this.game.load.spritesheet("asteroid3", "img/asteroid3.png",72,72,19);
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
		
		//Inicializo el score:
		this.score=0;
		this.scoreText= this.game.add.bitmapText(10,50,'minecraftia','Score: '+this.score);
		
        //Agrego la nave
        nave = this.game.add.sprite(this.game.width/2, this.game.height-50, "nave2");
        nave.anchor.setTo(0.5,0.5);
		nave.angle = 45;
        //Agrego fisica a la nave
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		//this.game.physics.arcade.gravity.y=400;
		this.game.physics.arcade.enableBody(nave)
		//nave.body.drag.set(100);
		nave.body.maxVelocity.set(200);
        
		//Agrego asteroides
		asteroids= this.game.add.group();
		for (var z = 0; z < 4; z++) {
			//auxiliar
			var _lifespan=this.game.rnd.integerInRange(10,30)
			var x= this.game.rnd.integerInRange(50,this.game.world.width-100);
			var y= this.game.rnd.integerInRange(50,this.game.world.height-100);
			var score= this.game.rnd.integerInRange(50,100);
			var type=this.game.rnd.integerInRange(2,3);
			
			//generation:
			asteroid= new Asteroid(this.game,x,y, undefined, undefined, _lifespan, score, type);
			asteroid.animations.add('turn');
			asteroid.animations.play('turn', 2, true);
			asteroids.add(asteroid);
		}
		
		//Agrego pizzas
		this.packageCaptured=false;
		this.packageCapturedNumber=-1;
		pizzas= this.game.add.group();
		
		for (var z = 0; z < 4; z++) {
			var x= this.game.rnd.integerInRange(50,this.game.world.width-100);
			var y= this.game.rnd.integerInRange(50,this.game.world.height-100);
			var type=this.game.rnd.integerInRange(2,3);
			this.pizza= new Package(this.game,x,y,undefined, undefined, type);
			pizzas.add(this.pizza);
			//this.pizza.reset(x,y);
			//this.pizza.revive();
		};
		
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
        
		//lógica de control de la nave con las flechas.
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
		//colisiones con paquetes (grupo "pizzas")
		this.game.physics.arcade.overlap(nave,pizzas, pickPackage,null,this);
		
		//colisiones con asteroides (grupo "asteroids")
		this.game.physics.arcade.overlap(nave,asteroids, leavePackage,null,this);
		
		//si se ha capturado una pizza, esta debe aparecer junto con la nave:
		if (this.packageCaptured && this.packageCapturedNumber>=0) {
			_pizza= pizzas.getChildAt(this.packageCapturedNumber);
			_pizza.x=nave.x+10;
			_pizza.y=nave.y-10;
		}
		
		//lógica de timer global (debe ser cambiado por un timer para cada paquete).
		var remainingTime=getRemainingTime(this.timerMaxTime, this.timerStartTime, this.game);
		if (remainingTime>0) {
			this.timerText.text='Time: '+ remainingTime;
		} else {
			//si se acaba el tiempo: matar todo.
			//ToDo: matar los contadores
			nave.kill();
			pizzas.destroy();
			asteroids.destroy();
			var scoreboard= new Scoreboard(this.game);
			scoreboard.show(50);
		};
		
		//lógica de panel con puntaje:
		this.scoreText.text= 'Score: '+this.score;
		
		//para cada asteroide: dibujamos el contador al lado
		asteroids.forEachAlive(drawLifespan, this);
    },
	shutdown: function() {
		asteroids.destroy(true);
		pizzas.destroy(true);
		this.score=0;
	}
};

function getRemainingTime(maxTime, startTime, _game) {
	return Math.floor(maxTime - (_game.time.totalElapsedSeconds() - startTime));
};


function pickPackage(_ship,_package) {
	if (_package.available) {
		this.packageCapturedNumber= pizzas.getChildIndex(_package);
		this.packageCaptured=true;
	};
	
};

function drawLifespan(_package) {
	if (_package.lifespan>=0) _package.lifespanText.text=Math.floor(_package.lifespan/1000);
	
};

function leavePackage(_ship,_asteroid) {
	if (this.packageCaptured && this.packageCapturedNumber>=0) {
		_pizza= pizzas.getChildAt(this.packageCapturedNumber);
		//debemos garantizar que solo podemos dejar la pizza 
		//que el cliente ha pedido (es decir: que sea del mismo tipo)
		//también: ese asteroide no puede tener pizza ya.
		if (_pizza.type==_asteroid.type && _asteroid.packageDeliveredNum==-1) {
			//al dejar la pizza:
			//se aumenta el puntaje, 
			this.score+=_asteroid.points;
			
			//se apunta el paquete que fue entregado en el asteroide:
			_asteroid.packageDeliveredNum=this.packageCapturedNumber;
			
			//se termina de contar el tiempo al destino:
			_asteroid.lifespan=-1;
						
			//se reinicializan los marcadores que indican qué paquete se tiene en la nave
			this.packageCaptured=false;
			this.packageCapturedNumber=-1;
			//se ubica el paquete alrededor del destino
			_pizza.x=_asteroid.x+15;
			_pizza.y=_asteroid.y-15;
			
			//se prohíbe recoger el paquete otra vez:
			_pizza.available=false;
		};
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