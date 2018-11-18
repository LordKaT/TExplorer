<?php
require_once("../../api/meekrodb/meekrodb.2.3.php");
require_once("../../api/config.php");

$b_login = true;

// validate user
$cookie_username = filter_input(INPUT_COOKIE, "username");
$cookie_userid = filter_input(INPUT_COOKIE, "user_id");
$server_addr = filter_input(INPUT_SERVER, "REMOTE_ADDR");

if (!empty($cookie_username)) {
	$ret = DB::query("SELECT * FROM users WHERE username=%s", $cookie_username);

	if (!empty($ret)) {
		$user_data = json_decode($ret[0]["data"], true);
		if ($user_data["addr"] === $server_addr && $user_data["user_id"] === $cookie_userid) {
			$b_login = false;
			setcookie("username", $user_data["username"], time() + 3600);
			setcookie("user_id", $user_data["user_id"], time() + 3600);
		} else {
			setcookie("username", "", time() - 3600);
			setcookie("user_id", "", time() - 3600);
		}
	}
}

$action = filter_input(INPUT_POST, "action");

if ($action === "login") {
	if ($b_login) {
		$login_username = filter_input(INPUT_POST, "login_username");
		$login_password = filter_input(INPUT_POST, "login_password");
		$ret = DB::query("SELECT * FROM users WHERE username=%s", $login_username);
		if (!empty($ret)) {
			if (password_verify($login_password, $ret[0]["password"])) {
				$b_login = false;
				$user_data = array(
					"username" => $ret[0]["username"],
					"user_id" => uniqid(),
					"addr" => filter_input(INPUT_SERVER, "REMOTE_ADDR")
				);
				setcookie("username", $user_data["username"], time() + 3600);
				setcookie("user_id", $user_data["user_id"], time() + 3600);
				DB::update("users", array("data" => json_encode($user_data)), "id=%s", $ret[0]["id"]);
			}
		}
	}
}

if ($action === "skip") {
	if (!$b_login) {
		$ret = DB::query("SELECT * FROM channels");
		DB::update("channels", array("ttl" => 0), "name=%s", $ret[0]["name"]);
		echo json_encode(array("error" => 0));
		exit;
	}
}

if ($action === "fetch") {
	if (!$b_login) {
		$users = 0;
		$votes = 0;
		$retUsers = DB::query("SELECT COUNT(*) FROM users_active");
		$retVoteSkip = DB::query("SELECT COUNT(*) FROM vote_skip");
		if (empty($retUsers)) { $users = 0; }
		else { $users = $retUsers[0]["COUNT(*)"]; }
		if (empty($retVoteSkip)) { $vote = 0; }
		else { $vote = $retVoteSkip[0]["COUNT(*)"]; }
		echo json_encode(array("users_count" => $users, "vote_count" => $vote));
		exit;
	}
}

if ($action === "blacklist") {
	if (!$b_login) {
		$ret = DB::query("SELECT * FROM channels");
		DB::update("channels", array("ttl" => 0), "name=%s", $ret[0]["name"]);
		DB::insert("blacklist", array("channel" => $ret[0]["name"]));
		echo json_encode(array("error" => 0));
		exit;
	}
}

?>
<html>
	<head>
		<title>TwitchExplorer Admin</title>
	</head>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
	<script>
		function fetch() {
			$.ajax({
				method: "POST",
				url: "index.php",
				data: {action: "fetch"},
				cache: false
			}).done(function(msg) {
				data = $.parseJSON(msg);
				$("#user_count").html("Users: " + data["users_count"]);
				$("#vote_count").html("Votes: " + data["vote_count"]);
				return;
			});
			setTimeout(fetch, 1000);
			return;
		}

	function admin(action, data) {
		$.ajax({
			method: "POST",
			url: "index.php",
			cache: false,
			data: {action: action, data: data}
		}).done(function(msg) {
			return;
		});
		return;
	}

		$(document).ready(function() {
			fetch();
			$("#admin_skip").click(function(e) {
				e.preventDefault();
				admin("skip", null);
				return false;
			});
		});
	</script>
	<style>
		#user_count {
			margin-right: 10px;
		}
		#vote_count {
			margin-right: 10px;
		}
	</style>
	<body>
		<?php if ($b_login === true) { ?>
		You need to log in first.<br />
		<form action="index.php?action=login" method="POST">
			<input type="hidden" name="action" value="login" />
			<input type="text" name="login_username" placeholder="Username" /><br />
			<input type="password" name="login_password" placeholder="Password" /><br />
			<input type="Submit" />
		</form>
		<?php } else { ?>
		<div id="user_count" style="float: left;"></div> <div id="vote_count" style="float: left;"></div> <div style="float: left;"><a href="#" id="admin_skip">Skip</a></div>
		<?php } ?>
	</body>
</html>
