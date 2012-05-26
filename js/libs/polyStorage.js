(function($) {

		var json_encode = $.toJSON || Object.toJSON || (window.JSON && (JSON.encode || JSON.stringify)),

	    /* function to decode objects from JSON strings */
	    json_decode = $.evalJSON || (window.JSON && (JSON.decode || JSON.parse)) || function(str){
	        return String(str).evalJSON();
	    }

	    function escapeObj(obj) {

			//Regexes a bunch of shit that breaks the Linux & Mac versions
			function escapeStr(str) {
				if (typeof str === 'string') {
					str = str.replace(/\\/g, "&#92;") // Backslash
					.replace(/\|/g, "&#124") // Pipe
					.replace(/\"/g, "&#34;") // Quote
					.replace(/\'/g, "&#39;"); // Apostrophe
					return str;
				} else {
					return str;
				}
			}

			//Because typeof is useless here
			function isArray(obj) {
				return obj.constructor == Array;
			}

			var out = {};

			for (var key in obj) {
				if (typeof obj[key] === 'object' && isArray(obj[key]) == false) {
					out[key] = escapeObj(obj[key]);
				} else {
					out[key] = escapeStr(obj[key]);
				}
			}
			return out;
		}

		$.polyStorage = {
			get: function(name, def) {

				if (app == 'python') {
					// Get data from Python
					document.title = 'null';
					document.title = 'get|' + name;

					// If key doesn't have any data assigned to it return the default value (if assigned)
					if(xcode == "(null)" && typeof def != undefined) { 
						return def;
					} else {
						return json_decode(xcode);
					}
				} else {
					if (localStorage[key] == undefined) {
						return def;
					} else {
						return json_decode(localStorage[key]);	
					}
				}
				
			},
			set: function(key, value) {

				if (app == 'python') {
					//Removes Pipes
					value = json_encode(value);

					document.title = 'null';
					document.title = 'set|' + key + '|' + value.replace(/\\n/g, '\\\\n');
				} else {
					localStorage[key] = json_encode(escapeObj(value));
				}
			}
		}
	})(jQuery);