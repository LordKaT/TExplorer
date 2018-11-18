$("#vote_skip").click(function(e) {
					e.preventDefault();
					$.ajax({
						url: "vote.php",
						data: {type: "vote_skip"}
					}).done(function(m) {
						var v = $.parseJSON(m);
						$("#vote_skip_count").html("Skip: " + v["vote_skip"]);
						$("#vote_time_count").html("Time: " + v["vote_time"]);
						$("#vote_skip").html("Voted!");
					});
					return false;
				});/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function vote_init() {
	$("#vote_skip").click(function(e) {
		e.preventDefault();
		vote("vote_skip");
		return false;
	});
	$("#vote_time").click(function(e) {
		e.preventDefault();
		vote("vote_time");
		return false;
	});
	return;
}

function vote(vote_type) {
	$.ajax({
		url: "vote.php",
		data: {type: vote_type}
	}).done(function(m) {
		var v = $.parseJSON(m);
		$("#vote_skip_count").html("Skip: " + v["vote_skip"]);
		$("#vote_time_count").html("Time: " + v["vote_time"]);
		$("#" + vote_type).html("Voted!");
	});
	return false;
}
