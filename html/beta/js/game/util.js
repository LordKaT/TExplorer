function game_util_rect_round(x, y, width, height, radius, fill, stroke) {
	if (typeof stroke == "undefined") { stroke = true; }
	if (typeof radius === "undefined") { radius = 5; }
	if (typeof radius === "number") {
		radius = {tl: radius, tr: radius, br: radius, bl: radius};
	} else {
		var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
		for (var side in defaultRadius) {
			radius[side] = radius[side] || defaultRadius[side];
		}
	}
	g_gameEngine.ctx.beginPath();
	g_gameEngine.ctx.moveTo(x + radius.tl, y);
	g_gameEngine.ctx.lineTo(x + width - radius.tr, y);
	g_gameEngine.ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
	g_gameEngine.ctx.lineTo(x + width, y + height - radius.br);
	g_gameEngine.ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
	g_gameEngine.ctx.lineTo(x + radius.bl, y + height);
	g_gameEngine.ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
	g_gameEngine.ctx.lineTo(x, y + radius.tl);
	g_gameEngine.ctx.quadraticCurveTo(x, y, x + radius.tl, y);
	g_gameEngine.ctx.closePath();
	if (fill) { g_gameEngine.ctx.fill(); }
	if (stroke) { g_gameEngine.ctx.stroke(); }
	return;
}

 function game_util_text_wrap(text, x, y, maxWidth, lineHeight) {
	var cars = text.split("\n");
	for (var ii = 0; ii < cars.length; ii++) {
		var line = "";
		var words = cars[ii].split(" ");
		for (var n = 0; n < words.length; n++) {
			var testLine = line + words[n] + " ";
			var metrics = g_gameEngine.ctx.measureText(testLine);
			var testWidth = metrics.width;
			if (testWidth > maxWidth) {
				g_gameEngine.ctx.fillText(line, x, y);
				line = words[n] + " ";
				y += lineHeight;
			} else { line = testLine; }
		}
		g_gameEngine.ctx.fillText(line, x, y);
		y += lineHeight;
	}
	return;
}
