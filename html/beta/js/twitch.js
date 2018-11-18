function twitch_init() {
	Twitch.init({clientId: 'ncpc2ivh5uyugk7lad4bm1wl4ouihkj'}, function(error, status) {
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
