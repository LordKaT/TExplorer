var g_image_player = [
	"http://twitchexplorer.lordkat.com/beta/images/game/player_up.png",
	"http://twitchexplorer.lordkat.com/beta/images/game/player_left.png",
	"http://twitchexplorer.lordkat.com/beta/images/game/player_down.png",
	"http://twitchexplorer.lordkat.com/beta/images/game/player_right.png"
];

// facing: up - 0, left - 1, down - 2, right - 3
var g_player = {x: 0, y: 5, facing: 3, img: null, map: {t: [], w: []}};

function game_player_init() {
	g_player.img = game_image_load(g_image_player);
}

function game_player_draw() {
	g_gameEngine.ctx.drawImage(g_player.img[g_player.facing], (g_player.x*20)+1+g_gameEngine.screen_offset.x, (g_player.y*20)+1+g_gameEngine.screen_offset.y);
	return;
}

function game_player_move(direction) {
	switch (direction) {
		case 0: // up
			if (g_player.y > 0) {
				if (g_map.map[g_player.x][g_player.y].w[0] === 0 &&
					g_map.map[g_player.x][g_player.y - 1].w[2] === 0) {
					g_player.y--;
				}
			}
			break;
		case 1: // left
			if (g_player.x > 0) {
				if (g_map.map[g_player.x][g_player.y].w[1] === 0 &&
					g_map.map[g_player.x - 1][g_player.y].w[3] === 0) {
					g_player.x--;
				}
			}
			break;
		case 2: // down
			if (g_player.y < 15) {
				if (g_map.map[g_player.x][g_player.y].w[2] === 0 &&
					g_map.map[g_player.x][g_player.y + 1].w[0] === 0) {
					g_player.y++;
				}
			}
			break;
		case 3: // right
			if (g_player.x < 15) {
				if (g_map.map[g_player.x][g_player.y].w[3] === 0 &&
					g_map.map[g_player.x + 1][g_player.y].w[1] === 0) {
					g_player.x++;
				}
			}
			break;
		default: // nope
			break;
	}
	g_player.map.t[g_player.x][g_player.y] = true;
	return;
}

// direction corresponds to the number on the keypad.
// facing: up - 0, left - 1, down - 2, right - 3
function game_player_move_input(key) {
	var moveArr = null;
	if (key === 98 || key === 83) { // numpad 2, 's' - down
		moveArr = [2, 3, 0, 1];
	} else if (key === 100 || key === 65) { // numpad 4, 'a' - left
		moveArr = [1, 2, 3, 0];
	} else if (key === 102 || key === 68) { // numpad 6, 'd' - right
		moveArr = [3, 0, 1, 2];
	} else if (key === 104 || key === 87) { // numpad 8, 'w' - forward
		moveArr = [0, 1, 2, 3];
	} else if (key === 103 || key === 81) { // numpad 7, 'q' - facing left
		if (g_player.facing === 3) { g_player.facing = 0; }
		else { g_player.facing++; }
	} else if (key === 105 || key === 69) { // numpad 9, 'e' - facing right
		if (g_player.facing === 0) { g_player.facing = 3; }
		else { g_player.facing--; }
	}
	if (moveArr !== null) {
		game_player_move(moveArr[g_player.facing]);
	}
	return;
}

function game_player_fov_line(ox, oy, dir, max) { // draw line from (ox, oy) in dir until max (or hits wall)
	if (dir === 0) { for (var y = oy; y >= 0 && y >= oy - max; y--) { g_player.map.w[ox][y] = true; if (g_map.map[ox][y].w[0] === 1) { return (oy-y); } } }
	if (dir === 1) { for (var x = ox; x >= 0 && x >= ox - max; x--) { g_player.map.w[x][oy] = true; if (g_map.map[x][oy].w[1] === 1) { return (ox-x); } } }
	if (dir === 2) { for (var y = oy; y < 16 && y <= oy + max; y++) { g_player.map.w[ox][y] = true; if (g_map.map[ox][y].w[2] === 1) { return (y-oy); } } }
	if (dir === 3) { for (var x = ox; x < 16 && x <= ox + max; x++) { g_player.map.w[x][oy] = true; if (g_map.map[x][oy].w[3] === 1) { return (x-ox); } } }
	return max;
}

function game_player_fov() {
	var max_x1 = 2;
	var max_x2 = 2;
	var max_y1 = 2;
	var max_y2 = 2;
	g_player.map.t[g_player.x][g_player.y] = true;	// always see your square
	g_player.map.w[g_player.x][g_player.y] = true;
	if (g_player.facing === 0) { // up
		max_y1 = game_player_fov_line(g_player.x, g_player.y, 0, max_y1);
		game_player_fov_line(g_player.x, g_player.y, 1, max_x1);
		game_player_fov_line(g_player.x, g_player.y, 3, max_x2);
		for (var y = g_player.y-1; y >= 0 && y >= g_player.y-max_y1; y--) {
			max_x1 = game_player_fov_line(g_player.x, y, 1, max_x1);
			max_x2 = game_player_fov_line(g_player.x, y, 3, max_x2);
		}
	}

	if (g_player.facing === 1) { // left
		max_x1 = game_player_fov_line(g_player.x, g_player.y, 1, max_x1);
		game_player_fov_line(g_player.x, g_player.y, 0, max_y1);
		game_player_fov_line(g_player.x, g_player.y, 2, max_y2);
		for (var x = g_player.x-1; x >= 0 && x >= g_player.x-max_x1; x--) {
			max_y1 = game_player_fov_line(x, g_player.y, 0, max_y1);
			max_y2 = game_player_fov_line(x, g_player.y, 2, max_y2);
		}
	}

	if (g_player.facing === 2) { // down
		max_y2 = game_player_fov_line(g_player.x, g_player.y, 2, max_y2);
		game_player_fov_line(g_player.x, g_player.y, 1, max_x1);
		game_player_fov_line(g_player.x, g_player.y, 3, max_x2);
		for (var y = g_player.y + 1; y < 16 && y <= g_player.y+max_y2; y++) {
			max_x1 = game_player_fov_line(g_player.x, y, 1, max_x1);
			max_x2 = game_player_fov_line(g_player.x, y, 3, max_x2);
		}
	}

	if (g_player.facing === 3) { // right
		max_x2 = game_player_fov_line(g_player.x, g_player.y, 3, max_x2);
		game_player_fov_line(g_player.x, g_player.y, 0, max_y1);
		game_player_fov_line(g_player.x, g_player.y, 2, max_y2);
		for (var x = g_player.x+1; x < 16 && x <= g_player.x+max_x2; x++) {
			max_y1 = game_player_fov_line(x, g_player.y, 0, max_y1);
			max_y2 = game_player_fov_line(x, g_player.y, 2, max_y2);
		}
	}
	return;
}
