var Package= function(game, x, y, key, frame, _type) {
	key= 'pizza'+_type;
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
	
	//this executes onKilled when the Package dies:
	this.events.onKilled.add(this.onKilled,this);
	//this executes onRevived when the Package revives:
	this.events.onRevived.add(this.onRevived,this);
	
	//this adds the main properties of the packages:
	this.type=_type;
	
	//flag to tell if package is able to be picked up:
	this.available=true;
	
	
};

Package.prototype = Object.create(Phaser.Sprite.prototype);
Package.prototype.constructor= Package;

Package.prototype.onRevived= function() {

};

Package.prototype.onKilled= function() {
	this.animations.frame=0;
};
