function Island(init) {
	this._height = init._height;
	this._width = init._width;
	this._x = init._x;
	this._y = init._y;
	this._color = '#F5ED7D';
}

Island.prototype.draw = function(c) {
	c.fillStyle = this._color;
	c.beginPath();
	// posteriormente, habrás de cambiar este simple cuadrado
	// por una paradisiaca playa caribeña
	c.fillRect(this._x, this._y, this._width, this._height);
}