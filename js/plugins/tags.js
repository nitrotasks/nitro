/* Hashtags Plugin for Nitro
 * By Jono Cooper & George Czabania
 * Licensed under the BSD License
 */

//Adds as a plugin
plugin.add(function() {
	
	$('#tasks .taskContent li .content').on('create', function() {
		var text = $(this).text();
		console.log("hello")
	});

	textToTag = function(q) {

		var hashTag = new RegExp("\\s#([^ ]*)", "ig");

		return q.replace(hashTag, ' <span class="tag">#$1</span>');

	};

});