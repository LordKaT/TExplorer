<!DOCTYPE html>
<html>
	<head>
		<title>Twitch Explorer</title>
		<link rel="stylesheet" type="text/css" href="css/style.css">
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
		<script src="js/lib/ServerDate.js"></script>
		<script src="js/lib/twitch/twitch.core.js"></script>
		<script src="js/lib/twitch/twitch.init.js"></script>
		<script src="js/lib/twitch/twitch.auth.js"></script>
		<script src="js/lib/twitch/twitch.events.js"></script>
		<script src="js/lib/twitch/twitch.storage.js"></script>
		<script src="js/globals.js"></script>
		<script src="js/fetch.js"></script>
		<script src="js/vote.js"></script>
		<script src="js/twitch.js"></script>
		<script src="js/window.js"></script>

		<script src="js/game/util.js"></script>
		<script src="js/game/image.js"></script>
		<script src="js/game/dialog.js"></script>
		<script src="js/game/player.js"></script>
		<script src="js/game/map.js"></script>
		<script src="js/game/game.js"></script>
		<script>
			window_init();
		</script>
	</head>
	<body>
		<div id="header">
			<img src="twitchExplorer_sm.png" id="dr_dino" style="float: left; height: 75px;" />
			<div id="stream_name"></div>
			<div id="twitch_follow" hidden>Follow</div>
			<div id="ttl"></div>
			<div id="users_count"></div>
			<div id="vote_skip_count"></div>
			<a href="" id="vote_skip">[Skip]</a>
			<div id="vote_time_count"></div>
			<a href="" id="vote_time">[Time]</a>
			<img src="http://ttv-api.s3.amazonaws.com/assets/connect_dark.png" class="twitch-connect" href="#" />
		</div>
		<br clear="both" />
		<iframe 
			id="twitchStream"
			src=""
			width="1280"
			height="720"
			frameborder="0"
			scrolling="no"
			allowfullscreen="true">
		</iframe>
		<canvas
			id="twitchGame"
			width="400"
			height="360">
		</canvas>
		<iframe
			id="twitchChat"
			src=""
			width="400"
			height="360"
			frameborder="0"
			scrolling="no"
			allowfullscreen="false">
		</iframe>
	</body>
</html>
