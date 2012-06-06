/* Hashtags Plugin for Nitro
 * By Jono Cooper & George Czabania
 * Licensed under the BSD License
 */

//Adds as a plugin
plugin.add(function() {

	tags = function(q) {

		var hashTag = new RegExp("\\s#([^ ]*)", "ig");

		console.log(q.replace(hashTag, ' <span class="tag">#$1</span>'));

	};

});