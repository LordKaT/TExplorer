var g_gameEngine = {
	canvas: null,	// canvas
	ctx: null,		// 2d context
	screen_offset: { x: 39, y: 27 },
	state: null,
	mode: null,
	dialog: null,
};

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

var g_map = {
	name: null,
	bgColor: null,
	bgimage: null,
	map: []	// tile, wall[wallUp, wallLeft, wallDown, wallRight], objects[]
};

function game_line(x1, y1, w1, h1) {
	g_gameEngine.ctx.lineWidth = 2;
	g_gameEngine.ctx.beginPath();
	g_gameEngine.ctx.moveTo(x1, y1);
	g_gameEngine.ctx.lineTo(x1+w1, y1+h1);
	g_gameEngine.ctx.stroke();
	g_gameEngine.ctx.lineWidth=1;
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function game_init() {
	g_gameEngine.canvas =  document.getElementById("twitchGame");
	g_gameEngine.ctx = g_gameEngine.canvas.getContext("2d");
	g_gameImages = game_image_load(g_imageSources);
	g_tiles = game_image_load(g_image_tiles);
	g_walls = game_image_load(g_image_walls);

	g_gameEngine.ctx.font = "bold 14pt terminal";

	window.addEventListener("keydown", game_input, true);
	g_gameEngine.state = "intro";

	game_map_init();
	game_player_init();
	game_input();

	game_dialog("TEST TEST TEST\n\nWelcome, explorer, to the dungeon! Inside you will find nothing of interest. There are no rooms to explore nor monsters to fight.\n\nHave fun!");

	return;
}

function game_input(e) {
	if (e === null || e === undefined) { return; }
	if (e.keyCode === 110) {
		game_map_init();
	}
	if (e.keyCode === 191) {
		game_dialog("You pressed the secret button!");
	}
	if (e.keyCode === 36) {
		console.log(JSON.stringify(g_map));
	}
	if (g_gameEngine.mode === "dungeon") {
		// game_dungeon_input(e.keyCode);
		game_player_move_input(e.keyCode);
	} else if (g_gameEngine.mode === "dialog") {
		game_dialog_input(e.keyCode);
	}
	game_draw();
	return;
}

function game_draw() {
	g_gameEngine.ctx.clearRect(0, 0, g_gameEngine.canvas.width, g_gameEngine.canvas.height);
	g_gameEngine.canvas.style.background = g_map.bgColor;

	g_gameEngine.ctx.beginPath();
	g_gameEngine.ctx.rect(5, 20, 390, 335);
	g_gameEngine.ctx.fillStyle = "rgb(105, 70, 45)";
	g_gameEngine.ctx.fill();
	g_gameEngine.ctx.lineWidth = 5;
	g_gameEngine.ctx.strokeStyle = "rgb(245, 170, 0)";
	g_gameEngine.ctx.stroke();
	
	game_map_draw();
	game_player_draw();
	game_title(g_map.name);
	if (g_gameEngine.mode === "dialog") {
		game_dialog_draw();
	}
	return;
}

function game_title(text) {
	g_gameEngine.ctx.strokeStyle = "rgb(0, 0, 0)";
	g_gameEngine.ctx.fillStyle = "rgb(0, 0, 0)";
	g_gameEngine.ctx.textBaseline = "top";
	g_gameEngine.ctx.textAlign = "center";
    g_gameEngine.ctx.fillText(text, g_gameEngine.canvas.width/2, 0);
	return;
}

function game_mouse_get_pos(evt) {
	var rect = g_gameEngine.canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}
