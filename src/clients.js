var Client= function(game, x, y, key, frame,_maxTime, _points, _type) {
	key= 'client'+_type;
	Phaser.Sprite.call(this, game, x, y, key, frame);
	
	this.scale.setTo(0.5);
	this.anchor.setTo(0.5);
	
	this.game.physics.arcade.enableBody(this);
	this.body.allowGravity=false;
	
	//this makes it know when it leaves the world
	this.checkWorldBounds=true;
	//this kills it when it leaves the world
	this.onOutOfBoundKill=true;
	
	//this executes onKilled when the client dies:
	this.events.onKilled.add(this.onKilled,this);
	//this executes onRevived when the client revives:
	this.events.onRevived.add(this.onRevived,this);
	//
	//this adds the main properties of the clients:
	this.type=_type;
	this.lifespan=_maxTime*1000; //seconds to milliseconds.
	this.points=_points;
	
	//this adds the package number that was delivered:
	this.packageDeliveredNum=-1;
	
	//this adds the text that shows the lifespan:
	this.lifespanText= this.game.add.bitmapText(x-15,y,'minecraftia','test',10);
};

Client.prototype = Object.create(Phaser.Sprite.prototype);
Client.prototype.constructor= Client;

Client.prototype.onRevived= function() {

};

Client.prototype.onKilled= function() {
	this.animations.frame=0;
};
