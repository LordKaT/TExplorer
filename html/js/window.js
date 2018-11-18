function window_init() {
	$(window).on("resize", function() {
		window_resize();
	});
	$(window).load(function() {
	//	game_draw();
	});
	$(document).ready(function() {
		Twitch.init({clientId: 'd8lqzbfutdq3y4r2mah3m9jioa8xklx'}, function(error, status) {
			if (status.authenticated === true) {
				Twitch.api({method: "user"}, function(error, user) {
					g_twitch.auth = true;
					g_twitch.user = user.name;
					$(".twitch-connect").hide();
					$("#twitch_follow").show();
					Twitch.api({method: "/users/" + g_twitch.user + "/follows/channels/" + g_explorer.stream}, function(error, follows) {
						if (error === null) {
							g_twitch.following = true;
							$("#twitch_follow").html("Followed!");
						} else {
							g_twitch.following = false;
							$("#twitch_follow").html("Follow");
						}
						return;
					});
					return;
				});
			}
			return;
		});
		vote_init();
		//game_init();
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
//	$("#twitchGame").width(cw);
//	$("#twitchGame").height(ch);
	$("#twitchChat").width(width_pct);
	$("#twitchChat").height(height);
	return;
}

function twitch_init() {
	$(".twitch-connect").click(function() {
		Twitch.login({scope: ["user_read", "user_follows_edit"] });
	});

	$("#twitch_follow").click(function(e) {
		e.preventDefault();
		if (g_twitch.following === false) {
			Twitch.api({method: "/users/" + g_twitch.user + "/follows/channels/" + g_explorer.stream, verb: "PUT"}, function(error, follows) {
				g_twitch.following = true;
				$("#twitch_follow").html("Followed!");
				return;
			});
		}
		return false;
	});

	if (g_twitch.auth === true) {
		$(".twitch-connect").hide();
		$("#twitch_follow").show();
	}
	return;
}
