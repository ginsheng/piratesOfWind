function Whirl(init) {
	Nautical.apply(this, arguments);
	this._alpha = 0.5;
	this.move = function(wind) {
		if (wind._direction == 'east')
			this._coordinates._x += wind._speed / 6;
		if (wind._direction == 'west')
			this._coordinates._x -= wind._speed / 6;
		if (wind._direction == 'north')
			this._coordinates._y -= wind._speed / 6;
		if (wind._direction == 'south')
			this._coordinates._y += wind._speed / 6;

		if (wind._direction == 'east' || wind._direction == 'west')
			this._coordinates._y += wind._speed/12;
		if (wind._direction == 'north' || wind._direction == 'south')
			this._coordinates._x += (wind._speed/12*-1);
	}
}

Whirl.prototype = new Nautical();