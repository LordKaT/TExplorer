var g_canvas = null; // canvas
var g_ctx = null; // canvas 2d context

var g_screenOffset = {x: 1, y: 39};

var g_gameImages = {};
var g_imageSources = [
	"http://twitchexplorer.lordkat.com/beta/images/game/test.png",
	"http://twitchexplorer.lordkat.com/beta/images/game/test_tile.png"
];

var g_image_tiles = [
	"http://twitchexplorer.lordkat.com/beta/images/game/tiles/default.png",
	"http://twitchexplorer.lordkat.com/beta/images/game/tiles/pit.png",
	
];

var g_image_walls = [
	"http://twitchexplorer.lordkat.com/beta/images/game/tiles/wall_up.png",
	"http://twitchexplorer.lordkat.com/beta/images/game/tiles/wall_left.png",
	"http://twitchexplorer.lordkat.com/beta/images/game/tiles/wall_down.png",
	"http://twitchexplorer.lordkat.com/beta/images/game/tiles/wall_right.png"
];

var g_tiles = null;
var g_walls = null;

var g_imageLoadCount = 0;
var g_imageLoadTotal = 0;
var g_imagePreloaded = false;

var g_map = [];

function game_line(x1, y1, w1, h1) {
	g_ctx.lineWidth=2;
	g_ctx.beginPath();
	g_ctx.moveTo(x1, y1);
	g_ctx.lineTo(x1+w1, y1+h1);
	g_ctx.stroke();
	g_ctx.lineWidth=1;
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function game_map_init() {
	/* default map. */
	for (var x = 0; x < 16; x++) {
		for (var y = 0; y < 16; y++) {
			g_map[x] = (typeof g_map[x] != 'undefined' && g_map[x] instanceof Array) ? g_map[x] : [];
			var wallUp = 0;
			var wallLeft = 0;
			var wallDown = 0;
			var wallRight = 0;
			if (x === 0) { wallLeft = 1; }
			else if (x === 15) { wallRight = 1; }
			else {
				if (random(0, 100) >= 80) { wallLeft = 1; }
				if (random(0, 100) >= 80) { wallRight = 1; }
			}
			if (y === 0) { wallUp = 1; }
			else if (y === 15) { wallDown = 1; }
			else {
				if (random(0, 100) >= 80) { wallUp = 1; }
				if (random(0, 100) >= 80) { wallDown = 1; }
			}
			g_map[x][y] = { t: 0, w: [wallUp, wallLeft, wallDown, wallRight], o: [] };
			//console.log("(" + x + ", " + y + ") " + wallUp + " " + wallLeft + " " + wallDown + " " + wallRight);
		}
	}
}

function game_init() {
	g_canvas =  document.getElementById("twitchGame");
	g_ctx = g_canvas.getContext("2d");
	g_gameImages = game_image_load(g_imageSources);
	g_tiles = game_image_load(g_image_tiles);
	g_walls = game_image_load(g_image_walls);
	game_map_init();
	game_player_init();
	game_input();
	return;
}

function game_map_draw() {
	for (var x = 0; x < 16; x++) {
		for (var y = 0; y < 16; y++) {
			g_ctx.drawImage(g_tiles[g_map[x][y].t], x*20+g_screenOffset.x, y*20+g_screenOffset.y);
		}
	}
	for (var x = 0; x < 16; x++) {
		for (var y = 0; y < 16; y++) {
			if (g_map[x][y].w[0] === 1) {
				game_line(x*20 + g_screenOffset.x, y*20 + g_screenOffset.y, 20, 0);
			}
			if (g_map[x][y].w[1] === 1) {
				game_line(x*20 + g_screenOffset.x, y*20 + g_screenOffset.y, 0, 20);
			}
			if (g_map[x][y].w[2] === 1) {
				game_line(x*20 + g_screenOffset.x, y*20 + 20 + g_screenOffset.y, 20, 0);
			}
			if (g_map[x][y].w[3] === 1) {
				game_line(x*20 + 20 + g_screenOffset.x, y*20 + g_screenOffset.y, 0, 20);
			}
		}
	}
	return;
}

function game_input() {
	$(document).keypress(function(e) {
		if (e.which >= 48 && e.which <= 57) {
			game_player_move_input(e.which);
			game_draw();
		}
		return;
	});
}

function game_draw() {
	g_ctx.clearRect(0, 0, g_canvas.width, g_canvas.height);
	game_map_draw();
	game_player_draw();
	return;
}
