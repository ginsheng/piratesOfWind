Nautical = function(data) {

	var _data = data;

	this._coordinates= [],
	this._size = [],
	this._color = '',
	this._shape = '', // <-- Just for now we will drawing basic shapes
	this._animation = [], // <-- Later will be using the magic of animation

	this.load = function(init) {
		if (init) {
			this._coordinates = init._coordinates;
			this._size = init._size;
			this._color = init._color;
			this._shape = init._shape;
			this._animation = init._animation;
		}
	}

	this.load(_data);

	this.draw = function(c) {

		var x = this._coordinates._x;
		var y = this._coordinates._y;
		var height = this._size._height;
		var width = this._size._width;

		c.fillStyle = this._color;
		c.beginPath();

		// with this we just make use of alpha property
		// incase our object wants to be "ghostly"
		if (this._alpha)
			c.globalAlpha = this._alpha;

		switch(this._shape) {
			case 'square':
				c.fillRect(x, y, width, height);
			break;
			case 'circle':
				c.arc(x, y, width, 0, 2 * Math.PI);
				if (this._strokeColor)
					c.stroke();
				c.fill();
			break;
		}

		// and since we don't want the rest of objects
		// joins our ghost object to the non-dead land
		// we return the alpha to 100%
		c.globalAlpha = 1;
	},

	move = function(newCoordinates) {
		console.debug('Something must be done here');
	}

}