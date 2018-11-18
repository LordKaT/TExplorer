<?php

require_once("/home/twitchexplorer/api/meekrodb/meekrodb.2.3.php");
require_once("/home/twitchexplorer/api/config.php");

$addr = filter_input(INPUT_SERVER, "REMOTE_ADDR");
$ret = DB::query("SELECT * FROM users_active WHERE addr=%s", $addr);
if (empty($ret)) {
	DB::insert("users_active", array("addr" => $addr, "time" => time()));
} else {
	DB::update("users_active", array("time" => time()), "addr=%s", $addr);
}

$users = 0;
$vote_skip = 0;
$vote_time = 0;
$ret = DB::query("SELECT * FROM channels");
$retUsers = DB::query("SELECT COUNT(*) FROM users_active");
$retVoteSkip = DB::query("SELECT COUNT(*) FROM vote_skip");
$retVoteTime = DB::query("SELECT COUNT(*) FROM vote_time");
if (empty($retUsers)) { $users = 0; }
else { $users = $retUsers[0]["COUNT(*)"]; }
if (empty($retVoteSkip)) { $vote_skip = 0; }
else { $vote_skip = $retVoteSkip[0]["COUNT(*)"]; }
if (empty($retVoteTime)) { $vote_time = 0; }
else { $vote_time = $retVoteTime[0]["COUNT(*)"]; }

$ret[0]["users_count"] = $users;
$ret[0]["vote_skip"] = $vote_skip;
$ret[0]["vote_time"] = $vote_time;

echo json_encode($ret[0]);
