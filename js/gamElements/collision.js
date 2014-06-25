CollisionMaster = function(game_data) {
	
	this._gameArea = [];
	this._precision = 1; // in pixels
	this._discreteMatrix = [];
	this.radar = []; // stores all collisionable objects on screen

	this.load = function(init) {
		this._gameArea = init._gameArea;
		this._precision = init._precision;
		this.generate();
	}

	this.generate = function () {
		/*First of all, I think we need to calculate
		how many "tiny squares" the game space
		will be divided 
		In order to achieve that, we set a
		property called _precision which holds
		how many squares on width and how many on
		height we split or game area
		*/

		// calculating how many squares fits on game_area
		xSquares = this._gameArea._width / this._precision;
		ySquares = this._gameArea._height / this._precision;

		squareX = this._gameArea._width / xSquares;
		squareY = this._gameArea._height / ySquares;

		// fill the matrix with squares and coordinates
		for (var i = 0; i < xSquares; i++) {
			this._discreteMatrix[i] = new Array();
			for (var j = 0; j < ySquares; j++)
				this._discreteMatrix[i].push({_x: squareX * i, _y: squareY * j });
		}
	}

	this.generateMatrix = function (ofWhat) {
		// literally same method than the described above
		var size = ofWhat._size;
		var coordinates = ofWhat._coordinates;
		var who = ofWhat._collisionIndex - 1;

		var length = this.calculateArea(ofWhat);

		// var squaresX = size._width / this._precision;
		// var squaresY = size._height / this._precision;
		var squaresX = squaresY = length / this._precision;

		// console.debug('Tu objeto mide: ' + squaresX + ' por ' + squaresY);

		// due to canvas' way to draw circles, we need to translate the coordinate
		// of that kind of shapes
		if (ofWhat._shape == 'circle')
			coordinates = {_x: ofWhat._coordinates._x - ofWhat._size._width + this._precision,
						   _y: ofWhat._coordinates._y - ofWhat._size._height + this._precision
						  };
		// also, I didn't think on rectangular shapes
		if (ofWhat._shape == 'square' && ofWhat._size._height != ofWhat._size._width) {
			squaresX = size._width / this._precision;
			squaresY = size._height / this._precision;
		}

		var from = this.naturalToCardinal(coordinates);
		var discreteMatrix = [];

		// fill the matrix, from object's position to object's dimension
		for (var i = 0; i < squaresX; i++) {
			discreteMatrix[i] = new Array();
			for (var j = 0; j < squaresY; j++){
				
				discreteMatrix[i][j] = (
					{
						_x: i + from._x,
						_y: from._y + j
					}
				);

				for (var c = 0; c < this.radar.length; c++)
					if (c != who)
						this.checkCollide(discreteMatrix[i][j], this.radar[c]);
			}
		}

		this.radar[who]._discreteMatrix = discreteMatrix;
		this.radar[who]._discreteSize = {_width: squaresX, _height: squaresY};
		// console.debug(discreteMatrix);
	}

	// this method is util just to corroborate a collision matrix
	this.trace = function(c, matrix, material) {
		c.lineWidth = 0.5;
		var color = '#000000';
		switch(material) {
			case 0:
				color = '#FFFFFF';
			break;
			// case '1':
			// 	color = '#000000';
			// break;
			case 2:
				color = '#00FF00';
			break;
			case 3:
				color = '#FF0000';
			break;
			case 4:
				color = '#0000FF';
			break;
		}
		c.strokeStyle = color;
		for (var i = 0; i < matrix.length; i++)
			for (var j = 0; j < matrix[i].length; j++) {
				var coordinates = matrix[i][j];
				c.rect(coordinates._x * this._precision, coordinates._y * this._precision, this._precision, this._precision);
				c.stroke();
			}
	}

	this.traceMe = function (c, me) {
		var whatAmI = this.radar[me-1];
		if (whatAmI._discreteMatrix !== undefined)
			this.trace(c, whatAmI._discreteMatrix, whatAmI._material);
	}

	// this translates natural (pixel) coordinates to cardinal (tinySquare) coordinates
	this.naturalToCardinal = function(coordinates) {
		var xCardinal = Math.floor(coordinates._x / this._precision);
		var yCardinal = Math.floor(coordinates._y / this._precision);

		return ({_x: xCardinal, _y: yCardinal});
	}

	this.addOn = function (who, material) {
		// 'who' object must answer the questions:
		// where are you? and what's you size?
		// also we need to know what kind of "material"
		// the object is builded with, in order to determine
		// how is afected by other objects in case of a collision
		// right nwo I just have the idea of clasify all our
		// "periodic table" as follows
		// 0: 'water' (does nothing to player or any object in this game)
		// 1: 'raw material' (just somethig that stops its movement if collide with something)
		// 2: 'goal' (that material which we construct the goal poit, in this case, the island)
		// 3: 'siniester' (everything that destroys a player... Or even non-playable things, like the island)
		// 4: 'player' (that which a player is build with)
		var object = {
			_coordinates: who._coordinates,
			_size: who._size,
			_material: material
		}
		this.radar.push(object);
		return (this.radar.length);
	}

	// here's where things goes interisting.
	// We anounce to an object if have collided whit something
	// and more important: what kind of thing it collies with.
	// The "me" parameter refers to the objects position on 
	// the collisionMaster radar
	this.didICollide = function(me, position) {
		// to do that, we will iterate our "objects" list
		// (skiping "me")
		// and see if our objects matrix position/size
		// fits somethig on the sea.
		var whatAmI = this.radar[me];
		for (var i = 0; i < this.radar.length; i ++)
			if (me != i) {
				var what = this.radar[i];
				var naturalCoordinates = this.naturalToCardinal(what._where);
			}
	}

	this.checkCollide = function(point, object) {
		var matrix = object._discreteMatrix;
		var size = object._discreteSize;
		for (var i = 0; i < matrix.length; i++)
			for (var j = 0; j < matrix[i].length; j++) {
				var coordinates = matrix[i][j];
				// console.debug(JSON.stringify(point) + ' vs. ' + JSON.stringify(coordinates));
				if (point._x == coordinates._x && point._y == coordinates._y )
					console.debug('There was a collision!');
			}
	}

	this.calculateArea = function(ofWhat) {
		switch (ofWhat._shape) {
			case 'circle':
				var area = Math.PI * Math.pow(ofWhat._size._height,2);
				return Math.sqrt(area);
			break;
			case 'square':
				return ofWhat._size._height;
			break;
		}
	}

	this.removeMe = function(colIndex) {
		this.radar.splice(colIndex-1, 1);
	}

	this.load(game_data);
}