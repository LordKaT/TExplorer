<?php

define("BUILD_DATE",	"03/24/16");

foreach(glob('TwitchSDK/*.php') as $file) {
     require_once($file);
}

foreach(glob('TwitchSDK/Methods/*.php') as $file) {
     require_once($file);
}

require_once("meekrodb/meekrodb.2.3.php");
require_once("config.php");

use \jofner\SDK\TwitchTV\TwitchSDK;
use \jofner\SDK\TwitchTV\TwitchException;

$twitch_config = array(
					"client_id" => "",
					"client_secret" => "",
					"redirect_uri" => "http://twitchexplorer.lordkat.com/index.php");

$twitch = new TwitchSDK($twitch_config);

function dbprint($msg) {
	echo $msg . "\r\n";
	return;
}

dbprint("Twitch Explorer Prototype");
dbprint("Build: " . BUILD_DATE);
dbprint("Running ...");

mt_srand(time());

$resultsTotal = 0;
$g_running = true;
$g_apiFail = false;

// The TWitch API is stupid. --JP

function get_stream($twitch) {
	GLOBAL $g_apiFail;
	$language = "";
	dbprint("get_stream");
	while ($language !== "en" || $failcount == 5) {
		$retCount = DB::query("SELECT COUNT(*) FROM keywords");
		$retKeyword = DB::query("SELECT * FROM keywords");

		while (!isset($search->_total)) { // Sometimes Twitch returns results without _total. Fuck those results.
			$rand = mt_rand(0, $retCount[0]["COUNT(*)"]-1);
			$keyword = $retKeyword[$rand]["keyword"];
			$search = $twitch->streamSearch($keyword, 10);
			if (isset($search->status)) { // oddly enough this isn't set when things are ok.
				if ($search->status === 503 && $g_apiFail === false) {
					$g_apiFail = true;
					dbprint("API FAIL");
					DB::insert("channels", array(
						"name" => "smitten",
						"display_name" => "ERR: Twitch API Down",
						"ttl" => 300));
					return;
				}
				if ($search->status !== 503 && $g_apiFail === true) {
					dbprint("API OK");
					$g_apiFail = false;
				}
			} else { // Twitch thinks not sending "status" consistently is good.
				$g_apiFail = false;
			}
		}

		dbprint("Searching for stream...");
		dbprint("Keyword: " . $keyword);
		$randOffset = mt_rand(0, $search->_total);
		$off = ($search->_total - $randOffset);
		$randStream = mt_rand(0, (($off > 9) ? 9 : $off));
		$search = $twitch->streamSearch($keyword, 10, $randOffset);
		dbprint("\trandOffset: " . $randOffset);
		dbprint("\toff: " . $off);
		dbprint("\trandStream: " . $randStream);

		$failcount = 0;
		while (!isset($search->streams[$randStream])) {
			dbprint("No stream found, continuing ...");
			$randOffset = mt_rand(0, $search->_total);
			$off = ($search->_total - $randOffset);
			$randStream = mt_rand(0, (($off > 9) ? 9 : $off));
			$search = $twitch->streamSearch($keyword, 10, $randOffset);
			dbprint("\trandOffset: " . $randOffset);
			dbprint("\toff: " . $off);
			dbprint("\trandStream: " . $randStream);
			$failcount++;
			if ($failcount == 5) {
				dbprint("Failed to get stream.");
				break;
			}
		}
		$retBL = DB::query("SELECT * FROM blacklist WHERE channel=%s", $search->streams[$randStream]->channel->name);
		if (!empty($retBL)) {
			dbprint("\tChannel Blackliasted: " . $search->streams[$randStream]->channel->name);
			continue;
		}
		$language = $search->streams[$randStream]->channel->language;
		dbprint("\tLanguage: " . $language);
	}
	dbprint("Got stream: " . $search->streams[$randStream]->channel->display_name);
	dbprint("\tLanguage: " . $search->streams[$randStream]->channel->language);
	dbprint("\tKeyword: " . $keyword);
	dbprint("\tTotal: " . $search->_total);
	dbPrint("\trandStream: " . $randStream);
	DB::insert("channels", array(
		"name" => (string)$search->streams[$randStream]->channel->name,
		"display_name" => (string)$search->streams[$randStream]->channel->display_name,
		"logo" => (string)$search->streams[$randStream]->channel->logo,
		"game" => (string)$search->streams[$randStream]->channel->game,
		"ttl" => 300,
		"time_added" => 0));
	DB::query("TRUNCATE vote_skip");
	DB::query("TRUNCATE vote_time");
	return;
}

function check_stream($twitch, $channel) {
	$search = $twitch->streamGet($channel);
	if (!isset($search->stream) || $search->stream === null || $search->stream === "null" || $search->stream === "Not Found") {
		dbprint("Stream offline: " . $channel);
		DB::delete("channels", "name=%s", $channel);
		get_stream($twitch);
		sleep(1);
	}
	return;
}

function check_users_active() {
	$time_exp = time() - 60;
	$ret = DB::query("SELECT * FROM users_active WHERE time < %i", $time_exp);
	foreach	($ret as $expired) {
		DB::delete("users_active", "addr=%s", $expired["addr"]);
	}
	return;
}

function calculate_votes($vote_table, $pct_win) {
	$retVotes = DB::query("SELECT COUNT(*) FROM " . $vote_table);
	$retUsers = DB::query("SELECT COUNT(*) FROM users_active");
	$votes = (int)$retVotes[0]["COUNT(*)"];
	$users = (int)$retUsers[0]["COUNT(*)"];

	if ($users === 0) { // how the fuck?
		return false;
	}

	if ($votes === 0) { // ok ignore this
		return false;
	}

	$pct = (int)(($votes / $users) * 100);
	if ($pct >= $pct_win) {
		return true;
	}
	return false;
}

while ($g_running) {
	try {
		$ret = DB::query("SELECT * FROM channels");
		if (empty($ret)) {
			dbprint("Empty table, fetching stream...");
			get_stream($twitch);
			sleep(1);
			continue;
		}

		if ($g_apiFail === true) {
			dbprint("API Sleep ...");
			get_stream($twitch);
			sleep(5);
			continue;
		}

		check_stream($twitch, $ret[0]["name"]);
		check_users_active();

		if ($ret[0]["ttl"] <= 0) { // switch streams
			dbprint("Vortex Jump!");
			get_stream($twitch);
			DB::delete("channels", "name=%s", $ret[0]["name"]);
			sleep(1);
			continue;
		}

		DB::update("channels", array("ttl" => $ret[0]["ttl"] - 1), "name=%s", $ret[0]["name"]);

		if (calculate_votes("vote_skip", 55) === true) {
			dbprint("vote_skip");
			DB::update("channels", array("ttl" => 0), "name=%s", $ret[0]["name"]);
			DB::query("TRUNCATE vote_skip");
		}
		if (calculate_votes("vote_time", 55) === true) {
			if ($ret[0]["ttl"] < 60 && $ret[0]["time_added"] < 300) {
				dbprint("vote_time");
				DB::update("channels", array("ttl" => $ret[0]["ttl"] + 60), "name=%s", $ret[0]["name"]);
				DB::update("channels", array("time_added" => $ret[0]["time_added"] + 60), "name=%s", $ret[0]["name"]);
				DB::query("TRUNCATE vote_time");
			}
		}
		sleep(1);
	} catch (Exception $e) {
		dbprint("Exception: " . $e->getMessage());
	}
}
