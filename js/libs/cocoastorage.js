(function($) {

	json_encode = $.toJSON || Object.toJSON || (window.JSON && (JSON.encode || JSON.stringify)),

    /* function to decode objects from JSON strings */
    json_decode = $.evalJSON || (window.JSON && (JSON.decode || JSON.parse)) || function(str){
        return String(str).evalJSON();
    }

	$.jStorage = {
		get: function(name, def) {

			// Get data from Cocoa
			Cocoa.log('get|' + name);

			// If key doesn't have any data assigned to it return the default value (if assigned)
			if(xcode == "(null)" && typeof def != undefined) { 
				return def;
			} else {
				return json_decode(xcode);
			}
		},
		set: function(key, value) {
			Cocoa.log('set|' + key + '|' + json_encode(value));
		}
	}
})(jQuery);