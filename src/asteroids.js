var Asteroid= function(game, x, y, key, frame) {
	key= 'asteroid';
	Phaser.Sprite.call(this, game, x, y, key, frame);
	
	this.scale.setTo(0.5);
	this.anchor.setTo(0.5);
	
	//we tell it to animate
	//this.animations.add('spin');
	
	this.game.physics.arcade.enableBody(this);
	this.body.allowGravity=false;
	
	//this makes it know when it leaves the world
	this.checkWorldBounds=true;
	//this kills it when it leaves the world
	this.onOutOfBoundKill=true;
	
	//this executes onKilled when the Asteroid dies:
	this.events.onKilled.add(this.onKilled,this);
	//this executes onRevived when the Asteroid revives:
	this.events.onRevived.add(this.onRevived,this);
	//
};

Asteroid.prototype = Object.create(Phaser.Sprite.prototype);
Asteroid.prototype.constructor= Asteroid;

Asteroid.prototype.onRevived= function() {

};

Asteroid.prototype.onKilled= function() {
	this.animations.frame=0;
};
