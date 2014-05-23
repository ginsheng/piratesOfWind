function Whirl(init) {
	this._x = init._x;
	this._y = init._y;
	this._size = init._size;
	this._color = "#000080";
}

Whirl.prototype.draw = function(c) {
	c.fillStyle = this._color;
	c.beginPath();
	// posteriormente, habrás de cambiar este simple cuadrado
	// por una devastadora fuerza de la naturaleza...
	// ... Empiezo a creer que podemos factorizar estas clases
	c.fillRect(this._x - this._size, this._y + this._size, this._size, this._size);
}

Whirl.prototype.move = function(wind) {

	if (wind._direction == 'east')
		this._x += wind._speed / 12;
	if (wind._direction == 'west')
		this._x -= wind._speed / 12;
	if (wind._direction == 'north')
		this._y -= wind._speed / 12;
	if (wind._direction == 'south')
		this._y += wind._speed / 12;

	if (wind._direction == 'east' || wind._direction == 'west')
		this._y += wind._speed/24;
	if (wind._direction == 'north' || wind._direction == 'south')
		this._x += (wind._speed/24*-1);
}