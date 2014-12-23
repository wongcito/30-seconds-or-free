var game = new Phaser.Game(400, 400, Phaser.AUTO, "gameDiv");

var mainState = {

    preload: function() {  
        this.game.load.image("nave", "img/nave.png");
        var ROTATION_SPEED = 90;
    },

    create: function() { 
        
        //Pongo el color del stage
        this.game.stage.backgroundColor = "#fff";
        
        //Agrego la nave
        nave = this.game.add.sprite(this.game.width/2, this.game.height-50, "nave");
        nave.anchor.setTo(0.5,0.5);
        
        //Agrego fisica a la nave
        this.game.physics.enable(this.nave, Phaser.Physics.ARCADE);
        
        //Maxima velocidad
        nave.body.maxVelocity.setTo(max_speed, max_speed);
        
        //Agrego teclas
        this.game.input.keyboard.addKeyCapture([
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.UP,
            Phaser.Keyboard.DOWN
        ]);
        
    },

    update: function() {
        
        
        if (this.leftInputIsActive()) {
            // If the LEFT key is down, rotate left
            nave.body.angularVelocity = -ROTATION_SPEED;
        }
    },
    
    leftInputIsActive: function() {
        var isActive = false;

        isActive = this.input.keyboard.isDown(Phaser.Keyboard.LEFT);
        isActive |= (this.game.input.activePointer.isDown &&
            this.game.input.activePointer.x < this.game.width/4);

        return isActive;
    }
    
};

game.state.add('main', mainState);  
game.state.start('main');  