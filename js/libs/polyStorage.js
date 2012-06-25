/* polyStorage
 *
 * Copyright (C) 2012 Caffeinated Code <http://caffeinatedco.de>
 * Copyright (C) 2012 Jono Cooper
 * Copyright (C) 2012 George Czabania
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 * Neither the name of Caffeinated Code nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
(function($) {

	var app = app || 'js';
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
				if (localStorage[name] == undefined) {
					return def;
				} else {
					return json_decode(localStorage[name]);	
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
				localStorage[key] = json_encode(value);
			}
		}
	}
})(jQuery);