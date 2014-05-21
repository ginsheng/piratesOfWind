GAME_FPS = 30;
GAME_WIDTH = 480;
GAME_HEIGHT = 320;
paused = false;
function start() {
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

	// creating wind
	wind = new Wind({_speed: 1.7, _direction: 'east'});

	// creating boat
	boat = new Boat({_height: 20, _width: 20});

	// adding the keyboard listener
	set_ketListener();

	// giving live to game
	game_action();
}

function game_action() {
		game_beat = setInterval(function(){
			draw(universe.getContext('2d'));
		}, 1000/GAME_FPS);
}

function draw(context) {
	context.clearRect(0, 0, SEA_WIDTH, SEA_HEIGHT);
	boat.move(wind);
	boat.draw(context);
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
	paused = !paused;

	if (paused)
		clearInterval(game_beat);
	else
		game_action();
}