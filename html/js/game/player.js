var g_image_player = [
	"http://twitchexplorer.lordkat.com/beta/images/game/player_up.png",
	"http://twitchexplorer.lordkat.com/beta/images/game/player_left.png",
	"http://twitchexplorer.lordkat.com/beta/images/game/player_down.png",
	"http://twitchexplorer.lordkat.com/beta/images/game/player_right.png"
];

// facing: up - 0, left - 1, down - 2, right - 3
var g_player = {x: 0, y: 5, facing: 3, img: null };

function game_player_init() {
	g_player.img = game_image_load(g_image_player);
}
	
function game_player_draw() {
	g_ctx.drawImage(g_player.img[g_player.facing], (g_player.x*20)+1+g_screenOffset.x, (g_player.y*20)+1+g_screenOffset.y);
	return;
}

function game_player_move(direction) {
	switch (direction) {
		case 0: // up
			if (g_player.y > 0) {
				if (g_map[g_player.x][g_player.y].w[0] === 0 &&
					g_map[g_player.x][g_player.y - 1].w[2] === 0) {
					g_player.y--;
				}
			}
			break;
		case 1: // left
			if (g_player.x > 0) {
				if (g_map[g_player.x][g_player.y].w[1] === 0 &&
					g_map[g_player.x - 1][g_player.y].w[3] === 0) {
					g_player.x--;
				}
			}
			break;
		case 2: // down
			if (g_player.y < 15) {
				if (g_map[g_player.x][g_player.y].w[2] === 0 &&
					g_map[g_player.x][g_player.y + 1].w[0] === 0) {
					g_player.y++;
				}
			}
			break;
		case 3: // right
			if (g_player.x < 15) {
				if (g_map[g_player.x][g_player.y].w[3] === 0 &&
					g_map[g_player.x + 1][g_player.y].w[1] === 0) {
					g_player.x++;
				}
			}
			break;
		default: // nope
			break;
	}
	return;
}

// direction corresponds to the number on the keypad.
// facing: up - 0, left - 1, down - 2, right - 3
function game_player_move_input(key) {
	switch (key) {
		case 50: // numpad 2 - down
			switch (g_player.facing) {
				case 0: game_player_move(2); break;
				case 1: game_player_move(3); break;
				case 2: game_player_move(0); break;
				case 3: game_player_move(1); break;
			}
			break;
		case 52: // numpad 4 - left
			switch (g_player.facing) {
				case 0: game_player_move(1); break;
				case 1: game_player_move(2); break;
				case 2: game_player_move(3); break;
				case 3: game_player_move(0); break;
			}
			break;
		case 54: // numpad 6 - right
			switch (g_player.facing) {
				case 0: game_player_move(3); break;
				case 1: game_player_move(0); break;
				case 2: game_player_move(1); break;
				case 3: game_player_move(2); break;
			}
			break;
		case 55: // numpad 7 - change facing left
			if (g_player.facing === 3) { g_player.facing = 0; }
			else { g_player.facing++; }
			return;
		case 56: // numpad 8 - forward
			switch (g_player.facing) {
				case 0: game_player_move(0); break;
				case 1: game_player_move(1); break;
				case 2: game_player_move(2); break;
				case 3: game_player_move(3); break;
			}
			break;
		case 57: // numpad 9 - change facing right
			if (g_player.facing === 0) { g_player.facing = 3; }
			else { g_player.facing--; }
			return;
		default:
			return;
	}
	return;
}
