Nautical = function(data) {

	var _data = data;

	this._coordinates= [],
	this._size = [],
	this._color = '',
	this._shape = '', // <-- Just for now we will drawing basic shapes
	this._animation = [], // <-- Later will be using the magic of animation
	this._isSolid = false, // <-- Now we can manage collisions (great!)
	this._material = 0, // <-- 0 equals to 'water'. See method <addOn> on collision.js for details
	this._trace = false, // <-- this tells the collision system wheter to draw its collision matrix or not

	this.load = function(init) {
		if (init) {
			this._coordinates = init._coordinates;
			this._size = init._size;
			this._color = init._color;
			this._shape = init._shape;
			this._animation = init._animation;
			this._isSolid = init._isSolid;
			this._material = init._material;
			this._trace = init._trace;
		}

		if (this._isSolid)
			if (collision !== undefined) {
				this._collisionIndex = collision.addOn(this, this._material); // adding this to collision detector system
				collision.generateMatrix(this);
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

		if (this._trace)
			if (this._collisionIndex !== undefined)
				if (collision !== undefined)
					collision.traceMe(c, this._collisionIndex);

		// and since we don't want the rest of objects
		// joins our ghost object to the non-dead land
		// we return the alpha to 100%
		c.globalAlpha = 1;
	},

	// this method updates collision-matrix's location on radar
	// ideally, it should be automatically called on every nautical's
	// instance at the moment to call <move> method. But for now
	// you've to call it manually
	this.__move = function() {
		if (this._collisionIndex !== undefined)
			if (collision !== undefined)
				collision.generateMatrix(this);
	}

}