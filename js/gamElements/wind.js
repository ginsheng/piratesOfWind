function Wind(init) {
	this._speed = init._speed;
	this._direction = init._direction;
}

Wind.prototype.change = function(vector) {
	if (vector._speed)
		this._speed = vector._speed;
	if (vector._direction)
		this._direction = vector._direction;
}