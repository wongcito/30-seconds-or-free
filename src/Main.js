var game = new Phaser.Game(400, 400, Phaser.AUTO, "gameDiv");

var mainState = {

    preload: function() {  
        this.game.load.image("nave", "img/nave.png");
		this.game.load.spritesheet("nave2", "img/ship.png",32,32);
		this.game.load.image("pizza", "img/pizza1.gif");
        //this.ROTATION_SPEED = 90;
    },

    create: function() { 
        
        //Pongo el color del stage
        this.game.stage.backgroundColor = 0x333333;
		
        //Agrego la nave
        nave = this.game.add.sprite(this.game.width/2, this.game.height-50, "nave2");
        nave.anchor.setTo(0.5,0.5);
		nave.angle = 45;
        //Agrego fisica a la nave
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		//this.game.physics.arcade.gravity.y=400;
		this.game.physics.arcade.enableBody(nave);
		//nave.body.drag.set(100);
		nave.body.maxVelocity.set(200);
        
		//Agrego pizza
		this.packageCaptured=false;
		pizzas= this.game.add.group();
		this.pizza= new Package(this.game,0,0);
		pizzas.add(this.pizza);
		var x= this.game.rnd.integerInRange(50,this.game.world.width-100);
		var y= this.game.rnd.integerInRange(50,this.game.world.height-100);
		this.pizza.reset(x,y);
		this.pizza.revive();
		
		
		
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
		this.game.physics.arcade.overlap(nave,pizzas, coinHit,null,this);
		
		if (this.packageCaptured) {
			this.pizza.x=nave.x+10;
			this.pizza.y=nave.y-10;
		}
		
    },
    
/*     leftInputIsActive: function() {
        var isActive = false;

        isActive = this.input.keyboard.isDown(Phaser.Keyboard.LEFT);
        isActive |= (this.game.input.activePointer.isDown &&
            this.game.input.activePointer.x < this.game.width/4);

        return isActive;
    } */
    
};

function coinHit(_ship,_package) {
	this.packageCaptured=true;
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