function Boat(init) {
	this._height = init._height;
	this._width = init._width;
	this._x = 0;
	this._y = 0;
	this._color = '#008080';
	this._rudder = 'steady';
	this._strength = 3;
}

Boat.prototype.draw = function(c) {
	c.fillStyle = this._color;
	c.beginPath();
	// posteriormente, habrás de cambiar este simple cuadrado
	// por un super navío bien hecho en canvas
	c.fillRect(this._x, this._y, this._width, this._height);
}

Boat.prototype.move = function(wind) {
	// while wind pushes the boat in the directions it blows...
	switch(wind._direction) {
		case 'south':
			this._y += wind._speed;
		break;
		case 'north':
			this._y -= wind._speed;
		break;
		case 'east':
			this._x += wind._speed;
		break;
		case 'west':
			this._x -= wind._speed;
		break;
		default:
			// there's no wind sailor!
	}
	// ... player can steer dependeing on which key is pressed
	switch(this._rudder) {
		case 'south':
			this._y += wind._speed / this._strength;
		break;
		case 'north':
			this._y -= wind._speed / this._strength;
		break;
		case 'east':
			this._x += wind._speed / this._strength;
		break;
		case 'west':
			this._x -= wind._speed / this._strength;
		break;
		default:
			// there's no wind sailor!
	}

	// and we can't be against copernicus' theories. So
	// the boat has to appear by its antipode when it reachs
	// world's end
	if (this._y + this._height < 0)
		this._y = SEA_HEIGHT;
	if (this._y > SEA_HEIGHT)
		this._y = 0;
	if (this._x + this._width < 0)
		this._x = SEA_WIDTH;
	if (this._x > SEA_WIDTH)
		this._x = 0;
}