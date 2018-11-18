function game_map_init() {
	for (var x = 0; x < 16; x++) {
		for (var y = 0; y < 16; y++) {
			g_map.map[x] = (typeof g_map.map[x] !== undefined && g_map.map[x] instanceof Array) ? g_map.map[x] : [];
			g_player.map.t[x] = (typeof g_player.map.t[x] !== undefined && g_player.map.t[x] instanceof Array) ? g_player.map.t[x] : [];
			g_player.map.w[x] = (typeof g_player.map.w[x] !== undefined && g_player.map.w[x] instanceof Array) ? g_player.map.w[x] : [];
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
			g_map.map[x][y] = { t: 0, w: [wallUp, wallLeft, wallDown, wallRight], o: [] };
			g_player.map.t[x][y] = false;
			g_player.map.w[x][y] = false;
		}
	}

	for (var x = 0; x < 16; x++) {
		for (var y = 0; y < 16; y++) {
			if (x-1 >= 0) {
				if (g_map.map[x][y].w[1] === 1) {
					g_map.map[x-1][y].w[3] = 1;
				}
			}
			if (x+1 < 16) {
				if (g_map.map[x][y].w[3] === 1) {
					g_map.map[x+1][y].w[1] = 1;
				}
			}
			if (y-1 >= 0) {
				if (g_map.map[x][y].w[0] === 1) {
					g_map.map[x][y-1].w[2] = 1;
				}
			}
			if (y+1 < 16) {
				if (g_map.map[x][y].w[2] === 1) {
					g_map.map[x][y+1].w[0] = 1;
				}
			}
		}
	}

	g_map.name = "Welcome Explorer!";
	g_map.bgColor = "rgb(255, 255, 255)";
	return;
}

function game_map_draw() {
	g_gameEngine.ctx.strokeStyle = "rgb(0, 0, 0)";
	game_player_fov();
	for (var x = 0; x < 16; x++) {
		for (var y = 0; y < 16; y++) {
			if (g_player.map.t[x][y] === true) {
				g_gameEngine.ctx.drawImage(g_tiles[g_map.map[x][y].t], x*20 + g_gameEngine.screen_offset.x, y*20 + g_gameEngine.screen_offset.y);
			}
		}
	}
	for (var x = 0; x < 16; x++) {
		for (var y = 0; y < 16; y++) {
			if (g_player.map.w[x][y] === true) {
				if (g_map.map[x][y].w[0] === 1) { game_line(x*20 + g_gameEngine.screen_offset.x, y*20 + g_gameEngine.screen_offset.y, 20, 0); }
				if (g_map.map[x][y].w[1] === 1) { game_line(x*20 + g_gameEngine.screen_offset.x, y*20 + g_gameEngine.screen_offset.y, 0, 20); }
				if (g_map.map[x][y].w[2] === 1) { game_line(x*20 + g_gameEngine.screen_offset.x, y*20 + 20 + g_gameEngine.screen_offset.y, 20, 0); }
				if (g_map.map[x][y].w[3] === 1) { game_line(x*20 + 20 + g_gameEngine.screen_offset.x, y*20 + g_gameEngine.screen_offset.y, 0, 20); }
			}
		}
	}
	return;
}
