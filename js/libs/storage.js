/* Nitro localStorage to Python
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

if (app == 'python') {
	(function($) {

		json_encode = $.toJSON || Object.toJSON || (window.JSON && (JSON.encode || JSON.stringify)),

	    /* function to decode objects from JSON strings */
	    json_decode = $.evalJSON || (window.JSON && (JSON.decode || JSON.parse)) || function(str){
	        return String(str).evalJSON();
	    }

		$.jStorage = {
			get: function(name, def) {

				// Get data from Python
				document.title = 'null';
				document.title = 'get|' + name;

				// If key doesn't have any data assigned to it return the default value (if assigned)
				if(xcode == "(null)" && typeof def != undefined) { 
					return def;
				} else {
					return json_decode(xcode);
				}
			},
			set: function(key, value) {
				//Removes Pipes
				value = json_encode(value);

				document.title = 'null';
				document.title = 'set|' + key + '|' + value.replace(/\\n/g, '\\\\n');
			}
		}
	})(jQuery);
} else {
	(function(g){function m(){if(e.jStorage)try{c=n(""+e.jStorage)}catch(a){e.jStorage="{}"}else e.jStorage="{}";j=e.jStorage?(""+e.jStorage).length:0}function h(){try{e.jStorage=o(c),d&&(d.setAttribute("jStorage",e.jStorage),d.save("jStorage")),j=e.jStorage?(""+e.jStorage).length:0}catch(a){}}function i(a){if(!a||"string"!=typeof a&&"number"!=typeof a)throw new TypeError("Key name must be string or numeric");if("__jstorage_meta"==a)throw new TypeError("Reserved key name");return!0}function k(){var a,
	b,d,e=Infinity,f=!1;clearTimeout(p);if(c.__jstorage_meta&&"object"==typeof c.__jstorage_meta.TTL){a=+new Date;d=c.__jstorage_meta.TTL;for(b in d)d.hasOwnProperty(b)&&(d[b]<=a?(delete d[b],delete c[b],f=!0):d[b]<e&&(e=d[b]));Infinity!=e&&(p=setTimeout(k,e-a));f&&h()}}if(!g||!g.toJSON&&!Object.toJSON&&!window.JSON)throw Error("jQuery, MooTools or Prototype needs to be loaded before jStorage!");var c={},e={jStorage:"{}"},d=null,j=0,o=g.toJSON||Object.toJSON||window.JSON&&(JSON.encode||JSON.stringify),
	n=g.evalJSON||window.JSON&&(JSON.decode||JSON.parse)||function(a){return(""+a).evalJSON()},f=!1,p,l={isXML:function(a){return(a=(a?a.ownerDocument||a:0).documentElement)?"HTML"!==a.nodeName:!1},encode:function(a){if(!this.isXML(a))return!1;try{return(new XMLSerializer).serializeToString(a)}catch(b){try{return a.xml}catch(c){}}return!1},decode:function(a){var b="DOMParser"in window&&(new DOMParser).parseFromString||window.ActiveXObject&&function(a){var b=new ActiveXObject("Microsoft.XMLDOM");b.async=
	"false";b.loadXML(a);return b};if(!b)return!1;a=b.call("DOMParser"in window&&new DOMParser||window,a,"text/xml");return this.isXML(a)?a:!1}};g.jStorage={version:"0.1.6.1",set:function(a,b){i(a);l.isXML(b)?b={_is_xml:!0,xml:l.encode(b)}:"function"==typeof b?b=null:b&&"object"==typeof b&&(b=n(o(b)));c[a]=b;h();return b},get:function(a,b){i(a);return a in c?c[a]&&"object"==typeof c[a]&&c[a]._is_xml&&c[a]._is_xml?l.decode(c[a].xml):c[a]:"undefined"==typeof b?null:b},deleteKey:function(a){i(a);return a in
	c?(delete c[a],c.__jstorage_meta&&"object"==typeof c.__jstorage_meta.TTL&&a in c.__jstorage_meta.TTL&&delete c.__jstorage_meta.TTL[a],h(),!0):!1},setTTL:function(a,b){var d=+new Date;i(a);b=Number(b)||0;if(a in c){if(!c.__jstorage_meta)c.__jstorage_meta={};if(!c.__jstorage_meta.TTL)c.__jstorage_meta.TTL={};0<b?c.__jstorage_meta.TTL[a]=d+b:delete c.__jstorage_meta.TTL[a];h();k();return!0}return!1},flush:function(){c={};h();return!0},storageObj:function(){function a(){}a.prototype=c;return new a},index:function(){var a=
	[],b;for(b in c)c.hasOwnProperty(b)&&"__jstorage_meta"!=b&&a.push(b);return a},storageSize:function(){return j},currentBackend:function(){return f},storageAvailable:function(){return!!f},reInit:function(){var a;if(d&&d.addBehavior){a=document.createElement("link");d.parentNode.replaceChild(a,d);d=a;d.style.behavior="url(#default#userData)";document.getElementsByTagName("head")[0].appendChild(d);d.load("jStorage");a="{}";try{a=d.getAttribute("jStorage")}catch(b){}e.jStorage=a;f="userDataBehavior"}m()}};
	(function(){var a=!1;if("localStorage"in window)try{window.localStorage.setItem("_tmptest","tmpval"),a=!0,window.localStorage.removeItem("_tmptest")}catch(b){}if(a)try{if(window.localStorage)e=window.localStorage,f="localStorage"}catch(c){}else if("globalStorage"in window)try{window.globalStorage&&(e=window.globalStorage[window.location.hostname],f="globalStorage")}catch(g){}else if(d=document.createElement("link"),d.addBehavior){d.style.behavior="url(#default#userData)";document.getElementsByTagName("head")[0].appendChild(d);
	d.load("jStorage");a="{}";try{a=d.getAttribute("jStorage")}catch(h){}e.jStorage=a;f="userDataBehavior"}else{d=null;return}m();k()})()})(window.jQuery||window.$);
}
