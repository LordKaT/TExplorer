function fetch() {
	var time = new Date().getTime() / 1000;
	time = Math.floor(time);
	$.ajax({
		url: "fetch.php?t=" + time
	}).done(function(msg) {
		stream_array = $.parseJSON(msg);
		if (stream_array["name"] != g_explorer.stream) {
			if (g_explorer.intervall !== null) {
				clearInterval(g_explorer.interval);
			}
			$("#stream_name").html('<a href="http://twitch.tv/' + stream_array["name"] + '" target="_blank">' + stream_array["display_name"] + '</a>');
			$("#twitchStream").attr("src", "http://player.twitch.tv/?channel=" + stream_array["name"]);
			$("#twitchChat").attr("src", "http://www.twitch.tv/" + stream_array["name"] + "/chat");
			$("#vote_skip").html("[Skip]");
			$("#vote_time").html("[Time]");
			g_explorer.stream = stream_array["name"];
			g_explorer.timer = stream_array["ttl"];
			g_explorer.timeEnd = ServerDate + (stream_array["ttl"] * 1000);
			
			g_explorer.interval = setInterval(function () {
				g_explorer.timer = Math.round((g_explorer.timeEnd - ServerDate) / 1000);
				if (g_explorer.timer <= 0) {
					$("#ttl").html("Vortex Jump");
				} else if (g_explorer.timer <= 60) {
					$("#ttl").html("Vortex Active");
				} else if (g_explorer.timer <= 150) {
					$("#ttl").html("Vortex Building");
				} else {
					$("#ttl").html("Vortex Closed");
				}
				return;
			}, 1000);
			if (g_twitch.auth === true) {
				Twitch.api({method: "/users/" + g_twitch.user + "/follows/channels/" + g_explorer.stream}, function(error, follows) {
					if (error !== null) {
						g_twitch.following = false;
						$("#twitch_follow").html("Follow");
					} else {
						$("#twitch_follow").html("Followed!");
					}
					return;
				});
			}
		}
		if (stream_array["vote_time"] === 0) {
			$("#vote_time").html("[Time]");
		}
		g_explorer.timeEnd = ServerDate + (stream_array["ttl"] * 1000);
		$("#users_count").html("Users: " + stream_array["users_count"]);
		$("#vote_skip_count").html("Skip: " + stream_array["vote_skip"]);
		$("#vote_time_count").html("Time: " + stream_array["vote_time"]);
		setTimeout(fetch, 3000);
	});
	return;
}
