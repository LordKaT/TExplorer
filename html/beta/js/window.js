function window_init() {
	$(window).on("resize", function() {
		window_resize();
	});
	$(window).load(function() {
		game_draw();
	});
	$(document).ready(function() {
		vote_init();
		game_init();
		twitch_init();
		window_resize();
		fetch();
		return;
	});

	return;
}

function window_resize() {
	var width_pct = $(window).width() * 0.20;
	var width = $(window).width() - width_pct;
	var height = Math.round((width/16)*9);
	$("#twitchStream").width(width);
	$("#twitchStream").height(height);
	var cw = Math.round(width_pct);
	var ch = Math.round(height/2);
	if (cw % 2 !== 0) { cw = cw - 1; }
	if (ch % 2 !== 0) { ch = ch - 1; }
	$("#twitchGame").width(cw);
	$("#twitchGame").height(ch);
	$("#twitchChat").width(width_pct);
	$("#twitchChat").height(height/2);
	return;
}
