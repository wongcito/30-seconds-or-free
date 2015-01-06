var Scoreboard= function(game) {
	Phaser.Group.call(this,game);
};

Scoreboard.prototype= Object.create(Phaser.Group.prototype);
Scoreboard.prototype.constructor= Scoreboard;

Scoreboard.prototype.show= function(score) {
	//mainly variables for text and highscore keeping
	var bmd, background, gameoverText, scoreText, highScoreText, newHighScoreText, startText;
	
	bmd= this.game.add.bitmapData(this.game.width,this.game.height);
	bmd.ctx.fillStyle= '#000';
	bmd.ctx.fillRect(0,0,this.game.width,this.game.height);
	
	background= this.game.add.sprite(0,0,bmd);
	background.alpha=0.5;
	
	this.add(background);
	
	// var isNewHighScore=false;
	// var highscore=localStorage.getItem('highscore');
	// if(!highscore || highscore< score) {
		// isNewHighScore= true;
		// highscore= score;
		// localStorage.getItem('highscore',highscore);
	// };
	
	this.y=this.game.height;
	
	// these are all text to show at the end:
	gameoverText=this.game.add.bitmapText(100,100,'minecraftia','You Died');
	// gameoverText.x= this.game.width/2 - (gameoverText.textWidth/2);
	this.add(gameoverText);
	
	// scoreText=this.game.add.bitmapText(0,100,'minecraftia','Your Score: '+score,24);
	// scoreText.x= this.game.width/2 - (scoreText.textWidth/2);
	// this.add(scoreText);
	
	// highScoreText=this.game.add.bitmapText(0,250,'minecraftia','Your High Score: '+highscore,24);
	// highScoreText.x= this.game.width/2 - (highScoreText.textWidth/2);
	// this.add(highScoreText);
	
	// startText=this.game.add.bitmapText(0,300,'minecraftia','Tap to play again!',16);
	// startText.x= this.game.width/2 - (startText.textWidth/2);
	// this.add(startText);
	
	// if (isNewHighScore) {
		// newHighScoreText=this.game.add.bitmapText(0,100,'minecraftia','New High Score!',12);
		// newHighScoreText.tint= 0x4ebef7; //#4ebef7
		// newHighScoreText.x= gameoverText.x + gameoverText.textWidth+40;
		// newHighScoreText.angle=45;
		// this.add(newHighScoreText);
	// };
	// make it move a little
	this.game.add.tween(this).to({y:0},100,Phaser.Easing.Bounce.Out,true);
	// give the option to play again:
	this.game.input.onDown.addOnce(this.restart,this);
};

Scoreboard.prototype.restart=function() {
	this.game.state.start('main',true,false);
};

