plugin.add(function() {
	
	plugin.url = function(text) {
		return {
			toHTML: function() {
				var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
				return text.replace(exp,'<a target=_blank href=$1>$1</a>');
			},
			toText: function() {
				var exp = /<a\b[^>]*>(.*?)<\/a>/ig;
				return text.replace(exp, '$1');
			}
		}
	}
})