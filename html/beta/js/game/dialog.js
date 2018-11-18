function game_dialog(text) {
	g_gameEngine.dialog = text;
	g_gameEngine.mode = "dialog";
	return;
}

function game_dialog_draw() {
	g_gameEngine.ctx.beginPath();
	g_gameEngine.ctx.rect(25, 40, 370, 315);
	g_gameEngine.ctx.fillStyle = "rgb(0, 0, 0)";
	g_gameEngine.ctx.fill();
	
	g_gameEngine.ctx.beginPath();
	g_gameEngine.ctx.rect(10, 25, 370, 315);
	g_gameEngine.ctx.fillStyle = "#aaaaaa";
	g_gameEngine.ctx.fill();
	g_gameEngine.ctx.lineWidth = 5;
	g_gameEngine.ctx.strokeStyle = "#555555";
	g_gameEngine.ctx.stroke();

	g_gameEngine.ctx.lineWidth = 1;
	g_gameEngine.ctx.fillStyle = "rgb(0, 0, 0)";
	g_gameEngine.ctx.strokeStyle = "rgb(255, 255, 255)";
	g_gameEngine.ctx.textAlign = "start";
	game_util_text_wrap(g_gameEngine.dialog, 15, 25, 320, 20);
	game_util_text_wrap("[ENTER] to continue.", 15, 315, 320, 20);
}

function game_dialog_input(key) {
	if (key === 13) {
		g_gameEngine.mode = "dungeon";
	}
	return;
}
