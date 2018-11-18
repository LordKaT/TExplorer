<?php

require_once("/home/twitchexplorer/api/meekrodb/meekrodb.2.3.php");
require_once("/home/twitchexplorer/api/config.php");

$type = filter_input(INPUT_GET, "type");
$addr = filter_input(INPUT_SERVER, "REMOTE_ADDR");

if ($type === "vote_skip") {
	$ret = DB::query("SELECT * FROM vote_skip WHERE addr=%s", $addr);
	if (empty($ret)) {
		DB::insert("vote_skip", array("addr" => $addr));
	}
}

else if ($type === "vote_time") {
	$ret = DB::query("SELECT * FROM vote_time WHERE addr=%s", $addr);
	if (empty($ret)) {
		DB::insert("vote_time", array("addr" => $addr));
	}
}

else {
	exit;
}

$retVoteSkip = DB::query("SELECT COUNT(*) FROM vote_skip");
$retVoteTime = DB::query("SELECT COUNT(*) FROM vote_time");
if (empty($retUsers)) { $users = 0; }
else { $users = $retUsers[0]["COUNT(*)"]; }
if (empty($retVoteSkip)) { $vote_skip = 0; }
else { $vote_skip = $retVoteSkip[0]["COUNT(*)"]; }
if (empty($retVoteTime)) { $vote_time = 0; }
else { $vote_time = $retVoteTime[0]["COUNT(*)"]; }

echo json_encode(array("vote_skip" => $vote_skip, "vote_time" => $vote_time));
