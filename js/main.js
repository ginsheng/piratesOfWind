GAME_FPS = 30;
GAME_WIDTH = 480;
GAME_HEIGHT = 320;
WEATHER_PROBABILITIES = 5; // seconds to change wind direction by first time
MINES_ON_SEA = 3; // number of lethal mines on the sea
MINES = [];
paused = false;
over = false;
time = ({sec: 0, min: 0, hour: 0});
nautical_rose = ['north', 'south', 'east', 'west'];

function start() {

	document.getElementById('welcome').style.display = 'none';

	var gameField = document.getElementById('gameField');

	universe = document.createElement('canvas');
	universe.id = 'universe';
	universe.width = GAME_WIDTH;
	universe.height = GAME_HEIGHT;
	universe.style.border = '#000080 1px solid';

	// gameField.appendChild(universe);
	document.body.appendChild(universe);

	SEA_WIDTH = GAME_WIDTH;
	SEA_HEIGHT = GAME_HEIGHT;

	// creating collision radar
	collision = new CollisionMaster({
		_gameArea: {_width: GAME_WIDTH, _height: GAME_HEIGHT},
		_precision: 5,
	})

	// creating wind
	wind = new Wind({_speed: 1.5, _direction: 'east'});

	// creating boat
	boat = new Boat({
		_size: {_height: 20, _width: 30},
		_coordinates: {_x: 5, _y: 5},
		_color: '#008080',
		_shape: 'square',
		_isSolid: true,
		_material: 4, // <-- 4 means 'player'. See method <addOn> on collision.js for details
	});

	// creating an island
	var randomX = Math.floor((Math.random() * SEA_WIDTH) - 25);
	var randomY = Math.floor((Math.random() * SEA_HEIGHT) + 25);
	// console.debug('Coordenadas de la isla: ' + randomX + ', ' + randomX);
	island = new Island({
		_size: {_height: 25, _width: 25},
		_coordinates: {_x: randomX, _y: randomY},
		_color: '#F5ED7D',
		_shape: 'circle',
		_isSolid: true,
		_material: 2, // <-- 2 means 'goal'
	});

	// adding a little bit of difficulty to game. We put a few lethal mines
	// floating over there

	for (var m = 0; m < MINES_ON_SEA; m++) {
		var randomX = Math.floor((Math.random() * SEA_WIDTH) - 70);
		var randomY = Math.floor((Math.random() * SEA_HEIGHT) + 70);
		var mine = new Nautical({
			_coordinates: {_x: randomX, _y: randomY},
			_size: {_width: 10, _height: 10},
			_color: 'red',
			_shape: 'circle',
			_isSolid: true,
			_material: 3, // <-- 3 means 'somthing that kills player'
			// _trace: true,
		});
		MINES[m] = mine;
	} 

	// adding the keyboard listener
	set_ketListener();
	// giving live to game
	game_action();
}

function game_action() {
	collision.generate();
	game_beat = setInterval(function(){
		draw(universe.getContext('2d'));
	}, 1000/GAME_FPS);
	wind_conditions = setInterval(function(){
		change_wind();
	}, 1000 * WEATHER_PROBABILITIES);
	timer = setInterval(function(){timing();}, 1000);
}

function draw(context) {
	context.clearRect(0, 0, SEA_WIDTH, SEA_HEIGHT);
	island.draw(context);
	boat.move(wind);
	boat.draw(context);
	if (typeof whirl !== 'undefined') {
		whirl.move(wind);
		whirl.draw(context);
	}
	for (var m = 0; m < MINES_ON_SEA; m++)
		MINES[m].draw(context);
	//collision.trace(context);
}

function set_ketListener() {
	document.onkeydown = function(e) {
		if (e.keyCode == 32)
			toggle_pause();
		else
			switch (e.keyCode) {
				case 38:
					boat._rudder = 'north';
				break;
				case 39:
					boat._rudder = 'east';
				break;
				case 40:
					boat._rudder = 'south';
				break;
				case 37:
					boat._rudder = 'west';
				break;
				default:
					boat._rudder = 'steady';
			}
	}

	document.onkeyup = function(e) {
		boat._rudder = 'steady';
	}
}

function toggle_pause() {
	if (!over) {
		paused = !paused;

		if (paused) {
			clearInterval(game_beat);
			clearInterval(wind_conditions);
		}
		else
			game_action();
	}
}

function change_wind() {
	// So, then wind conditions change on a probability of 25% (I guess)
	var i = Math.floor(Math.random() * 4);
	// Also, randomly we'll se if a typhoon will appear on the sea
	var typhoon_ = Math.floor((Math.random() * 3) + 1);
	// Here we made influence on the windo based on random
	wind.change({_speed: wind._speed, _direction: nautical_rose[i]} );
	// if there's no typhoon on sea...
	if (typeof whirl === 'undefined')
		// and random results unlucky...
		if (typhoon_ == 2) { // Tendremos un tifón 
			var tifonX = Math.floor((Math.random() * 300) + 200);
			var tifony = Math.floor((Math.random() * -20) + 100);
			whirl = new Whirl({
				_coordinates: {_x: tifonX, _y: tifony},
				_size: { _width: 35, _height: 35},
				_color: '#000080',
				_shape: 'circle',
				_isSolid: true,
				_material: 3, // <-- 3 means 'anything evil to a player'. See method <addOn> on collision.js for details
			});
			// In order to be not so cruel with player. Typhoon has
			// a short life of 9 seconds
			setTimeout(function(){ collision.removeMe(whirl._collisionIndex); whirl = undefined;}, 9000);
		}
}

function game_finish(result) {
	over = true;
	clearInterval(game_beat);
	clearInterval(wind_conditions);
	clearInterval(timer);
	alert(result._message + ' (Total time: ' + time.hour + ':' + time.min + ':' + time.sec + ')');
	if (confirm('Wanna play again?'))
		location.reload(false);
}

function timing() {
	if (++time.sec > 60) {
		time.sec = 0;
		if (++time.min > 60) {
			time.min = 0;
			if (++time.hour > 24) {
				time.hour = 0;
				alert('you have been playing so long!');
			}
		}
	}
}