function Boat(init) {
	Nautical.apply(this, arguments);
	this._rudder = 'steady';
	this._strength = 3;
	this.move = function(wind) {
		// while wind pushes the boat in the directions it blows...
		switch(wind._direction) {
			case 'south':
				this._coordinates._y += wind._speed;
			break;
			case 'north':
				this._coordinates._y -= wind._speed;
			break;
			case 'east':
				this._coordinates._x += wind._speed;
			break;
			case 'west':
				this._coordinates._x -= wind._speed;
			break;
			default:
				// there's no wind sailor!
		}
		// ... player can steer dependeing on which key is pressed
		switch(this._rudder) {
			case 'south':
				this._coordinates._y += wind._speed / this._strength;
			break;
			case 'north':
				this._coordinates._y -= wind._speed / this._strength;
			break;
			case 'east':
				this._coordinates._x += wind._speed / this._strength;
			break;
			case 'west':
				this._coordinates._x -= wind._speed / this._strength;
			break;
			default:
				// there's no even a sailor driving!
		}

		// and we can't be against copernicus' theories. So
		// the boat has to appear by its antipode when it reachs
		// world's end
		if (this._coordinates._y + this._size._height < 0)
			this._coordinates._y = SEA_HEIGHT;
		if (this._coordinates._y > SEA_HEIGHT)
			this._coordinates._y = 0;
		if (this._coordinates._x + this._size._width < 0)
			this._coordinates._x = SEA_WIDTH;
		if (this._coordinates._x > SEA_WIDTH)
			this._coordinates._x = 0;
	}
}

Boat.prototype = new Nautical();