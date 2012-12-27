/*
 * jQuery i18n plugin
 * @requires jQuery v1.1 or later
 *
 * See http://recursive-design.com/projects/jquery-i18n/
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Version: 0.9.2 (201204070102)
 */
 (function($) {
/**
 * i18n provides a mechanism for translating strings using a jscript dictionary.
 *
 */


/*
 * i18n property list
 */
$.i18n = {
	
	dict: null,
	
/**
 * setDictionary()
 * Initialise the dictionary and translate nodes
 *
 * @param property_list i18n_dict : The dictionary to use for translation
 */
	setDictionary: function(i18n_dict) {
		this.dict = i18n_dict;
	},
	
/**
 * _()
 * The actual translation function. Looks the given string up in the 
 * dictionary and returns the translation if one exists. If a translation 
 * is not found, returns the original word
 *
 * @param string str : The string to translate 
 * @param property_list params : params for using printf() on the string
 * @return string : Translated word
 *
 */
	_: function (str, params) {
		var transl = str;
		if (this.dict && this.dict[str]) {
			transl = this.dict[str];
		}
		return this.printf(transl, params);
	},
	
/**
 * toEntity()
 * Change non-ASCII characters to entity representation 
 *
 * @param string str : The string to transform
 * @return string result : Original string with non-ASCII content converted to entities
 *
 */
	toEntity: function (str) {
		var result = '';
		for (var i=0;i<str.length; i++) {
			if (str.charCodeAt(i) > 128)
				result += "&#"+str.charCodeAt(i)+";";
			else
				result += str.charAt(i);
		}
		return result;
	},
	
/**
 * stripStr()
 *
 * @param string str : The string to strip
 * @return string result : Stripped string
 *
 */
 	stripStr: function(str) {
		return str.replace(/^\s*/, "").replace(/\s*$/, "");
	},
	
/**
 * stripStrML()
 *
 * @param string str : The multi-line string to strip
 * @return string result : Stripped string
 *
 */
	stripStrML: function(str) {
		// Split because m flag doesn't exist before JS1.5 and we need to
		// strip newlines anyway
		var parts = str.split('\n');
		for (var i=0; i<parts.length; i++)
			parts[i] = stripStr(parts[i]);
	
		// Don't join with empty strings, because it "concats" words
		// And strip again
		return stripStr(parts.join(" "));
	},

/*
 * printf()
 * C-printf like function, which substitutes %s with parameters
 * given in list. %%s is used to escape %s.
 *
 * Doesn't work in IE5.0 (splice)
 *
 * @param string S : string to perform printf on.
 * @param string L : Array of arguments for printf()
 */
	printf: function(S, L) {
		if (!L) return S;

		var nS     = "";
		var search = /%(\d+)\$s/g;
		// replace %n1$ where n is a number
		while (result = search.exec(S)) {
			var index = parseInt(result[1], 10) - 1;
			S = S.replace('%' + result[1] + '\$s', (L[index]));
			L.splice(index, 1);
		}
		var tS = S.split("%s");

		if (tS.length > 1) {
			for(var i=0; i<L.length; i++) {
				if (tS[i].lastIndexOf('%') == tS[i].length-1 && i != L.length-1)
					tS[i] += "s"+tS.splice(i+1,1)[0];
				nS += tS[i] + L[i];
			}
		}
		return nS + tS[tS.length-1];
	}

};

/*
 * _t
 * Allows you to translate a jQuery selector
 *
 * eg $('h1')._t('some text')
 * 
 * @param string str : The string to translate 
 * @param property_list params : params for using printf() on the string
 * @return element : chained and translated element(s)
*/
$.fn._t = function(str, params) {
  return $(this).text($.i18n._(str, params));
};


})(jQuery);
