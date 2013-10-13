(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function(files) {
    var cache, module, req;
    cache = {};
    req = function(id) {
      var file;
      if (cache[id] == null) {
        if (files[id] == null) {
          if ((typeof require !== "undefined" && require !== null)) {
            return require(id);
          }
          console.trace("Cannot find module '" + id + "'");
          return null;
        }
        file = cache[id] = {
          exports: {}
        };
        files[id][1].call(file.exports, (function(name) {
          var realId;
          realId = files[id][0][name];
          return req(realId != null ? realId : name);
        }), file, file.exports);
      }
      return cache[id].exports;
    };
    if (typeof module === 'undefined') {
      module = {};
    }
    return module.exports = req(0);
  })([
    [
      {
        /*
          /Users/Admin/Projects/Nitro/source/scripts/init.coffee
        */

        'jqueryify': 1,
        './controllers/app': 2
      }, function(require, module, exports) {
        var $, App;
        $ = require('jqueryify');
        App = require('./controllers/app');
        return $(function() {
          return new App();
        });
      }
    ], [
      {
        /*
          /Users/Admin/Projects/Nitro/node_modules/jqueryify/index.js
        */

      }, function(require, module, exports) {
        /*!
       * jQuery JavaScript Library v2.0.3
       * http://jquery.com/
       *
       * Includes Sizzle.js
       * http://sizzlejs.com/
       *
       * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
       * Released under the MIT license
       * http://jquery.org/license
       *
       * Date: 2013-07-03T13:30Z
       */
      (function( window, undefined ) {
      
      // Can't do this because several apps including ASP.NET trace
      // the stack via arguments.caller.callee and Firefox dies if
      // you try to trace through "use strict" call chains. (#13335)
      // Support: Firefox 18+
      //"use strict";
      var
      	// A central reference to the root jQuery(document)
      	rootjQuery,
      
      	// The deferred used on DOM ready
      	readyList,
      
      	// Support: IE9
      	// For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
      	core_strundefined = typeof undefined,
      
      	// Use the correct document accordingly with window argument (sandbox)
      	location = window.location,
      	document = window.document,
      	docElem = document.documentElement,
      
      	// Map over jQuery in case of overwrite
      	_jQuery = window.jQuery,
      
      	// Map over the $ in case of overwrite
      	_$ = window.$,
      
      	// [[Class]] -> type pairs
      	class2type = {},
      
      	// List of deleted data cache ids, so we can reuse them
      	core_deletedIds = [],
      
      	core_version = "2.0.3",
      
      	// Save a reference to some core methods
      	core_concat = core_deletedIds.concat,
      	core_push = core_deletedIds.push,
      	core_slice = core_deletedIds.slice,
      	core_indexOf = core_deletedIds.indexOf,
      	core_toString = class2type.toString,
      	core_hasOwn = class2type.hasOwnProperty,
      	core_trim = core_version.trim,
      
      	// Define a local copy of jQuery
      	jQuery = function( selector, context ) {
      		// The jQuery object is actually just the init constructor 'enhanced'
      		return new jQuery.fn.init( selector, context, rootjQuery );
      	},
      
      	// Used for matching numbers
      	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
      
      	// Used for splitting on whitespace
      	core_rnotwhite = /\S+/g,
      
      	// A simple way to check for HTML strings
      	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
      	// Strict HTML recognition (#11290: must start with <)
      	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
      
      	// Match a standalone tag
      	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
      
      	// Matches dashed string for camelizing
      	rmsPrefix = /^-ms-/,
      	rdashAlpha = /-([\da-z])/gi,
      
      	// Used by jQuery.camelCase as callback to replace()
      	fcamelCase = function( all, letter ) {
      		return letter.toUpperCase();
      	},
      
      	// The ready event handler and self cleanup method
      	completed = function() {
      		document.removeEventListener( "DOMContentLoaded", completed, false );
      		window.removeEventListener( "load", completed, false );
      		jQuery.ready();
      	};
      
      jQuery.fn = jQuery.prototype = {
      	// The current version of jQuery being used
      	jquery: core_version,
      
      	constructor: jQuery,
      	init: function( selector, context, rootjQuery ) {
      		var match, elem;
      
      		// HANDLE: $(""), $(null), $(undefined), $(false)
      		if ( !selector ) {
      			return this;
      		}
      
      		// Handle HTML strings
      		if ( typeof selector === "string" ) {
      			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
      				// Assume that strings that start and end with <> are HTML and skip the regex check
      				match = [ null, selector, null ];
      
      			} else {
      				match = rquickExpr.exec( selector );
      			}
      
      			// Match html or make sure no context is specified for #id
      			if ( match && (match[1] || !context) ) {
      
      				// HANDLE: $(html) -> $(array)
      				if ( match[1] ) {
      					context = context instanceof jQuery ? context[0] : context;
      
      					// scripts is true for back-compat
      					jQuery.merge( this, jQuery.parseHTML(
      						match[1],
      						context && context.nodeType ? context.ownerDocument || context : document,
      						true
      					) );
      
      					// HANDLE: $(html, props)
      					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
      						for ( match in context ) {
      							// Properties of context are called as methods if possible
      							if ( jQuery.isFunction( this[ match ] ) ) {
      								this[ match ]( context[ match ] );
      
      							// ...and otherwise set as attributes
      							} else {
      								this.attr( match, context[ match ] );
      							}
      						}
      					}
      
      					return this;
      
      				// HANDLE: $(#id)
      				} else {
      					elem = document.getElementById( match[2] );
      
      					// Check parentNode to catch when Blackberry 4.6 returns
      					// nodes that are no longer in the document #6963
      					if ( elem && elem.parentNode ) {
      						// Inject the element directly into the jQuery object
      						this.length = 1;
      						this[0] = elem;
      					}
      
      					this.context = document;
      					this.selector = selector;
      					return this;
      				}
      
      			// HANDLE: $(expr, $(...))
      			} else if ( !context || context.jquery ) {
      				return ( context || rootjQuery ).find( selector );
      
      			// HANDLE: $(expr, context)
      			// (which is just equivalent to: $(context).find(expr)
      			} else {
      				return this.constructor( context ).find( selector );
      			}
      
      		// HANDLE: $(DOMElement)
      		} else if ( selector.nodeType ) {
      			this.context = this[0] = selector;
      			this.length = 1;
      			return this;
      
      		// HANDLE: $(function)
      		// Shortcut for document ready
      		} else if ( jQuery.isFunction( selector ) ) {
      			return rootjQuery.ready( selector );
      		}
      
      		if ( selector.selector !== undefined ) {
      			this.selector = selector.selector;
      			this.context = selector.context;
      		}
      
      		return jQuery.makeArray( selector, this );
      	},
      
      	// Start with an empty selector
      	selector: "",
      
      	// The default length of a jQuery object is 0
      	length: 0,
      
      	toArray: function() {
      		return core_slice.call( this );
      	},
      
      	// Get the Nth element in the matched element set OR
      	// Get the whole matched element set as a clean array
      	get: function( num ) {
      		return num == null ?
      
      			// Return a 'clean' array
      			this.toArray() :
      
      			// Return just the object
      			( num < 0 ? this[ this.length + num ] : this[ num ] );
      	},
      
      	// Take an array of elements and push it onto the stack
      	// (returning the new matched element set)
      	pushStack: function( elems ) {
      
      		// Build a new jQuery matched element set
      		var ret = jQuery.merge( this.constructor(), elems );
      
      		// Add the old object onto the stack (as a reference)
      		ret.prevObject = this;
      		ret.context = this.context;
      
      		// Return the newly-formed element set
      		return ret;
      	},
      
      	// Execute a callback for every element in the matched set.
      	// (You can seed the arguments with an array of args, but this is
      	// only used internally.)
      	each: function( callback, args ) {
      		return jQuery.each( this, callback, args );
      	},
      
      	ready: function( fn ) {
      		// Add the callback
      		jQuery.ready.promise().done( fn );
      
      		return this;
      	},
      
      	slice: function() {
      		return this.pushStack( core_slice.apply( this, arguments ) );
      	},
      
      	first: function() {
      		return this.eq( 0 );
      	},
      
      	last: function() {
      		return this.eq( -1 );
      	},
      
      	eq: function( i ) {
      		var len = this.length,
      			j = +i + ( i < 0 ? len : 0 );
      		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
      	},
      
      	map: function( callback ) {
      		return this.pushStack( jQuery.map(this, function( elem, i ) {
      			return callback.call( elem, i, elem );
      		}));
      	},
      
      	end: function() {
      		return this.prevObject || this.constructor(null);
      	},
      
      	// For internal use only.
      	// Behaves like an Array's method, not like a jQuery method.
      	push: core_push,
      	sort: [].sort,
      	splice: [].splice
      };
      
      // Give the init function the jQuery prototype for later instantiation
      jQuery.fn.init.prototype = jQuery.fn;
      
      jQuery.extend = jQuery.fn.extend = function() {
      	var options, name, src, copy, copyIsArray, clone,
      		target = arguments[0] || {},
      		i = 1,
      		length = arguments.length,
      		deep = false;
      
      	// Handle a deep copy situation
      	if ( typeof target === "boolean" ) {
      		deep = target;
      		target = arguments[1] || {};
      		// skip the boolean and the target
      		i = 2;
      	}
      
      	// Handle case when target is a string or something (possible in deep copy)
      	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
      		target = {};
      	}
      
      	// extend jQuery itself if only one argument is passed
      	if ( length === i ) {
      		target = this;
      		--i;
      	}
      
      	for ( ; i < length; i++ ) {
      		// Only deal with non-null/undefined values
      		if ( (options = arguments[ i ]) != null ) {
      			// Extend the base object
      			for ( name in options ) {
      				src = target[ name ];
      				copy = options[ name ];
      
      				// Prevent never-ending loop
      				if ( target === copy ) {
      					continue;
      				}
      
      				// Recurse if we're merging plain objects or arrays
      				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
      					if ( copyIsArray ) {
      						copyIsArray = false;
      						clone = src && jQuery.isArray(src) ? src : [];
      
      					} else {
      						clone = src && jQuery.isPlainObject(src) ? src : {};
      					}
      
      					// Never move original objects, clone them
      					target[ name ] = jQuery.extend( deep, clone, copy );
      
      				// Don't bring in undefined values
      				} else if ( copy !== undefined ) {
      					target[ name ] = copy;
      				}
      			}
      		}
      	}
      
      	// Return the modified object
      	return target;
      };
      
      jQuery.extend({
      	// Unique for each copy of jQuery on the page
      	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),
      
      	noConflict: function( deep ) {
      		if ( window.$ === jQuery ) {
      			window.$ = _$;
      		}
      
      		if ( deep && window.jQuery === jQuery ) {
      			window.jQuery = _jQuery;
      		}
      
      		return jQuery;
      	},
      
      	// Is the DOM ready to be used? Set to true once it occurs.
      	isReady: false,
      
      	// A counter to track how many items to wait for before
      	// the ready event fires. See #6781
      	readyWait: 1,
      
      	// Hold (or release) the ready event
      	holdReady: function( hold ) {
      		if ( hold ) {
      			jQuery.readyWait++;
      		} else {
      			jQuery.ready( true );
      		}
      	},
      
      	// Handle when the DOM is ready
      	ready: function( wait ) {
      
      		// Abort if there are pending holds or we're already ready
      		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
      			return;
      		}
      
      		// Remember that the DOM is ready
      		jQuery.isReady = true;
      
      		// If a normal DOM Ready event fired, decrement, and wait if need be
      		if ( wait !== true && --jQuery.readyWait > 0 ) {
      			return;
      		}
      
      		// If there are functions bound, to execute
      		readyList.resolveWith( document, [ jQuery ] );
      
      		// Trigger any bound ready events
      		if ( jQuery.fn.trigger ) {
      			jQuery( document ).trigger("ready").off("ready");
      		}
      	},
      
      	// See test/unit/core.js for details concerning isFunction.
      	// Since version 1.3, DOM methods and functions like alert
      	// aren't supported. They return false on IE (#2968).
      	isFunction: function( obj ) {
      		return jQuery.type(obj) === "function";
      	},
      
      	isArray: Array.isArray,
      
      	isWindow: function( obj ) {
      		return obj != null && obj === obj.window;
      	},
      
      	isNumeric: function( obj ) {
      		return !isNaN( parseFloat(obj) ) && isFinite( obj );
      	},
      
      	type: function( obj ) {
      		if ( obj == null ) {
      			return String( obj );
      		}
      		// Support: Safari <= 5.1 (functionish RegExp)
      		return typeof obj === "object" || typeof obj === "function" ?
      			class2type[ core_toString.call(obj) ] || "object" :
      			typeof obj;
      	},
      
      	isPlainObject: function( obj ) {
      		// Not plain objects:
      		// - Any object or value whose internal [[Class]] property is not "[object Object]"
      		// - DOM nodes
      		// - window
      		if ( jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
      			return false;
      		}
      
      		// Support: Firefox <20
      		// The try/catch suppresses exceptions thrown when attempting to access
      		// the "constructor" property of certain host objects, ie. |window.location|
      		// https://bugzilla.mozilla.org/show_bug.cgi?id=814622
      		try {
      			if ( obj.constructor &&
      					!core_hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
      				return false;
      			}
      		} catch ( e ) {
      			return false;
      		}
      
      		// If the function hasn't returned already, we're confident that
      		// |obj| is a plain object, created by {} or constructed with new Object
      		return true;
      	},
      
      	isEmptyObject: function( obj ) {
      		var name;
      		for ( name in obj ) {
      			return false;
      		}
      		return true;
      	},
      
      	error: function( msg ) {
      		throw new Error( msg );
      	},
      
      	// data: string of html
      	// context (optional): If specified, the fragment will be created in this context, defaults to document
      	// keepScripts (optional): If true, will include scripts passed in the html string
      	parseHTML: function( data, context, keepScripts ) {
      		if ( !data || typeof data !== "string" ) {
      			return null;
      		}
      		if ( typeof context === "boolean" ) {
      			keepScripts = context;
      			context = false;
      		}
      		context = context || document;
      
      		var parsed = rsingleTag.exec( data ),
      			scripts = !keepScripts && [];
      
      		// Single tag
      		if ( parsed ) {
      			return [ context.createElement( parsed[1] ) ];
      		}
      
      		parsed = jQuery.buildFragment( [ data ], context, scripts );
      
      		if ( scripts ) {
      			jQuery( scripts ).remove();
      		}
      
      		return jQuery.merge( [], parsed.childNodes );
      	},
      
      	parseJSON: JSON.parse,
      
      	// Cross-browser xml parsing
      	parseXML: function( data ) {
      		var xml, tmp;
      		if ( !data || typeof data !== "string" ) {
      			return null;
      		}
      
      		// Support: IE9
      		try {
      			tmp = new DOMParser();
      			xml = tmp.parseFromString( data , "text/xml" );
      		} catch ( e ) {
      			xml = undefined;
      		}
      
      		if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
      			jQuery.error( "Invalid XML: " + data );
      		}
      		return xml;
      	},
      
      	noop: function() {},
      
      	// Evaluates a script in a global context
      	globalEval: function( code ) {
      		var script,
      				indirect = eval;
      
      		code = jQuery.trim( code );
      
      		if ( code ) {
      			// If the code includes a valid, prologue position
      			// strict mode pragma, execute code by injecting a
      			// script tag into the document.
      			if ( code.indexOf("use strict") === 1 ) {
      				script = document.createElement("script");
      				script.text = code;
      				document.head.appendChild( script ).parentNode.removeChild( script );
      			} else {
      			// Otherwise, avoid the DOM node creation, insertion
      			// and removal by using an indirect global eval
      				indirect( code );
      			}
      		}
      	},
      
      	// Convert dashed to camelCase; used by the css and data modules
      	// Microsoft forgot to hump their vendor prefix (#9572)
      	camelCase: function( string ) {
      		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
      	},
      
      	nodeName: function( elem, name ) {
      		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
      	},
      
      	// args is for internal usage only
      	each: function( obj, callback, args ) {
      		var value,
      			i = 0,
      			length = obj.length,
      			isArray = isArraylike( obj );
      
      		if ( args ) {
      			if ( isArray ) {
      				for ( ; i < length; i++ ) {
      					value = callback.apply( obj[ i ], args );
      
      					if ( value === false ) {
      						break;
      					}
      				}
      			} else {
      				for ( i in obj ) {
      					value = callback.apply( obj[ i ], args );
      
      					if ( value === false ) {
      						break;
      					}
      				}
      			}
      
      		// A special, fast, case for the most common use of each
      		} else {
      			if ( isArray ) {
      				for ( ; i < length; i++ ) {
      					value = callback.call( obj[ i ], i, obj[ i ] );
      
      					if ( value === false ) {
      						break;
      					}
      				}
      			} else {
      				for ( i in obj ) {
      					value = callback.call( obj[ i ], i, obj[ i ] );
      
      					if ( value === false ) {
      						break;
      					}
      				}
      			}
      		}
      
      		return obj;
      	},
      
      	trim: function( text ) {
      		return text == null ? "" : core_trim.call( text );
      	},
      
      	// results is for internal usage only
      	makeArray: function( arr, results ) {
      		var ret = results || [];
      
      		if ( arr != null ) {
      			if ( isArraylike( Object(arr) ) ) {
      				jQuery.merge( ret,
      					typeof arr === "string" ?
      					[ arr ] : arr
      				);
      			} else {
      				core_push.call( ret, arr );
      			}
      		}
      
      		return ret;
      	},
      
      	inArray: function( elem, arr, i ) {
      		return arr == null ? -1 : core_indexOf.call( arr, elem, i );
      	},
      
      	merge: function( first, second ) {
      		var l = second.length,
      			i = first.length,
      			j = 0;
      
      		if ( typeof l === "number" ) {
      			for ( ; j < l; j++ ) {
      				first[ i++ ] = second[ j ];
      			}
      		} else {
      			while ( second[j] !== undefined ) {
      				first[ i++ ] = second[ j++ ];
      			}
      		}
      
      		first.length = i;
      
      		return first;
      	},
      
      	grep: function( elems, callback, inv ) {
      		var retVal,
      			ret = [],
      			i = 0,
      			length = elems.length;
      		inv = !!inv;
      
      		// Go through the array, only saving the items
      		// that pass the validator function
      		for ( ; i < length; i++ ) {
      			retVal = !!callback( elems[ i ], i );
      			if ( inv !== retVal ) {
      				ret.push( elems[ i ] );
      			}
      		}
      
      		return ret;
      	},
      
      	// arg is for internal usage only
      	map: function( elems, callback, arg ) {
      		var value,
      			i = 0,
      			length = elems.length,
      			isArray = isArraylike( elems ),
      			ret = [];
      
      		// Go through the array, translating each of the items to their
      		if ( isArray ) {
      			for ( ; i < length; i++ ) {
      				value = callback( elems[ i ], i, arg );
      
      				if ( value != null ) {
      					ret[ ret.length ] = value;
      				}
      			}
      
      		// Go through every key on the object,
      		} else {
      			for ( i in elems ) {
      				value = callback( elems[ i ], i, arg );
      
      				if ( value != null ) {
      					ret[ ret.length ] = value;
      				}
      			}
      		}
      
      		// Flatten any nested arrays
      		return core_concat.apply( [], ret );
      	},
      
      	// A global GUID counter for objects
      	guid: 1,
      
      	// Bind a function to a context, optionally partially applying any
      	// arguments.
      	proxy: function( fn, context ) {
      		var tmp, args, proxy;
      
      		if ( typeof context === "string" ) {
      			tmp = fn[ context ];
      			context = fn;
      			fn = tmp;
      		}
      
      		// Quick check to determine if target is callable, in the spec
      		// this throws a TypeError, but we will just return undefined.
      		if ( !jQuery.isFunction( fn ) ) {
      			return undefined;
      		}
      
      		// Simulated bind
      		args = core_slice.call( arguments, 2 );
      		proxy = function() {
      			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
      		};
      
      		// Set the guid of unique handler to the same of original handler, so it can be removed
      		proxy.guid = fn.guid = fn.guid || jQuery.guid++;
      
      		return proxy;
      	},
      
      	// Multifunctional method to get and set values of a collection
      	// The value/s can optionally be executed if it's a function
      	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
      		var i = 0,
      			length = elems.length,
      			bulk = key == null;
      
      		// Sets many values
      		if ( jQuery.type( key ) === "object" ) {
      			chainable = true;
      			for ( i in key ) {
      				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
      			}
      
      		// Sets one value
      		} else if ( value !== undefined ) {
      			chainable = true;
      
      			if ( !jQuery.isFunction( value ) ) {
      				raw = true;
      			}
      
      			if ( bulk ) {
      				// Bulk operations run against the entire set
      				if ( raw ) {
      					fn.call( elems, value );
      					fn = null;
      
      				// ...except when executing function values
      				} else {
      					bulk = fn;
      					fn = function( elem, key, value ) {
      						return bulk.call( jQuery( elem ), value );
      					};
      				}
      			}
      
      			if ( fn ) {
      				for ( ; i < length; i++ ) {
      					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
      				}
      			}
      		}
      
      		return chainable ?
      			elems :
      
      			// Gets
      			bulk ?
      				fn.call( elems ) :
      				length ? fn( elems[0], key ) : emptyGet;
      	},
      
      	now: Date.now,
      
      	// A method for quickly swapping in/out CSS properties to get correct calculations.
      	// Note: this method belongs to the css module but it's needed here for the support module.
      	// If support gets modularized, this method should be moved back to the css module.
      	swap: function( elem, options, callback, args ) {
      		var ret, name,
      			old = {};
      
      		// Remember the old values, and insert the new ones
      		for ( name in options ) {
      			old[ name ] = elem.style[ name ];
      			elem.style[ name ] = options[ name ];
      		}
      
      		ret = callback.apply( elem, args || [] );
      
      		// Revert the old values
      		for ( name in options ) {
      			elem.style[ name ] = old[ name ];
      		}
      
      		return ret;
      	}
      });
      
      jQuery.ready.promise = function( obj ) {
      	if ( !readyList ) {
      
      		readyList = jQuery.Deferred();
      
      		// Catch cases where $(document).ready() is called after the browser event has already occurred.
      		// we once tried to use readyState "interactive" here, but it caused issues like the one
      		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
      		if ( document.readyState === "complete" ) {
      			// Handle it asynchronously to allow scripts the opportunity to delay ready
      			setTimeout( jQuery.ready );
      
      		} else {
      
      			// Use the handy event callback
      			document.addEventListener( "DOMContentLoaded", completed, false );
      
      			// A fallback to window.onload, that will always work
      			window.addEventListener( "load", completed, false );
      		}
      	}
      	return readyList.promise( obj );
      };
      
      // Populate the class2type map
      jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
      	class2type[ "[object " + name + "]" ] = name.toLowerCase();
      });
      
      function isArraylike( obj ) {
      	var length = obj.length,
      		type = jQuery.type( obj );
      
      	if ( jQuery.isWindow( obj ) ) {
      		return false;
      	}
      
      	if ( obj.nodeType === 1 && length ) {
      		return true;
      	}
      
      	return type === "array" || type !== "function" &&
      		( length === 0 ||
      		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
      }
      
      // All jQuery objects should point back to these
      rootjQuery = jQuery(document);
      /*!
       * Sizzle CSS Selector Engine v1.9.4-pre
       * http://sizzlejs.com/
       *
       * Copyright 2013 jQuery Foundation, Inc. and other contributors
       * Released under the MIT license
       * http://jquery.org/license
       *
       * Date: 2013-06-03
       */
      (function( window, undefined ) {
      
      var i,
      	support,
      	cachedruns,
      	Expr,
      	getText,
      	isXML,
      	compile,
      	outermostContext,
      	sortInput,
      
      	// Local document vars
      	setDocument,
      	document,
      	docElem,
      	documentIsHTML,
      	rbuggyQSA,
      	rbuggyMatches,
      	matches,
      	contains,
      
      	// Instance-specific data
      	expando = "sizzle" + -(new Date()),
      	preferredDoc = window.document,
      	dirruns = 0,
      	done = 0,
      	classCache = createCache(),
      	tokenCache = createCache(),
      	compilerCache = createCache(),
      	hasDuplicate = false,
      	sortOrder = function( a, b ) {
      		if ( a === b ) {
      			hasDuplicate = true;
      			return 0;
      		}
      		return 0;
      	},
      
      	// General-purpose constants
      	strundefined = typeof undefined,
      	MAX_NEGATIVE = 1 << 31,
      
      	// Instance methods
      	hasOwn = ({}).hasOwnProperty,
      	arr = [],
      	pop = arr.pop,
      	push_native = arr.push,
      	push = arr.push,
      	slice = arr.slice,
      	// Use a stripped-down indexOf if we can't use a native one
      	indexOf = arr.indexOf || function( elem ) {
      		var i = 0,
      			len = this.length;
      		for ( ; i < len; i++ ) {
      			if ( this[i] === elem ) {
      				return i;
      			}
      		}
      		return -1;
      	},
      
      	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
      
      	// Regular expressions
      
      	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
      	whitespace = "[\\x20\\t\\r\\n\\f]",
      	// http://www.w3.org/TR/css3-syntax/#characters
      	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
      
      	// Loosely modeled on CSS identifier characters
      	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
      	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
      	identifier = characterEncoding.replace( "w", "w#" ),
      
      	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
      	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
      		"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",
      
      	// Prefer arguments quoted,
      	//   then not containing pseudos/brackets,
      	//   then attribute selectors/non-parenthetical expressions,
      	//   then anything else
      	// These preferences are here to reduce the number of selectors
      	//   needing tokenize in the PSEUDO preFilter
      	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",
      
      	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
      	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),
      
      	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
      	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),
      
      	rsibling = new RegExp( whitespace + "*[+~]" ),
      	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),
      
      	rpseudo = new RegExp( pseudos ),
      	ridentifier = new RegExp( "^" + identifier + "$" ),
      
      	matchExpr = {
      		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
      		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
      		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
      		"ATTR": new RegExp( "^" + attributes ),
      		"PSEUDO": new RegExp( "^" + pseudos ),
      		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
      			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
      			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
      		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
      		// For use in libraries implementing .is()
      		// We use this for POS matching in `select`
      		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
      			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
      	},
      
      	rnative = /^[^{]+\{\s*\[native \w/,
      
      	// Easily-parseable/retrievable ID or TAG or CLASS selectors
      	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
      
      	rinputs = /^(?:input|select|textarea|button)$/i,
      	rheader = /^h\d$/i,
      
      	rescape = /'|\\/g,
      
      	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
      	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
      	funescape = function( _, escaped, escapedWhitespace ) {
      		var high = "0x" + escaped - 0x10000;
      		// NaN means non-codepoint
      		// Support: Firefox
      		// Workaround erroneous numeric interpretation of +"0x"
      		return high !== high || escapedWhitespace ?
      			escaped :
      			// BMP codepoint
      			high < 0 ?
      				String.fromCharCode( high + 0x10000 ) :
      				// Supplemental Plane codepoint (surrogate pair)
      				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
      	};
      
      // Optimize for push.apply( _, NodeList )
      try {
      	push.apply(
      		(arr = slice.call( preferredDoc.childNodes )),
      		preferredDoc.childNodes
      	);
      	// Support: Android<4.0
      	// Detect silently failing push.apply
      	arr[ preferredDoc.childNodes.length ].nodeType;
      } catch ( e ) {
      	push = { apply: arr.length ?
      
      		// Leverage slice if possible
      		function( target, els ) {
      			push_native.apply( target, slice.call(els) );
      		} :
      
      		// Support: IE<9
      		// Otherwise append directly
      		function( target, els ) {
      			var j = target.length,
      				i = 0;
      			// Can't trust NodeList.length
      			while ( (target[j++] = els[i++]) ) {}
      			target.length = j - 1;
      		}
      	};
      }
      
      function Sizzle( selector, context, results, seed ) {
      	var match, elem, m, nodeType,
      		// QSA vars
      		i, groups, old, nid, newContext, newSelector;
      
      	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
      		setDocument( context );
      	}
      
      	context = context || document;
      	results = results || [];
      
      	if ( !selector || typeof selector !== "string" ) {
      		return results;
      	}
      
      	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
      		return [];
      	}
      
      	if ( documentIsHTML && !seed ) {
      
      		// Shortcuts
      		if ( (match = rquickExpr.exec( selector )) ) {
      			// Speed-up: Sizzle("#ID")
      			if ( (m = match[1]) ) {
      				if ( nodeType === 9 ) {
      					elem = context.getElementById( m );
      					// Check parentNode to catch when Blackberry 4.6 returns
      					// nodes that are no longer in the document #6963
      					if ( elem && elem.parentNode ) {
      						// Handle the case where IE, Opera, and Webkit return items
      						// by name instead of ID
      						if ( elem.id === m ) {
      							results.push( elem );
      							return results;
      						}
      					} else {
      						return results;
      					}
      				} else {
      					// Context is not a document
      					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
      						contains( context, elem ) && elem.id === m ) {
      						results.push( elem );
      						return results;
      					}
      				}
      
      			// Speed-up: Sizzle("TAG")
      			} else if ( match[2] ) {
      				push.apply( results, context.getElementsByTagName( selector ) );
      				return results;
      
      			// Speed-up: Sizzle(".CLASS")
      			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
      				push.apply( results, context.getElementsByClassName( m ) );
      				return results;
      			}
      		}
      
      		// QSA path
      		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
      			nid = old = expando;
      			newContext = context;
      			newSelector = nodeType === 9 && selector;
      
      			// qSA works strangely on Element-rooted queries
      			// We can work around this by specifying an extra ID on the root
      			// and working up from there (Thanks to Andrew Dupont for the technique)
      			// IE 8 doesn't work on object elements
      			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
      				groups = tokenize( selector );
      
      				if ( (old = context.getAttribute("id")) ) {
      					nid = old.replace( rescape, "\\$&" );
      				} else {
      					context.setAttribute( "id", nid );
      				}
      				nid = "[id='" + nid + "'] ";
      
      				i = groups.length;
      				while ( i-- ) {
      					groups[i] = nid + toSelector( groups[i] );
      				}
      				newContext = rsibling.test( selector ) && context.parentNode || context;
      				newSelector = groups.join(",");
      			}
      
      			if ( newSelector ) {
      				try {
      					push.apply( results,
      						newContext.querySelectorAll( newSelector )
      					);
      					return results;
      				} catch(qsaError) {
      				} finally {
      					if ( !old ) {
      						context.removeAttribute("id");
      					}
      				}
      			}
      		}
      	}
      
      	// All others
      	return select( selector.replace( rtrim, "$1" ), context, results, seed );
      }
      
      /**
       * Create key-value caches of limited size
       * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
       *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
       *	deleting the oldest entry
       */
      function createCache() {
      	var keys = [];
      
      	function cache( key, value ) {
      		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
      		if ( keys.push( key += " " ) > Expr.cacheLength ) {
      			// Only keep the most recent entries
      			delete cache[ keys.shift() ];
      		}
      		return (cache[ key ] = value);
      	}
      	return cache;
      }
      
      /**
       * Mark a function for special use by Sizzle
       * @param {Function} fn The function to mark
       */
      function markFunction( fn ) {
      	fn[ expando ] = true;
      	return fn;
      }
      
      /**
       * Support testing using an element
       * @param {Function} fn Passed the created div and expects a boolean result
       */
      function assert( fn ) {
      	var div = document.createElement("div");
      
      	try {
      		return !!fn( div );
      	} catch (e) {
      		return false;
      	} finally {
      		// Remove from its parent by default
      		if ( div.parentNode ) {
      			div.parentNode.removeChild( div );
      		}
      		// release memory in IE
      		div = null;
      	}
      }
      
      /**
       * Adds the same handler for all of the specified attrs
       * @param {String} attrs Pipe-separated list of attributes
       * @param {Function} handler The method that will be applied
       */
      function addHandle( attrs, handler ) {
      	var arr = attrs.split("|"),
      		i = attrs.length;
      
      	while ( i-- ) {
      		Expr.attrHandle[ arr[i] ] = handler;
      	}
      }
      
      /**
       * Checks document order of two siblings
       * @param {Element} a
       * @param {Element} b
       * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
       */
      function siblingCheck( a, b ) {
      	var cur = b && a,
      		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
      			( ~b.sourceIndex || MAX_NEGATIVE ) -
      			( ~a.sourceIndex || MAX_NEGATIVE );
      
      	// Use IE sourceIndex if available on both nodes
      	if ( diff ) {
      		return diff;
      	}
      
      	// Check if b follows a
      	if ( cur ) {
      		while ( (cur = cur.nextSibling) ) {
      			if ( cur === b ) {
      				return -1;
      			}
      		}
      	}
      
      	return a ? 1 : -1;
      }
      
      /**
       * Returns a function to use in pseudos for input types
       * @param {String} type
       */
      function createInputPseudo( type ) {
      	return function( elem ) {
      		var name = elem.nodeName.toLowerCase();
      		return name === "input" && elem.type === type;
      	};
      }
      
      /**
       * Returns a function to use in pseudos for buttons
       * @param {String} type
       */
      function createButtonPseudo( type ) {
      	return function( elem ) {
      		var name = elem.nodeName.toLowerCase();
      		return (name === "input" || name === "button") && elem.type === type;
      	};
      }
      
      /**
       * Returns a function to use in pseudos for positionals
       * @param {Function} fn
       */
      function createPositionalPseudo( fn ) {
      	return markFunction(function( argument ) {
      		argument = +argument;
      		return markFunction(function( seed, matches ) {
      			var j,
      				matchIndexes = fn( [], seed.length, argument ),
      				i = matchIndexes.length;
      
      			// Match elements found at the specified indexes
      			while ( i-- ) {
      				if ( seed[ (j = matchIndexes[i]) ] ) {
      					seed[j] = !(matches[j] = seed[j]);
      				}
      			}
      		});
      	});
      }
      
      /**
       * Detect xml
       * @param {Element|Object} elem An element or a document
       */
      isXML = Sizzle.isXML = function( elem ) {
      	// documentElement is verified for cases where it doesn't yet exist
      	// (such as loading iframes in IE - #4833)
      	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
      	return documentElement ? documentElement.nodeName !== "HTML" : false;
      };
      
      // Expose support vars for convenience
      support = Sizzle.support = {};
      
      /**
       * Sets document-related variables once based on the current document
       * @param {Element|Object} [doc] An element or document object to use to set the document
       * @returns {Object} Returns the current document
       */
      setDocument = Sizzle.setDocument = function( node ) {
      	var doc = node ? node.ownerDocument || node : preferredDoc,
      		parent = doc.defaultView;
      
      	// If no document and documentElement is available, return
      	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
      		return document;
      	}
      
      	// Set our document
      	document = doc;
      	docElem = doc.documentElement;
      
      	// Support tests
      	documentIsHTML = !isXML( doc );
      
      	// Support: IE>8
      	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
      	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
      	// IE6-8 do not support the defaultView property so parent will be undefined
      	if ( parent && parent.attachEvent && parent !== parent.top ) {
      		parent.attachEvent( "onbeforeunload", function() {
      			setDocument();
      		});
      	}
      
      	/* Attributes
      	---------------------------------------------------------------------- */
      
      	// Support: IE<8
      	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
      	support.attributes = assert(function( div ) {
      		div.className = "i";
      		return !div.getAttribute("className");
      	});
      
      	/* getElement(s)By*
      	---------------------------------------------------------------------- */
      
      	// Check if getElementsByTagName("*") returns only elements
      	support.getElementsByTagName = assert(function( div ) {
      		div.appendChild( doc.createComment("") );
      		return !div.getElementsByTagName("*").length;
      	});
      
      	// Check if getElementsByClassName can be trusted
      	support.getElementsByClassName = assert(function( div ) {
      		div.innerHTML = "<div class='a'></div><div class='a i'></div>";
      
      		// Support: Safari<4
      		// Catch class over-caching
      		div.firstChild.className = "i";
      		// Support: Opera<10
      		// Catch gEBCN failure to find non-leading classes
      		return div.getElementsByClassName("i").length === 2;
      	});
      
      	// Support: IE<10
      	// Check if getElementById returns elements by name
      	// The broken getElementById methods don't pick up programatically-set names,
      	// so use a roundabout getElementsByName test
      	support.getById = assert(function( div ) {
      		docElem.appendChild( div ).id = expando;
      		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
      	});
      
      	// ID find and filter
      	if ( support.getById ) {
      		Expr.find["ID"] = function( id, context ) {
      			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
      				var m = context.getElementById( id );
      				// Check parentNode to catch when Blackberry 4.6 returns
      				// nodes that are no longer in the document #6963
      				return m && m.parentNode ? [m] : [];
      			}
      		};
      		Expr.filter["ID"] = function( id ) {
      			var attrId = id.replace( runescape, funescape );
      			return function( elem ) {
      				return elem.getAttribute("id") === attrId;
      			};
      		};
      	} else {
      		// Support: IE6/7
      		// getElementById is not reliable as a find shortcut
      		delete Expr.find["ID"];
      
      		Expr.filter["ID"] =  function( id ) {
      			var attrId = id.replace( runescape, funescape );
      			return function( elem ) {
      				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
      				return node && node.value === attrId;
      			};
      		};
      	}
      
      	// Tag
      	Expr.find["TAG"] = support.getElementsByTagName ?
      		function( tag, context ) {
      			if ( typeof context.getElementsByTagName !== strundefined ) {
      				return context.getElementsByTagName( tag );
      			}
      		} :
      		function( tag, context ) {
      			var elem,
      				tmp = [],
      				i = 0,
      				results = context.getElementsByTagName( tag );
      
      			// Filter out possible comments
      			if ( tag === "*" ) {
      				while ( (elem = results[i++]) ) {
      					if ( elem.nodeType === 1 ) {
      						tmp.push( elem );
      					}
      				}
      
      				return tmp;
      			}
      			return results;
      		};
      
      	// Class
      	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
      		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
      			return context.getElementsByClassName( className );
      		}
      	};
      
      	/* QSA/matchesSelector
      	---------------------------------------------------------------------- */
      
      	// QSA and matchesSelector support
      
      	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
      	rbuggyMatches = [];
      
      	// qSa(:focus) reports false when true (Chrome 21)
      	// We allow this because of a bug in IE8/9 that throws an error
      	// whenever `document.activeElement` is accessed on an iframe
      	// So, we allow :focus to pass through QSA all the time to avoid the IE error
      	// See http://bugs.jquery.com/ticket/13378
      	rbuggyQSA = [];
      
      	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
      		// Build QSA regex
      		// Regex strategy adopted from Diego Perini
      		assert(function( div ) {
      			// Select is set to empty string on purpose
      			// This is to test IE's treatment of not explicitly
      			// setting a boolean content attribute,
      			// since its presence should be enough
      			// http://bugs.jquery.com/ticket/12359
      			div.innerHTML = "<select><option selected=''></option></select>";
      
      			// Support: IE8
      			// Boolean attributes and "value" are not treated correctly
      			if ( !div.querySelectorAll("[selected]").length ) {
      				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
      			}
      
      			// Webkit/Opera - :checked should return selected option elements
      			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
      			// IE8 throws error here and will not see later tests
      			if ( !div.querySelectorAll(":checked").length ) {
      				rbuggyQSA.push(":checked");
      			}
      		});
      
      		assert(function( div ) {
      
      			// Support: Opera 10-12/IE8
      			// ^= $= *= and empty values
      			// Should not select anything
      			// Support: Windows 8 Native Apps
      			// The type attribute is restricted during .innerHTML assignment
      			var input = doc.createElement("input");
      			input.setAttribute( "type", "hidden" );
      			div.appendChild( input ).setAttribute( "t", "" );
      
      			if ( div.querySelectorAll("[t^='']").length ) {
      				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
      			}
      
      			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
      			// IE8 throws error here and will not see later tests
      			if ( !div.querySelectorAll(":enabled").length ) {
      				rbuggyQSA.push( ":enabled", ":disabled" );
      			}
      
      			// Opera 10-11 does not throw on post-comma invalid pseudos
      			div.querySelectorAll("*,:x");
      			rbuggyQSA.push(",.*:");
      		});
      	}
      
      	if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
      		docElem.mozMatchesSelector ||
      		docElem.oMatchesSelector ||
      		docElem.msMatchesSelector) )) ) {
      
      		assert(function( div ) {
      			// Check to see if it's possible to do matchesSelector
      			// on a disconnected node (IE 9)
      			support.disconnectedMatch = matches.call( div, "div" );
      
      			// This should fail with an exception
      			// Gecko does not error, returns false instead
      			matches.call( div, "[s!='']:x" );
      			rbuggyMatches.push( "!=", pseudos );
      		});
      	}
      
      	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
      	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );
      
      	/* Contains
      	---------------------------------------------------------------------- */
      
      	// Element contains another
      	// Purposefully does not implement inclusive descendent
      	// As in, an element does not contain itself
      	contains = rnative.test( docElem.contains ) || docElem.compareDocumentPosition ?
      		function( a, b ) {
      			var adown = a.nodeType === 9 ? a.documentElement : a,
      				bup = b && b.parentNode;
      			return a === bup || !!( bup && bup.nodeType === 1 && (
      				adown.contains ?
      					adown.contains( bup ) :
      					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
      			));
      		} :
      		function( a, b ) {
      			if ( b ) {
      				while ( (b = b.parentNode) ) {
      					if ( b === a ) {
      						return true;
      					}
      				}
      			}
      			return false;
      		};
      
      	/* Sorting
      	---------------------------------------------------------------------- */
      
      	// Document order sorting
      	sortOrder = docElem.compareDocumentPosition ?
      	function( a, b ) {
      
      		// Flag for duplicate removal
      		if ( a === b ) {
      			hasDuplicate = true;
      			return 0;
      		}
      
      		var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );
      
      		if ( compare ) {
      			// Disconnected nodes
      			if ( compare & 1 ||
      				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {
      
      				// Choose the first element that is related to our preferred document
      				if ( a === doc || contains(preferredDoc, a) ) {
      					return -1;
      				}
      				if ( b === doc || contains(preferredDoc, b) ) {
      					return 1;
      				}
      
      				// Maintain original order
      				return sortInput ?
      					( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
      					0;
      			}
      
      			return compare & 4 ? -1 : 1;
      		}
      
      		// Not directly comparable, sort on existence of method
      		return a.compareDocumentPosition ? -1 : 1;
      	} :
      	function( a, b ) {
      		var cur,
      			i = 0,
      			aup = a.parentNode,
      			bup = b.parentNode,
      			ap = [ a ],
      			bp = [ b ];
      
      		// Exit early if the nodes are identical
      		if ( a === b ) {
      			hasDuplicate = true;
      			return 0;
      
      		// Parentless nodes are either documents or disconnected
      		} else if ( !aup || !bup ) {
      			return a === doc ? -1 :
      				b === doc ? 1 :
      				aup ? -1 :
      				bup ? 1 :
      				sortInput ?
      				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
      				0;
      
      		// If the nodes are siblings, we can do a quick check
      		} else if ( aup === bup ) {
      			return siblingCheck( a, b );
      		}
      
      		// Otherwise we need full lists of their ancestors for comparison
      		cur = a;
      		while ( (cur = cur.parentNode) ) {
      			ap.unshift( cur );
      		}
      		cur = b;
      		while ( (cur = cur.parentNode) ) {
      			bp.unshift( cur );
      		}
      
      		// Walk down the tree looking for a discrepancy
      		while ( ap[i] === bp[i] ) {
      			i++;
      		}
      
      		return i ?
      			// Do a sibling check if the nodes have a common ancestor
      			siblingCheck( ap[i], bp[i] ) :
      
      			// Otherwise nodes in our document sort first
      			ap[i] === preferredDoc ? -1 :
      			bp[i] === preferredDoc ? 1 :
      			0;
      	};
      
      	return doc;
      };
      
      Sizzle.matches = function( expr, elements ) {
      	return Sizzle( expr, null, null, elements );
      };
      
      Sizzle.matchesSelector = function( elem, expr ) {
      	// Set document vars if needed
      	if ( ( elem.ownerDocument || elem ) !== document ) {
      		setDocument( elem );
      	}
      
      	// Make sure that attribute selectors are quoted
      	expr = expr.replace( rattributeQuotes, "='$1']" );
      
      	if ( support.matchesSelector && documentIsHTML &&
      		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
      		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {
      
      		try {
      			var ret = matches.call( elem, expr );
      
      			// IE 9's matchesSelector returns false on disconnected nodes
      			if ( ret || support.disconnectedMatch ||
      					// As well, disconnected nodes are said to be in a document
      					// fragment in IE 9
      					elem.document && elem.document.nodeType !== 11 ) {
      				return ret;
      			}
      		} catch(e) {}
      	}
      
      	return Sizzle( expr, document, null, [elem] ).length > 0;
      };
      
      Sizzle.contains = function( context, elem ) {
      	// Set document vars if needed
      	if ( ( context.ownerDocument || context ) !== document ) {
      		setDocument( context );
      	}
      	return contains( context, elem );
      };
      
      Sizzle.attr = function( elem, name ) {
      	// Set document vars if needed
      	if ( ( elem.ownerDocument || elem ) !== document ) {
      		setDocument( elem );
      	}
      
      	var fn = Expr.attrHandle[ name.toLowerCase() ],
      		// Don't get fooled by Object.prototype properties (jQuery #13807)
      		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
      			fn( elem, name, !documentIsHTML ) :
      			undefined;
      
      	return val === undefined ?
      		support.attributes || !documentIsHTML ?
      			elem.getAttribute( name ) :
      			(val = elem.getAttributeNode(name)) && val.specified ?
      				val.value :
      				null :
      		val;
      };
      
      Sizzle.error = function( msg ) {
      	throw new Error( "Syntax error, unrecognized expression: " + msg );
      };
      
      /**
       * Document sorting and removing duplicates
       * @param {ArrayLike} results
       */
      Sizzle.uniqueSort = function( results ) {
      	var elem,
      		duplicates = [],
      		j = 0,
      		i = 0;
      
      	// Unless we *know* we can detect duplicates, assume their presence
      	hasDuplicate = !support.detectDuplicates;
      	sortInput = !support.sortStable && results.slice( 0 );
      	results.sort( sortOrder );
      
      	if ( hasDuplicate ) {
      		while ( (elem = results[i++]) ) {
      			if ( elem === results[ i ] ) {
      				j = duplicates.push( i );
      			}
      		}
      		while ( j-- ) {
      			results.splice( duplicates[ j ], 1 );
      		}
      	}
      
      	return results;
      };
      
      /**
       * Utility function for retrieving the text value of an array of DOM nodes
       * @param {Array|Element} elem
       */
      getText = Sizzle.getText = function( elem ) {
      	var node,
      		ret = "",
      		i = 0,
      		nodeType = elem.nodeType;
      
      	if ( !nodeType ) {
      		// If no nodeType, this is expected to be an array
      		for ( ; (node = elem[i]); i++ ) {
      			// Do not traverse comment nodes
      			ret += getText( node );
      		}
      	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
      		// Use textContent for elements
      		// innerText usage removed for consistency of new lines (see #11153)
      		if ( typeof elem.textContent === "string" ) {
      			return elem.textContent;
      		} else {
      			// Traverse its children
      			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
      				ret += getText( elem );
      			}
      		}
      	} else if ( nodeType === 3 || nodeType === 4 ) {
      		return elem.nodeValue;
      	}
      	// Do not include comment or processing instruction nodes
      
      	return ret;
      };
      
      Expr = Sizzle.selectors = {
      
      	// Can be adjusted by the user
      	cacheLength: 50,
      
      	createPseudo: markFunction,
      
      	match: matchExpr,
      
      	attrHandle: {},
      
      	find: {},
      
      	relative: {
      		">": { dir: "parentNode", first: true },
      		" ": { dir: "parentNode" },
      		"+": { dir: "previousSibling", first: true },
      		"~": { dir: "previousSibling" }
      	},
      
      	preFilter: {
      		"ATTR": function( match ) {
      			match[1] = match[1].replace( runescape, funescape );
      
      			// Move the given value to match[3] whether quoted or unquoted
      			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );
      
      			if ( match[2] === "~=" ) {
      				match[3] = " " + match[3] + " ";
      			}
      
      			return match.slice( 0, 4 );
      		},
      
      		"CHILD": function( match ) {
      			/* matches from matchExpr["CHILD"]
      				1 type (only|nth|...)
      				2 what (child|of-type)
      				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
      				4 xn-component of xn+y argument ([+-]?\d*n|)
      				5 sign of xn-component
      				6 x of xn-component
      				7 sign of y-component
      				8 y of y-component
      			*/
      			match[1] = match[1].toLowerCase();
      
      			if ( match[1].slice( 0, 3 ) === "nth" ) {
      				// nth-* requires argument
      				if ( !match[3] ) {
      					Sizzle.error( match[0] );
      				}
      
      				// numeric x and y parameters for Expr.filter.CHILD
      				// remember that false/true cast respectively to 0/1
      				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
      				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );
      
      			// other types prohibit arguments
      			} else if ( match[3] ) {
      				Sizzle.error( match[0] );
      			}
      
      			return match;
      		},
      
      		"PSEUDO": function( match ) {
      			var excess,
      				unquoted = !match[5] && match[2];
      
      			if ( matchExpr["CHILD"].test( match[0] ) ) {
      				return null;
      			}
      
      			// Accept quoted arguments as-is
      			if ( match[3] && match[4] !== undefined ) {
      				match[2] = match[4];
      
      			// Strip excess characters from unquoted arguments
      			} else if ( unquoted && rpseudo.test( unquoted ) &&
      				// Get excess from tokenize (recursively)
      				(excess = tokenize( unquoted, true )) &&
      				// advance to the next closing parenthesis
      				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {
      
      				// excess is a negative index
      				match[0] = match[0].slice( 0, excess );
      				match[2] = unquoted.slice( 0, excess );
      			}
      
      			// Return only captures needed by the pseudo filter method (type and argument)
      			return match.slice( 0, 3 );
      		}
      	},
      
      	filter: {
      
      		"TAG": function( nodeNameSelector ) {
      			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
      			return nodeNameSelector === "*" ?
      				function() { return true; } :
      				function( elem ) {
      					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
      				};
      		},
      
      		"CLASS": function( className ) {
      			var pattern = classCache[ className + " " ];
      
      			return pattern ||
      				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
      				classCache( className, function( elem ) {
      					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
      				});
      		},
      
      		"ATTR": function( name, operator, check ) {
      			return function( elem ) {
      				var result = Sizzle.attr( elem, name );
      
      				if ( result == null ) {
      					return operator === "!=";
      				}
      				if ( !operator ) {
      					return true;
      				}
      
      				result += "";
      
      				return operator === "=" ? result === check :
      					operator === "!=" ? result !== check :
      					operator === "^=" ? check && result.indexOf( check ) === 0 :
      					operator === "*=" ? check && result.indexOf( check ) > -1 :
      					operator === "$=" ? check && result.slice( -check.length ) === check :
      					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
      					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
      					false;
      			};
      		},
      
      		"CHILD": function( type, what, argument, first, last ) {
      			var simple = type.slice( 0, 3 ) !== "nth",
      				forward = type.slice( -4 ) !== "last",
      				ofType = what === "of-type";
      
      			return first === 1 && last === 0 ?
      
      				// Shortcut for :nth-*(n)
      				function( elem ) {
      					return !!elem.parentNode;
      				} :
      
      				function( elem, context, xml ) {
      					var cache, outerCache, node, diff, nodeIndex, start,
      						dir = simple !== forward ? "nextSibling" : "previousSibling",
      						parent = elem.parentNode,
      						name = ofType && elem.nodeName.toLowerCase(),
      						useCache = !xml && !ofType;
      
      					if ( parent ) {
      
      						// :(first|last|only)-(child|of-type)
      						if ( simple ) {
      							while ( dir ) {
      								node = elem;
      								while ( (node = node[ dir ]) ) {
      									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
      										return false;
      									}
      								}
      								// Reverse direction for :only-* (if we haven't yet done so)
      								start = dir = type === "only" && !start && "nextSibling";
      							}
      							return true;
      						}
      
      						start = [ forward ? parent.firstChild : parent.lastChild ];
      
      						// non-xml :nth-child(...) stores cache data on `parent`
      						if ( forward && useCache ) {
      							// Seek `elem` from a previously-cached index
      							outerCache = parent[ expando ] || (parent[ expando ] = {});
      							cache = outerCache[ type ] || [];
      							nodeIndex = cache[0] === dirruns && cache[1];
      							diff = cache[0] === dirruns && cache[2];
      							node = nodeIndex && parent.childNodes[ nodeIndex ];
      
      							while ( (node = ++nodeIndex && node && node[ dir ] ||
      
      								// Fallback to seeking `elem` from the start
      								(diff = nodeIndex = 0) || start.pop()) ) {
      
      								// When found, cache indexes on `parent` and break
      								if ( node.nodeType === 1 && ++diff && node === elem ) {
      									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
      									break;
      								}
      							}
      
      						// Use previously-cached element index if available
      						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
      							diff = cache[1];
      
      						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
      						} else {
      							// Use the same loop as above to seek `elem` from the start
      							while ( (node = ++nodeIndex && node && node[ dir ] ||
      								(diff = nodeIndex = 0) || start.pop()) ) {
      
      								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
      									// Cache the index of each encountered element
      									if ( useCache ) {
      										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
      									}
      
      									if ( node === elem ) {
      										break;
      									}
      								}
      							}
      						}
      
      						// Incorporate the offset, then check against cycle size
      						diff -= last;
      						return diff === first || ( diff % first === 0 && diff / first >= 0 );
      					}
      				};
      		},
      
      		"PSEUDO": function( pseudo, argument ) {
      			// pseudo-class names are case-insensitive
      			// http://www.w3.org/TR/selectors/#pseudo-classes
      			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
      			// Remember that setFilters inherits from pseudos
      			var args,
      				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
      					Sizzle.error( "unsupported pseudo: " + pseudo );
      
      			// The user may use createPseudo to indicate that
      			// arguments are needed to create the filter function
      			// just as Sizzle does
      			if ( fn[ expando ] ) {
      				return fn( argument );
      			}
      
      			// But maintain support for old signatures
      			if ( fn.length > 1 ) {
      				args = [ pseudo, pseudo, "", argument ];
      				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
      					markFunction(function( seed, matches ) {
      						var idx,
      							matched = fn( seed, argument ),
      							i = matched.length;
      						while ( i-- ) {
      							idx = indexOf.call( seed, matched[i] );
      							seed[ idx ] = !( matches[ idx ] = matched[i] );
      						}
      					}) :
      					function( elem ) {
      						return fn( elem, 0, args );
      					};
      			}
      
      			return fn;
      		}
      	},
      
      	pseudos: {
      		// Potentially complex pseudos
      		"not": markFunction(function( selector ) {
      			// Trim the selector passed to compile
      			// to avoid treating leading and trailing
      			// spaces as combinators
      			var input = [],
      				results = [],
      				matcher = compile( selector.replace( rtrim, "$1" ) );
      
      			return matcher[ expando ] ?
      				markFunction(function( seed, matches, context, xml ) {
      					var elem,
      						unmatched = matcher( seed, null, xml, [] ),
      						i = seed.length;
      
      					// Match elements unmatched by `matcher`
      					while ( i-- ) {
      						if ( (elem = unmatched[i]) ) {
      							seed[i] = !(matches[i] = elem);
      						}
      					}
      				}) :
      				function( elem, context, xml ) {
      					input[0] = elem;
      					matcher( input, null, xml, results );
      					return !results.pop();
      				};
      		}),
      
      		"has": markFunction(function( selector ) {
      			return function( elem ) {
      				return Sizzle( selector, elem ).length > 0;
      			};
      		}),
      
      		"contains": markFunction(function( text ) {
      			return function( elem ) {
      				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
      			};
      		}),
      
      		// "Whether an element is represented by a :lang() selector
      		// is based solely on the element's language value
      		// being equal to the identifier C,
      		// or beginning with the identifier C immediately followed by "-".
      		// The matching of C against the element's language value is performed case-insensitively.
      		// The identifier C does not have to be a valid language name."
      		// http://www.w3.org/TR/selectors/#lang-pseudo
      		"lang": markFunction( function( lang ) {
      			// lang value must be a valid identifier
      			if ( !ridentifier.test(lang || "") ) {
      				Sizzle.error( "unsupported lang: " + lang );
      			}
      			lang = lang.replace( runescape, funescape ).toLowerCase();
      			return function( elem ) {
      				var elemLang;
      				do {
      					if ( (elemLang = documentIsHTML ?
      						elem.lang :
      						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {
      
      						elemLang = elemLang.toLowerCase();
      						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
      					}
      				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
      				return false;
      			};
      		}),
      
      		// Miscellaneous
      		"target": function( elem ) {
      			var hash = window.location && window.location.hash;
      			return hash && hash.slice( 1 ) === elem.id;
      		},
      
      		"root": function( elem ) {
      			return elem === docElem;
      		},
      
      		"focus": function( elem ) {
      			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
      		},
      
      		// Boolean properties
      		"enabled": function( elem ) {
      			return elem.disabled === false;
      		},
      
      		"disabled": function( elem ) {
      			return elem.disabled === true;
      		},
      
      		"checked": function( elem ) {
      			// In CSS3, :checked should return both checked and selected elements
      			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
      			var nodeName = elem.nodeName.toLowerCase();
      			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
      		},
      
      		"selected": function( elem ) {
      			// Accessing this property makes selected-by-default
      			// options in Safari work properly
      			if ( elem.parentNode ) {
      				elem.parentNode.selectedIndex;
      			}
      
      			return elem.selected === true;
      		},
      
      		// Contents
      		"empty": function( elem ) {
      			// http://www.w3.org/TR/selectors/#empty-pseudo
      			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
      			//   not comment, processing instructions, or others
      			// Thanks to Diego Perini for the nodeName shortcut
      			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
      			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
      				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
      					return false;
      				}
      			}
      			return true;
      		},
      
      		"parent": function( elem ) {
      			return !Expr.pseudos["empty"]( elem );
      		},
      
      		// Element/input types
      		"header": function( elem ) {
      			return rheader.test( elem.nodeName );
      		},
      
      		"input": function( elem ) {
      			return rinputs.test( elem.nodeName );
      		},
      
      		"button": function( elem ) {
      			var name = elem.nodeName.toLowerCase();
      			return name === "input" && elem.type === "button" || name === "button";
      		},
      
      		"text": function( elem ) {
      			var attr;
      			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
      			// use getAttribute instead to test this case
      			return elem.nodeName.toLowerCase() === "input" &&
      				elem.type === "text" &&
      				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
      		},
      
      		// Position-in-collection
      		"first": createPositionalPseudo(function() {
      			return [ 0 ];
      		}),
      
      		"last": createPositionalPseudo(function( matchIndexes, length ) {
      			return [ length - 1 ];
      		}),
      
      		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
      			return [ argument < 0 ? argument + length : argument ];
      		}),
      
      		"even": createPositionalPseudo(function( matchIndexes, length ) {
      			var i = 0;
      			for ( ; i < length; i += 2 ) {
      				matchIndexes.push( i );
      			}
      			return matchIndexes;
      		}),
      
      		"odd": createPositionalPseudo(function( matchIndexes, length ) {
      			var i = 1;
      			for ( ; i < length; i += 2 ) {
      				matchIndexes.push( i );
      			}
      			return matchIndexes;
      		}),
      
      		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
      			var i = argument < 0 ? argument + length : argument;
      			for ( ; --i >= 0; ) {
      				matchIndexes.push( i );
      			}
      			return matchIndexes;
      		}),
      
      		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
      			var i = argument < 0 ? argument + length : argument;
      			for ( ; ++i < length; ) {
      				matchIndexes.push( i );
      			}
      			return matchIndexes;
      		})
      	}
      };
      
      Expr.pseudos["nth"] = Expr.pseudos["eq"];
      
      // Add button/input type pseudos
      for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
      	Expr.pseudos[ i ] = createInputPseudo( i );
      }
      for ( i in { submit: true, reset: true } ) {
      	Expr.pseudos[ i ] = createButtonPseudo( i );
      }
      
      // Easy API for creating new setFilters
      function setFilters() {}
      setFilters.prototype = Expr.filters = Expr.pseudos;
      Expr.setFilters = new setFilters();
      
      function tokenize( selector, parseOnly ) {
      	var matched, match, tokens, type,
      		soFar, groups, preFilters,
      		cached = tokenCache[ selector + " " ];
      
      	if ( cached ) {
      		return parseOnly ? 0 : cached.slice( 0 );
      	}
      
      	soFar = selector;
      	groups = [];
      	preFilters = Expr.preFilter;
      
      	while ( soFar ) {
      
      		// Comma and first run
      		if ( !matched || (match = rcomma.exec( soFar )) ) {
      			if ( match ) {
      				// Don't consume trailing commas as valid
      				soFar = soFar.slice( match[0].length ) || soFar;
      			}
      			groups.push( tokens = [] );
      		}
      
      		matched = false;
      
      		// Combinators
      		if ( (match = rcombinators.exec( soFar )) ) {
      			matched = match.shift();
      			tokens.push({
      				value: matched,
      				// Cast descendant combinators to space
      				type: match[0].replace( rtrim, " " )
      			});
      			soFar = soFar.slice( matched.length );
      		}
      
      		// Filters
      		for ( type in Expr.filter ) {
      			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
      				(match = preFilters[ type ]( match ))) ) {
      				matched = match.shift();
      				tokens.push({
      					value: matched,
      					type: type,
      					matches: match
      				});
      				soFar = soFar.slice( matched.length );
      			}
      		}
      
      		if ( !matched ) {
      			break;
      		}
      	}
      
      	// Return the length of the invalid excess
      	// if we're just parsing
      	// Otherwise, throw an error or return tokens
      	return parseOnly ?
      		soFar.length :
      		soFar ?
      			Sizzle.error( selector ) :
      			// Cache the tokens
      			tokenCache( selector, groups ).slice( 0 );
      }
      
      function toSelector( tokens ) {
      	var i = 0,
      		len = tokens.length,
      		selector = "";
      	for ( ; i < len; i++ ) {
      		selector += tokens[i].value;
      	}
      	return selector;
      }
      
      function addCombinator( matcher, combinator, base ) {
      	var dir = combinator.dir,
      		checkNonElements = base && dir === "parentNode",
      		doneName = done++;
      
      	return combinator.first ?
      		// Check against closest ancestor/preceding element
      		function( elem, context, xml ) {
      			while ( (elem = elem[ dir ]) ) {
      				if ( elem.nodeType === 1 || checkNonElements ) {
      					return matcher( elem, context, xml );
      				}
      			}
      		} :
      
      		// Check against all ancestor/preceding elements
      		function( elem, context, xml ) {
      			var data, cache, outerCache,
      				dirkey = dirruns + " " + doneName;
      
      			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
      			if ( xml ) {
      				while ( (elem = elem[ dir ]) ) {
      					if ( elem.nodeType === 1 || checkNonElements ) {
      						if ( matcher( elem, context, xml ) ) {
      							return true;
      						}
      					}
      				}
      			} else {
      				while ( (elem = elem[ dir ]) ) {
      					if ( elem.nodeType === 1 || checkNonElements ) {
      						outerCache = elem[ expando ] || (elem[ expando ] = {});
      						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
      							if ( (data = cache[1]) === true || data === cachedruns ) {
      								return data === true;
      							}
      						} else {
      							cache = outerCache[ dir ] = [ dirkey ];
      							cache[1] = matcher( elem, context, xml ) || cachedruns;
      							if ( cache[1] === true ) {
      								return true;
      							}
      						}
      					}
      				}
      			}
      		};
      }
      
      function elementMatcher( matchers ) {
      	return matchers.length > 1 ?
      		function( elem, context, xml ) {
      			var i = matchers.length;
      			while ( i-- ) {
      				if ( !matchers[i]( elem, context, xml ) ) {
      					return false;
      				}
      			}
      			return true;
      		} :
      		matchers[0];
      }
      
      function condense( unmatched, map, filter, context, xml ) {
      	var elem,
      		newUnmatched = [],
      		i = 0,
      		len = unmatched.length,
      		mapped = map != null;
      
      	for ( ; i < len; i++ ) {
      		if ( (elem = unmatched[i]) ) {
      			if ( !filter || filter( elem, context, xml ) ) {
      				newUnmatched.push( elem );
      				if ( mapped ) {
      					map.push( i );
      				}
      			}
      		}
      	}
      
      	return newUnmatched;
      }
      
      function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
      	if ( postFilter && !postFilter[ expando ] ) {
      		postFilter = setMatcher( postFilter );
      	}
      	if ( postFinder && !postFinder[ expando ] ) {
      		postFinder = setMatcher( postFinder, postSelector );
      	}
      	return markFunction(function( seed, results, context, xml ) {
      		var temp, i, elem,
      			preMap = [],
      			postMap = [],
      			preexisting = results.length,
      
      			// Get initial elements from seed or context
      			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),
      
      			// Prefilter to get matcher input, preserving a map for seed-results synchronization
      			matcherIn = preFilter && ( seed || !selector ) ?
      				condense( elems, preMap, preFilter, context, xml ) :
      				elems,
      
      			matcherOut = matcher ?
      				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
      				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?
      
      					// ...intermediate processing is necessary
      					[] :
      
      					// ...otherwise use results directly
      					results :
      				matcherIn;
      
      		// Find primary matches
      		if ( matcher ) {
      			matcher( matcherIn, matcherOut, context, xml );
      		}
      
      		// Apply postFilter
      		if ( postFilter ) {
      			temp = condense( matcherOut, postMap );
      			postFilter( temp, [], context, xml );
      
      			// Un-match failing elements by moving them back to matcherIn
      			i = temp.length;
      			while ( i-- ) {
      				if ( (elem = temp[i]) ) {
      					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
      				}
      			}
      		}
      
      		if ( seed ) {
      			if ( postFinder || preFilter ) {
      				if ( postFinder ) {
      					// Get the final matcherOut by condensing this intermediate into postFinder contexts
      					temp = [];
      					i = matcherOut.length;
      					while ( i-- ) {
      						if ( (elem = matcherOut[i]) ) {
      							// Restore matcherIn since elem is not yet a final match
      							temp.push( (matcherIn[i] = elem) );
      						}
      					}
      					postFinder( null, (matcherOut = []), temp, xml );
      				}
      
      				// Move matched elements from seed to results to keep them synchronized
      				i = matcherOut.length;
      				while ( i-- ) {
      					if ( (elem = matcherOut[i]) &&
      						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {
      
      						seed[temp] = !(results[temp] = elem);
      					}
      				}
      			}
      
      		// Add elements to results, through postFinder if defined
      		} else {
      			matcherOut = condense(
      				matcherOut === results ?
      					matcherOut.splice( preexisting, matcherOut.length ) :
      					matcherOut
      			);
      			if ( postFinder ) {
      				postFinder( null, results, matcherOut, xml );
      			} else {
      				push.apply( results, matcherOut );
      			}
      		}
      	});
      }
      
      function matcherFromTokens( tokens ) {
      	var checkContext, matcher, j,
      		len = tokens.length,
      		leadingRelative = Expr.relative[ tokens[0].type ],
      		implicitRelative = leadingRelative || Expr.relative[" "],
      		i = leadingRelative ? 1 : 0,
      
      		// The foundational matcher ensures that elements are reachable from top-level context(s)
      		matchContext = addCombinator( function( elem ) {
      			return elem === checkContext;
      		}, implicitRelative, true ),
      		matchAnyContext = addCombinator( function( elem ) {
      			return indexOf.call( checkContext, elem ) > -1;
      		}, implicitRelative, true ),
      		matchers = [ function( elem, context, xml ) {
      			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
      				(checkContext = context).nodeType ?
      					matchContext( elem, context, xml ) :
      					matchAnyContext( elem, context, xml ) );
      		} ];
      
      	for ( ; i < len; i++ ) {
      		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
      			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
      		} else {
      			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );
      
      			// Return special upon seeing a positional matcher
      			if ( matcher[ expando ] ) {
      				// Find the next relative operator (if any) for proper handling
      				j = ++i;
      				for ( ; j < len; j++ ) {
      					if ( Expr.relative[ tokens[j].type ] ) {
      						break;
      					}
      				}
      				return setMatcher(
      					i > 1 && elementMatcher( matchers ),
      					i > 1 && toSelector(
      						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
      						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
      					).replace( rtrim, "$1" ),
      					matcher,
      					i < j && matcherFromTokens( tokens.slice( i, j ) ),
      					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
      					j < len && toSelector( tokens )
      				);
      			}
      			matchers.push( matcher );
      		}
      	}
      
      	return elementMatcher( matchers );
      }
      
      function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
      	// A counter to specify which element is currently being matched
      	var matcherCachedRuns = 0,
      		bySet = setMatchers.length > 0,
      		byElement = elementMatchers.length > 0,
      		superMatcher = function( seed, context, xml, results, expandContext ) {
      			var elem, j, matcher,
      				setMatched = [],
      				matchedCount = 0,
      				i = "0",
      				unmatched = seed && [],
      				outermost = expandContext != null,
      				contextBackup = outermostContext,
      				// We must always have either seed elements or context
      				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
      				// Use integer dirruns iff this is the outermost matcher
      				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);
      
      			if ( outermost ) {
      				outermostContext = context !== document && context;
      				cachedruns = matcherCachedRuns;
      			}
      
      			// Add elements passing elementMatchers directly to results
      			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
      			for ( ; (elem = elems[i]) != null; i++ ) {
      				if ( byElement && elem ) {
      					j = 0;
      					while ( (matcher = elementMatchers[j++]) ) {
      						if ( matcher( elem, context, xml ) ) {
      							results.push( elem );
      							break;
      						}
      					}
      					if ( outermost ) {
      						dirruns = dirrunsUnique;
      						cachedruns = ++matcherCachedRuns;
      					}
      				}
      
      				// Track unmatched elements for set filters
      				if ( bySet ) {
      					// They will have gone through all possible matchers
      					if ( (elem = !matcher && elem) ) {
      						matchedCount--;
      					}
      
      					// Lengthen the array for every element, matched or not
      					if ( seed ) {
      						unmatched.push( elem );
      					}
      				}
      			}
      
      			// Apply set filters to unmatched elements
      			matchedCount += i;
      			if ( bySet && i !== matchedCount ) {
      				j = 0;
      				while ( (matcher = setMatchers[j++]) ) {
      					matcher( unmatched, setMatched, context, xml );
      				}
      
      				if ( seed ) {
      					// Reintegrate element matches to eliminate the need for sorting
      					if ( matchedCount > 0 ) {
      						while ( i-- ) {
      							if ( !(unmatched[i] || setMatched[i]) ) {
      								setMatched[i] = pop.call( results );
      							}
      						}
      					}
      
      					// Discard index placeholder values to get only actual matches
      					setMatched = condense( setMatched );
      				}
      
      				// Add matches to results
      				push.apply( results, setMatched );
      
      				// Seedless set matches succeeding multiple successful matchers stipulate sorting
      				if ( outermost && !seed && setMatched.length > 0 &&
      					( matchedCount + setMatchers.length ) > 1 ) {
      
      					Sizzle.uniqueSort( results );
      				}
      			}
      
      			// Override manipulation of globals by nested matchers
      			if ( outermost ) {
      				dirruns = dirrunsUnique;
      				outermostContext = contextBackup;
      			}
      
      			return unmatched;
      		};
      
      	return bySet ?
      		markFunction( superMatcher ) :
      		superMatcher;
      }
      
      compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
      	var i,
      		setMatchers = [],
      		elementMatchers = [],
      		cached = compilerCache[ selector + " " ];
      
      	if ( !cached ) {
      		// Generate a function of recursive functions that can be used to check each element
      		if ( !group ) {
      			group = tokenize( selector );
      		}
      		i = group.length;
      		while ( i-- ) {
      			cached = matcherFromTokens( group[i] );
      			if ( cached[ expando ] ) {
      				setMatchers.push( cached );
      			} else {
      				elementMatchers.push( cached );
      			}
      		}
      
      		// Cache the compiled function
      		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
      	}
      	return cached;
      };
      
      function multipleContexts( selector, contexts, results ) {
      	var i = 0,
      		len = contexts.length;
      	for ( ; i < len; i++ ) {
      		Sizzle( selector, contexts[i], results );
      	}
      	return results;
      }
      
      function select( selector, context, results, seed ) {
      	var i, tokens, token, type, find,
      		match = tokenize( selector );
      
      	if ( !seed ) {
      		// Try to minimize operations if there is only one group
      		if ( match.length === 1 ) {
      
      			// Take a shortcut and set the context if the root selector is an ID
      			tokens = match[0] = match[0].slice( 0 );
      			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
      					support.getById && context.nodeType === 9 && documentIsHTML &&
      					Expr.relative[ tokens[1].type ] ) {
      
      				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
      				if ( !context ) {
      					return results;
      				}
      				selector = selector.slice( tokens.shift().value.length );
      			}
      
      			// Fetch a seed set for right-to-left matching
      			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
      			while ( i-- ) {
      				token = tokens[i];
      
      				// Abort if we hit a combinator
      				if ( Expr.relative[ (type = token.type) ] ) {
      					break;
      				}
      				if ( (find = Expr.find[ type ]) ) {
      					// Search, expanding context for leading sibling combinators
      					if ( (seed = find(
      						token.matches[0].replace( runescape, funescape ),
      						rsibling.test( tokens[0].type ) && context.parentNode || context
      					)) ) {
      
      						// If seed is empty or no tokens remain, we can return early
      						tokens.splice( i, 1 );
      						selector = seed.length && toSelector( tokens );
      						if ( !selector ) {
      							push.apply( results, seed );
      							return results;
      						}
      
      						break;
      					}
      				}
      			}
      		}
      	}
      
      	// Compile and execute a filtering function
      	// Provide `match` to avoid retokenization if we modified the selector above
      	compile( selector, match )(
      		seed,
      		context,
      		!documentIsHTML,
      		results,
      		rsibling.test( selector )
      	);
      	return results;
      }
      
      // One-time assignments
      
      // Sort stability
      support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;
      
      // Support: Chrome<14
      // Always assume duplicates if they aren't passed to the comparison function
      support.detectDuplicates = hasDuplicate;
      
      // Initialize against the default document
      setDocument();
      
      // Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
      // Detached nodes confoundingly follow *each other*
      support.sortDetached = assert(function( div1 ) {
      	// Should return 1, but returns 4 (following)
      	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
      });
      
      // Support: IE<8
      // Prevent attribute/property "interpolation"
      // http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
      if ( !assert(function( div ) {
      	div.innerHTML = "<a href='#'></a>";
      	return div.firstChild.getAttribute("href") === "#" ;
      }) ) {
      	addHandle( "type|href|height|width", function( elem, name, isXML ) {
      		if ( !isXML ) {
      			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
      		}
      	});
      }
      
      // Support: IE<9
      // Use defaultValue in place of getAttribute("value")
      if ( !support.attributes || !assert(function( div ) {
      	div.innerHTML = "<input/>";
      	div.firstChild.setAttribute( "value", "" );
      	return div.firstChild.getAttribute( "value" ) === "";
      }) ) {
      	addHandle( "value", function( elem, name, isXML ) {
      		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
      			return elem.defaultValue;
      		}
      	});
      }
      
      // Support: IE<9
      // Use getAttributeNode to fetch booleans when getAttribute lies
      if ( !assert(function( div ) {
      	return div.getAttribute("disabled") == null;
      }) ) {
      	addHandle( booleans, function( elem, name, isXML ) {
      		var val;
      		if ( !isXML ) {
      			return (val = elem.getAttributeNode( name )) && val.specified ?
      				val.value :
      				elem[ name ] === true ? name.toLowerCase() : null;
      		}
      	});
      }
      
      jQuery.find = Sizzle;
      jQuery.expr = Sizzle.selectors;
      jQuery.expr[":"] = jQuery.expr.pseudos;
      jQuery.unique = Sizzle.uniqueSort;
      jQuery.text = Sizzle.getText;
      jQuery.isXMLDoc = Sizzle.isXML;
      jQuery.contains = Sizzle.contains;
      
      
      })( window );
      // String to Object options format cache
      var optionsCache = {};
      
      // Convert String-formatted options into Object-formatted ones and store in cache
      function createOptions( options ) {
      	var object = optionsCache[ options ] = {};
      	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
      		object[ flag ] = true;
      	});
      	return object;
      }
      
      /*
       * Create a callback list using the following parameters:
       *
       *	options: an optional list of space-separated options that will change how
       *			the callback list behaves or a more traditional option object
       *
       * By default a callback list will act like an event callback list and can be
       * "fired" multiple times.
       *
       * Possible options:
       *
       *	once:			will ensure the callback list can only be fired once (like a Deferred)
       *
       *	memory:			will keep track of previous values and will call any callback added
       *					after the list has been fired right away with the latest "memorized"
       *					values (like a Deferred)
       *
       *	unique:			will ensure a callback can only be added once (no duplicate in the list)
       *
       *	stopOnFalse:	interrupt callings when a callback returns false
       *
       */
      jQuery.Callbacks = function( options ) {
      
      	// Convert options from String-formatted to Object-formatted if needed
      	// (we check in cache first)
      	options = typeof options === "string" ?
      		( optionsCache[ options ] || createOptions( options ) ) :
      		jQuery.extend( {}, options );
      
      	var // Last fire value (for non-forgettable lists)
      		memory,
      		// Flag to know if list was already fired
      		fired,
      		// Flag to know if list is currently firing
      		firing,
      		// First callback to fire (used internally by add and fireWith)
      		firingStart,
      		// End of the loop when firing
      		firingLength,
      		// Index of currently firing callback (modified by remove if needed)
      		firingIndex,
      		// Actual callback list
      		list = [],
      		// Stack of fire calls for repeatable lists
      		stack = !options.once && [],
      		// Fire callbacks
      		fire = function( data ) {
      			memory = options.memory && data;
      			fired = true;
      			firingIndex = firingStart || 0;
      			firingStart = 0;
      			firingLength = list.length;
      			firing = true;
      			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
      				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
      					memory = false; // To prevent further calls using add
      					break;
      				}
      			}
      			firing = false;
      			if ( list ) {
      				if ( stack ) {
      					if ( stack.length ) {
      						fire( stack.shift() );
      					}
      				} else if ( memory ) {
      					list = [];
      				} else {
      					self.disable();
      				}
      			}
      		},
      		// Actual Callbacks object
      		self = {
      			// Add a callback or a collection of callbacks to the list
      			add: function() {
      				if ( list ) {
      					// First, we save the current length
      					var start = list.length;
      					(function add( args ) {
      						jQuery.each( args, function( _, arg ) {
      							var type = jQuery.type( arg );
      							if ( type === "function" ) {
      								if ( !options.unique || !self.has( arg ) ) {
      									list.push( arg );
      								}
      							} else if ( arg && arg.length && type !== "string" ) {
      								// Inspect recursively
      								add( arg );
      							}
      						});
      					})( arguments );
      					// Do we need to add the callbacks to the
      					// current firing batch?
      					if ( firing ) {
      						firingLength = list.length;
      					// With memory, if we're not firing then
      					// we should call right away
      					} else if ( memory ) {
      						firingStart = start;
      						fire( memory );
      					}
      				}
      				return this;
      			},
      			// Remove a callback from the list
      			remove: function() {
      				if ( list ) {
      					jQuery.each( arguments, function( _, arg ) {
      						var index;
      						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
      							list.splice( index, 1 );
      							// Handle firing indexes
      							if ( firing ) {
      								if ( index <= firingLength ) {
      									firingLength--;
      								}
      								if ( index <= firingIndex ) {
      									firingIndex--;
      								}
      							}
      						}
      					});
      				}
      				return this;
      			},
      			// Check if a given callback is in the list.
      			// If no argument is given, return whether or not list has callbacks attached.
      			has: function( fn ) {
      				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
      			},
      			// Remove all callbacks from the list
      			empty: function() {
      				list = [];
      				firingLength = 0;
      				return this;
      			},
      			// Have the list do nothing anymore
      			disable: function() {
      				list = stack = memory = undefined;
      				return this;
      			},
      			// Is it disabled?
      			disabled: function() {
      				return !list;
      			},
      			// Lock the list in its current state
      			lock: function() {
      				stack = undefined;
      				if ( !memory ) {
      					self.disable();
      				}
      				return this;
      			},
      			// Is it locked?
      			locked: function() {
      				return !stack;
      			},
      			// Call all callbacks with the given context and arguments
      			fireWith: function( context, args ) {
      				if ( list && ( !fired || stack ) ) {
      					args = args || [];
      					args = [ context, args.slice ? args.slice() : args ];
      					if ( firing ) {
      						stack.push( args );
      					} else {
      						fire( args );
      					}
      				}
      				return this;
      			},
      			// Call all the callbacks with the given arguments
      			fire: function() {
      				self.fireWith( this, arguments );
      				return this;
      			},
      			// To know if the callbacks have already been called at least once
      			fired: function() {
      				return !!fired;
      			}
      		};
      
      	return self;
      };
      jQuery.extend({
      
      	Deferred: function( func ) {
      		var tuples = [
      				// action, add listener, listener list, final state
      				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
      				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
      				[ "notify", "progress", jQuery.Callbacks("memory") ]
      			],
      			state = "pending",
      			promise = {
      				state: function() {
      					return state;
      				},
      				always: function() {
      					deferred.done( arguments ).fail( arguments );
      					return this;
      				},
      				then: function( /* fnDone, fnFail, fnProgress */ ) {
      					var fns = arguments;
      					return jQuery.Deferred(function( newDefer ) {
      						jQuery.each( tuples, function( i, tuple ) {
      							var action = tuple[ 0 ],
      								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
      							// deferred[ done | fail | progress ] for forwarding actions to newDefer
      							deferred[ tuple[1] ](function() {
      								var returned = fn && fn.apply( this, arguments );
      								if ( returned && jQuery.isFunction( returned.promise ) ) {
      									returned.promise()
      										.done( newDefer.resolve )
      										.fail( newDefer.reject )
      										.progress( newDefer.notify );
      								} else {
      									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
      								}
      							});
      						});
      						fns = null;
      					}).promise();
      				},
      				// Get a promise for this deferred
      				// If obj is provided, the promise aspect is added to the object
      				promise: function( obj ) {
      					return obj != null ? jQuery.extend( obj, promise ) : promise;
      				}
      			},
      			deferred = {};
      
      		// Keep pipe for back-compat
      		promise.pipe = promise.then;
      
      		// Add list-specific methods
      		jQuery.each( tuples, function( i, tuple ) {
      			var list = tuple[ 2 ],
      				stateString = tuple[ 3 ];
      
      			// promise[ done | fail | progress ] = list.add
      			promise[ tuple[1] ] = list.add;
      
      			// Handle state
      			if ( stateString ) {
      				list.add(function() {
      					// state = [ resolved | rejected ]
      					state = stateString;
      
      				// [ reject_list | resolve_list ].disable; progress_list.lock
      				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
      			}
      
      			// deferred[ resolve | reject | notify ]
      			deferred[ tuple[0] ] = function() {
      				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
      				return this;
      			};
      			deferred[ tuple[0] + "With" ] = list.fireWith;
      		});
      
      		// Make the deferred a promise
      		promise.promise( deferred );
      
      		// Call given func if any
      		if ( func ) {
      			func.call( deferred, deferred );
      		}
      
      		// All done!
      		return deferred;
      	},
      
      	// Deferred helper
      	when: function( subordinate /* , ..., subordinateN */ ) {
      		var i = 0,
      			resolveValues = core_slice.call( arguments ),
      			length = resolveValues.length,
      
      			// the count of uncompleted subordinates
      			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,
      
      			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
      			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),
      
      			// Update function for both resolve and progress values
      			updateFunc = function( i, contexts, values ) {
      				return function( value ) {
      					contexts[ i ] = this;
      					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
      					if( values === progressValues ) {
      						deferred.notifyWith( contexts, values );
      					} else if ( !( --remaining ) ) {
      						deferred.resolveWith( contexts, values );
      					}
      				};
      			},
      
      			progressValues, progressContexts, resolveContexts;
      
      		// add listeners to Deferred subordinates; treat others as resolved
      		if ( length > 1 ) {
      			progressValues = new Array( length );
      			progressContexts = new Array( length );
      			resolveContexts = new Array( length );
      			for ( ; i < length; i++ ) {
      				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
      					resolveValues[ i ].promise()
      						.done( updateFunc( i, resolveContexts, resolveValues ) )
      						.fail( deferred.reject )
      						.progress( updateFunc( i, progressContexts, progressValues ) );
      				} else {
      					--remaining;
      				}
      			}
      		}
      
      		// if we're not waiting on anything, resolve the master
      		if ( !remaining ) {
      			deferred.resolveWith( resolveContexts, resolveValues );
      		}
      
      		return deferred.promise();
      	}
      });
      jQuery.support = (function( support ) {
      	var input = document.createElement("input"),
      		fragment = document.createDocumentFragment(),
      		div = document.createElement("div"),
      		select = document.createElement("select"),
      		opt = select.appendChild( document.createElement("option") );
      
      	// Finish early in limited environments
      	if ( !input.type ) {
      		return support;
      	}
      
      	input.type = "checkbox";
      
      	// Support: Safari 5.1, iOS 5.1, Android 4.x, Android 2.3
      	// Check the default checkbox/radio value ("" on old WebKit; "on" elsewhere)
      	support.checkOn = input.value !== "";
      
      	// Must access the parent to make an option select properly
      	// Support: IE9, IE10
      	support.optSelected = opt.selected;
      
      	// Will be defined later
      	support.reliableMarginRight = true;
      	support.boxSizingReliable = true;
      	support.pixelPosition = false;
      
      	// Make sure checked status is properly cloned
      	// Support: IE9, IE10
      	input.checked = true;
      	support.noCloneChecked = input.cloneNode( true ).checked;
      
      	// Make sure that the options inside disabled selects aren't marked as disabled
      	// (WebKit marks them as disabled)
      	select.disabled = true;
      	support.optDisabled = !opt.disabled;
      
      	// Check if an input maintains its value after becoming a radio
      	// Support: IE9, IE10
      	input = document.createElement("input");
      	input.value = "t";
      	input.type = "radio";
      	support.radioValue = input.value === "t";
      
      	// #11217 - WebKit loses check when the name is after the checked attribute
      	input.setAttribute( "checked", "t" );
      	input.setAttribute( "name", "t" );
      
      	fragment.appendChild( input );
      
      	// Support: Safari 5.1, Android 4.x, Android 2.3
      	// old WebKit doesn't clone checked state correctly in fragments
      	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;
      
      	// Support: Firefox, Chrome, Safari
      	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
      	support.focusinBubbles = "onfocusin" in window;
      
      	div.style.backgroundClip = "content-box";
      	div.cloneNode( true ).style.backgroundClip = "";
      	support.clearCloneStyle = div.style.backgroundClip === "content-box";
      
      	// Run tests that need a body at doc ready
      	jQuery(function() {
      		var container, marginDiv,
      			// Support: Firefox, Android 2.3 (Prefixed box-sizing versions).
      			divReset = "padding:0;margin:0;border:0;display:block;-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box",
      			body = document.getElementsByTagName("body")[ 0 ];
      
      		if ( !body ) {
      			// Return for frameset docs that don't have a body
      			return;
      		}
      
      		container = document.createElement("div");
      		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";
      
      		// Check box-sizing and margin behavior.
      		body.appendChild( container ).appendChild( div );
      		div.innerHTML = "";
      		// Support: Firefox, Android 2.3 (Prefixed box-sizing versions).
      		div.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%";
      
      		// Workaround failing boxSizing test due to offsetWidth returning wrong value
      		// with some non-1 values of body zoom, ticket #13543
      		jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
      			support.boxSizing = div.offsetWidth === 4;
      		});
      
      		// Use window.getComputedStyle because jsdom on node.js will break without it.
      		if ( window.getComputedStyle ) {
      			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
      			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";
      
      			// Support: Android 2.3
      			// Check if div with explicit width and no margin-right incorrectly
      			// gets computed margin-right based on width of container. (#3333)
      			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
      			marginDiv = div.appendChild( document.createElement("div") );
      			marginDiv.style.cssText = div.style.cssText = divReset;
      			marginDiv.style.marginRight = marginDiv.style.width = "0";
      			div.style.width = "1px";
      
      			support.reliableMarginRight =
      				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
      		}
      
      		body.removeChild( container );
      	});
      
      	return support;
      })( {} );
      
      /*
      	Implementation Summary
      
      	1. Enforce API surface and semantic compatibility with 1.9.x branch
      	2. Improve the module's maintainability by reducing the storage
      		paths to a single mechanism.
      	3. Use the same single mechanism to support "private" and "user" data.
      	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
      	5. Avoid exposing implementation details on user objects (eg. expando properties)
      	6. Provide a clear path for implementation upgrade to WeakMap in 2014
      */
      var data_user, data_priv,
      	rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
      	rmultiDash = /([A-Z])/g;
      
      function Data() {
      	// Support: Android < 4,
      	// Old WebKit does not have Object.preventExtensions/freeze method,
      	// return new empty object instead with no [[set]] accessor
      	Object.defineProperty( this.cache = {}, 0, {
      		get: function() {
      			return {};
      		}
      	});
      
      	this.expando = jQuery.expando + Math.random();
      }
      
      Data.uid = 1;
      
      Data.accepts = function( owner ) {
      	// Accepts only:
      	//  - Node
      	//    - Node.ELEMENT_NODE
      	//    - Node.DOCUMENT_NODE
      	//  - Object
      	//    - Any
      	return owner.nodeType ?
      		owner.nodeType === 1 || owner.nodeType === 9 : true;
      };
      
      Data.prototype = {
      	key: function( owner ) {
      		// We can accept data for non-element nodes in modern browsers,
      		// but we should not, see #8335.
      		// Always return the key for a frozen object.
      		if ( !Data.accepts( owner ) ) {
      			return 0;
      		}
      
      		var descriptor = {},
      			// Check if the owner object already has a cache key
      			unlock = owner[ this.expando ];
      
      		// If not, create one
      		if ( !unlock ) {
      			unlock = Data.uid++;
      
      			// Secure it in a non-enumerable, non-writable property
      			try {
      				descriptor[ this.expando ] = { value: unlock };
      				Object.defineProperties( owner, descriptor );
      
      			// Support: Android < 4
      			// Fallback to a less secure definition
      			} catch ( e ) {
      				descriptor[ this.expando ] = unlock;
      				jQuery.extend( owner, descriptor );
      			}
      		}
      
      		// Ensure the cache object
      		if ( !this.cache[ unlock ] ) {
      			this.cache[ unlock ] = {};
      		}
      
      		return unlock;
      	},
      	set: function( owner, data, value ) {
      		var prop,
      			// There may be an unlock assigned to this node,
      			// if there is no entry for this "owner", create one inline
      			// and set the unlock as though an owner entry had always existed
      			unlock = this.key( owner ),
      			cache = this.cache[ unlock ];
      
      		// Handle: [ owner, key, value ] args
      		if ( typeof data === "string" ) {
      			cache[ data ] = value;
      
      		// Handle: [ owner, { properties } ] args
      		} else {
      			// Fresh assignments by object are shallow copied
      			if ( jQuery.isEmptyObject( cache ) ) {
      				jQuery.extend( this.cache[ unlock ], data );
      			// Otherwise, copy the properties one-by-one to the cache object
      			} else {
      				for ( prop in data ) {
      					cache[ prop ] = data[ prop ];
      				}
      			}
      		}
      		return cache;
      	},
      	get: function( owner, key ) {
      		// Either a valid cache is found, or will be created.
      		// New caches will be created and the unlock returned,
      		// allowing direct access to the newly created
      		// empty data object. A valid owner object must be provided.
      		var cache = this.cache[ this.key( owner ) ];
      
      		return key === undefined ?
      			cache : cache[ key ];
      	},
      	access: function( owner, key, value ) {
      		var stored;
      		// In cases where either:
      		//
      		//   1. No key was specified
      		//   2. A string key was specified, but no value provided
      		//
      		// Take the "read" path and allow the get method to determine
      		// which value to return, respectively either:
      		//
      		//   1. The entire cache object
      		//   2. The data stored at the key
      		//
      		if ( key === undefined ||
      				((key && typeof key === "string") && value === undefined) ) {
      
      			stored = this.get( owner, key );
      
      			return stored !== undefined ?
      				stored : this.get( owner, jQuery.camelCase(key) );
      		}
      
      		// [*]When the key is not a string, or both a key and value
      		// are specified, set or extend (existing objects) with either:
      		//
      		//   1. An object of properties
      		//   2. A key and value
      		//
      		this.set( owner, key, value );
      
      		// Since the "set" path can have two possible entry points
      		// return the expected data based on which path was taken[*]
      		return value !== undefined ? value : key;
      	},
      	remove: function( owner, key ) {
      		var i, name, camel,
      			unlock = this.key( owner ),
      			cache = this.cache[ unlock ];
      
      		if ( key === undefined ) {
      			this.cache[ unlock ] = {};
      
      		} else {
      			// Support array or space separated string of keys
      			if ( jQuery.isArray( key ) ) {
      				// If "name" is an array of keys...
      				// When data is initially created, via ("key", "val") signature,
      				// keys will be converted to camelCase.
      				// Since there is no way to tell _how_ a key was added, remove
      				// both plain key and camelCase key. #12786
      				// This will only penalize the array argument path.
      				name = key.concat( key.map( jQuery.camelCase ) );
      			} else {
      				camel = jQuery.camelCase( key );
      				// Try the string as a key before any manipulation
      				if ( key in cache ) {
      					name = [ key, camel ];
      				} else {
      					// If a key with the spaces exists, use it.
      					// Otherwise, create an array by matching non-whitespace
      					name = camel;
      					name = name in cache ?
      						[ name ] : ( name.match( core_rnotwhite ) || [] );
      				}
      			}
      
      			i = name.length;
      			while ( i-- ) {
      				delete cache[ name[ i ] ];
      			}
      		}
      	},
      	hasData: function( owner ) {
      		return !jQuery.isEmptyObject(
      			this.cache[ owner[ this.expando ] ] || {}
      		);
      	},
      	discard: function( owner ) {
      		if ( owner[ this.expando ] ) {
      			delete this.cache[ owner[ this.expando ] ];
      		}
      	}
      };
      
      // These may be used throughout the jQuery core codebase
      data_user = new Data();
      data_priv = new Data();
      
      
      jQuery.extend({
      	acceptData: Data.accepts,
      
      	hasData: function( elem ) {
      		return data_user.hasData( elem ) || data_priv.hasData( elem );
      	},
      
      	data: function( elem, name, data ) {
      		return data_user.access( elem, name, data );
      	},
      
      	removeData: function( elem, name ) {
      		data_user.remove( elem, name );
      	},
      
      	// TODO: Now that all calls to _data and _removeData have been replaced
      	// with direct calls to data_priv methods, these can be deprecated.
      	_data: function( elem, name, data ) {
      		return data_priv.access( elem, name, data );
      	},
      
      	_removeData: function( elem, name ) {
      		data_priv.remove( elem, name );
      	}
      });
      
      jQuery.fn.extend({
      	data: function( key, value ) {
      		var attrs, name,
      			elem = this[ 0 ],
      			i = 0,
      			data = null;
      
      		// Gets all values
      		if ( key === undefined ) {
      			if ( this.length ) {
      				data = data_user.get( elem );
      
      				if ( elem.nodeType === 1 && !data_priv.get( elem, "hasDataAttrs" ) ) {
      					attrs = elem.attributes;
      					for ( ; i < attrs.length; i++ ) {
      						name = attrs[ i ].name;
      
      						if ( name.indexOf( "data-" ) === 0 ) {
      							name = jQuery.camelCase( name.slice(5) );
      							dataAttr( elem, name, data[ name ] );
      						}
      					}
      					data_priv.set( elem, "hasDataAttrs", true );
      				}
      			}
      
      			return data;
      		}
      
      		// Sets multiple values
      		if ( typeof key === "object" ) {
      			return this.each(function() {
      				data_user.set( this, key );
      			});
      		}
      
      		return jQuery.access( this, function( value ) {
      			var data,
      				camelKey = jQuery.camelCase( key );
      
      			// The calling jQuery object (element matches) is not empty
      			// (and therefore has an element appears at this[ 0 ]) and the
      			// `value` parameter was not undefined. An empty jQuery object
      			// will result in `undefined` for elem = this[ 0 ] which will
      			// throw an exception if an attempt to read a data cache is made.
      			if ( elem && value === undefined ) {
      				// Attempt to get data from the cache
      				// with the key as-is
      				data = data_user.get( elem, key );
      				if ( data !== undefined ) {
      					return data;
      				}
      
      				// Attempt to get data from the cache
      				// with the key camelized
      				data = data_user.get( elem, camelKey );
      				if ( data !== undefined ) {
      					return data;
      				}
      
      				// Attempt to "discover" the data in
      				// HTML5 custom data-* attrs
      				data = dataAttr( elem, camelKey, undefined );
      				if ( data !== undefined ) {
      					return data;
      				}
      
      				// We tried really hard, but the data doesn't exist.
      				return;
      			}
      
      			// Set the data...
      			this.each(function() {
      				// First, attempt to store a copy or reference of any
      				// data that might've been store with a camelCased key.
      				var data = data_user.get( this, camelKey );
      
      				// For HTML5 data-* attribute interop, we have to
      				// store property names with dashes in a camelCase form.
      				// This might not apply to all properties...*
      				data_user.set( this, camelKey, value );
      
      				// *... In the case of properties that might _actually_
      				// have dashes, we need to also store a copy of that
      				// unchanged property.
      				if ( key.indexOf("-") !== -1 && data !== undefined ) {
      					data_user.set( this, key, value );
      				}
      			});
      		}, null, value, arguments.length > 1, null, true );
      	},
      
      	removeData: function( key ) {
      		return this.each(function() {
      			data_user.remove( this, key );
      		});
      	}
      });
      
      function dataAttr( elem, key, data ) {
      	var name;
      
      	// If nothing was found internally, try to fetch any
      	// data from the HTML5 data-* attribute
      	if ( data === undefined && elem.nodeType === 1 ) {
      		name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();
      		data = elem.getAttribute( name );
      
      		if ( typeof data === "string" ) {
      			try {
      				data = data === "true" ? true :
      					data === "false" ? false :
      					data === "null" ? null :
      					// Only convert to a number if it doesn't change the string
      					+data + "" === data ? +data :
      					rbrace.test( data ) ? JSON.parse( data ) :
      					data;
      			} catch( e ) {}
      
      			// Make sure we set the data so it isn't changed later
      			data_user.set( elem, key, data );
      		} else {
      			data = undefined;
      		}
      	}
      	return data;
      }
      jQuery.extend({
      	queue: function( elem, type, data ) {
      		var queue;
      
      		if ( elem ) {
      			type = ( type || "fx" ) + "queue";
      			queue = data_priv.get( elem, type );
      
      			// Speed up dequeue by getting out quickly if this is just a lookup
      			if ( data ) {
      				if ( !queue || jQuery.isArray( data ) ) {
      					queue = data_priv.access( elem, type, jQuery.makeArray(data) );
      				} else {
      					queue.push( data );
      				}
      			}
      			return queue || [];
      		}
      	},
      
      	dequeue: function( elem, type ) {
      		type = type || "fx";
      
      		var queue = jQuery.queue( elem, type ),
      			startLength = queue.length,
      			fn = queue.shift(),
      			hooks = jQuery._queueHooks( elem, type ),
      			next = function() {
      				jQuery.dequeue( elem, type );
      			};
      
      		// If the fx queue is dequeued, always remove the progress sentinel
      		if ( fn === "inprogress" ) {
      			fn = queue.shift();
      			startLength--;
      		}
      
      		if ( fn ) {
      
      			// Add a progress sentinel to prevent the fx queue from being
      			// automatically dequeued
      			if ( type === "fx" ) {
      				queue.unshift( "inprogress" );
      			}
      
      			// clear up the last queue stop function
      			delete hooks.stop;
      			fn.call( elem, next, hooks );
      		}
      
      		if ( !startLength && hooks ) {
      			hooks.empty.fire();
      		}
      	},
      
      	// not intended for public consumption - generates a queueHooks object, or returns the current one
      	_queueHooks: function( elem, type ) {
      		var key = type + "queueHooks";
      		return data_priv.get( elem, key ) || data_priv.access( elem, key, {
      			empty: jQuery.Callbacks("once memory").add(function() {
      				data_priv.remove( elem, [ type + "queue", key ] );
      			})
      		});
      	}
      });
      
      jQuery.fn.extend({
      	queue: function( type, data ) {
      		var setter = 2;
      
      		if ( typeof type !== "string" ) {
      			data = type;
      			type = "fx";
      			setter--;
      		}
      
      		if ( arguments.length < setter ) {
      			return jQuery.queue( this[0], type );
      		}
      
      		return data === undefined ?
      			this :
      			this.each(function() {
      				var queue = jQuery.queue( this, type, data );
      
      				// ensure a hooks for this queue
      				jQuery._queueHooks( this, type );
      
      				if ( type === "fx" && queue[0] !== "inprogress" ) {
      					jQuery.dequeue( this, type );
      				}
      			});
      	},
      	dequeue: function( type ) {
      		return this.each(function() {
      			jQuery.dequeue( this, type );
      		});
      	},
      	// Based off of the plugin by Clint Helfers, with permission.
      	// http://blindsignals.com/index.php/2009/07/jquery-delay/
      	delay: function( time, type ) {
      		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
      		type = type || "fx";
      
      		return this.queue( type, function( next, hooks ) {
      			var timeout = setTimeout( next, time );
      			hooks.stop = function() {
      				clearTimeout( timeout );
      			};
      		});
      	},
      	clearQueue: function( type ) {
      		return this.queue( type || "fx", [] );
      	},
      	// Get a promise resolved when queues of a certain type
      	// are emptied (fx is the type by default)
      	promise: function( type, obj ) {
      		var tmp,
      			count = 1,
      			defer = jQuery.Deferred(),
      			elements = this,
      			i = this.length,
      			resolve = function() {
      				if ( !( --count ) ) {
      					defer.resolveWith( elements, [ elements ] );
      				}
      			};
      
      		if ( typeof type !== "string" ) {
      			obj = type;
      			type = undefined;
      		}
      		type = type || "fx";
      
      		while( i-- ) {
      			tmp = data_priv.get( elements[ i ], type + "queueHooks" );
      			if ( tmp && tmp.empty ) {
      				count++;
      				tmp.empty.add( resolve );
      			}
      		}
      		resolve();
      		return defer.promise( obj );
      	}
      });
      var nodeHook, boolHook,
      	rclass = /[\t\r\n\f]/g,
      	rreturn = /\r/g,
      	rfocusable = /^(?:input|select|textarea|button)$/i;
      
      jQuery.fn.extend({
      	attr: function( name, value ) {
      		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
      	},
      
      	removeAttr: function( name ) {
      		return this.each(function() {
      			jQuery.removeAttr( this, name );
      		});
      	},
      
      	prop: function( name, value ) {
      		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
      	},
      
      	removeProp: function( name ) {
      		return this.each(function() {
      			delete this[ jQuery.propFix[ name ] || name ];
      		});
      	},
      
      	addClass: function( value ) {
      		var classes, elem, cur, clazz, j,
      			i = 0,
      			len = this.length,
      			proceed = typeof value === "string" && value;
      
      		if ( jQuery.isFunction( value ) ) {
      			return this.each(function( j ) {
      				jQuery( this ).addClass( value.call( this, j, this.className ) );
      			});
      		}
      
      		if ( proceed ) {
      			// The disjunction here is for better compressibility (see removeClass)
      			classes = ( value || "" ).match( core_rnotwhite ) || [];
      
      			for ( ; i < len; i++ ) {
      				elem = this[ i ];
      				cur = elem.nodeType === 1 && ( elem.className ?
      					( " " + elem.className + " " ).replace( rclass, " " ) :
      					" "
      				);
      
      				if ( cur ) {
      					j = 0;
      					while ( (clazz = classes[j++]) ) {
      						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
      							cur += clazz + " ";
      						}
      					}
      					elem.className = jQuery.trim( cur );
      
      				}
      			}
      		}
      
      		return this;
      	},
      
      	removeClass: function( value ) {
      		var classes, elem, cur, clazz, j,
      			i = 0,
      			len = this.length,
      			proceed = arguments.length === 0 || typeof value === "string" && value;
      
      		if ( jQuery.isFunction( value ) ) {
      			return this.each(function( j ) {
      				jQuery( this ).removeClass( value.call( this, j, this.className ) );
      			});
      		}
      		if ( proceed ) {
      			classes = ( value || "" ).match( core_rnotwhite ) || [];
      
      			for ( ; i < len; i++ ) {
      				elem = this[ i ];
      				// This expression is here for better compressibility (see addClass)
      				cur = elem.nodeType === 1 && ( elem.className ?
      					( " " + elem.className + " " ).replace( rclass, " " ) :
      					""
      				);
      
      				if ( cur ) {
      					j = 0;
      					while ( (clazz = classes[j++]) ) {
      						// Remove *all* instances
      						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
      							cur = cur.replace( " " + clazz + " ", " " );
      						}
      					}
      					elem.className = value ? jQuery.trim( cur ) : "";
      				}
      			}
      		}
      
      		return this;
      	},
      
      	toggleClass: function( value, stateVal ) {
      		var type = typeof value;
      
      		if ( typeof stateVal === "boolean" && type === "string" ) {
      			return stateVal ? this.addClass( value ) : this.removeClass( value );
      		}
      
      		if ( jQuery.isFunction( value ) ) {
      			return this.each(function( i ) {
      				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
      			});
      		}
      
      		return this.each(function() {
      			if ( type === "string" ) {
      				// toggle individual class names
      				var className,
      					i = 0,
      					self = jQuery( this ),
      					classNames = value.match( core_rnotwhite ) || [];
      
      				while ( (className = classNames[ i++ ]) ) {
      					// check each className given, space separated list
      					if ( self.hasClass( className ) ) {
      						self.removeClass( className );
      					} else {
      						self.addClass( className );
      					}
      				}
      
      			// Toggle whole class name
      			} else if ( type === core_strundefined || type === "boolean" ) {
      				if ( this.className ) {
      					// store className if set
      					data_priv.set( this, "__className__", this.className );
      				}
      
      				// If the element has a class name or if we're passed "false",
      				// then remove the whole classname (if there was one, the above saved it).
      				// Otherwise bring back whatever was previously saved (if anything),
      				// falling back to the empty string if nothing was stored.
      				this.className = this.className || value === false ? "" : data_priv.get( this, "__className__" ) || "";
      			}
      		});
      	},
      
      	hasClass: function( selector ) {
      		var className = " " + selector + " ",
      			i = 0,
      			l = this.length;
      		for ( ; i < l; i++ ) {
      			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
      				return true;
      			}
      		}
      
      		return false;
      	},
      
      	val: function( value ) {
      		var hooks, ret, isFunction,
      			elem = this[0];
      
      		if ( !arguments.length ) {
      			if ( elem ) {
      				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];
      
      				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
      					return ret;
      				}
      
      				ret = elem.value;
      
      				return typeof ret === "string" ?
      					// handle most common string cases
      					ret.replace(rreturn, "") :
      					// handle cases where value is null/undef or number
      					ret == null ? "" : ret;
      			}
      
      			return;
      		}
      
      		isFunction = jQuery.isFunction( value );
      
      		return this.each(function( i ) {
      			var val;
      
      			if ( this.nodeType !== 1 ) {
      				return;
      			}
      
      			if ( isFunction ) {
      				val = value.call( this, i, jQuery( this ).val() );
      			} else {
      				val = value;
      			}
      
      			// Treat null/undefined as ""; convert numbers to string
      			if ( val == null ) {
      				val = "";
      			} else if ( typeof val === "number" ) {
      				val += "";
      			} else if ( jQuery.isArray( val ) ) {
      				val = jQuery.map(val, function ( value ) {
      					return value == null ? "" : value + "";
      				});
      			}
      
      			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];
      
      			// If set returns undefined, fall back to normal setting
      			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
      				this.value = val;
      			}
      		});
      	}
      });
      
      jQuery.extend({
      	valHooks: {
      		option: {
      			get: function( elem ) {
      				// attributes.value is undefined in Blackberry 4.7 but
      				// uses .value. See #6932
      				var val = elem.attributes.value;
      				return !val || val.specified ? elem.value : elem.text;
      			}
      		},
      		select: {
      			get: function( elem ) {
      				var value, option,
      					options = elem.options,
      					index = elem.selectedIndex,
      					one = elem.type === "select-one" || index < 0,
      					values = one ? null : [],
      					max = one ? index + 1 : options.length,
      					i = index < 0 ?
      						max :
      						one ? index : 0;
      
      				// Loop through all the selected options
      				for ( ; i < max; i++ ) {
      					option = options[ i ];
      
      					// IE6-9 doesn't update selected after form reset (#2551)
      					if ( ( option.selected || i === index ) &&
      							// Don't return options that are disabled or in a disabled optgroup
      							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
      							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {
      
      						// Get the specific value for the option
      						value = jQuery( option ).val();
      
      						// We don't need an array for one selects
      						if ( one ) {
      							return value;
      						}
      
      						// Multi-Selects return an array
      						values.push( value );
      					}
      				}
      
      				return values;
      			},
      
      			set: function( elem, value ) {
      				var optionSet, option,
      					options = elem.options,
      					values = jQuery.makeArray( value ),
      					i = options.length;
      
      				while ( i-- ) {
      					option = options[ i ];
      					if ( (option.selected = jQuery.inArray( jQuery(option).val(), values ) >= 0) ) {
      						optionSet = true;
      					}
      				}
      
      				// force browsers to behave consistently when non-matching value is set
      				if ( !optionSet ) {
      					elem.selectedIndex = -1;
      				}
      				return values;
      			}
      		}
      	},
      
      	attr: function( elem, name, value ) {
      		var hooks, ret,
      			nType = elem.nodeType;
      
      		// don't get/set attributes on text, comment and attribute nodes
      		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
      			return;
      		}
      
      		// Fallback to prop when attributes are not supported
      		if ( typeof elem.getAttribute === core_strundefined ) {
      			return jQuery.prop( elem, name, value );
      		}
      
      		// All attributes are lowercase
      		// Grab necessary hook if one is defined
      		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
      			name = name.toLowerCase();
      			hooks = jQuery.attrHooks[ name ] ||
      				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
      		}
      
      		if ( value !== undefined ) {
      
      			if ( value === null ) {
      				jQuery.removeAttr( elem, name );
      
      			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
      				return ret;
      
      			} else {
      				elem.setAttribute( name, value + "" );
      				return value;
      			}
      
      		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
      			return ret;
      
      		} else {
      			ret = jQuery.find.attr( elem, name );
      
      			// Non-existent attributes return null, we normalize to undefined
      			return ret == null ?
      				undefined :
      				ret;
      		}
      	},
      
      	removeAttr: function( elem, value ) {
      		var name, propName,
      			i = 0,
      			attrNames = value && value.match( core_rnotwhite );
      
      		if ( attrNames && elem.nodeType === 1 ) {
      			while ( (name = attrNames[i++]) ) {
      				propName = jQuery.propFix[ name ] || name;
      
      				// Boolean attributes get special treatment (#10870)
      				if ( jQuery.expr.match.bool.test( name ) ) {
      					// Set corresponding property to false
      					elem[ propName ] = false;
      				}
      
      				elem.removeAttribute( name );
      			}
      		}
      	},
      
      	attrHooks: {
      		type: {
      			set: function( elem, value ) {
      				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
      					// Setting the type on a radio button after the value resets the value in IE6-9
      					// Reset value to default in case type is set after value during creation
      					var val = elem.value;
      					elem.setAttribute( "type", value );
      					if ( val ) {
      						elem.value = val;
      					}
      					return value;
      				}
      			}
      		}
      	},
      
      	propFix: {
      		"for": "htmlFor",
      		"class": "className"
      	},
      
      	prop: function( elem, name, value ) {
      		var ret, hooks, notxml,
      			nType = elem.nodeType;
      
      		// don't get/set properties on text, comment and attribute nodes
      		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
      			return;
      		}
      
      		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );
      
      		if ( notxml ) {
      			// Fix name and attach hooks
      			name = jQuery.propFix[ name ] || name;
      			hooks = jQuery.propHooks[ name ];
      		}
      
      		if ( value !== undefined ) {
      			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
      				ret :
      				( elem[ name ] = value );
      
      		} else {
      			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
      				ret :
      				elem[ name ];
      		}
      	},
      
      	propHooks: {
      		tabIndex: {
      			get: function( elem ) {
      				return elem.hasAttribute( "tabindex" ) || rfocusable.test( elem.nodeName ) || elem.href ?
      					elem.tabIndex :
      					-1;
      			}
      		}
      	}
      });
      
      // Hooks for boolean attributes
      boolHook = {
      	set: function( elem, value, name ) {
      		if ( value === false ) {
      			// Remove boolean attributes when set to false
      			jQuery.removeAttr( elem, name );
      		} else {
      			elem.setAttribute( name, name );
      		}
      		return name;
      	}
      };
      jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
      	var getter = jQuery.expr.attrHandle[ name ] || jQuery.find.attr;
      
      	jQuery.expr.attrHandle[ name ] = function( elem, name, isXML ) {
      		var fn = jQuery.expr.attrHandle[ name ],
      			ret = isXML ?
      				undefined :
      				/* jshint eqeqeq: false */
      				// Temporarily disable this handler to check existence
      				(jQuery.expr.attrHandle[ name ] = undefined) !=
      					getter( elem, name, isXML ) ?
      
      					name.toLowerCase() :
      					null;
      
      		// Restore handler
      		jQuery.expr.attrHandle[ name ] = fn;
      
      		return ret;
      	};
      });
      
      // Support: IE9+
      // Selectedness for an option in an optgroup can be inaccurate
      if ( !jQuery.support.optSelected ) {
      	jQuery.propHooks.selected = {
      		get: function( elem ) {
      			var parent = elem.parentNode;
      			if ( parent && parent.parentNode ) {
      				parent.parentNode.selectedIndex;
      			}
      			return null;
      		}
      	};
      }
      
      jQuery.each([
      	"tabIndex",
      	"readOnly",
      	"maxLength",
      	"cellSpacing",
      	"cellPadding",
      	"rowSpan",
      	"colSpan",
      	"useMap",
      	"frameBorder",
      	"contentEditable"
      ], function() {
      	jQuery.propFix[ this.toLowerCase() ] = this;
      });
      
      // Radios and checkboxes getter/setter
      jQuery.each([ "radio", "checkbox" ], function() {
      	jQuery.valHooks[ this ] = {
      		set: function( elem, value ) {
      			if ( jQuery.isArray( value ) ) {
      				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
      			}
      		}
      	};
      	if ( !jQuery.support.checkOn ) {
      		jQuery.valHooks[ this ].get = function( elem ) {
      			// Support: Webkit
      			// "" is returned instead of "on" if a value isn't specified
      			return elem.getAttribute("value") === null ? "on" : elem.value;
      		};
      	}
      });
      var rkeyEvent = /^key/,
      	rmouseEvent = /^(?:mouse|contextmenu)|click/,
      	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
      	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;
      
      function returnTrue() {
      	return true;
      }
      
      function returnFalse() {
      	return false;
      }
      
      function safeActiveElement() {
      	try {
      		return document.activeElement;
      	} catch ( err ) { }
      }
      
      /*
       * Helper functions for managing events -- not part of the public interface.
       * Props to Dean Edwards' addEvent library for many of the ideas.
       */
      jQuery.event = {
      
      	global: {},
      
      	add: function( elem, types, handler, data, selector ) {
      
      		var handleObjIn, eventHandle, tmp,
      			events, t, handleObj,
      			special, handlers, type, namespaces, origType,
      			elemData = data_priv.get( elem );
      
      		// Don't attach events to noData or text/comment nodes (but allow plain objects)
      		if ( !elemData ) {
      			return;
      		}
      
      		// Caller can pass in an object of custom data in lieu of the handler
      		if ( handler.handler ) {
      			handleObjIn = handler;
      			handler = handleObjIn.handler;
      			selector = handleObjIn.selector;
      		}
      
      		// Make sure that the handler has a unique ID, used to find/remove it later
      		if ( !handler.guid ) {
      			handler.guid = jQuery.guid++;
      		}
      
      		// Init the element's event structure and main handler, if this is the first
      		if ( !(events = elemData.events) ) {
      			events = elemData.events = {};
      		}
      		if ( !(eventHandle = elemData.handle) ) {
      			eventHandle = elemData.handle = function( e ) {
      				// Discard the second event of a jQuery.event.trigger() and
      				// when an event is called after a page has unloaded
      				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
      					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
      					undefined;
      			};
      			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
      			eventHandle.elem = elem;
      		}
      
      		// Handle multiple events separated by a space
      		types = ( types || "" ).match( core_rnotwhite ) || [""];
      		t = types.length;
      		while ( t-- ) {
      			tmp = rtypenamespace.exec( types[t] ) || [];
      			type = origType = tmp[1];
      			namespaces = ( tmp[2] || "" ).split( "." ).sort();
      
      			// There *must* be a type, no attaching namespace-only handlers
      			if ( !type ) {
      				continue;
      			}
      
      			// If event changes its type, use the special event handlers for the changed type
      			special = jQuery.event.special[ type ] || {};
      
      			// If selector defined, determine special event api type, otherwise given type
      			type = ( selector ? special.delegateType : special.bindType ) || type;
      
      			// Update special based on newly reset type
      			special = jQuery.event.special[ type ] || {};
      
      			// handleObj is passed to all event handlers
      			handleObj = jQuery.extend({
      				type: type,
      				origType: origType,
      				data: data,
      				handler: handler,
      				guid: handler.guid,
      				selector: selector,
      				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
      				namespace: namespaces.join(".")
      			}, handleObjIn );
      
      			// Init the event handler queue if we're the first
      			if ( !(handlers = events[ type ]) ) {
      				handlers = events[ type ] = [];
      				handlers.delegateCount = 0;
      
      				// Only use addEventListener if the special events handler returns false
      				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
      					if ( elem.addEventListener ) {
      						elem.addEventListener( type, eventHandle, false );
      					}
      				}
      			}
      
      			if ( special.add ) {
      				special.add.call( elem, handleObj );
      
      				if ( !handleObj.handler.guid ) {
      					handleObj.handler.guid = handler.guid;
      				}
      			}
      
      			// Add to the element's handler list, delegates in front
      			if ( selector ) {
      				handlers.splice( handlers.delegateCount++, 0, handleObj );
      			} else {
      				handlers.push( handleObj );
      			}
      
      			// Keep track of which events have ever been used, for event optimization
      			jQuery.event.global[ type ] = true;
      		}
      
      		// Nullify elem to prevent memory leaks in IE
      		elem = null;
      	},
      
      	// Detach an event or set of events from an element
      	remove: function( elem, types, handler, selector, mappedTypes ) {
      
      		var j, origCount, tmp,
      			events, t, handleObj,
      			special, handlers, type, namespaces, origType,
      			elemData = data_priv.hasData( elem ) && data_priv.get( elem );
      
      		if ( !elemData || !(events = elemData.events) ) {
      			return;
      		}
      
      		// Once for each type.namespace in types; type may be omitted
      		types = ( types || "" ).match( core_rnotwhite ) || [""];
      		t = types.length;
      		while ( t-- ) {
      			tmp = rtypenamespace.exec( types[t] ) || [];
      			type = origType = tmp[1];
      			namespaces = ( tmp[2] || "" ).split( "." ).sort();
      
      			// Unbind all events (on this namespace, if provided) for the element
      			if ( !type ) {
      				for ( type in events ) {
      					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
      				}
      				continue;
      			}
      
      			special = jQuery.event.special[ type ] || {};
      			type = ( selector ? special.delegateType : special.bindType ) || type;
      			handlers = events[ type ] || [];
      			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );
      
      			// Remove matching events
      			origCount = j = handlers.length;
      			while ( j-- ) {
      				handleObj = handlers[ j ];
      
      				if ( ( mappedTypes || origType === handleObj.origType ) &&
      					( !handler || handler.guid === handleObj.guid ) &&
      					( !tmp || tmp.test( handleObj.namespace ) ) &&
      					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
      					handlers.splice( j, 1 );
      
      					if ( handleObj.selector ) {
      						handlers.delegateCount--;
      					}
      					if ( special.remove ) {
      						special.remove.call( elem, handleObj );
      					}
      				}
      			}
      
      			// Remove generic event handler if we removed something and no more handlers exist
      			// (avoids potential for endless recursion during removal of special event handlers)
      			if ( origCount && !handlers.length ) {
      				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
      					jQuery.removeEvent( elem, type, elemData.handle );
      				}
      
      				delete events[ type ];
      			}
      		}
      
      		// Remove the expando if it's no longer used
      		if ( jQuery.isEmptyObject( events ) ) {
      			delete elemData.handle;
      			data_priv.remove( elem, "events" );
      		}
      	},
      
      	trigger: function( event, data, elem, onlyHandlers ) {
      
      		var i, cur, tmp, bubbleType, ontype, handle, special,
      			eventPath = [ elem || document ],
      			type = core_hasOwn.call( event, "type" ) ? event.type : event,
      			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];
      
      		cur = tmp = elem = elem || document;
      
      		// Don't do events on text and comment nodes
      		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
      			return;
      		}
      
      		// focus/blur morphs to focusin/out; ensure we're not firing them right now
      		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
      			return;
      		}
      
      		if ( type.indexOf(".") >= 0 ) {
      			// Namespaced trigger; create a regexp to match event type in handle()
      			namespaces = type.split(".");
      			type = namespaces.shift();
      			namespaces.sort();
      		}
      		ontype = type.indexOf(":") < 0 && "on" + type;
      
      		// Caller can pass in a jQuery.Event object, Object, or just an event type string
      		event = event[ jQuery.expando ] ?
      			event :
      			new jQuery.Event( type, typeof event === "object" && event );
      
      		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
      		event.isTrigger = onlyHandlers ? 2 : 3;
      		event.namespace = namespaces.join(".");
      		event.namespace_re = event.namespace ?
      			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
      			null;
      
      		// Clean up the event in case it is being reused
      		event.result = undefined;
      		if ( !event.target ) {
      			event.target = elem;
      		}
      
      		// Clone any incoming data and prepend the event, creating the handler arg list
      		data = data == null ?
      			[ event ] :
      			jQuery.makeArray( data, [ event ] );
      
      		// Allow special events to draw outside the lines
      		special = jQuery.event.special[ type ] || {};
      		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
      			return;
      		}
      
      		// Determine event propagation path in advance, per W3C events spec (#9951)
      		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
      		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {
      
      			bubbleType = special.delegateType || type;
      			if ( !rfocusMorph.test( bubbleType + type ) ) {
      				cur = cur.parentNode;
      			}
      			for ( ; cur; cur = cur.parentNode ) {
      				eventPath.push( cur );
      				tmp = cur;
      			}
      
      			// Only add window if we got to document (e.g., not plain obj or detached DOM)
      			if ( tmp === (elem.ownerDocument || document) ) {
      				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
      			}
      		}
      
      		// Fire handlers on the event path
      		i = 0;
      		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {
      
      			event.type = i > 1 ?
      				bubbleType :
      				special.bindType || type;
      
      			// jQuery handler
      			handle = ( data_priv.get( cur, "events" ) || {} )[ event.type ] && data_priv.get( cur, "handle" );
      			if ( handle ) {
      				handle.apply( cur, data );
      			}
      
      			// Native handler
      			handle = ontype && cur[ ontype ];
      			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
      				event.preventDefault();
      			}
      		}
      		event.type = type;
      
      		// If nobody prevented the default action, do it now
      		if ( !onlyHandlers && !event.isDefaultPrevented() ) {
      
      			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
      				jQuery.acceptData( elem ) ) {
      
      				// Call a native DOM method on the target with the same name name as the event.
      				// Don't do default actions on window, that's where global variables be (#6170)
      				if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {
      
      					// Don't re-trigger an onFOO event when we call its FOO() method
      					tmp = elem[ ontype ];
      
      					if ( tmp ) {
      						elem[ ontype ] = null;
      					}
      
      					// Prevent re-triggering of the same event, since we already bubbled it above
      					jQuery.event.triggered = type;
      					elem[ type ]();
      					jQuery.event.triggered = undefined;
      
      					if ( tmp ) {
      						elem[ ontype ] = tmp;
      					}
      				}
      			}
      		}
      
      		return event.result;
      	},
      
      	dispatch: function( event ) {
      
      		// Make a writable jQuery.Event from the native event object
      		event = jQuery.event.fix( event );
      
      		var i, j, ret, matched, handleObj,
      			handlerQueue = [],
      			args = core_slice.call( arguments ),
      			handlers = ( data_priv.get( this, "events" ) || {} )[ event.type ] || [],
      			special = jQuery.event.special[ event.type ] || {};
      
      		// Use the fix-ed jQuery.Event rather than the (read-only) native event
      		args[0] = event;
      		event.delegateTarget = this;
      
      		// Call the preDispatch hook for the mapped type, and let it bail if desired
      		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
      			return;
      		}
      
      		// Determine handlers
      		handlerQueue = jQuery.event.handlers.call( this, event, handlers );
      
      		// Run delegates first; they may want to stop propagation beneath us
      		i = 0;
      		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
      			event.currentTarget = matched.elem;
      
      			j = 0;
      			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {
      
      				// Triggered event must either 1) have no namespace, or
      				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
      				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {
      
      					event.handleObj = handleObj;
      					event.data = handleObj.data;
      
      					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
      							.apply( matched.elem, args );
      
      					if ( ret !== undefined ) {
      						if ( (event.result = ret) === false ) {
      							event.preventDefault();
      							event.stopPropagation();
      						}
      					}
      				}
      			}
      		}
      
      		// Call the postDispatch hook for the mapped type
      		if ( special.postDispatch ) {
      			special.postDispatch.call( this, event );
      		}
      
      		return event.result;
      	},
      
      	handlers: function( event, handlers ) {
      		var i, matches, sel, handleObj,
      			handlerQueue = [],
      			delegateCount = handlers.delegateCount,
      			cur = event.target;
      
      		// Find delegate handlers
      		// Black-hole SVG <use> instance trees (#13180)
      		// Avoid non-left-click bubbling in Firefox (#3861)
      		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {
      
      			for ( ; cur !== this; cur = cur.parentNode || this ) {
      
      				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
      				if ( cur.disabled !== true || event.type !== "click" ) {
      					matches = [];
      					for ( i = 0; i < delegateCount; i++ ) {
      						handleObj = handlers[ i ];
      
      						// Don't conflict with Object.prototype properties (#13203)
      						sel = handleObj.selector + " ";
      
      						if ( matches[ sel ] === undefined ) {
      							matches[ sel ] = handleObj.needsContext ?
      								jQuery( sel, this ).index( cur ) >= 0 :
      								jQuery.find( sel, this, null, [ cur ] ).length;
      						}
      						if ( matches[ sel ] ) {
      							matches.push( handleObj );
      						}
      					}
      					if ( matches.length ) {
      						handlerQueue.push({ elem: cur, handlers: matches });
      					}
      				}
      			}
      		}
      
      		// Add the remaining (directly-bound) handlers
      		if ( delegateCount < handlers.length ) {
      			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
      		}
      
      		return handlerQueue;
      	},
      
      	// Includes some event props shared by KeyEvent and MouseEvent
      	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
      
      	fixHooks: {},
      
      	keyHooks: {
      		props: "char charCode key keyCode".split(" "),
      		filter: function( event, original ) {
      
      			// Add which for key events
      			if ( event.which == null ) {
      				event.which = original.charCode != null ? original.charCode : original.keyCode;
      			}
      
      			return event;
      		}
      	},
      
      	mouseHooks: {
      		props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
      		filter: function( event, original ) {
      			var eventDoc, doc, body,
      				button = original.button;
      
      			// Calculate pageX/Y if missing and clientX/Y available
      			if ( event.pageX == null && original.clientX != null ) {
      				eventDoc = event.target.ownerDocument || document;
      				doc = eventDoc.documentElement;
      				body = eventDoc.body;
      
      				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
      				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
      			}
      
      			// Add which for click: 1 === left; 2 === middle; 3 === right
      			// Note: button is not normalized, so don't use it
      			if ( !event.which && button !== undefined ) {
      				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
      			}
      
      			return event;
      		}
      	},
      
      	fix: function( event ) {
      		if ( event[ jQuery.expando ] ) {
      			return event;
      		}
      
      		// Create a writable copy of the event object and normalize some properties
      		var i, prop, copy,
      			type = event.type,
      			originalEvent = event,
      			fixHook = this.fixHooks[ type ];
      
      		if ( !fixHook ) {
      			this.fixHooks[ type ] = fixHook =
      				rmouseEvent.test( type ) ? this.mouseHooks :
      				rkeyEvent.test( type ) ? this.keyHooks :
      				{};
      		}
      		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;
      
      		event = new jQuery.Event( originalEvent );
      
      		i = copy.length;
      		while ( i-- ) {
      			prop = copy[ i ];
      			event[ prop ] = originalEvent[ prop ];
      		}
      
      		// Support: Cordova 2.5 (WebKit) (#13255)
      		// All events should have a target; Cordova deviceready doesn't
      		if ( !event.target ) {
      			event.target = document;
      		}
      
      		// Support: Safari 6.0+, Chrome < 28
      		// Target should not be a text node (#504, #13143)
      		if ( event.target.nodeType === 3 ) {
      			event.target = event.target.parentNode;
      		}
      
      		return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
      	},
      
      	special: {
      		load: {
      			// Prevent triggered image.load events from bubbling to window.load
      			noBubble: true
      		},
      		focus: {
      			// Fire native event if possible so blur/focus sequence is correct
      			trigger: function() {
      				if ( this !== safeActiveElement() && this.focus ) {
      					this.focus();
      					return false;
      				}
      			},
      			delegateType: "focusin"
      		},
      		blur: {
      			trigger: function() {
      				if ( this === safeActiveElement() && this.blur ) {
      					this.blur();
      					return false;
      				}
      			},
      			delegateType: "focusout"
      		},
      		click: {
      			// For checkbox, fire native event so checked state will be right
      			trigger: function() {
      				if ( this.type === "checkbox" && this.click && jQuery.nodeName( this, "input" ) ) {
      					this.click();
      					return false;
      				}
      			},
      
      			// For cross-browser consistency, don't fire native .click() on links
      			_default: function( event ) {
      				return jQuery.nodeName( event.target, "a" );
      			}
      		},
      
      		beforeunload: {
      			postDispatch: function( event ) {
      
      				// Support: Firefox 20+
      				// Firefox doesn't alert if the returnValue field is not set.
      				if ( event.result !== undefined ) {
      					event.originalEvent.returnValue = event.result;
      				}
      			}
      		}
      	},
      
      	simulate: function( type, elem, event, bubble ) {
      		// Piggyback on a donor event to simulate a different one.
      		// Fake originalEvent to avoid donor's stopPropagation, but if the
      		// simulated event prevents default then we do the same on the donor.
      		var e = jQuery.extend(
      			new jQuery.Event(),
      			event,
      			{
      				type: type,
      				isSimulated: true,
      				originalEvent: {}
      			}
      		);
      		if ( bubble ) {
      			jQuery.event.trigger( e, null, elem );
      		} else {
      			jQuery.event.dispatch.call( elem, e );
      		}
      		if ( e.isDefaultPrevented() ) {
      			event.preventDefault();
      		}
      	}
      };
      
      jQuery.removeEvent = function( elem, type, handle ) {
      	if ( elem.removeEventListener ) {
      		elem.removeEventListener( type, handle, false );
      	}
      };
      
      jQuery.Event = function( src, props ) {
      	// Allow instantiation without the 'new' keyword
      	if ( !(this instanceof jQuery.Event) ) {
      		return new jQuery.Event( src, props );
      	}
      
      	// Event object
      	if ( src && src.type ) {
      		this.originalEvent = src;
      		this.type = src.type;
      
      		// Events bubbling up the document may have been marked as prevented
      		// by a handler lower down the tree; reflect the correct value.
      		this.isDefaultPrevented = ( src.defaultPrevented ||
      			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;
      
      	// Event type
      	} else {
      		this.type = src;
      	}
      
      	// Put explicitly provided properties onto the event object
      	if ( props ) {
      		jQuery.extend( this, props );
      	}
      
      	// Create a timestamp if incoming event doesn't have one
      	this.timeStamp = src && src.timeStamp || jQuery.now();
      
      	// Mark it as fixed
      	this[ jQuery.expando ] = true;
      };
      
      // jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
      // http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
      jQuery.Event.prototype = {
      	isDefaultPrevented: returnFalse,
      	isPropagationStopped: returnFalse,
      	isImmediatePropagationStopped: returnFalse,
      
      	preventDefault: function() {
      		var e = this.originalEvent;
      
      		this.isDefaultPrevented = returnTrue;
      
      		if ( e && e.preventDefault ) {
      			e.preventDefault();
      		}
      	},
      	stopPropagation: function() {
      		var e = this.originalEvent;
      
      		this.isPropagationStopped = returnTrue;
      
      		if ( e && e.stopPropagation ) {
      			e.stopPropagation();
      		}
      	},
      	stopImmediatePropagation: function() {
      		this.isImmediatePropagationStopped = returnTrue;
      		this.stopPropagation();
      	}
      };
      
      // Create mouseenter/leave events using mouseover/out and event-time checks
      // Support: Chrome 15+
      jQuery.each({
      	mouseenter: "mouseover",
      	mouseleave: "mouseout"
      }, function( orig, fix ) {
      	jQuery.event.special[ orig ] = {
      		delegateType: fix,
      		bindType: fix,
      
      		handle: function( event ) {
      			var ret,
      				target = this,
      				related = event.relatedTarget,
      				handleObj = event.handleObj;
      
      			// For mousenter/leave call the handler if related is outside the target.
      			// NB: No relatedTarget if the mouse left/entered the browser window
      			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
      				event.type = handleObj.origType;
      				ret = handleObj.handler.apply( this, arguments );
      				event.type = fix;
      			}
      			return ret;
      		}
      	};
      });
      
      // Create "bubbling" focus and blur events
      // Support: Firefox, Chrome, Safari
      if ( !jQuery.support.focusinBubbles ) {
      	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {
      
      		// Attach a single capturing handler while someone wants focusin/focusout
      		var attaches = 0,
      			handler = function( event ) {
      				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
      			};
      
      		jQuery.event.special[ fix ] = {
      			setup: function() {
      				if ( attaches++ === 0 ) {
      					document.addEventListener( orig, handler, true );
      				}
      			},
      			teardown: function() {
      				if ( --attaches === 0 ) {
      					document.removeEventListener( orig, handler, true );
      				}
      			}
      		};
      	});
      }
      
      jQuery.fn.extend({
      
      	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
      		var origFn, type;
      
      		// Types can be a map of types/handlers
      		if ( typeof types === "object" ) {
      			// ( types-Object, selector, data )
      			if ( typeof selector !== "string" ) {
      				// ( types-Object, data )
      				data = data || selector;
      				selector = undefined;
      			}
      			for ( type in types ) {
      				this.on( type, selector, data, types[ type ], one );
      			}
      			return this;
      		}
      
      		if ( data == null && fn == null ) {
      			// ( types, fn )
      			fn = selector;
      			data = selector = undefined;
      		} else if ( fn == null ) {
      			if ( typeof selector === "string" ) {
      				// ( types, selector, fn )
      				fn = data;
      				data = undefined;
      			} else {
      				// ( types, data, fn )
      				fn = data;
      				data = selector;
      				selector = undefined;
      			}
      		}
      		if ( fn === false ) {
      			fn = returnFalse;
      		} else if ( !fn ) {
      			return this;
      		}
      
      		if ( one === 1 ) {
      			origFn = fn;
      			fn = function( event ) {
      				// Can use an empty set, since event contains the info
      				jQuery().off( event );
      				return origFn.apply( this, arguments );
      			};
      			// Use same guid so caller can remove using origFn
      			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
      		}
      		return this.each( function() {
      			jQuery.event.add( this, types, fn, data, selector );
      		});
      	},
      	one: function( types, selector, data, fn ) {
      		return this.on( types, selector, data, fn, 1 );
      	},
      	off: function( types, selector, fn ) {
      		var handleObj, type;
      		if ( types && types.preventDefault && types.handleObj ) {
      			// ( event )  dispatched jQuery.Event
      			handleObj = types.handleObj;
      			jQuery( types.delegateTarget ).off(
      				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
      				handleObj.selector,
      				handleObj.handler
      			);
      			return this;
      		}
      		if ( typeof types === "object" ) {
      			// ( types-object [, selector] )
      			for ( type in types ) {
      				this.off( type, selector, types[ type ] );
      			}
      			return this;
      		}
      		if ( selector === false || typeof selector === "function" ) {
      			// ( types [, fn] )
      			fn = selector;
      			selector = undefined;
      		}
      		if ( fn === false ) {
      			fn = returnFalse;
      		}
      		return this.each(function() {
      			jQuery.event.remove( this, types, fn, selector );
      		});
      	},
      
      	trigger: function( type, data ) {
      		return this.each(function() {
      			jQuery.event.trigger( type, data, this );
      		});
      	},
      	triggerHandler: function( type, data ) {
      		var elem = this[0];
      		if ( elem ) {
      			return jQuery.event.trigger( type, data, elem, true );
      		}
      	}
      });
      var isSimple = /^.[^:#\[\.,]*$/,
      	rparentsprev = /^(?:parents|prev(?:Until|All))/,
      	rneedsContext = jQuery.expr.match.needsContext,
      	// methods guaranteed to produce a unique set when starting from a unique set
      	guaranteedUnique = {
      		children: true,
      		contents: true,
      		next: true,
      		prev: true
      	};
      
      jQuery.fn.extend({
      	find: function( selector ) {
      		var i,
      			ret = [],
      			self = this,
      			len = self.length;
      
      		if ( typeof selector !== "string" ) {
      			return this.pushStack( jQuery( selector ).filter(function() {
      				for ( i = 0; i < len; i++ ) {
      					if ( jQuery.contains( self[ i ], this ) ) {
      						return true;
      					}
      				}
      			}) );
      		}
      
      		for ( i = 0; i < len; i++ ) {
      			jQuery.find( selector, self[ i ], ret );
      		}
      
      		// Needed because $( selector, context ) becomes $( context ).find( selector )
      		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
      		ret.selector = this.selector ? this.selector + " " + selector : selector;
      		return ret;
      	},
      
      	has: function( target ) {
      		var targets = jQuery( target, this ),
      			l = targets.length;
      
      		return this.filter(function() {
      			var i = 0;
      			for ( ; i < l; i++ ) {
      				if ( jQuery.contains( this, targets[i] ) ) {
      					return true;
      				}
      			}
      		});
      	},
      
      	not: function( selector ) {
      		return this.pushStack( winnow(this, selector || [], true) );
      	},
      
      	filter: function( selector ) {
      		return this.pushStack( winnow(this, selector || [], false) );
      	},
      
      	is: function( selector ) {
      		return !!winnow(
      			this,
      
      			// If this is a positional/relative selector, check membership in the returned set
      			// so $("p:first").is("p:last") won't return true for a doc with two "p".
      			typeof selector === "string" && rneedsContext.test( selector ) ?
      				jQuery( selector ) :
      				selector || [],
      			false
      		).length;
      	},
      
      	closest: function( selectors, context ) {
      		var cur,
      			i = 0,
      			l = this.length,
      			matched = [],
      			pos = ( rneedsContext.test( selectors ) || typeof selectors !== "string" ) ?
      				jQuery( selectors, context || this.context ) :
      				0;
      
      		for ( ; i < l; i++ ) {
      			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
      				// Always skip document fragments
      				if ( cur.nodeType < 11 && (pos ?
      					pos.index(cur) > -1 :
      
      					// Don't pass non-elements to Sizzle
      					cur.nodeType === 1 &&
      						jQuery.find.matchesSelector(cur, selectors)) ) {
      
      					cur = matched.push( cur );
      					break;
      				}
      			}
      		}
      
      		return this.pushStack( matched.length > 1 ? jQuery.unique( matched ) : matched );
      	},
      
      	// Determine the position of an element within
      	// the matched set of elements
      	index: function( elem ) {
      
      		// No argument, return index in parent
      		if ( !elem ) {
      			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
      		}
      
      		// index in selector
      		if ( typeof elem === "string" ) {
      			return core_indexOf.call( jQuery( elem ), this[ 0 ] );
      		}
      
      		// Locate the position of the desired element
      		return core_indexOf.call( this,
      
      			// If it receives a jQuery object, the first element is used
      			elem.jquery ? elem[ 0 ] : elem
      		);
      	},
      
      	add: function( selector, context ) {
      		var set = typeof selector === "string" ?
      				jQuery( selector, context ) :
      				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
      			all = jQuery.merge( this.get(), set );
      
      		return this.pushStack( jQuery.unique(all) );
      	},
      
      	addBack: function( selector ) {
      		return this.add( selector == null ?
      			this.prevObject : this.prevObject.filter(selector)
      		);
      	}
      });
      
      function sibling( cur, dir ) {
      	while ( (cur = cur[dir]) && cur.nodeType !== 1 ) {}
      
      	return cur;
      }
      
      jQuery.each({
      	parent: function( elem ) {
      		var parent = elem.parentNode;
      		return parent && parent.nodeType !== 11 ? parent : null;
      	},
      	parents: function( elem ) {
      		return jQuery.dir( elem, "parentNode" );
      	},
      	parentsUntil: function( elem, i, until ) {
      		return jQuery.dir( elem, "parentNode", until );
      	},
      	next: function( elem ) {
      		return sibling( elem, "nextSibling" );
      	},
      	prev: function( elem ) {
      		return sibling( elem, "previousSibling" );
      	},
      	nextAll: function( elem ) {
      		return jQuery.dir( elem, "nextSibling" );
      	},
      	prevAll: function( elem ) {
      		return jQuery.dir( elem, "previousSibling" );
      	},
      	nextUntil: function( elem, i, until ) {
      		return jQuery.dir( elem, "nextSibling", until );
      	},
      	prevUntil: function( elem, i, until ) {
      		return jQuery.dir( elem, "previousSibling", until );
      	},
      	siblings: function( elem ) {
      		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
      	},
      	children: function( elem ) {
      		return jQuery.sibling( elem.firstChild );
      	},
      	contents: function( elem ) {
      		return elem.contentDocument || jQuery.merge( [], elem.childNodes );
      	}
      }, function( name, fn ) {
      	jQuery.fn[ name ] = function( until, selector ) {
      		var matched = jQuery.map( this, fn, until );
      
      		if ( name.slice( -5 ) !== "Until" ) {
      			selector = until;
      		}
      
      		if ( selector && typeof selector === "string" ) {
      			matched = jQuery.filter( selector, matched );
      		}
      
      		if ( this.length > 1 ) {
      			// Remove duplicates
      			if ( !guaranteedUnique[ name ] ) {
      				jQuery.unique( matched );
      			}
      
      			// Reverse order for parents* and prev-derivatives
      			if ( rparentsprev.test( name ) ) {
      				matched.reverse();
      			}
      		}
      
      		return this.pushStack( matched );
      	};
      });
      
      jQuery.extend({
      	filter: function( expr, elems, not ) {
      		var elem = elems[ 0 ];
      
      		if ( not ) {
      			expr = ":not(" + expr + ")";
      		}
      
      		return elems.length === 1 && elem.nodeType === 1 ?
      			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
      			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
      				return elem.nodeType === 1;
      			}));
      	},
      
      	dir: function( elem, dir, until ) {
      		var matched = [],
      			truncate = until !== undefined;
      
      		while ( (elem = elem[ dir ]) && elem.nodeType !== 9 ) {
      			if ( elem.nodeType === 1 ) {
      				if ( truncate && jQuery( elem ).is( until ) ) {
      					break;
      				}
      				matched.push( elem );
      			}
      		}
      		return matched;
      	},
      
      	sibling: function( n, elem ) {
      		var matched = [];
      
      		for ( ; n; n = n.nextSibling ) {
      			if ( n.nodeType === 1 && n !== elem ) {
      				matched.push( n );
      			}
      		}
      
      		return matched;
      	}
      });
      
      // Implement the identical functionality for filter and not
      function winnow( elements, qualifier, not ) {
      	if ( jQuery.isFunction( qualifier ) ) {
      		return jQuery.grep( elements, function( elem, i ) {
      			/* jshint -W018 */
      			return !!qualifier.call( elem, i, elem ) !== not;
      		});
      
      	}
      
      	if ( qualifier.nodeType ) {
      		return jQuery.grep( elements, function( elem ) {
      			return ( elem === qualifier ) !== not;
      		});
      
      	}
      
      	if ( typeof qualifier === "string" ) {
      		if ( isSimple.test( qualifier ) ) {
      			return jQuery.filter( qualifier, elements, not );
      		}
      
      		qualifier = jQuery.filter( qualifier, elements );
      	}
      
      	return jQuery.grep( elements, function( elem ) {
      		return ( core_indexOf.call( qualifier, elem ) >= 0 ) !== not;
      	});
      }
      var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
      	rtagName = /<([\w:]+)/,
      	rhtml = /<|&#?\w+;/,
      	rnoInnerhtml = /<(?:script|style|link)/i,
      	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
      	// checked="checked" or checked
      	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
      	rscriptType = /^$|\/(?:java|ecma)script/i,
      	rscriptTypeMasked = /^true\/(.*)/,
      	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
      
      	// We have to close these tags to support XHTML (#13200)
      	wrapMap = {
      
      		// Support: IE 9
      		option: [ 1, "<select multiple='multiple'>", "</select>" ],
      
      		thead: [ 1, "<table>", "</table>" ],
      		col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
      		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
      		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
      
      		_default: [ 0, "", "" ]
      	};
      
      // Support: IE 9
      wrapMap.optgroup = wrapMap.option;
      
      wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
      wrapMap.th = wrapMap.td;
      
      jQuery.fn.extend({
      	text: function( value ) {
      		return jQuery.access( this, function( value ) {
      			return value === undefined ?
      				jQuery.text( this ) :
      				this.empty().append( ( this[ 0 ] && this[ 0 ].ownerDocument || document ).createTextNode( value ) );
      		}, null, value, arguments.length );
      	},
      
      	append: function() {
      		return this.domManip( arguments, function( elem ) {
      			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
      				var target = manipulationTarget( this, elem );
      				target.appendChild( elem );
      			}
      		});
      	},
      
      	prepend: function() {
      		return this.domManip( arguments, function( elem ) {
      			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
      				var target = manipulationTarget( this, elem );
      				target.insertBefore( elem, target.firstChild );
      			}
      		});
      	},
      
      	before: function() {
      		return this.domManip( arguments, function( elem ) {
      			if ( this.parentNode ) {
      				this.parentNode.insertBefore( elem, this );
      			}
      		});
      	},
      
      	after: function() {
      		return this.domManip( arguments, function( elem ) {
      			if ( this.parentNode ) {
      				this.parentNode.insertBefore( elem, this.nextSibling );
      			}
      		});
      	},
      
      	// keepData is for internal use only--do not document
      	remove: function( selector, keepData ) {
      		var elem,
      			elems = selector ? jQuery.filter( selector, this ) : this,
      			i = 0;
      
      		for ( ; (elem = elems[i]) != null; i++ ) {
      			if ( !keepData && elem.nodeType === 1 ) {
      				jQuery.cleanData( getAll( elem ) );
      			}
      
      			if ( elem.parentNode ) {
      				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
      					setGlobalEval( getAll( elem, "script" ) );
      				}
      				elem.parentNode.removeChild( elem );
      			}
      		}
      
      		return this;
      	},
      
      	empty: function() {
      		var elem,
      			i = 0;
      
      		for ( ; (elem = this[i]) != null; i++ ) {
      			if ( elem.nodeType === 1 ) {
      
      				// Prevent memory leaks
      				jQuery.cleanData( getAll( elem, false ) );
      
      				// Remove any remaining nodes
      				elem.textContent = "";
      			}
      		}
      
      		return this;
      	},
      
      	clone: function( dataAndEvents, deepDataAndEvents ) {
      		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
      		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;
      
      		return this.map( function () {
      			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
      		});
      	},
      
      	html: function( value ) {
      		return jQuery.access( this, function( value ) {
      			var elem = this[ 0 ] || {},
      				i = 0,
      				l = this.length;
      
      			if ( value === undefined && elem.nodeType === 1 ) {
      				return elem.innerHTML;
      			}
      
      			// See if we can take a shortcut and just use innerHTML
      			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
      				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {
      
      				value = value.replace( rxhtmlTag, "<$1></$2>" );
      
      				try {
      					for ( ; i < l; i++ ) {
      						elem = this[ i ] || {};
      
      						// Remove element nodes and prevent memory leaks
      						if ( elem.nodeType === 1 ) {
      							jQuery.cleanData( getAll( elem, false ) );
      							elem.innerHTML = value;
      						}
      					}
      
      					elem = 0;
      
      				// If using innerHTML throws an exception, use the fallback method
      				} catch( e ) {}
      			}
      
      			if ( elem ) {
      				this.empty().append( value );
      			}
      		}, null, value, arguments.length );
      	},
      
      	replaceWith: function() {
      		var
      			// Snapshot the DOM in case .domManip sweeps something relevant into its fragment
      			args = jQuery.map( this, function( elem ) {
      				return [ elem.nextSibling, elem.parentNode ];
      			}),
      			i = 0;
      
      		// Make the changes, replacing each context element with the new content
      		this.domManip( arguments, function( elem ) {
      			var next = args[ i++ ],
      				parent = args[ i++ ];
      
      			if ( parent ) {
      				// Don't use the snapshot next if it has moved (#13810)
      				if ( next && next.parentNode !== parent ) {
      					next = this.nextSibling;
      				}
      				jQuery( this ).remove();
      				parent.insertBefore( elem, next );
      			}
      		// Allow new content to include elements from the context set
      		}, true );
      
      		// Force removal if there was no new content (e.g., from empty arguments)
      		return i ? this : this.remove();
      	},
      
      	detach: function( selector ) {
      		return this.remove( selector, true );
      	},
      
      	domManip: function( args, callback, allowIntersection ) {
      
      		// Flatten any nested arrays
      		args = core_concat.apply( [], args );
      
      		var fragment, first, scripts, hasScripts, node, doc,
      			i = 0,
      			l = this.length,
      			set = this,
      			iNoClone = l - 1,
      			value = args[ 0 ],
      			isFunction = jQuery.isFunction( value );
      
      		// We can't cloneNode fragments that contain checked, in WebKit
      		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
      			return this.each(function( index ) {
      				var self = set.eq( index );
      				if ( isFunction ) {
      					args[ 0 ] = value.call( this, index, self.html() );
      				}
      				self.domManip( args, callback, allowIntersection );
      			});
      		}
      
      		if ( l ) {
      			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, !allowIntersection && this );
      			first = fragment.firstChild;
      
      			if ( fragment.childNodes.length === 1 ) {
      				fragment = first;
      			}
      
      			if ( first ) {
      				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
      				hasScripts = scripts.length;
      
      				// Use the original fragment for the last item instead of the first because it can end up
      				// being emptied incorrectly in certain situations (#8070).
      				for ( ; i < l; i++ ) {
      					node = fragment;
      
      					if ( i !== iNoClone ) {
      						node = jQuery.clone( node, true, true );
      
      						// Keep references to cloned scripts for later restoration
      						if ( hasScripts ) {
      							// Support: QtWebKit
      							// jQuery.merge because core_push.apply(_, arraylike) throws
      							jQuery.merge( scripts, getAll( node, "script" ) );
      						}
      					}
      
      					callback.call( this[ i ], node, i );
      				}
      
      				if ( hasScripts ) {
      					doc = scripts[ scripts.length - 1 ].ownerDocument;
      
      					// Reenable scripts
      					jQuery.map( scripts, restoreScript );
      
      					// Evaluate executable scripts on first document insertion
      					for ( i = 0; i < hasScripts; i++ ) {
      						node = scripts[ i ];
      						if ( rscriptType.test( node.type || "" ) &&
      							!data_priv.access( node, "globalEval" ) && jQuery.contains( doc, node ) ) {
      
      							if ( node.src ) {
      								// Hope ajax is available...
      								jQuery._evalUrl( node.src );
      							} else {
      								jQuery.globalEval( node.textContent.replace( rcleanScript, "" ) );
      							}
      						}
      					}
      				}
      			}
      		}
      
      		return this;
      	}
      });
      
      jQuery.each({
      	appendTo: "append",
      	prependTo: "prepend",
      	insertBefore: "before",
      	insertAfter: "after",
      	replaceAll: "replaceWith"
      }, function( name, original ) {
      	jQuery.fn[ name ] = function( selector ) {
      		var elems,
      			ret = [],
      			insert = jQuery( selector ),
      			last = insert.length - 1,
      			i = 0;
      
      		for ( ; i <= last; i++ ) {
      			elems = i === last ? this : this.clone( true );
      			jQuery( insert[ i ] )[ original ]( elems );
      
      			// Support: QtWebKit
      			// .get() because core_push.apply(_, arraylike) throws
      			core_push.apply( ret, elems.get() );
      		}
      
      		return this.pushStack( ret );
      	};
      });
      
      jQuery.extend({
      	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
      		var i, l, srcElements, destElements,
      			clone = elem.cloneNode( true ),
      			inPage = jQuery.contains( elem.ownerDocument, elem );
      
      		// Support: IE >= 9
      		// Fix Cloning issues
      		if ( !jQuery.support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) && !jQuery.isXMLDoc( elem ) ) {
      
      			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
      			destElements = getAll( clone );
      			srcElements = getAll( elem );
      
      			for ( i = 0, l = srcElements.length; i < l; i++ ) {
      				fixInput( srcElements[ i ], destElements[ i ] );
      			}
      		}
      
      		// Copy the events from the original to the clone
      		if ( dataAndEvents ) {
      			if ( deepDataAndEvents ) {
      				srcElements = srcElements || getAll( elem );
      				destElements = destElements || getAll( clone );
      
      				for ( i = 0, l = srcElements.length; i < l; i++ ) {
      					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
      				}
      			} else {
      				cloneCopyEvent( elem, clone );
      			}
      		}
      
      		// Preserve script evaluation history
      		destElements = getAll( clone, "script" );
      		if ( destElements.length > 0 ) {
      			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
      		}
      
      		// Return the cloned set
      		return clone;
      	},
      
      	buildFragment: function( elems, context, scripts, selection ) {
      		var elem, tmp, tag, wrap, contains, j,
      			i = 0,
      			l = elems.length,
      			fragment = context.createDocumentFragment(),
      			nodes = [];
      
      		for ( ; i < l; i++ ) {
      			elem = elems[ i ];
      
      			if ( elem || elem === 0 ) {
      
      				// Add nodes directly
      				if ( jQuery.type( elem ) === "object" ) {
      					// Support: QtWebKit
      					// jQuery.merge because core_push.apply(_, arraylike) throws
      					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );
      
      				// Convert non-html into a text node
      				} else if ( !rhtml.test( elem ) ) {
      					nodes.push( context.createTextNode( elem ) );
      
      				// Convert html into DOM nodes
      				} else {
      					tmp = tmp || fragment.appendChild( context.createElement("div") );
      
      					// Deserialize a standard representation
      					tag = ( rtagName.exec( elem ) || ["", ""] )[ 1 ].toLowerCase();
      					wrap = wrapMap[ tag ] || wrapMap._default;
      					tmp.innerHTML = wrap[ 1 ] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[ 2 ];
      
      					// Descend through wrappers to the right content
      					j = wrap[ 0 ];
      					while ( j-- ) {
      						tmp = tmp.lastChild;
      					}
      
      					// Support: QtWebKit
      					// jQuery.merge because core_push.apply(_, arraylike) throws
      					jQuery.merge( nodes, tmp.childNodes );
      
      					// Remember the top-level container
      					tmp = fragment.firstChild;
      
      					// Fixes #12346
      					// Support: Webkit, IE
      					tmp.textContent = "";
      				}
      			}
      		}
      
      		// Remove wrapper from fragment
      		fragment.textContent = "";
      
      		i = 0;
      		while ( (elem = nodes[ i++ ]) ) {
      
      			// #4087 - If origin and destination elements are the same, and this is
      			// that element, do not do anything
      			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
      				continue;
      			}
      
      			contains = jQuery.contains( elem.ownerDocument, elem );
      
      			// Append to fragment
      			tmp = getAll( fragment.appendChild( elem ), "script" );
      
      			// Preserve script evaluation history
      			if ( contains ) {
      				setGlobalEval( tmp );
      			}
      
      			// Capture executables
      			if ( scripts ) {
      				j = 0;
      				while ( (elem = tmp[ j++ ]) ) {
      					if ( rscriptType.test( elem.type || "" ) ) {
      						scripts.push( elem );
      					}
      				}
      			}
      		}
      
      		return fragment;
      	},
      
      	cleanData: function( elems ) {
      		var data, elem, events, type, key, j,
      			special = jQuery.event.special,
      			i = 0;
      
      		for ( ; (elem = elems[ i ]) !== undefined; i++ ) {
      			if ( Data.accepts( elem ) ) {
      				key = elem[ data_priv.expando ];
      
      				if ( key && (data = data_priv.cache[ key ]) ) {
      					events = Object.keys( data.events || {} );
      					if ( events.length ) {
      						for ( j = 0; (type = events[j]) !== undefined; j++ ) {
      							if ( special[ type ] ) {
      								jQuery.event.remove( elem, type );
      
      							// This is a shortcut to avoid jQuery.event.remove's overhead
      							} else {
      								jQuery.removeEvent( elem, type, data.handle );
      							}
      						}
      					}
      					if ( data_priv.cache[ key ] ) {
      						// Discard any remaining `private` data
      						delete data_priv.cache[ key ];
      					}
      				}
      			}
      			// Discard any remaining `user` data
      			delete data_user.cache[ elem[ data_user.expando ] ];
      		}
      	},
      
      	_evalUrl: function( url ) {
      		return jQuery.ajax({
      			url: url,
      			type: "GET",
      			dataType: "script",
      			async: false,
      			global: false,
      			"throws": true
      		});
      	}
      });
      
      // Support: 1.x compatibility
      // Manipulating tables requires a tbody
      function manipulationTarget( elem, content ) {
      	return jQuery.nodeName( elem, "table" ) &&
      		jQuery.nodeName( content.nodeType === 1 ? content : content.firstChild, "tr" ) ?
      
      		elem.getElementsByTagName("tbody")[0] ||
      			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
      		elem;
      }
      
      // Replace/restore the type attribute of script elements for safe DOM manipulation
      function disableScript( elem ) {
      	elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
      	return elem;
      }
      function restoreScript( elem ) {
      	var match = rscriptTypeMasked.exec( elem.type );
      
      	if ( match ) {
      		elem.type = match[ 1 ];
      	} else {
      		elem.removeAttribute("type");
      	}
      
      	return elem;
      }
      
      // Mark scripts as having already been evaluated
      function setGlobalEval( elems, refElements ) {
      	var l = elems.length,
      		i = 0;
      
      	for ( ; i < l; i++ ) {
      		data_priv.set(
      			elems[ i ], "globalEval", !refElements || data_priv.get( refElements[ i ], "globalEval" )
      		);
      	}
      }
      
      function cloneCopyEvent( src, dest ) {
      	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;
      
      	if ( dest.nodeType !== 1 ) {
      		return;
      	}
      
      	// 1. Copy private data: events, handlers, etc.
      	if ( data_priv.hasData( src ) ) {
      		pdataOld = data_priv.access( src );
      		pdataCur = data_priv.set( dest, pdataOld );
      		events = pdataOld.events;
      
      		if ( events ) {
      			delete pdataCur.handle;
      			pdataCur.events = {};
      
      			for ( type in events ) {
      				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
      					jQuery.event.add( dest, type, events[ type ][ i ] );
      				}
      			}
      		}
      	}
      
      	// 2. Copy user data
      	if ( data_user.hasData( src ) ) {
      		udataOld = data_user.access( src );
      		udataCur = jQuery.extend( {}, udataOld );
      
      		data_user.set( dest, udataCur );
      	}
      }
      
      
      function getAll( context, tag ) {
      	var ret = context.getElementsByTagName ? context.getElementsByTagName( tag || "*" ) :
      			context.querySelectorAll ? context.querySelectorAll( tag || "*" ) :
      			[];
      
      	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
      		jQuery.merge( [ context ], ret ) :
      		ret;
      }
      
      // Support: IE >= 9
      function fixInput( src, dest ) {
      	var nodeName = dest.nodeName.toLowerCase();
      
      	// Fails to persist the checked state of a cloned checkbox or radio button.
      	if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
      		dest.checked = src.checked;
      
      	// Fails to return the selected option to the default selected state when cloning options
      	} else if ( nodeName === "input" || nodeName === "textarea" ) {
      		dest.defaultValue = src.defaultValue;
      	}
      }
      jQuery.fn.extend({
      	wrapAll: function( html ) {
      		var wrap;
      
      		if ( jQuery.isFunction( html ) ) {
      			return this.each(function( i ) {
      				jQuery( this ).wrapAll( html.call(this, i) );
      			});
      		}
      
      		if ( this[ 0 ] ) {
      
      			// The elements to wrap the target around
      			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );
      
      			if ( this[ 0 ].parentNode ) {
      				wrap.insertBefore( this[ 0 ] );
      			}
      
      			wrap.map(function() {
      				var elem = this;
      
      				while ( elem.firstElementChild ) {
      					elem = elem.firstElementChild;
      				}
      
      				return elem;
      			}).append( this );
      		}
      
      		return this;
      	},
      
      	wrapInner: function( html ) {
      		if ( jQuery.isFunction( html ) ) {
      			return this.each(function( i ) {
      				jQuery( this ).wrapInner( html.call(this, i) );
      			});
      		}
      
      		return this.each(function() {
      			var self = jQuery( this ),
      				contents = self.contents();
      
      			if ( contents.length ) {
      				contents.wrapAll( html );
      
      			} else {
      				self.append( html );
      			}
      		});
      	},
      
      	wrap: function( html ) {
      		var isFunction = jQuery.isFunction( html );
      
      		return this.each(function( i ) {
      			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
      		});
      	},
      
      	unwrap: function() {
      		return this.parent().each(function() {
      			if ( !jQuery.nodeName( this, "body" ) ) {
      				jQuery( this ).replaceWith( this.childNodes );
      			}
      		}).end();
      	}
      });
      var curCSS, iframe,
      	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
      	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
      	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
      	rmargin = /^margin/,
      	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
      	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
      	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
      	elemdisplay = { BODY: "block" },
      
      	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
      	cssNormalTransform = {
      		letterSpacing: 0,
      		fontWeight: 400
      	},
      
      	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
      	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];
      
      // return a css property mapped to a potentially vendor prefixed property
      function vendorPropName( style, name ) {
      
      	// shortcut for names that are not vendor prefixed
      	if ( name in style ) {
      		return name;
      	}
      
      	// check for vendor prefixed names
      	var capName = name.charAt(0).toUpperCase() + name.slice(1),
      		origName = name,
      		i = cssPrefixes.length;
      
      	while ( i-- ) {
      		name = cssPrefixes[ i ] + capName;
      		if ( name in style ) {
      			return name;
      		}
      	}
      
      	return origName;
      }
      
      function isHidden( elem, el ) {
      	// isHidden might be called from jQuery#filter function;
      	// in that case, element will be second argument
      	elem = el || elem;
      	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
      }
      
      // NOTE: we've included the "window" in window.getComputedStyle
      // because jsdom on node.js will break without it.
      function getStyles( elem ) {
      	return window.getComputedStyle( elem, null );
      }
      
      function showHide( elements, show ) {
      	var display, elem, hidden,
      		values = [],
      		index = 0,
      		length = elements.length;
      
      	for ( ; index < length; index++ ) {
      		elem = elements[ index ];
      		if ( !elem.style ) {
      			continue;
      		}
      
      		values[ index ] = data_priv.get( elem, "olddisplay" );
      		display = elem.style.display;
      		if ( show ) {
      			// Reset the inline display of this element to learn if it is
      			// being hidden by cascaded rules or not
      			if ( !values[ index ] && display === "none" ) {
      				elem.style.display = "";
      			}
      
      			// Set elements which have been overridden with display: none
      			// in a stylesheet to whatever the default browser style is
      			// for such an element
      			if ( elem.style.display === "" && isHidden( elem ) ) {
      				values[ index ] = data_priv.access( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
      			}
      		} else {
      
      			if ( !values[ index ] ) {
      				hidden = isHidden( elem );
      
      				if ( display && display !== "none" || !hidden ) {
      					data_priv.set( elem, "olddisplay", hidden ? display : jQuery.css(elem, "display") );
      				}
      			}
      		}
      	}
      
      	// Set the display of most of the elements in a second loop
      	// to avoid the constant reflow
      	for ( index = 0; index < length; index++ ) {
      		elem = elements[ index ];
      		if ( !elem.style ) {
      			continue;
      		}
      		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
      			elem.style.display = show ? values[ index ] || "" : "none";
      		}
      	}
      
      	return elements;
      }
      
      jQuery.fn.extend({
      	css: function( name, value ) {
      		return jQuery.access( this, function( elem, name, value ) {
      			var styles, len,
      				map = {},
      				i = 0;
      
      			if ( jQuery.isArray( name ) ) {
      				styles = getStyles( elem );
      				len = name.length;
      
      				for ( ; i < len; i++ ) {
      					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
      				}
      
      				return map;
      			}
      
      			return value !== undefined ?
      				jQuery.style( elem, name, value ) :
      				jQuery.css( elem, name );
      		}, name, value, arguments.length > 1 );
      	},
      	show: function() {
      		return showHide( this, true );
      	},
      	hide: function() {
      		return showHide( this );
      	},
      	toggle: function( state ) {
      		if ( typeof state === "boolean" ) {
      			return state ? this.show() : this.hide();
      		}
      
      		return this.each(function() {
      			if ( isHidden( this ) ) {
      				jQuery( this ).show();
      			} else {
      				jQuery( this ).hide();
      			}
      		});
      	}
      });
      
      jQuery.extend({
      	// Add in style property hooks for overriding the default
      	// behavior of getting and setting a style property
      	cssHooks: {
      		opacity: {
      			get: function( elem, computed ) {
      				if ( computed ) {
      					// We should always get a number back from opacity
      					var ret = curCSS( elem, "opacity" );
      					return ret === "" ? "1" : ret;
      				}
      			}
      		}
      	},
      
      	// Don't automatically add "px" to these possibly-unitless properties
      	cssNumber: {
      		"columnCount": true,
      		"fillOpacity": true,
      		"fontWeight": true,
      		"lineHeight": true,
      		"opacity": true,
      		"order": true,
      		"orphans": true,
      		"widows": true,
      		"zIndex": true,
      		"zoom": true
      	},
      
      	// Add in properties whose names you wish to fix before
      	// setting or getting the value
      	cssProps: {
      		// normalize float css property
      		"float": "cssFloat"
      	},
      
      	// Get and set the style property on a DOM Node
      	style: function( elem, name, value, extra ) {
      		// Don't set styles on text and comment nodes
      		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
      			return;
      		}
      
      		// Make sure that we're working with the right name
      		var ret, type, hooks,
      			origName = jQuery.camelCase( name ),
      			style = elem.style;
      
      		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );
      
      		// gets hook for the prefixed version
      		// followed by the unprefixed version
      		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];
      
      		// Check if we're setting a value
      		if ( value !== undefined ) {
      			type = typeof value;
      
      			// convert relative number strings (+= or -=) to relative numbers. #7345
      			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
      				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
      				// Fixes bug #9237
      				type = "number";
      			}
      
      			// Make sure that NaN and null values aren't set. See: #7116
      			if ( value == null || type === "number" && isNaN( value ) ) {
      				return;
      			}
      
      			// If a number was passed in, add 'px' to the (except for certain CSS properties)
      			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
      				value += "px";
      			}
      
      			// Fixes #8908, it can be done more correctly by specifying setters in cssHooks,
      			// but it would mean to define eight (for every problematic property) identical functions
      			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
      				style[ name ] = "inherit";
      			}
      
      			// If a hook was provided, use that value, otherwise just set the specified value
      			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {
      				style[ name ] = value;
      			}
      
      		} else {
      			// If a hook was provided get the non-computed value from there
      			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
      				return ret;
      			}
      
      			// Otherwise just get the value from the style object
      			return style[ name ];
      		}
      	},
      
      	css: function( elem, name, extra, styles ) {
      		var val, num, hooks,
      			origName = jQuery.camelCase( name );
      
      		// Make sure that we're working with the right name
      		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );
      
      		// gets hook for the prefixed version
      		// followed by the unprefixed version
      		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];
      
      		// If a hook was provided get the computed value from there
      		if ( hooks && "get" in hooks ) {
      			val = hooks.get( elem, true, extra );
      		}
      
      		// Otherwise, if a way to get the computed value exists, use that
      		if ( val === undefined ) {
      			val = curCSS( elem, name, styles );
      		}
      
      		//convert "normal" to computed value
      		if ( val === "normal" && name in cssNormalTransform ) {
      			val = cssNormalTransform[ name ];
      		}
      
      		// Return, converting to number if forced or a qualifier was provided and val looks numeric
      		if ( extra === "" || extra ) {
      			num = parseFloat( val );
      			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
      		}
      		return val;
      	}
      });
      
      curCSS = function( elem, name, _computed ) {
      	var width, minWidth, maxWidth,
      		computed = _computed || getStyles( elem ),
      
      		// Support: IE9
      		// getPropertyValue is only needed for .css('filter') in IE9, see #12537
      		ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
      		style = elem.style;
      
      	if ( computed ) {
      
      		if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
      			ret = jQuery.style( elem, name );
      		}
      
      		// Support: Safari 5.1
      		// A tribute to the "awesome hack by Dean Edwards"
      		// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
      		// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
      		if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {
      
      			// Remember the original values
      			width = style.width;
      			minWidth = style.minWidth;
      			maxWidth = style.maxWidth;
      
      			// Put in the new values to get a computed value out
      			style.minWidth = style.maxWidth = style.width = ret;
      			ret = computed.width;
      
      			// Revert the changed values
      			style.width = width;
      			style.minWidth = minWidth;
      			style.maxWidth = maxWidth;
      		}
      	}
      
      	return ret;
      };
      
      
      function setPositiveNumber( elem, value, subtract ) {
      	var matches = rnumsplit.exec( value );
      	return matches ?
      		// Guard against undefined "subtract", e.g., when used as in cssHooks
      		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
      		value;
      }
      
      function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
      	var i = extra === ( isBorderBox ? "border" : "content" ) ?
      		// If we already have the right measurement, avoid augmentation
      		4 :
      		// Otherwise initialize for horizontal or vertical properties
      		name === "width" ? 1 : 0,
      
      		val = 0;
      
      	for ( ; i < 4; i += 2 ) {
      		// both box models exclude margin, so add it if we want it
      		if ( extra === "margin" ) {
      			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
      		}
      
      		if ( isBorderBox ) {
      			// border-box includes padding, so remove it if we want content
      			if ( extra === "content" ) {
      				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
      			}
      
      			// at this point, extra isn't border nor margin, so remove border
      			if ( extra !== "margin" ) {
      				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
      			}
      		} else {
      			// at this point, extra isn't content, so add padding
      			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
      
      			// at this point, extra isn't content nor padding, so add border
      			if ( extra !== "padding" ) {
      				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
      			}
      		}
      	}
      
      	return val;
      }
      
      function getWidthOrHeight( elem, name, extra ) {
      
      	// Start with offset property, which is equivalent to the border-box value
      	var valueIsBorderBox = true,
      		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
      		styles = getStyles( elem ),
      		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";
      
      	// some non-html elements return undefined for offsetWidth, so check for null/undefined
      	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
      	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
      	if ( val <= 0 || val == null ) {
      		// Fall back to computed then uncomputed css if necessary
      		val = curCSS( elem, name, styles );
      		if ( val < 0 || val == null ) {
      			val = elem.style[ name ];
      		}
      
      		// Computed unit is not pixels. Stop here and return.
      		if ( rnumnonpx.test(val) ) {
      			return val;
      		}
      
      		// we need the check for style in case a browser which returns unreliable values
      		// for getComputedStyle silently falls back to the reliable elem.style
      		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );
      
      		// Normalize "", auto, and prepare for extra
      		val = parseFloat( val ) || 0;
      	}
      
      	// use the active box-sizing model to add/subtract irrelevant styles
      	return ( val +
      		augmentWidthOrHeight(
      			elem,
      			name,
      			extra || ( isBorderBox ? "border" : "content" ),
      			valueIsBorderBox,
      			styles
      		)
      	) + "px";
      }
      
      // Try to determine the default display value of an element
      function css_defaultDisplay( nodeName ) {
      	var doc = document,
      		display = elemdisplay[ nodeName ];
      
      	if ( !display ) {
      		display = actualDisplay( nodeName, doc );
      
      		// If the simple way fails, read from inside an iframe
      		if ( display === "none" || !display ) {
      			// Use the already-created iframe if possible
      			iframe = ( iframe ||
      				jQuery("<iframe frameborder='0' width='0' height='0'/>")
      				.css( "cssText", "display:block !important" )
      			).appendTo( doc.documentElement );
      
      			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
      			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
      			doc.write("<!doctype html><html><body>");
      			doc.close();
      
      			display = actualDisplay( nodeName, doc );
      			iframe.detach();
      		}
      
      		// Store the correct default display
      		elemdisplay[ nodeName ] = display;
      	}
      
      	return display;
      }
      
      // Called ONLY from within css_defaultDisplay
      function actualDisplay( name, doc ) {
      	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
      		display = jQuery.css( elem[0], "display" );
      	elem.remove();
      	return display;
      }
      
      jQuery.each([ "height", "width" ], function( i, name ) {
      	jQuery.cssHooks[ name ] = {
      		get: function( elem, computed, extra ) {
      			if ( computed ) {
      				// certain elements can have dimension info if we invisibly show them
      				// however, it must have a current display style that would benefit from this
      				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
      					jQuery.swap( elem, cssShow, function() {
      						return getWidthOrHeight( elem, name, extra );
      					}) :
      					getWidthOrHeight( elem, name, extra );
      			}
      		},
      
      		set: function( elem, value, extra ) {
      			var styles = extra && getStyles( elem );
      			return setPositiveNumber( elem, value, extra ?
      				augmentWidthOrHeight(
      					elem,
      					name,
      					extra,
      					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
      					styles
      				) : 0
      			);
      		}
      	};
      });
      
      // These hooks cannot be added until DOM ready because the support test
      // for it is not run until after DOM ready
      jQuery(function() {
      	// Support: Android 2.3
      	if ( !jQuery.support.reliableMarginRight ) {
      		jQuery.cssHooks.marginRight = {
      			get: function( elem, computed ) {
      				if ( computed ) {
      					// Support: Android 2.3
      					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
      					// Work around by temporarily setting element display to inline-block
      					return jQuery.swap( elem, { "display": "inline-block" },
      						curCSS, [ elem, "marginRight" ] );
      				}
      			}
      		};
      	}
      
      	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
      	// getComputedStyle returns percent when specified for top/left/bottom/right
      	// rather than make the css module depend on the offset module, we just check for it here
      	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
      		jQuery.each( [ "top", "left" ], function( i, prop ) {
      			jQuery.cssHooks[ prop ] = {
      				get: function( elem, computed ) {
      					if ( computed ) {
      						computed = curCSS( elem, prop );
      						// if curCSS returns percentage, fallback to offset
      						return rnumnonpx.test( computed ) ?
      							jQuery( elem ).position()[ prop ] + "px" :
      							computed;
      					}
      				}
      			};
      		});
      	}
      
      });
      
      if ( jQuery.expr && jQuery.expr.filters ) {
      	jQuery.expr.filters.hidden = function( elem ) {
      		// Support: Opera <= 12.12
      		// Opera reports offsetWidths and offsetHeights less than zero on some elements
      		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0;
      	};
      
      	jQuery.expr.filters.visible = function( elem ) {
      		return !jQuery.expr.filters.hidden( elem );
      	};
      }
      
      // These hooks are used by animate to expand properties
      jQuery.each({
      	margin: "",
      	padding: "",
      	border: "Width"
      }, function( prefix, suffix ) {
      	jQuery.cssHooks[ prefix + suffix ] = {
      		expand: function( value ) {
      			var i = 0,
      				expanded = {},
      
      				// assumes a single number if not a string
      				parts = typeof value === "string" ? value.split(" ") : [ value ];
      
      			for ( ; i < 4; i++ ) {
      				expanded[ prefix + cssExpand[ i ] + suffix ] =
      					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
      			}
      
      			return expanded;
      		}
      	};
      
      	if ( !rmargin.test( prefix ) ) {
      		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
      	}
      });
      var r20 = /%20/g,
      	rbracket = /\[\]$/,
      	rCRLF = /\r?\n/g,
      	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
      	rsubmittable = /^(?:input|select|textarea|keygen)/i;
      
      jQuery.fn.extend({
      	serialize: function() {
      		return jQuery.param( this.serializeArray() );
      	},
      	serializeArray: function() {
      		return this.map(function(){
      			// Can add propHook for "elements" to filter or add form elements
      			var elements = jQuery.prop( this, "elements" );
      			return elements ? jQuery.makeArray( elements ) : this;
      		})
      		.filter(function(){
      			var type = this.type;
      			// Use .is(":disabled") so that fieldset[disabled] works
      			return this.name && !jQuery( this ).is( ":disabled" ) &&
      				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
      				( this.checked || !manipulation_rcheckableType.test( type ) );
      		})
      		.map(function( i, elem ){
      			var val = jQuery( this ).val();
      
      			return val == null ?
      				null :
      				jQuery.isArray( val ) ?
      					jQuery.map( val, function( val ){
      						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
      					}) :
      					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
      		}).get();
      	}
      });
      
      //Serialize an array of form elements or a set of
      //key/values into a query string
      jQuery.param = function( a, traditional ) {
      	var prefix,
      		s = [],
      		add = function( key, value ) {
      			// If value is a function, invoke it and return its value
      			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
      			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
      		};
      
      	// Set traditional to true for jQuery <= 1.3.2 behavior.
      	if ( traditional === undefined ) {
      		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
      	}
      
      	// If an array was passed in, assume that it is an array of form elements.
      	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
      		// Serialize the form elements
      		jQuery.each( a, function() {
      			add( this.name, this.value );
      		});
      
      	} else {
      		// If traditional, encode the "old" way (the way 1.3.2 or older
      		// did it), otherwise encode params recursively.
      		for ( prefix in a ) {
      			buildParams( prefix, a[ prefix ], traditional, add );
      		}
      	}
      
      	// Return the resulting serialization
      	return s.join( "&" ).replace( r20, "+" );
      };
      
      function buildParams( prefix, obj, traditional, add ) {
      	var name;
      
      	if ( jQuery.isArray( obj ) ) {
      		// Serialize array item.
      		jQuery.each( obj, function( i, v ) {
      			if ( traditional || rbracket.test( prefix ) ) {
      				// Treat each array item as a scalar.
      				add( prefix, v );
      
      			} else {
      				// Item is non-scalar (array or object), encode its numeric index.
      				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
      			}
      		});
      
      	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
      		// Serialize object item.
      		for ( name in obj ) {
      			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
      		}
      
      	} else {
      		// Serialize scalar item.
      		add( prefix, obj );
      	}
      }
      jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
      	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
      	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {
      
      	// Handle event binding
      	jQuery.fn[ name ] = function( data, fn ) {
      		return arguments.length > 0 ?
      			this.on( name, null, data, fn ) :
      			this.trigger( name );
      	};
      });
      
      jQuery.fn.extend({
      	hover: function( fnOver, fnOut ) {
      		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
      	},
      
      	bind: function( types, data, fn ) {
      		return this.on( types, null, data, fn );
      	},
      	unbind: function( types, fn ) {
      		return this.off( types, null, fn );
      	},
      
      	delegate: function( selector, types, data, fn ) {
      		return this.on( types, selector, data, fn );
      	},
      	undelegate: function( selector, types, fn ) {
      		// ( namespace ) or ( selector, types [, fn] )
      		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
      	}
      });
      var
      	// Document location
      	ajaxLocParts,
      	ajaxLocation,
      
      	ajax_nonce = jQuery.now(),
      
      	ajax_rquery = /\?/,
      	rhash = /#.*$/,
      	rts = /([?&])_=[^&]*/,
      	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,
      	// #7653, #8125, #8152: local protocol detection
      	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
      	rnoContent = /^(?:GET|HEAD)$/,
      	rprotocol = /^\/\//,
      	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,
      
      	// Keep a copy of the old load method
      	_load = jQuery.fn.load,
      
      	/* Prefilters
      	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
      	 * 2) These are called:
      	 *    - BEFORE asking for a transport
      	 *    - AFTER param serialization (s.data is a string if s.processData is true)
      	 * 3) key is the dataType
      	 * 4) the catchall symbol "*" can be used
      	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
      	 */
      	prefilters = {},
      
      	/* Transports bindings
      	 * 1) key is the dataType
      	 * 2) the catchall symbol "*" can be used
      	 * 3) selection will start with transport dataType and THEN go to "*" if needed
      	 */
      	transports = {},
      
      	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
      	allTypes = "*/".concat("*");
      
      // #8138, IE may throw an exception when accessing
      // a field from window.location if document.domain has been set
      try {
      	ajaxLocation = location.href;
      } catch( e ) {
      	// Use the href attribute of an A element
      	// since IE will modify it given document.location
      	ajaxLocation = document.createElement( "a" );
      	ajaxLocation.href = "";
      	ajaxLocation = ajaxLocation.href;
      }
      
      // Segment location into parts
      ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];
      
      // Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
      function addToPrefiltersOrTransports( structure ) {
      
      	// dataTypeExpression is optional and defaults to "*"
      	return function( dataTypeExpression, func ) {
      
      		if ( typeof dataTypeExpression !== "string" ) {
      			func = dataTypeExpression;
      			dataTypeExpression = "*";
      		}
      
      		var dataType,
      			i = 0,
      			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];
      
      		if ( jQuery.isFunction( func ) ) {
      			// For each dataType in the dataTypeExpression
      			while ( (dataType = dataTypes[i++]) ) {
      				// Prepend if requested
      				if ( dataType[0] === "+" ) {
      					dataType = dataType.slice( 1 ) || "*";
      					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );
      
      				// Otherwise append
      				} else {
      					(structure[ dataType ] = structure[ dataType ] || []).push( func );
      				}
      			}
      		}
      	};
      }
      
      // Base inspection function for prefilters and transports
      function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {
      
      	var inspected = {},
      		seekingTransport = ( structure === transports );
      
      	function inspect( dataType ) {
      		var selected;
      		inspected[ dataType ] = true;
      		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
      			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
      			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
      				options.dataTypes.unshift( dataTypeOrTransport );
      				inspect( dataTypeOrTransport );
      				return false;
      			} else if ( seekingTransport ) {
      				return !( selected = dataTypeOrTransport );
      			}
      		});
      		return selected;
      	}
      
      	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
      }
      
      // A special extend for ajax options
      // that takes "flat" options (not to be deep extended)
      // Fixes #9887
      function ajaxExtend( target, src ) {
      	var key, deep,
      		flatOptions = jQuery.ajaxSettings.flatOptions || {};
      
      	for ( key in src ) {
      		if ( src[ key ] !== undefined ) {
      			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
      		}
      	}
      	if ( deep ) {
      		jQuery.extend( true, target, deep );
      	}
      
      	return target;
      }
      
      jQuery.fn.load = function( url, params, callback ) {
      	if ( typeof url !== "string" && _load ) {
      		return _load.apply( this, arguments );
      	}
      
      	var selector, type, response,
      		self = this,
      		off = url.indexOf(" ");
      
      	if ( off >= 0 ) {
      		selector = url.slice( off );
      		url = url.slice( 0, off );
      	}
      
      	// If it's a function
      	if ( jQuery.isFunction( params ) ) {
      
      		// We assume that it's the callback
      		callback = params;
      		params = undefined;
      
      	// Otherwise, build a param string
      	} else if ( params && typeof params === "object" ) {
      		type = "POST";
      	}
      
      	// If we have elements to modify, make the request
      	if ( self.length > 0 ) {
      		jQuery.ajax({
      			url: url,
      
      			// if "type" variable is undefined, then "GET" method will be used
      			type: type,
      			dataType: "html",
      			data: params
      		}).done(function( responseText ) {
      
      			// Save response for use in complete callback
      			response = arguments;
      
      			self.html( selector ?
      
      				// If a selector was specified, locate the right elements in a dummy div
      				// Exclude scripts to avoid IE 'Permission Denied' errors
      				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :
      
      				// Otherwise use the full result
      				responseText );
      
      		}).complete( callback && function( jqXHR, status ) {
      			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
      		});
      	}
      
      	return this;
      };
      
      // Attach a bunch of functions for handling common AJAX events
      jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
      	jQuery.fn[ type ] = function( fn ){
      		return this.on( type, fn );
      	};
      });
      
      jQuery.extend({
      
      	// Counter for holding the number of active queries
      	active: 0,
      
      	// Last-Modified header cache for next request
      	lastModified: {},
      	etag: {},
      
      	ajaxSettings: {
      		url: ajaxLocation,
      		type: "GET",
      		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
      		global: true,
      		processData: true,
      		async: true,
      		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      		/*
      		timeout: 0,
      		data: null,
      		dataType: null,
      		username: null,
      		password: null,
      		cache: null,
      		throws: false,
      		traditional: false,
      		headers: {},
      		*/
      
      		accepts: {
      			"*": allTypes,
      			text: "text/plain",
      			html: "text/html",
      			xml: "application/xml, text/xml",
      			json: "application/json, text/javascript"
      		},
      
      		contents: {
      			xml: /xml/,
      			html: /html/,
      			json: /json/
      		},
      
      		responseFields: {
      			xml: "responseXML",
      			text: "responseText",
      			json: "responseJSON"
      		},
      
      		// Data converters
      		// Keys separate source (or catchall "*") and destination types with a single space
      		converters: {
      
      			// Convert anything to text
      			"* text": String,
      
      			// Text to html (true = no transformation)
      			"text html": true,
      
      			// Evaluate text as a json expression
      			"text json": jQuery.parseJSON,
      
      			// Parse text as xml
      			"text xml": jQuery.parseXML
      		},
      
      		// For options that shouldn't be deep extended:
      		// you can add your own custom options here if
      		// and when you create one that shouldn't be
      		// deep extended (see ajaxExtend)
      		flatOptions: {
      			url: true,
      			context: true
      		}
      	},
      
      	// Creates a full fledged settings object into target
      	// with both ajaxSettings and settings fields.
      	// If target is omitted, writes into ajaxSettings.
      	ajaxSetup: function( target, settings ) {
      		return settings ?
      
      			// Building a settings object
      			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :
      
      			// Extending ajaxSettings
      			ajaxExtend( jQuery.ajaxSettings, target );
      	},
      
      	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
      	ajaxTransport: addToPrefiltersOrTransports( transports ),
      
      	// Main method
      	ajax: function( url, options ) {
      
      		// If url is an object, simulate pre-1.5 signature
      		if ( typeof url === "object" ) {
      			options = url;
      			url = undefined;
      		}
      
      		// Force options to be an object
      		options = options || {};
      
      		var transport,
      			// URL without anti-cache param
      			cacheURL,
      			// Response headers
      			responseHeadersString,
      			responseHeaders,
      			// timeout handle
      			timeoutTimer,
      			// Cross-domain detection vars
      			parts,
      			// To know if global events are to be dispatched
      			fireGlobals,
      			// Loop variable
      			i,
      			// Create the final options object
      			s = jQuery.ajaxSetup( {}, options ),
      			// Callbacks context
      			callbackContext = s.context || s,
      			// Context for global events is callbackContext if it is a DOM node or jQuery collection
      			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
      				jQuery( callbackContext ) :
      				jQuery.event,
      			// Deferreds
      			deferred = jQuery.Deferred(),
      			completeDeferred = jQuery.Callbacks("once memory"),
      			// Status-dependent callbacks
      			statusCode = s.statusCode || {},
      			// Headers (they are sent all at once)
      			requestHeaders = {},
      			requestHeadersNames = {},
      			// The jqXHR state
      			state = 0,
      			// Default abort message
      			strAbort = "canceled",
      			// Fake xhr
      			jqXHR = {
      				readyState: 0,
      
      				// Builds headers hashtable if needed
      				getResponseHeader: function( key ) {
      					var match;
      					if ( state === 2 ) {
      						if ( !responseHeaders ) {
      							responseHeaders = {};
      							while ( (match = rheaders.exec( responseHeadersString )) ) {
      								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
      							}
      						}
      						match = responseHeaders[ key.toLowerCase() ];
      					}
      					return match == null ? null : match;
      				},
      
      				// Raw string
      				getAllResponseHeaders: function() {
      					return state === 2 ? responseHeadersString : null;
      				},
      
      				// Caches the header
      				setRequestHeader: function( name, value ) {
      					var lname = name.toLowerCase();
      					if ( !state ) {
      						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
      						requestHeaders[ name ] = value;
      					}
      					return this;
      				},
      
      				// Overrides response content-type header
      				overrideMimeType: function( type ) {
      					if ( !state ) {
      						s.mimeType = type;
      					}
      					return this;
      				},
      
      				// Status-dependent callbacks
      				statusCode: function( map ) {
      					var code;
      					if ( map ) {
      						if ( state < 2 ) {
      							for ( code in map ) {
      								// Lazy-add the new callback in a way that preserves old ones
      								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
      							}
      						} else {
      							// Execute the appropriate callbacks
      							jqXHR.always( map[ jqXHR.status ] );
      						}
      					}
      					return this;
      				},
      
      				// Cancel the request
      				abort: function( statusText ) {
      					var finalText = statusText || strAbort;
      					if ( transport ) {
      						transport.abort( finalText );
      					}
      					done( 0, finalText );
      					return this;
      				}
      			};
      
      		// Attach deferreds
      		deferred.promise( jqXHR ).complete = completeDeferred.add;
      		jqXHR.success = jqXHR.done;
      		jqXHR.error = jqXHR.fail;
      
      		// Remove hash character (#7531: and string promotion)
      		// Add protocol if not provided (prefilters might expect it)
      		// Handle falsy url in the settings object (#10093: consistency with old signature)
      		// We also use the url parameter if available
      		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" )
      			.replace( rprotocol, ajaxLocParts[ 1 ] + "//" );
      
      		// Alias method option to type as per ticket #12004
      		s.type = options.method || options.type || s.method || s.type;
      
      		// Extract dataTypes list
      		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];
      
      		// A cross-domain request is in order when we have a protocol:host:port mismatch
      		if ( s.crossDomain == null ) {
      			parts = rurl.exec( s.url.toLowerCase() );
      			s.crossDomain = !!( parts &&
      				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
      					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
      						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
      			);
      		}
      
      		// Convert data if not already a string
      		if ( s.data && s.processData && typeof s.data !== "string" ) {
      			s.data = jQuery.param( s.data, s.traditional );
      		}
      
      		// Apply prefilters
      		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );
      
      		// If request was aborted inside a prefilter, stop there
      		if ( state === 2 ) {
      			return jqXHR;
      		}
      
      		// We can fire global events as of now if asked to
      		fireGlobals = s.global;
      
      		// Watch for a new set of requests
      		if ( fireGlobals && jQuery.active++ === 0 ) {
      			jQuery.event.trigger("ajaxStart");
      		}
      
      		// Uppercase the type
      		s.type = s.type.toUpperCase();
      
      		// Determine if request has content
      		s.hasContent = !rnoContent.test( s.type );
      
      		// Save the URL in case we're toying with the If-Modified-Since
      		// and/or If-None-Match header later on
      		cacheURL = s.url;
      
      		// More options handling for requests with no content
      		if ( !s.hasContent ) {
      
      			// If data is available, append data to url
      			if ( s.data ) {
      				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
      				// #9682: remove data so that it's not used in an eventual retry
      				delete s.data;
      			}
      
      			// Add anti-cache in url if needed
      			if ( s.cache === false ) {
      				s.url = rts.test( cacheURL ) ?
      
      					// If there is already a '_' parameter, set its value
      					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :
      
      					// Otherwise add one to the end
      					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
      			}
      		}
      
      		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
      		if ( s.ifModified ) {
      			if ( jQuery.lastModified[ cacheURL ] ) {
      				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
      			}
      			if ( jQuery.etag[ cacheURL ] ) {
      				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
      			}
      		}
      
      		// Set the correct header, if data is being sent
      		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
      			jqXHR.setRequestHeader( "Content-Type", s.contentType );
      		}
      
      		// Set the Accepts header for the server, depending on the dataType
      		jqXHR.setRequestHeader(
      			"Accept",
      			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
      				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
      				s.accepts[ "*" ]
      		);
      
      		// Check for headers option
      		for ( i in s.headers ) {
      			jqXHR.setRequestHeader( i, s.headers[ i ] );
      		}
      
      		// Allow custom headers/mimetypes and early abort
      		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
      			// Abort if not done already and return
      			return jqXHR.abort();
      		}
      
      		// aborting is no longer a cancellation
      		strAbort = "abort";
      
      		// Install callbacks on deferreds
      		for ( i in { success: 1, error: 1, complete: 1 } ) {
      			jqXHR[ i ]( s[ i ] );
      		}
      
      		// Get transport
      		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );
      
      		// If no transport, we auto-abort
      		if ( !transport ) {
      			done( -1, "No Transport" );
      		} else {
      			jqXHR.readyState = 1;
      
      			// Send global event
      			if ( fireGlobals ) {
      				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
      			}
      			// Timeout
      			if ( s.async && s.timeout > 0 ) {
      				timeoutTimer = setTimeout(function() {
      					jqXHR.abort("timeout");
      				}, s.timeout );
      			}
      
      			try {
      				state = 1;
      				transport.send( requestHeaders, done );
      			} catch ( e ) {
      				// Propagate exception as error if not done
      				if ( state < 2 ) {
      					done( -1, e );
      				// Simply rethrow otherwise
      				} else {
      					throw e;
      				}
      			}
      		}
      
      		// Callback for when everything is done
      		function done( status, nativeStatusText, responses, headers ) {
      			var isSuccess, success, error, response, modified,
      				statusText = nativeStatusText;
      
      			// Called once
      			if ( state === 2 ) {
      				return;
      			}
      
      			// State is "done" now
      			state = 2;
      
      			// Clear timeout if it exists
      			if ( timeoutTimer ) {
      				clearTimeout( timeoutTimer );
      			}
      
      			// Dereference transport for early garbage collection
      			// (no matter how long the jqXHR object will be used)
      			transport = undefined;
      
      			// Cache response headers
      			responseHeadersString = headers || "";
      
      			// Set readyState
      			jqXHR.readyState = status > 0 ? 4 : 0;
      
      			// Determine if successful
      			isSuccess = status >= 200 && status < 300 || status === 304;
      
      			// Get response data
      			if ( responses ) {
      				response = ajaxHandleResponses( s, jqXHR, responses );
      			}
      
      			// Convert no matter what (that way responseXXX fields are always set)
      			response = ajaxConvert( s, response, jqXHR, isSuccess );
      
      			// If successful, handle type chaining
      			if ( isSuccess ) {
      
      				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
      				if ( s.ifModified ) {
      					modified = jqXHR.getResponseHeader("Last-Modified");
      					if ( modified ) {
      						jQuery.lastModified[ cacheURL ] = modified;
      					}
      					modified = jqXHR.getResponseHeader("etag");
      					if ( modified ) {
      						jQuery.etag[ cacheURL ] = modified;
      					}
      				}
      
      				// if no content
      				if ( status === 204 || s.type === "HEAD" ) {
      					statusText = "nocontent";
      
      				// if not modified
      				} else if ( status === 304 ) {
      					statusText = "notmodified";
      
      				// If we have data, let's convert it
      				} else {
      					statusText = response.state;
      					success = response.data;
      					error = response.error;
      					isSuccess = !error;
      				}
      			} else {
      				// We extract error from statusText
      				// then normalize statusText and status for non-aborts
      				error = statusText;
      				if ( status || !statusText ) {
      					statusText = "error";
      					if ( status < 0 ) {
      						status = 0;
      					}
      				}
      			}
      
      			// Set data for the fake xhr object
      			jqXHR.status = status;
      			jqXHR.statusText = ( nativeStatusText || statusText ) + "";
      
      			// Success/Error
      			if ( isSuccess ) {
      				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
      			} else {
      				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
      			}
      
      			// Status-dependent callbacks
      			jqXHR.statusCode( statusCode );
      			statusCode = undefined;
      
      			if ( fireGlobals ) {
      				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
      					[ jqXHR, s, isSuccess ? success : error ] );
      			}
      
      			// Complete
      			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );
      
      			if ( fireGlobals ) {
      				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
      				// Handle the global AJAX counter
      				if ( !( --jQuery.active ) ) {
      					jQuery.event.trigger("ajaxStop");
      				}
      			}
      		}
      
      		return jqXHR;
      	},
      
      	getJSON: function( url, data, callback ) {
      		return jQuery.get( url, data, callback, "json" );
      	},
      
      	getScript: function( url, callback ) {
      		return jQuery.get( url, undefined, callback, "script" );
      	}
      });
      
      jQuery.each( [ "get", "post" ], function( i, method ) {
      	jQuery[ method ] = function( url, data, callback, type ) {
      		// shift arguments if data argument was omitted
      		if ( jQuery.isFunction( data ) ) {
      			type = type || callback;
      			callback = data;
      			data = undefined;
      		}
      
      		return jQuery.ajax({
      			url: url,
      			type: method,
      			dataType: type,
      			data: data,
      			success: callback
      		});
      	};
      });
      
      /* Handles responses to an ajax request:
       * - finds the right dataType (mediates between content-type and expected dataType)
       * - returns the corresponding response
       */
      function ajaxHandleResponses( s, jqXHR, responses ) {
      
      	var ct, type, finalDataType, firstDataType,
      		contents = s.contents,
      		dataTypes = s.dataTypes;
      
      	// Remove auto dataType and get content-type in the process
      	while( dataTypes[ 0 ] === "*" ) {
      		dataTypes.shift();
      		if ( ct === undefined ) {
      			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
      		}
      	}
      
      	// Check if we're dealing with a known content-type
      	if ( ct ) {
      		for ( type in contents ) {
      			if ( contents[ type ] && contents[ type ].test( ct ) ) {
      				dataTypes.unshift( type );
      				break;
      			}
      		}
      	}
      
      	// Check to see if we have a response for the expected dataType
      	if ( dataTypes[ 0 ] in responses ) {
      		finalDataType = dataTypes[ 0 ];
      	} else {
      		// Try convertible dataTypes
      		for ( type in responses ) {
      			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
      				finalDataType = type;
      				break;
      			}
      			if ( !firstDataType ) {
      				firstDataType = type;
      			}
      		}
      		// Or just use first one
      		finalDataType = finalDataType || firstDataType;
      	}
      
      	// If we found a dataType
      	// We add the dataType to the list if needed
      	// and return the corresponding response
      	if ( finalDataType ) {
      		if ( finalDataType !== dataTypes[ 0 ] ) {
      			dataTypes.unshift( finalDataType );
      		}
      		return responses[ finalDataType ];
      	}
      }
      
      /* Chain conversions given the request and the original response
       * Also sets the responseXXX fields on the jqXHR instance
       */
      function ajaxConvert( s, response, jqXHR, isSuccess ) {
      	var conv2, current, conv, tmp, prev,
      		converters = {},
      		// Work with a copy of dataTypes in case we need to modify it for conversion
      		dataTypes = s.dataTypes.slice();
      
      	// Create converters map with lowercased keys
      	if ( dataTypes[ 1 ] ) {
      		for ( conv in s.converters ) {
      			converters[ conv.toLowerCase() ] = s.converters[ conv ];
      		}
      	}
      
      	current = dataTypes.shift();
      
      	// Convert to each sequential dataType
      	while ( current ) {
      
      		if ( s.responseFields[ current ] ) {
      			jqXHR[ s.responseFields[ current ] ] = response;
      		}
      
      		// Apply the dataFilter if provided
      		if ( !prev && isSuccess && s.dataFilter ) {
      			response = s.dataFilter( response, s.dataType );
      		}
      
      		prev = current;
      		current = dataTypes.shift();
      
      		if ( current ) {
      
      		// There's only work to do if current dataType is non-auto
      			if ( current === "*" ) {
      
      				current = prev;
      
      			// Convert response if prev dataType is non-auto and differs from current
      			} else if ( prev !== "*" && prev !== current ) {
      
      				// Seek a direct converter
      				conv = converters[ prev + " " + current ] || converters[ "* " + current ];
      
      				// If none found, seek a pair
      				if ( !conv ) {
      					for ( conv2 in converters ) {
      
      						// If conv2 outputs current
      						tmp = conv2.split( " " );
      						if ( tmp[ 1 ] === current ) {
      
      							// If prev can be converted to accepted input
      							conv = converters[ prev + " " + tmp[ 0 ] ] ||
      								converters[ "* " + tmp[ 0 ] ];
      							if ( conv ) {
      								// Condense equivalence converters
      								if ( conv === true ) {
      									conv = converters[ conv2 ];
      
      								// Otherwise, insert the intermediate dataType
      								} else if ( converters[ conv2 ] !== true ) {
      									current = tmp[ 0 ];
      									dataTypes.unshift( tmp[ 1 ] );
      								}
      								break;
      							}
      						}
      					}
      				}
      
      				// Apply converter (if not an equivalence)
      				if ( conv !== true ) {
      
      					// Unless errors are allowed to bubble, catch and return them
      					if ( conv && s[ "throws" ] ) {
      						response = conv( response );
      					} else {
      						try {
      							response = conv( response );
      						} catch ( e ) {
      							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
      						}
      					}
      				}
      			}
      		}
      	}
      
      	return { state: "success", data: response };
      }
      // Install script dataType
      jQuery.ajaxSetup({
      	accepts: {
      		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
      	},
      	contents: {
      		script: /(?:java|ecma)script/
      	},
      	converters: {
      		"text script": function( text ) {
      			jQuery.globalEval( text );
      			return text;
      		}
      	}
      });
      
      // Handle cache's special case and crossDomain
      jQuery.ajaxPrefilter( "script", function( s ) {
      	if ( s.cache === undefined ) {
      		s.cache = false;
      	}
      	if ( s.crossDomain ) {
      		s.type = "GET";
      	}
      });
      
      // Bind script tag hack transport
      jQuery.ajaxTransport( "script", function( s ) {
      	// This transport only deals with cross domain requests
      	if ( s.crossDomain ) {
      		var script, callback;
      		return {
      			send: function( _, complete ) {
      				script = jQuery("<script>").prop({
      					async: true,
      					charset: s.scriptCharset,
      					src: s.url
      				}).on(
      					"load error",
      					callback = function( evt ) {
      						script.remove();
      						callback = null;
      						if ( evt ) {
      							complete( evt.type === "error" ? 404 : 200, evt.type );
      						}
      					}
      				);
      				document.head.appendChild( script[ 0 ] );
      			},
      			abort: function() {
      				if ( callback ) {
      					callback();
      				}
      			}
      		};
      	}
      });
      var oldCallbacks = [],
      	rjsonp = /(=)\?(?=&|$)|\?\?/;
      
      // Default jsonp settings
      jQuery.ajaxSetup({
      	jsonp: "callback",
      	jsonpCallback: function() {
      		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
      		this[ callback ] = true;
      		return callback;
      	}
      });
      
      // Detect, normalize options and install callbacks for jsonp requests
      jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {
      
      	var callbackName, overwritten, responseContainer,
      		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
      			"url" :
      			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
      		);
      
      	// Handle iff the expected data type is "jsonp" or we have a parameter to set
      	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {
      
      		// Get callback name, remembering preexisting value associated with it
      		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
      			s.jsonpCallback() :
      			s.jsonpCallback;
      
      		// Insert callback into url or form data
      		if ( jsonProp ) {
      			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
      		} else if ( s.jsonp !== false ) {
      			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
      		}
      
      		// Use data converter to retrieve json after script execution
      		s.converters["script json"] = function() {
      			if ( !responseContainer ) {
      				jQuery.error( callbackName + " was not called" );
      			}
      			return responseContainer[ 0 ];
      		};
      
      		// force json dataType
      		s.dataTypes[ 0 ] = "json";
      
      		// Install callback
      		overwritten = window[ callbackName ];
      		window[ callbackName ] = function() {
      			responseContainer = arguments;
      		};
      
      		// Clean-up function (fires after converters)
      		jqXHR.always(function() {
      			// Restore preexisting value
      			window[ callbackName ] = overwritten;
      
      			// Save back as free
      			if ( s[ callbackName ] ) {
      				// make sure that re-using the options doesn't screw things around
      				s.jsonpCallback = originalSettings.jsonpCallback;
      
      				// save the callback name for future use
      				oldCallbacks.push( callbackName );
      			}
      
      			// Call if it was a function and we have a response
      			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
      				overwritten( responseContainer[ 0 ] );
      			}
      
      			responseContainer = overwritten = undefined;
      		});
      
      		// Delegate to script
      		return "script";
      	}
      });
      jQuery.ajaxSettings.xhr = function() {
      	try {
      		return new XMLHttpRequest();
      	} catch( e ) {}
      };
      
      var xhrSupported = jQuery.ajaxSettings.xhr(),
      	xhrSuccessStatus = {
      		// file protocol always yields status code 0, assume 200
      		0: 200,
      		// Support: IE9
      		// #1450: sometimes IE returns 1223 when it should be 204
      		1223: 204
      	},
      	// Support: IE9
      	// We need to keep track of outbound xhr and abort them manually
      	// because IE is not smart enough to do it all by itself
      	xhrId = 0,
      	xhrCallbacks = {};
      
      if ( window.ActiveXObject ) {
      	jQuery( window ).on( "unload", function() {
      		for( var key in xhrCallbacks ) {
      			xhrCallbacks[ key ]();
      		}
      		xhrCallbacks = undefined;
      	});
      }
      
      jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
      jQuery.support.ajax = xhrSupported = !!xhrSupported;
      
      jQuery.ajaxTransport(function( options ) {
      	var callback;
      	// Cross domain only allowed if supported through XMLHttpRequest
      	if ( jQuery.support.cors || xhrSupported && !options.crossDomain ) {
      		return {
      			send: function( headers, complete ) {
      				var i, id,
      					xhr = options.xhr();
      				xhr.open( options.type, options.url, options.async, options.username, options.password );
      				// Apply custom fields if provided
      				if ( options.xhrFields ) {
      					for ( i in options.xhrFields ) {
      						xhr[ i ] = options.xhrFields[ i ];
      					}
      				}
      				// Override mime type if needed
      				if ( options.mimeType && xhr.overrideMimeType ) {
      					xhr.overrideMimeType( options.mimeType );
      				}
      				// X-Requested-With header
      				// For cross-domain requests, seeing as conditions for a preflight are
      				// akin to a jigsaw puzzle, we simply never set it to be sure.
      				// (it can always be set on a per-request basis or even using ajaxSetup)
      				// For same-domain requests, won't change header if already provided.
      				if ( !options.crossDomain && !headers["X-Requested-With"] ) {
      					headers["X-Requested-With"] = "XMLHttpRequest";
      				}
      				// Set headers
      				for ( i in headers ) {
      					xhr.setRequestHeader( i, headers[ i ] );
      				}
      				// Callback
      				callback = function( type ) {
      					return function() {
      						if ( callback ) {
      							delete xhrCallbacks[ id ];
      							callback = xhr.onload = xhr.onerror = null;
      							if ( type === "abort" ) {
      								xhr.abort();
      							} else if ( type === "error" ) {
      								complete(
      									// file protocol always yields status 0, assume 404
      									xhr.status || 404,
      									xhr.statusText
      								);
      							} else {
      								complete(
      									xhrSuccessStatus[ xhr.status ] || xhr.status,
      									xhr.statusText,
      									// Support: IE9
      									// #11426: When requesting binary data, IE9 will throw an exception
      									// on any attempt to access responseText
      									typeof xhr.responseText === "string" ? {
      										text: xhr.responseText
      									} : undefined,
      									xhr.getAllResponseHeaders()
      								);
      							}
      						}
      					};
      				};
      				// Listen to events
      				xhr.onload = callback();
      				xhr.onerror = callback("error");
      				// Create the abort callback
      				callback = xhrCallbacks[( id = xhrId++ )] = callback("abort");
      				// Do send the request
      				// This may raise an exception which is actually
      				// handled in jQuery.ajax (so no try/catch here)
      				xhr.send( options.hasContent && options.data || null );
      			},
      			abort: function() {
      				if ( callback ) {
      					callback();
      				}
      			}
      		};
      	}
      });
      var fxNow, timerId,
      	rfxtypes = /^(?:toggle|show|hide)$/,
      	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
      	rrun = /queueHooks$/,
      	animationPrefilters = [ defaultPrefilter ],
      	tweeners = {
      		"*": [function( prop, value ) {
      			var tween = this.createTween( prop, value ),
      				target = tween.cur(),
      				parts = rfxnum.exec( value ),
      				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),
      
      				// Starting value computation is required for potential unit mismatches
      				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
      					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
      				scale = 1,
      				maxIterations = 20;
      
      			if ( start && start[ 3 ] !== unit ) {
      				// Trust units reported by jQuery.css
      				unit = unit || start[ 3 ];
      
      				// Make sure we update the tween properties later on
      				parts = parts || [];
      
      				// Iteratively approximate from a nonzero starting point
      				start = +target || 1;
      
      				do {
      					// If previous iteration zeroed out, double until we get *something*
      					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
      					scale = scale || ".5";
      
      					// Adjust and apply
      					start = start / scale;
      					jQuery.style( tween.elem, prop, start + unit );
      
      				// Update scale, tolerating zero or NaN from tween.cur()
      				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
      				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
      			}
      
      			// Update tween properties
      			if ( parts ) {
      				start = tween.start = +start || +target || 0;
      				tween.unit = unit;
      				// If a +=/-= token was provided, we're doing a relative animation
      				tween.end = parts[ 1 ] ?
      					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
      					+parts[ 2 ];
      			}
      
      			return tween;
      		}]
      	};
      
      // Animations created synchronously will run synchronously
      function createFxNow() {
      	setTimeout(function() {
      		fxNow = undefined;
      	});
      	return ( fxNow = jQuery.now() );
      }
      
      function createTween( value, prop, animation ) {
      	var tween,
      		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
      		index = 0,
      		length = collection.length;
      	for ( ; index < length; index++ ) {
      		if ( (tween = collection[ index ].call( animation, prop, value )) ) {
      
      			// we're done with this property
      			return tween;
      		}
      	}
      }
      
      function Animation( elem, properties, options ) {
      	var result,
      		stopped,
      		index = 0,
      		length = animationPrefilters.length,
      		deferred = jQuery.Deferred().always( function() {
      			// don't match elem in the :animated selector
      			delete tick.elem;
      		}),
      		tick = function() {
      			if ( stopped ) {
      				return false;
      			}
      			var currentTime = fxNow || createFxNow(),
      				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
      				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
      				temp = remaining / animation.duration || 0,
      				percent = 1 - temp,
      				index = 0,
      				length = animation.tweens.length;
      
      			for ( ; index < length ; index++ ) {
      				animation.tweens[ index ].run( percent );
      			}
      
      			deferred.notifyWith( elem, [ animation, percent, remaining ]);
      
      			if ( percent < 1 && length ) {
      				return remaining;
      			} else {
      				deferred.resolveWith( elem, [ animation ] );
      				return false;
      			}
      		},
      		animation = deferred.promise({
      			elem: elem,
      			props: jQuery.extend( {}, properties ),
      			opts: jQuery.extend( true, { specialEasing: {} }, options ),
      			originalProperties: properties,
      			originalOptions: options,
      			startTime: fxNow || createFxNow(),
      			duration: options.duration,
      			tweens: [],
      			createTween: function( prop, end ) {
      				var tween = jQuery.Tween( elem, animation.opts, prop, end,
      						animation.opts.specialEasing[ prop ] || animation.opts.easing );
      				animation.tweens.push( tween );
      				return tween;
      			},
      			stop: function( gotoEnd ) {
      				var index = 0,
      					// if we are going to the end, we want to run all the tweens
      					// otherwise we skip this part
      					length = gotoEnd ? animation.tweens.length : 0;
      				if ( stopped ) {
      					return this;
      				}
      				stopped = true;
      				for ( ; index < length ; index++ ) {
      					animation.tweens[ index ].run( 1 );
      				}
      
      				// resolve when we played the last frame
      				// otherwise, reject
      				if ( gotoEnd ) {
      					deferred.resolveWith( elem, [ animation, gotoEnd ] );
      				} else {
      					deferred.rejectWith( elem, [ animation, gotoEnd ] );
      				}
      				return this;
      			}
      		}),
      		props = animation.props;
      
      	propFilter( props, animation.opts.specialEasing );
      
      	for ( ; index < length ; index++ ) {
      		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
      		if ( result ) {
      			return result;
      		}
      	}
      
      	jQuery.map( props, createTween, animation );
      
      	if ( jQuery.isFunction( animation.opts.start ) ) {
      		animation.opts.start.call( elem, animation );
      	}
      
      	jQuery.fx.timer(
      		jQuery.extend( tick, {
      			elem: elem,
      			anim: animation,
      			queue: animation.opts.queue
      		})
      	);
      
      	// attach callbacks from options
      	return animation.progress( animation.opts.progress )
      		.done( animation.opts.done, animation.opts.complete )
      		.fail( animation.opts.fail )
      		.always( animation.opts.always );
      }
      
      function propFilter( props, specialEasing ) {
      	var index, name, easing, value, hooks;
      
      	// camelCase, specialEasing and expand cssHook pass
      	for ( index in props ) {
      		name = jQuery.camelCase( index );
      		easing = specialEasing[ name ];
      		value = props[ index ];
      		if ( jQuery.isArray( value ) ) {
      			easing = value[ 1 ];
      			value = props[ index ] = value[ 0 ];
      		}
      
      		if ( index !== name ) {
      			props[ name ] = value;
      			delete props[ index ];
      		}
      
      		hooks = jQuery.cssHooks[ name ];
      		if ( hooks && "expand" in hooks ) {
      			value = hooks.expand( value );
      			delete props[ name ];
      
      			// not quite $.extend, this wont overwrite keys already present.
      			// also - reusing 'index' from above because we have the correct "name"
      			for ( index in value ) {
      				if ( !( index in props ) ) {
      					props[ index ] = value[ index ];
      					specialEasing[ index ] = easing;
      				}
      			}
      		} else {
      			specialEasing[ name ] = easing;
      		}
      	}
      }
      
      jQuery.Animation = jQuery.extend( Animation, {
      
      	tweener: function( props, callback ) {
      		if ( jQuery.isFunction( props ) ) {
      			callback = props;
      			props = [ "*" ];
      		} else {
      			props = props.split(" ");
      		}
      
      		var prop,
      			index = 0,
      			length = props.length;
      
      		for ( ; index < length ; index++ ) {
      			prop = props[ index ];
      			tweeners[ prop ] = tweeners[ prop ] || [];
      			tweeners[ prop ].unshift( callback );
      		}
      	},
      
      	prefilter: function( callback, prepend ) {
      		if ( prepend ) {
      			animationPrefilters.unshift( callback );
      		} else {
      			animationPrefilters.push( callback );
      		}
      	}
      });
      
      function defaultPrefilter( elem, props, opts ) {
      	/* jshint validthis: true */
      	var prop, value, toggle, tween, hooks, oldfire,
      		anim = this,
      		orig = {},
      		style = elem.style,
      		hidden = elem.nodeType && isHidden( elem ),
      		dataShow = data_priv.get( elem, "fxshow" );
      
      	// handle queue: false promises
      	if ( !opts.queue ) {
      		hooks = jQuery._queueHooks( elem, "fx" );
      		if ( hooks.unqueued == null ) {
      			hooks.unqueued = 0;
      			oldfire = hooks.empty.fire;
      			hooks.empty.fire = function() {
      				if ( !hooks.unqueued ) {
      					oldfire();
      				}
      			};
      		}
      		hooks.unqueued++;
      
      		anim.always(function() {
      			// doing this makes sure that the complete handler will be called
      			// before this completes
      			anim.always(function() {
      				hooks.unqueued--;
      				if ( !jQuery.queue( elem, "fx" ).length ) {
      					hooks.empty.fire();
      				}
      			});
      		});
      	}
      
      	// height/width overflow pass
      	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
      		// Make sure that nothing sneaks out
      		// Record all 3 overflow attributes because IE9-10 do not
      		// change the overflow attribute when overflowX and
      		// overflowY are set to the same value
      		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];
      
      		// Set display property to inline-block for height/width
      		// animations on inline elements that are having width/height animated
      		if ( jQuery.css( elem, "display" ) === "inline" &&
      				jQuery.css( elem, "float" ) === "none" ) {
      
      			style.display = "inline-block";
      		}
      	}
      
      	if ( opts.overflow ) {
      		style.overflow = "hidden";
      		anim.always(function() {
      			style.overflow = opts.overflow[ 0 ];
      			style.overflowX = opts.overflow[ 1 ];
      			style.overflowY = opts.overflow[ 2 ];
      		});
      	}
      
      
      	// show/hide pass
      	for ( prop in props ) {
      		value = props[ prop ];
      		if ( rfxtypes.exec( value ) ) {
      			delete props[ prop ];
      			toggle = toggle || value === "toggle";
      			if ( value === ( hidden ? "hide" : "show" ) ) {
      
      				// If there is dataShow left over from a stopped hide or show and we are going to proceed with show, we should pretend to be hidden
      				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
      					hidden = true;
      				} else {
      					continue;
      				}
      			}
      			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
      		}
      	}
      
      	if ( !jQuery.isEmptyObject( orig ) ) {
      		if ( dataShow ) {
      			if ( "hidden" in dataShow ) {
      				hidden = dataShow.hidden;
      			}
      		} else {
      			dataShow = data_priv.access( elem, "fxshow", {} );
      		}
      
      		// store state if its toggle - enables .stop().toggle() to "reverse"
      		if ( toggle ) {
      			dataShow.hidden = !hidden;
      		}
      		if ( hidden ) {
      			jQuery( elem ).show();
      		} else {
      			anim.done(function() {
      				jQuery( elem ).hide();
      			});
      		}
      		anim.done(function() {
      			var prop;
      
      			data_priv.remove( elem, "fxshow" );
      			for ( prop in orig ) {
      				jQuery.style( elem, prop, orig[ prop ] );
      			}
      		});
      		for ( prop in orig ) {
      			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
      
      			if ( !( prop in dataShow ) ) {
      				dataShow[ prop ] = tween.start;
      				if ( hidden ) {
      					tween.end = tween.start;
      					tween.start = prop === "width" || prop === "height" ? 1 : 0;
      				}
      			}
      		}
      	}
      }
      
      function Tween( elem, options, prop, end, easing ) {
      	return new Tween.prototype.init( elem, options, prop, end, easing );
      }
      jQuery.Tween = Tween;
      
      Tween.prototype = {
      	constructor: Tween,
      	init: function( elem, options, prop, end, easing, unit ) {
      		this.elem = elem;
      		this.prop = prop;
      		this.easing = easing || "swing";
      		this.options = options;
      		this.start = this.now = this.cur();
      		this.end = end;
      		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
      	},
      	cur: function() {
      		var hooks = Tween.propHooks[ this.prop ];
      
      		return hooks && hooks.get ?
      			hooks.get( this ) :
      			Tween.propHooks._default.get( this );
      	},
      	run: function( percent ) {
      		var eased,
      			hooks = Tween.propHooks[ this.prop ];
      
      		if ( this.options.duration ) {
      			this.pos = eased = jQuery.easing[ this.easing ](
      				percent, this.options.duration * percent, 0, 1, this.options.duration
      			);
      		} else {
      			this.pos = eased = percent;
      		}
      		this.now = ( this.end - this.start ) * eased + this.start;
      
      		if ( this.options.step ) {
      			this.options.step.call( this.elem, this.now, this );
      		}
      
      		if ( hooks && hooks.set ) {
      			hooks.set( this );
      		} else {
      			Tween.propHooks._default.set( this );
      		}
      		return this;
      	}
      };
      
      Tween.prototype.init.prototype = Tween.prototype;
      
      Tween.propHooks = {
      	_default: {
      		get: function( tween ) {
      			var result;
      
      			if ( tween.elem[ tween.prop ] != null &&
      				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
      				return tween.elem[ tween.prop ];
      			}
      
      			// passing an empty string as a 3rd parameter to .css will automatically
      			// attempt a parseFloat and fallback to a string if the parse fails
      			// so, simple values such as "10px" are parsed to Float.
      			// complex values such as "rotate(1rad)" are returned as is.
      			result = jQuery.css( tween.elem, tween.prop, "" );
      			// Empty strings, null, undefined and "auto" are converted to 0.
      			return !result || result === "auto" ? 0 : result;
      		},
      		set: function( tween ) {
      			// use step hook for back compat - use cssHook if its there - use .style if its
      			// available and use plain properties where available
      			if ( jQuery.fx.step[ tween.prop ] ) {
      				jQuery.fx.step[ tween.prop ]( tween );
      			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
      				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
      			} else {
      				tween.elem[ tween.prop ] = tween.now;
      			}
      		}
      	}
      };
      
      // Support: IE9
      // Panic based approach to setting things on disconnected nodes
      
      Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
      	set: function( tween ) {
      		if ( tween.elem.nodeType && tween.elem.parentNode ) {
      			tween.elem[ tween.prop ] = tween.now;
      		}
      	}
      };
      
      jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
      	var cssFn = jQuery.fn[ name ];
      	jQuery.fn[ name ] = function( speed, easing, callback ) {
      		return speed == null || typeof speed === "boolean" ?
      			cssFn.apply( this, arguments ) :
      			this.animate( genFx( name, true ), speed, easing, callback );
      	};
      });
      
      jQuery.fn.extend({
      	fadeTo: function( speed, to, easing, callback ) {
      
      		// show any hidden elements after setting opacity to 0
      		return this.filter( isHidden ).css( "opacity", 0 ).show()
      
      			// animate to the value specified
      			.end().animate({ opacity: to }, speed, easing, callback );
      	},
      	animate: function( prop, speed, easing, callback ) {
      		var empty = jQuery.isEmptyObject( prop ),
      			optall = jQuery.speed( speed, easing, callback ),
      			doAnimation = function() {
      				// Operate on a copy of prop so per-property easing won't be lost
      				var anim = Animation( this, jQuery.extend( {}, prop ), optall );
      
      				// Empty animations, or finishing resolves immediately
      				if ( empty || data_priv.get( this, "finish" ) ) {
      					anim.stop( true );
      				}
      			};
      			doAnimation.finish = doAnimation;
      
      		return empty || optall.queue === false ?
      			this.each( doAnimation ) :
      			this.queue( optall.queue, doAnimation );
      	},
      	stop: function( type, clearQueue, gotoEnd ) {
      		var stopQueue = function( hooks ) {
      			var stop = hooks.stop;
      			delete hooks.stop;
      			stop( gotoEnd );
      		};
      
      		if ( typeof type !== "string" ) {
      			gotoEnd = clearQueue;
      			clearQueue = type;
      			type = undefined;
      		}
      		if ( clearQueue && type !== false ) {
      			this.queue( type || "fx", [] );
      		}
      
      		return this.each(function() {
      			var dequeue = true,
      				index = type != null && type + "queueHooks",
      				timers = jQuery.timers,
      				data = data_priv.get( this );
      
      			if ( index ) {
      				if ( data[ index ] && data[ index ].stop ) {
      					stopQueue( data[ index ] );
      				}
      			} else {
      				for ( index in data ) {
      					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
      						stopQueue( data[ index ] );
      					}
      				}
      			}
      
      			for ( index = timers.length; index--; ) {
      				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
      					timers[ index ].anim.stop( gotoEnd );
      					dequeue = false;
      					timers.splice( index, 1 );
      				}
      			}
      
      			// start the next in the queue if the last step wasn't forced
      			// timers currently will call their complete callbacks, which will dequeue
      			// but only if they were gotoEnd
      			if ( dequeue || !gotoEnd ) {
      				jQuery.dequeue( this, type );
      			}
      		});
      	},
      	finish: function( type ) {
      		if ( type !== false ) {
      			type = type || "fx";
      		}
      		return this.each(function() {
      			var index,
      				data = data_priv.get( this ),
      				queue = data[ type + "queue" ],
      				hooks = data[ type + "queueHooks" ],
      				timers = jQuery.timers,
      				length = queue ? queue.length : 0;
      
      			// enable finishing flag on private data
      			data.finish = true;
      
      			// empty the queue first
      			jQuery.queue( this, type, [] );
      
      			if ( hooks && hooks.stop ) {
      				hooks.stop.call( this, true );
      			}
      
      			// look for any active animations, and finish them
      			for ( index = timers.length; index--; ) {
      				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
      					timers[ index ].anim.stop( true );
      					timers.splice( index, 1 );
      				}
      			}
      
      			// look for any animations in the old queue and finish them
      			for ( index = 0; index < length; index++ ) {
      				if ( queue[ index ] && queue[ index ].finish ) {
      					queue[ index ].finish.call( this );
      				}
      			}
      
      			// turn off finishing flag
      			delete data.finish;
      		});
      	}
      });
      
      // Generate parameters to create a standard animation
      function genFx( type, includeWidth ) {
      	var which,
      		attrs = { height: type },
      		i = 0;
      
      	// if we include width, step value is 1 to do all cssExpand values,
      	// if we don't include width, step value is 2 to skip over Left and Right
      	includeWidth = includeWidth? 1 : 0;
      	for( ; i < 4 ; i += 2 - includeWidth ) {
      		which = cssExpand[ i ];
      		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
      	}
      
      	if ( includeWidth ) {
      		attrs.opacity = attrs.width = type;
      	}
      
      	return attrs;
      }
      
      // Generate shortcuts for custom animations
      jQuery.each({
      	slideDown: genFx("show"),
      	slideUp: genFx("hide"),
      	slideToggle: genFx("toggle"),
      	fadeIn: { opacity: "show" },
      	fadeOut: { opacity: "hide" },
      	fadeToggle: { opacity: "toggle" }
      }, function( name, props ) {
      	jQuery.fn[ name ] = function( speed, easing, callback ) {
      		return this.animate( props, speed, easing, callback );
      	};
      });
      
      jQuery.speed = function( speed, easing, fn ) {
      	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
      		complete: fn || !fn && easing ||
      			jQuery.isFunction( speed ) && speed,
      		duration: speed,
      		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
      	};
      
      	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
      		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;
      
      	// normalize opt.queue - true/undefined/null -> "fx"
      	if ( opt.queue == null || opt.queue === true ) {
      		opt.queue = "fx";
      	}
      
      	// Queueing
      	opt.old = opt.complete;
      
      	opt.complete = function() {
      		if ( jQuery.isFunction( opt.old ) ) {
      			opt.old.call( this );
      		}
      
      		if ( opt.queue ) {
      			jQuery.dequeue( this, opt.queue );
      		}
      	};
      
      	return opt;
      };
      
      jQuery.easing = {
      	linear: function( p ) {
      		return p;
      	},
      	swing: function( p ) {
      		return 0.5 - Math.cos( p*Math.PI ) / 2;
      	}
      };
      
      jQuery.timers = [];
      jQuery.fx = Tween.prototype.init;
      jQuery.fx.tick = function() {
      	var timer,
      		timers = jQuery.timers,
      		i = 0;
      
      	fxNow = jQuery.now();
      
      	for ( ; i < timers.length; i++ ) {
      		timer = timers[ i ];
      		// Checks the timer has not already been removed
      		if ( !timer() && timers[ i ] === timer ) {
      			timers.splice( i--, 1 );
      		}
      	}
      
      	if ( !timers.length ) {
      		jQuery.fx.stop();
      	}
      	fxNow = undefined;
      };
      
      jQuery.fx.timer = function( timer ) {
      	if ( timer() && jQuery.timers.push( timer ) ) {
      		jQuery.fx.start();
      	}
      };
      
      jQuery.fx.interval = 13;
      
      jQuery.fx.start = function() {
      	if ( !timerId ) {
      		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
      	}
      };
      
      jQuery.fx.stop = function() {
      	clearInterval( timerId );
      	timerId = null;
      };
      
      jQuery.fx.speeds = {
      	slow: 600,
      	fast: 200,
      	// Default speed
      	_default: 400
      };
      
      // Back Compat <1.8 extension point
      jQuery.fx.step = {};
      
      if ( jQuery.expr && jQuery.expr.filters ) {
      	jQuery.expr.filters.animated = function( elem ) {
      		return jQuery.grep(jQuery.timers, function( fn ) {
      			return elem === fn.elem;
      		}).length;
      	};
      }
      jQuery.fn.offset = function( options ) {
      	if ( arguments.length ) {
      		return options === undefined ?
      			this :
      			this.each(function( i ) {
      				jQuery.offset.setOffset( this, options, i );
      			});
      	}
      
      	var docElem, win,
      		elem = this[ 0 ],
      		box = { top: 0, left: 0 },
      		doc = elem && elem.ownerDocument;
      
      	if ( !doc ) {
      		return;
      	}
      
      	docElem = doc.documentElement;
      
      	// Make sure it's not a disconnected DOM node
      	if ( !jQuery.contains( docElem, elem ) ) {
      		return box;
      	}
      
      	// If we don't have gBCR, just use 0,0 rather than error
      	// BlackBerry 5, iOS 3 (original iPhone)
      	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
      		box = elem.getBoundingClientRect();
      	}
      	win = getWindow( doc );
      	return {
      		top: box.top + win.pageYOffset - docElem.clientTop,
      		left: box.left + win.pageXOffset - docElem.clientLeft
      	};
      };
      
      jQuery.offset = {
      
      	setOffset: function( elem, options, i ) {
      		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
      			position = jQuery.css( elem, "position" ),
      			curElem = jQuery( elem ),
      			props = {};
      
      		// Set position first, in-case top/left are set even on static elem
      		if ( position === "static" ) {
      			elem.style.position = "relative";
      		}
      
      		curOffset = curElem.offset();
      		curCSSTop = jQuery.css( elem, "top" );
      		curCSSLeft = jQuery.css( elem, "left" );
      		calculatePosition = ( position === "absolute" || position === "fixed" ) && ( curCSSTop + curCSSLeft ).indexOf("auto") > -1;
      
      		// Need to be able to calculate position if either top or left is auto and position is either absolute or fixed
      		if ( calculatePosition ) {
      			curPosition = curElem.position();
      			curTop = curPosition.top;
      			curLeft = curPosition.left;
      
      		} else {
      			curTop = parseFloat( curCSSTop ) || 0;
      			curLeft = parseFloat( curCSSLeft ) || 0;
      		}
      
      		if ( jQuery.isFunction( options ) ) {
      			options = options.call( elem, i, curOffset );
      		}
      
      		if ( options.top != null ) {
      			props.top = ( options.top - curOffset.top ) + curTop;
      		}
      		if ( options.left != null ) {
      			props.left = ( options.left - curOffset.left ) + curLeft;
      		}
      
      		if ( "using" in options ) {
      			options.using.call( elem, props );
      
      		} else {
      			curElem.css( props );
      		}
      	}
      };
      
      
      jQuery.fn.extend({
      
      	position: function() {
      		if ( !this[ 0 ] ) {
      			return;
      		}
      
      		var offsetParent, offset,
      			elem = this[ 0 ],
      			parentOffset = { top: 0, left: 0 };
      
      		// Fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
      		if ( jQuery.css( elem, "position" ) === "fixed" ) {
      			// We assume that getBoundingClientRect is available when computed position is fixed
      			offset = elem.getBoundingClientRect();
      
      		} else {
      			// Get *real* offsetParent
      			offsetParent = this.offsetParent();
      
      			// Get correct offsets
      			offset = this.offset();
      			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
      				parentOffset = offsetParent.offset();
      			}
      
      			// Add offsetParent borders
      			parentOffset.top += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
      			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
      		}
      
      		// Subtract parent offsets and element margins
      		return {
      			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
      			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
      		};
      	},
      
      	offsetParent: function() {
      		return this.map(function() {
      			var offsetParent = this.offsetParent || docElem;
      
      			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
      				offsetParent = offsetParent.offsetParent;
      			}
      
      			return offsetParent || docElem;
      		});
      	}
      });
      
      
      // Create scrollLeft and scrollTop methods
      jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
      	var top = "pageYOffset" === prop;
      
      	jQuery.fn[ method ] = function( val ) {
      		return jQuery.access( this, function( elem, method, val ) {
      			var win = getWindow( elem );
      
      			if ( val === undefined ) {
      				return win ? win[ prop ] : elem[ method ];
      			}
      
      			if ( win ) {
      				win.scrollTo(
      					!top ? val : window.pageXOffset,
      					top ? val : window.pageYOffset
      				);
      
      			} else {
      				elem[ method ] = val;
      			}
      		}, method, val, arguments.length, null );
      	};
      });
      
      function getWindow( elem ) {
      	return jQuery.isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
      }
      // Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
      jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
      	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
      		// margin is only for outerHeight, outerWidth
      		jQuery.fn[ funcName ] = function( margin, value ) {
      			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
      				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );
      
      			return jQuery.access( this, function( elem, type, value ) {
      				var doc;
      
      				if ( jQuery.isWindow( elem ) ) {
      					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
      					// isn't a whole lot we can do. See pull request at this URL for discussion:
      					// https://github.com/jquery/jquery/pull/764
      					return elem.document.documentElement[ "client" + name ];
      				}
      
      				// Get document width or height
      				if ( elem.nodeType === 9 ) {
      					doc = elem.documentElement;
      
      					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
      					// whichever is greatest
      					return Math.max(
      						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
      						elem.body[ "offset" + name ], doc[ "offset" + name ],
      						doc[ "client" + name ]
      					);
      				}
      
      				return value === undefined ?
      					// Get width or height on the element, requesting but not forcing parseFloat
      					jQuery.css( elem, type, extra ) :
      
      					// Set width or height on the element
      					jQuery.style( elem, type, value, extra );
      			}, type, chainable ? margin : undefined, chainable, null );
      		};
      	});
      });
      // Limit scope pollution from any deprecated API
      // (function() {
      
      // The number of elements contained in the matched element set
      jQuery.fn.size = function() {
      	return this.length;
      };
      
      jQuery.fn.andSelf = jQuery.fn.addBack;
      
      // })();
      if ( typeof module === "object" && module && typeof module.exports === "object" ) {
      	// Expose jQuery as module.exports in loaders that implement the Node
      	// module pattern (including browserify). Do not create the global, since
      	// the user will be storing it themselves locally, and globals are frowned
      	// upon in the Node module world.
      	module.exports = jQuery;
      } else {
      	// Register as a named AMD module, since jQuery can be concatenated with other
      	// files that may use define, but not via a proper concatenation script that
      	// understands anonymous AMD modules. A named AMD is safest and most robust
      	// way to register. Lowercase jquery is used because AMD module names are
      	// derived from file names, and jQuery is normally delivered in a lowercase
      	// file name. Do this after creating the global so that if an AMD module wants
      	// to call noConflict to hide this version of jQuery, it will work.
      	if ( typeof define === "function" && define.amd ) {
      		define( "jquery", [], function () { return jQuery; } );
      	}
      }
      
      // If there is a window object, that at least has a document property,
      // define jQuery and $ identifiers
      if ( typeof window === "object" && typeof window.document === "object" ) {
      	window.jQuery = window.$ = jQuery;
      }
      
      })( window );
      
      module.exports = window.jQuery;
      ;
      }
    ], [
      {
        /*
          /Users/Admin/Projects/Nitro/source/scripts/controllers/app.coffee
        */

        '../vendor/libs': 3,
        'base': 7,
        '../utils/touchify': 8,
        'jqueryify': 1,
        '../utils/keys': 9,
        '../utils/translate': 10,
        '../utils/event': 14,
        '../models/task': 23,
        '../models/list': 24,
        '../models/setting': 11,
        '../controllers/auth': 27,
        '../views/keys': 30,
        '../views/loadingScreen': 31,
        '../views/lists': 32,
        '../views/title': 35,
        '../views/list_buttons': 36,
        '../views/tasks': 38
      }, function(require, module, exports) {
        var $, App, Auth, Base, Event, Keys, List, ListButtons, Lists, LoadingScreen, Setting, Task, Tasks, Title, libs, translate;
        libs = require('../vendor/libs');
        Base = require('base');
        Base.touchify = require('../utils/touchify');
        $ = require('jqueryify');
        Keys = require('../utils/keys');
        translate = require('../utils/translate');
        Event = require('../utils/event');
        Task = require('../models/task');
        List = require('../models/list');
        Setting = require('../models/setting');
        Auth = require('../controllers/auth');
        Keys = require('../views/keys');
        LoadingScreen = require('../views/loadingScreen');
        Lists = require('../views/lists');
        Title = require('../views/title');
        ListButtons = require('../views/list_buttons');
        Tasks = require('../views/tasks');
        App = (function() {
          function App() {
            Setting.trigger('fetch');
            translate.init();
            this.auth = new Auth();
            new Lists();
            new Tasks();
            new Title();
            new ListButtons();
            new LoadingScreen();
            this.keys = new Keys();
            Task.trigger('fetch');
            List.trigger('fetch');
            if (List.exists('inbox') === false) {
              List.create({
                id: 'inbox',
                name: translate('Inbox'),
                permanent: true
              });
            }
            if (Setting.loggedin) {
              Sync.connect(Setting.uid, Setting.token);
            } else {
              Event.trigger('app:offline');
            }
            Event.trigger('app:ready');
          }

          return App;

        })();
        return module.exports = App;
      }
    ], [
      {
        /*
          /Users/Admin/Projects/Nitro/source/scripts/vendor/libs.coffee
        */

        './modal': 4,
        './jquery-ui': 5,
        './touch': 6
      }, function(require, module, exports) {
        require('./modal');
        require('./jquery-ui');
        require('./touch');
        return module.exports = {
          touch: is_touch_device,
          modal: $.fn.modal,
          jqueryui: $
        };
      }
    ], [
      {
        /*
          /Users/Admin/Projects/Nitro/source/scripts/vendor/modal.js
        */

      }, function(require, module, exports) {
        // Shitty Modal Plugin.
      // By Jono Cooper
      
      (function($){
      	$.fn.modal = function(control){
      		// So it works in setTimeout and deferred
      		var self = this;
      		if (control === "hide" || control === undefined && this.hasClass("show")) {
      			this.removeClass("show");
      			setTimeout (function() {
      				self.hide(0);
      			}, 350);
      			this.off("click.modal, touchend.modal");
      		} else if (control === "show" || control === undefined && !this.hasClass("show")) {
      			this.show(0).addClass("show");
      			// Because I'm an asshole - delays for touch devices
      			setTimeout(function() {
      				self.on("click.modal, touchend.modal", function(e)	 {
      					if ($(e.target).hasClass("modal")) {
      						// This feels so wrong...
      						self.modal("hide");
      					}
      				});
      			}, 500);
      		}
      	};
      })(jQuery);
      ;
      }
    ], [
      {
        /*
          /Users/Admin/Projects/Nitro/source/scripts/vendor/jquery-ui.js
        */

      }, function(require, module, exports) {
        /*! jQuery UI - v1.9.2 - 2012-12-03
      * http://jqueryui.com
      * Includes: jquery.ui.core.js, jquery.ui.widget.js, jquery.ui.mouse.js, jquery.ui.draggable.js, jquery.ui.droppable.js, jquery.ui.sortable.js, jquery.ui.datepicker.js
      * Copyright (c) 2012 jQuery Foundation and other contributors Licensed MIT */
      
      (function( $, undefined ) {
      
      var uuid = 0,
      	runiqueId = /^ui-id-\d+$/;
      
      // prevent duplicate loading
      // this is only a problem because we proxy existing functions
      // and we don't want to double proxy them
      $.ui = $.ui || {};
      if ( $.ui.version ) {
      	return;
      }
      
      $.extend( $.ui, {
      	version: "1.9.2",
      
      	keyCode: {
      		BACKSPACE: 8,
      		COMMA: 188,
      		DELETE: 46,
      		DOWN: 40,
      		END: 35,
      		ENTER: 13,
      		ESCAPE: 27,
      		HOME: 36,
      		LEFT: 37,
      		NUMPAD_ADD: 107,
      		NUMPAD_DECIMAL: 110,
      		NUMPAD_DIVIDE: 111,
      		NUMPAD_ENTER: 108,
      		NUMPAD_MULTIPLY: 106,
      		NUMPAD_SUBTRACT: 109,
      		PAGE_DOWN: 34,
      		PAGE_UP: 33,
      		PERIOD: 190,
      		RIGHT: 39,
      		SPACE: 32,
      		TAB: 9,
      		UP: 38
      	}
      });
      
      // plugins
      $.fn.extend({
      	_focus: $.fn.focus,
      	focus: function( delay, fn ) {
      		return typeof delay === "number" ?
      			this.each(function() {
      				var elem = this;
      				setTimeout(function() {
      					$( elem ).focus();
      					if ( fn ) {
      						fn.call( elem );
      					}
      				}, delay );
      			}) :
      			this._focus.apply( this, arguments );
      	},
      
      	scrollParent: function() {
      		var scrollParent;
      		if (($.ui.ie && (/(static|relative)/).test(this.css('position'))) || (/absolute/).test(this.css('position'))) {
      			scrollParent = this.parents().filter(function() {
      				return (/(relative|absolute|fixed)/).test($.css(this,'position')) && (/(auto|scroll)/).test($.css(this,'overflow')+$.css(this,'overflow-y')+$.css(this,'overflow-x'));
      			}).eq(0);
      		} else {
      			scrollParent = this.parents().filter(function() {
      				return (/(auto|scroll)/).test($.css(this,'overflow')+$.css(this,'overflow-y')+$.css(this,'overflow-x'));
      			}).eq(0);
      		}
      
      		return (/fixed/).test(this.css('position')) || !scrollParent.length ? $(document) : scrollParent;
      	},
      
      	zIndex: function( zIndex ) {
      		if ( zIndex !== undefined ) {
      			return this.css( "zIndex", zIndex );
      		}
      
      		if ( this.length ) {
      			var elem = $( this[ 0 ] ), position, value;
      			while ( elem.length && elem[ 0 ] !== document ) {
      				// Ignore z-index if position is set to a value where z-index is ignored by the browser
      				// This makes behavior of this function consistent across browsers
      				// WebKit always returns auto if the element is positioned
      				position = elem.css( "position" );
      				if ( position === "absolute" || position === "relative" || position === "fixed" ) {
      					// IE returns 0 when zIndex is not specified
      					// other browsers return a string
      					// we ignore the case of nested elements with an explicit value of 0
      					// <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
      					value = parseInt( elem.css( "zIndex" ), 10 );
      					if ( !isNaN( value ) && value !== 0 ) {
      						return value;
      					}
      				}
      				elem = elem.parent();
      			}
      		}
      
      		return 0;
      	},
      
      	uniqueId: function() {
      		return this.each(function() {
      			if ( !this.id ) {
      				this.id = "ui-id-" + (++uuid);
      			}
      		});
      	},
      
      	removeUniqueId: function() {
      		return this.each(function() {
      			if ( runiqueId.test( this.id ) ) {
      				$( this ).removeAttr( "id" );
      			}
      		});
      	}
      });
      
      // selectors
      function focusable( element, isTabIndexNotNaN ) {
      	var map, mapName, img,
      		nodeName = element.nodeName.toLowerCase();
      	if ( "area" === nodeName ) {
      		map = element.parentNode;
      		mapName = map.name;
      		if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
      			return false;
      		}
      		img = $( "img[usemap=#" + mapName + "]" )[0];
      		return !!img && visible( img );
      	}
      	return ( /input|select|textarea|button|object/.test( nodeName ) ?
      		!element.disabled :
      		"a" === nodeName ?
      			element.href || isTabIndexNotNaN :
      			isTabIndexNotNaN) &&
      		// the element and all of its ancestors must be visible
      		visible( element );
      }
      
      function visible( element ) {
      	return $.expr.filters.visible( element ) &&
      		!$( element ).parents().andSelf().filter(function() {
      			return $.css( this, "visibility" ) === "hidden";
      		}).length;
      }
      
      $.extend( $.expr[ ":" ], {
      	data: $.expr.createPseudo ?
      		$.expr.createPseudo(function( dataName ) {
      			return function( elem ) {
      				return !!$.data( elem, dataName );
      			};
      		}) :
      		// support: jQuery <1.8
      		function( elem, i, match ) {
      			return !!$.data( elem, match[ 3 ] );
      		},
      
      	focusable: function( element ) {
      		return focusable( element, !isNaN( $.attr( element, "tabindex" ) ) );
      	},
      
      	tabbable: function( element ) {
      		var tabIndex = $.attr( element, "tabindex" ),
      			isTabIndexNaN = isNaN( tabIndex );
      		return ( isTabIndexNaN || tabIndex >= 0 ) && focusable( element, !isTabIndexNaN );
      	}
      });
      
      // support
      $(function() {
      	var body = document.body,
      		div = body.appendChild( div = document.createElement( "div" ) );
      
      	// access offsetHeight before setting the style to prevent a layout bug
      	// in IE 9 which causes the element to continue to take up space even
      	// after it is removed from the DOM (#8026)
      	div.offsetHeight;
      
      	$.extend( div.style, {
      		minHeight: "100px",
      		height: "auto",
      		padding: 0,
      		borderWidth: 0
      	});
      
      	$.support.minHeight = div.offsetHeight === 100;
      	$.support.selectstart = "onselectstart" in div;
      
      	// set display to none to avoid a layout bug in IE
      	// http://dev.jquery.com/ticket/4014
      	body.removeChild( div ).style.display = "none";
      });
      
      // support: jQuery <1.8
      if ( !$( "<a>" ).outerWidth( 1 ).jquery ) {
      	$.each( [ "Width", "Height" ], function( i, name ) {
      		var side = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ],
      			type = name.toLowerCase(),
      			orig = {
      				innerWidth: $.fn.innerWidth,
      				innerHeight: $.fn.innerHeight,
      				outerWidth: $.fn.outerWidth,
      				outerHeight: $.fn.outerHeight
      			};
      
      		function reduce( elem, size, border, margin ) {
      			$.each( side, function() {
      				size -= parseFloat( $.css( elem, "padding" + this ) ) || 0;
      				if ( border ) {
      					size -= parseFloat( $.css( elem, "border" + this + "Width" ) ) || 0;
      				}
      				if ( margin ) {
      					size -= parseFloat( $.css( elem, "margin" + this ) ) || 0;
      				}
      			});
      			return size;
      		}
      
      		$.fn[ "inner" + name ] = function( size ) {
      			if ( size === undefined ) {
      				return orig[ "inner" + name ].call( this );
      			}
      
      			return this.each(function() {
      				$( this ).css( type, reduce( this, size ) + "px" );
      			});
      		};
      
      		$.fn[ "outer" + name] = function( size, margin ) {
      			if ( typeof size !== "number" ) {
      				return orig[ "outer" + name ].call( this, size );
      			}
      
      			return this.each(function() {
      				$( this).css( type, reduce( this, size, true, margin ) + "px" );
      			});
      		};
      	});
      }
      
      // support: jQuery 1.6.1, 1.6.2 (http://bugs.jquery.com/ticket/9413)
      if ( $( "<a>" ).data( "a-b", "a" ).removeData( "a-b" ).data( "a-b" ) ) {
      	$.fn.removeData = (function( removeData ) {
      		return function( key ) {
      			if ( arguments.length ) {
      				return removeData.call( this, $.camelCase( key ) );
      			} else {
      				return removeData.call( this );
      			}
      		};
      	})( $.fn.removeData );
      }
      
      
      
      
      
      // deprecated
      
      (function() {
      	var uaMatch = /msie ([\w.]+)/.exec( navigator.userAgent.toLowerCase() ) || [];
      	$.ui.ie = uaMatch.length ? true : false;
      	$.ui.ie6 = parseFloat( uaMatch[ 1 ], 10 ) === 6;
      })();
      
      $.fn.extend({
      	disableSelection: function() {
      		return this.bind( ( $.support.selectstart ? "selectstart" : "mousedown" ) +
      			".ui-disableSelection", function( event ) {
      				event.preventDefault();
      			});
      	},
      
      	enableSelection: function() {
      		return this.unbind( ".ui-disableSelection" );
      	}
      });
      
      $.extend( $.ui, {
      	// $.ui.plugin is deprecated.  Use the proxy pattern instead.
      	plugin: {
      		add: function( module, option, set ) {
      			var i,
      				proto = $.ui[ module ].prototype;
      			for ( i in set ) {
      				proto.plugins[ i ] = proto.plugins[ i ] || [];
      				proto.plugins[ i ].push( [ option, set[ i ] ] );
      			}
      		},
      		call: function( instance, name, args ) {
      			var i,
      				set = instance.plugins[ name ];
      			if ( !set || !instance.element[ 0 ].parentNode || instance.element[ 0 ].parentNode.nodeType === 11 ) {
      				return;
      			}
      
      			for ( i = 0; i < set.length; i++ ) {
      				if ( instance.options[ set[ i ][ 0 ] ] ) {
      					set[ i ][ 1 ].apply( instance.element, args );
      				}
      			}
      		}
      	},
      
      	contains: $.contains,
      
      	// only used by resizable
      	hasScroll: function( el, a ) {
      
      		//If overflow is hidden, the element might have extra content, but the user wants to hide it
      		if ( $( el ).css( "overflow" ) === "hidden") {
      			return false;
      		}
      
      		var scroll = ( a && a === "left" ) ? "scrollLeft" : "scrollTop",
      			has = false;
      
      		if ( el[ scroll ] > 0 ) {
      			return true;
      		}
      
      		// TODO: determine which cases actually cause this to happen
      		// if the element doesn't have the scroll set, see if it's possible to
      		// set the scroll
      		el[ scroll ] = 1;
      		has = ( el[ scroll ] > 0 );
      		el[ scroll ] = 0;
      		return has;
      	},
      
      	// these are odd functions, fix the API or move into individual plugins
      	isOverAxis: function( x, reference, size ) {
      		//Determines when x coordinate is over "b" element axis
      		return ( x > reference ) && ( x < ( reference + size ) );
      	},
      	isOver: function( y, x, top, left, height, width ) {
      		//Determines when x, y coordinates is over "b" element
      		return $.ui.isOverAxis( y, top, height ) && $.ui.isOverAxis( x, left, width );
      	}
      });
      
      })( jQuery );
      (function( $, undefined ) {
      
      var uuid = 0,
      	slice = Array.prototype.slice,
      	_cleanData = $.cleanData;
      $.cleanData = function( elems ) {
      	for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
      		try {
      			$( elem ).triggerHandler( "remove" );
      		// http://bugs.jquery.com/ticket/8235
      		} catch( e ) {}
      	}
      	_cleanData( elems );
      };
      
      $.widget = function( name, base, prototype ) {
      	var fullName, existingConstructor, constructor, basePrototype,
      		namespace = name.split( "." )[ 0 ];
      
      	name = name.split( "." )[ 1 ];
      	fullName = namespace + "-" + name;
      
      	if ( !prototype ) {
      		prototype = base;
      		base = $.Widget;
      	}
      
      	// create selector for plugin
      	$.expr[ ":" ][ fullName.toLowerCase() ] = function( elem ) {
      		return !!$.data( elem, fullName );
      	};
      
      	$[ namespace ] = $[ namespace ] || {};
      	existingConstructor = $[ namespace ][ name ];
      	constructor = $[ namespace ][ name ] = function( options, element ) {
      		// allow instantiation without "new" keyword
      		if ( !this._createWidget ) {
      			return new constructor( options, element );
      		}
      
      		// allow instantiation without initializing for simple inheritance
      		// must use "new" keyword (the code above always passes args)
      		if ( arguments.length ) {
      			this._createWidget( options, element );
      		}
      	};
      	// extend with the existing constructor to carry over any static properties
      	$.extend( constructor, existingConstructor, {
      		version: prototype.version,
      		// copy the object used to create the prototype in case we need to
      		// redefine the widget later
      		_proto: $.extend( {}, prototype ),
      		// track widgets that inherit from this widget in case this widget is
      		// redefined after a widget inherits from it
      		_childConstructors: []
      	});
      
      	basePrototype = new base();
      	// we need to make the options hash a property directly on the new instance
      	// otherwise we'll modify the options hash on the prototype that we're
      	// inheriting from
      	basePrototype.options = $.widget.extend( {}, basePrototype.options );
      	$.each( prototype, function( prop, value ) {
      		if ( $.isFunction( value ) ) {
      			prototype[ prop ] = (function() {
      				var _super = function() {
      						return base.prototype[ prop ].apply( this, arguments );
      					},
      					_superApply = function( args ) {
      						return base.prototype[ prop ].apply( this, args );
      					};
      				return function() {
      					var __super = this._super,
      						__superApply = this._superApply,
      						returnValue;
      
      					this._super = _super;
      					this._superApply = _superApply;
      
      					returnValue = value.apply( this, arguments );
      
      					this._super = __super;
      					this._superApply = __superApply;
      
      					return returnValue;
      				};
      			})();
      		}
      	});
      	constructor.prototype = $.widget.extend( basePrototype, {
      		// TODO: remove support for widgetEventPrefix
      		// always use the name + a colon as the prefix, e.g., draggable:start
      		// don't prefix for widgets that aren't DOM-based
      		widgetEventPrefix: existingConstructor ? basePrototype.widgetEventPrefix : name
      	}, prototype, {
      		constructor: constructor,
      		namespace: namespace,
      		widgetName: name,
      		// TODO remove widgetBaseClass, see #8155
      		widgetBaseClass: fullName,
      		widgetFullName: fullName
      	});
      
      	// If this widget is being redefined then we need to find all widgets that
      	// are inheriting from it and redefine all of them so that they inherit from
      	// the new version of this widget. We're essentially trying to replace one
      	// level in the prototype chain.
      	if ( existingConstructor ) {
      		$.each( existingConstructor._childConstructors, function( i, child ) {
      			var childPrototype = child.prototype;
      
      			// redefine the child widget using the same prototype that was
      			// originally used, but inherit from the new version of the base
      			$.widget( childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto );
      		});
      		// remove the list of existing child constructors from the old constructor
      		// so the old child constructors can be garbage collected
      		delete existingConstructor._childConstructors;
      	} else {
      		base._childConstructors.push( constructor );
      	}
      
      	$.widget.bridge( name, constructor );
      };
      
      $.widget.extend = function( target ) {
      	var input = slice.call( arguments, 1 ),
      		inputIndex = 0,
      		inputLength = input.length,
      		key,
      		value;
      	for ( ; inputIndex < inputLength; inputIndex++ ) {
      		for ( key in input[ inputIndex ] ) {
      			value = input[ inputIndex ][ key ];
      			if ( input[ inputIndex ].hasOwnProperty( key ) && value !== undefined ) {
      				// Clone objects
      				if ( $.isPlainObject( value ) ) {
      					target[ key ] = $.isPlainObject( target[ key ] ) ?
      						$.widget.extend( {}, target[ key ], value ) :
      						// Don't extend strings, arrays, etc. with objects
      						$.widget.extend( {}, value );
      				// Copy everything else by reference
      				} else {
      					target[ key ] = value;
      				}
      			}
      		}
      	}
      	return target;
      };
      
      $.widget.bridge = function( name, object ) {
      	var fullName = object.prototype.widgetFullName || name;
      	$.fn[ name ] = function( options ) {
      		var isMethodCall = typeof options === "string",
      			args = slice.call( arguments, 1 ),
      			returnValue = this;
      
      		// allow multiple hashes to be passed on init
      		options = !isMethodCall && args.length ?
      			$.widget.extend.apply( null, [ options ].concat(args) ) :
      			options;
      
      		if ( isMethodCall ) {
      			this.each(function() {
      				var methodValue,
      					instance = $.data( this, fullName );
      				if ( !instance ) {
      					return $.error( "cannot call methods on " + name + " prior to initialization; " +
      						"attempted to call method '" + options + "'" );
      				}
      				if ( !$.isFunction( instance[options] ) || options.charAt( 0 ) === "_" ) {
      					return $.error( "no such method '" + options + "' for " + name + " widget instance" );
      				}
      				methodValue = instance[ options ].apply( instance, args );
      				if ( methodValue !== instance && methodValue !== undefined ) {
      					returnValue = methodValue && methodValue.jquery ?
      						returnValue.pushStack( methodValue.get() ) :
      						methodValue;
      					return false;
      				}
      			});
      		} else {
      			this.each(function() {
      				var instance = $.data( this, fullName );
      				if ( instance ) {
      					instance.option( options || {} )._init();
      				} else {
      					$.data( this, fullName, new object( options, this ) );
      				}
      			});
      		}
      
      		return returnValue;
      	};
      };
      
      $.Widget = function( /* options, element */ ) {};
      $.Widget._childConstructors = [];
      
      $.Widget.prototype = {
      	widgetName: "widget",
      	widgetEventPrefix: "",
      	defaultElement: "<div>",
      	options: {
      		disabled: false,
      
      		// callbacks
      		create: null
      	},
      	_createWidget: function( options, element ) {
      		element = $( element || this.defaultElement || this )[ 0 ];
      		this.element = $( element );
      		this.uuid = uuid++;
      		this.eventNamespace = "." + this.widgetName + this.uuid;
      		this.options = $.widget.extend( {},
      			this.options,
      			this._getCreateOptions(),
      			options );
      
      		this.bindings = $();
      		this.hoverable = $();
      		this.focusable = $();
      
      		if ( element !== this ) {
      			// 1.9 BC for #7810
      			// TODO remove dual storage
      			$.data( element, this.widgetName, this );
      			$.data( element, this.widgetFullName, this );
      			this._on( true, this.element, {
      				remove: function( event ) {
      					if ( event.target === element ) {
      						this.destroy();
      					}
      				}
      			});
      			this.document = $( element.style ?
      				// element within the document
      				element.ownerDocument :
      				// element is window or document
      				element.document || element );
      			this.window = $( this.document[0].defaultView || this.document[0].parentWindow );
      		}
      
      		this._create();
      		this._trigger( "create", null, this._getCreateEventData() );
      		this._init();
      	},
      	_getCreateOptions: $.noop,
      	_getCreateEventData: $.noop,
      	_create: $.noop,
      	_init: $.noop,
      
      	destroy: function() {
      		this._destroy();
      		// we can probably remove the unbind calls in 2.0
      		// all event bindings should go through this._on()
      		this.element
      			.unbind( this.eventNamespace )
      			// 1.9 BC for #7810
      			// TODO remove dual storage
      			.removeData( this.widgetName )
      			.removeData( this.widgetFullName )
      			// support: jquery <1.6.3
      			// http://bugs.jquery.com/ticket/9413
      			.removeData( $.camelCase( this.widgetFullName ) );
      		this.widget()
      			.unbind( this.eventNamespace )
      			.removeAttr( "aria-disabled" )
      			.removeClass(
      				this.widgetFullName + "-disabled " +
      				"ui-state-disabled" );
      
      		// clean up events and states
      		this.bindings.unbind( this.eventNamespace );
      		this.hoverable.removeClass( "ui-state-hover" );
      		this.focusable.removeClass( "ui-state-focus" );
      	},
      	_destroy: $.noop,
      
      	widget: function() {
      		return this.element;
      	},
      
      	option: function( key, value ) {
      		var options = key,
      			parts,
      			curOption,
      			i;
      
      		if ( arguments.length === 0 ) {
      			// don't return a reference to the internal hash
      			return $.widget.extend( {}, this.options );
      		}
      
      		if ( typeof key === "string" ) {
      			// handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
      			options = {};
      			parts = key.split( "." );
      			key = parts.shift();
      			if ( parts.length ) {
      				curOption = options[ key ] = $.widget.extend( {}, this.options[ key ] );
      				for ( i = 0; i < parts.length - 1; i++ ) {
      					curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
      					curOption = curOption[ parts[ i ] ];
      				}
      				key = parts.pop();
      				if ( value === undefined ) {
      					return curOption[ key ] === undefined ? null : curOption[ key ];
      				}
      				curOption[ key ] = value;
      			} else {
      				if ( value === undefined ) {
      					return this.options[ key ] === undefined ? null : this.options[ key ];
      				}
      				options[ key ] = value;
      			}
      		}
      
      		this._setOptions( options );
      
      		return this;
      	},
      	_setOptions: function( options ) {
      		var key;
      
      		for ( key in options ) {
      			this._setOption( key, options[ key ] );
      		}
      
      		return this;
      	},
      	_setOption: function( key, value ) {
      		this.options[ key ] = value;
      
      		if ( key === "disabled" ) {
      			this.widget()
      				.toggleClass( this.widgetFullName + "-disabled ui-state-disabled", !!value )
      				.attr( "aria-disabled", value );
      			this.hoverable.removeClass( "ui-state-hover" );
      			this.focusable.removeClass( "ui-state-focus" );
      		}
      
      		return this;
      	},
      
      	enable: function() {
      		return this._setOption( "disabled", false );
      	},
      	disable: function() {
      		return this._setOption( "disabled", true );
      	},
      
      	_on: function( suppressDisabledCheck, element, handlers ) {
      		var delegateElement,
      			instance = this;
      
      		// no suppressDisabledCheck flag, shuffle arguments
      		if ( typeof suppressDisabledCheck !== "boolean" ) {
      			handlers = element;
      			element = suppressDisabledCheck;
      			suppressDisabledCheck = false;
      		}
      
      		// no element argument, shuffle and use this.element
      		if ( !handlers ) {
      			handlers = element;
      			element = this.element;
      			delegateElement = this.widget();
      		} else {
      			// accept selectors, DOM elements
      			element = delegateElement = $( element );
      			this.bindings = this.bindings.add( element );
      		}
      
      		$.each( handlers, function( event, handler ) {
      			function handlerProxy() {
      				// allow widgets to customize the disabled handling
      				// - disabled as an array instead of boolean
      				// - disabled class as method for disabling individual parts
      				if ( !suppressDisabledCheck &&
      						( instance.options.disabled === true ||
      							$( this ).hasClass( "ui-state-disabled" ) ) ) {
      					return;
      				}
      				return ( typeof handler === "string" ? instance[ handler ] : handler )
      					.apply( instance, arguments );
      			}
      
      			// copy the guid so direct unbinding works
      			if ( typeof handler !== "string" ) {
      				handlerProxy.guid = handler.guid =
      					handler.guid || handlerProxy.guid || $.guid++;
      			}
      
      			var match = event.match( /^(\w+)\s*(.*)$/ ),
      				eventName = match[1] + instance.eventNamespace,
      				selector = match[2];
      			if ( selector ) {
      				delegateElement.delegate( selector, eventName, handlerProxy );
      			} else {
      				element.bind( eventName, handlerProxy );
      			}
      		});
      	},
      
      	_off: function( element, eventName ) {
      		eventName = (eventName || "").split( " " ).join( this.eventNamespace + " " ) + this.eventNamespace;
      		element.unbind( eventName ).undelegate( eventName );
      	},
      
      	_delay: function( handler, delay ) {
      		function handlerProxy() {
      			return ( typeof handler === "string" ? instance[ handler ] : handler )
      				.apply( instance, arguments );
      		}
      		var instance = this;
      		return setTimeout( handlerProxy, delay || 0 );
      	},
      
      	_hoverable: function( element ) {
      		this.hoverable = this.hoverable.add( element );
      		this._on( element, {
      			mouseenter: function( event ) {
      				$( event.currentTarget ).addClass( "ui-state-hover" );
      			},
      			mouseleave: function( event ) {
      				$( event.currentTarget ).removeClass( "ui-state-hover" );
      			}
      		});
      	},
      
      	_focusable: function( element ) {
      		this.focusable = this.focusable.add( element );
      		this._on( element, {
      			focusin: function( event ) {
      				$( event.currentTarget ).addClass( "ui-state-focus" );
      			},
      			focusout: function( event ) {
      				$( event.currentTarget ).removeClass( "ui-state-focus" );
      			}
      		});
      	},
      
      	_trigger: function( type, event, data ) {
      		var prop, orig,
      			callback = this.options[ type ];
      
      		data = data || {};
      		event = $.Event( event );
      		event.type = ( type === this.widgetEventPrefix ?
      			type :
      			this.widgetEventPrefix + type ).toLowerCase();
      		// the original event may come from any element
      		// so we need to reset the target on the new event
      		event.target = this.element[ 0 ];
      
      		// copy original event properties over to the new event
      		orig = event.originalEvent;
      		if ( orig ) {
      			for ( prop in orig ) {
      				if ( !( prop in event ) ) {
      					event[ prop ] = orig[ prop ];
      				}
      			}
      		}
      
      		this.element.trigger( event, data );
      		return !( $.isFunction( callback ) &&
      			callback.apply( this.element[0], [ event ].concat( data ) ) === false ||
      			event.isDefaultPrevented() );
      	}
      };
      
      $.each( { show: "fadeIn", hide: "fadeOut" }, function( method, defaultEffect ) {
      	$.Widget.prototype[ "_" + method ] = function( element, options, callback ) {
      		if ( typeof options === "string" ) {
      			options = { effect: options };
      		}
      		var hasOptions,
      			effectName = !options ?
      				method :
      				options === true || typeof options === "number" ?
      					defaultEffect :
      					options.effect || defaultEffect;
      		options = options || {};
      		if ( typeof options === "number" ) {
      			options = { duration: options };
      		}
      		hasOptions = !$.isEmptyObject( options );
      		options.complete = callback;
      		if ( options.delay ) {
      			element.delay( options.delay );
      		}
      		if ( hasOptions && $.effects && ( $.effects.effect[ effectName ] || $.uiBackCompat !== false && $.effects[ effectName ] ) ) {
      			element[ method ]( options );
      		} else if ( effectName !== method && element[ effectName ] ) {
      			element[ effectName ]( options.duration, options.easing, callback );
      		} else {
      			element.queue(function( next ) {
      				$( this )[ method ]();
      				if ( callback ) {
      					callback.call( element[ 0 ] );
      				}
      				next();
      			});
      		}
      	};
      });
      
      // DEPRECATED
      if ( $.uiBackCompat !== false ) {
      	$.Widget.prototype._getCreateOptions = function() {
      		return $.metadata && $.metadata.get( this.element[0] )[ this.widgetName ];
      	};
      }
      
      })( jQuery );
      (function( $, undefined ) {
      
      var mouseHandled = false;
      $( document ).mouseup( function( e ) {
      	mouseHandled = false;
      });
      
      $.widget("ui.mouse", {
      	version: "1.9.2",
      	options: {
      		cancel: 'input,textarea,button,select,option',
      		distance: 1,
      		delay: 0
      	},
      	_mouseInit: function() {
      		var that = this;
      
      		this.element
      			.bind('mousedown.'+this.widgetName, function(event) {
      				return that._mouseDown(event);
      			})
      			.bind('click.'+this.widgetName, function(event) {
      				if (true === $.data(event.target, that.widgetName + '.preventClickEvent')) {
      					$.removeData(event.target, that.widgetName + '.preventClickEvent');
      					event.stopImmediatePropagation();
      					return false;
      				}
      			});
      
      		this.started = false;
      	},
      
      	// TODO: make sure destroying one instance of mouse doesn't mess with
      	// other instances of mouse
      	_mouseDestroy: function() {
      		this.element.unbind('.'+this.widgetName);
      		if ( this._mouseMoveDelegate ) {
      			$(document)
      				.unbind('mousemove.'+this.widgetName, this._mouseMoveDelegate)
      				.unbind('mouseup.'+this.widgetName, this._mouseUpDelegate);
      		}
      	},
      
      	_mouseDown: function(event) {
      		// don't let more than one widget handle mouseStart
      		if( mouseHandled ) { return; }
      
      		// we may have missed mouseup (out of window)
      		(this._mouseStarted && this._mouseUp(event));
      
      		this._mouseDownEvent = event;
      
      		var that = this,
      			btnIsLeft = (event.which === 1),
      			// event.target.nodeName works around a bug in IE 8 with
      			// disabled inputs (#7620)
      			elIsCancel = (typeof this.options.cancel === "string" && event.target.nodeName ? $(event.target).closest(this.options.cancel).length : false);
      		if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
      			return true;
      		}
      
      		this.mouseDelayMet = !this.options.delay;
      		if (!this.mouseDelayMet) {
      			this._mouseDelayTimer = setTimeout(function() {
      				that.mouseDelayMet = true;
      			}, this.options.delay);
      		}
      
      		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
      			this._mouseStarted = (this._mouseStart(event) !== false);
      			if (!this._mouseStarted) {
      				event.preventDefault();
      				return true;
      			}
      		}
      
      		// Click event may never have fired (Gecko & Opera)
      		if (true === $.data(event.target, this.widgetName + '.preventClickEvent')) {
      			$.removeData(event.target, this.widgetName + '.preventClickEvent');
      		}
      
      		// these delegates are required to keep context
      		this._mouseMoveDelegate = function(event) {
      			return that._mouseMove(event);
      		};
      		this._mouseUpDelegate = function(event) {
      			return that._mouseUp(event);
      		};
      		$(document)
      			.bind('mousemove.'+this.widgetName, this._mouseMoveDelegate)
      			.bind('mouseup.'+this.widgetName, this._mouseUpDelegate);
      
      		event.preventDefault();
      
      		mouseHandled = true;
      		return true;
      	},
      
      	_mouseMove: function(event) {
      		// IE mouseup check - mouseup happened when mouse was out of window
      		if ($.ui.ie && !(document.documentMode >= 9) && !event.button) {
      			return this._mouseUp(event);
      		}
      
      		if (this._mouseStarted) {
      			this._mouseDrag(event);
      			return event.preventDefault();
      		}
      
      		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
      			this._mouseStarted =
      				(this._mouseStart(this._mouseDownEvent, event) !== false);
      			(this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
      		}
      
      		return !this._mouseStarted;
      	},
      
      	_mouseUp: function(event) {
      		$(document)
      			.unbind('mousemove.'+this.widgetName, this._mouseMoveDelegate)
      			.unbind('mouseup.'+this.widgetName, this._mouseUpDelegate);
      
      		if (this._mouseStarted) {
      			this._mouseStarted = false;
      
      			if (event.target === this._mouseDownEvent.target) {
      				$.data(event.target, this.widgetName + '.preventClickEvent', true);
      			}
      
      			this._mouseStop(event);
      		}
      
      		return false;
      	},
      
      	_mouseDistanceMet: function(event) {
      		return (Math.max(
      				Math.abs(this._mouseDownEvent.pageX - event.pageX),
      				Math.abs(this._mouseDownEvent.pageY - event.pageY)
      			) >= this.options.distance
      		);
      	},
      
      	_mouseDelayMet: function(event) {
      		return this.mouseDelayMet;
      	},
      
      	// These are placeholder methods, to be overriden by extending plugin
      	_mouseStart: function(event) {},
      	_mouseDrag: function(event) {},
      	_mouseStop: function(event) {},
      	_mouseCapture: function(event) { return true; }
      });
      
      })(jQuery);
      (function( $, undefined ) {
      
      $.widget("ui.draggable", $.ui.mouse, {
      	version: "1.9.2",
      	widgetEventPrefix: "drag",
      	options: {
      		addClasses: true,
      		appendTo: "parent",
      		axis: false,
      		connectToSortable: false,
      		containment: false,
      		cursor: "auto",
      		cursorAt: false,
      		grid: false,
      		handle: false,
      		helper: "original",
      		iframeFix: false,
      		opacity: false,
      		refreshPositions: false,
      		revert: false,
      		revertDuration: 500,
      		scope: "default",
      		scroll: true,
      		scrollSensitivity: 20,
      		scrollSpeed: 20,
      		snap: false,
      		snapMode: "both",
      		snapTolerance: 20,
      		stack: false,
      		zIndex: false
      	},
      	_create: function() {
      
      		if (this.options.helper == 'original' && !(/^(?:r|a|f)/).test(this.element.css("position")))
      			this.element[0].style.position = 'relative';
      
      		(this.options.addClasses && this.element.addClass("ui-draggable"));
      		(this.options.disabled && this.element.addClass("ui-draggable-disabled"));
      
      		this._mouseInit();
      
      	},
      
      	_destroy: function() {
      		this.element.removeClass( "ui-draggable ui-draggable-dragging ui-draggable-disabled" );
      		this._mouseDestroy();
      	},
      
      	_mouseCapture: function(event) {
      
      		var o = this.options;
      
      		// among others, prevent a drag on a resizable-handle
      		if (this.helper || o.disabled || $(event.target).is('.ui-resizable-handle'))
      			return false;
      
      		//Quit if we're not on a valid handle
      		this.handle = this._getHandle(event);
      		if (!this.handle)
      			return false;
      
      		$(o.iframeFix === true ? "iframe" : o.iframeFix).each(function() {
      			$('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>')
      			.css({
      				width: this.offsetWidth+"px", height: this.offsetHeight+"px",
      				position: "absolute", opacity: "0.001", zIndex: 1000
      			})
      			.css($(this).offset())
      			.appendTo("body");
      		});
      
      		return true;
      
      	},
      
      	_mouseStart: function(event) {
      
      		var o = this.options;
      
      		//Create and append the visible helper
      		this.helper = this._createHelper(event);
      
      		this.helper.addClass("ui-draggable-dragging");
      
      		//Cache the helper size
      		this._cacheHelperProportions();
      
      		//If ddmanager is used for droppables, set the global draggable
      		if($.ui.ddmanager)
      			$.ui.ddmanager.current = this;
      
      		/*
      		 * - Position generation -
      		 * This block generates everything position related - it's the core of draggables.
      		 */
      
      		//Cache the margins of the original element
      		this._cacheMargins();
      
      		//Store the helper's css position
      		this.cssPosition = this.helper.css("position");
      		this.scrollParent = this.helper.scrollParent();
      
      		//The element's absolute position on the page minus margins
      		this.offset = this.positionAbs = this.element.offset();
      		this.offset = {
      			top: this.offset.top - this.margins.top,
      			left: this.offset.left - this.margins.left
      		};
      
      		$.extend(this.offset, {
      			click: { //Where the click happened, relative to the element
      				left: event.pageX - this.offset.left,
      				top: event.pageY - this.offset.top
      			},
      			parent: this._getParentOffset(),
      			relative: this._getRelativeOffset() //This is a relative to absolute position minus the actual position calculation - only used for relative positioned helper
      		});
      
      		//Generate the original position
      		this.originalPosition = this.position = this._generatePosition(event);
      		this.originalPageX = event.pageX;
      		this.originalPageY = event.pageY;
      
      		//Adjust the mouse offset relative to the helper if 'cursorAt' is supplied
      		(o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt));
      
      		//Set a containment if given in the options
      		if(o.containment)
      			this._setContainment();
      
      		//Trigger event + callbacks
      		if(this._trigger("start", event) === false) {
      			this._clear();
      			return false;
      		}
      
      		//Recache the helper size
      		this._cacheHelperProportions();
      
      		//Prepare the droppable offsets
      		if ($.ui.ddmanager && !o.dropBehaviour)
      			$.ui.ddmanager.prepareOffsets(this, event);
      
      
      		this._mouseDrag(event, true); //Execute the drag once - this causes the helper not to be visible before getting its correct position
      
      		//If the ddmanager is used for droppables, inform the manager that dragging has started (see #5003)
      		if ( $.ui.ddmanager ) $.ui.ddmanager.dragStart(this, event);
      
      		return true;
      	},
      
      	_mouseDrag: function(event, noPropagation) {
      
      		//Compute the helpers position
      		this.position = this._generatePosition(event);
      		this.positionAbs = this._convertPositionTo("absolute");
      
      		//Call plugins and callbacks and use the resulting position if something is returned
      		if (!noPropagation) {
      			var ui = this._uiHash();
      			if(this._trigger('drag', event, ui) === false) {
      				this._mouseUp({});
      				return false;
      			}
      			this.position = ui.position;
      		}
      
      		if(!this.options.axis || this.options.axis != "y") this.helper[0].style.left = this.position.left+'px';
      		if(!this.options.axis || this.options.axis != "x") this.helper[0].style.top = this.position.top+'px';
      		if($.ui.ddmanager) $.ui.ddmanager.drag(this, event);
      
      		return false;
      	},
      
      	_mouseStop: function(event) {
      
      		//If we are using droppables, inform the manager about the drop
      		var dropped = false;
      		if ($.ui.ddmanager && !this.options.dropBehaviour)
      			dropped = $.ui.ddmanager.drop(this, event);
      
      		//if a drop comes from outside (a sortable)
      		if(this.dropped) {
      			dropped = this.dropped;
      			this.dropped = false;
      		}
      
      		//if the original element is no longer in the DOM don't bother to continue (see #8269)
      		var element = this.element[0], elementInDom = false;
      		while ( element && (element = element.parentNode) ) {
      			if (element == document ) {
      				elementInDom = true;
      			}
      		}
      		if ( !elementInDom && this.options.helper === "original" )
      			return false;
      
      		if((this.options.revert == "invalid" && !dropped) || (this.options.revert == "valid" && dropped) || this.options.revert === true || ($.isFunction(this.options.revert) && this.options.revert.call(this.element, dropped))) {
      			var that = this;
      			$(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function() {
      				if(that._trigger("stop", event) !== false) {
      					that._clear();
      				}
      			});
      		} else {
      			if(this._trigger("stop", event) !== false) {
      				this._clear();
      			}
      		}
      
      		return false;
      	},
      
      	_mouseUp: function(event) {
      		//Remove frame helpers
      		$("div.ui-draggable-iframeFix").each(function() {
      			this.parentNode.removeChild(this);
      		});
      
      		//If the ddmanager is used for droppables, inform the manager that dragging has stopped (see #5003)
      		if( $.ui.ddmanager ) $.ui.ddmanager.dragStop(this, event);
      
      		return $.ui.mouse.prototype._mouseUp.call(this, event);
      	},
      
      	cancel: function() {
      
      		if(this.helper.is(".ui-draggable-dragging")) {
      			this._mouseUp({});
      		} else {
      			this._clear();
      		}
      
      		return this;
      
      	},
      
      	_getHandle: function(event) {
      
      		var handle = !this.options.handle || !$(this.options.handle, this.element).length ? true : false;
      		$(this.options.handle, this.element)
      			.find("*")
      			.andSelf()
      			.each(function() {
      				if(this == event.target) handle = true;
      			});
      
      		return handle;
      
      	},
      
      	_createHelper: function(event) {
      
      		var o = this.options;
      		var helper = $.isFunction(o.helper) ? $(o.helper.apply(this.element[0], [event])) : (o.helper == 'clone' ? this.element.clone().removeAttr('id') : this.element);
      
      		if(!helper.parents('body').length)
      			helper.appendTo((o.appendTo == 'parent' ? this.element[0].parentNode : o.appendTo));
      
      		if(helper[0] != this.element[0] && !(/(fixed|absolute)/).test(helper.css("position")))
      			helper.css("position", "absolute");
      
      		return helper;
      
      	},
      
      	_adjustOffsetFromHelper: function(obj) {
      		if (typeof obj == 'string') {
      			obj = obj.split(' ');
      		}
      		if ($.isArray(obj)) {
      			obj = {left: +obj[0], top: +obj[1] || 0};
      		}
      		if ('left' in obj) {
      			this.offset.click.left = obj.left + this.margins.left;
      		}
      		if ('right' in obj) {
      			this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
      		}
      		if ('top' in obj) {
      			this.offset.click.top = obj.top + this.margins.top;
      		}
      		if ('bottom' in obj) {
      			this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
      		}
      	},
      
      	_getParentOffset: function() {
      
      		//Get the offsetParent and cache its position
      		this.offsetParent = this.helper.offsetParent();
      		var po = this.offsetParent.offset();
      
      		// This is a special case where we need to modify a offset calculated on start, since the following happened:
      		// 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
      		// 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
      		//    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
      		if(this.cssPosition == 'absolute' && this.scrollParent[0] != document && $.contains(this.scrollParent[0], this.offsetParent[0])) {
      			po.left += this.scrollParent.scrollLeft();
      			po.top += this.scrollParent.scrollTop();
      		}
      
      		if((this.offsetParent[0] == document.body) //This needs to be actually done for all browsers, since pageX/pageY includes this information
      		|| (this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == 'html' && $.ui.ie)) //Ugly IE fix
      			po = { top: 0, left: 0 };
      
      		return {
      			top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"),10) || 0),
      			left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"),10) || 0)
      		};
      
      	},
      
      	_getRelativeOffset: function() {
      
      		if(this.cssPosition == "relative") {
      			var p = this.element.position();
      			return {
      				top: p.top - (parseInt(this.helper.css("top"),10) || 0) + this.scrollParent.scrollTop(),
      				left: p.left - (parseInt(this.helper.css("left"),10) || 0) + this.scrollParent.scrollLeft()
      			};
      		} else {
      			return { top: 0, left: 0 };
      		}
      
      	},
      
      	_cacheMargins: function() {
      		this.margins = {
      			left: (parseInt(this.element.css("marginLeft"),10) || 0),
      			top: (parseInt(this.element.css("marginTop"),10) || 0),
      			right: (parseInt(this.element.css("marginRight"),10) || 0),
      			bottom: (parseInt(this.element.css("marginBottom"),10) || 0)
      		};
      	},
      
      	_cacheHelperProportions: function() {
      		this.helperProportions = {
      			width: this.helper.outerWidth(),
      			height: this.helper.outerHeight()
      		};
      	},
      
      	_setContainment: function() {
      
      		var o = this.options;
      		if(o.containment == 'parent') o.containment = this.helper[0].parentNode;
      		if(o.containment == 'document' || o.containment == 'window') this.containment = [
      			o.containment == 'document' ? 0 : $(window).scrollLeft() - this.offset.relative.left - this.offset.parent.left,
      			o.containment == 'document' ? 0 : $(window).scrollTop() - this.offset.relative.top - this.offset.parent.top,
      			(o.containment == 'document' ? 0 : $(window).scrollLeft()) + $(o.containment == 'document' ? document : window).width() - this.helperProportions.width - this.margins.left,
      			(o.containment == 'document' ? 0 : $(window).scrollTop()) + ($(o.containment == 'document' ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top
      		];
      
      		if(!(/^(document|window|parent)$/).test(o.containment) && o.containment.constructor != Array) {
      			var c = $(o.containment);
      			var ce = c[0]; if(!ce) return;
      			var co = c.offset();
      			var over = ($(ce).css("overflow") != 'hidden');
      
      			this.containment = [
      				(parseInt($(ce).css("borderLeftWidth"),10) || 0) + (parseInt($(ce).css("paddingLeft"),10) || 0),
      				(parseInt($(ce).css("borderTopWidth"),10) || 0) + (parseInt($(ce).css("paddingTop"),10) || 0),
      				(over ? Math.max(ce.scrollWidth,ce.offsetWidth) : ce.offsetWidth) - (parseInt($(ce).css("borderLeftWidth"),10) || 0) - (parseInt($(ce).css("paddingRight"),10) || 0) - this.helperProportions.width - this.margins.left - this.margins.right,
      				(over ? Math.max(ce.scrollHeight,ce.offsetHeight) : ce.offsetHeight) - (parseInt($(ce).css("borderTopWidth"),10) || 0) - (parseInt($(ce).css("paddingBottom"),10) || 0) - this.helperProportions.height - this.margins.top  - this.margins.bottom
      			];
      			this.relative_container = c;
      
      		} else if(o.containment.constructor == Array) {
      			this.containment = o.containment;
      		}
      
      	},
      
      	_convertPositionTo: function(d, pos) {
      
      		if(!pos) pos = this.position;
      		var mod = d == "absolute" ? 1 : -1;
      		var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);
      
      		return {
      			top: (
      				pos.top																	// The absolute mouse position
      				+ this.offset.relative.top * mod										// Only for relative positioned nodes: Relative offset from element to offset parent
      				+ this.offset.parent.top * mod											// The offsetParent's offset without borders (offset + border)
      				- ( ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ) * mod)
      			),
      			left: (
      				pos.left																// The absolute mouse position
      				+ this.offset.relative.left * mod										// Only for relative positioned nodes: Relative offset from element to offset parent
      				+ this.offset.parent.left * mod											// The offsetParent's offset without borders (offset + border)
      				- ( ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ) * mod)
      			)
      		};
      
      	},
      
      	_generatePosition: function(event) {
      
      		var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);
      		var pageX = event.pageX;
      		var pageY = event.pageY;
      
      		/*
      		 * - Position constraining -
      		 * Constrain the position to a mix of grid, containment.
      		 */
      
      		if(this.originalPosition) { //If we are not dragging yet, we won't check for options
      			var containment;
      			if(this.containment) {
      			if (this.relative_container){
      				var co = this.relative_container.offset();
      				containment = [ this.containment[0] + co.left,
      					this.containment[1] + co.top,
      					this.containment[2] + co.left,
      					this.containment[3] + co.top ];
      			}
      			else {
      				containment = this.containment;
      			}
      
      				if(event.pageX - this.offset.click.left < containment[0]) pageX = containment[0] + this.offset.click.left;
      				if(event.pageY - this.offset.click.top < containment[1]) pageY = containment[1] + this.offset.click.top;
      				if(event.pageX - this.offset.click.left > containment[2]) pageX = containment[2] + this.offset.click.left;
      				if(event.pageY - this.offset.click.top > containment[3]) pageY = containment[3] + this.offset.click.top;
      			}
      
      			if(o.grid) {
      				//Check for grid elements set to 0 to prevent divide by 0 error causing invalid argument errors in IE (see ticket #6950)
      				var top = o.grid[1] ? this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1] : this.originalPageY;
      				pageY = containment ? (!(top - this.offset.click.top < containment[1] || top - this.offset.click.top > containment[3]) ? top : (!(top - this.offset.click.top < containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;
      
      				var left = o.grid[0] ? this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0] : this.originalPageX;
      				pageX = containment ? (!(left - this.offset.click.left < containment[0] || left - this.offset.click.left > containment[2]) ? left : (!(left - this.offset.click.left < containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
      			}
      
      		}
      
      		return {
      			top: (
      				pageY																// The absolute mouse position
      				- this.offset.click.top													// Click offset (relative to the element)
      				- this.offset.relative.top												// Only for relative positioned nodes: Relative offset from element to offset parent
      				- this.offset.parent.top												// The offsetParent's offset without borders (offset + border)
      				+ ( ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ))
      			),
      			left: (
      				pageX																// The absolute mouse position
      				- this.offset.click.left												// Click offset (relative to the element)
      				- this.offset.relative.left												// Only for relative positioned nodes: Relative offset from element to offset parent
      				- this.offset.parent.left												// The offsetParent's offset without borders (offset + border)
      				+ ( ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ))
      			)
      		};
      
      	},
      
      	_clear: function() {
      		this.helper.removeClass("ui-draggable-dragging");
      		if(this.helper[0] != this.element[0] && !this.cancelHelperRemoval) this.helper.remove();
      		//if($.ui.ddmanager) $.ui.ddmanager.current = null;
      		this.helper = null;
      		this.cancelHelperRemoval = false;
      	},
      
      	// From now on bulk stuff - mainly helpers
      
      	_trigger: function(type, event, ui) {
      		ui = ui || this._uiHash();
      		$.ui.plugin.call(this, type, [event, ui]);
      		if(type == "drag") this.positionAbs = this._convertPositionTo("absolute"); //The absolute position has to be recalculated after plugins
      		return $.Widget.prototype._trigger.call(this, type, event, ui);
      	},
      
      	plugins: {},
      
      	_uiHash: function(event) {
      		return {
      			helper: this.helper,
      			position: this.position,
      			originalPosition: this.originalPosition,
      			offset: this.positionAbs
      		};
      	}
      
      });
      
      $.ui.plugin.add("draggable", "connectToSortable", {
      	start: function(event, ui) {
      
      		var inst = $(this).data("draggable"), o = inst.options,
      			uiSortable = $.extend({}, ui, { item: inst.element });
      		inst.sortables = [];
      		$(o.connectToSortable).each(function() {
      			var sortable = $.data(this, 'sortable');
      			if (sortable && !sortable.options.disabled) {
      				inst.sortables.push({
      					instance: sortable,
      					shouldRevert: sortable.options.revert
      				});
      				sortable.refreshPositions();	// Call the sortable's refreshPositions at drag start to refresh the containerCache since the sortable container cache is used in drag and needs to be up to date (this will ensure it's initialised as well as being kept in step with any changes that might have happened on the page).
      				sortable._trigger("activate", event, uiSortable);
      			}
      		});
      
      	},
      	stop: function(event, ui) {
      
      		//If we are still over the sortable, we fake the stop event of the sortable, but also remove helper
      		var inst = $(this).data("draggable"),
      			uiSortable = $.extend({}, ui, { item: inst.element });
      
      		$.each(inst.sortables, function() {
      			if(this.instance.isOver) {
      
      				this.instance.isOver = 0;
      
      				inst.cancelHelperRemoval = true; //Don't remove the helper in the draggable instance
      				this.instance.cancelHelperRemoval = false; //Remove it in the sortable instance (so sortable plugins like revert still work)
      
      				//The sortable revert is supported, and we have to set a temporary dropped variable on the draggable to support revert: 'valid/invalid'
      				if(this.shouldRevert) this.instance.options.revert = true;
      
      				//Trigger the stop of the sortable
      				this.instance._mouseStop(event);
      
      				this.instance.options.helper = this.instance.options._helper;
      
      				//If the helper has been the original item, restore properties in the sortable
      				if(inst.options.helper == 'original')
      					this.instance.currentItem.css({ top: 'auto', left: 'auto' });
      
      			} else {
      				this.instance.cancelHelperRemoval = false; //Remove the helper in the sortable instance
      				this.instance._trigger("deactivate", event, uiSortable);
      			}
      
      		});
      
      	},
      	drag: function(event, ui) {
      
      		var inst = $(this).data("draggable"), that = this;
      
      		var checkPos = function(o) {
      			var dyClick = this.offset.click.top, dxClick = this.offset.click.left;
      			var helperTop = this.positionAbs.top, helperLeft = this.positionAbs.left;
      			var itemHeight = o.height, itemWidth = o.width;
      			var itemTop = o.top, itemLeft = o.left;
      
      			return $.ui.isOver(helperTop + dyClick, helperLeft + dxClick, itemTop, itemLeft, itemHeight, itemWidth);
      		};
      
      		$.each(inst.sortables, function(i) {
      
      			var innermostIntersecting = false;
      			var thisSortable = this;
      			//Copy over some variables to allow calling the sortable's native _intersectsWith
      			this.instance.positionAbs = inst.positionAbs;
      			this.instance.helperProportions = inst.helperProportions;
      			this.instance.offset.click = inst.offset.click;
      
      			if(this.instance._intersectsWith(this.instance.containerCache)) {
      				innermostIntersecting = true;
      				$.each(inst.sortables, function () {
      					this.instance.positionAbs = inst.positionAbs;
      					this.instance.helperProportions = inst.helperProportions;
      					this.instance.offset.click = inst.offset.click;
      					if  (this != thisSortable
      						&& this.instance._intersectsWith(this.instance.containerCache)
      						&& $.ui.contains(thisSortable.instance.element[0], this.instance.element[0]))
      						innermostIntersecting = false;
      						return innermostIntersecting;
      				});
      			}
      
      
      			if(innermostIntersecting) {
      				//If it intersects, we use a little isOver variable and set it once, so our move-in stuff gets fired only once
      				if(!this.instance.isOver) {
      
      					this.instance.isOver = 1;
      					//Now we fake the start of dragging for the sortable instance,
      					//by cloning the list group item, appending it to the sortable and using it as inst.currentItem
      					//We can then fire the start event of the sortable with our passed browser event, and our own helper (so it doesn't create a new one)
      					this.instance.currentItem = $(that).clone().removeAttr('id').appendTo(this.instance.element).data("sortable-item", true);
      					this.instance.options._helper = this.instance.options.helper; //Store helper option to later restore it
      					this.instance.options.helper = function() { return ui.helper[0]; };
      
      					event.target = this.instance.currentItem[0];
      					this.instance._mouseCapture(event, true);
      					this.instance._mouseStart(event, true, true);
      
      					//Because the browser event is way off the new appended portlet, we modify a couple of variables to reflect the changes
      					this.instance.offset.click.top = inst.offset.click.top;
      					this.instance.offset.click.left = inst.offset.click.left;
      					this.instance.offset.parent.left -= inst.offset.parent.left - this.instance.offset.parent.left;
      					this.instance.offset.parent.top -= inst.offset.parent.top - this.instance.offset.parent.top;
      
      					inst._trigger("toSortable", event);
      					inst.dropped = this.instance.element; //draggable revert needs that
      					//hack so receive/update callbacks work (mostly)
      					inst.currentItem = inst.element;
      					this.instance.fromOutside = inst;
      
      				}
      
      				//Provided we did all the previous steps, we can fire the drag event of the sortable on every draggable drag, when it intersects with the sortable
      				if(this.instance.currentItem) this.instance._mouseDrag(event);
      
      			} else {
      
      				//If it doesn't intersect with the sortable, and it intersected before,
      				//we fake the drag stop of the sortable, but make sure it doesn't remove the helper by using cancelHelperRemoval
      				if(this.instance.isOver) {
      
      					this.instance.isOver = 0;
      					this.instance.cancelHelperRemoval = true;
      
      					//Prevent reverting on this forced stop
      					this.instance.options.revert = false;
      
      					// The out event needs to be triggered independently
      					this.instance._trigger('out', event, this.instance._uiHash(this.instance));
      
      					this.instance._mouseStop(event, true);
      					this.instance.options.helper = this.instance.options._helper;
      
      					//Now we remove our currentItem, the list group clone again, and the placeholder, and animate the helper back to it's original size
      					this.instance.currentItem.remove();
      					if(this.instance.placeholder) this.instance.placeholder.remove();
      
      					inst._trigger("fromSortable", event);
      					inst.dropped = false; //draggable revert needs that
      				}
      
      			};
      
      		});
      
      	}
      });
      
      $.ui.plugin.add("draggable", "cursor", {
      	start: function(event, ui) {
      		var t = $('body'), o = $(this).data('draggable').options;
      		if (t.css("cursor")) o._cursor = t.css("cursor");
      		t.css("cursor", o.cursor);
      	},
      	stop: function(event, ui) {
      		var o = $(this).data('draggable').options;
      		if (o._cursor) $('body').css("cursor", o._cursor);
      	}
      });
      
      $.ui.plugin.add("draggable", "opacity", {
      	start: function(event, ui) {
      		var t = $(ui.helper), o = $(this).data('draggable').options;
      		if(t.css("opacity")) o._opacity = t.css("opacity");
      		t.css('opacity', o.opacity);
      	},
      	stop: function(event, ui) {
      		var o = $(this).data('draggable').options;
      		if(o._opacity) $(ui.helper).css('opacity', o._opacity);
      	}
      });
      
      $.ui.plugin.add("draggable", "scroll", {
      	start: function(event, ui) {
      		var i = $(this).data("draggable");
      		if(i.scrollParent[0] != document && i.scrollParent[0].tagName != 'HTML') i.overflowOffset = i.scrollParent.offset();
      	},
      	drag: function(event, ui) {
      
      		var i = $(this).data("draggable"), o = i.options, scrolled = false;
      
      		if(i.scrollParent[0] != document && i.scrollParent[0].tagName != 'HTML') {
      
      			if(!o.axis || o.axis != 'x') {
      				if((i.overflowOffset.top + i.scrollParent[0].offsetHeight) - event.pageY < o.scrollSensitivity)
      					i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop + o.scrollSpeed;
      				else if(event.pageY - i.overflowOffset.top < o.scrollSensitivity)
      					i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop - o.scrollSpeed;
      			}
      
      			if(!o.axis || o.axis != 'y') {
      				if((i.overflowOffset.left + i.scrollParent[0].offsetWidth) - event.pageX < o.scrollSensitivity)
      					i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft + o.scrollSpeed;
      				else if(event.pageX - i.overflowOffset.left < o.scrollSensitivity)
      					i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft - o.scrollSpeed;
      			}
      
      		} else {
      
      			if(!o.axis || o.axis != 'x') {
      				if(event.pageY - $(document).scrollTop() < o.scrollSensitivity)
      					scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
      				else if($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity)
      					scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);
      			}
      
      			if(!o.axis || o.axis != 'y') {
      				if(event.pageX - $(document).scrollLeft() < o.scrollSensitivity)
      					scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
      				else if($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity)
      					scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);
      			}
      
      		}
      
      		if(scrolled !== false && $.ui.ddmanager && !o.dropBehaviour)
      			$.ui.ddmanager.prepareOffsets(i, event);
      
      	}
      });
      
      $.ui.plugin.add("draggable", "snap", {
      	start: function(event, ui) {
      
      		var i = $(this).data("draggable"), o = i.options;
      		i.snapElements = [];
      
      		$(o.snap.constructor != String ? ( o.snap.items || ':data(draggable)' ) : o.snap).each(function() {
      			var $t = $(this); var $o = $t.offset();
      			if(this != i.element[0]) i.snapElements.push({
      				item: this,
      				width: $t.outerWidth(), height: $t.outerHeight(),
      				top: $o.top, left: $o.left
      			});
      		});
      
      	},
      	drag: function(event, ui) {
      
      		var inst = $(this).data("draggable"), o = inst.options;
      		var d = o.snapTolerance;
      
      		var x1 = ui.offset.left, x2 = x1 + inst.helperProportions.width,
      			y1 = ui.offset.top, y2 = y1 + inst.helperProportions.height;
      
      		for (var i = inst.snapElements.length - 1; i >= 0; i--){
      
      			var l = inst.snapElements[i].left, r = l + inst.snapElements[i].width,
      				t = inst.snapElements[i].top, b = t + inst.snapElements[i].height;
      
      			//Yes, I know, this is insane ;)
      			if(!((l-d < x1 && x1 < r+d && t-d < y1 && y1 < b+d) || (l-d < x1 && x1 < r+d && t-d < y2 && y2 < b+d) || (l-d < x2 && x2 < r+d && t-d < y1 && y1 < b+d) || (l-d < x2 && x2 < r+d && t-d < y2 && y2 < b+d))) {
      				if(inst.snapElements[i].snapping) (inst.options.snap.release && inst.options.snap.release.call(inst.element, event, $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item })));
      				inst.snapElements[i].snapping = false;
      				continue;
      			}
      
      			if(o.snapMode != 'inner') {
      				var ts = Math.abs(t - y2) <= d;
      				var bs = Math.abs(b - y1) <= d;
      				var ls = Math.abs(l - x2) <= d;
      				var rs = Math.abs(r - x1) <= d;
      				if(ts) ui.position.top = inst._convertPositionTo("relative", { top: t - inst.helperProportions.height, left: 0 }).top - inst.margins.top;
      				if(bs) ui.position.top = inst._convertPositionTo("relative", { top: b, left: 0 }).top - inst.margins.top;
      				if(ls) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: l - inst.helperProportions.width }).left - inst.margins.left;
      				if(rs) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: r }).left - inst.margins.left;
      			}
      
      			var first = (ts || bs || ls || rs);
      
      			if(o.snapMode != 'outer') {
      				var ts = Math.abs(t - y1) <= d;
      				var bs = Math.abs(b - y2) <= d;
      				var ls = Math.abs(l - x1) <= d;
      				var rs = Math.abs(r - x2) <= d;
      				if(ts) ui.position.top = inst._convertPositionTo("relative", { top: t, left: 0 }).top - inst.margins.top;
      				if(bs) ui.position.top = inst._convertPositionTo("relative", { top: b - inst.helperProportions.height, left: 0 }).top - inst.margins.top;
      				if(ls) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: l }).left - inst.margins.left;
      				if(rs) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: r - inst.helperProportions.width }).left - inst.margins.left;
      			}
      
      			if(!inst.snapElements[i].snapping && (ts || bs || ls || rs || first))
      				(inst.options.snap.snap && inst.options.snap.snap.call(inst.element, event, $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item })));
      			inst.snapElements[i].snapping = (ts || bs || ls || rs || first);
      
      		};
      
      	}
      });
      
      $.ui.plugin.add("draggable", "stack", {
      	start: function(event, ui) {
      
      		var o = $(this).data("draggable").options;
      
      		var group = $.makeArray($(o.stack)).sort(function(a,b) {
      			return (parseInt($(a).css("zIndex"),10) || 0) - (parseInt($(b).css("zIndex"),10) || 0);
      		});
      		if (!group.length) { return; }
      
      		var min = parseInt(group[0].style.zIndex) || 0;
      		$(group).each(function(i) {
      			this.style.zIndex = min + i;
      		});
      
      		this[0].style.zIndex = min + group.length;
      
      	}
      });
      
      $.ui.plugin.add("draggable", "zIndex", {
      	start: function(event, ui) {
      		var t = $(ui.helper), o = $(this).data("draggable").options;
      		if(t.css("zIndex")) o._zIndex = t.css("zIndex");
      		t.css('zIndex', o.zIndex);
      	},
      	stop: function(event, ui) {
      		var o = $(this).data("draggable").options;
      		if(o._zIndex) $(ui.helper).css('zIndex', o._zIndex);
      	}
      });
      
      })(jQuery);
      (function( $, undefined ) {
      
      $.widget("ui.droppable", {
      	version: "1.9.2",
      	widgetEventPrefix: "drop",
      	options: {
      		accept: '*',
      		activeClass: false,
      		addClasses: true,
      		greedy: false,
      		hoverClass: false,
      		scope: 'default',
      		tolerance: 'intersect'
      	},
      	_create: function() {
      
      		var o = this.options, accept = o.accept;
      		this.isover = 0; this.isout = 1;
      
      		this.accept = $.isFunction(accept) ? accept : function(d) {
      			return d.is(accept);
      		};
      
      		//Store the droppable's proportions
      		this.proportions = { width: this.element[0].offsetWidth, height: this.element[0].offsetHeight };
      
      		// Add the reference and positions to the manager
      		$.ui.ddmanager.droppables[o.scope] = $.ui.ddmanager.droppables[o.scope] || [];
      		$.ui.ddmanager.droppables[o.scope].push(this);
      
      		(o.addClasses && this.element.addClass("ui-droppable"));
      
      	},
      
      	_destroy: function() {
      		var drop = $.ui.ddmanager.droppables[this.options.scope];
      		for ( var i = 0; i < drop.length; i++ )
      			if ( drop[i] == this )
      				drop.splice(i, 1);
      
      		this.element.removeClass("ui-droppable ui-droppable-disabled");
      	},
      
      	_setOption: function(key, value) {
      
      		if(key == 'accept') {
      			this.accept = $.isFunction(value) ? value : function(d) {
      				return d.is(value);
      			};
      		}
      		$.Widget.prototype._setOption.apply(this, arguments);
      	},
      
      	_activate: function(event) {
      		var draggable = $.ui.ddmanager.current;
      		if(this.options.activeClass) this.element.addClass(this.options.activeClass);
      		(draggable && this._trigger('activate', event, this.ui(draggable)));
      	},
      
      	_deactivate: function(event) {
      		var draggable = $.ui.ddmanager.current;
      		if(this.options.activeClass) this.element.removeClass(this.options.activeClass);
      		(draggable && this._trigger('deactivate', event, this.ui(draggable)));
      	},
      
      	_over: function(event) {
      
      		var draggable = $.ui.ddmanager.current;
      		if (!draggable || (draggable.currentItem || draggable.element)[0] == this.element[0]) return; // Bail if draggable and droppable are same element
      
      		if (this.accept.call(this.element[0],(draggable.currentItem || draggable.element))) {
      			if(this.options.hoverClass) this.element.addClass(this.options.hoverClass);
      			this._trigger('over', event, this.ui(draggable));
      		}
      
      	},
      
      	_out: function(event) {
      
      		var draggable = $.ui.ddmanager.current;
      		if (!draggable || (draggable.currentItem || draggable.element)[0] == this.element[0]) return; // Bail if draggable and droppable are same element
      
      		if (this.accept.call(this.element[0],(draggable.currentItem || draggable.element))) {
      			if(this.options.hoverClass) this.element.removeClass(this.options.hoverClass);
      			this._trigger('out', event, this.ui(draggable));
      		}
      
      	},
      
      	_drop: function(event,custom) {
      
      		var draggable = custom || $.ui.ddmanager.current;
      		if (!draggable || (draggable.currentItem || draggable.element)[0] == this.element[0]) return false; // Bail if draggable and droppable are same element
      
      		var childrenIntersection = false;
      		this.element.find(":data(droppable)").not(".ui-draggable-dragging").each(function() {
      			var inst = $.data(this, 'droppable');
      			if(
      				inst.options.greedy
      				&& !inst.options.disabled
      				&& inst.options.scope == draggable.options.scope
      				&& inst.accept.call(inst.element[0], (draggable.currentItem || draggable.element))
      				&& $.ui.intersect(draggable, $.extend(inst, { offset: inst.element.offset() }), inst.options.tolerance)
      			) { childrenIntersection = true; return false; }
      		});
      		if(childrenIntersection) return false;
      
      		if(this.accept.call(this.element[0],(draggable.currentItem || draggable.element))) {
      			if(this.options.activeClass) this.element.removeClass(this.options.activeClass);
      			if(this.options.hoverClass) this.element.removeClass(this.options.hoverClass);
      			this._trigger('drop', event, this.ui(draggable));
      			return this.element;
      		}
      
      		return false;
      
      	},
      
      	ui: function(c) {
      		return {
      			draggable: (c.currentItem || c.element),
      			helper: c.helper,
      			position: c.position,
      			offset: c.positionAbs
      		};
      	}
      
      });
      
      $.ui.intersect = function(draggable, droppable, toleranceMode) {
      
      	if (!droppable.offset) return false;
      
      	var x1 = (draggable.positionAbs || draggable.position.absolute).left, x2 = x1 + draggable.helperProportions.width,
      		y1 = (draggable.positionAbs || draggable.position.absolute).top, y2 = y1 + draggable.helperProportions.height;
      	var l = droppable.offset.left, r = l + droppable.proportions.width,
      		t = droppable.offset.top, b = t + droppable.proportions.height;
      
      	switch (toleranceMode) {
      		case 'fit':
      			return (l <= x1 && x2 <= r
      				&& t <= y1 && y2 <= b);
      			break;
      		case 'intersect':
      			return (l < x1 + (draggable.helperProportions.width / 2) // Right Half
      				&& x2 - (draggable.helperProportions.width / 2) < r // Left Half
      				&& t < y1 + (draggable.helperProportions.height / 2) // Bottom Half
      				&& y2 - (draggable.helperProportions.height / 2) < b ); // Top Half
      			break;
      		case 'pointer':
      			var draggableLeft = ((draggable.positionAbs || draggable.position.absolute).left + (draggable.clickOffset || draggable.offset.click).left),
      				draggableTop = ((draggable.positionAbs || draggable.position.absolute).top + (draggable.clickOffset || draggable.offset.click).top),
      				isOver = $.ui.isOver(draggableTop, draggableLeft, t, l, droppable.proportions.height, droppable.proportions.width);
      			return isOver;
      			break;
      		case 'touch':
      			return (
      					(y1 >= t && y1 <= b) ||	// Top edge touching
      					(y2 >= t && y2 <= b) ||	// Bottom edge touching
      					(y1 < t && y2 > b)		// Surrounded vertically
      				) && (
      					(x1 >= l && x1 <= r) ||	// Left edge touching
      					(x2 >= l && x2 <= r) ||	// Right edge touching
      					(x1 < l && x2 > r)		// Surrounded horizontally
      				);
      			break;
      		default:
      			return false;
      			break;
      		}
      
      };
      
      /*
      	This manager tracks offsets of draggables and droppables
      */
      $.ui.ddmanager = {
      	current: null,
      	droppables: { 'default': [] },
      	prepareOffsets: function(t, event) {
      
      		var m = $.ui.ddmanager.droppables[t.options.scope] || [];
      		var type = event ? event.type : null; // workaround for #2317
      		var list = (t.currentItem || t.element).find(":data(droppable)").andSelf();
      
      		droppablesLoop: for (var i = 0; i < m.length; i++) {
      
      			if(m[i].options.disabled || (t && !m[i].accept.call(m[i].element[0],(t.currentItem || t.element)))) continue;	//No disabled and non-accepted
      			for (var j=0; j < list.length; j++) { if(list[j] == m[i].element[0]) { m[i].proportions.height = 0; continue droppablesLoop; } }; //Filter out elements in the current dragged item
      			m[i].visible = m[i].element.css("display") != "none"; if(!m[i].visible) continue; 									//If the element is not visible, continue
      
      			if(type == "mousedown") m[i]._activate.call(m[i], event); //Activate the droppable if used directly from draggables
      
      			m[i].offset = m[i].element.offset();
      			m[i].proportions = { width: m[i].element[0].offsetWidth, height: m[i].element[0].offsetHeight };
      
      		}
      
      	},
      	drop: function(draggable, event) {
      
      		var dropped = false;
      		$.each($.ui.ddmanager.droppables[draggable.options.scope] || [], function() {
      
      			if(!this.options) return;
      			if (!this.options.disabled && this.visible && $.ui.intersect(draggable, this, this.options.tolerance))
      				dropped = this._drop.call(this, event) || dropped;
      
      			if (!this.options.disabled && this.visible && this.accept.call(this.element[0],(draggable.currentItem || draggable.element))) {
      				this.isout = 1; this.isover = 0;
      				this._deactivate.call(this, event);
      			}
      
      		});
      		return dropped;
      
      	},
      	dragStart: function( draggable, event ) {
      		//Listen for scrolling so that if the dragging causes scrolling the position of the droppables can be recalculated (see #5003)
      		draggable.element.parentsUntil( "body" ).bind( "scroll.droppable", function() {
      			if( !draggable.options.refreshPositions ) $.ui.ddmanager.prepareOffsets( draggable, event );
      		});
      	},
      	drag: function(draggable, event) {
      
      		//If you have a highly dynamic page, you might try this option. It renders positions every time you move the mouse.
      		if(draggable.options.refreshPositions) $.ui.ddmanager.prepareOffsets(draggable, event);
      
      		//Run through all droppables and check their positions based on specific tolerance options
      		$.each($.ui.ddmanager.droppables[draggable.options.scope] || [], function() {
      
      			if(this.options.disabled || this.greedyChild || !this.visible) return;
      			var intersects = $.ui.intersect(draggable, this, this.options.tolerance);
      
      			var c = !intersects && this.isover == 1 ? 'isout' : (intersects && this.isover == 0 ? 'isover' : null);
      			if(!c) return;
      
      			var parentInstance;
      			if (this.options.greedy) {
      				// find droppable parents with same scope
      				var scope = this.options.scope;
      				var parent = this.element.parents(':data(droppable)').filter(function () {
      					return $.data(this, 'droppable').options.scope === scope;
      				});
      
      				if (parent.length) {
      					parentInstance = $.data(parent[0], 'droppable');
      					parentInstance.greedyChild = (c == 'isover' ? 1 : 0);
      				}
      			}
      
      			// we just moved into a greedy child
      			if (parentInstance && c == 'isover') {
      				parentInstance['isover'] = 0;
      				parentInstance['isout'] = 1;
      				parentInstance._out.call(parentInstance, event);
      			}
      
      			this[c] = 1; this[c == 'isout' ? 'isover' : 'isout'] = 0;
      			this[c == "isover" ? "_over" : "_out"].call(this, event);
      
      			// we just moved out of a greedy child
      			if (parentInstance && c == 'isout') {
      				parentInstance['isout'] = 0;
      				parentInstance['isover'] = 1;
      				parentInstance._over.call(parentInstance, event);
      			}
      		});
      
      	},
      	dragStop: function( draggable, event ) {
      		draggable.element.parentsUntil( "body" ).unbind( "scroll.droppable" );
      		//Call prepareOffsets one final time since IE does not fire return scroll events when overflow was caused by drag (see #5003)
      		if( !draggable.options.refreshPositions ) $.ui.ddmanager.prepareOffsets( draggable, event );
      	}
      };
      
      })(jQuery);
      (function( $, undefined ) {
      
      $.widget("ui.sortable", $.ui.mouse, {
      	version: "1.9.2",
      	widgetEventPrefix: "sort",
      	ready: false,
      	options: {
      		appendTo: "parent",
      		axis: false,
      		connectWith: false,
      		containment: false,
      		cursor: 'auto',
      		cursorAt: false,
      		dropOnEmpty: true,
      		forcePlaceholderSize: false,
      		forceHelperSize: false,
      		grid: false,
      		handle: false,
      		helper: "original",
      		items: '> *',
      		opacity: false,
      		placeholder: false,
      		revert: false,
      		scroll: true,
      		scrollSensitivity: 20,
      		scrollSpeed: 20,
      		scope: "default",
      		tolerance: "intersect",
      		zIndex: 1000
      	},
      	_create: function() {
      
      		var o = this.options;
      		this.containerCache = {};
      		this.element.addClass("ui-sortable");
      
      		//Get the items
      		this.refresh();
      
      		//Let's determine if the items are being displayed horizontally
      		this.floating = this.items.length ? o.axis === 'x' || (/left|right/).test(this.items[0].item.css('float')) || (/inline|table-cell/).test(this.items[0].item.css('display')) : false;
      
      		//Let's determine the parent's offset
      		this.offset = this.element.offset();
      
      		//Initialize mouse events for interaction
      		this._mouseInit();
      
      		//We're ready to go
      		this.ready = true
      
      	},
      
      	_destroy: function() {
      		this.element
      			.removeClass("ui-sortable ui-sortable-disabled");
      		this._mouseDestroy();
      
      		for ( var i = this.items.length - 1; i >= 0; i-- )
      			this.items[i].item.removeData(this.widgetName + "-item");
      
      		return this;
      	},
      
      	_setOption: function(key, value){
      		if ( key === "disabled" ) {
      			this.options[ key ] = value;
      
      			this.widget().toggleClass( "ui-sortable-disabled", !!value );
      		} else {
      			// Don't call widget base _setOption for disable as it adds ui-state-disabled class
      			$.Widget.prototype._setOption.apply(this, arguments);
      		}
      	},
      
      	_mouseCapture: function(event, overrideHandle) {
      		var that = this;
      
      		if (this.reverting) {
      			return false;
      		}
      
      		if(this.options.disabled || this.options.type == 'static') return false;
      
      		//We have to refresh the items data once first
      		this._refreshItems(event);
      
      		//Find out if the clicked node (or one of its parents) is a actual item in this.items
      		var currentItem = null, nodes = $(event.target).parents().each(function() {
      			if($.data(this, that.widgetName + '-item') == that) {
      				currentItem = $(this);
      				return false;
      			}
      		});
      		if($.data(event.target, that.widgetName + '-item') == that) currentItem = $(event.target);
      
      		if(!currentItem) return false;
      		if(this.options.handle && !overrideHandle) {
      			var validHandle = false;
      
      			$(this.options.handle, currentItem).find("*").andSelf().each(function() { if(this == event.target) validHandle = true; });
      			if(!validHandle) return false;
      		}
      
      		this.currentItem = currentItem;
      		this._removeCurrentsFromItems();
      		return true;
      
      	},
      
      	_mouseStart: function(event, overrideHandle, noActivation) {
      
      		var o = this.options;
      		this.currentContainer = this;
      
      		//We only need to call refreshPositions, because the refreshItems call has been moved to mouseCapture
      		this.refreshPositions();
      
      		//Create and append the visible helper
      		this.helper = this._createHelper(event);
      
      		//Cache the helper size
      		this._cacheHelperProportions();
      
      		/*
      		 * - Position generation -
      		 * This block generates everything position related - it's the core of draggables.
      		 */
      
      		//Cache the margins of the original element
      		this._cacheMargins();
      
      		//Get the next scrolling parent
      		this.scrollParent = this.helper.scrollParent();
      
      		//The element's absolute position on the page minus margins
      		this.offset = this.currentItem.offset();
      		this.offset = {
      			top: this.offset.top - this.margins.top,
      			left: this.offset.left - this.margins.left
      		};
      
      		$.extend(this.offset, {
      			click: { //Where the click happened, relative to the element
      				left: event.pageX - this.offset.left,
      				top: event.pageY - this.offset.top
      			},
      			parent: this._getParentOffset(),
      			relative: this._getRelativeOffset() //This is a relative to absolute position minus the actual position calculation - only used for relative positioned helper
      		});
      
      		// Only after we got the offset, we can change the helper's position to absolute
      		// TODO: Still need to figure out a way to make relative sorting possible
      		this.helper.css("position", "absolute");
      		this.cssPosition = this.helper.css("position");
      
      		//Generate the original position
      		this.originalPosition = this._generatePosition(event);
      		this.originalPageX = event.pageX;
      		this.originalPageY = event.pageY;
      
      		//Adjust the mouse offset relative to the helper if 'cursorAt' is supplied
      		(o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt));
      
      		//Cache the former DOM position
      		this.domPosition = { prev: this.currentItem.prev()[0], parent: this.currentItem.parent()[0] };
      
      		//If the helper is not the original, hide the original so it's not playing any role during the drag, won't cause anything bad this way
      		if(this.helper[0] != this.currentItem[0]) {
      			this.currentItem.hide();
      		}
      
      		//Create the placeholder
      		this._createPlaceholder();
      
      		//Set a containment if given in the options
      		if(o.containment)
      			this._setContainment();
      
      		if(o.cursor) { // cursor option
      			if ($('body').css("cursor")) this._storedCursor = $('body').css("cursor");
      			$('body').css("cursor", o.cursor);
      		}
      
      		if(o.opacity) { // opacity option
      			if (this.helper.css("opacity")) this._storedOpacity = this.helper.css("opacity");
      			this.helper.css("opacity", o.opacity);
      		}
      
      		if(o.zIndex) { // zIndex option
      			if (this.helper.css("zIndex")) this._storedZIndex = this.helper.css("zIndex");
      			this.helper.css("zIndex", o.zIndex);
      		}
      
      		//Prepare scrolling
      		if(this.scrollParent[0] != document && this.scrollParent[0].tagName != 'HTML')
      			this.overflowOffset = this.scrollParent.offset();
      
      		//Call callbacks
      		this._trigger("start", event, this._uiHash());
      
      		//Recache the helper size
      		if(!this._preserveHelperProportions)
      			this._cacheHelperProportions();
      
      
      		//Post 'activate' events to possible containers
      		if(!noActivation) {
      			 for (var i = this.containers.length - 1; i >= 0; i--) { this.containers[i]._trigger("activate", event, this._uiHash(this)); }
      		}
      
      		//Prepare possible droppables
      		if($.ui.ddmanager)
      			$.ui.ddmanager.current = this;
      
      		if ($.ui.ddmanager && !o.dropBehaviour)
      			$.ui.ddmanager.prepareOffsets(this, event);
      
      		this.dragging = true;
      
      		this.helper.addClass("ui-sortable-helper");
      		this._mouseDrag(event); //Execute the drag once - this causes the helper not to be visible before getting its correct position
      		return true;
      
      	},
      
      	_mouseDrag: function(event) {
      
      		//Compute the helpers position
      		this.position = this._generatePosition(event);
      		this.positionAbs = this._convertPositionTo("absolute");
      
      		if (!this.lastPositionAbs) {
      			this.lastPositionAbs = this.positionAbs;
      		}
      
      		//Do scrolling
      		if(this.options.scroll) {
      			var o = this.options, scrolled = false;
      			if(this.scrollParent[0] != document && this.scrollParent[0].tagName != 'HTML') {
      
      				if((this.overflowOffset.top + this.scrollParent[0].offsetHeight) - event.pageY < o.scrollSensitivity)
      					this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop + o.scrollSpeed;
      				else if(event.pageY - this.overflowOffset.top < o.scrollSensitivity)
      					this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop - o.scrollSpeed;
      
      				if((this.overflowOffset.left + this.scrollParent[0].offsetWidth) - event.pageX < o.scrollSensitivity)
      					this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft + o.scrollSpeed;
      				else if(event.pageX - this.overflowOffset.left < o.scrollSensitivity)
      					this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft - o.scrollSpeed;
      
      			} else {
      
      				if(event.pageY - $(document).scrollTop() < o.scrollSensitivity)
      					scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
      				else if($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity)
      					scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);
      
      				if(event.pageX - $(document).scrollLeft() < o.scrollSensitivity)
      					scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
      				else if($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity)
      					scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);
      
      			}
      
      			if(scrolled !== false && $.ui.ddmanager && !o.dropBehaviour)
      				$.ui.ddmanager.prepareOffsets(this, event);
      		}
      
      		//Regenerate the absolute position used for position checks
      		this.positionAbs = this._convertPositionTo("absolute");
      
      		//Set the helper position
      		if(!this.options.axis || this.options.axis != "y") this.helper[0].style.left = this.position.left+'px';
      		if(!this.options.axis || this.options.axis != "x") this.helper[0].style.top = this.position.top+'px';
      
      		//Rearrange
      		for (var i = this.items.length - 1; i >= 0; i--) {
      
      			//Cache variables and intersection, continue if no intersection
      			var item = this.items[i], itemElement = item.item[0], intersection = this._intersectsWithPointer(item);
      			if (!intersection) continue;
      
      			// Only put the placeholder inside the current Container, skip all
      			// items form other containers. This works because when moving
      			// an item from one container to another the
      			// currentContainer is switched before the placeholder is moved.
      			//
      			// Without this moving items in "sub-sortables" can cause the placeholder to jitter
      			// beetween the outer and inner container.
      			if (item.instance !== this.currentContainer) continue;
      
      			if (itemElement != this.currentItem[0] //cannot intersect with itself
      				&&	this.placeholder[intersection == 1 ? "next" : "prev"]()[0] != itemElement //no useless actions that have been done before
      				&&	!$.contains(this.placeholder[0], itemElement) //no action if the item moved is the parent of the item checked
      				&& (this.options.type == 'semi-dynamic' ? !$.contains(this.element[0], itemElement) : true)
      				//&& itemElement.parentNode == this.placeholder[0].parentNode // only rearrange items within the same container
      			) {
      
      				this.direction = intersection == 1 ? "down" : "up";
      
      				if (this.options.tolerance == "pointer" || this._intersectsWithSides(item)) {
      					this._rearrange(event, item);
      				} else {
      					break;
      				}
      
      				this._trigger("change", event, this._uiHash());
      				break;
      			}
      		}
      
      		//Post events to containers
      		this._contactContainers(event);
      
      		//Interconnect with droppables
      		if($.ui.ddmanager) $.ui.ddmanager.drag(this, event);
      
      		//Call callbacks
      		this._trigger('sort', event, this._uiHash());
      
      		this.lastPositionAbs = this.positionAbs;
      		return false;
      
      	},
      
      	_mouseStop: function(event, noPropagation) {
      
      		if(!event) return;
      
      		//If we are using droppables, inform the manager about the drop
      		if ($.ui.ddmanager && !this.options.dropBehaviour)
      			$.ui.ddmanager.drop(this, event);
      
      		if(this.options.revert) {
      			var that = this;
      			var cur = this.placeholder.offset();
      
      			this.reverting = true;
      
      			$(this.helper).animate({
      				left: cur.left - this.offset.parent.left - this.margins.left + (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollLeft),
      				top: cur.top - this.offset.parent.top - this.margins.top + (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollTop)
      			}, parseInt(this.options.revert, 10) || 500, function() {
      				that._clear(event);
      			});
      		} else {
      			this._clear(event, noPropagation);
      		}
      
      		return false;
      
      	},
      
      	cancel: function() {
      
      		if(this.dragging) {
      
      			this._mouseUp({ target: null });
      
      			if(this.options.helper == "original")
      				this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");
      			else
      				this.currentItem.show();
      
      			//Post deactivating events to containers
      			for (var i = this.containers.length - 1; i >= 0; i--){
      				this.containers[i]._trigger("deactivate", null, this._uiHash(this));
      				if(this.containers[i].containerCache.over) {
      					this.containers[i]._trigger("out", null, this._uiHash(this));
      					this.containers[i].containerCache.over = 0;
      				}
      			}
      
      		}
      
      		if (this.placeholder) {
      			//$(this.placeholder[0]).remove(); would have been the jQuery way - unfortunately, it unbinds ALL events from the original node!
      			if(this.placeholder[0].parentNode) this.placeholder[0].parentNode.removeChild(this.placeholder[0]);
      			if(this.options.helper != "original" && this.helper && this.helper[0].parentNode) this.helper.remove();
      
      			$.extend(this, {
      				helper: null,
      				dragging: false,
      				reverting: false,
      				_noFinalSort: null
      			});
      
      			if(this.domPosition.prev) {
      				$(this.domPosition.prev).after(this.currentItem);
      			} else {
      				$(this.domPosition.parent).prepend(this.currentItem);
      			}
      		}
      
      		return this;
      
      	},
      
      	serialize: function(o) {
      
      		var items = this._getItemsAsjQuery(o && o.connected);
      		var str = []; o = o || {};
      
      		$(items).each(function() {
      			var res = ($(o.item || this).attr(o.attribute || 'id') || '').match(o.expression || (/(.+)[-=_](.+)/));
      			if(res) str.push((o.key || res[1]+'[]')+'='+(o.key && o.expression ? res[1] : res[2]));
      		});
      
      		if(!str.length && o.key) {
      			str.push(o.key + '=');
      		}
      
      		return str.join('&');
      
      	},
      
      	toArray: function(o) {
      
      		var items = this._getItemsAsjQuery(o && o.connected);
      		var ret = []; o = o || {};
      
      		items.each(function() { ret.push($(o.item || this).attr(o.attribute || 'id') || ''); });
      		return ret;
      
      	},
      
      	/* Be careful with the following core functions */
      	_intersectsWith: function(item) {
      
      		var x1 = this.positionAbs.left,
      			x2 = x1 + this.helperProportions.width,
      			y1 = this.positionAbs.top,
      			y2 = y1 + this.helperProportions.height;
      
      		var l = item.left,
      			r = l + item.width,
      			t = item.top,
      			b = t + item.height;
      
      		var dyClick = this.offset.click.top,
      			dxClick = this.offset.click.left;
      
      		var isOverElement = (y1 + dyClick) > t && (y1 + dyClick) < b && (x1 + dxClick) > l && (x1 + dxClick) < r;
      
      		if(	   this.options.tolerance == "pointer"
      			|| this.options.forcePointerForContainers
      			|| (this.options.tolerance != "pointer" && this.helperProportions[this.floating ? 'width' : 'height'] > item[this.floating ? 'width' : 'height'])
      		) {
      			return isOverElement;
      		} else {
      
      			return (l < x1 + (this.helperProportions.width / 2) // Right Half
      				&& x2 - (this.helperProportions.width / 2) < r // Left Half
      				&& t < y1 + (this.helperProportions.height / 2) // Bottom Half
      				&& y2 - (this.helperProportions.height / 2) < b ); // Top Half
      
      		}
      	},
      
      	_intersectsWithPointer: function(item) {
      
      		var isOverElementHeight = (this.options.axis === 'x') || $.ui.isOverAxis(this.positionAbs.top + this.offset.click.top, item.top, item.height),
      			isOverElementWidth = (this.options.axis === 'y') || $.ui.isOverAxis(this.positionAbs.left + this.offset.click.left, item.left, item.width),
      			isOverElement = isOverElementHeight && isOverElementWidth,
      			verticalDirection = this._getDragVerticalDirection(),
      			horizontalDirection = this._getDragHorizontalDirection();
      
      		if (!isOverElement)
      			return false;
      
      		return this.floating ?
      			( ((horizontalDirection && horizontalDirection == "right") || verticalDirection == "down") ? 2 : 1 )
      			: ( verticalDirection && (verticalDirection == "down" ? 2 : 1) );
      
      	},
      
      	_intersectsWithSides: function(item) {
      
      		var isOverBottomHalf = $.ui.isOverAxis(this.positionAbs.top + this.offset.click.top, item.top + (item.height/2), item.height),
      			isOverRightHalf = $.ui.isOverAxis(this.positionAbs.left + this.offset.click.left, item.left + (item.width/2), item.width),
      			verticalDirection = this._getDragVerticalDirection(),
      			horizontalDirection = this._getDragHorizontalDirection();
      
      		if (this.floating && horizontalDirection) {
      			return ((horizontalDirection == "right" && isOverRightHalf) || (horizontalDirection == "left" && !isOverRightHalf));
      		} else {
      			return verticalDirection && ((verticalDirection == "down" && isOverBottomHalf) || (verticalDirection == "up" && !isOverBottomHalf));
      		}
      
      	},
      
      	_getDragVerticalDirection: function() {
      		var delta = this.positionAbs.top - this.lastPositionAbs.top;
      		return delta != 0 && (delta > 0 ? "down" : "up");
      	},
      
      	_getDragHorizontalDirection: function() {
      		var delta = this.positionAbs.left - this.lastPositionAbs.left;
      		return delta != 0 && (delta > 0 ? "right" : "left");
      	},
      
      	refresh: function(event) {
      		this._refreshItems(event);
      		this.refreshPositions();
      		return this;
      	},
      
      	_connectWith: function() {
      		var options = this.options;
      		return options.connectWith.constructor == String
      			? [options.connectWith]
      			: options.connectWith;
      	},
      
      	_getItemsAsjQuery: function(connected) {
      
      		var items = [];
      		var queries = [];
      		var connectWith = this._connectWith();
      
      		if(connectWith && connected) {
      			for (var i = connectWith.length - 1; i >= 0; i--){
      				var cur = $(connectWith[i]);
      				for (var j = cur.length - 1; j >= 0; j--){
      					var inst = $.data(cur[j], this.widgetName);
      					if(inst && inst != this && !inst.options.disabled) {
      						queries.push([$.isFunction(inst.options.items) ? inst.options.items.call(inst.element) : $(inst.options.items, inst.element).not(".ui-sortable-helper").not('.ui-sortable-placeholder'), inst]);
      					}
      				};
      			};
      		}
      
      		queries.push([$.isFunction(this.options.items) ? this.options.items.call(this.element, null, { options: this.options, item: this.currentItem }) : $(this.options.items, this.element).not(".ui-sortable-helper").not('.ui-sortable-placeholder'), this]);
      
      		for (var i = queries.length - 1; i >= 0; i--){
      			queries[i][0].each(function() {
      				items.push(this);
      			});
      		};
      
      		return $(items);
      
      	},
      
      	_removeCurrentsFromItems: function() {
      
      		var list = this.currentItem.find(":data(" + this.widgetName + "-item)");
      
      		this.items = $.grep(this.items, function (item) {
      			for (var j=0; j < list.length; j++) {
      				if(list[j] == item.item[0])
      					return false;
      			};
      			return true;
      		});
      
      	},
      
      	_refreshItems: function(event) {
      
      		this.items = [];
      		this.containers = [this];
      		var items = this.items;
      		var queries = [[$.isFunction(this.options.items) ? this.options.items.call(this.element[0], event, { item: this.currentItem }) : $(this.options.items, this.element), this]];
      		var connectWith = this._connectWith();
      
      		if(connectWith && this.ready) { //Shouldn't be run the first time through due to massive slow-down
      			for (var i = connectWith.length - 1; i >= 0; i--){
      				var cur = $(connectWith[i]);
      				for (var j = cur.length - 1; j >= 0; j--){
      					var inst = $.data(cur[j], this.widgetName);
      					if(inst && inst != this && !inst.options.disabled) {
      						queries.push([$.isFunction(inst.options.items) ? inst.options.items.call(inst.element[0], event, { item: this.currentItem }) : $(inst.options.items, inst.element), inst]);
      						this.containers.push(inst);
      					}
      				};
      			};
      		}
      
      		for (var i = queries.length - 1; i >= 0; i--) {
      			var targetData = queries[i][1];
      			var _queries = queries[i][0];
      
      			for (var j=0, queriesLength = _queries.length; j < queriesLength; j++) {
      				var item = $(_queries[j]);
      
      				item.data(this.widgetName + '-item', targetData); // Data for target checking (mouse manager)
      
      				items.push({
      					item: item,
      					instance: targetData,
      					width: 0, height: 0,
      					left: 0, top: 0
      				});
      			};
      		};
      
      	},
      
      	refreshPositions: function(fast) {
      
      		//This has to be redone because due to the item being moved out/into the offsetParent, the offsetParent's position will change
      		if(this.offsetParent && this.helper) {
      			this.offset.parent = this._getParentOffset();
      		}
      
      		for (var i = this.items.length - 1; i >= 0; i--){
      			var item = this.items[i];
      
      			//We ignore calculating positions of all connected containers when we're not over them
      			if(item.instance != this.currentContainer && this.currentContainer && item.item[0] != this.currentItem[0])
      				continue;
      
      			var t = this.options.toleranceElement ? $(this.options.toleranceElement, item.item) : item.item;
      
      			if (!fast) {
      				item.width = t.outerWidth();
      				item.height = t.outerHeight();
      			}
      
      			var p = t.offset();
      			item.left = p.left;
      			item.top = p.top;
      		};
      
      		if(this.options.custom && this.options.custom.refreshContainers) {
      			this.options.custom.refreshContainers.call(this);
      		} else {
      			for (var i = this.containers.length - 1; i >= 0; i--){
      				var p = this.containers[i].element.offset();
      				this.containers[i].containerCache.left = p.left;
      				this.containers[i].containerCache.top = p.top;
      				this.containers[i].containerCache.width	= this.containers[i].element.outerWidth();
      				this.containers[i].containerCache.height = this.containers[i].element.outerHeight();
      			};
      		}
      
      		return this;
      	},
      
      	_createPlaceholder: function(that) {
      		that = that || this;
      		var o = that.options;
      
      		if(!o.placeholder || o.placeholder.constructor == String) {
      			var className = o.placeholder;
      			o.placeholder = {
      				element: function() {
      
      					var el = $(document.createElement(that.currentItem[0].nodeName))
      						.addClass(className || that.currentItem[0].className+" ui-sortable-placeholder")
      						.removeClass("ui-sortable-helper")[0];
      
      					if(!className)
      						el.style.visibility = "hidden";
      
      					return el;
      				},
      				update: function(container, p) {
      
      					// 1. If a className is set as 'placeholder option, we don't force sizes - the class is responsible for that
      					// 2. The option 'forcePlaceholderSize can be enabled to force it even if a class name is specified
      					if(className && !o.forcePlaceholderSize) return;
      
      					//If the element doesn't have a actual height by itself (without styles coming from a stylesheet), it receives the inline height from the dragged item
      					if(!p.height()) { p.height(that.currentItem.innerHeight() - parseInt(that.currentItem.css('paddingTop')||0, 10) - parseInt(that.currentItem.css('paddingBottom')||0, 10)); };
      					if(!p.width()) { p.width(that.currentItem.innerWidth() - parseInt(that.currentItem.css('paddingLeft')||0, 10) - parseInt(that.currentItem.css('paddingRight')||0, 10)); };
      				}
      			};
      		}
      
      		//Create the placeholder
      		that.placeholder = $(o.placeholder.element.call(that.element, that.currentItem));
      
      		//Append it after the actual current item
      		that.currentItem.after(that.placeholder);
      
      		//Update the size of the placeholder (TODO: Logic to fuzzy, see line 316/317)
      		o.placeholder.update(that, that.placeholder);
      
      	},
      
      	_contactContainers: function(event) {
      
      		// get innermost container that intersects with item
      		var innermostContainer = null, innermostIndex = null;
      
      
      		for (var i = this.containers.length - 1; i >= 0; i--){
      
      			// never consider a container that's located within the item itself
      			if($.contains(this.currentItem[0], this.containers[i].element[0]))
      				continue;
      
      			if(this._intersectsWith(this.containers[i].containerCache)) {
      
      				// if we've already found a container and it's more "inner" than this, then continue
      				if(innermostContainer && $.contains(this.containers[i].element[0], innermostContainer.element[0]))
      					continue;
      
      				innermostContainer = this.containers[i];
      				innermostIndex = i;
      
      			} else {
      				// container doesn't intersect. trigger "out" event if necessary
      				if(this.containers[i].containerCache.over) {
      					this.containers[i]._trigger("out", event, this._uiHash(this));
      					this.containers[i].containerCache.over = 0;
      				}
      			}
      
      		}
      
      		// if no intersecting containers found, return
      		if(!innermostContainer) return;
      
      		// move the item into the container if it's not there already
      		if(this.containers.length === 1) {
      			this.containers[innermostIndex]._trigger("over", event, this._uiHash(this));
      			this.containers[innermostIndex].containerCache.over = 1;
      		} else {
      
      			//When entering a new container, we will find the item with the least distance and append our item near it
      			var dist = 10000; var itemWithLeastDistance = null;
      			var posProperty = this.containers[innermostIndex].floating ? 'left' : 'top';
      			var sizeProperty = this.containers[innermostIndex].floating ? 'width' : 'height';
      			var base = this.positionAbs[posProperty] + this.offset.click[posProperty];
      			for (var j = this.items.length - 1; j >= 0; j--) {
      				if(!$.contains(this.containers[innermostIndex].element[0], this.items[j].item[0])) continue;
      				if(this.items[j].item[0] == this.currentItem[0]) continue;
      				var cur = this.items[j].item.offset()[posProperty];
      				var nearBottom = false;
      				if(Math.abs(cur - base) > Math.abs(cur + this.items[j][sizeProperty] - base)){
      					nearBottom = true;
      					cur += this.items[j][sizeProperty];
      				}
      
      				if(Math.abs(cur - base) < dist) {
      					dist = Math.abs(cur - base); itemWithLeastDistance = this.items[j];
      					this.direction = nearBottom ? "up": "down";
      				}
      			}
      
      			if(!itemWithLeastDistance && !this.options.dropOnEmpty) //Check if dropOnEmpty is enabled
      				return;
      
      			this.currentContainer = this.containers[innermostIndex];
      			itemWithLeastDistance ? this._rearrange(event, itemWithLeastDistance, null, true) : this._rearrange(event, null, this.containers[innermostIndex].element, true);
      			this._trigger("change", event, this._uiHash());
      			this.containers[innermostIndex]._trigger("change", event, this._uiHash(this));
      
      			//Update the placeholder
      			this.options.placeholder.update(this.currentContainer, this.placeholder);
      
      			this.containers[innermostIndex]._trigger("over", event, this._uiHash(this));
      			this.containers[innermostIndex].containerCache.over = 1;
      		}
      
      
      	},
      
      	_createHelper: function(event) {
      
      		var o = this.options;
      		var helper = $.isFunction(o.helper) ? $(o.helper.apply(this.element[0], [event, this.currentItem])) : (o.helper == 'clone' ? this.currentItem.clone() : this.currentItem);
      
      		if(!helper.parents('body').length) //Add the helper to the DOM if that didn't happen already
      			$(o.appendTo != 'parent' ? o.appendTo : this.currentItem[0].parentNode)[0].appendChild(helper[0]);
      
      		if(helper[0] == this.currentItem[0])
      			this._storedCSS = { width: this.currentItem[0].style.width, height: this.currentItem[0].style.height, position: this.currentItem.css("position"), top: this.currentItem.css("top"), left: this.currentItem.css("left") };
      
      		if(helper[0].style.width == '' || o.forceHelperSize) helper.width(this.currentItem.width());
      		if(helper[0].style.height == '' || o.forceHelperSize) helper.height(this.currentItem.height());
      
      		return helper;
      
      	},
      
      	_adjustOffsetFromHelper: function(obj) {
      		if (typeof obj == 'string') {
      			obj = obj.split(' ');
      		}
      		if ($.isArray(obj)) {
      			obj = {left: +obj[0], top: +obj[1] || 0};
      		}
      		if ('left' in obj) {
      			this.offset.click.left = obj.left + this.margins.left;
      		}
      		if ('right' in obj) {
      			this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
      		}
      		if ('top' in obj) {
      			this.offset.click.top = obj.top + this.margins.top;
      		}
      		if ('bottom' in obj) {
      			this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
      		}
      	},
      
      	_getParentOffset: function() {
      
      
      		//Get the offsetParent and cache its position
      		this.offsetParent = this.helper.offsetParent();
      		var po = this.offsetParent.offset();
      
      		// This is a special case where we need to modify a offset calculated on start, since the following happened:
      		// 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
      		// 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
      		//    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
      		if(this.cssPosition == 'absolute' && this.scrollParent[0] != document && $.contains(this.scrollParent[0], this.offsetParent[0])) {
      			po.left += this.scrollParent.scrollLeft();
      			po.top += this.scrollParent.scrollTop();
      		}
      
      		if((this.offsetParent[0] == document.body) //This needs to be actually done for all browsers, since pageX/pageY includes this information
      		|| (this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == 'html' && $.ui.ie)) //Ugly IE fix
      			po = { top: 0, left: 0 };
      
      		return {
      			top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"),10) || 0),
      			left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"),10) || 0)
      		};
      
      	},
      
      	_getRelativeOffset: function() {
      
      		if(this.cssPosition == "relative") {
      			var p = this.currentItem.position();
      			return {
      				top: p.top - (parseInt(this.helper.css("top"),10) || 0) + this.scrollParent.scrollTop(),
      				left: p.left - (parseInt(this.helper.css("left"),10) || 0) + this.scrollParent.scrollLeft()
      			};
      		} else {
      			return { top: 0, left: 0 };
      		}
      
      	},
      
      	_cacheMargins: function() {
      		this.margins = {
      			left: (parseInt(this.currentItem.css("marginLeft"),10) || 0),
      			top: (parseInt(this.currentItem.css("marginTop"),10) || 0)
      		};
      	},
      
      	_cacheHelperProportions: function() {
      		this.helperProportions = {
      			width: this.helper.outerWidth(),
      			height: this.helper.outerHeight()
      		};
      	},
      
      	_setContainment: function() {
      
      		var o = this.options;
      		if(o.containment == 'parent') o.containment = this.helper[0].parentNode;
      		if(o.containment == 'document' || o.containment == 'window') this.containment = [
      			0 - this.offset.relative.left - this.offset.parent.left,
      			0 - this.offset.relative.top - this.offset.parent.top,
      			$(o.containment == 'document' ? document : window).width() - this.helperProportions.width - this.margins.left,
      			($(o.containment == 'document' ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top
      		];
      
      		if(!(/^(document|window|parent)$/).test(o.containment)) {
      			var ce = $(o.containment)[0];
      			var co = $(o.containment).offset();
      			var over = ($(ce).css("overflow") != 'hidden');
      
      			this.containment = [
      				co.left + (parseInt($(ce).css("borderLeftWidth"),10) || 0) + (parseInt($(ce).css("paddingLeft"),10) || 0) - this.margins.left,
      				co.top + (parseInt($(ce).css("borderTopWidth"),10) || 0) + (parseInt($(ce).css("paddingTop"),10) || 0) - this.margins.top,
      				co.left+(over ? Math.max(ce.scrollWidth,ce.offsetWidth) : ce.offsetWidth) - (parseInt($(ce).css("borderLeftWidth"),10) || 0) - (parseInt($(ce).css("paddingRight"),10) || 0) - this.helperProportions.width - this.margins.left,
      				co.top+(over ? Math.max(ce.scrollHeight,ce.offsetHeight) : ce.offsetHeight) - (parseInt($(ce).css("borderTopWidth"),10) || 0) - (parseInt($(ce).css("paddingBottom"),10) || 0) - this.helperProportions.height - this.margins.top
      			];
      		}
      
      	},
      
      	_convertPositionTo: function(d, pos) {
      
      		if(!pos) pos = this.position;
      		var mod = d == "absolute" ? 1 : -1;
      		var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);
      
      		return {
      			top: (
      				pos.top																	// The absolute mouse position
      				+ this.offset.relative.top * mod										// Only for relative positioned nodes: Relative offset from element to offset parent
      				+ this.offset.parent.top * mod											// The offsetParent's offset without borders (offset + border)
      				- ( ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ) * mod)
      			),
      			left: (
      				pos.left																// The absolute mouse position
      				+ this.offset.relative.left * mod										// Only for relative positioned nodes: Relative offset from element to offset parent
      				+ this.offset.parent.left * mod											// The offsetParent's offset without borders (offset + border)
      				- ( ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ) * mod)
      			)
      		};
      
      	},
      
      	_generatePosition: function(event) {
      
      		var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);
      
      		// This is another very weird special case that only happens for relative elements:
      		// 1. If the css position is relative
      		// 2. and the scroll parent is the document or similar to the offset parent
      		// we have to refresh the relative offset during the scroll so there are no jumps
      		if(this.cssPosition == 'relative' && !(this.scrollParent[0] != document && this.scrollParent[0] != this.offsetParent[0])) {
      			this.offset.relative = this._getRelativeOffset();
      		}
      
      		var pageX = event.pageX;
      		var pageY = event.pageY;
      
      		/*
      		 * - Position constraining -
      		 * Constrain the position to a mix of grid, containment.
      		 */
      
      		if(this.originalPosition) { //If we are not dragging yet, we won't check for options
      
      			if(this.containment) {
      				if(event.pageX - this.offset.click.left < this.containment[0]) pageX = this.containment[0] + this.offset.click.left;
      				if(event.pageY - this.offset.click.top < this.containment[1]) pageY = this.containment[1] + this.offset.click.top;
      				if(event.pageX - this.offset.click.left > this.containment[2]) pageX = this.containment[2] + this.offset.click.left;
      				if(event.pageY - this.offset.click.top > this.containment[3]) pageY = this.containment[3] + this.offset.click.top;
      			}
      
      			if(o.grid) {
      				var top = this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1];
      				pageY = this.containment ? (!(top - this.offset.click.top < this.containment[1] || top - this.offset.click.top > this.containment[3]) ? top : (!(top - this.offset.click.top < this.containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;
      
      				var left = this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0];
      				pageX = this.containment ? (!(left - this.offset.click.left < this.containment[0] || left - this.offset.click.left > this.containment[2]) ? left : (!(left - this.offset.click.left < this.containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
      			}
      
      		}
      
      		return {
      			top: (
      				pageY																// The absolute mouse position
      				- this.offset.click.top													// Click offset (relative to the element)
      				- this.offset.relative.top												// Only for relative positioned nodes: Relative offset from element to offset parent
      				- this.offset.parent.top												// The offsetParent's offset without borders (offset + border)
      				+ ( ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ))
      			),
      			left: (
      				pageX																// The absolute mouse position
      				- this.offset.click.left												// Click offset (relative to the element)
      				- this.offset.relative.left												// Only for relative positioned nodes: Relative offset from element to offset parent
      				- this.offset.parent.left												// The offsetParent's offset without borders (offset + border)
      				+ ( ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ))
      			)
      		};
      
      	},
      
      	_rearrange: function(event, i, a, hardRefresh) {
      
      		a ? a[0].appendChild(this.placeholder[0]) : i.item[0].parentNode.insertBefore(this.placeholder[0], (this.direction == 'down' ? i.item[0] : i.item[0].nextSibling));
      
      		//Various things done here to improve the performance:
      		// 1. we create a setTimeout, that calls refreshPositions
      		// 2. on the instance, we have a counter variable, that get's higher after every append
      		// 3. on the local scope, we copy the counter variable, and check in the timeout, if it's still the same
      		// 4. this lets only the last addition to the timeout stack through
      		this.counter = this.counter ? ++this.counter : 1;
      		var counter = this.counter;
      
      		this._delay(function() {
      			if(counter == this.counter) this.refreshPositions(!hardRefresh); //Precompute after each DOM insertion, NOT on mousemove
      		});
      
      	},
      
      	_clear: function(event, noPropagation) {
      
      		this.reverting = false;
      		// We delay all events that have to be triggered to after the point where the placeholder has been removed and
      		// everything else normalized again
      		var delayedTriggers = [];
      
      		// We first have to update the dom position of the actual currentItem
      		// Note: don't do it if the current item is already removed (by a user), or it gets reappended (see #4088)
      		if(!this._noFinalSort && this.currentItem.parent().length) this.placeholder.before(this.currentItem);
      		this._noFinalSort = null;
      
      		if(this.helper[0] == this.currentItem[0]) {
      			for(var i in this._storedCSS) {
      				if(this._storedCSS[i] == 'auto' || this._storedCSS[i] == 'static') this._storedCSS[i] = '';
      			}
      			this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");
      		} else {
      			this.currentItem.show();
      		}
      
      		if(this.fromOutside && !noPropagation) delayedTriggers.push(function(event) { this._trigger("receive", event, this._uiHash(this.fromOutside)); });
      		if((this.fromOutside || this.domPosition.prev != this.currentItem.prev().not(".ui-sortable-helper")[0] || this.domPosition.parent != this.currentItem.parent()[0]) && !noPropagation) delayedTriggers.push(function(event) { this._trigger("update", event, this._uiHash()); }); //Trigger update callback if the DOM position has changed
      
      		// Check if the items Container has Changed and trigger appropriate
      		// events.
      		if (this !== this.currentContainer) {
      			if(!noPropagation) {
      				delayedTriggers.push(function(event) { this._trigger("remove", event, this._uiHash()); });
      				delayedTriggers.push((function(c) { return function(event) { c._trigger("receive", event, this._uiHash(this)); };  }).call(this, this.currentContainer));
      				delayedTriggers.push((function(c) { return function(event) { c._trigger("update", event, this._uiHash(this));  }; }).call(this, this.currentContainer));
      			}
      		}
      
      
      		//Post events to containers
      		for (var i = this.containers.length - 1; i >= 0; i--){
      			if(!noPropagation) delayedTriggers.push((function(c) { return function(event) { c._trigger("deactivate", event, this._uiHash(this)); };  }).call(this, this.containers[i]));
      			if(this.containers[i].containerCache.over) {
      				delayedTriggers.push((function(c) { return function(event) { c._trigger("out", event, this._uiHash(this)); };  }).call(this, this.containers[i]));
      				this.containers[i].containerCache.over = 0;
      			}
      		}
      
      		//Do what was originally in plugins
      		if(this._storedCursor) $('body').css("cursor", this._storedCursor); //Reset cursor
      		if(this._storedOpacity) this.helper.css("opacity", this._storedOpacity); //Reset opacity
      		if(this._storedZIndex) this.helper.css("zIndex", this._storedZIndex == 'auto' ? '' : this._storedZIndex); //Reset z-index
      
      		this.dragging = false;
      		if(this.cancelHelperRemoval) {
      			if(!noPropagation) {
      				this._trigger("beforeStop", event, this._uiHash());
      				for (var i=0; i < delayedTriggers.length; i++) { delayedTriggers[i].call(this, event); }; //Trigger all delayed events
      				this._trigger("stop", event, this._uiHash());
      			}
      
      			this.fromOutside = false;
      			return false;
      		}
      
      		if(!noPropagation) this._trigger("beforeStop", event, this._uiHash());
      
      		//$(this.placeholder[0]).remove(); would have been the jQuery way - unfortunately, it unbinds ALL events from the original node!
      		this.placeholder[0].parentNode.removeChild(this.placeholder[0]);
      
      		if(this.helper[0] != this.currentItem[0]) this.helper.remove(); this.helper = null;
      
      		if(!noPropagation) {
      			for (var i=0; i < delayedTriggers.length; i++) { delayedTriggers[i].call(this, event); }; //Trigger all delayed events
      			this._trigger("stop", event, this._uiHash());
      		}
      
      		this.fromOutside = false;
      		return true;
      
      	},
      
      	_trigger: function() {
      		if ($.Widget.prototype._trigger.apply(this, arguments) === false) {
      			this.cancel();
      		}
      	},
      
      	_uiHash: function(_inst) {
      		var inst = _inst || this;
      		return {
      			helper: inst.helper,
      			placeholder: inst.placeholder || $([]),
      			position: inst.position,
      			originalPosition: inst.originalPosition,
      			offset: inst.positionAbs,
      			item: inst.currentItem,
      			sender: _inst ? _inst.element : null
      		};
      	}
      
      });
      
      })(jQuery);
      (function( $, undefined ) {
      
      $.extend($.ui, { datepicker: { version: "1.9.2" } });
      
      var PROP_NAME = 'datepicker';
      var dpuuid = new Date().getTime();
      var instActive;
      
      /* Date picker manager.
         Use the singleton instance of this class, $.datepicker, to interact with the date picker.
         Settings for (groups of) date pickers are maintained in an instance object,
         allowing multiple different settings on the same page. */
      
      function Datepicker() {
      	this.debug = false; // Change this to true to start debugging
      	this._curInst = null; // The current instance in use
      	this._keyEvent = false; // If the last event was a key event
      	this._disabledInputs = []; // List of date picker inputs that have been disabled
      	this._datepickerShowing = false; // True if the popup picker is showing , false if not
      	this._inDialog = false; // True if showing within a "dialog", false if not
      	this._mainDivId = 'ui-datepicker-div'; // The ID of the main datepicker division
      	this._inlineClass = 'ui-datepicker-inline'; // The name of the inline marker class
      	this._appendClass = 'ui-datepicker-append'; // The name of the append marker class
      	this._triggerClass = 'ui-datepicker-trigger'; // The name of the trigger marker class
      	this._dialogClass = 'ui-datepicker-dialog'; // The name of the dialog marker class
      	this._disableClass = 'ui-datepicker-disabled'; // The name of the disabled covering marker class
      	this._unselectableClass = 'ui-datepicker-unselectable'; // The name of the unselectable cell marker class
      	this._currentClass = 'ui-datepicker-current-day'; // The name of the current day marker class
      	this._dayOverClass = 'ui-datepicker-days-cell-over'; // The name of the day hover marker class
      	this.regional = []; // Available regional settings, indexed by language code
      	this.regional[''] = { // Default regional settings
      		closeText: 'Done', // Display text for close link
      		prevText: 'Prev', // Display text for previous month link
      		nextText: 'Next', // Display text for next month link
      		currentText: 'Today', // Display text for current month link
      		monthNames: ['January','February','March','April','May','June',
      			'July','August','September','October','November','December'], // Names of months for drop-down and formatting
      		monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], // For formatting
      		dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], // For formatting
      		dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], // For formatting
      		dayNamesMin: ['Su','Mo','Tu','We','Th','Fr','Sa'], // Column headings for days starting at Sunday
      		weekHeader: 'Wk', // Column header for week of the year
      		dateFormat: 'mm/dd/yy', // See format options on parseDate
      		firstDay: 0, // The first day of the week, Sun = 0, Mon = 1, ...
      		isRTL: false, // True if right-to-left language, false if left-to-right
      		showMonthAfterYear: false, // True if the year select precedes month, false for month then year
      		yearSuffix: '' // Additional text to append to the year in the month headers
      	};
      	this._defaults = { // Global defaults for all the date picker instances
      		showOn: 'focus', // 'focus' for popup on focus,
      			// 'button' for trigger button, or 'both' for either
      		showAnim: 'fadeIn', // Name of jQuery animation for popup
      		showOptions: {}, // Options for enhanced animations
      		defaultDate: null, // Used when field is blank: actual date,
      			// +/-number for offset from today, null for today
      		appendText: '', // Display text following the input box, e.g. showing the format
      		buttonText: '...', // Text for trigger button
      		buttonImage: '', // URL for trigger button image
      		buttonImageOnly: false, // True if the image appears alone, false if it appears on a button
      		hideIfNoPrevNext: false, // True to hide next/previous month links
      			// if not applicable, false to just disable them
      		navigationAsDateFormat: false, // True if date formatting applied to prev/today/next links
      		gotoCurrent: false, // True if today link goes back to current selection instead
      		changeMonth: false, // True if month can be selected directly, false if only prev/next
      		changeYear: false, // True if year can be selected directly, false if only prev/next
      		yearRange: 'c-10:c+10', // Range of years to display in drop-down,
      			// either relative to today's year (-nn:+nn), relative to currently displayed year
      			// (c-nn:c+nn), absolute (nnnn:nnnn), or a combination of the above (nnnn:-n)
      		showOtherMonths: false, // True to show dates in other months, false to leave blank
      		selectOtherMonths: false, // True to allow selection of dates in other months, false for unselectable
      		showWeek: false, // True to show week of the year, false to not show it
      		calculateWeek: this.iso8601Week, // How to calculate the week of the year,
      			// takes a Date and returns the number of the week for it
      		shortYearCutoff: '+10', // Short year values < this are in the current century,
      			// > this are in the previous century,
      			// string value starting with '+' for current year + value
      		minDate: null, // The earliest selectable date, or null for no limit
      		maxDate: null, // The latest selectable date, or null for no limit
      		duration: 'fast', // Duration of display/closure
      		beforeShowDay: null, // Function that takes a date and returns an array with
      			// [0] = true if selectable, false if not, [1] = custom CSS class name(s) or '',
      			// [2] = cell title (optional), e.g. $.datepicker.noWeekends
      		beforeShow: null, // Function that takes an input field and
      			// returns a set of custom settings for the date picker
      		onSelect: null, // Define a callback function when a date is selected
      		onChangeMonthYear: null, // Define a callback function when the month or year is changed
      		onClose: null, // Define a callback function when the datepicker is closed
      		numberOfMonths: 1, // Number of months to show at a time
      		showCurrentAtPos: 0, // The position in multipe months at which to show the current month (starting at 0)
      		stepMonths: 1, // Number of months to step back/forward
      		stepBigMonths: 12, // Number of months to step back/forward for the big links
      		altField: '', // Selector for an alternate field to store selected dates into
      		altFormat: '', // The date format to use for the alternate field
      		constrainInput: true, // The input is constrained by the current date format
      		showButtonPanel: false, // True to show button panel, false to not show it
      		autoSize: false, // True to size the input for the date format, false to leave as is
      		disabled: false // The initial disabled state
      	};
      	$.extend(this._defaults, this.regional['']);
      	this.dpDiv = bindHover($('<div id="' + this._mainDivId + '" class="ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>'));
      }
      
      $.extend(Datepicker.prototype, {
      	/* Class name added to elements to indicate already configured with a date picker. */
      	markerClassName: 'hasDatepicker',
      
      	//Keep track of the maximum number of rows displayed (see #7043)
      	maxRows: 4,
      
      	/* Debug logging (if enabled). */
      	log: function () {
      		if (this.debug)
      			console.log.apply('', arguments);
      	},
      
      	// TODO rename to "widget" when switching to widget factory
      	_widgetDatepicker: function() {
      		return this.dpDiv;
      	},
      
      	/* Override the default settings for all instances of the date picker.
      	   @param  settings  object - the new settings to use as defaults (anonymous object)
      	   @return the manager object */
      	setDefaults: function(settings) {
      		extendRemove(this._defaults, settings || {});
      		return this;
      	},
      
      	/* Attach the date picker to a jQuery selection.
      	   @param  target    element - the target input field or division or span
      	   @param  settings  object - the new settings to use for this date picker instance (anonymous) */
      	_attachDatepicker: function(target, settings) {
      		// check for settings on the control itself - in namespace 'date:'
      		var inlineSettings = null;
      		for (var attrName in this._defaults) {
      			var attrValue = target.getAttribute('date:' + attrName);
      			if (attrValue) {
      				inlineSettings = inlineSettings || {};
      				try {
      					inlineSettings[attrName] = eval(attrValue);
      				} catch (err) {
      					inlineSettings[attrName] = attrValue;
      				}
      			}
      		}
      		var nodeName = target.nodeName.toLowerCase();
      		var inline = (nodeName == 'div' || nodeName == 'span');
      		if (!target.id) {
      			this.uuid += 1;
      			target.id = 'dp' + this.uuid;
      		}
      		var inst = this._newInst($(target), inline);
      		inst.settings = $.extend({}, settings || {}, inlineSettings || {});
      		if (nodeName == 'input') {
      			this._connectDatepicker(target, inst);
      		} else if (inline) {
      			this._inlineDatepicker(target, inst);
      		}
      	},
      
      	/* Create a new instance object. */
      	_newInst: function(target, inline) {
      		var id = target[0].id.replace(/([^A-Za-z0-9_-])/g, '\\\\$1'); // escape jQuery meta chars
      		return {id: id, input: target, // associated target
      			selectedDay: 0, selectedMonth: 0, selectedYear: 0, // current selection
      			drawMonth: 0, drawYear: 0, // month being drawn
      			inline: inline, // is datepicker inline or not
      			dpDiv: (!inline ? this.dpDiv : // presentation div
      			bindHover($('<div class="' + this._inlineClass + ' ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>')))};
      	},
      
      	/* Attach the date picker to an input field. */
      	_connectDatepicker: function(target, inst) {
      		var input = $(target);
      		inst.append = $([]);
      		inst.trigger = $([]);
      		if (input.hasClass(this.markerClassName))
      			return;
      		this._attachments(input, inst);
      		input.addClass(this.markerClassName).keydown(this._doKeyDown).
      			keypress(this._doKeyPress).keyup(this._doKeyUp).
      			bind("setData.datepicker", function(event, key, value) {
      				inst.settings[key] = value;
      			}).bind("getData.datepicker", function(event, key) {
      				return this._get(inst, key);
      			});
      		this._autoSize(inst);
      		$.data(target, PROP_NAME, inst);
      		//If disabled option is true, disable the datepicker once it has been attached to the input (see ticket #5665)
      		if( inst.settings.disabled ) {
      			this._disableDatepicker( target );
      		}
      	},
      
      	/* Make attachments based on settings. */
      	_attachments: function(input, inst) {
      		var appendText = this._get(inst, 'appendText');
      		var isRTL = this._get(inst, 'isRTL');
      		if (inst.append)
      			inst.append.remove();
      		if (appendText) {
      			inst.append = $('<span class="' + this._appendClass + '">' + appendText + '</span>');
      			input[isRTL ? 'before' : 'after'](inst.append);
      		}
      		input.unbind('focus', this._showDatepicker);
      		if (inst.trigger)
      			inst.trigger.remove();
      		var showOn = this._get(inst, 'showOn');
      		if (showOn == 'focus' || showOn == 'both') // pop-up date picker when in the marked field
      			input.focus(this._showDatepicker);
      		if (showOn == 'button' || showOn == 'both') { // pop-up date picker when button clicked
      			var buttonText = this._get(inst, 'buttonText');
      			var buttonImage = this._get(inst, 'buttonImage');
      			inst.trigger = $(this._get(inst, 'buttonImageOnly') ?
      				$('<img/>').addClass(this._triggerClass).
      					attr({ src: buttonImage, alt: buttonText, title: buttonText }) :
      				$('<button type="button"></button>').addClass(this._triggerClass).
      					html(buttonImage == '' ? buttonText : $('<img/>').attr(
      					{ src:buttonImage, alt:buttonText, title:buttonText })));
      			input[isRTL ? 'before' : 'after'](inst.trigger);
      			inst.trigger.click(function() {
      				if ($.datepicker._datepickerShowing && $.datepicker._lastInput == input[0])
      					$.datepicker._hideDatepicker();
      				else if ($.datepicker._datepickerShowing && $.datepicker._lastInput != input[0]) {
      					$.datepicker._hideDatepicker();
      					$.datepicker._showDatepicker(input[0]);
      				} else
      					$.datepicker._showDatepicker(input[0]);
      				return false;
      			});
      		}
      	},
      
      	/* Apply the maximum length for the date format. */
      	_autoSize: function(inst) {
      		if (this._get(inst, 'autoSize') && !inst.inline) {
      			var date = new Date(2009, 12 - 1, 20); // Ensure double digits
      			var dateFormat = this._get(inst, 'dateFormat');
      			if (dateFormat.match(/[DM]/)) {
      				var findMax = function(names) {
      					var max = 0;
      					var maxI = 0;
      					for (var i = 0; i < names.length; i++) {
      						if (names[i].length > max) {
      							max = names[i].length;
      							maxI = i;
      						}
      					}
      					return maxI;
      				};
      				date.setMonth(findMax(this._get(inst, (dateFormat.match(/MM/) ?
      					'monthNames' : 'monthNamesShort'))));
      				date.setDate(findMax(this._get(inst, (dateFormat.match(/DD/) ?
      					'dayNames' : 'dayNamesShort'))) + 20 - date.getDay());
      			}
      			inst.input.attr('size', this._formatDate(inst, date).length);
      		}
      	},
      
      	/* Attach an inline date picker to a div. */
      	_inlineDatepicker: function(target, inst) {
      		var divSpan = $(target);
      		if (divSpan.hasClass(this.markerClassName))
      			return;
      		divSpan.addClass(this.markerClassName).append(inst.dpDiv).
      			bind("setData.datepicker", function(event, key, value){
      				inst.settings[key] = value;
      			}).bind("getData.datepicker", function(event, key){
      				return this._get(inst, key);
      			});
      		$.data(target, PROP_NAME, inst);
      		this._setDate(inst, this._getDefaultDate(inst), true);
      		this._updateDatepicker(inst);
      		this._updateAlternate(inst);
      		//If disabled option is true, disable the datepicker before showing it (see ticket #5665)
      		if( inst.settings.disabled ) {
      			this._disableDatepicker( target );
      		}
      		// Set display:block in place of inst.dpDiv.show() which won't work on disconnected elements
      		// http://bugs.jqueryui.com/ticket/7552 - A Datepicker created on a detached div has zero height
      		inst.dpDiv.css( "display", "block" );
      	},
      
      	/* Pop-up the date picker in a "dialog" box.
      	   @param  input     element - ignored
      	   @param  date      string or Date - the initial date to display
      	   @param  onSelect  function - the function to call when a date is selected
      	   @param  settings  object - update the dialog date picker instance's settings (anonymous object)
      	   @param  pos       int[2] - coordinates for the dialog's position within the screen or
      	                     event - with x/y coordinates or
      	                     leave empty for default (screen centre)
      	   @return the manager object */
      	_dialogDatepicker: function(input, date, onSelect, settings, pos) {
      		var inst = this._dialogInst; // internal instance
      		if (!inst) {
      			this.uuid += 1;
      			var id = 'dp' + this.uuid;
      			this._dialogInput = $('<input type="text" id="' + id +
      				'" style="position: absolute; top: -100px; width: 0px;"/>');
      			this._dialogInput.keydown(this._doKeyDown);
      			$('body').append(this._dialogInput);
      			inst = this._dialogInst = this._newInst(this._dialogInput, false);
      			inst.settings = {};
      			$.data(this._dialogInput[0], PROP_NAME, inst);
      		}
      		extendRemove(inst.settings, settings || {});
      		date = (date && date.constructor == Date ? this._formatDate(inst, date) : date);
      		this._dialogInput.val(date);
      
      		this._pos = (pos ? (pos.length ? pos : [pos.pageX, pos.pageY]) : null);
      		if (!this._pos) {
      			var browserWidth = document.documentElement.clientWidth;
      			var browserHeight = document.documentElement.clientHeight;
      			var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
      			var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
      			this._pos = // should use actual width/height below
      				[(browserWidth / 2) - 100 + scrollX, (browserHeight / 2) - 150 + scrollY];
      		}
      
      		// move input on screen for focus, but hidden behind dialog
      		this._dialogInput.css('left', (this._pos[0] + 20) + 'px').css('top', this._pos[1] + 'px');
      		inst.settings.onSelect = onSelect;
      		this._inDialog = true;
      		this.dpDiv.addClass(this._dialogClass);
      		this._showDatepicker(this._dialogInput[0]);
      		if ($.blockUI)
      			$.blockUI(this.dpDiv);
      		$.data(this._dialogInput[0], PROP_NAME, inst);
      		return this;
      	},
      
      	/* Detach a datepicker from its control.
      	   @param  target    element - the target input field or division or span */
      	_destroyDatepicker: function(target) {
      		var $target = $(target);
      		var inst = $.data(target, PROP_NAME);
      		if (!$target.hasClass(this.markerClassName)) {
      			return;
      		}
      		var nodeName = target.nodeName.toLowerCase();
      		$.removeData(target, PROP_NAME);
      		if (nodeName == 'input') {
      			inst.append.remove();
      			inst.trigger.remove();
      			$target.removeClass(this.markerClassName).
      				unbind('focus', this._showDatepicker).
      				unbind('keydown', this._doKeyDown).
      				unbind('keypress', this._doKeyPress).
      				unbind('keyup', this._doKeyUp);
      		} else if (nodeName == 'div' || nodeName == 'span')
      			$target.removeClass(this.markerClassName).empty();
      	},
      
      	/* Enable the date picker to a jQuery selection.
      	   @param  target    element - the target input field or division or span */
      	_enableDatepicker: function(target) {
      		var $target = $(target);
      		var inst = $.data(target, PROP_NAME);
      		if (!$target.hasClass(this.markerClassName)) {
      			return;
      		}
      		var nodeName = target.nodeName.toLowerCase();
      		if (nodeName == 'input') {
      			target.disabled = false;
      			inst.trigger.filter('button').
      				each(function() { this.disabled = false; }).end().
      				filter('img').css({opacity: '1.0', cursor: ''});
      		}
      		else if (nodeName == 'div' || nodeName == 'span') {
      			var inline = $target.children('.' + this._inlineClass);
      			inline.children().removeClass('ui-state-disabled');
      			inline.find("select.ui-datepicker-month, select.ui-datepicker-year").
      				prop("disabled", false);
      		}
      		this._disabledInputs = $.map(this._disabledInputs,
      			function(value) { return (value == target ? null : value); }); // delete entry
      	},
      
      	/* Disable the date picker to a jQuery selection.
      	   @param  target    element - the target input field or division or span */
      	_disableDatepicker: function(target) {
      		var $target = $(target);
      		var inst = $.data(target, PROP_NAME);
      		if (!$target.hasClass(this.markerClassName)) {
      			return;
      		}
      		var nodeName = target.nodeName.toLowerCase();
      		if (nodeName == 'input') {
      			target.disabled = true;
      			inst.trigger.filter('button').
      				each(function() { this.disabled = true; }).end().
      				filter('img').css({opacity: '0.5', cursor: 'default'});
      		}
      		else if (nodeName == 'div' || nodeName == 'span') {
      			var inline = $target.children('.' + this._inlineClass);
      			inline.children().addClass('ui-state-disabled');
      			inline.find("select.ui-datepicker-month, select.ui-datepicker-year").
      				prop("disabled", true);
      		}
      		this._disabledInputs = $.map(this._disabledInputs,
      			function(value) { return (value == target ? null : value); }); // delete entry
      		this._disabledInputs[this._disabledInputs.length] = target;
      	},
      
      	/* Is the first field in a jQuery collection disabled as a datepicker?
      	   @param  target    element - the target input field or division or span
      	   @return boolean - true if disabled, false if enabled */
      	_isDisabledDatepicker: function(target) {
      		if (!target) {
      			return false;
      		}
      		for (var i = 0; i < this._disabledInputs.length; i++) {
      			if (this._disabledInputs[i] == target)
      				return true;
      		}
      		return false;
      	},
      
      	/* Retrieve the instance data for the target control.
      	   @param  target  element - the target input field or division or span
      	   @return  object - the associated instance data
      	   @throws  error if a jQuery problem getting data */
      	_getInst: function(target) {
      		try {
      			return $.data(target, PROP_NAME);
      		}
      		catch (err) {
      			throw 'Missing instance data for this datepicker';
      		}
      	},
      
      	/* Update or retrieve the settings for a date picker attached to an input field or division.
      	   @param  target  element - the target input field or division or span
      	   @param  name    object - the new settings to update or
      	                   string - the name of the setting to change or retrieve,
      	                   when retrieving also 'all' for all instance settings or
      	                   'defaults' for all global defaults
      	   @param  value   any - the new value for the setting
      	                   (omit if above is an object or to retrieve a value) */
      	_optionDatepicker: function(target, name, value) {
      		var inst = this._getInst(target);
      		if (arguments.length == 2 && typeof name == 'string') {
      			return (name == 'defaults' ? $.extend({}, $.datepicker._defaults) :
      				(inst ? (name == 'all' ? $.extend({}, inst.settings) :
      				this._get(inst, name)) : null));
      		}
      		var settings = name || {};
      		if (typeof name == 'string') {
      			settings = {};
      			settings[name] = value;
      		}
      		if (inst) {
      			if (this._curInst == inst) {
      				this._hideDatepicker();
      			}
      			var date = this._getDateDatepicker(target, true);
      			var minDate = this._getMinMaxDate(inst, 'min');
      			var maxDate = this._getMinMaxDate(inst, 'max');
      			extendRemove(inst.settings, settings);
      			// reformat the old minDate/maxDate values if dateFormat changes and a new minDate/maxDate isn't provided
      			if (minDate !== null && settings['dateFormat'] !== undefined && settings['minDate'] === undefined)
      				inst.settings.minDate = this._formatDate(inst, minDate);
      			if (maxDate !== null && settings['dateFormat'] !== undefined && settings['maxDate'] === undefined)
      				inst.settings.maxDate = this._formatDate(inst, maxDate);
      			this._attachments($(target), inst);
      			this._autoSize(inst);
      			this._setDate(inst, date);
      			this._updateAlternate(inst);
      			this._updateDatepicker(inst);
      		}
      	},
      
      	// change method deprecated
      	_changeDatepicker: function(target, name, value) {
      		this._optionDatepicker(target, name, value);
      	},
      
      	/* Redraw the date picker attached to an input field or division.
      	   @param  target  element - the target input field or division or span */
      	_refreshDatepicker: function(target) {
      		var inst = this._getInst(target);
      		if (inst) {
      			this._updateDatepicker(inst);
      		}
      	},
      
      	/* Set the dates for a jQuery selection.
      	   @param  target   element - the target input field or division or span
      	   @param  date     Date - the new date */
      	_setDateDatepicker: function(target, date) {
      		var inst = this._getInst(target);
      		if (inst) {
      			this._setDate(inst, date);
      			this._updateDatepicker(inst);
      			this._updateAlternate(inst);
      		}
      	},
      
      	/* Get the date(s) for the first entry in a jQuery selection.
      	   @param  target     element - the target input field or division or span
      	   @param  noDefault  boolean - true if no default date is to be used
      	   @return Date - the current date */
      	_getDateDatepicker: function(target, noDefault) {
      		var inst = this._getInst(target);
      		if (inst && !inst.inline)
      			this._setDateFromField(inst, noDefault);
      		return (inst ? this._getDate(inst) : null);
      	},
      
      	/* Handle keystrokes. */
      	_doKeyDown: function(event) {
      		var inst = $.datepicker._getInst(event.target);
      		var handled = true;
      		var isRTL = inst.dpDiv.is('.ui-datepicker-rtl');
      		inst._keyEvent = true;
      		if ($.datepicker._datepickerShowing)
      			switch (event.keyCode) {
      				case 9: $.datepicker._hideDatepicker();
      						handled = false;
      						break; // hide on tab out
      				case 13: var sel = $('td.' + $.datepicker._dayOverClass + ':not(.' +
      									$.datepicker._currentClass + ')', inst.dpDiv);
      						if (sel[0])
      							$.datepicker._selectDay(event.target, inst.selectedMonth, inst.selectedYear, sel[0]);
      							var onSelect = $.datepicker._get(inst, 'onSelect');
      							if (onSelect) {
      								var dateStr = $.datepicker._formatDate(inst);
      
      								// trigger custom callback
      								onSelect.apply((inst.input ? inst.input[0] : null), [dateStr, inst]);
      							}
      						else
      							$.datepicker._hideDatepicker();
      						return false; // don't submit the form
      						break; // select the value on enter
      				case 27: $.datepicker._hideDatepicker();
      						break; // hide on escape
      				case 33: $.datepicker._adjustDate(event.target, (event.ctrlKey ?
      							-$.datepicker._get(inst, 'stepBigMonths') :
      							-$.datepicker._get(inst, 'stepMonths')), 'M');
      						break; // previous month/year on page up/+ ctrl
      				case 34: $.datepicker._adjustDate(event.target, (event.ctrlKey ?
      							+$.datepicker._get(inst, 'stepBigMonths') :
      							+$.datepicker._get(inst, 'stepMonths')), 'M');
      						break; // next month/year on page down/+ ctrl
      				case 35: if (event.ctrlKey || event.metaKey) $.datepicker._clearDate(event.target);
      						handled = event.ctrlKey || event.metaKey;
      						break; // clear on ctrl or command +end
      				case 36: if (event.ctrlKey || event.metaKey) $.datepicker._gotoToday(event.target);
      						handled = event.ctrlKey || event.metaKey;
      						break; // current on ctrl or command +home
      				case 37: if (event.ctrlKey || event.metaKey) $.datepicker._adjustDate(event.target, (isRTL ? +1 : -1), 'D');
      						handled = event.ctrlKey || event.metaKey;
      						// -1 day on ctrl or command +left
      						if (event.originalEvent.altKey) $.datepicker._adjustDate(event.target, (event.ctrlKey ?
      									-$.datepicker._get(inst, 'stepBigMonths') :
      									-$.datepicker._get(inst, 'stepMonths')), 'M');
      						// next month/year on alt +left on Mac
      						break;
      				case 38: if (event.ctrlKey || event.metaKey) $.datepicker._adjustDate(event.target, -7, 'D');
      						handled = event.ctrlKey || event.metaKey;
      						break; // -1 week on ctrl or command +up
      				case 39: if (event.ctrlKey || event.metaKey) $.datepicker._adjustDate(event.target, (isRTL ? -1 : +1), 'D');
      						handled = event.ctrlKey || event.metaKey;
      						// +1 day on ctrl or command +right
      						if (event.originalEvent.altKey) $.datepicker._adjustDate(event.target, (event.ctrlKey ?
      									+$.datepicker._get(inst, 'stepBigMonths') :
      									+$.datepicker._get(inst, 'stepMonths')), 'M');
      						// next month/year on alt +right
      						break;
      				case 40: if (event.ctrlKey || event.metaKey) $.datepicker._adjustDate(event.target, +7, 'D');
      						handled = event.ctrlKey || event.metaKey;
      						break; // +1 week on ctrl or command +down
      				default: handled = false;
      			}
      		else if (event.keyCode == 36 && event.ctrlKey) // display the date picker on ctrl+home
      			$.datepicker._showDatepicker(this);
      		else {
      			handled = false;
      		}
      		if (handled) {
      			event.preventDefault();
      			event.stopPropagation();
      		}
      	},
      
      	/* Filter entered characters - based on date format. */
      	_doKeyPress: function(event) {
      		var inst = $.datepicker._getInst(event.target);
      		if ($.datepicker._get(inst, 'constrainInput')) {
      			var chars = $.datepicker._possibleChars($.datepicker._get(inst, 'dateFormat'));
      			var chr = String.fromCharCode(event.charCode == undefined ? event.keyCode : event.charCode);
      			return event.ctrlKey || event.metaKey || (chr < ' ' || !chars || chars.indexOf(chr) > -1);
      		}
      	},
      
      	/* Synchronise manual entry and field/alternate field. */
      	_doKeyUp: function(event) {
      		var inst = $.datepicker._getInst(event.target);
      		if (inst.input.val() != inst.lastVal) {
      			try {
      				var date = $.datepicker.parseDate($.datepicker._get(inst, 'dateFormat'),
      					(inst.input ? inst.input.val() : null),
      					$.datepicker._getFormatConfig(inst));
      				if (date) { // only if valid
      					$.datepicker._setDateFromField(inst);
      					$.datepicker._updateAlternate(inst);
      					$.datepicker._updateDatepicker(inst);
      				}
      			}
      			catch (err) {
      				$.datepicker.log(err);
      			}
      		}
      		return true;
      	},
      
      	/* Pop-up the date picker for a given input field.
      	   If false returned from beforeShow event handler do not show.
      	   @param  input  element - the input field attached to the date picker or
      	                  event - if triggered by focus */
      	_showDatepicker: function(input) {
      		input = input.target || input;
      		if (input.nodeName.toLowerCase() != 'input') // find from button/image trigger
      			input = $('input', input.parentNode)[0];
      		if ($.datepicker._isDisabledDatepicker(input) || $.datepicker._lastInput == input) // already here
      			return;
      		var inst = $.datepicker._getInst(input);
      		if ($.datepicker._curInst && $.datepicker._curInst != inst) {
      			$.datepicker._curInst.dpDiv.stop(true, true);
      			if ( inst && $.datepicker._datepickerShowing ) {
      				$.datepicker._hideDatepicker( $.datepicker._curInst.input[0] );
      			}
      		}
      		var beforeShow = $.datepicker._get(inst, 'beforeShow');
      		var beforeShowSettings = beforeShow ? beforeShow.apply(input, [input, inst]) : {};
      		if(beforeShowSettings === false){
      			//false
      			return;
      		}
      		extendRemove(inst.settings, beforeShowSettings);
      		inst.lastVal = null;
      		$.datepicker._lastInput = input;
      		$.datepicker._setDateFromField(inst);
      		if ($.datepicker._inDialog) // hide cursor
      			input.value = '';
      		if (!$.datepicker._pos) { // position below input
      			$.datepicker._pos = $.datepicker._findPos(input);
      			$.datepicker._pos[1] += input.offsetHeight; // add the height
      		}
      		var isFixed = false;
      		$(input).parents().each(function() {
      			isFixed |= $(this).css('position') == 'fixed';
      			return !isFixed;
      		});
      		var offset = {left: $.datepicker._pos[0], top: $.datepicker._pos[1]};
      		$.datepicker._pos = null;
      		//to avoid flashes on Firefox
      		inst.dpDiv.empty();
      		// determine sizing offscreen
      		inst.dpDiv.css({position: 'absolute', display: 'block', top: '-1000px'});
      		$.datepicker._updateDatepicker(inst);
      		// fix width for dynamic number of date pickers
      		// and adjust position before showing
      		offset = $.datepicker._checkOffset(inst, offset, isFixed);
      		inst.dpDiv.css({position: ($.datepicker._inDialog && $.blockUI ?
      			'static' : (isFixed ? 'fixed' : 'absolute')), display: 'none',
      			left: offset.left + 'px', top: offset.top + 'px'});
      		if (!inst.inline) {
      			var showAnim = $.datepicker._get(inst, 'showAnim');
      			var duration = $.datepicker._get(inst, 'duration');
      			var postProcess = function() {
      				var cover = inst.dpDiv.find('iframe.ui-datepicker-cover'); // IE6- only
      				if( !! cover.length ){
      					var borders = $.datepicker._getBorders(inst.dpDiv);
      					cover.css({left: -borders[0], top: -borders[1],
      						width: inst.dpDiv.outerWidth(), height: inst.dpDiv.outerHeight()});
      				}
      			};
      			inst.dpDiv.zIndex($(input).zIndex()+1);
      			$.datepicker._datepickerShowing = true;
      
      			// DEPRECATED: after BC for 1.8.x $.effects[ showAnim ] is not needed
      			if ( $.effects && ( $.effects.effect[ showAnim ] || $.effects[ showAnim ] ) )
      				inst.dpDiv.show(showAnim, $.datepicker._get(inst, 'showOptions'), duration, postProcess);
      			else
      				inst.dpDiv[showAnim || 'show']((showAnim ? duration : null), postProcess);
      			if (!showAnim || !duration)
      				postProcess();
      			if (inst.input.is(':visible') && !inst.input.is(':disabled'))
      				inst.input.focus();
      			$.datepicker._curInst = inst;
      		}
      	},
      
      	/* Generate the date picker content. */
      	_updateDatepicker: function(inst) {
      		this.maxRows = 4; //Reset the max number of rows being displayed (see #7043)
      		var borders = $.datepicker._getBorders(inst.dpDiv);
      		instActive = inst; // for delegate hover events
      		inst.dpDiv.empty().append(this._generateHTML(inst));
      		this._attachHandlers(inst);
      		var cover = inst.dpDiv.find('iframe.ui-datepicker-cover'); // IE6- only
      		if( !!cover.length ){ //avoid call to outerXXXX() when not in IE6
      			cover.css({left: -borders[0], top: -borders[1], width: inst.dpDiv.outerWidth(), height: inst.dpDiv.outerHeight()})
      		}
      		inst.dpDiv.find('.' + this._dayOverClass + ' a').mouseover();
      		var numMonths = this._getNumberOfMonths(inst);
      		var cols = numMonths[1];
      		var width = 17;
      		inst.dpDiv.removeClass('ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4').width('');
      		if (cols > 1)
      			inst.dpDiv.addClass('ui-datepicker-multi-' + cols).css('width', (width * cols) + 'em');
      		inst.dpDiv[(numMonths[0] != 1 || numMonths[1] != 1 ? 'add' : 'remove') +
      			'Class']('ui-datepicker-multi');
      		inst.dpDiv[(this._get(inst, 'isRTL') ? 'add' : 'remove') +
      			'Class']('ui-datepicker-rtl');
      		if (inst == $.datepicker._curInst && $.datepicker._datepickerShowing && inst.input &&
      				// #6694 - don't focus the input if it's already focused
      				// this breaks the change event in IE
      				inst.input.is(':visible') && !inst.input.is(':disabled') && inst.input[0] != document.activeElement)
      			inst.input.focus();
      		// deffered render of the years select (to avoid flashes on Firefox)
      		if( inst.yearshtml ){
      			var origyearshtml = inst.yearshtml;
      			setTimeout(function(){
      				//assure that inst.yearshtml didn't change.
      				if( origyearshtml === inst.yearshtml && inst.yearshtml ){
      					inst.dpDiv.find('select.ui-datepicker-year:first').replaceWith(inst.yearshtml);
      				}
      				origyearshtml = inst.yearshtml = null;
      			}, 0);
      		}
      	},
      
      	/* Retrieve the size of left and top borders for an element.
      	   @param  elem  (jQuery object) the element of interest
      	   @return  (number[2]) the left and top borders */
      	_getBorders: function(elem) {
      		var convert = function(value) {
      			return {thin: 1, medium: 2, thick: 3}[value] || value;
      		};
      		return [parseFloat(convert(elem.css('border-left-width'))),
      			parseFloat(convert(elem.css('border-top-width')))];
      	},
      
      	/* Check positioning to remain on screen. */
      	_checkOffset: function(inst, offset, isFixed) {
      		var dpWidth = inst.dpDiv.outerWidth();
      		var dpHeight = inst.dpDiv.outerHeight();
      		var inputWidth = inst.input ? inst.input.outerWidth() : 0;
      		var inputHeight = inst.input ? inst.input.outerHeight() : 0;
      		var viewWidth = document.documentElement.clientWidth + (isFixed ? 0 : $(document).scrollLeft());
      		var viewHeight = document.documentElement.clientHeight + (isFixed ? 0 : $(document).scrollTop());
      
      		offset.left -= (this._get(inst, 'isRTL') ? (dpWidth - inputWidth) : 0);
      		offset.left -= (isFixed && offset.left == inst.input.offset().left) ? $(document).scrollLeft() : 0;
      		offset.top -= (isFixed && offset.top == (inst.input.offset().top + inputHeight)) ? $(document).scrollTop() : 0;
      
      		// now check if datepicker is showing outside window viewport - move to a better place if so.
      		offset.left -= Math.min(offset.left, (offset.left + dpWidth > viewWidth && viewWidth > dpWidth) ?
      			Math.abs(offset.left + dpWidth - viewWidth) : 0);
      		offset.top -= Math.min(offset.top, (offset.top + dpHeight > viewHeight && viewHeight > dpHeight) ?
      			Math.abs(dpHeight + inputHeight) : 0);
      
      		return offset;
      	},
      
      	/* Find an object's position on the screen. */
      	_findPos: function(obj) {
      		var inst = this._getInst(obj);
      		var isRTL = this._get(inst, 'isRTL');
      		while (obj && (obj.type == 'hidden' || obj.nodeType != 1 || $.expr.filters.hidden(obj))) {
      			obj = obj[isRTL ? 'previousSibling' : 'nextSibling'];
      		}
      		var position = $(obj).offset();
      		return [position.left, position.top];
      	},
      
      	/* Hide the date picker from view.
      	   @param  input  element - the input field attached to the date picker */
      	_hideDatepicker: function(input) {
      		var inst = this._curInst;
      		if (!inst || (input && inst != $.data(input, PROP_NAME)))
      			return;
      		if (this._datepickerShowing) {
      			var showAnim = this._get(inst, 'showAnim');
      			var duration = this._get(inst, 'duration');
      			var postProcess = function() {
      				$.datepicker._tidyDialog(inst);
      			};
      
      			// DEPRECATED: after BC for 1.8.x $.effects[ showAnim ] is not needed
      			if ( $.effects && ( $.effects.effect[ showAnim ] || $.effects[ showAnim ] ) )
      				inst.dpDiv.hide(showAnim, $.datepicker._get(inst, 'showOptions'), duration, postProcess);
      			else
      				inst.dpDiv[(showAnim == 'slideDown' ? 'slideUp' :
      					(showAnim == 'fadeIn' ? 'fadeOut' : 'hide'))]((showAnim ? duration : null), postProcess);
      			if (!showAnim)
      				postProcess();
      			this._datepickerShowing = false;
      			var onClose = this._get(inst, 'onClose');
      			if (onClose)
      				onClose.apply((inst.input ? inst.input[0] : null),
      					[(inst.input ? inst.input.val() : ''), inst]);
      			this._lastInput = null;
      			if (this._inDialog) {
      				this._dialogInput.css({ position: 'absolute', left: '0', top: '-100px' });
      				if ($.blockUI) {
      					$.unblockUI();
      					$('body').append(this.dpDiv);
      				}
      			}
      			this._inDialog = false;
      		}
      	},
      
      	/* Tidy up after a dialog display. */
      	_tidyDialog: function(inst) {
      		inst.dpDiv.removeClass(this._dialogClass).unbind('.ui-datepicker-calendar');
      	},
      
      	/* Close date picker if clicked elsewhere. */
      	_checkExternalClick: function(event) {
      		if (!$.datepicker._curInst)
      			return;
      
      		var $target = $(event.target),
      			inst = $.datepicker._getInst($target[0]);
      
      		if ( ( ( $target[0].id != $.datepicker._mainDivId &&
      				$target.parents('#' + $.datepicker._mainDivId).length == 0 &&
      				!$target.hasClass($.datepicker.markerClassName) &&
      				!$target.closest("." + $.datepicker._triggerClass).length &&
      				$.datepicker._datepickerShowing && !($.datepicker._inDialog && $.blockUI) ) ) ||
      			( $target.hasClass($.datepicker.markerClassName) && $.datepicker._curInst != inst ) )
      			$.datepicker._hideDatepicker();
      	},
      
      	/* Adjust one of the date sub-fields. */
      	_adjustDate: function(id, offset, period) {
      		var target = $(id);
      		var inst = this._getInst(target[0]);
      		if (this._isDisabledDatepicker(target[0])) {
      			return;
      		}
      		this._adjustInstDate(inst, offset +
      			(period == 'M' ? this._get(inst, 'showCurrentAtPos') : 0), // undo positioning
      			period);
      		this._updateDatepicker(inst);
      	},
      
      	/* Action for current link. */
      	_gotoToday: function(id) {
      		var target = $(id);
      		var inst = this._getInst(target[0]);
      		if (this._get(inst, 'gotoCurrent') && inst.currentDay) {
      			inst.selectedDay = inst.currentDay;
      			inst.drawMonth = inst.selectedMonth = inst.currentMonth;
      			inst.drawYear = inst.selectedYear = inst.currentYear;
      		}
      		else {
      			var date = new Date();
      			inst.selectedDay = date.getDate();
      			inst.drawMonth = inst.selectedMonth = date.getMonth();
      			inst.drawYear = inst.selectedYear = date.getFullYear();
      		}
      		this._notifyChange(inst);
      		this._adjustDate(target);
      	},
      
      	/* Action for selecting a new month/year. */
      	_selectMonthYear: function(id, select, period) {
      		var target = $(id);
      		var inst = this._getInst(target[0]);
      		inst['selected' + (period == 'M' ? 'Month' : 'Year')] =
      		inst['draw' + (period == 'M' ? 'Month' : 'Year')] =
      			parseInt(select.options[select.selectedIndex].value,10);
      		this._notifyChange(inst);
      		this._adjustDate(target);
      	},
      
      	/* Action for selecting a day. */
      	_selectDay: function(id, month, year, td) {
      		var target = $(id);
      		if ($(td).hasClass(this._unselectableClass) || this._isDisabledDatepicker(target[0])) {
      			return;
      		}
      		var inst = this._getInst(target[0]);
      		inst.selectedDay = inst.currentDay = $('a', td).html();
      		inst.selectedMonth = inst.currentMonth = month;
      		inst.selectedYear = inst.currentYear = year;
      		this._selectDate(id, this._formatDate(inst,
      			inst.currentDay, inst.currentMonth, inst.currentYear));
      	},
      
      	/* Erase the input field and hide the date picker. */
      	_clearDate: function(id) {
      		var target = $(id);
      		var inst = this._getInst(target[0]);
      		this._selectDate(target, '');
      	},
      
      	/* Update the input field with the selected date. */
      	_selectDate: function(id, dateStr) {
      		var target = $(id);
      		var inst = this._getInst(target[0]);
      		dateStr = (dateStr != null ? dateStr : this._formatDate(inst));
      		if (inst.input)
      			inst.input.val(dateStr);
      		this._updateAlternate(inst);
      		var onSelect = this._get(inst, 'onSelect');
      		if (onSelect)
      			onSelect.apply((inst.input ? inst.input[0] : null), [dateStr, inst]);  // trigger custom callback
      		else if (inst.input)
      			inst.input.trigger('change'); // fire the change event
      		if (inst.inline)
      			this._updateDatepicker(inst);
      		else {
      			this._hideDatepicker();
      			this._lastInput = inst.input[0];
      			if (typeof(inst.input[0]) != 'object')
      				inst.input.focus(); // restore focus
      			this._lastInput = null;
      		}
      	},
      
      	/* Update any alternate field to synchronise with the main field. */
      	_updateAlternate: function(inst) {
      		var altField = this._get(inst, 'altField');
      		if (altField) { // update alternate field too
      			var altFormat = this._get(inst, 'altFormat') || this._get(inst, 'dateFormat');
      			var date = this._getDate(inst);
      			var dateStr = this.formatDate(altFormat, date, this._getFormatConfig(inst));
      			$(altField).each(function() { $(this).val(dateStr); });
      		}
      	},
      
      	/* Set as beforeShowDay function to prevent selection of weekends.
      	   @param  date  Date - the date to customise
      	   @return [boolean, string] - is this date selectable?, what is its CSS class? */
      	noWeekends: function(date) {
      		var day = date.getDay();
      		return [(day > 0 && day < 6), ''];
      	},
      
      	/* Set as calculateWeek to determine the week of the year based on the ISO 8601 definition.
      	   @param  date  Date - the date to get the week for
      	   @return  number - the number of the week within the year that contains this date */
      	iso8601Week: function(date) {
      		var checkDate = new Date(date.getTime());
      		// Find Thursday of this week starting on Monday
      		checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));
      		var time = checkDate.getTime();
      		checkDate.setMonth(0); // Compare with Jan 1
      		checkDate.setDate(1);
      		return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
      	},
      
      	/* Parse a string value into a date object.
      	   See formatDate below for the possible formats.
      
      	   @param  format    string - the expected format of the date
      	   @param  value     string - the date in the above format
      	   @param  settings  Object - attributes include:
      	                     shortYearCutoff  number - the cutoff year for determining the century (optional)
      	                     dayNamesShort    string[7] - abbreviated names of the days from Sunday (optional)
      	                     dayNames         string[7] - names of the days from Sunday (optional)
      	                     monthNamesShort  string[12] - abbreviated names of the months (optional)
      	                     monthNames       string[12] - names of the months (optional)
      	   @return  Date - the extracted date value or null if value is blank */
      	parseDate: function (format, value, settings) {
      		if (format == null || value == null)
      			throw 'Invalid arguments';
      		value = (typeof value == 'object' ? value.toString() : value + '');
      		if (value == '')
      			return null;
      		var shortYearCutoff = (settings ? settings.shortYearCutoff : null) || this._defaults.shortYearCutoff;
      		shortYearCutoff = (typeof shortYearCutoff != 'string' ? shortYearCutoff :
      				new Date().getFullYear() % 100 + parseInt(shortYearCutoff, 10));
      		var dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort;
      		var dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames;
      		var monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort;
      		var monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames;
      		var year = -1;
      		var month = -1;
      		var day = -1;
      		var doy = -1;
      		var literal = false;
      		// Check whether a format character is doubled
      		var lookAhead = function(match) {
      			var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) == match);
      			if (matches)
      				iFormat++;
      			return matches;
      		};
      		// Extract a number from the string value
      		var getNumber = function(match) {
      			var isDoubled = lookAhead(match);
      			var size = (match == '@' ? 14 : (match == '!' ? 20 :
      				(match == 'y' && isDoubled ? 4 : (match == 'o' ? 3 : 2))));
      			var digits = new RegExp('^\\d{1,' + size + '}');
      			var num = value.substring(iValue).match(digits);
      			if (!num)
      				throw 'Missing number at position ' + iValue;
      			iValue += num[0].length;
      			return parseInt(num[0], 10);
      		};
      		// Extract a name from the string value and convert to an index
      		var getName = function(match, shortNames, longNames) {
      			var names = $.map(lookAhead(match) ? longNames : shortNames, function (v, k) {
      				return [ [k, v] ];
      			}).sort(function (a, b) {
      				return -(a[1].length - b[1].length);
      			});
      			var index = -1;
      			$.each(names, function (i, pair) {
      				var name = pair[1];
      				if (value.substr(iValue, name.length).toLowerCase() == name.toLowerCase()) {
      					index = pair[0];
      					iValue += name.length;
      					return false;
      				}
      			});
      			if (index != -1)
      				return index + 1;
      			else
      				throw 'Unknown name at position ' + iValue;
      		};
      		// Confirm that a literal character matches the string value
      		var checkLiteral = function() {
      			if (value.charAt(iValue) != format.charAt(iFormat))
      				throw 'Unexpected literal at position ' + iValue;
      			iValue++;
      		};
      		var iValue = 0;
      		for (var iFormat = 0; iFormat < format.length; iFormat++) {
      			if (literal)
      				if (format.charAt(iFormat) == "'" && !lookAhead("'"))
      					literal = false;
      				else
      					checkLiteral();
      			else
      				switch (format.charAt(iFormat)) {
      					case 'd':
      						day = getNumber('d');
      						break;
      					case 'D':
      						getName('D', dayNamesShort, dayNames);
      						break;
      					case 'o':
      						doy = getNumber('o');
      						break;
      					case 'm':
      						month = getNumber('m');
      						break;
      					case 'M':
      						month = getName('M', monthNamesShort, monthNames);
      						break;
      					case 'y':
      						year = getNumber('y');
      						break;
      					case '@':
      						var date = new Date(getNumber('@'));
      						year = date.getFullYear();
      						month = date.getMonth() + 1;
      						day = date.getDate();
      						break;
      					case '!':
      						var date = new Date((getNumber('!') - this._ticksTo1970) / 10000);
      						year = date.getFullYear();
      						month = date.getMonth() + 1;
      						day = date.getDate();
      						break;
      					case "'":
      						if (lookAhead("'"))
      							checkLiteral();
      						else
      							literal = true;
      						break;
      					default:
      						checkLiteral();
      				}
      		}
      		if (iValue < value.length){
      			var extra = value.substr(iValue);
      			if (!/^\s+/.test(extra)) {
      				throw "Extra/unparsed characters found in date: " + extra;
      			}
      		}
      		if (year == -1)
      			year = new Date().getFullYear();
      		else if (year < 100)
      			year += new Date().getFullYear() - new Date().getFullYear() % 100 +
      				(year <= shortYearCutoff ? 0 : -100);
      		if (doy > -1) {
      			month = 1;
      			day = doy;
      			do {
      				var dim = this._getDaysInMonth(year, month - 1);
      				if (day <= dim)
      					break;
      				month++;
      				day -= dim;
      			} while (true);
      		}
      		var date = this._daylightSavingAdjust(new Date(year, month - 1, day));
      		if (date.getFullYear() != year || date.getMonth() + 1 != month || date.getDate() != day)
      			throw 'Invalid date'; // E.g. 31/02/00
      		return date;
      	},
      
      	/* Standard date formats. */
      	ATOM: 'yy-mm-dd', // RFC 3339 (ISO 8601)
      	COOKIE: 'D, dd M yy',
      	ISO_8601: 'yy-mm-dd',
      	RFC_822: 'D, d M y',
      	RFC_850: 'DD, dd-M-y',
      	RFC_1036: 'D, d M y',
      	RFC_1123: 'D, d M yy',
      	RFC_2822: 'D, d M yy',
      	RSS: 'D, d M y', // RFC 822
      	TICKS: '!',
      	TIMESTAMP: '@',
      	W3C: 'yy-mm-dd', // ISO 8601
      
      	_ticksTo1970: (((1970 - 1) * 365 + Math.floor(1970 / 4) - Math.floor(1970 / 100) +
      		Math.floor(1970 / 400)) * 24 * 60 * 60 * 10000000),
      
      	/* Format a date object into a string value.
      	   The format can be combinations of the following:
      	   d  - day of month (no leading zero)
      	   dd - day of month (two digit)
      	   o  - day of year (no leading zeros)
      	   oo - day of year (three digit)
      	   D  - day name short
      	   DD - day name long
      	   m  - month of year (no leading zero)
      	   mm - month of year (two digit)
      	   M  - month name short
      	   MM - month name long
      	   y  - year (two digit)
      	   yy - year (four digit)
      	   @ - Unix timestamp (ms since 01/01/1970)
      	   ! - Windows ticks (100ns since 01/01/0001)
      	   '...' - literal text
      	   '' - single quote
      
      	   @param  format    string - the desired format of the date
      	   @param  date      Date - the date value to format
      	   @param  settings  Object - attributes include:
      	                     dayNamesShort    string[7] - abbreviated names of the days from Sunday (optional)
      	                     dayNames         string[7] - names of the days from Sunday (optional)
      	                     monthNamesShort  string[12] - abbreviated names of the months (optional)
      	                     monthNames       string[12] - names of the months (optional)
      	   @return  string - the date in the above format */
      	formatDate: function (format, date, settings) {
      		if (!date)
      			return '';
      		var dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort;
      		var dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames;
      		var monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort;
      		var monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames;
      		// Check whether a format character is doubled
      		var lookAhead = function(match) {
      			var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) == match);
      			if (matches)
      				iFormat++;
      			return matches;
      		};
      		// Format a number, with leading zero if necessary
      		var formatNumber = function(match, value, len) {
      			var num = '' + value;
      			if (lookAhead(match))
      				while (num.length < len)
      					num = '0' + num;
      			return num;
      		};
      		// Format a name, short or long as requested
      		var formatName = function(match, value, shortNames, longNames) {
      			return (lookAhead(match) ? longNames[value] : shortNames[value]);
      		};
      		var output = '';
      		var literal = false;
      		if (date)
      			for (var iFormat = 0; iFormat < format.length; iFormat++) {
      				if (literal)
      					if (format.charAt(iFormat) == "'" && !lookAhead("'"))
      						literal = false;
      					else
      						output += format.charAt(iFormat);
      				else
      					switch (format.charAt(iFormat)) {
      						case 'd':
      							output += formatNumber('d', date.getDate(), 2);
      							break;
      						case 'D':
      							output += formatName('D', date.getDay(), dayNamesShort, dayNames);
      							break;
      						case 'o':
      							output += formatNumber('o',
      								Math.round((new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000), 3);
      							break;
      						case 'm':
      							output += formatNumber('m', date.getMonth() + 1, 2);
      							break;
      						case 'M':
      							output += formatName('M', date.getMonth(), monthNamesShort, monthNames);
      							break;
      						case 'y':
      							output += (lookAhead('y') ? date.getFullYear() :
      								(date.getYear() % 100 < 10 ? '0' : '') + date.getYear() % 100);
      							break;
      						case '@':
      							output += date.getTime();
      							break;
      						case '!':
      							output += date.getTime() * 10000 + this._ticksTo1970;
      							break;
      						case "'":
      							if (lookAhead("'"))
      								output += "'";
      							else
      								literal = true;
      							break;
      						default:
      							output += format.charAt(iFormat);
      					}
      			}
      		return output;
      	},
      
      	/* Extract all possible characters from the date format. */
      	_possibleChars: function (format) {
      		var chars = '';
      		var literal = false;
      		// Check whether a format character is doubled
      		var lookAhead = function(match) {
      			var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) == match);
      			if (matches)
      				iFormat++;
      			return matches;
      		};
      		for (var iFormat = 0; iFormat < format.length; iFormat++)
      			if (literal)
      				if (format.charAt(iFormat) == "'" && !lookAhead("'"))
      					literal = false;
      				else
      					chars += format.charAt(iFormat);
      			else
      				switch (format.charAt(iFormat)) {
      					case 'd': case 'm': case 'y': case '@':
      						chars += '0123456789';
      						break;
      					case 'D': case 'M':
      						return null; // Accept anything
      					case "'":
      						if (lookAhead("'"))
      							chars += "'";
      						else
      							literal = true;
      						break;
      					default:
      						chars += format.charAt(iFormat);
      				}
      		return chars;
      	},
      
      	/* Get a setting value, defaulting if necessary. */
      	_get: function(inst, name) {
      		return inst.settings[name] !== undefined ?
      			inst.settings[name] : this._defaults[name];
      	},
      
      	/* Parse existing date and initialise date picker. */
      	_setDateFromField: function(inst, noDefault) {
      		if (inst.input.val() == inst.lastVal) {
      			return;
      		}
      		var dateFormat = this._get(inst, 'dateFormat');
      		var dates = inst.lastVal = inst.input ? inst.input.val() : null;
      		var date, defaultDate;
      		date = defaultDate = this._getDefaultDate(inst);
      		var settings = this._getFormatConfig(inst);
      		try {
      			date = this.parseDate(dateFormat, dates, settings) || defaultDate;
      		} catch (event) {
      			this.log(event);
      			dates = (noDefault ? '' : dates);
      		}
      		inst.selectedDay = date.getDate();
      		inst.drawMonth = inst.selectedMonth = date.getMonth();
      		inst.drawYear = inst.selectedYear = date.getFullYear();
      		inst.currentDay = (dates ? date.getDate() : 0);
      		inst.currentMonth = (dates ? date.getMonth() : 0);
      		inst.currentYear = (dates ? date.getFullYear() : 0);
      		this._adjustInstDate(inst);
      	},
      
      	/* Retrieve the default date shown on opening. */
      	_getDefaultDate: function(inst) {
      		return this._restrictMinMax(inst,
      			this._determineDate(inst, this._get(inst, 'defaultDate'), new Date()));
      	},
      
      	/* A date may be specified as an exact value or a relative one. */
      	_determineDate: function(inst, date, defaultDate) {
      		var offsetNumeric = function(offset) {
      			var date = new Date();
      			date.setDate(date.getDate() + offset);
      			return date;
      		};
      		var offsetString = function(offset) {
      			try {
      				return $.datepicker.parseDate($.datepicker._get(inst, 'dateFormat'),
      					offset, $.datepicker._getFormatConfig(inst));
      			}
      			catch (e) {
      				// Ignore
      			}
      			var date = (offset.toLowerCase().match(/^c/) ?
      				$.datepicker._getDate(inst) : null) || new Date();
      			var year = date.getFullYear();
      			var month = date.getMonth();
      			var day = date.getDate();
      			var pattern = /([+-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g;
      			var matches = pattern.exec(offset);
      			while (matches) {
      				switch (matches[2] || 'd') {
      					case 'd' : case 'D' :
      						day += parseInt(matches[1],10); break;
      					case 'w' : case 'W' :
      						day += parseInt(matches[1],10) * 7; break;
      					case 'm' : case 'M' :
      						month += parseInt(matches[1],10);
      						day = Math.min(day, $.datepicker._getDaysInMonth(year, month));
      						break;
      					case 'y': case 'Y' :
      						year += parseInt(matches[1],10);
      						day = Math.min(day, $.datepicker._getDaysInMonth(year, month));
      						break;
      				}
      				matches = pattern.exec(offset);
      			}
      			return new Date(year, month, day);
      		};
      		var newDate = (date == null || date === '' ? defaultDate : (typeof date == 'string' ? offsetString(date) :
      			(typeof date == 'number' ? (isNaN(date) ? defaultDate : offsetNumeric(date)) : new Date(date.getTime()))));
      		newDate = (newDate && newDate.toString() == 'Invalid Date' ? defaultDate : newDate);
      		if (newDate) {
      			newDate.setHours(0);
      			newDate.setMinutes(0);
      			newDate.setSeconds(0);
      			newDate.setMilliseconds(0);
      		}
      		return this._daylightSavingAdjust(newDate);
      	},
      
      	/* Handle switch to/from daylight saving.
      	   Hours may be non-zero on daylight saving cut-over:
      	   > 12 when midnight changeover, but then cannot generate
      	   midnight datetime, so jump to 1AM, otherwise reset.
      	   @param  date  (Date) the date to check
      	   @return  (Date) the corrected date */
      	_daylightSavingAdjust: function(date) {
      		if (!date) return null;
      		date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);
      		return date;
      	},
      
      	/* Set the date(s) directly. */
      	_setDate: function(inst, date, noChange) {
      		var clear = !date;
      		var origMonth = inst.selectedMonth;
      		var origYear = inst.selectedYear;
      		var newDate = this._restrictMinMax(inst, this._determineDate(inst, date, new Date()));
      		inst.selectedDay = inst.currentDay = newDate.getDate();
      		inst.drawMonth = inst.selectedMonth = inst.currentMonth = newDate.getMonth();
      		inst.drawYear = inst.selectedYear = inst.currentYear = newDate.getFullYear();
      		if ((origMonth != inst.selectedMonth || origYear != inst.selectedYear) && !noChange)
      			this._notifyChange(inst);
      		this._adjustInstDate(inst);
      		if (inst.input) {
      			inst.input.val(clear ? '' : this._formatDate(inst));
      		}
      	},
      
      	/* Retrieve the date(s) directly. */
      	_getDate: function(inst) {
      		var startDate = (!inst.currentYear || (inst.input && inst.input.val() == '') ? null :
      			this._daylightSavingAdjust(new Date(
      			inst.currentYear, inst.currentMonth, inst.currentDay)));
      			return startDate;
      	},
      
      	/* Attach the onxxx handlers.  These are declared statically so
      	 * they work with static code transformers like Caja.
      	 */
      	_attachHandlers: function(inst) {
      		var stepMonths = this._get(inst, 'stepMonths');
      		var id = '#' + inst.id.replace( /\\\\/g, "\\" );
      		inst.dpDiv.find('[data-handler]').map(function () {
      			var handler = {
      				prev: function () {
      					window['DP_jQuery_' + dpuuid].datepicker._adjustDate(id, -stepMonths, 'M');
      				},
      				next: function () {
      					window['DP_jQuery_' + dpuuid].datepicker._adjustDate(id, +stepMonths, 'M');
      				},
      				hide: function () {
      					window['DP_jQuery_' + dpuuid].datepicker._hideDatepicker();
      				},
      				today: function () {
      					window['DP_jQuery_' + dpuuid].datepicker._gotoToday(id);
      				},
      				selectDay: function () {
      					window['DP_jQuery_' + dpuuid].datepicker._selectDay(id, +this.getAttribute('data-month'), +this.getAttribute('data-year'), this);
      					return false;
      				},
      				selectMonth: function () {
      					window['DP_jQuery_' + dpuuid].datepicker._selectMonthYear(id, this, 'M');
      					return false;
      				},
      				selectYear: function () {
      					window['DP_jQuery_' + dpuuid].datepicker._selectMonthYear(id, this, 'Y');
      					return false;
      				}
      			};
      			$(this).bind(this.getAttribute('data-event'), handler[this.getAttribute('data-handler')]);
      		});
      	},
      
      	/* Generate the HTML for the current state of the date picker. */
      	_generateHTML: function(inst) {
      		var today = new Date();
      		today = this._daylightSavingAdjust(
      			new Date(today.getFullYear(), today.getMonth(), today.getDate())); // clear time
      		var isRTL = this._get(inst, 'isRTL');
      		var showButtonPanel = this._get(inst, 'showButtonPanel');
      		var hideIfNoPrevNext = this._get(inst, 'hideIfNoPrevNext');
      		var navigationAsDateFormat = this._get(inst, 'navigationAsDateFormat');
      		var numMonths = this._getNumberOfMonths(inst);
      		var showCurrentAtPos = this._get(inst, 'showCurrentAtPos');
      		var stepMonths = this._get(inst, 'stepMonths');
      		var isMultiMonth = (numMonths[0] != 1 || numMonths[1] != 1);
      		var currentDate = this._daylightSavingAdjust((!inst.currentDay ? new Date(9999, 9, 9) :
      			new Date(inst.currentYear, inst.currentMonth, inst.currentDay)));
      		var minDate = this._getMinMaxDate(inst, 'min');
      		var maxDate = this._getMinMaxDate(inst, 'max');
      		var drawMonth = inst.drawMonth - showCurrentAtPos;
      		var drawYear = inst.drawYear;
      		if (drawMonth < 0) {
      			drawMonth += 12;
      			drawYear--;
      		}
      		if (maxDate) {
      			var maxDraw = this._daylightSavingAdjust(new Date(maxDate.getFullYear(),
      				maxDate.getMonth() - (numMonths[0] * numMonths[1]) + 1, maxDate.getDate()));
      			maxDraw = (minDate && maxDraw < minDate ? minDate : maxDraw);
      			while (this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1)) > maxDraw) {
      				drawMonth--;
      				if (drawMonth < 0) {
      					drawMonth = 11;
      					drawYear--;
      				}
      			}
      		}
      		inst.drawMonth = drawMonth;
      		inst.drawYear = drawYear;
      		var prevText = this._get(inst, 'prevText');
      		prevText = (!navigationAsDateFormat ? prevText : this.formatDate(prevText,
      			this._daylightSavingAdjust(new Date(drawYear, drawMonth - stepMonths, 1)),
      			this._getFormatConfig(inst)));
      		var prev = (this._canAdjustMonth(inst, -1, drawYear, drawMonth) ?
      			'<a class="ui-datepicker-prev ui-corner-all" data-handler="prev" data-event="click"' +
      			' title="' + prevText + '"><span class="ui-icon ui-icon-circle-triangle-' + ( isRTL ? 'e' : 'w') + '">' + prevText + '</span></a>' :
      			(hideIfNoPrevNext ? '' : '<a class="ui-datepicker-prev ui-corner-all ui-state-disabled" title="'+ prevText +'"><span class="ui-icon ui-icon-circle-triangle-' + ( isRTL ? 'e' : 'w') + '">' + prevText + '</span></a>'));
      		var nextText = this._get(inst, 'nextText');
      		nextText = (!navigationAsDateFormat ? nextText : this.formatDate(nextText,
      			this._daylightSavingAdjust(new Date(drawYear, drawMonth + stepMonths, 1)),
      			this._getFormatConfig(inst)));
      		var next = (this._canAdjustMonth(inst, +1, drawYear, drawMonth) ?
      			'<a class="ui-datepicker-next ui-corner-all" data-handler="next" data-event="click"' +
      			' title="' + nextText + '"><span class="ui-icon ui-icon-circle-triangle-' + ( isRTL ? 'w' : 'e') + '">' + nextText + '</span></a>' :
      			(hideIfNoPrevNext ? '' : '<a class="ui-datepicker-next ui-corner-all ui-state-disabled" title="'+ nextText + '"><span class="ui-icon ui-icon-circle-triangle-' + ( isRTL ? 'w' : 'e') + '">' + nextText + '</span></a>'));
      		var currentText = this._get(inst, 'currentText');
      		var gotoDate = (this._get(inst, 'gotoCurrent') && inst.currentDay ? currentDate : today);
      		currentText = (!navigationAsDateFormat ? currentText :
      			this.formatDate(currentText, gotoDate, this._getFormatConfig(inst)));
      		var controls = (!inst.inline ? '<button type="button" class="ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all" data-handler="hide" data-event="click">' +
      			this._get(inst, 'closeText') + '</button>' : '');
      		var buttonPanel = (showButtonPanel) ? '<div class="ui-datepicker-buttonpane ui-widget-content">' + (isRTL ? controls : '') +
      			(this._isInRange(inst, gotoDate) ? '<button type="button" class="ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all" data-handler="today" data-event="click"' +
      			'>' + currentText + '</button>' : '') + (isRTL ? '' : controls) + '</div>' : '';
      		var firstDay = parseInt(this._get(inst, 'firstDay'),10);
      		firstDay = (isNaN(firstDay) ? 0 : firstDay);
      		var showWeek = this._get(inst, 'showWeek');
      		var dayNames = this._get(inst, 'dayNames');
      		var dayNamesShort = this._get(inst, 'dayNamesShort');
      		var dayNamesMin = this._get(inst, 'dayNamesMin');
      		var monthNames = this._get(inst, 'monthNames');
      		var monthNamesShort = this._get(inst, 'monthNamesShort');
      		var beforeShowDay = this._get(inst, 'beforeShowDay');
      		var showOtherMonths = this._get(inst, 'showOtherMonths');
      		var selectOtherMonths = this._get(inst, 'selectOtherMonths');
      		var calculateWeek = this._get(inst, 'calculateWeek') || this.iso8601Week;
      		var defaultDate = this._getDefaultDate(inst);
      		var html = '';
      		for (var row = 0; row < numMonths[0]; row++) {
      			var group = '';
      			this.maxRows = 4;
      			for (var col = 0; col < numMonths[1]; col++) {
      				var selectedDate = this._daylightSavingAdjust(new Date(drawYear, drawMonth, inst.selectedDay));
      				var cornerClass = ' ui-corner-all';
      				var calender = '';
      				if (isMultiMonth) {
      					calender += '<div class="ui-datepicker-group';
      					if (numMonths[1] > 1)
      						switch (col) {
      							case 0: calender += ' ui-datepicker-group-first';
      								cornerClass = ' ui-corner-' + (isRTL ? 'right' : 'left'); break;
      							case numMonths[1]-1: calender += ' ui-datepicker-group-last';
      								cornerClass = ' ui-corner-' + (isRTL ? 'left' : 'right'); break;
      							default: calender += ' ui-datepicker-group-middle'; cornerClass = ''; break;
      						}
      					calender += '">';
      				}
      				calender += '<div class="ui-datepicker-header ui-widget-header ui-helper-clearfix' + cornerClass + '">' +
      					(/all|left/.test(cornerClass) && row == 0 ? (isRTL ? next : prev) : '') +
      					(/all|right/.test(cornerClass) && row == 0 ? (isRTL ? prev : next) : '') +
      					this._generateMonthYearHeader(inst, drawMonth, drawYear, minDate, maxDate,
      					row > 0 || col > 0, monthNames, monthNamesShort) + // draw month headers
      					'</div><table class="ui-datepicker-calendar"><thead>' +
      					'<tr>';
      				var thead = (showWeek ? '<th class="ui-datepicker-week-col">' + this._get(inst, 'weekHeader') + '</th>' : '');
      				for (var dow = 0; dow < 7; dow++) { // days of the week
      					var day = (dow + firstDay) % 7;
      					thead += '<th' + ((dow + firstDay + 6) % 7 >= 5 ? ' class="ui-datepicker-week-end"' : '') + '>' +
      						'<span title="' + dayNames[day] + '">' + dayNamesMin[day] + '</span></th>';
      				}
      				calender += thead + '</tr></thead><tbody>';
      				var daysInMonth = this._getDaysInMonth(drawYear, drawMonth);
      				if (drawYear == inst.selectedYear && drawMonth == inst.selectedMonth)
      					inst.selectedDay = Math.min(inst.selectedDay, daysInMonth);
      				var leadDays = (this._getFirstDayOfMonth(drawYear, drawMonth) - firstDay + 7) % 7;
      				var curRows = Math.ceil((leadDays + daysInMonth) / 7); // calculate the number of rows to generate
      				var numRows = (isMultiMonth ? this.maxRows > curRows ? this.maxRows : curRows : curRows); //If multiple months, use the higher number of rows (see #7043)
      				this.maxRows = numRows;
      				var printDate = this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1 - leadDays));
      				for (var dRow = 0; dRow < numRows; dRow++) { // create date picker rows
      					calender += '<tr>';
      					var tbody = (!showWeek ? '' : '<td class="ui-datepicker-week-col">' +
      						this._get(inst, 'calculateWeek')(printDate) + '</td>');
      					for (var dow = 0; dow < 7; dow++) { // create date picker days
      						var daySettings = (beforeShowDay ?
      							beforeShowDay.apply((inst.input ? inst.input[0] : null), [printDate]) : [true, '']);
      						var otherMonth = (printDate.getMonth() != drawMonth);
      						var unselectable = (otherMonth && !selectOtherMonths) || !daySettings[0] ||
      							(minDate && printDate < minDate) || (maxDate && printDate > maxDate);
      						tbody += '<td class="' +
      							((dow + firstDay + 6) % 7 >= 5 ? ' ui-datepicker-week-end' : '') + // highlight weekends
      							(otherMonth ? ' ui-datepicker-other-month' : '') + // highlight days from other months
      							((printDate.getTime() == selectedDate.getTime() && drawMonth == inst.selectedMonth && inst._keyEvent) || // user pressed key
      							(defaultDate.getTime() == printDate.getTime() && defaultDate.getTime() == selectedDate.getTime()) ?
      							// or defaultDate is current printedDate and defaultDate is selectedDate
      							' ' + this._dayOverClass : '') + // highlight selected day
      							(unselectable ? ' ' + this._unselectableClass + ' ui-state-disabled': '') +  // highlight unselectable days
      							(otherMonth && !showOtherMonths ? '' : ' ' + daySettings[1] + // highlight custom dates
      							(printDate.getTime() == currentDate.getTime() ? ' ' + this._currentClass : '') + // highlight selected day
      							(printDate.getTime() == today.getTime() ? ' ui-datepicker-today' : '')) + '"' + // highlight today (if different)
      							((!otherMonth || showOtherMonths) && daySettings[2] ? ' title="' + daySettings[2] + '"' : '') + // cell title
      							(unselectable ? '' : ' data-handler="selectDay" data-event="click" data-month="' + printDate.getMonth() + '" data-year="' + printDate.getFullYear() + '"') + '>' + // actions
      							(otherMonth && !showOtherMonths ? '&#xa0;' : // display for other months
      							(unselectable ? '<span class="ui-state-default">' + printDate.getDate() + '</span>' : '<a class="ui-state-default' +
      							(printDate.getTime() == today.getTime() ? ' ui-state-highlight' : '') +
      							(printDate.getTime() == currentDate.getTime() ? ' ui-state-active' : '') + // highlight selected day
      							(otherMonth ? ' ui-priority-secondary' : '') + // distinguish dates from other months
      							'" href="#">' + printDate.getDate() + '</a>')) + '</td>'; // display selectable date
      						printDate.setDate(printDate.getDate() + 1);
      						printDate = this._daylightSavingAdjust(printDate);
      					}
      					calender += tbody + '</tr>';
      				}
      				drawMonth++;
      				if (drawMonth > 11) {
      					drawMonth = 0;
      					drawYear++;
      				}
      				calender += '</tbody></table>' + (isMultiMonth ? '</div>' +
      							((numMonths[0] > 0 && col == numMonths[1]-1) ? '<div class="ui-datepicker-row-break"></div>' : '') : '');
      				group += calender;
      			}
      			html += group;
      		}
      		html += buttonPanel + ($.ui.ie6 && !inst.inline ?
      			'<iframe src="javascript:false;" class="ui-datepicker-cover" frameborder="0"></iframe>' : '');
      		inst._keyEvent = false;
      		return html;
      	},
      
      	/* Generate the month and year header. */
      	_generateMonthYearHeader: function(inst, drawMonth, drawYear, minDate, maxDate,
      			secondary, monthNames, monthNamesShort) {
      		var changeMonth = this._get(inst, 'changeMonth');
      		var changeYear = this._get(inst, 'changeYear');
      		var showMonthAfterYear = this._get(inst, 'showMonthAfterYear');
      		var html = '<div class="ui-datepicker-title">';
      		var monthHtml = '';
      		// month selection
      		if (secondary || !changeMonth)
      			monthHtml += '<span class="ui-datepicker-month">' + monthNames[drawMonth] + '</span>';
      		else {
      			var inMinYear = (minDate && minDate.getFullYear() == drawYear);
      			var inMaxYear = (maxDate && maxDate.getFullYear() == drawYear);
      			monthHtml += '<select class="ui-datepicker-month" data-handler="selectMonth" data-event="change">';
      			for (var month = 0; month < 12; month++) {
      				if ((!inMinYear || month >= minDate.getMonth()) &&
      						(!inMaxYear || month <= maxDate.getMonth()))
      					monthHtml += '<option value="' + month + '"' +
      						(month == drawMonth ? ' selected="selected"' : '') +
      						'>' + monthNamesShort[month] + '</option>';
      			}
      			monthHtml += '</select>';
      		}
      		if (!showMonthAfterYear)
      			html += monthHtml + (secondary || !(changeMonth && changeYear) ? '&#xa0;' : '');
      		// year selection
      		if ( !inst.yearshtml ) {
      			inst.yearshtml = '';
      			if (secondary || !changeYear)
      				html += '<span class="ui-datepicker-year">' + drawYear + '</span>';
      			else {
      				// determine range of years to display
      				var years = this._get(inst, 'yearRange').split(':');
      				var thisYear = new Date().getFullYear();
      				var determineYear = function(value) {
      					var year = (value.match(/c[+-].*/) ? drawYear + parseInt(value.substring(1), 10) :
      						(value.match(/[+-].*/) ? thisYear + parseInt(value, 10) :
      						parseInt(value, 10)));
      					return (isNaN(year) ? thisYear : year);
      				};
      				var year = determineYear(years[0]);
      				var endYear = Math.max(year, determineYear(years[1] || ''));
      				year = (minDate ? Math.max(year, minDate.getFullYear()) : year);
      				endYear = (maxDate ? Math.min(endYear, maxDate.getFullYear()) : endYear);
      				inst.yearshtml += '<select class="ui-datepicker-year" data-handler="selectYear" data-event="change">';
      				for (; year <= endYear; year++) {
      					inst.yearshtml += '<option value="' + year + '"' +
      						(year == drawYear ? ' selected="selected"' : '') +
      						'>' + year + '</option>';
      				}
      				inst.yearshtml += '</select>';
      
      				html += inst.yearshtml;
      				inst.yearshtml = null;
      			}
      		}
      		html += this._get(inst, 'yearSuffix');
      		if (showMonthAfterYear)
      			html += (secondary || !(changeMonth && changeYear) ? '&#xa0;' : '') + monthHtml;
      		html += '</div>'; // Close datepicker_header
      		return html;
      	},
      
      	/* Adjust one of the date sub-fields. */
      	_adjustInstDate: function(inst, offset, period) {
      		var year = inst.drawYear + (period == 'Y' ? offset : 0);
      		var month = inst.drawMonth + (period == 'M' ? offset : 0);
      		var day = Math.min(inst.selectedDay, this._getDaysInMonth(year, month)) +
      			(period == 'D' ? offset : 0);
      		var date = this._restrictMinMax(inst,
      			this._daylightSavingAdjust(new Date(year, month, day)));
      		inst.selectedDay = date.getDate();
      		inst.drawMonth = inst.selectedMonth = date.getMonth();
      		inst.drawYear = inst.selectedYear = date.getFullYear();
      		if (period == 'M' || period == 'Y')
      			this._notifyChange(inst);
      	},
      
      	/* Ensure a date is within any min/max bounds. */
      	_restrictMinMax: function(inst, date) {
      		var minDate = this._getMinMaxDate(inst, 'min');
      		var maxDate = this._getMinMaxDate(inst, 'max');
      		var newDate = (minDate && date < minDate ? minDate : date);
      		newDate = (maxDate && newDate > maxDate ? maxDate : newDate);
      		return newDate;
      	},
      
      	/* Notify change of month/year. */
      	_notifyChange: function(inst) {
      		var onChange = this._get(inst, 'onChangeMonthYear');
      		if (onChange)
      			onChange.apply((inst.input ? inst.input[0] : null),
      				[inst.selectedYear, inst.selectedMonth + 1, inst]);
      	},
      
      	/* Determine the number of months to show. */
      	_getNumberOfMonths: function(inst) {
      		var numMonths = this._get(inst, 'numberOfMonths');
      		return (numMonths == null ? [1, 1] : (typeof numMonths == 'number' ? [1, numMonths] : numMonths));
      	},
      
      	/* Determine the current maximum date - ensure no time components are set. */
      	_getMinMaxDate: function(inst, minMax) {
      		return this._determineDate(inst, this._get(inst, minMax + 'Date'), null);
      	},
      
      	/* Find the number of days in a given month. */
      	_getDaysInMonth: function(year, month) {
      		return 32 - this._daylightSavingAdjust(new Date(year, month, 32)).getDate();
      	},
      
      	/* Find the day of the week of the first of a month. */
      	_getFirstDayOfMonth: function(year, month) {
      		return new Date(year, month, 1).getDay();
      	},
      
      	/* Determines if we should allow a "next/prev" month display change. */
      	_canAdjustMonth: function(inst, offset, curYear, curMonth) {
      		var numMonths = this._getNumberOfMonths(inst);
      		var date = this._daylightSavingAdjust(new Date(curYear,
      			curMonth + (offset < 0 ? offset : numMonths[0] * numMonths[1]), 1));
      		if (offset < 0)
      			date.setDate(this._getDaysInMonth(date.getFullYear(), date.getMonth()));
      		return this._isInRange(inst, date);
      	},
      
      	/* Is the given date in the accepted range? */
      	_isInRange: function(inst, date) {
      		var minDate = this._getMinMaxDate(inst, 'min');
      		var maxDate = this._getMinMaxDate(inst, 'max');
      		return ((!minDate || date.getTime() >= minDate.getTime()) &&
      			(!maxDate || date.getTime() <= maxDate.getTime()));
      	},
      
      	/* Provide the configuration settings for formatting/parsing. */
      	_getFormatConfig: function(inst) {
      		var shortYearCutoff = this._get(inst, 'shortYearCutoff');
      		shortYearCutoff = (typeof shortYearCutoff != 'string' ? shortYearCutoff :
      			new Date().getFullYear() % 100 + parseInt(shortYearCutoff, 10));
      		return {shortYearCutoff: shortYearCutoff,
      			dayNamesShort: this._get(inst, 'dayNamesShort'), dayNames: this._get(inst, 'dayNames'),
      			monthNamesShort: this._get(inst, 'monthNamesShort'), monthNames: this._get(inst, 'monthNames')};
      	},
      
      	/* Format the given date for display. */
      	_formatDate: function(inst, day, month, year) {
      		if (!day) {
      			inst.currentDay = inst.selectedDay;
      			inst.currentMonth = inst.selectedMonth;
      			inst.currentYear = inst.selectedYear;
      		}
      		var date = (day ? (typeof day == 'object' ? day :
      			this._daylightSavingAdjust(new Date(year, month, day))) :
      			this._daylightSavingAdjust(new Date(inst.currentYear, inst.currentMonth, inst.currentDay)));
      		return this.formatDate(this._get(inst, 'dateFormat'), date, this._getFormatConfig(inst));
      	}
      });
      
      /*
       * Bind hover events for datepicker elements.
       * Done via delegate so the binding only occurs once in the lifetime of the parent div.
       * Global instActive, set by _updateDatepicker allows the handlers to find their way back to the active picker.
       */
      function bindHover(dpDiv) {
      	var selector = 'button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a';
      	return dpDiv.delegate(selector, 'mouseout', function() {
      			$(this).removeClass('ui-state-hover');
      			if (this.className.indexOf('ui-datepicker-prev') != -1) $(this).removeClass('ui-datepicker-prev-hover');
      			if (this.className.indexOf('ui-datepicker-next') != -1) $(this).removeClass('ui-datepicker-next-hover');
      		})
      		.delegate(selector, 'mouseover', function(){
      			if (!$.datepicker._isDisabledDatepicker( instActive.inline ? dpDiv.parent()[0] : instActive.input[0])) {
      				$(this).parents('.ui-datepicker-calendar').find('a').removeClass('ui-state-hover');
      				$(this).addClass('ui-state-hover');
      				if (this.className.indexOf('ui-datepicker-prev') != -1) $(this).addClass('ui-datepicker-prev-hover');
      				if (this.className.indexOf('ui-datepicker-next') != -1) $(this).addClass('ui-datepicker-next-hover');
      			}
      		});
      }
      
      /* jQuery extend now ignores nulls! */
      function extendRemove(target, props) {
      	$.extend(target, props);
      	for (var name in props)
      		if (props[name] == null || props[name] == undefined)
      			target[name] = props[name];
      	return target;
      };
      
      /* Invoke the datepicker functionality.
         @param  options  string - a command, optionally followed by additional parameters or
      	                Object - settings for attaching new datepicker functionality
         @return  jQuery object */
      $.fn.datepicker = function(options){
      
      	/* Verify an empty collection wasn't passed - Fixes #6976 */
      	if ( !this.length ) {
      		return this;
      	}
      
      	/* Initialise the date picker. */
      	if (!$.datepicker.initialized) {
      		$(document).mousedown($.datepicker._checkExternalClick).
      			find(document.body).append($.datepicker.dpDiv);
      		$.datepicker.initialized = true;
      	}
      
      	var otherArgs = Array.prototype.slice.call(arguments, 1);
      	if (typeof options == 'string' && (options == 'isDisabled' || options == 'getDate' || options == 'widget'))
      		return $.datepicker['_' + options + 'Datepicker'].
      			apply($.datepicker, [this[0]].concat(otherArgs));
      	if (options == 'option' && arguments.length == 2 && typeof arguments[1] == 'string')
      		return $.datepicker['_' + options + 'Datepicker'].
      			apply($.datepicker, [this[0]].concat(otherArgs));
      	return this.each(function() {
      		typeof options == 'string' ?
      			$.datepicker['_' + options + 'Datepicker'].
      				apply($.datepicker, [this].concat(otherArgs)) :
      			$.datepicker._attachDatepicker(this, options);
      	});
      };
      
      $.datepicker = new Datepicker(); // singleton instance
      $.datepicker.initialized = false;
      $.datepicker.uuid = new Date().getTime();
      $.datepicker.version = "1.9.2";
      
      // Workaround for #4055
      // Add another global to avoid noConflict issues with inline event handlers
      window['DP_jQuery_' + dpuuid] = $;
      
      })(jQuery);
      ;
      }
    ], [
      {
        /*
          /Users/Admin/Projects/Nitro/source/scripts/vendor/touch.js
        */

      }, function(require, module, exports) {
        is_touch_device = function() {
        return !!('ontouchstart' in window) // works on most browsers
            || !!('onmsgesturechange' in window); // works on ie10
      };
      ;
      }
    ], [
      {
        /*
          /Users/Admin/Projects/Nitro/node_modules/base/index.js
        */

      }, function(require, module, exports) {
        /*jslint node: true, nomen: true*/
      
      (function () {
          'use strict';
      
          var include, extend, inherit, Module, Controller, Event, Model, Collection;
      
          // Copy object properties
          include = function (to, from) {
              var key;
              for (key in from) {
                  if (from.hasOwnProperty(key)) {
                      to[key] = from[key];
                  }
              }
          };
      
          // CoffeeScript extend for classes
          inherit = function (child, parent) {
              var key, Klass;
              for (key in parent) {
                  if (parent.hasOwnProperty(key)) {
                      child[key] = parent[key];
                  }
              }
              Klass = function () {
                  this.constructor = child;
              };
              Klass.prototype = parent.prototype;
              child.prototype = new Klass();
              child.__super__ = parent.prototype;
              return child;
          };
      
          // Backbone like extending
          extend = function (attrs) {
              var child, parent = this;
              if (!attrs) { attrs = {}; }
              if (attrs.hasOwnProperty('constructor')) {
                  child = attrs.constructor;
              } else {
                  child = function () {
                      child.__super__.constructor.apply(this, arguments);
                  };
              }
              inherit(child, parent);
              include(child.prototype, attrs);
              return child;
          };
      
          /*
           * MODULE
           *
           * Module magic taken from Spine
           */
      
          Module = {
      
              includes: function (obj) {
                  var key;
                  if (!obj) {
                      throw new Error('include(obj) requires obj');
                  }
                  for (key in obj) {
                      if (obj.hasOwnProperty(key) && key !== 'included' && key !== 'extended') {
                          this.prototype[key] = obj[key];
                      }
                  }
                  if (obj.hasOwnProperty('included')) {
                      obj.included.apply(this);
                  }
                  return this;
              },
      
              extends: function (obj) {
                  var key;
                  if (!obj) {
                      throw new Error('extend(obj) requires obj');
                  }
                  for (key in obj) {
                      if (obj.hasOwnProperty(key) && key !== 'included' && key !== 'extended') {
                          this[key] = obj[key];
                      }
                  }
                  if (obj.hasOwnProperty('extended')) {
                      obj.extended.apply(this);
                  }
                  return this;
              }
      
          };
      
      
          /*
           * EVENT
           */
      
          Event = (function () {
      
              function Event(attrs) {
                  var key;
                  this._events = {};
                  this._listening = [];
                  // Bind events specified in attrs
                  if (attrs && attrs.on) {
                      for (key in attrs.on) {
                          if (attrs.on.hasOwnProperty(key)) {
                              this.on(key, attrs.on[key]);
                          }
                      }
                      delete attrs.on;
                  }
              }
      
              include(Event, Module);
      
              // Bind an event to a function
              // Returns an event ID so you can unbind it later
              Event.prototype.on = function (events, fn) {
                  var ids, id, i, len, event;
                  if (typeof fn !== 'function') {
                      throw new Error('fn not function');
                  }
                  // Allow multiple events to be set at once such as:
                  // event.on('update change refresh', this.render);
                  ids = [];
                  events = events.split(' ');
                  for (i = 0, len = events.length; i < len; i += 1) {
                      event = events[i];
                      // If the event has never been listened to before
                      if (!this._events[event]) {
                          this._events[event] = {};
                          this._events[event].index = 0;
                      }
                      // Increment the index and assign an ID
                      id = this._events[event].index += 1;
                      this._events[event][id] = fn;
                      ids.push(id);
                  }
                  return ids;
              };
      
              // Trigger an event
              Event.prototype.trigger = function (event) {
                  var args, actions, i;
                  args = 2 <= arguments.length ? [].slice.call(arguments, 1) : [];
                  // Is this a good idea?
                  if (event !== '*') {
                      // console.log('--', event, args, '\n')
                      this.trigger('*', event, args);
                  }
                  actions = this._events[event];
                  if (actions) {
                      for (i in actions) {
                          if (actions.hasOwnProperty(i) && i !== 'index') {
                              actions[i].apply(actions[i], args);
                          }
                      }
                  }
              };
      
              // Remove a listener from an event
              Event.prototype.off = function (events, id) {
                  var i, len;
                  if (Array.isArray(id)) {
                      for (i = 0, len = id.length; i < len; i += 1) {
                          this.off(events, id[i]);
                      }
                      return;
                  }
                  events = events.split(' ');
                  for (i = 0, len = events.length; i < len; i += 1) {
                      delete this._events[events[i]][id];
                  }
              };
      
              /**
               * Listen to multiple events from multiple objects
               * Use this.stopListening to stop listening to them all
               *
               * Example:
               *
               *   this.listen(object, {
               *      'create change': this.render,
               *      'remove': this.remove
               *   });
               *
               *   this.listen([
               *      objectOne, {
               *          'create': this.render,
               *          'remove': this.remove
               *      },
               *      objectTwo, {
               *          'change': 'this.render
               *      }
               *   ]);
               *
               */
              Event.prototype.listen = function (obj, attrs) {
                  var i, len, event, listener;
                  if (Array.isArray(obj)) {
                      for (i = 0, len = obj.length; i < len; i += 2) {
                          this.listen(obj[i], obj[i + 1]);
                      }
                      return;
                  }
                  listener = [obj, {}];
                  for (event in attrs) {
                      if (attrs.hasOwnProperty(event)) {
                          listener[1][event] = obj.on(event, attrs[event]);
                      }
                  }
                  this._listening.push(listener);
              };
      
              // Stop listening to all events
              Event.prototype.stopListening = function (object) {
                  var i, len, obj, events, event;
                  for (i = 0, len = this._listening.length; i < len; i += 1) {
                      obj = this._listening[i][0];
                      if (!object || object === obj) {
                          events = this._listening[i][1];
                          for (event in events) {
                              if (events.hasOwnProperty(event)) {
                                  obj.off(event, events[event]);
                              }
                          }
                      }
                  }
                  this._listening = [];
              };
      
              return Event;
      
          }());
      
      
          /*
           * CONTROLLER
           */
      
          Controller = (function () {
      
              function Controller(attrs) {
                  Controller.__super__.constructor.apply(this, arguments);
                  if (!this.elements) { this.elements = {}; }
                  if (!this.events) { this.events = {}; }
                  include(this, attrs);
                  if (this.el) { this.bind(); }
              }
      
              // Load Events
              inherit(Controller, Event);
              include(Controller, Module);
      
              Controller.prototype.bind = function (el) {
                  var selector, query, action, split, name, event;
      
                  // If el is not specified use this.el
                  if (!el) { el = this.el; }
      
                  // Cache elements
                  for (selector in this.elements) {
                      if (this.elements.hasOwnProperty(selector)) {
                          name = this.elements[selector];
                          this[name] = el.find(selector);
                      }
                  }
      
                  // Bind events
                  for (query in this.events) {
                      if (this.events.hasOwnProperty(query)) {
                          action = this.events[query];
                          split = query.indexOf(' ') + 1;
                          event = query.slice(0, split || 9e9);
                          if (split > 0) {
                              selector = query.slice(split);
                              el.on(event, selector, this[action]);
                          } else {
                              el.on(event, this[action]);
                          }
                      }
                  }
      
              };
      
              Controller.prototype.unbind = function (el) {
                  var selector, query, action, split, name, event;
      
                  // If el is not specified use this.el
                  if (!el) { el = this.el; }
      
                  // Delete elements
                  for (selector in this.elements) {
                      if (this.elements.hasOwnProperty(selector)) {
                          name = this.elements[selector];
                          delete this[name];
                      }
                  }
      
                  // Unbind events
                  for (query in this.events) {
                      if (this.events.hasOwnProperty(query)) {
                          action = this.events[query];
                          split = query.indexOf(' ') + 1;
                          event = query.slice(0, split || 9e9);
                          if (split > 0) {
                              selector = query.slice(split);
                              el.off(event, selector);
                          } else {
                              el.off(event);
                          }
                      }
                  }
      
                  // Stop listening for events
                  this.stopListening();
      
              };
      
              return Controller;
      
          }());
      
      
          /*
           * MODEL
           */
      
          Model = (function () {
      
              function Model(attrs) {
                  var set, get, key, self = this;
      
                  // Call super
                  Model.__super__.constructor.apply(this, arguments);
      
                  // Set attributes
                  if (!this.defaults) { this.defaults = {}; }
                  this._data = {};
                  include(this._data, this.defaults);
                  include(this._data, attrs);
      
                  set = function (key) {
                      return function (value) {
                          return self.set(key, value);
                      };
                  };
      
                  get = function (key) {
                      return function () {
                          return self.get(key);
                      };
                  };
      
                  for (key in this.defaults) {
                      if (this.defaults.hasOwnProperty(key)) {
                          this.__defineSetter__(key, set(key));
                          this.__defineGetter__(key, get(key));
                      }
                  }
      
              }
      
              // Load Events
              inherit(Model, Event);
              include(Model, Module);
      
              // Change a value
              Model.prototype.set = function(key, value, options) {
                  if (value === this._data[key]) { return; }
                  this._data[key] = value;
                  if (!options || !options.silent) {
                      this.trigger('change', key, value);
                      this.trigger('change:' + key, value);
                  }
              };
      
              // Get a value
              Model.prototype.get = function(key) {
                  return this._data[key];
              };
      
              // Load data into the model
              Model.prototype.refresh = function (data, replace) {
                  if (replace) {
                      this._data = {};
                      include(this._data, this.defaults);
                  }
                  include(this._data, data);
                  this.trigger('refresh');
                  return this;
              };
      
              // Destroy the model
              Model.prototype.destroy = function () {
                  this.trigger('before:destroy');
                  delete this._data;
                  this.trigger('destroy');
                  return this;
              };
      
              // Convert the class instance into a simple object
              Model.prototype.toJSON = function (strict) {
                  var key, json;
                  if (strict) {
                      for (key in this._defaults) {
                          if (this._defaults.hasOwnProperty(key)) {
                              json[key] = this._data[key];
                          }
                      }
                  } else {
                      json = this._data;
                  }
                  return json;
              };
      
      
              return Model;
      
          }());
      
      
          /*
           * COLLECTION
           */
      
          Collection = (function () {
      
              function Collection() {
                  Collection.__super__.constructor.apply(this, arguments);
                  this.length  = 0;
                  this._index  = 0;
                  this._models = [];
                  this._lookup = {};
              }
      
              // Load Events
              inherit(Collection, Event);
              include(Collection, Module);
      
              // Access all models
              Collection.prototype.all = function () {
                  return this._models;
              };
      
              // Create a new instance of the model and add it to the collection
              Collection.prototype.create = function (attrs, options) {
                  var model = new this.model(attrs);
                  this.add(model, options);
                  return model;
              };
      
              // Add a model to the collection
              Collection.prototype.add = function (model, options) {
      
                  var id, index, self = this;
      
                  // Set ID
                  if (model.id) {
                      id = model.id;
                  } else {
                      id = 'c-' + this._index;
                      this._index += 1;
                      model.set('id', id, {silent: true});
                  }
      
                  console.log('\n++ id', model.id, model.get('id'));
      
                  // Add to collection
                  model.collection = this;
                  index = this._models.push(model) - 1;
                  this._lookup[id] = index;
                  this.length += 1;
      
                  // Bubble events
                  this.listen(model, {
                      '*': function(event, args) {
                          args = args.slice(0);
                          args.unshift(event + ':model', model);
                          // console.log('++', event, ' -> ', self.type || self.className, self)
                          self.trigger.apply(self, args);
                      },
                      'before:destroy': function () {
                          self.remove(model);
                      }
                  });
      
                  // Only trigger create if silent is not set
                  if (!options || !options.silent) {
                      this.trigger('create:model', model);
                      this.trigger('change');
                  }
      
              };
      
              // Remove a model from the collection
              // Does not destroy the model - just removes it from the array
              Collection.prototype.remove = function (model) {
                  var index = this.indexOf(model);
                  this._models.splice(index, 1);
                  delete this._lookup[model.id];
                  this.length -= 1;
                  this.stopListening(model);
                  this.trigger('remove:model')
                  this.trigger('change');
              };
      
              // Reorder the collection
              Collection.prototype.move = function (model, pos) {
                  var index = this.indexOf(model);
                  this._models.splice(index, 1);
                  this._models.splice(pos, 0, model);
                  this._lookup[model.id] = index;
                  this.trigger('change:order')
                  this.trigger('change');
              };
      
              // Append or replace the data in the collection
              // Doesn't trigger any events when updating the array apart from 'refresh'
              Collection.prototype.refresh = function (data, replace) {
                  var i, len;
                  if (replace) {
                      this._models = [];
                      this._lookup = {};
                  }
                  for (i = 0, len = data.length; i < len; i += 1) {
                      this.create(data[i], { silent: true });
                  }
                  return this.trigger('refresh');
              };
      
              // Loop over each record in the collection
              Collection.prototype.forEach = function () {
                  return this._models.forEach.apply(this._models, arguments);
              };
      
              // Filter the models
              Collection.prototype.filter = function () {
                  return this._models.filter.apply(this._models, arguments);
              };
      
              // Sort the models. Does not alter original order
              Collection.prototype.sort = function () {
                  return this._models.sort.apply(this._models, arguments);
              };
      
              // Get the index of the item
              Collection.prototype.indexOf = function (model) {
                  console.log('-- indexof', model);
                  if (typeof model === 'string') {
                      // Convert model id to actual model
                      return this.indexOf(this.get(model));
                  }
                  return this._models.indexOf(model);
              };
      
              // Convert the collection into an array of objects
              Collection.prototype.toJSON = function () {
                  var i, id, len, record, results = [];
                  for (i = 0, len = this._models.length; i < len; i += 1) {
                      record = this._models[i];
                      results.push(record.toJSON());
                  }
                  return results;
              };
      
              // Return the first record in the collection
              Collection.prototype.first = function () {
                  return this.at(0);
              };
      
              // Return the last record in the collection
              Collection.prototype.last = function () {
                  return this.at(this.length - 1);
              };
      
              // Return the record by the id
              Collection.prototype.get = function (id) {
                  var index = this._lookup[id];
                  return this.at(index);
              };
      
              // Return a specified record in the collection
              Collection.prototype.at = function (index) {
                  return this._models[index];
              };
      
              // Check if a model exists in the collection
              Collection.prototype.exists = function (model) {
                  return this.indexOf(model) > -1;
              };
      
              return Collection;
      
          }());
      
          // Add the extend to method to all classes
          Event.extend = Controller.extend = Model.extend = Collection.extend = extend;
      
          // Export all the classes
          module.exports = {
              Event: Event,
              Controller: Controller,
              Model: Model,
              Collection: Collection
          };
      
      }());
      ;
      }
    ], [
      {
        /*
          /Users/Admin/Projects/Nitro/source/scripts/utils/touchify.coffee
        */

        'base': 7
      }, function(require, module, exports) {
        var Base, isMobile;
        Base = require('base');
        isMobile = window.ontouchend !== void 0;
        Base.touchify = function(events) {
          var action, event, touchEvent;
          if (events == null) {
            events = {};
          }
          if (!isMobile) {
            return events;
          }
          console.log(events);
          for (event in events) {
            action = events[event];
            touchEvent = event.replace(/^click/, 'touchend');
            if (touchEvent.slice(0, 8) === 'touchend') {
              delete events[event];
              events[touchEvent] = action;
            }
          }
          return events;
        };
        return module.exports = Base.touchify;
      }
    ], [
      {
        /*
          /Users/Admin/Projects/Nitro/source/scripts/utils/keys.json
        */

      }, function(require, module, exports) {
        return module.exports = {
          "enter": 13,
          "escape": 27,
          "left": 37,
          "up": 38,
          "right": 39,
          "down": 40,
          "0": 48,
          "1": 49,
          "2": 50,
          "3": 51,
          "4": 52,
          "5": 53,
          "6": 54,
          "7": 55,
          "8": 56,
          "9": 57,
          "a": 65,
          "b": 66,
          "c": 67,
          "d": 68,
          "e": 69,
          "f": 70,
          "g": 71,
          "h": 72,
          "i": 73,
          "j": 74,
          "k": 75,
          "l": 76,
          "m": 77,
          "n": 78,
          "o": 79,
          "p": 80,
          "q": 81,
          "r": 82,
          "s": 83,
          "t": 84,
          "u": 85,
          "v": 86,
          "w": 87,
          "x": 88,
          "y": 89,
          "z": 90,
          "comma": 188,
          "dash": 189,
          "period": 190
        };
      }
    ], [
      {
        /*
          /Users/Admin/Projects/Nitro/source/scripts/utils/translate.coffee
        */

        'jqueryify': 1,
        '../models/setting': 11,
        '../utils/event': 14,
        '../languages/languages': 16
      }, function(require, module, exports) {
        var $, Event, Setting, Translate, languages, ready, translate;
        $ = require('jqueryify');
        Setting = require('../models/setting');
        Event = require('../utils/event');
        languages = require('../languages/languages');
        /*
        # Currently the app can only be translated once, as the original text is lost after translation.
        # We could fix this by storing the original text on the element.
        #
        */

        Translate = (function() {
          function Translate(language) {
            var _this = this;
            this.language = language;
            this.convert = __bind(this.convert, this);
            this.exists = __bind(this.exists, this);
            this.dictionary = languages[this.language];
            $('.t').each(function(index, el) {
              var text;
              text = el.innerText;
              if (_this.exists(text)) {
                return el.innerText = _this.convert(text);
              }
            });
            $('.p').each(function(index, el) {
              var placeholder;
              placeholder = el.attributes.placeholder.value;
              if (_this.exists(placeholder)) {
                return el.attributes.placeholder.value = _this.convert(placeholder);
              }
            });
            $('.l').each(function(index, el) {
              var title;
              title = el.attributes.title.value;
              if (_this.exists(title)) {
                return el.attributes.title.value = _this.convert(title);
              }
            });
          }

          Translate.prototype.exists = function(text) {
            return this.dictionary.hasOwnProperty(text);
          };

          Translate.prototype.convert = function(text) {
            if (this.exists(text)) {
              return this.dictionary[text];
            }
            return text;
          };

          return Translate;

        })();
        translate = {
          convert: function() {
            throw new Error('Translations not ready');
          }
        };
        ready = false;
        module.exports = function(text) {
          var k, t, v, _i, _len, _results;
          if (Array.isArray(text)) {
            _results = [];
            for (_i = 0, _len = text.length; _i < _len; _i++) {
              t = text[_i];
              _results.push(translate.convert(t));
            }
            return _results;
          } else if (typeof text === 'object') {
            for (k in text) {
              v = text[k];
              text[k] = translate.convert(v);
            }
            return text;
          } else {
            return translate.convert(text);
          }
        };
        module.exports.init = function() {
          translate = new Translate(Setting.language);
          ready = true;
          return Event.trigger('translate:ready');
        };
        return module.exports.ready = function(fn) {
          if (ready) {
            return fn();
          }
          return Event.on('translate:ready', fn);
        };
      }
    ], [
      {
        /*
          /Users/Admin/Projects/Nitro/source/scripts/models/setting.coffee
        */

        'base': 7,
        '../controllers/sync': 12
      }, function(require, module, exports) {
        var Base, Setting, Sync;
        Base = require('base');
        Sync = require('../controllers/sync');
        Setting = (function(_super) {
          __extends(Setting, _super);

          Setting.prototype.defaults = {
            pro: false,
            loggedin: false,
            uid: null,
            token: null,
            userName: null,
            userEmail: null,
            sort: true,
            night: false,
            language: 'en-us',
            weekStart: '1',
            dateFormat: 'dd/mm/yy',
            confirmDelete: true,
            completedDuration: 'day',
            notifyTime: 9,
            notifyEmail: false,
            notifyRegular: 'upcoming',
            notifications: false
          };

          function Setting() {
            Setting.__super__.constructor.apply(this, arguments);
          }

          return Setting;

        })(Base.Model);
        return module.exports = new Setting();
      }
    ], [
      {
        /*
          /Users/Admin/Projects/Nitro/source/scripts/controllers/sync.coffee
        */

        'base': 7,
        '../vendor/socket.io.js': 13,
        '../utils/event': 14,
        '../utils/config': 15
      }, function(require, module, exports) {
        var Base, Collection, Event, Extend, Include, Singleton, SocketIo, Sync, config;
        Base = require('base');
        SocketIo = require('../vendor/socket.io.js');
        Event = require('../utils/event');
        config = require('../utils/config');
        Sync = {
          models: {},
          online: false,
          enabled: true,
          queue: JSON.parse(localStorage.Queue || '[]'),
          connect: function(uid, token, fn) {
            var event, _i, _len, _ref,
              _this = this;
            this.socket = SocketIo.connect("http://" + config.sync + "/?token=" + token + "&uid=" + uid);
            _ref = ['error', 'disconnect', 'connect_failed'];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              event = _ref[_i];
              Event.trigger('sync:disconnected');
              this.socket.on(event, Sync.goOffline);
            }
            return this.socket.on('connect', function() {
              _this.online = true;
              _this.bindEvents();
              _this.sync();
              Event.trigger('sync:connected');
              if (fn) {
                return fn();
              }
            });
          },
          bindQueue: [],
          on: function(event, fn) {
            if (!this.online) {
              return this.bindQueue.push([event, fn]);
            } else {
              return this.socket.on(event, fn);
            }
          },
          bindEvents: function() {
            var bindQueue, item, _i, _len, _ref;
            _ref = this.bindQueue;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              item = _ref[_i];
              this.socket.on(item[0], item[1]);
            }
            return bindQueue = [];
          },
          emit: function(name, args, fn) {
            if (!this.online) {
              this.addToQueue(name, args);
              return;
            }
            if (!this.enabled) {
              return;
            }
            return this.socket.emit(name, args, fn);
          },
          sync: function() {
            var _this = this;
            console.log('Going to run sync');
            console.log('Queue:', this.queue);
            this.emit('sync', this.queue, function(_arg) {
              var lists, tasks;
              tasks = _arg[0], lists = _arg[1];
              console.log('Lists:', lists);
              _this.models.List.refresh(lists, {
                clear: true
              });
              console.log('Tasks:', tasks);
              _this.models.Task.refresh(tasks, {
                clear: true
              });
              _this.queue = [];
              return _this.saveQueue();
            });
            return true;
          },
          disable: function(callback) {
            var e;
            if (this.enabled) {
              this.enabled = false;
              try {
                return callback();
              } catch (_error) {
                e = _error;
                throw e;
              } finally {
                this.enabled = true;
              }
            } else {
              return callback();
            }
          },
          updateInfo: function() {
            return this.emit('info', null, function(info) {
              Setting.set('user_name', info.name);
              Setting.set('user_email', info.email);
              return Setting.set('pro', info.pro);
            });
          },
          addToQueue: function(name, args) {
            var key, now, time, _ref;
            if (name === 'create' || name === 'update' || name === 'destroy') {
              now = Date.now();
              if (name === 'update') {
                time = {};
                _ref = args[1];
                for (key in _ref) {
                  if (!__hasProp.call(_ref, key)) continue;
                  if (key === 'id') {
                    continue;
                  }
                  time[key] = now;
                }
              } else {
                time = now;
              }
              this.queue.push([name, args, time]);
              return this.optimizeQueue();
            }
          },
          optimizeQueue: function() {
            var cN, className, event, events, id, index, item, items, key, lastUpdate, model, models, queue, section, time, times, timestamps, type, val, value, _i, _j, _k, _len, _len1, _ref, _ref1, _ref2, _ref3, _ref4;
            queue = [];
            models = {};
            _ref = this.queue;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              event = _ref[_i];
              type = event[0], (_ref1 = event[1], className = _ref1[0], model = _ref1[1]), time = event[2];
              switch (type) {
                case 'create':
                case 'update':
                  item = model;
                  break;
                case 'destroy':
                  item = {
                    id: model
                  };
              }
              if (!models.hasOwnProperty(className)) {
                models[className] = {};
              }
              if (!models[className].hasOwnProperty(item.id)) {
                models[className][item.id] = [];
              }
              models[className][item.id].push(event);
            }
            for (className in models) {
              items = models[className];
              for (id in items) {
                events = items[id];
                events.sort(function(a, b) {
                  var i, key, times, value, x, _j, _len1, _ref2, _ref3;
                  time = {
                    a: 0,
                    b: 0
                  };
                  _ref2 = [a, b];
                  for (i = _j = 0, _len1 = _ref2.length; _j < _len1; i = ++_j) {
                    x = _ref2[i];
                    if (typeof x[2] === 'object') {
                      times = [];
                      _ref3 = x[2];
                      for (key in _ref3) {
                        time = _ref3[key];
                        times.push(time);
                      }
                      value = Math.max.apply(this, times);
                    } else {
                      value = x[2];
                    }
                    if (i === 0) {
                      time.a = value;
                    } else {
                      time.b = value;
                    }
                  }
                  return time.a - time.b;
                });
                section = {
                  create: false,
                  update: [],
                  destroy: false
                };
                for (index = _j = _ref2 = events.length - 1; _ref2 <= 0 ? _j <= 0 : _j >= 0; index = _ref2 <= 0 ? ++_j : --_j) {
                  if (section.create !== false) {
                    break;
                  }
                  event = events[index];
                  type = event[0];
                  switch (type) {
                    case 'create':
                      section.create = event;
                      break;
                    case 'update':
                      section.update.unshift(event);
                      break;
                    case 'destroy':
                      section.destroy = event;
                  }
                }
                if (section.destroy && section.update.length) {
                  queue.push(section.destroy);
                  continue;
                }
                lastUpdate = {};
                timestamps = {};
                _ref3 = section.update;
                for (_k = 0, _len1 = _ref3.length; _k < _len1; _k++) {
                  event = _ref3[_k];
                  type = event[0], (_ref4 = event[1], cN = _ref4[0], model = _ref4[1]), time = event[2];
                  for (key in model) {
                    if (!__hasProp.call(model, key)) continue;
                    value = model[key];
                    if (value !== lastUpdate[key]) {
                      lastUpdate[key] = value;
                      if (key !== 'id') {
                        timestamps[key] = time[key];
                      }
                    }
                  }
                }
                if (section.create && !section.destroy && section.update.length) {
                  for (key in lastUpdate) {
                    val = lastUpdate[key];
                    section.create[1][1][key] = val;
                  }
                  times = [];
                  for (key in timestamps) {
                    time = timestamps[key];
                    times.push(time);
                  }
                  section.create[2] = Math.max.apply(this, times);
                  queue.push(section.create);
                  continue;
                }
                if (!(section.create && section.destroy)) {
                  if (section.create) {
                    queue.push(section.create);
                  }
                  if (section.update.length) {
                    queue.push(['update', [className, lastUpdate], timestamps]);
                  }
                  if (section.destroy) {
                    queue.push(section.destroy);
                  }
                }
              }
            }
            this.queue = queue;
            this.saveQueue();
            return true;
          },
          saveQueue: function() {
            return localStorage.Queue = JSON.stringify(this.queue);
          },
          exportData: function(keys) {
            var className, model, output, _ref;
            if (keys == null) {
              keys = ['tasks', 'lists'];
            }
            output = {};
            _ref = this.models;
            for (className in _ref) {
              model = _ref[className];
              output[className] = model.toJSON();
            }
            return JSON.stringify(output);
          },
          importData: function(obj) {
            var className, input, model, _ref, _results;
            input = JSON.parse(obj);
            _ref = this.models;
            _results = [];
            for (className in _ref) {
              model = _ref[className];
              _results.push(model.refresh(input[className]));
            }
            return _results;
          },
          goOffline: function() {
            console.error('NitroSync: Couldn\'t connect to server');
            Setting.trigger('offline');
            return Sync.online = false;
          }
        };
        Collection = (function() {
          function Collection(model) {
            var _this = this;
            this.model = model;
            this.recordsResponse = __bind(this.recordsResponse, this);
            Sync.models[this.model.className] = this.model;
            Sync.on('create', function(data) {
              var className, item;
              console.log('(Sync) create ->', data);
              className = data[0], item = data[1];
              if (className === _this.model.className) {
                return Sync.disable(function() {
                  return _this.model.create(item);
                });
              }
            });
            Sync.on('update', function(data) {
              var className, item;
              console.log('(Sync) update ->', data);
              className = data[0], item = data[1];
              if (className === _this.model.className) {
                return Sync.disable(function() {
                  return _this.model.find(item.id).updateAttributes(item);
                });
              }
            });
            Sync.on('destroy', function(data) {
              var className, id;
              console.log('(Sync) delete ->', data);
              className = data[0], id = data[1];
              if (className === _this.model.className) {
                return Sync.disable(function() {
                  return _this.model.find(id).destroy();
                });
              }
            });
          }

          Collection.prototype.all = function(params, callback) {
            var _this = this;
            return Sync.emit('fetch', this.model.className, function(data) {
              _this.recordsResponse(data);
              return callback(data);
            });
          };

          Collection.prototype.fetch = function(params, options) {
            var _this = this;
            if (params == null) {
              params = {};
            }
            if (options == null) {
              options = {};
            }
            return this.all(params, function(records) {
              return _this.model.refresh(records, options);
            });
          };

          Collection.prototype.recordsResponse = function(data) {
            return this.model.trigger('syncSuccess', data);
          };

          return Collection;

        })();
        Singleton = (function() {
          function Singleton(record) {
            this.record = record;
            this.update = __bind(this.update, this);
            this.model = this.record.constructor;
          }

          Singleton.prototype.create = function(params, options) {
            var _this = this;
            return Sync.emit('create', [this.model.className, this.record.toJSON()], function(id) {
              return Sync.disable(function() {
                return _this.record.changeID(id);
              });
            });
          };

          Singleton.prototype.update = function(model, key, val, old, options) {
            var item;
            if (key === 'id') {
              return;
            }
            item = {
              id: this.record.id
            };
            item[key] = val;
            console.log('(Sync)', item);
            return Sync.emit('update', [this.model.className, item]);
          };

          Singleton.prototype.destroy = function(params, options) {
            return Sync.emit('destroy', [this.model.className, this.record.id]);
          };

          return Singleton;

        })();
        Include = {
          sync: function() {
            return new Singleton(this);
          }
        };
        Extend = {
          sync: function() {
            return new Collection(this);
          }
        };
        Sync.Collection = (function(_super) {
          __extends(Collection, _super);

          function Collection() {
            this.save = __bind(this.save, this);
            this.fetch = __bind(this.fetch, this);
            this.syncFetch = __bind(this.syncFetch, this);
            Collection.__super__.constructor.apply(this, arguments);
            this.on('fetch', this.fetch);
            this.on('save:model create:model change:model remove:model', this.save);
          }

          Collection.prototype.syncFetch = function() {
            return this.loadLocal();
          };

          Collection.prototype.syncChange = function(record, type, options) {
            if (options == null) {
              options = {};
            }
            if (type === 'update') {
              return;
            }
            this.saveLocal();
            if (options.sync === false) {
              return;
            }
            return record.sync()[type](options.sync, options);
          };

          Collection.prototype.syncUpdate = function(record, key, value, old, options) {
            if (options.sync === false) {
              return;
            }
            return record.sync().update.apply(this, arguments);
          };

          Collection.prototype.fetch = function() {
            var result;
            result = JSON.parse(localStorage[this.className] || '[]');
            return this.refresh(result, true);
          };

          Collection.prototype.save = function() {
            console.log('[' + this.className + ']', 'saving', arguments);
            return localStorage[this.className] = JSON.stringify(this.toJSON());
          };

          return Collection;

        })(Base.Collection);
        return module.exports = Sync;
      }
    ], [
      {
        /*
          /Users/Admin/Projects/Nitro/source/scripts/vendor/socket.io.js
        */

      }, function(require, module, exports) {
        /*! Socket.IO.min.js build:0.9.11, production. Copyright(c) 2011 LearnBoost <dev@learnboost.com> MIT Licensed */
      var io="undefined"==typeof module?{}:module.exports;(function(){(function(a,b){var c=a;c.version="0.9.11",c.protocol=1,c.transports=[],c.j=[],c.sockets={},c.connect=function(a,d){var e=c.util.parseUri(a),f,g;b&&b.location&&(e.protocol=e.protocol||b.location.protocol.slice(0,-1),e.host=e.host||(b.document?b.document.domain:b.location.hostname),e.port=e.port||b.location.port),f=c.util.uniqueUri(e);var h={host:e.host,secure:"https"==e.protocol,port:e.port||("https"==e.protocol?443:80),query:e.query||""};c.util.merge(h,d);if(h["force new connection"]||!c.sockets[f])g=new c.Socket(h);return!h["force new connection"]&&g&&(c.sockets[f]=g),g=g||c.sockets[f],g.of(e.path.length>1?e.path:"")}})("object"==typeof module?module.exports:this.io={},this),function(a,b){var c=a.util={},d=/^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,e=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];c.parseUri=function(a){var b=d.exec(a||""),c={},f=14;while(f--)c[e[f]]=b[f]||"";return c},c.uniqueUri=function(a){var c=a.protocol,d=a.host,e=a.port;return"document"in b?(d=d||document.domain,e=e||(c=="https"&&document.location.protocol!=="https:"?443:document.location.port)):(d=d||"localhost",!e&&c=="https"&&(e=443)),(c||"http")+"://"+d+":"+(e||80)},c.query=function(a,b){var d=c.chunkQuery(a||""),e=[];c.merge(d,c.chunkQuery(b||""));for(var f in d)d.hasOwnProperty(f)&&e.push(f+"="+d[f]);return e.length?"?"+e.join("&"):""},c.chunkQuery=function(a){var b={},c=a.split("&"),d=0,e=c.length,f;for(;d<e;++d)f=c[d].split("="),f[0]&&(b[f[0]]=f[1]);return b};var f=!1;c.load=function(a){if("document"in b&&document.readyState==="complete"||f)return a();c.on(b,"load",a,!1)},c.on=function(a,b,c,d){a.attachEvent?a.attachEvent("on"+b,c):a.addEventListener&&a.addEventListener(b,c,d)},c.request=function(a){if(a&&"undefined"!=typeof XDomainRequest&&!c.ua.hasCORS)return new XDomainRequest;if("undefined"!=typeof XMLHttpRequest&&(!a||c.ua.hasCORS))return new XMLHttpRequest;if(!a)try{return new(window[["Active"].concat("Object").join("X")])("Microsoft.XMLHTTP")}catch(b){}return null},"undefined"!=typeof window&&c.load(function(){f=!0}),c.defer=function(a){if(!c.ua.webkit||"undefined"!=typeof importScripts)return a();c.load(function(){setTimeout(a,100)})},c.merge=function(b,d,e,f){var g=f||[],h=typeof e=="undefined"?2:e,i;for(i in d)d.hasOwnProperty(i)&&c.indexOf(g,i)<0&&(typeof b[i]!="object"||!h?(b[i]=d[i],g.push(d[i])):c.merge(b[i],d[i],h-1,g));return b},c.mixin=function(a,b){c.merge(a.prototype,b.prototype)},c.inherit=function(a,b){function c(){}c.prototype=b.prototype,a.prototype=new c},c.isArray=Array.isArray||function(a){return Object.prototype.toString.call(a)==="[object Array]"},c.intersect=function(a,b){var d=[],e=a.length>b.length?a:b,f=a.length>b.length?b:a;for(var g=0,h=f.length;g<h;g++)~c.indexOf(e,f[g])&&d.push(f[g]);return d},c.indexOf=function(a,b,c){for(var d=a.length,c=c<0?c+d<0?0:c+d:c||0;c<d&&a[c]!==b;c++);return d<=c?-1:c},c.toArray=function(a){var b=[];for(var c=0,d=a.length;c<d;c++)b.push(a[c]);return b},c.ua={},c.ua.hasCORS="undefined"!=typeof XMLHttpRequest&&function(){try{var a=new XMLHttpRequest}catch(b){return!1}return a.withCredentials!=undefined}(),c.ua.webkit="undefined"!=typeof navigator&&/webkit/i.test(navigator.userAgent),c.ua.iDevice="undefined"!=typeof navigator&&/iPad|iPhone|iPod/i.test(navigator.userAgent)}("undefined"!=typeof io?io:module.exports,this),function(a,b){function c(){}a.EventEmitter=c,c.prototype.on=function(a,c){return this.$events||(this.$events={}),this.$events[a]?b.util.isArray(this.$events[a])?this.$events[a].push(c):this.$events[a]=[this.$events[a],c]:this.$events[a]=c,this},c.prototype.addListener=c.prototype.on,c.prototype.once=function(a,b){function d(){c.removeListener(a,d),b.apply(this,arguments)}var c=this;return d.listener=b,this.on(a,d),this},c.prototype.removeListener=function(a,c){if(this.$events&&this.$events[a]){var d=this.$events[a];if(b.util.isArray(d)){var e=-1;for(var f=0,g=d.length;f<g;f++)if(d[f]===c||d[f].listener&&d[f].listener===c){e=f;break}if(e<0)return this;d.splice(e,1),d.length||delete this.$events[a]}else(d===c||d.listener&&d.listener===c)&&delete this.$events[a]}return this},c.prototype.removeAllListeners=function(a){return a===undefined?(this.$events={},this):(this.$events&&this.$events[a]&&(this.$events[a]=null),this)},c.prototype.listeners=function(a){return this.$events||(this.$events={}),this.$events[a]||(this.$events[a]=[]),b.util.isArray(this.$events[a])||(this.$events[a]=[this.$events[a]]),this.$events[a]},c.prototype.emit=function(a){if(!this.$events)return!1;var c=this.$events[a];if(!c)return!1;var d=Array.prototype.slice.call(arguments,1);if("function"==typeof c)c.apply(this,d);else{if(!b.util.isArray(c))return!1;var e=c.slice();for(var f=0,g=e.length;f<g;f++)e[f].apply(this,d)}return!0}}("undefined"!=typeof io?io:module.exports,"undefined"!=typeof io?io:module.parent.exports),function(exports,nativeJSON){function f(a){return a<10?"0"+a:a}function date(a,b){return isFinite(a.valueOf())?a.getUTCFullYear()+"-"+f(a.getUTCMonth()+1)+"-"+f(a.getUTCDate())+"T"+f(a.getUTCHours())+":"+f(a.getUTCMinutes())+":"+f(a.getUTCSeconds())+"Z":null}function quote(a){return escapable.lastIndex=0,escapable.test(a)?'"'+a.replace(escapable,function(a){var b=meta[a];return typeof b=="string"?b:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function str(a,b){var c,d,e,f,g=gap,h,i=b[a];i instanceof Date&&(i=date(a)),typeof rep=="function"&&(i=rep.call(b,a,i));switch(typeof i){case"string":return quote(i);case"number":return isFinite(i)?String(i):"null";case"boolean":case"null":return String(i);case"object":if(!i)return"null";gap+=indent,h=[];if(Object.prototype.toString.apply(i)==="[object Array]"){f=i.length;for(c=0;c<f;c+=1)h[c]=str(c,i)||"null";return e=h.length===0?"[]":gap?"[\n"+gap+h.join(",\n"+gap)+"\n"+g+"]":"["+h.join(",")+"]",gap=g,e}if(rep&&typeof rep=="object"){f=rep.length;for(c=0;c<f;c+=1)typeof rep[c]=="string"&&(d=rep[c],e=str(d,i),e&&h.push(quote(d)+(gap?": ":":")+e))}else for(d in i)Object.prototype.hasOwnProperty.call(i,d)&&(e=str(d,i),e&&h.push(quote(d)+(gap?": ":":")+e));return e=h.length===0?"{}":gap?"{\n"+gap+h.join(",\n"+gap)+"\n"+g+"}":"{"+h.join(",")+"}",gap=g,e}}"use strict";if(nativeJSON&&nativeJSON.parse)return exports.JSON={parse:nativeJSON.parse,stringify:nativeJSON.stringify};var JSON=exports.JSON={},cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;JSON.stringify=function(a,b,c){var d;gap="",indent="";if(typeof c=="number")for(d=0;d<c;d+=1)indent+=" ";else typeof c=="string"&&(indent=c);rep=b;if(!b||typeof b=="function"||typeof b=="object"&&typeof b.length=="number")return str("",{"":a});throw new Error("JSON.stringify")},JSON.parse=function(text,reviver){function walk(a,b){var c,d,e=a[b];if(e&&typeof e=="object")for(c in e)Object.prototype.hasOwnProperty.call(e,c)&&(d=walk(e,c),d!==undefined?e[c]=d:delete e[c]);return reviver.call(a,b,e)}var j;text=String(text),cx.lastIndex=0,cx.test(text)&&(text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)}));if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return j=eval("("+text+")"),typeof reviver=="function"?walk({"":j},""):j;throw new SyntaxError("JSON.parse")}}("undefined"!=typeof io?io:module.exports,typeof JSON!="undefined"?JSON:undefined),function(a,b){var c=a.parser={},d=c.packets=["disconnect","connect","heartbeat","message","json","event","ack","error","noop"],e=c.reasons=["transport not supported","client not handshaken","unauthorized"],f=c.advice=["reconnect"],g=b.JSON,h=b.util.indexOf;c.encodePacket=function(a){var b=h(d,a.type),c=a.id||"",i=a.endpoint||"",j=a.ack,k=null;switch(a.type){case"error":var l=a.reason?h(e,a.reason):"",m=a.advice?h(f,a.advice):"";if(l!==""||m!=="")k=l+(m!==""?"+"+m:"");break;case"message":a.data!==""&&(k=a.data);break;case"event":var n={name:a.name};a.args&&a.args.length&&(n.args=a.args),k=g.stringify(n);break;case"json":k=g.stringify(a.data);break;case"connect":a.qs&&(k=a.qs);break;case"ack":k=a.ackId+(a.args&&a.args.length?"+"+g.stringify(a.args):"")}var o=[b,c+(j=="data"?"+":""),i];return k!==null&&k!==undefined&&o.push(k),o.join(":")},c.encodePayload=function(a){var b="";if(a.length==1)return a[0];for(var c=0,d=a.length;c<d;c++){var e=a[c];b+="\ufffd"+e.length+"\ufffd"+a[c]}return b};var i=/([^:]+):([0-9]+)?(\+)?:([^:]+)?:?([\s\S]*)?/;c.decodePacket=function(a){var b=a.match(i);if(!b)return{};var c=b[2]||"",a=b[5]||"",h={type:d[b[1]],endpoint:b[4]||""};c&&(h.id=c,b[3]?h.ack="data":h.ack=!0);switch(h.type){case"error":var b=a.split("+");h.reason=e[b[0]]||"",h.advice=f[b[1]]||"";break;case"message":h.data=a||"";break;case"event":try{var j=g.parse(a);h.name=j.name,h.args=j.args}catch(k){}h.args=h.args||[];break;case"json":try{h.data=g.parse(a)}catch(k){}break;case"connect":h.qs=a||"";break;case"ack":var b=a.match(/^([0-9]+)(\+)?(.*)/);if(b){h.ackId=b[1],h.args=[];if(b[3])try{h.args=b[3]?g.parse(b[3]):[]}catch(k){}}break;case"disconnect":case"heartbeat":}return h},c.decodePayload=function(a){if(a.charAt(0)=="\ufffd"){var b=[];for(var d=1,e="";d<a.length;d++)a.charAt(d)=="\ufffd"?(b.push(c.decodePacket(a.substr(d+1).substr(0,e))),d+=Number(e)+1,e=""):e+=a.charAt(d);return b}return[c.decodePacket(a)]}}("undefined"!=typeof io?io:module.exports,"undefined"!=typeof io?io:module.parent.exports),function(a,b){function c(a,b){this.socket=a,this.sessid=b}a.Transport=c,b.util.mixin(c,b.EventEmitter),c.prototype.heartbeats=function(){return!0},c.prototype.onData=function(a){this.clearCloseTimeout(),(this.socket.connected||this.socket.connecting||this.socket.reconnecting)&&this.setCloseTimeout();if(a!==""){var c=b.parser.decodePayload(a);if(c&&c.length)for(var d=0,e=c.length;d<e;d++)this.onPacket(c[d])}return this},c.prototype.onPacket=function(a){return this.socket.setHeartbeatTimeout(),a.type=="heartbeat"?this.onHeartbeat():(a.type=="connect"&&a.endpoint==""&&this.onConnect(),a.type=="error"&&a.advice=="reconnect"&&(this.isOpen=!1),this.socket.onPacket(a),this)},c.prototype.setCloseTimeout=function(){if(!this.closeTimeout){var a=this;this.closeTimeout=setTimeout(function(){a.onDisconnect()},this.socket.closeTimeout)}},c.prototype.onDisconnect=function(){return this.isOpen&&this.close(),this.clearTimeouts(),this.socket.onDisconnect(),this},c.prototype.onConnect=function(){return this.socket.onConnect(),this},c.prototype.clearCloseTimeout=function(){this.closeTimeout&&(clearTimeout(this.closeTimeout),this.closeTimeout=null)},c.prototype.clearTimeouts=function(){this.clearCloseTimeout(),this.reopenTimeout&&clearTimeout(this.reopenTimeout)},c.prototype.packet=function(a){this.send(b.parser.encodePacket(a))},c.prototype.onHeartbeat=function(a){this.packet({type:"heartbeat"})},c.prototype.onOpen=function(){this.isOpen=!0,this.clearCloseTimeout(),this.socket.onOpen()},c.prototype.onClose=function(){var a=this;this.isOpen=!1,this.socket.onClose(),this.onDisconnect()},c.prototype.prepareUrl=function(){var a=this.socket.options;return this.scheme()+"://"+a.host+":"+a.port+"/"+a.resource+"/"+b.protocol+"/"+this.name+"/"+this.sessid},c.prototype.ready=function(a,b){b.call(this)}}("undefined"!=typeof io?io:module.exports,"undefined"!=typeof io?io:module.parent.exports),function(a,b,c){function d(a){this.options={port:80,secure:!1,document:"document"in c?document:!1,resource:"socket.io",transports:b.transports,"connect timeout":1e4,"try multiple transports":!0,reconnect:!0,"reconnection delay":500,"reconnection limit":Infinity,"reopen delay":3e3,"max reconnection attempts":10,"sync disconnect on unload":!1,"auto connect":!0,"flash policy port":10843,manualFlush:!1},b.util.merge(this.options,a),this.connected=!1,this.open=!1,this.connecting=!1,this.reconnecting=!1,this.namespaces={},this.buffer=[],this.doBuffer=!1;if(this.options["sync disconnect on unload"]&&(!this.isXDomain()||b.util.ua.hasCORS)){var d=this;b.util.on(c,"beforeunload",function(){d.disconnectSync()},!1)}this.options["auto connect"]&&this.connect()}function e(){}a.Socket=d,b.util.mixin(d,b.EventEmitter),d.prototype.of=function(a){return this.namespaces[a]||(this.namespaces[a]=new b.SocketNamespace(this,a),a!==""&&this.namespaces[a].packet({type:"connect"})),this.namespaces[a]},d.prototype.publish=function(){this.emit.apply(this,arguments);var a;for(var b in this.namespaces)this.namespaces.hasOwnProperty(b)&&(a=this.of(b),a.$emit.apply(a,arguments))},d.prototype.handshake=function(a){function f(b){b instanceof Error?(c.connecting=!1,c.onError(b.message)):a.apply(null,b.split(":"))}var c=this,d=this.options,g=["http"+(d.secure?"s":"")+":/",d.host+":"+d.port,d.resource,b.protocol,b.util.query(this.options.query,"t="+ +(new Date))].join("/");if(this.isXDomain()&&!b.util.ua.hasCORS){var h=document.getElementsByTagName("script")[0],i=document.createElement("script");i.src=g+"&jsonp="+b.j.length,h.parentNode.insertBefore(i,h),b.j.push(function(a){f(a),i.parentNode.removeChild(i)})}else{var j=b.util.request();j.open("GET",g,!0),this.isXDomain()&&(j.withCredentials=!0),j.onreadystatechange=function(){j.readyState==4&&(j.onreadystatechange=e,j.status==200?f(j.responseText):j.status==403?c.onError(j.responseText):(c.connecting=!1,!c.reconnecting&&c.onError(j.responseText)))},j.send(null)}},d.prototype.getTransport=function(a){var c=a||this.transports,d;for(var e=0,f;f=c[e];e++)if(b.Transport[f]&&b.Transport[f].check(this)&&(!this.isXDomain()||b.Transport[f].xdomainCheck(this)))return new b.Transport[f](this,this.sessionid);return null},d.prototype.connect=function(a){if(this.connecting)return this;var c=this;return c.connecting=!0,this.handshake(function(d,e,f,g){function h(a){c.transport&&c.transport.clearTimeouts(),c.transport=c.getTransport(a);if(!c.transport)return c.publish("connect_failed");c.transport.ready(c,function(){c.connecting=!0,c.publish("connecting",c.transport.name),c.transport.open(),c.options["connect timeout"]&&(c.connectTimeoutTimer=setTimeout(function(){if(!c.connected){c.connecting=!1;if(c.options["try multiple transports"]){var a=c.transports;while(a.length>0&&a.splice(0,1)[0]!=c.transport.name);a.length?h(a):c.publish("connect_failed")}}},c.options["connect timeout"]))})}c.sessionid=d,c.closeTimeout=f*1e3,c.heartbeatTimeout=e*1e3,c.transports||(c.transports=c.origTransports=g?b.util.intersect(g.split(","),c.options.transports):c.options.transports),c.setHeartbeatTimeout(),h(c.transports),c.once("connect",function(){clearTimeout(c.connectTimeoutTimer),a&&typeof a=="function"&&a()})}),this},d.prototype.setHeartbeatTimeout=function(){clearTimeout(this.heartbeatTimeoutTimer);if(this.transport&&!this.transport.heartbeats())return;var a=this;this.heartbeatTimeoutTimer=setTimeout(function(){a.transport.onClose()},this.heartbeatTimeout)},d.prototype.packet=function(a){return this.connected&&!this.doBuffer?this.transport.packet(a):this.buffer.push(a),this},d.prototype.setBuffer=function(a){this.doBuffer=a,!a&&this.connected&&this.buffer.length&&(this.options.manualFlush||this.flushBuffer())},d.prototype.flushBuffer=function(){this.transport.payload(this.buffer),this.buffer=[]},d.prototype.disconnect=function(){if(this.connected||this.connecting)this.open&&this.of("").packet({type:"disconnect"}),this.onDisconnect("booted");return this},d.prototype.disconnectSync=function(){var a=b.util.request(),c=["http"+(this.options.secure?"s":"")+":/",this.options.host+":"+this.options.port,this.options.resource,b.protocol,"",this.sessionid].join("/")+"/?disconnect=1";a.open("GET",c,!1),a.send(null),this.onDisconnect("booted")},d.prototype.isXDomain=function(){var a=c.location.port||("https:"==c.location.protocol?443:80);return this.options.host!==c.location.hostname||this.options.port!=a},d.prototype.onConnect=function(){this.connected||(this.connected=!0,this.connecting=!1,this.doBuffer||this.setBuffer(!1),this.emit("connect"))},d.prototype.onOpen=function(){this.open=!0},d.prototype.onClose=function(){this.open=!1,clearTimeout(this.heartbeatTimeoutTimer)},d.prototype.onPacket=function(a){this.of(a.endpoint).onPacket(a)},d.prototype.onError=function(a){a&&a.advice&&a.advice==="reconnect"&&(this.connected||this.connecting)&&(this.disconnect(),this.options.reconnect&&this.reconnect()),this.publish("error",a&&a.reason?a.reason:a)},d.prototype.onDisconnect=function(a){var b=this.connected,c=this.connecting;this.connected=!1,this.connecting=!1,this.open=!1;if(b||c)this.transport.close(),this.transport.clearTimeouts(),b&&(this.publish("disconnect",a),"booted"!=a&&this.options.reconnect&&!this.reconnecting&&this.reconnect())},d.prototype.reconnect=function(){function e(){if(a.connected){for(var b in a.namespaces)a.namespaces.hasOwnProperty(b)&&""!==b&&a.namespaces[b].packet({type:"connect"});a.publish("reconnect",a.transport.name,a.reconnectionAttempts)}clearTimeout(a.reconnectionTimer),a.removeListener("connect_failed",f),a.removeListener("connect",f),a.reconnecting=!1,delete a.reconnectionAttempts,delete a.reconnectionDelay,delete a.reconnectionTimer,delete a.redoTransports,a.options["try multiple transports"]=c}function f(){if(!a.reconnecting)return;if(a.connected)return e();if(a.connecting&&a.reconnecting)return a.reconnectionTimer=setTimeout(f,1e3);a.reconnectionAttempts++>=b?a.redoTransports?(a.publish("reconnect_failed"),e()):(a.on("connect_failed",f),a.options["try multiple transports"]=!0,a.transports=a.origTransports,a.transport=a.getTransport(),a.redoTransports=!0,a.connect()):(a.reconnectionDelay<d&&(a.reconnectionDelay*=2),a.connect(),a.publish("reconnecting",a.reconnectionDelay,a.reconnectionAttempts),a.reconnectionTimer=setTimeout(f,a.reconnectionDelay))}this.reconnecting=!0,this.reconnectionAttempts=0,this.reconnectionDelay=this.options["reconnection delay"];var a=this,b=this.options["max reconnection attempts"],c=this.options["try multiple transports"],d=this.options["reconnection limit"];this.options["try multiple transports"]=!1,this.reconnectionTimer=setTimeout(f,this.reconnectionDelay),this.on("connect",f)}}("undefined"!=typeof io?io:module.exports,"undefined"!=typeof io?io:module.parent.exports,this),function(a,b){function c(a,b){this.socket=a,this.name=b||"",this.flags={},this.json=new d(this,"json"),this.ackPackets=0,this.acks={}}function d(a,b){this.namespace=a,this.name=b}a.SocketNamespace=c,b.util.mixin(c,b.EventEmitter),c.prototype.$emit=b.EventEmitter.prototype.emit,c.prototype.of=function(){return this.socket.of.apply(this.socket,arguments)},c.prototype.packet=function(a){return a.endpoint=this.name,this.socket.packet(a),this.flags={},this},c.prototype.send=function(a,b){var c={type:this.flags.json?"json":"message",data:a};return"function"==typeof b&&(c.id=++this.ackPackets,c.ack=!0,this.acks[c.id]=b),this.packet(c)},c.prototype.emit=function(a){var b=Array.prototype.slice.call(arguments,1),c=b[b.length-1],d={type:"event",name:a};return"function"==typeof c&&(d.id=++this.ackPackets,d.ack="data",this.acks[d.id]=c,b=b.slice(0,b.length-1)),d.args=b,this.packet(d)},c.prototype.disconnect=function(){return this.name===""?this.socket.disconnect():(this.packet({type:"disconnect"}),this.$emit("disconnect")),this},c.prototype.onPacket=function(a){function d(){c.packet({type:"ack",args:b.util.toArray(arguments),ackId:a.id})}var c=this;switch(a.type){case"connect":this.$emit("connect");break;case"disconnect":this.name===""?this.socket.onDisconnect(a.reason||"booted"):this.$emit("disconnect",a.reason);break;case"message":case"json":var e=["message",a.data];a.ack=="data"?e.push(d):a.ack&&this.packet({type:"ack",ackId:a.id}),this.$emit.apply(this,e);break;case"event":var e=[a.name].concat(a.args);a.ack=="data"&&e.push(d),this.$emit.apply(this,e);break;case"ack":this.acks[a.ackId]&&(this.acks[a.ackId].apply(this,a.args),delete this.acks[a.ackId]);break;case"error":a.advice?this.socket.onError(a):a.reason=="unauthorized"?this.$emit("connect_failed",a.reason):this.$emit("error",a.reason)}},d.prototype.send=function(){this.namespace.flags[this.name]=!0,this.namespace.send.apply(this.namespace,arguments)},d.prototype.emit=function(){this.namespace.flags[this.name]=!0,this.namespace.emit.apply(this.namespace,arguments)}}("undefined"!=typeof io?io:module.exports,"undefined"!=typeof io?io:module.parent.exports),function(a,b,c){function d(a){b.Transport.apply(this,arguments)}a.websocket=d,b.util.inherit(d,b.Transport),d.prototype.name="websocket",d.prototype.open=function(){var a=b.util.query(this.socket.options.query),d=this,e;return e||(e=c.MozWebSocket||c.WebSocket),this.websocket=new e(this.prepareUrl()+a),this.websocket.onopen=function(){d.onOpen(),d.socket.setBuffer(!1)},this.websocket.onmessage=function(a){d.onData(a.data)},this.websocket.onclose=function(){d.onClose(),d.socket.setBuffer(!0)},this.websocket.onerror=function(a){d.onError(a)},this},b.util.ua.iDevice?d.prototype.send=function(a){var b=this;return setTimeout(function(){b.websocket.send(a)},0),this}:d.prototype.send=function(a){return this.websocket.send(a),this},d.prototype.payload=function(a){for(var b=0,c=a.length;b<c;b++)this.packet(a[b]);return this},d.prototype.close=function(){return this.websocket.close(),this},d.prototype.onError=function(a){this.socket.onError(a)},d.prototype.scheme=function(){return this.socket.options.secure?"wss":"ws"},d.check=function(){return"WebSocket"in c&&!("__addTask"in WebSocket)||"MozWebSocket"in c},d.xdomainCheck=function(){return!0},b.transports.push("websocket")}("undefined"!=typeof io?io.Transport:module.exports,"undefined"!=typeof io?io:module.parent.exports,this),function(a,b){function c(){b.Transport.websocket.apply(this,arguments)}a.flashsocket=c,b.util.inherit(c,b.Transport.websocket),c.prototype.name="flashsocket",c.prototype.open=function(){var a=this,c=arguments;return WebSocket.__addTask(function(){b.Transport.websocket.prototype.open.apply(a,c)}),this},c.prototype.send=function(){var a=this,c=arguments;return WebSocket.__addTask(function(){b.Transport.websocket.prototype.send.apply(a,c)}),this},c.prototype.close=function(){return WebSocket.__tasks.length=0,b.Transport.websocket.prototype.close.call(this),this},c.prototype.ready=function(a,d){function e(){var b=a.options,e=b["flash policy port"],g=["http"+(b.secure?"s":"")+":/",b.host+":"+b.port,b.resource,"static/flashsocket","WebSocketMain"+(a.isXDomain()?"Insecure":"")+".swf"];c.loaded||(typeof WEB_SOCKET_SWF_LOCATION=="undefined"&&(WEB_SOCKET_SWF_LOCATION=g.join("/")),e!==843&&WebSocket.loadFlashPolicyFile("xmlsocket://"+b.host+":"+e),WebSocket.__initialize(),c.loaded=!0),d.call(f)}var f=this;if(document.body)return e();b.util.load(e)},c.check=function(){return typeof WebSocket!="undefined"&&"__initialize"in WebSocket&&!!swfobject?swfobject.getFlashPlayerVersion().major>=10:!1},c.xdomainCheck=function(){return!0},typeof window!="undefined"&&(WEB_SOCKET_DISABLE_AUTO_INITIALIZATION=!0),b.transports.push("flashsocket")}("undefined"!=typeof io?io.Transport:module.exports,"undefined"!=typeof io?io:module.parent.exports);if("undefined"!=typeof window)var swfobject=function(){function A(){if(t)return;try{var a=i.getElementsByTagName("body")[0].appendChild(Q("span"));a.parentNode.removeChild(a)}catch(b){return}t=!0;var c=l.length;for(var d=0;d<c;d++)l[d]()}function B(a){t?a():l[l.length]=a}function C(b){if(typeof h.addEventListener!=a)h.addEventListener("load",b,!1);else if(typeof i.addEventListener!=a)i.addEventListener("load",b,!1);else if(typeof h.attachEvent!=a)R(h,"onload",b);else if(typeof h.onload=="function"){var c=h.onload;h.onload=function(){c(),b()}}else h.onload=b}function D(){k?E():F()}function E(){var c=i.getElementsByTagName("body")[0],d=Q(b);d.setAttribute("type",e);var f=c.appendChild(d);if(f){var g=0;(function(){if(typeof f.GetVariable!=a){var b=f.GetVariable("$version");b&&(b=b.split(" ")[1].split(","),y.pv=[parseInt(b[0],10),parseInt(b[1],10),parseInt(b[2],10)])}else if(g<10){g++,setTimeout(arguments.callee,10);return}c.removeChild(d),f=null,F()})()}else F()}function F(){var b=m.length;if(b>0)for(var c=0;c<b;c++){var d=m[c].id,e=m[c].callbackFn,f={success:!1,id:d};if(y.pv[0]>0){var g=P(d);if(g)if(S(m[c].swfVersion)&&!(y.wk&&y.wk<312))U(d,!0),e&&(f.success=!0,f.ref=G(d),e(f));else if(m[c].expressInstall&&H()){var h={};h.data=m[c].expressInstall,h.width=g.getAttribute("width")||"0",h.height=g.getAttribute("height")||"0",g.getAttribute("class")&&(h.styleclass=g.getAttribute("class")),g.getAttribute("align")&&(h.align=g.getAttribute("align"));var i={},j=g.getElementsByTagName("param"),k=j.length;for(var l=0;l<k;l++)j[l].getAttribute("name").toLowerCase()!="movie"&&(i[j[l].getAttribute("name")]=j[l].getAttribute("value"));I(h,i,d,e)}else J(g),e&&e(f)}else{U(d,!0);if(e){var n=G(d);n&&typeof n.SetVariable!=a&&(f.success=!0,f.ref=n),e(f)}}}}function G(c){var d=null,e=P(c);if(e&&e.nodeName=="OBJECT")if(typeof e.SetVariable!=a)d=e;else{var f=e.getElementsByTagName(b)[0];f&&(d=f)}return d}function H(){return!u&&S("6.0.65")&&(y.win||y.mac)&&!(y.wk&&y.wk<312)}function I(b,c,d,e){u=!0,r=e||null,s={success:!1,id:d};var g=P(d);if(g){g.nodeName=="OBJECT"?(p=K(g),q=null):(p=g,q=d),b.id=f;if(typeof b.width==a||!/%$/.test(b.width)&&parseInt(b.width,10)<310)b.width="310";if(typeof b.height==a||!/%$/.test(b.height)&&parseInt(b.height,10)<137)b.height="137";i.title=i.title.slice(0,47)+" - Flash Player Installation";var j=y.ie&&y.win?["Active"].concat("").join("X"):"PlugIn",k="MMredirectURL="+h.location.toString().replace(/&/g,"%26")+"&MMplayerType="+j+"&MMdoctitle="+i.title;typeof c.flashvars!=a?c.flashvars+="&"+k:c.flashvars=k;if(y.ie&&y.win&&g.readyState!=4){var l=Q("div");d+="SWFObjectNew",l.setAttribute("id",d),g.parentNode.insertBefore(l,g),g.style.display="none",function(){g.readyState==4?g.parentNode.removeChild(g):setTimeout(arguments.callee,10)}()}L(b,c,d)}}function J(a){if(y.ie&&y.win&&a.readyState!=4){var b=Q("div");a.parentNode.insertBefore(b,a),b.parentNode.replaceChild(K(a),b),a.style.display="none",function(){a.readyState==4?a.parentNode.removeChild(a):setTimeout(arguments.callee,10)}()}else a.parentNode.replaceChild(K(a),a)}function K(a){var c=Q("div");if(y.win&&y.ie)c.innerHTML=a.innerHTML;else{var d=a.getElementsByTagName(b)[0];if(d){var e=d.childNodes;if(e){var f=e.length;for(var g=0;g<f;g++)(e[g].nodeType!=1||e[g].nodeName!="PARAM")&&e[g].nodeType!=8&&c.appendChild(e[g].cloneNode(!0))}}}return c}function L(c,d,f){var g,h=P(f);if(y.wk&&y.wk<312)return g;if(h){typeof c.id==a&&(c.id=f);if(y.ie&&y.win){var i="";for(var j in c)c[j]!=Object.prototype[j]&&(j.toLowerCase()=="data"?d.movie=c[j]:j.toLowerCase()=="styleclass"?i+=' class="'+c[j]+'"':j.toLowerCase()!="classid"&&(i+=" "+j+'="'+c[j]+'"'));var k="";for(var l in d)d[l]!=Object.prototype[l]&&(k+='<param name="'+l+'" value="'+d[l]+'" />');h.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+i+">"+k+"</object>",n[n.length]=c.id,g=P(c.id)}else{var m=Q(b);m.setAttribute("type",e);for(var o in c)c[o]!=Object.prototype[o]&&(o.toLowerCase()=="styleclass"?m.setAttribute("class",c[o]):o.toLowerCase()!="classid"&&m.setAttribute(o,c[o]));for(var p in d)d[p]!=Object.prototype[p]&&p.toLowerCase()!="movie"&&M(m,p,d[p]);h.parentNode.replaceChild(m,h),g=m}}return g}function M(a,b,c){var d=Q("param");d.setAttribute("name",b),d.setAttribute("value",c),a.appendChild(d)}function N(a){var b=P(a);b&&b.nodeName=="OBJECT"&&(y.ie&&y.win?(b.style.display="none",function(){b.readyState==4?O(a):setTimeout(arguments.callee,10)}()):b.parentNode.removeChild(b))}function O(a){var b=P(a);if(b){for(var c in b)typeof b[c]=="function"&&(b[c]=null);b.parentNode.removeChild(b)}}function P(a){var b=null;try{b=i.getElementById(a)}catch(c){}return b}function Q(a){return i.createElement(a)}function R(a,b,c){a.attachEvent(b,c),o[o.length]=[a,b,c]}function S(a){var b=y.pv,c=a.split(".");return c[0]=parseInt(c[0],10),c[1]=parseInt(c[1],10)||0,c[2]=parseInt(c[2],10)||0,b[0]>c[0]||b[0]==c[0]&&b[1]>c[1]||b[0]==c[0]&&b[1]==c[1]&&b[2]>=c[2]?!0:!1}function T(c,d,e,f){if(y.ie&&y.mac)return;var g=i.getElementsByTagName("head")[0];if(!g)return;var h=e&&typeof e=="string"?e:"screen";f&&(v=null,w=null);if(!v||w!=h){var j=Q("style");j.setAttribute("type","text/css"),j.setAttribute("media",h),v=g.appendChild(j),y.ie&&y.win&&typeof i.styleSheets!=a&&i.styleSheets.length>0&&(v=i.styleSheets[i.styleSheets.length-1]),w=h}y.ie&&y.win?v&&typeof v.addRule==b&&v.addRule(c,d):v&&typeof i.createTextNode!=a&&v.appendChild(i.createTextNode(c+" {"+d+"}"))}function U(a,b){if(!x)return;var c=b?"visible":"hidden";t&&P(a)?P(a).style.visibility=c:T("#"+a,"visibility:"+c)}function V(b){var c=/[\\\"<>\.;]/,d=c.exec(b)!=null;return d&&typeof encodeURIComponent!=a?encodeURIComponent(b):b}var a="undefined",b="object",c="Shockwave Flash",d="ShockwaveFlash.ShockwaveFlash",e="application/x-shockwave-flash",f="SWFObjectExprInst",g="onreadystatechange",h=window,i=document,j=navigator,k=!1,l=[D],m=[],n=[],o=[],p,q,r,s,t=!1,u=!1,v,w,x=!0,y=function(){var f=typeof i.getElementById!=a&&typeof i.getElementsByTagName!=a&&typeof i.createElement!=a,g=j.userAgent.toLowerCase(),l=j.platform.toLowerCase(),m=l?/win/.test(l):/win/.test(g),n=l?/mac/.test(l):/mac/.test(g),o=/webkit/.test(g)?parseFloat(g.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):!1,p=!1,q=[0,0,0],r=null;if(typeof j.plugins!=a&&typeof j.plugins[c]==b)r=j.plugins[c].description,r&&(typeof j.mimeTypes==a||!j.mimeTypes[e]||!!j.mimeTypes[e].enabledPlugin)&&(k=!0,p=!1,r=r.replace(/^.*\s+(\S+\s+\S+$)/,"$1"),q[0]=parseInt(r.replace(/^(.*)\..*$/,"$1"),10),q[1]=parseInt(r.replace(/^.*\.(.*)\s.*$/,"$1"),10),q[2]=/[a-zA-Z]/.test(r)?parseInt(r.replace(/^.*[a-zA-Z]+(.*)$/,"$1"),10):0);else if(typeof h[["Active"].concat("Object").join("X")]!=a)try{var s=new(window[["Active"].concat("Object").join("X")])(d);s&&(r=s.GetVariable("$version"),r&&(p=!0,r=r.split(" ")[1].split(","),q=[parseInt(r[0],10),parseInt(r[1],10),parseInt(r[2],10)]))}catch(t){}return{w3:f,pv:q,wk:o,ie:p,win:m,mac:n}}(),z=function(){if(!y.w3)return;(typeof i.readyState!=a&&i.readyState=="complete"||typeof i.readyState==a&&(i.getElementsByTagName("body")[0]||i.body))&&A(),t||(typeof i.addEventListener!=a&&i.addEventListener("DOMContentLoaded",A,!1),y.ie&&y.win&&(i.attachEvent(g,function(){i.readyState=="complete"&&(i.detachEvent(g,arguments.callee),A())}),h==top&&function(){if(t)return;try{i.documentElement.doScroll("left")}catch(a){setTimeout(arguments.callee,0);return}A()}()),y.wk&&function(){if(t)return;if(!/loaded|complete/.test(i.readyState)){setTimeout(arguments.callee,0);return}A()}(),C(A))}(),W=function(){y.ie&&y.win&&window.attachEvent("onunload",function(){var a=o.length;for(var b=0;b<a;b++)o[b][0].detachEvent(o[b][1],o[b][2]);var c=n.length;for(var d=0;d<c;d++)N(n[d]);for(var e in y)y[e]=null;y=null;for(var f in swfobject)swfobject[f]=null;swfobject=null})}();return{registerObject:function(a,b,c,d){if(y.w3&&a&&b){var e={};e.id=a,e.swfVersion=b,e.expressInstall=c,e.callbackFn=d,m[m.length]=e,U(a,!1)}else d&&d({success:!1,id:a})},getObjectById:function(a){if(y.w3)return G(a)},embedSWF:function(c,d,e,f,g,h,i,j,k,l){var m={success:!1,id:d};y.w3&&!(y.wk&&y.wk<312)&&c&&d&&e&&f&&g?(U(d,!1),B(function(){e+="",f+="";var n={};if(k&&typeof k===b)for(var o in k)n[o]=k[o];n.data=c,n.width=e,n.height=f;var p={};if(j&&typeof j===b)for(var q in j)p[q]=j[q];if(i&&typeof i===b)for(var r in i)typeof p.flashvars!=a?p.flashvars+="&"+r+"="+i[r]:p.flashvars=r+"="+i[r];if(S(g)){var s=L(n,p,d);n.id==d&&U(d,!0),m.success=!0,m.ref=s}else{if(h&&H()){n.data=h,I(n,p,d,l);return}U(d,!0)}l&&l(m)})):l&&l(m)},switchOffAutoHideShow:function(){x=!1},ua:y,getFlashPlayerVersion:function(){return{major:y.pv[0],minor:y.pv[1],release:y.pv[2]}},hasFlashPlayerVersion:S,createSWF:function(a,b,c){return y.w3?L(a,b,c):undefined},showExpressInstall:function(a,b,c,d){y.w3&&H()&&I(a,b,c,d)},removeSWF:function(a){y.w3&&N(a)},createCSS:function(a,b,c,d){y.w3&&T(a,b,c,d)},addDomLoadEvent:B,addLoadEvent:C,getQueryParamValue:function(a){var b=i.location.search||i.location.hash;if(b){/\?/.test(b)&&(b=b.split("?")[1]);if(a==null)return V(b);var c=b.split("&");for(var d=0;d<c.length;d++)if(c[d].substring(0,c[d].indexOf("="))==a)return V(c[d].substring(c[d].indexOf("=")+1))}return""},expressInstallCallback:function(){if(u){var a=P(f);a&&p&&(a.parentNode.replaceChild(p,a),q&&(U(q,!0),y.ie&&y.win&&(p.style.display="block")),r&&r(s)),u=!1}}}}();(function(){if("undefined"==typeof window||window.WebSocket)return;var a=window.console;if(!a||!a.log||!a.error)a={log:function(){},error:function(){}};if(!swfobject.hasFlashPlayerVersion("10.0.0")){a.error("Flash Player >= 10.0.0 is required.");return}location.protocol=="file:"&&a.error("WARNING: web-socket-js doesn't work in file:///... URL unless you set Flash Security Settings properly. Open the page via Web server i.e. http://..."),WebSocket=function(a,b,c,d,e){var f=this;f.__id=WebSocket.__nextId++,WebSocket.__instances[f.__id]=f,f.readyState=WebSocket.CONNECTING,f.bufferedAmount=0,f.__events={},b?typeof b=="string"&&(b=[b]):b=[],setTimeout(function(){WebSocket.__addTask(function(){WebSocket.__flash.create(f.__id,a,b,c||null,d||0,e||null)})},0)},WebSocket.prototype.send=function(a){if(this.readyState==WebSocket.CONNECTING)throw"INVALID_STATE_ERR: Web Socket connection has not been established";var b=WebSocket.__flash.send(this.__id,encodeURIComponent(a));return b<0?!0:(this.bufferedAmount+=b,!1)},WebSocket.prototype.close=function(){if(this.readyState==WebSocket.CLOSED||this.readyState==WebSocket.CLOSING)return;this.readyState=WebSocket.CLOSING,WebSocket.__flash.close(this.__id)},WebSocket.prototype.addEventListener=function(a,b,c){a in this.__events||(this.__events[a]=[]),this.__events[a].push(b)},WebSocket.prototype.removeEventListener=function(a,b,c){if(!(a in this.__events))return;var d=this.__events[a];for(var e=d.length-1;e>=0;--e)if(d[e]===b){d.splice(e,1);break}},WebSocket.prototype.dispatchEvent=function(a){var b=this.__events[a.type]||[];for(var c=0;c<b.length;++c)b[c](a);var d=this["on"+a.type];d&&d(a)},WebSocket.prototype.__handleEvent=function(a){"readyState"in a&&(this.readyState=a.readyState),"protocol"in a&&(this.protocol=a.protocol);var b;if(a.type=="open"||a.type=="error")b=this.__createSimpleEvent(a.type);else if(a.type=="close")b=this.__createSimpleEvent("close");else{if(a.type!="message")throw"unknown event type: "+a.type;var c=decodeURIComponent(a.message);b=this.__createMessageEvent("message",c)}this.dispatchEvent(b)},WebSocket.prototype.__createSimpleEvent=function(a){if(document.createEvent&&window.Event){var b=document.createEvent("Event");return b.initEvent(a,!1,!1),b}return{type:a,bubbles:!1,cancelable:!1}},WebSocket.prototype.__createMessageEvent=function(a,b){if(document.createEvent&&window.MessageEvent&&!window.opera){var c=document.createEvent("MessageEvent");return c.initMessageEvent("message",!1,!1,b,null,null,window,null),c}return{type:a,data:b,bubbles:!1,cancelable:!1}},WebSocket.CONNECTING=0,WebSocket.OPEN=1,WebSocket.CLOSING=2,WebSocket.CLOSED=3,WebSocket.__flash=null,WebSocket.__instances={},WebSocket.__tasks=[],WebSocket.__nextId=0,WebSocket.loadFlashPolicyFile=function(a){WebSocket.__addTask(function(){WebSocket.__flash.loadManualPolicyFile(a)})},WebSocket.__initialize=function(){if(WebSocket.__flash)return;WebSocket.__swfLocation&&(window.WEB_SOCKET_SWF_LOCATION=WebSocket.__swfLocation);if(!window.WEB_SOCKET_SWF_LOCATION){a.error("[WebSocket] set WEB_SOCKET_SWF_LOCATION to location of WebSocketMain.swf");return}var b=document.createElement("div");b.id="webSocketContainer",b.style.position="absolute",WebSocket.__isFlashLite()?(b.style.left="0px",b.style.top="0px"):(b.style.left="-100px",b.style.top="-100px");var c=document.createElement("div");c.id="webSocketFlash",b.appendChild(c),document.body.appendChild(b),swfobject.embedSWF(WEB_SOCKET_SWF_LOCATION,"webSocketFlash","1","1","10.0.0",null,null,{hasPriority:!0,swliveconnect:!0,allowScriptAccess:"always"},null,function(b){b.success||a.error("[WebSocket] swfobject.embedSWF failed")})},WebSocket.__onFlashInitialized=function(){setTimeout(function(){WebSocket.__flash=document.getElementById("webSocketFlash"),WebSocket.__flash.setCallerUrl(location.href),WebSocket.__flash.setDebug(!!window.WEB_SOCKET_DEBUG);for(var a=0;a<WebSocket.__tasks.length;++a)WebSocket.__tasks[a]();WebSocket.__tasks=[]},0)},WebSocket.__onFlashEvent=function(){return setTimeout(function(){try{var b=WebSocket.__flash.receiveEvents();for(var c=0;c<b.length;++c)WebSocket.__instances[b[c].webSocketId].__handleEvent(b[c])}catch(d){a.error(d)}},0),!0},WebSocket.__log=function(b){a.log(decodeURIComponent(b))},WebSocket.__error=function(b){a.error(decodeURIComponent(b))},WebSocket.__addTask=function(a){WebSocket.__flash?a():WebSocket.__tasks.push(a)},WebSocket.__isFlashLite=function(){if(!window.navigator||!window.navigator.mimeTypes)return!1;var a=window.navigator.mimeTypes["application/x-shockwave-flash"];return!a||!a.enabledPlugin||!a.enabledPlugin.filename?!1:a.enabledPlugin.filename.match(/flashlite/i)?!0:!1},window.WEB_SOCKET_DISABLE_AUTO_INITIALIZATION||(window.addEventListener?window.addEventListener("load",function(){WebSocket.__initialize()},!1):window.attachEvent("onload",function(){WebSocket.__initialize()}))})(),function(a,b,c){function d(a){if(!a)return;b.Transport.apply(this,arguments),this.sendBuffer=[]}function e(){}a.XHR=d,b.util.inherit(d,b.Transport),d.prototype.open=function(){return this.socket.setBuffer(!1),this.onOpen(),this.get(),this.setCloseTimeout(),this},d.prototype.payload=function(a){var c=[];for(var d=0,e=a.length;d<e;d++)c.push(b.parser.encodePacket(a[d]));this.send(b.parser.encodePayload(c))},d.prototype.send=function(a){return this.post(a),this},d.prototype.post=function(a){function d(){this.readyState==4&&(this.onreadystatechange=e,b.posting=!1,this.status==200?b.socket.setBuffer(!1):b.onClose())}function f(){this.onload=e,b.socket.setBuffer(!1)}var b=this;this.socket.setBuffer(!0),this.sendXHR=this.request("POST"),c.XDomainRequest&&this.sendXHR instanceof XDomainRequest?this.sendXHR.onload=this.sendXHR.onerror=f:this.sendXHR.onreadystatechange=d,this.sendXHR.send(a)},d.prototype.close=function(){return this.onClose(),this},d.prototype.request=function(a){var c=b.util.request(this.socket.isXDomain()),d=b.util.query(this.socket.options.query,"t="+ +(new Date));c.open(a||"GET",this.prepareUrl()+d,!0);if(a=="POST")try{c.setRequestHeader?c.setRequestHeader("Content-type","text/plain;charset=UTF-8"):c.contentType="text/plain"}catch(e){}return c},d.prototype.scheme=function(){return this.socket.options.secure?"https":"http"},d.check=function(a,d){try{var e=b.util.request(d),f=c.XDomainRequest&&e instanceof XDomainRequest,g=a&&a.options&&a.options.secure?"https:":"http:",h=c.location&&g!=c.location.protocol;if(e&&(!f||!h))return!0}catch(i){}return!1},d.xdomainCheck=function(a){return d.check(a,!0)}}("undefined"!=typeof io?io.Transport:module.exports,"undefined"!=typeof io?io:module.parent.exports,this),function(a,b){function c(a){b.Transport.XHR.apply(this,arguments)}a.htmlfile=c,b.util.inherit(c,b.Transport.XHR),c.prototype.name="htmlfile",c.prototype.get=function(){this.doc=new(window[["Active"].concat("Object").join("X")])("htmlfile"),this.doc.open(),this.doc.write("<html></html>"),this.doc.close(),this.doc.parentWindow.s=this;var a=this.doc.createElement("div");a.className="socketio",this.doc.body.appendChild(a),this.iframe=this.doc.createElement("iframe"),a.appendChild(this.iframe);var c=this,d=b.util.query(this.socket.options.query,"t="+ +(new Date));this.iframe.src=this.prepareUrl()+d,b.util.on(window,"unload",function(){c.destroy()})},c.prototype._=function(a,b){this.onData(a);try{var c=b.getElementsByTagName("script")[0];c.parentNode.removeChild(c)}catch(d){}},c.prototype.destroy=function(){if(this.iframe){try{this.iframe.src="about:blank"}catch(a){}this.doc=null,this.iframe.parentNode.removeChild(this.iframe),this.iframe=null,CollectGarbage()}},c.prototype.close=function(){return this.destroy(),b.Transport.XHR.prototype.close.call(this)},c.check=function(a){if(typeof window!="undefined"&&["Active"].concat("Object").join("X")in window)try{var c=new(window[["Active"].concat("Object").join("X")])("htmlfile");return c&&b.Transport.XHR.check(a)}catch(d){}return!1},c.xdomainCheck=function(){return!1},b.transports.push("htmlfile")}("undefined"!=typeof io?io.Transport:module.exports,"undefined"!=typeof io?io:module.parent.exports),function(a,b,c){function d(){b.Transport.XHR.apply(this,arguments)}function e(){}a["xhr-polling"]=d,b.util.inherit(d,b.Transport.XHR),b.util.merge(d,b.Transport.XHR),d.prototype.name="xhr-polling",d.prototype.heartbeats=function(){return!1},d.prototype.open=function(){var a=this;return b.Transport.XHR.prototype.open.call(a),!1},d.prototype.get=function(){function b(){this.readyState==4&&(this.onreadystatechange=e,this.status==200?(a.onData(this.responseText),a.get()):a.onClose())}function d(){this.onload=e,this.onerror=e,a.retryCounter=1,a.onData(this.responseText),a.get()}function f(){a.retryCounter++,!a.retryCounter||a.retryCounter>3?a.onClose():a.get()}if(!this.isOpen)return;var a=this;this.xhr=this.request(),c.XDomainRequest&&this.xhr instanceof XDomainRequest?(this.xhr.onload=d,this.xhr.onerror=f):this.xhr.onreadystatechange=b,this.xhr.send(null)},d.prototype.onClose=function(){b.Transport.XHR.prototype.onClose.call(this);if(this.xhr){this.xhr.onreadystatechange=this.xhr.onload=this.xhr.onerror=e;try{this.xhr.abort()}catch(a){}this.xhr=null}},d.prototype.ready=function(a,c){var d=this;b.util.defer(function(){c.call(d)})},b.transports.push("xhr-polling")}("undefined"!=typeof io?io.Transport:module.exports,"undefined"!=typeof io?io:module.parent.exports,this),function(a,b,c){function e(a){b.Transport["xhr-polling"].apply(this,arguments),this.index=b.j.length;var c=this;b.j.push(function(a){c._(a)})}var d=c.document&&"MozAppearance"in c.document.documentElement.style;a["jsonp-polling"]=e,b.util.inherit(e,b.Transport["xhr-polling"]),e.prototype.name="jsonp-polling",e.prototype.post=function(a){function i(){j(),c.socket.setBuffer(!1)}function j(){c.iframe&&c.form.removeChild(c.iframe);try{h=document.createElement('<iframe name="'+c.iframeId+'">')}catch(a){h=document.createElement("iframe"),h.name=c.iframeId}h.id=c.iframeId,c.form.appendChild(h),c.iframe=h}var c=this,d=b.util.query(this.socket.options.query,"t="+ +(new Date)+"&i="+this.index);if(!this.form){var e=document.createElement("form"),f=document.createElement("textarea"),g=this.iframeId="socketio_iframe_"+this.index,h;e.className="socketio",e.style.position="absolute",e.style.top="0px",e.style.left="0px",e.style.display="none",e.target=g,e.method="POST",e.setAttribute("accept-charset","utf-8"),f.name="d",e.appendChild(f),document.body.appendChild(e),this.form=e,this.area=f}this.form.action=this.prepareUrl()+d,j(),this.area.value=b.JSON.stringify(a);try{this.form.submit()}catch(k){}this.iframe.attachEvent?h.onreadystatechange=function(){c.iframe.readyState=="complete"&&i()}:this.iframe.onload=i,this.socket.setBuffer(!0)},e.prototype.get=function(){var a=this,c=document.createElement("script"),e=b.util.query(this.socket.options.query,"t="+ +(new Date)+"&i="+this.index);this.script&&(this.script.parentNode.removeChild(this.script),this.script=null),c.async=!0,c.src=this.prepareUrl()+e,c.onerror=function(){a.onClose()};var f=document.getElementsByTagName("script")[0];f.parentNode.insertBefore(c,f),this.script=c,d&&setTimeout(function(){var a=document.createElement("iframe");document.body.appendChild(a),document.body.removeChild(a)},100)},e.prototype._=function(a){return this.onData(a),this.isOpen&&this.get(),this},e.prototype.ready=function(a,c){var e=this;if(!d)return c.call(this);b.util.load(function(){c.call(e)})},e.check=function(){return"document"in c},e.xdomainCheck=function(){return!0},b.transports.push("jsonp-polling")}("undefined"!=typeof io?io.Transport:module.exports,"undefined"!=typeof io?io:module.parent.exports,this),typeof define=="function"&&define.amd&&define([],function(){return io})})();
      }
    ], [
      {
        /*
          /Users/Admin/Projects/Nitro/source/scripts/utils/event.coffee
        */

        'base': 7
      }, function(require, module, exports) {
        var Base;
        Base = require('base');
        return module.exports = new Base.Event();
      }
    ], [
      {
        /*
          /Users/Admin/Projects/Nitro/source/scripts/utils/config.coffee
        */

      }, function(require, module, exports) {
        var active, servers;
        servers = {
          official: 'sync.nitrotasks.com:443',
          localhost: 'localhost:8080'
        };
        active = servers.official;
        return module.exports = {
          sync: active,
          server: active + '/api',
          email: active + '/email'
        };
      }
    ], [
      {
        /*
          /Users/Admin/Projects/Nitro/source/scripts/languages/languages.coffee
        */

        './bg.json': 17,
        './bn-IN.json': 18,
        './en-pi.json': 19,
        './en-us.json': 20,
        './es-ES.json': 21,
        './nl.json': 22
      }, function(require, module, exports) {
        return module.exports = {
          'bg': require('./bg.json'),
          'bn-IN': require('./bn-IN.json'),
          'en-pi': require('./en-pi.json'),
          'en-us': require('./en-us.json'),
          'es-ES': require('./es-ES.json'),
          'nl': require('./nl.json')
        };
      }
    ], [
      {
        /*
          /Users/Admin/Projects/Nitro/source/scripts/languages/bg.json
        */

      }, function(require, module, exports) {
        return module.exports = {
          "Sign Up to Sync": "\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u0430\u0439 \u0441\u0435 \u0437\u0430 \u0441\u0438\u043d\u0445\u0440\u043e\u043d\u0438\u0437\u0430\u0446\u0438\u044f",
          "Lists": "\u0421\u043f\u0438\u0441\u044a\u0446\u0438",
          "Inbox": "\u0412\u0445\u043e\u0434\u044f\u0449\u0438",
          "All Tasks": "\u0412\u0441\u0438\u0447\u043a\u0438 \u0437\u0430\u0434\u0430\u0447\u0438",
          "Completed": "\u0417\u0430\u0432\u044a\u0440\u0448\u0435\u043d\u0430",
          "Notes": "\u0411\u0435\u043b\u0435\u0436\u043a\u0438",
          "Due Date": "\u0414\u0430\u0442\u0430",
          "Mark as completed": "\u041c\u0430\u0440\u043a\u0438\u0440\u0430\u0439 \u043a\u0430\u0442\u043e \u0437\u0430\u0432\u044a\u0440\u0448\u0435\u043d\u0430",
          "Set priority to low": "\u0417\u0430\u0434\u0430\u0439 \u043d\u0438\u0441\u044a\u043a \u043f\u0440\u0438\u043e\u0440\u0438\u0442\u0435\u0442",
          "Set priority to medium": "\u0417\u0430\u0434\u0430\u0439 \u0441\u0440\u0435\u0434\u0435\u043d \u043f\u0440\u0438\u043e\u0440\u0438\u0442\u0435\u0442",
          "Set priority to high": "\u0417\u0430\u0434\u0430\u0439 \u0432\u0438\u0441\u043e\u043a \u043f\u0440\u0438\u043e\u0440\u0438\u0442\u0435\u0442",
          "Are you sure you want to do that?": "\u041d\u0430\u0438\u0441\u0442\u0438\u043d\u0430 \u043b\u0438 \u0438\u0441\u043a\u0430\u0442\u0435 \u0434\u0430 \u043d\u0430\u043f\u0440\u0430\u0432\u0438\u0442\u0435 \u0442\u043e\u0432\u0430?",
          "No tasks could be found.": "\u041d\u044f\u043c\u0430 \u043d\u0430\u043c\u0435\u0440\u0435\u043d\u0438 \u0437\u0430\u0434\u0430\u0447\u0438.",
          "You haven't added any tasks to this list.": "\u041d\u0435 \u0441\u0442\u0435 \u0434\u043e\u0431\u0430\u0432\u0438\u043b\u0438 \u0437\u0430\u0434\u0430\u0447\u0438 \u043a\u044a\u043c \u0442\u043e\u0437\u0438 \u0441\u043f\u0438\u0441\u044a\u043a.",
          "There are no tasks in here.": "\u041d\u044f\u043c\u0430 \u0437\u0430\u0434\u0430\u0447\u0438 \u0442\u0443\u043a.",
          "Yes, delete it": "\u0414\u0430, \u0438\u0437\u0442\u0440\u0438\u0439 \u0433\u043e",
          "No, keep it": "\u041d\u0435, \u0437\u0430\u0434\u0440\u044a\u0436 \u0433\u043e",
          "Copy the data below and keep it in a safe place. To restore from a backup, simply replace the data and use the import button.": "\u041a\u043e\u043f\u0438\u0440\u0430\u0439 \u0434\u0430\u043d\u043d\u0438\u0442\u0435 \u043f\u043e-\u0434\u043e\u043b\u0443 \u0438 \u0433\u0438 \u043f\u0430\u0437\u0438 \u043d\u0430 \u0441\u0438\u0433\u0443\u0440\u043d\u043e \u043c\u044f\u0441\u0442\u043e. \u0417\u0430 \u0434\u0430 \u0432\u044a\u0437\u0441\u0442\u0430\u043d\u043e\u0432\u0438\u0442\u0435 \u0434\u0430\u043d\u043d\u0438\u0442\u0435 \u043e\u0442 \u0440\u0435\u0437\u0435\u0440\u0432\u043d\u043e \u043a\u043e\u043f\u0438\u0435, \u043f\u0440\u043e\u0441\u0442\u043e \u0437\u0430\u043c\u0435\u0441\u0442\u0432\u0430\u0442\u0435 \u0434\u0430\u043d\u043d\u0438\u0442\u0435 \u0438\u0437\u043f\u043e\u043b\u0437\u0432\u0430\u0439\u043a\u0438 \u0431\u0443\u0442\u043e\u043d\u0430 \u0437\u0430 \u0438\u043c\u043f\u043e\u0440\u0442\u0438\u0440\u0430\u043d\u0435.",
          "Import": "\u0418\u043c\u043f\u043e\u0440\u0442\u0438\u0440\u0430\u043d\u0435",
          "Close": "\u0417\u0430\u0442\u0432\u043e\u0440\u0438",
          "Where should the tasks be sent?": "\u041a\u044a\u0434\u0435\u0442\u043e \u0442\u0440\u044f\u0431\u0432\u0430 \u0437\u0430\u0434\u0430\u0447\u0438\u0442\u0435 \u0434\u0430 \u0431\u044a\u0434\u0430\u0442 \u0438\u0437\u043f\u0440\u0430\u0442\u0435\u043d\u0438?",
          "Send": "\u0418\u0437\u043f\u0440\u0430\u0442\u0438",
          "Pro Tip:": "Pro \u0441\u044a\u0432\u0435\u0442:",
          "You can also create a shared list.": "\u041c\u043e\u0436\u0435\u0442\u0435 \u0441\u044a\u0449\u043e \u0442\u0430\u043a\u0430 \u0434\u0430 \u0441\u0435 \u0441\u044a\u0437\u0434\u0430\u0434\u0435 \u043e\u0431\u0449 \u0441\u043f\u0438\u0441\u044a\u043a.",
          "Next": "\u0421\u043b\u0435\u0434\u0432\u0430\u0449",
          "You\u2019ll need to go Pro": "\u0429\u0435 \u0442\u0438 \u0435 \u043d\u0443\u0436\u0435\u043d Pro",
          "A pro account unlocks this feature and many others.": "Pro \u0430\u043a\u0430\u0443\u043d\u0442\u0430 \u043e\u0442\u043a\u043b\u044e\u0447\u0432\u0430 \u0442\u0430\u0437\u0438 \u0444\u0443\u043d\u043a\u0446\u0438\u044f \u0438 \u043c\u043d\u043e\u0433\u043e \u0434\u0440\u0443\u0433\u0438.",
          "Take Nitro to the next level.": "\u0412\u0437\u0435\u043c\u0435\u0442\u0435 Nitro \u043a\u044a\u043c \u0441\u043b\u0435\u0434\u0432\u0430\u0449\u043e\u0442\u043e \u043d\u0438\u0432\u043e.",
          "Get Pro": "\u041f\u043e\u043b\u0443\u0447\u0438 Pro",
          "Learn More": "\u041d\u0430\u0443\u0447\u0438 \u043f\u043e\u0432\u0435\u0447\u0435",
          "General": "\u041e\u0431\u0449\u0438",
          "Account": "\u041f\u0440\u043e\u0444\u0438\u043b",
          "Pro": "\u041f\u0440\u043e",
          "Notifications": "\u0418\u0437\u0432\u0435\u0441\u0442\u0438\u044f",
          "Language": "\u0415\u0437\u0438\u043a",
          "About": "\u0417\u0430",
          "Week starts on:": "\u0421\u0435\u0434\u043c\u0438\u0446\u0430\u0442\u0430 \u0437\u0430\u043f\u043e\u0447\u0432\u0430 \u0432:",
          "Monday": "\u041f\u043e\u043d\u0435\u0434\u0435\u043b\u043d\u0438\u043a",
          "Sunday": "\u041d\u0435\u0434\u0435\u043b\u044f",
          "Date format:": "\u0424\u043e\u0440\u043c\u0430\u0442 \u043d\u0430 \u0434\u0430\u0442\u0430\u0442\u0430:",
          "Day \/ Month \/ Year": "\u0434\u0435\u043d \/ \u043c\u0435\u0441\u0435\u0446 \/ \u0433\u043e\u0434\u0438\u043d\u0430",
          "Month \/ Day \/ Year": "\u043c\u0435\u0441\u0435\u0446 \/ \u0434\u0435\u043d \/ \u0433\u043e\u0434\u0438\u043d\u0430",
          "Year \/ Month \/ Day": "\u0433\u043e\u0434\u0438\u043d\u0430 \/ \u043c\u0435\u0441\u0435\u0446 \/ \u0434\u0435\u043d",
          "Move to Completed:": "\u041f\u0440\u0435\u043c\u0435\u0441\u0442\u0438 \u043a\u044a\u043c \u0437\u0430\u0432\u044a\u0440\u0448\u0435\u043d\u0438:",
          "Instantly": "\u0412\u0435\u0434\u043d\u0430\u0433\u0430",
          "On App Launch": "\u041a\u043e\u0433\u0430\u0442\u043e \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u0435\u0442\u043e \u0441\u0442\u0430\u0440\u0442\u0438\u0440\u0430",
          "Never": "\u041d\u0438\u043a\u043e\u0433\u0430",
          "Confirm before deleting items:": "\u041f\u043e\u0442\u0432\u044a\u0440\u0434\u0435\u0442\u0435 \u043f\u0440\u0435\u0434\u0438 \u0438\u0437\u0442\u0440\u0438\u0432\u0430\u043d\u0435\u0442\u043e \u043d\u0430 \u0435\u043b\u0435\u043c\u0435\u043d\u0442\u0438:",
          "Night Mode:": "\u041d\u043e\u0449\u0435\u043d \u0440\u0435\u0436\u0438\u043c:",
          "Reset Nitro:": "\u041d\u0443\u043b\u0438\u0440\u0430\u043d\u0435 \u043d\u0430 \u041d\u0438\u0442\u0440\u043e:",
          "Clear Data": "\u0418\u0437\u0447\u0438\u0441\u0442\u0432\u0430\u043d\u0435 \u043d\u0430 \u0434\u0430\u043d\u043d\u0438\u0442\u0435",
          "Logout": "\u0418\u0437\u0445\u043e\u0434",
          "Import \/ Export Data": "\u0418\u043c\u043f\u043e\u0440\u0442\u0438\u0440\u0430\u043d\u0435 \/ \u0435\u043a\u0441\u043f\u043e\u0440\u0442\u0438\u0440\u0430\u043d\u0435 \u043d\u0430 \u0434\u0430\u043d\u043d\u0438",
          "Get Started": "\u0417\u0430\u043f\u043e\u0447\u043d\u0438",
          "Don\u2019t worry, all your existing tasks and lists will be safe. After signing in they\u2019ll be right here where you left them.": "\u041d\u0435 \u0441\u0435 \u043f\u0440\u0438\u0442\u0435\u0441\u043d\u044f\u0432\u0430\u0439, \u0432\u0441\u0438\u0447\u043a\u0438 \u0441\u044a\u0449\u0435\u0441\u0442\u0432\u0443\u0432\u0430\u0449\u0438 \u0437\u0430\u0434\u0430\u0447\u0438 \u0438 \u0441\u043f\u0438\u0441\u044a\u0446\u0438 \u0449\u0435 \u0431\u044a\u0434\u0430\u0442 \u0432 \u0431\u0435\u0437\u043e\u043f\u0430\u0441\u043d\u043e\u0441\u0442. \u0421\u043b\u0435\u0434 \u0432\u043f\u0438\u0441\u0432\u0430\u043d\u0435 \u0442\u0435 \u0449\u0435 \u0431\u044a\u0434\u0430\u0442 \u0442\u0443\u043a, \u043a\u044a\u0434\u0435\u0442\u043e \u0441\u0442\u0435 \u0433\u0438 \u043e\u0441\u0442\u0430\u0432\u0438\u043b\u0438.",
          "Go Pro": "\u0412\u0437\u0435\u043c\u0438 Pro",
          "A pro account unlocks extra awesome features.": "Pro \u0430\u043a\u0430\u0443\u043d\u0442a \u043e\u0442\u043a\u043b\u044e\u0447\u0432\u0430 \u0434\u043e\u043f\u044a\u043b\u043d\u0438\u0442\u0435\u043b\u043d\u0438 \u0441\u0442\u0440\u0430\u0445\u043e\u0442\u043d\u0438 \u0444\u0443\u043d\u043a\u0446\u0438\u0438.",
          "You\u2019ll also get a warm fuzzy feeling.": "\u0421\u044a\u0449\u043e \u0442\u0430\u043a\u0430 \u0449\u0435 \u043f\u043e\u043b\u0443\u0447\u0438\u0442\u0435 \u0442\u043e\u043f\u043b\u043e, \u0437\u0430\u043c\u0430\u0439\u0432\u0430\u0449\u043e \u0447\u0443\u0432\u0441\u0442\u0432\u043e.",
          "You\u2019re Pro": "\u0422\u0438 \u0441\u0438 Pro",
          "Thanks for purchasing a Pro Upgrade. You\u2019re awesome.": "\u0411\u043b\u0430\u0433\u043e\u0434\u0430\u0440\u044f \u0437\u0430 \u0437\u0430\u043a\u0443\u043f\u0443\u0432\u0430\u043d\u0435 Pro \u043d\u0430\u0434\u0441\u0442\u0440\u043e\u0439\u043a\u0430. \u0422\u0438 \u0441\u0438 \u0441\u0442\u0440\u0430\u0445\u043e\u0442\u0435\u043d.",
          "As promised, you\u2019ve unlocked extra features.": "\u041e\u0442\u043a\u043b\u044e\u0447\u0438 \u0434\u043e\u043f\u044a\u043b\u043d\u0438\u0442\u0435\u043b\u043d\u0438 \u0444\u0443\u043d\u043a\u0446\u0438\u0438.",
          "Priority Support": "\u041f\u0440\u0438\u043e\u0440\u0438\u0442\u0435\u0442\u043d\u0430 \u043f\u043e\u0434\u0434\u0440\u044a\u0436\u043a\u0430",
          "Email to Nitro": "\u0418\u043c\u0435\u0439\u043b \u0434\u043e Nitro",
          "Notifications:": "\u0418\u0437\u0432\u0435\u0441\u0442\u0438\u044f:",
          "Notify me via Email:": "\u0423\u0432\u0435\u0434\u043e\u043c\u044f\u0432\u0430\u0439 \u043c\u0435 \u043f\u043e \u0438\u043c\u0435\u0439\u043b:",
          "Remind me at:": "\u041d\u0430\u043f\u043e\u043c\u043d\u0438 \u043c\u0438 \u043d\u0430:",
          "1am": "1 \u0447.",
          "2am": "2 \u0447.",
          "3am": "3 \u0447.",
          "4am": "4 \u0447.",
          "5am": "5 \u0447.",
          "6am": "6 \u0447.",
          "7am": "7 \u0447.",
          "8am": "8 \u0447.",
          "9am": "9 \u0447.",
          "10am": "10 \u0447.",
          "11am": "11 \u0447.",
          "12pm": "12 \u0447.",
          "1pm": "13 \u0447.",
          "2pm": "14 \u0447.",
          "3pm": "15 \u0447.",
          "4pm": "16 \u0447.",
          "5pm": "17 \u0447.",
          "6pm": "18 \u0447.",
          "7pm": "19 \u0447.",
          "8pm": "20 \u0447.",
          "9pm": "21 \u0447.",
          "10pm": "22 \u0447.",
          "11pm": "23 \u0447.",
          "12am": "24 \u0447.",
          "Jan": "\u044f\u043d",
          "Feb": "\u0444\u0435\u0432\u0440",
          "Mar": "\u043c\u0430\u0440\u0442",
          "Apr": "\u0430\u043f\u0440",
          "May": "\u043c\u0430\u0439",
          "Jun": "\u044e\u043d\u0438",
          "Jul": "\u044e\u043b\u0438",
          "Aug": "\u0430\u0432\u0433",
          "Sep": "\u0441\u0435\u043f\u0442",
          "Oct": "\u043e\u043a\u0442",
          "Nov": "\u043d\u043e\u0435\u043c",
          "Dec": "\u0434\u0435\u043a",
          "Send notifications for tasks that are:": "\u0423\u0432\u0435\u0434\u043e\u043c\u0438 \u043c\u0435 \u0437\u0430 \u0437\u0430\u0434\u0430\u0447\u0438\u0442\u0435, \u043a\u043e\u0438\u0442\u043e \u0441\u0430:",
          "Upcoming": "\u041f\u0440\u0435\u0434\u0441\u0442\u043e\u044f\u0449\u0438",
          "Due": "\u041d\u0430",
          "Author": "\u0410\u0432\u0442\u043e\u0440",
          "yesterday": "\u0432\u0447\u0435\u0440\u0430",
          "days ago": "\u0434\u043d\u0438",
          "tomorrow": "\u0443\u0442\u0440\u0435",
          "today": "\u0434\u043d\u0435\u0441",
          "Search": "\u0422\u044a\u0440\u0441\u0435\u043d\u0435",
          "What do you need to do?": "\u041a\u0430\u043a\u0432\u043e \u0442\u0440\u044f\u0431\u0432\u0430 \u0434\u0430 \u043d\u0430\u043f\u0440\u0430\u0432\u044f?",
          "New List": "\u041d\u043e\u0432 \u0441\u043f\u0438\u0441\u044a\u043a",
          "Email": "\u0418\u043c\u0435\u0439\u043b",
          "Delete List": "\u0418\u0437\u0442\u0440\u0438\u0432\u0430\u043d\u0435 \u043d\u0430 \u0441\u043f\u0438\u0441\u044a\u043a",
          "Toggle Sorting": "\u0421\u043e\u0440\u0442\u0438\u0440\u0430\u043d\u0435",
          "Email List": "\u0418\u043c\u0435\u0439\u043b \u0441\u043f\u0438\u0441\u044a\u043a",
          "Print List": "\u041e\u0442\u043f\u0435\u0447\u0430\u0442\u0432\u0430\u043d\u0435 \u043d\u0430 \u0441\u043f\u0438\u0441\u044a\u043a",
          "Name:": "\u0418\u043c\u0435:",
          "Email:": "\u0418\u043c\u0435\u0439\u043b:",
          "Change Password": "\u0421\u043c\u044f\u043d\u0430 \u043d\u0430 \u043f\u0430\u0440\u043e\u043b\u0430\u0442\u0430",
          "Change Email": "\u041f\u0440\u043e\u043c\u044f\u043d\u0430 \u043d\u0430 \u0438\u043c\u0435\u0439\u043b \u0430\u0434\u0440\u0435\u0441\u0430",
          "Delete Account": "\u0418\u0437\u0442\u0440\u0438\u0432\u0430\u043d\u0435 \u043d\u0430 \u0430\u043a\u0430\u0443\u043d\u0442\u0430"
        };
      }
    ], [
      {
        /*
          /Users/Admin/Projects/Nitro/source/scripts/languages/bn-IN.json
        */

      }, function(require, module, exports) {
        return module.exports = {
          "Sign Up to Sync": "Sync \u0995\u09b0\u09a4\u09c7 \u09b9\u09b2\u09c7 Sign Up \u0995\u09b0\u09c1\u09a8",
          "Lists": "\u09a4\u09be\u09b2\u09bf\u0995\u09be",
          "Inbox": "\u0987\u09a8\u09ac\u0995\u09cd\u09b8",
          "All Tasks": "\u09b8\u09ae\u09b8\u09cd\u09a4 \u0995\u09be\u099c",
          "Completed": "\u09b8\u09ae\u09cd\u09aa\u09c2\u09b0\u09cd\u09a3 \u09b9\u09df\u09c7\u099b\u09c7",
          "Notes": "\u09ac\u09bf\u09ac\u09b0\u09a3",
          "Due Date": "\u09aa\u09c2\u09b0\u09cd\u09ac\u09a8\u09bf\u09b0\u09cd\u09a6\u09bf\u09b7\u09cd\u099f \u09a4\u09be\u09b0\u09bf\u0996",
          "Mark as completed": "\u09b8\u09ae\u09cd\u09aa\u09c2\u09b0\u09cd\u09a3 \u09ac\u09b2\u09c7 \u099a\u09bf\u09b9\u09cd\u09a8\u09bf\u09a4 \u0995\u09b0\u09c1\u09a8",
          "Set priority to low": "\u0995\u09ae \u099c\u09b0\u09c1\u09b0\u09c0",
          "Set priority to medium": "\u09ae\u09be\u099d\u09be\u09b0\u09bf \u099c\u09b0\u09c1\u09b0\u09c0",
          "Set priority to high": "\u0996\u09c1\u09ac \u099c\u09b0\u09c1\u09b0\u09c0",
          "Are you sure you want to do that?": "\u0986\u09aa\u09a8\u09bf \u0995\u09bf \u09a8\u09bf\u09b6\u09cd\u099a\u09bf\u09a4 \u09af\u09c7 \u0986\u09aa\u09a8\u09bf \u098f\u0987 \u0995\u09be\u099c \u0995\u09b0\u09a4\u09c7 \u099a\u09be\u09a8?",
          "No tasks could be found.": "\u0995\u09cb\u09a8 \u0995\u09be\u099c \u0996\u09c1\u0981\u099c\u09c7 \u09aa\u09be\u0993\u09df\u09be \u09af\u09be\u09df\u09a8\u09bf\u0964",
          "You haven't added any tasks to this list.": "\u0986\u09aa\u09a8\u09bf \u098f\u0987 \u09a4\u09be\u09b2\u09bf\u0995\u09be\u09df \u0995\u09cb\u09a8 \u0995\u09be\u099c \u09af\u09c1\u0995\u09cd\u09a4 \u0995\u09b0\u09c7\u09a8\u09a8\u09bf\u0964",
          "There are no tasks in here.": "\u098f\u0996\u09be\u09a8\u09c7 \u0995\u09cb\u09a8 \u0995\u09be\u099c \u09a8\u09c7\u0987\u0964",
          "Yes, delete it": "\u09b9\u09cd\u09af\u09be\u0981, \u09ae\u09c1\u099b\u09c7 \u09ab\u09c7\u09b2\u09c1\u09a8\u0964",
          "No, keep it": "\u09a8\u09be, \u09b0\u09c7\u0996\u09c7 \u09a6\u09bf\u09a8\u0964",
          "Copy the data below and keep it in a safe place. To restore from a backup, simply replace the data and use the import button.": "\u09a8\u09c0\u099a\u09c7\u09b0 \u09a4\u09a5\u09cd\u09af\u0997\u09c1\u09b2\u09bf\u0995\u09c7 \u0985\u09a8\u09c1\u09b2\u09bf\u09aa\u09bf \u0995\u09b0\u09c7 \u0995\u09cb\u09a8 \u09b8\u09c1\u09b0\u0995\u09cd\u09b7\u09bf\u09a4 \u09b8\u09cd\u09a5\u09be\u09a8\u09c7 \u09b0\u09c7\u0996\u09c7 \u09a6\u09bf\u09a8\u0964 To restore from a backup, simply replace the data and use the import button.",
          "Import": "\u0986\u09ae\u09a6\u09be\u09a8\u09bf \u0995\u09b0\u09c1\u09a8",
          "Close": "\u09ac\u09a8\u09cd\u09a7 \u0995\u09b0\u09c1\u09a8",
          "Where should the tasks be sent?": "\u098f\u0987 \u0995\u09be\u099c\u0997\u09c1\u09b2\u09bf\u0995\u09c7 \u0995\u09cb\u09a5\u09be\u09df \u09aa\u09be\u09a0\u09be\u09a4\u09c7 \u09b9\u09ac\u09c7?",
          "Send": "\u09aa\u09be\u09a0\u09bf\u09df\u09c7 \u09a6\u09bf\u09a8",
          "Pro Tip:": "\u09aa\u09c7\u09b6\u09be\u09a6\u09be\u09b0 \u09ac\u09cd\u09af\u09ac\u09b9\u09be\u09b0\u0995\u09be\u09b0\u09c0\u09a6\u09c7\u09b0 \u09aa\u09cd\u09b0\u09a4\u09bf \u0989\u09aa\u09a6\u09c7\u09b6:",
          "You can also create a shared list.": "\u0986\u09aa\u09a8\u09bf \u098f\u0995\u099f\u09bf \u09af\u09cc\u09a5 \u09a4\u09be\u09b2\u09bf\u0995\u09be\u0993 \u09ac\u09be\u09a8\u09be\u09a4\u09c7 \u09aa\u09be\u09b0\u09c7\u09a8\u0964",
          "Next": "\u09aa\u09b0\u09ac\u09b0\u09cd\u09a4\u09c0",
          "You\u2019ll need to go Pro": "\u0986\u09aa\u09a8\u09be\u09b0 \u09aa\u09c7\u09b6\u09be\u09a6\u09be\u09b0 \u0985\u09cd\u09af\u09be\u0995\u09be\u0989\u09a8\u09cd\u099f \u09aa\u09cd\u09b0\u09df\u09cb\u099c\u09a8",
          "A pro account unlocks this feature and many others.": "\u098f\u0995\u099f\u09bf \u09aa\u09c7\u09b6\u09be\u09a6\u09be\u09b0 \u0985\u09cd\u09af\u09be\u0995\u09be\u0989\u09a8\u09cd\u099f \u0986\u09aa\u09a8\u09be\u0995\u09c7 \u098f\u099f\u09bf \u098f\u09ac\u0982 \u0986\u09b0\u0993 \u0985\u09a8\u09c7\u0995 \u09b8\u09c1\u09ac\u09bf\u09a7\u09be \u09a6\u09c7\u09df\u0964",
          "Take Nitro to the next level.": "Nitro \u0995\u09c7 \u0989\u09ce\u0995\u09b0\u09cd\u09b7\u09c7\u09b0 \u0989\u099a\u09cd\u099a\u09a4\u09b0 \u09b8\u09cd\u09a4\u09b0\u09c7 \u09a8\u09bf\u09df\u09c7 \u09af\u09be\u09a8\u0964",
          "Get Pro": "\u09aa\u09c7\u09b6\u09be\u09a6\u09be\u09b0 \u0985\u09cd\u09af\u09be\u0995\u09be\u0989\u09a8\u09cd\u099f \u0997\u09cd\u09b0\u09b9\u09a8 \u0995\u09b0\u09c1\u09a8",
          "Learn More": "\u0986\u09b0\u09cb \u099c\u09be\u09a8\u09c1\u09a8",
          "General": "\u09b8\u09be\u09a7\u09be\u09b0\u09a8",
          "Account": "\u0985\u09cd\u09af\u09be\u0995\u09be\u0989\u09a8\u09cd\u099f",
          "Pro": "\u09aa\u09c7\u09b6\u09be\u09a6\u09be\u09b0",
          "Notifications": "\u09ac\u09bf\u099c\u09cd\u099e\u09aa\u09cd\u09a4\u09bf",
          "Language": "\u09ad\u09be\u09b7\u09be",
          "About": "About",
          "Week starts on:": "\u09b8\u09aa\u09cd\u09a4\u09be\u09b9 \u09b6\u09c1\u09b0\u09c1 \u09b9\u09df\u0983",
          "Monday": "\u09b8\u09cb\u09ae\u09ac\u09be\u09b0",
          "Sunday": "\u09b0\u09ac\u09bf\u09ac\u09be\u09b0",
          "Date format:": "\u09a4\u09be\u09b0\u09bf\u0996\u09c7\u09b0 \u09ac\u09bf\u09a8\u09cd\u09af\u09be\u09b8\u0983",
          "Day \/ Month \/ Year": "\u09a6\u09bf\u09a8\/\u09ae\u09be\u09b8\/\u09ac\u099b\u09b0",
          "Month \/ Day \/ Year": "\u09ae\u09be\u09b8\/\u09a6\u09bf\u09a8\/\u09ac\u099b\u09b0",
          "Year \/ Month \/ Day": "\u09ac\u099b\u09b0\/\u09ae\u09be\u09b8\/\u09a6\u09bf\u09a8",
          "Move to Completed:": "\"\u09b8\u09ae\u09cd\u09aa\u09c2\u09b0\u09cd\u09a3\" \u09a4\u09be\u09b2\u09bf\u0995\u09be\u09df \u09aa\u09be\u09a0\u09bf\u09df\u09c7 \u09a6\u09bf\u09a8:",
          "Instantly": "\u09a4\u09be\u09ce\u0995\u09cd\u09b7\u09a8\u09bf\u0995 \u09ad\u09be\u09ac\u09c7",
          "On App Launch": "App \u099f\u09bf\u09b0 \u0989\u09a6\u09cd\u09ac\u09cb\u09a7\u09a8\u09c7",
          "Never": "\u0995\u0996\u09a8\u09cb \u09a8\u09be",
          "Confirm before deleting items:": "\u0995\u09cb\u09a8 \u0995\u09bf\u099b\u09c1 \u09ae\u09c1\u099b\u09c7 \u09ab\u09c7\u09b2\u09be\u09b0 \u0986\u0997\u09c7 \u09a8\u09bf\u09b6\u09cd\u099a\u09bf\u09a4 \u0995\u09b0\u09ac\u09c7:",
          "Night Mode:": "Night Mode:",
          "Reset Nitro:": "Nitro \u0995\u09c7 Reset \u0995\u09b0\u09c1\u09a8:",
          "Clear Data": "\u09b8\u09ae\u09b8\u09cd\u09a4 \u09a4\u09a5\u09cd\u09af \u09ae\u09c1\u099b\u09c7 \u09ab\u09c7\u09b2\u09c1\u09a8",
          "Logout": "\u09b2\u0997\u0986\u0989\u099f \u0995\u09b0\u09c1\u09a8",
          "Import \/ Export Data": "\u09a4\u09a5\u09cd\u09af \u0986\u09ae\u09a6\u09be\u09a8\u09bf \/ \u09b0\u09aa\u09cd\u09a4\u09be\u09a8\u09bf \u0995\u09b0\u09c1\u09a8",
          "Get Started": "\u09b6\u09c1\u09b0\u09c1 \u0995\u09b0\u09c1\u09a8",
          "Don\u2019t worry, all your existing tasks and lists will be safe. After signing in they\u2019ll be right here where you left them.": "\u099a\u09bf\u09a8\u09cd\u09a4\u09be \u0995\u09b0\u09ac\u09c7\u09a8 \u09a8\u09be, \u0986\u09aa\u09a8\u09be\u09b0 \u09b8\u09ae\u09b8\u09cd\u09a4 \u0995\u09be\u099c \u0993 \u09a4\u09be\u09b2\u09bf\u0995\u09be \u09b8\u09c1\u09b0\u0995\u09cd\u09b7\u09bf\u09a4 \u09a5\u09be\u0995\u09ac\u09c7\u0964 \u0986\u09aa\u09a8\u09bf \u09b8\u09c7\u0997\u09c1\u09b2\u09bf\u0995\u09c7 \u09af\u09c7\u09ae\u09a8 \u0985\u09ac\u09b8\u09cd\u09a5\u09be\u09df \u09b0\u09c7\u0996\u09c7\u099b\u09bf\u09b2\u09c7\u09a8, Sign in \u0995\u09b0\u09be\u09b0 \u09aa\u09b0\u09c7 \u09a0\u09bf\u0995 \u09b8\u09c7\u0987 \u0985\u09ac\u09b8\u09cd\u09a5\u09be\u09a4\u09c7\u0987 \u098f\u0996\u09be\u09a8\u09c7 \u099a\u09b2\u09c7 \u0986\u09b8\u09ac\u09c7\u0964",
          "Go Pro": "\u09aa\u09c7\u09b6\u09be\u09a6\u09be\u09b0 \u09b9\u09df\u09c7 \u09af\u09be\u09a8",
          "A pro account unlocks extra awesome features.": "\u098f\u0995\u099f\u09bf \u09aa\u09c7\u09b6\u09be\u09a6\u09be\u09b0 \u0985\u09cd\u09af\u09be\u0995\u09be\u0989\u09a8\u09cd\u099f \u0986\u09aa\u09a8\u09be\u0995\u09c7 \u09a6\u09be\u09b0\u09c1\u09a3 \u09a6\u09be\u09b0\u09c1\u09a3 \u0985\u09a4\u09bf\u09b0\u09bf\u0995\u09cd\u09a4 \u09b8\u09c1\u09ac\u09bf\u09a7\u09be \u09a6\u09c7\u09df\u0964",
          "You\u2019ll also get a warm fuzzy feeling.": "\u0986\u09aa\u09a8\u09be\u09b0 \u098f\u0995 \u09a6\u09be\u09b0\u09c1\u09a8 \u0985\u09a8\u09c1\u09ad\u09c1\u09a4\u09bf \u09b9\u09ac\u09c7\u0964",
          "You\u2019re Pro": "\u0986\u09aa\u09a8\u09bf \u098f\u0995\u099c\u09a8 \u09aa\u09c7\u09b6\u09be\u09a6\u09be\u09b0 \u09ac\u09cd\u09af\u09ac\u09b9\u09be\u09b0\u0995\u09be\u09b0\u09c0",
          "Thanks for purchasing a Pro Upgrade. You\u2019re awesome.": "\u09aa\u09c7\u09b6\u09be\u09a6\u09be\u09b0 \u09ac\u09cd\u09af\u09ac\u09b9\u09be\u09b0\u0995\u09be\u09b0\u09c0 \u09b9\u0993\u09df\u09be\u09b0 \u099c\u09a8\u09cd\u09af \u09a7\u09a8\u09cd\u09af\u09ac\u09be\u09a6\u0964 \u0986\u09aa\u09a8\u09bf \u09a6\u09be\u09b0\u09c1\u09a3 \u09ad\u09be\u09b2\u0964",
          "As promised, you\u2019ve unlocked extra features.": "\u0986\u09ae\u09be\u09a6\u09c7\u09b0 \u09aa\u09cd\u09b0\u09a4\u09bf\u09b6\u09cd\u09b0\u09c1\u09a4\u09bf \u0985\u09a8\u09c1\u09af\u09be\u09df\u09c0 \u0986\u09aa\u09a8\u09bf \u0985\u09a8\u09c7\u0995 \u0985\u09a4\u09bf\u09b0\u09bf\u0995\u09cd\u09a4 \u09b8\u09c1\u09ac\u09bf\u09a7\u09be \u09aa\u09c7\u09df\u09c7 \u0997\u09c7\u099b\u09c7\u09a8\u0964",
          "Priority Support": "Priority Support",
          "Email to Nitro": "Nitro \u0995\u09c7 \u0987\u09ae\u09c7\u09b2 \u0995\u09b0\u09c1\u09a8",
          "Notifications:": "\u09ac\u09bf\u099c\u09cd\u099e\u09aa\u09cd\u09a4\u09bf:",
          "Notify me via Email:": "\u0986\u09ae\u09be\u0995\u09c7 \u0987\u09ae\u09c7\u09b2 \u098f\u09b0 \u09ae\u09be\u09a7\u09cd\u09af\u09ae\u09c7 \u099c\u09be\u09a8\u09be\u09ac\u09c7:",
          "Remind me at:": "\u0986\u09ae\u09be\u0995\u09c7 \u099c\u09be\u09a8\u09be\u09ac\u09c7:",
          "1am": "\u09e7am",
          "2am": "\u09e8am",
          "3am": "\u09e9am",
          "4am": "\u09eaam",
          "5am": "\u09ebam",
          "6am": "\u09ecam",
          "7am": "\u09edam",
          "8am": "\u09eeam",
          "9am": "\u09efam",
          "10am": "\u09e7\u09e6am",
          "11am": "\u09e7\u09e7am",
          "12pm": "\u09e7\u09e8pm",
          "1pm": "\u09e7pm",
          "2pm": "\u09e8pm",
          "3pm": "\u09e9pm",
          "4pm": "\u09eapm",
          "5pm": "\u09ebpm",
          "6pm": "\u09ecpm",
          "7pm": "\u09edpm",
          "8pm": "\u09eepm",
          "9pm": "\u09efpm",
          "10pm": "\u09e7\u09e6pm",
          "11pm": "\u09e7\u09e7pm",
          "12am": "\u09e7\u09e8am",
          "Jan": "\u099c\u09be\u09a8\u09c1\u09df\u09be\u09b0\u09c0",
          "Feb": "\u09ab\u09c7\u09ac\u09cd\u09b0\u09c1\u09df\u09be\u09b0\u09c0",
          "Mar": "\u09ae\u09be\u09b0\u09cd\u099a",
          "Apr": "\u098f\u09aa\u09cd\u09b0\u09bf\u09b2",
          "May": "\u09ae\u09c7",
          "Jun": "\u099c\u09c1\u09a8",
          "Jul": "\u099c\u09c1\u09b2\u09be\u0987",
          "Aug": "\u0986\u0997\u09b8\u09cd\u099f",
          "Sep": "\u09b8\u09c7\u09aa\u09cd\u099f\u09c7\u09ae\u09cd\u09ac\u09b0",
          "Oct": "\u0985\u0995\u09cd\u099f\u09cb\u09ac\u09b0",
          "Nov": "\u09a8\u09ad\u09c7\u09ae\u09cd\u09ac\u09b0",
          "Dec": "\u09a1\u09bf\u09b8\u09c7\u09ae\u09cd\u09ac\u09b0",
          "Send notifications for tasks that are:": "\u09b8\u09c7\u0987 \u09b8\u09ae\u09b8\u09cd\u09a4 \u0995\u09be\u099c\u09c7\u09b0 \u09ac\u09bf\u099c\u09cd\u099e\u09aa\u09cd\u09a4\u09bf \u09aa\u09be\u09a0\u09be\u09ac\u09c7 \u09af\u09c7\u0997\u09c1\u09b2\u09bf:",
          "Upcoming": "\u0986\u09b8\u09a8\u09cd\u09a8",
          "Due": "\u09ac\u09be\u0995\u09bf \u0986\u099b\u09c7",
          "Author": "\u09b8\u09cd\u09b0\u09b7\u09cd\u099f\u09be",
          "yesterday": "\u0997\u09a4\u0995\u09be\u09b2",
          "days ago": "\u09a6\u09bf\u09a8 \u0986\u0997\u09c7",
          "tomorrow": "\u0986\u0997\u09be\u09ae\u09c0\u0995\u09be\u09b2",
          "today": "\u0986\u099c",
          "Search": "\u0996\u09c1\u0981\u099c\u09c1\u09a8",
          "What do you need to do?": "\u0986\u09aa\u09a8\u09be\u09b0 \u0995\u09c0 \u0995\u09b0\u09be \u09a6\u09b0\u0995\u09be\u09b0?",
          "New List": "\u09a8\u09a4\u09c1\u09a8 \u09a4\u09be\u09b2\u09bf\u0995\u09be",
          "Email": "\u0987\u09ae\u09c7\u09b2",
          "Delete List": "\u09a4\u09be\u09b2\u09bf\u0995\u09be \u09ae\u09c1\u099b\u09c7 \u09ab\u09c7\u09b2\u09c1\u09a8",
          "Toggle Sorting": "\u09ac\u09be\u099b\u09be\u0987 \u0995\u09b0\u09c1\u09a8",
          "Email List": "\u09a4\u09be\u09b2\u09bf\u0995\u09be \u0987\u09ae\u09c7\u09b2 \u0995\u09b0\u09c1\u09a8",
          "Print List": "\u09a4\u09be\u09b2\u09bf\u0995\u09be \u09aa\u09cd\u09b0\u09bf\u09a8\u09cd\u099f \u0995\u09b0\u09c1\u09a8",
          "Name:": "\u09a8\u09be\u09ae:",
          "Email:": "\u0987\u09ae\u09c7\u09b2:",
          "Change Password": "\u09aa\u09be\u09b8\u0993\u09df\u09be\u09b0\u09cd\u09a1 \u09aa\u09b0\u09bf\u09ac\u09b0\u09cd\u09a4\u09a8 \u0995\u09b0\u09c1\u09a8",
          "Change Email": "\u0987\u09ae\u09c7\u09b2 \u09aa\u09b0\u09bf\u09ac\u09b0\u09cd\u09a4\u09a8 \u0995\u09b0\u09c1\u09a8",
          "Delete Account": "\u0985\u09cd\u09af\u09be\u0995\u09be\u0989\u09a8\u09cd\u099f \u09ae\u09c1\u099b\u09c7 \u09ab\u09c7\u09b2\u09c1\u09a8"
        };
      }
    ], [
      {
        /*
          /Users/Admin/Projects/Nitro/source/scripts/languages/en-pi.json
        */

      }, function(require, module, exports) {
        return module.exports = {
          "Translation Creator": "Caffeinated Code <http://caffeinatedco.de>",
          "Lists": "Parchments",
          "Inbox": "Arr!",
          "All Tasks": "All Scribblin's",
          "Completed": "Ye Logbook",
          "What do you need to do?": "What treasures are ye uncoverin today?",
          "Search": "Scour fer treasure",
          "New List": "New Parchment",
          "Notes": "Scribblin's",
          "Due Date": "When?",
          "Are you sure you want to do that?": "Yarr tasks be cast overboard?",
          "Yes, delete it": "Arr!",
          "No, keep it": "Narr!",
          "Delete List": "Cast Overboard",
          "Toggle Sorting": "Mix it up",
          "Email List": "Blabber t' yer mates",
          "Print List": "Scribble on parchment",
          "Share List": "Share with yer crew",
          "Where should the tasks be sent?": "Whar ye tasks be cast?",
          "Email": "Ship",
          "Send": "Cast"
        };
      }
    ], [
      {
        /*
          /Users/Admin/Projects/Nitro/source/scripts/languages/en-us.json
        */

      }, function(require, module, exports) {
        return module.exports = {
          "Why does this file exist?": "To stop AJAX from failing."
        };
      }
    ], [
      {
        /*
          /Users/Admin/Projects/Nitro/source/scripts/languages/es-ES.json
        */

      }, function(require, module, exports) {
        return module.exports = {
          "Sign Up to Sync": "Reg\u00edstrese para sincronizar",
          "Lists": "Listas",
          "Inbox": "Bandeja de Entrada",
          "All Tasks": "Todas las Tareas",
          "Completed": "Completado",
          "Notes": "Notas",
          "Due Date": "Fecha de Vencimiento",
          "Mark as completed": "Marcar como completado",
          "Set priority to low": "Establecer prioridad baja",
          "Set priority to medium": "Establecer prioridad media",
          "Set priority to high": "Establecer prioridad alta",
          "Are you sure you want to do that?": "\u00bfEst\u00e1 seguro de que desea hacerlo?",
          "No tasks could be found.": "No se pudo encontrar ninguna tarea.",
          "You haven't added any tasks to this list.": "No has a\u00f1adido ninguna tarea a esta lista.",
          "There are no tasks in here.": "No hay ninguna tarea aqu\u00ed.",
          "Yes, delete it": "S\u00ed, eliminarlo",
          "No, keep it": "No, mantenerlo",
          "Copy the data below and keep it in a safe place. To restore from a backup, simply replace the data and use the import button.": "Copiar los datos a continuaci\u00f3n y guardar en un lugar seguro. Para restaurar desde una copia de seguridad, simplemente vuelva a colocar los datos y utilice el bot\u00f3n importar.",
          "Import": "Importar",
          "Close": "Cerrar",
          "Where should the tasks be sent?": "\u00bfDonde se deben enviar las tareas?",
          "Send": "Enviar",
          "Pro Tip:": "Pro Tip:",
          "You can also create a shared list.": "Tambi\u00e9n puede crear una lista compartida.",
          "Next": "Siguiente",
          "You\u2019ll need to go Pro": "Necesitas ir a Pro",
          "A pro account unlocks this feature and many others.": "Una cuenta Pro desbloquea  esta caracter\u00edstica y muchas otras.",
          "Take Nitro to the next level.": "Lleva Nitro al siguiente nivel.",
          "Get Pro": "Hazte Pro",
          "Learn More": "Aprende m\u00e1s",
          "General": "General",
          "Account": "Cuenta",
          "Pro": "Pro",
          "Notifications": "Notificaciones",
          "Language": "Idioma",
          "About": "Acerca de",
          "Week starts on:": "Semana comienza en:",
          "Monday": "Lunes",
          "Sunday": "Domingo",
          "Date format:": "Formato de fecha:",
          "Day \/ Month \/ Year": "D\u00eda \/ Mes \/ A\u00f1o",
          "Month \/ Day \/ Year": "Mes \/ D\u00eda \/ A\u00f1o",
          "Year \/ Month \/ Day": "A\u00f1o \/ Mes \/ D\u00eda",
          "Move to Completed:": "Mover a terminado:",
          "Instantly": "Al instante",
          "On App Launch": "Sobre el lanzamiento de la aplicaci\u00f3n",
          "Never": "Nunca",
          "Confirm before deleting items:": "Confirmar antes de eliminar elementos:",
          "Night Mode:": "Modo nocturno:",
          "Reset Nitro:": "Reset Nitro:",
          "Clear Data": "Borrar datos",
          "Logout": "Cerrar sesi\u00f3n",
          "Import \/ Export Data": "Importar \/ exportar datos",
          "Get Started": "Comenzar",
          "Don\u2019t worry, all your existing tasks and lists will be safe. After signing in they\u2019ll be right here where you left them.": "No se preocupe, todas las tareas existentes y listas estar\u00e1n a salvo. Despu\u00e9s de iniciar sesi\u00f3n van a estar aqu\u00ed donde los dejaste.",
          "Go Pro": "S\u00e9 Pro",
          "A pro account unlocks extra awesome features.": "Una cuenta pro desbloquea caracter\u00edsticas extra impresionantes.",
          "You\u2019ll also get a warm fuzzy feeling.": "Tambi\u00e9n, obtendr\u00e1 un sentimiento favorable.",
          "You\u2019re Pro": "Eres Pro",
          "Thanks for purchasing a Pro Upgrade. You\u2019re awesome.": "Gracias por adquirir una actualizaci\u00f3n Pro. Eres impresionante.",
          "As promised, you\u2019ve unlocked extra features.": "Como lo prometido, has desbloqueado caracter\u00edsticas extras.",
          "Priority Support": "Soporte prioritario",
          "Email to Nitro": "Correo electr\u00f3nico a Nitro",
          "Notifications:": "Notificaciones:",
          "Notify me via Email:": "Notificarme por correo electr\u00f3nico:",
          "Remind me at:": "Record\u00e1rmelo en:",
          "1am": "1am",
          "2am": "2am",
          "3am": "3am",
          "4am": "4am",
          "5am": "5am",
          "6am": "6am",
          "7am": "7am",
          "8am": "8am",
          "9am": "9am",
          "10am": "10am",
          "11am": "11am",
          "12pm": "12am",
          "1pm": "1pm",
          "2pm": "2pm",
          "3pm": "3pm",
          "4pm": "4pm",
          "5pm": "5pm",
          "6pm": "6pm",
          "7pm": "7pm",
          "8pm": "8pm",
          "9pm": "9pm",
          "10pm": "10pm",
          "11pm": "11pm",
          "12am": "12am",
          "Jan": "Enero",
          "Feb": "Febrero",
          "Mar": "Marzo",
          "Apr": "Abril",
          "May": "Mayo",
          "Jun": "Junio",
          "Jul": "Julio",
          "Aug": "Agosto",
          "Sep": "Septiembre",
          "Oct": "Octubre",
          "Nov": "Noviembre",
          "Dec": "Diciembre",
          "Send notifications for tasks that are:": "Enviar notificaciones para las tareas que son:",
          "Upcoming": "Pr\u00f3xima",
          "Due": "Vencimiento",
          "Author": "Autor",
          "yesterday": "ayer",
          "days ago": "hace d\u00edas",
          "tomorrow": "ma\u00f1ana",
          "today": "hoy",
          "Search": "B\u00fasqueda",
          "What do you need to do?": "\u00bfQu\u00e9 necesitamos hacer?",
          "New List": "Nueva lista",
          "Email": "Correo electr\u00f3nico",
          "Delete List": "Eliminar de la lista",
          "Toggle Sorting": "Alternar selecci\u00f3n",
          "Email List": "Lista de correo electr\u00f3nico",
          "Print List": "Imprimir lista",
          "Name:": "Nombre:",
          "Email:": "Correo electr\u00f3nico:",
          "Change Password": "Cambiar contrase\u00f1a",
          "Change Email": "Cambiar correo electr\u00f3nico",
          "Delete Account": "Borrar cuenta"
        };
      }
    ], [
      {
        /*
          /Users/Admin/Projects/Nitro/source/scripts/languages/nl.json
        */

      }, function(require, module, exports) {
        return module.exports = {
          "Sign Up to Sync": "Aanmelden voor Sync",
          "Lists": "Lijsten",
          "Inbox": "Postvak in",
          "All Tasks": "Alle taken",
          "Completed": "Voltooid",
          "Notes": "Aantekeningen",
          "Due Date": "Vervaldatum",
          "Mark as completed": "Markeren als voltooid",
          "Set priority to low": "Zet prioriteit laag",
          "Set priority to medium": "Zet prioriteit gemiddeld",
          "Set priority to high": "Zet prioriteit hoog",
          "Are you sure you want to do that?": "Weet u zeker dat u dat wilt doen?",
          "No tasks could be found.": "Geen taken gevonden.",
          "You haven't added any tasks to this list.": "U hebt geen taken toegevoegd aan deze lijst.",
          "There are no tasks in here.": "Er zijn geen taken hierin.",
          "Yes, delete it": "Ja, verwijder het",
          "No, keep it": "Nee, behoud het",
          "Copy the data below and keep it in a safe place. To restore from a backup, simply replace the data and use the import button.": "Kopieer de onderstaande gegevens en bewaar het op een veilige plaats. Om gegevens terug te zetten vanaf een back-up, kunt u eenvoudigweg deze gegevens vervangen met de knop \"importeren\".",
          "Import": "Importeren",
          "Close": "Sluiten",
          "Where should the tasks be sent?": "Waarheen moeten de taken worden verzonden?",
          "Send": "Verzenden",
          "Pro Tip:": "Pro-tip:",
          "You can also create a shared list.": "U kunt ook een gedeelde lijst maken.",
          "Next": "Volgende",
          "You\u2019ll need to go Pro": "Hiervoor heeft u Pro nodig",
          "A pro account unlocks this feature and many others.": "Een pro-account ontgrendelt deze functie en vele andere.",
          "Take Nitro to the next level.": "Til Nitro naar een hoger niveau.",
          "Get Pro": "Neem Pro",
          "Learn More": "Meer informatie",
          "General": "Algemeen",
          "Account": "Aanmelden voor Sync",
          "Pro": "Pro",
          "Notifications": "Meldingen",
          "Language": "Taal",
          "About": "Over",
          "Week starts on:": "Week begint op:",
          "Monday": "Maandag",
          "Sunday": "Zondag",
          "Date format:": "Datumnotatie:",
          "Day \/ Month \/ Year": "Dag \/ maand \/ jaar",
          "Month \/ Day \/ Year": "Maand \/ dag \/ jaar",
          "Year \/ Month \/ Day": "Jaar \/ maand \/ dag",
          "Move to Completed:": "Verplaatsen naar voltooid:",
          "Instantly": "Direct",
          "On App Launch": "Als ik Nitro start",
          "Never": "Nooit",
          "Confirm before deleting items:": "Bevestig het verwijderen van items:",
          "Night Mode:": "Nachtmodus:",
          "Reset Nitro:": "Nitro resetten:",
          "Clear Data": "Gegevens wissen",
          "Logout": "Afmelden",
          "Import \/ Export Data": "Import \/ Export van gegevens",
          "Get Started": "Aan de slag",
          "Don\u2019t worry, all your existing tasks and lists will be safe. After signing in they\u2019ll be right here where you left them.": "Geen zorgen, al uw bestaande taken en lijsten zijn veilig. Nadat u zich aanmeldt, zijn ze gewoon hier, waar u ze geplaatst hebt.",
          "Go Pro": "Neem Pro",
          "A pro account unlocks extra awesome features.": "Een pro account ontgrendelt extra geweldige functies.",
          "You\u2019ll also get a warm fuzzy feeling.": "En het voelt gewoon lekker.",
          "You\u2019re Pro": "U hebt Pro",
          "Thanks for purchasing a Pro Upgrade. You\u2019re awesome.": "Bedankt voor uw aankoop van een Pro-opwaardering. Je bent geweldig!",
          "As promised, you\u2019ve unlocked extra features.": "Zoals beloofd, hebt u extra functies ontgrendeld.",
          "Priority Support": "Voorkeurs-ondersteuning",
          "Email to Nitro": "E-mail naar Nitro",
          "Notifications:": "Meldingen:",
          "Notify me via Email:": "Bericht mij via E-mail:",
          "Remind me at:": "Herinner me op:",
          "1am": "1:00 uur",
          "2am": "2:00 uur",
          "3am": "3:00 uur",
          "4am": "4:00 uur",
          "5am": "5:00 uur",
          "6am": "6:00 uur",
          "7am": "7:00 uur",
          "8am": "8:00 uur",
          "9am": "9:00 uur",
          "10am": "10:00 uur",
          "11am": "11:00 uur",
          "12pm": "12:00 uur",
          "1pm": "13:00 uur",
          "2pm": "14:00 uur",
          "3pm": "15:00 uur",
          "4pm": "16:00 uur",
          "5pm": "17:00 uur",
          "6pm": "18:00 uur",
          "7pm": "19:00 uur",
          "8pm": "20:00 uur",
          "9pm": "21:00 uur",
          "10pm": "22:00 uur",
          "11pm": "23:00 uur",
          "12am": "0:00 uur",
          "Jan": "Jan",
          "Feb": "Feb",
          "Mar": "Mrt",
          "Apr": "Apr",
          "May": "Mei",
          "Jun": "Jun",
          "Jul": "Jul",
          "Aug": "Aug",
          "Sep": "Sep",
          "Oct": "Okt",
          "Nov": "Nov",
          "Dec": "Dec",
          "Send notifications for tasks that are:": "Stuur berichten voor taken die zijn:",
          "Upcoming": "Aankomende",
          "Due": "Te laat",
          "Author": "Auteur",
          "yesterday": "gisteren",
          "days ago": "dagen geleden",
          "tomorrow": "morgen",
          "today": "vandaag",
          "Search": "Zoek",
          "What do you need to do?": "Wat moet u doen?",
          "New List": "Nieuwe lijst",
          "Email": "E-mail",
          "Delete List": "Lijst verwijderen",
          "Toggle Sorting": "Wissel sortering",
          "Email List": "E-mail lijst",
          "Print List": "Lijst afdrukken",
          "Name:": "Naam:",
          "Email:": "E-mail:",
          "Change Password": "Wachtwoord wijzigen",
          "Change Email": "E-mailadres wijzigen",
          "Delete Account": "Account verwijderen"
        };
      }
    ], [
      {
        /*
          /Users/Admin/Projects/Nitro/source/scripts/models/task.coffee
        */

        'base': 7,
        '../models/list': 24,
        '../controllers/sync': 12,
        '../models/default/list.json': 25,
        '../models/default/task.json': 26
      }, function(require, module, exports) {
        var Base, List, Sync, Task, TaskCollection, _ref;
        Base = require('base');
        List = require('../models/list');
        Sync = require('../controllers/sync');
        Task = (function(_super) {
          __extends(Task, _super);

          function Task() {
            _ref = Task.__super__.constructor.apply(this, arguments);
            return _ref;
          }

          Task.prototype.defaults = {
            id: null,
            name: '',
            date: null,
            notes: '',
            priority: 1,
            completed: false
          };

          return Task;

        })(Base.Model);
        TaskCollection = (function(_super) {
          __extends(TaskCollection, _super);

          TaskCollection.prototype.className = 'task';

          TaskCollection.prototype.model = Task;

          function TaskCollection() {
            this.tag = __bind(this.tag, this);
            this.search = __bind(this.search, this);
            this.sortTasks = __bind(this.sortTasks, this);
            this.list = __bind(this.list, this);
            this.completed = __bind(this.completed, this);
            this.active = __bind(this.active, this);
            this.toArray = __bind(this.toArray, this);
            var _this = this;
            TaskCollection.__super__.constructor.apply(this, arguments);
            this.on('create:model', function(task) {
              var list;
              if (List.exists(task.list)) {
                list = List.get(task.list);
                list.tasks.add(task, {
                  silent: true
                });
                return list.tasks.trigger('change');
              }
            });
          }

          TaskCollection.prototype.toArray = function() {
            var array;
            array = [];
            this.forEach(function(task) {
              return array.push(task.id);
            });
            return array;
          };

          TaskCollection.prototype.active = function(list) {
            return this.filter(function(task) {
              return !task.completed && (list ? task.list === list : true);
            });
          };

          TaskCollection.prototype.completed = function() {
            return this.filter(function(task) {
              return task.completed;
            });
          };

          TaskCollection.prototype.list = function(listId) {
            if (!listId) {
              return [];
            }
            if (listId === 'all') {
              return this.active();
            } else if (listId === 'completed') {
              return this.completed();
            }
            return this.filter(function(task) {
              return task.list === listId;
            });
          };

          TaskCollection.prototype["default"] = function() {
            if (Task.length === 0) {
              List = require('../models/list');
              List.refresh(require('../models/default/list.json'));
              return this.refresh(require('../models/default/task.json'));
            }
          };

          TaskCollection.prototype.sortTasks = function(tasks) {
            var sorted;
            return sorted = tasks.sort(function(a, b) {
              var diff, newA, newB;
              if (a.completed === b.completed) {
                diff = a.priority - b.priority;
                if (diff === 0) {
                  newA = a.date === false || a.date === '' ? Infinity : a.date;
                  newB = b.date === false || b.date === '' ? Infinity : b.date;
                  diff = newB - newA;
                  if (isNaN(diff)) {
                    return b.name.localeCompare(a.name);
                  } else {
                    return diff;
                  }
                } else {
                  return diff;
                }
              } else if (a.completed && !b.completed) {
                return -1;
              } else if (!a.completed && b.completed) {
                return 1;
              } else {
                return a.completed - b.completed;
              }
            });
          };

          TaskCollection.prototype.search = function(query) {
            if (!query) {
              return this.all;
            }
            query = query.toLowerCase().split(' ');
            return this.filter(function(item) {
              var matches, word, _i, _len, _ref1;
              matches = true;
              for (_i = 0, _len = query.length; _i < _len; _i++) {
                word = query[_i];
                if (!((_ref1 = item.name) != null ? _ref1.toLowerCase().match(word) : void 0)) {
                  matches = false;
                }
              }
              return matches;
            });
          };

          TaskCollection.prototype.tag = function(tag) {
            if (!tag) {
              return [];
            }
            tag = tag.toLowerCase();
            return this.filter(function(item) {
              var _ref1;
              return ((_ref1 = item.name) != null ? _ref1.toLowerCase().indexOf('#' + tag) : void 0) > -1;
            });
          };

          return TaskCollection;

        })(Sync.Collection);
        module.exports = new TaskCollection();
        return module.exports.type = 'major';
      }
    ], [
      {
        /*
          /Users/Admin/Projects/Nitro/source/scripts/models/list.coffee
        */

        'base': 7,
        '../controllers/sync': 12,
        './task': 23
      }, function(require, module, exports) {
        var Base, List, ListCollection, Sync;
        Base = require('base');
        Sync = require('../controllers/sync');
        List = (function(_super) {
          __extends(List, _super);

          List.prototype.defaults = {
            id: null,
            name: ''
          };

          List.current = null;

          function List() {
            this.toJSON = __bind(this.toJSON, this);
            this.destroyTasks = __bind(this.destroyTasks, this);
            this.moveCompleted = __bind(this.moveCompleted, this);
            this.moveTask = __bind(this.moveTask, this);
            var Task, taskIds,
              _this = this;
            List.__super__.constructor.apply(this, arguments);
            Task = require('./task');
            if (Array.isArray(this.tasks)) {
              taskIds = this.tasks;
              this.tasks = new Task.constructor();
              taskIds.forEach(function(id) {
                var task;
                if (Task.exists(id)) {
                  task = Task.get(id);
                  return _this.tasks.add(task, {
                    silent: true
                  });
                } else {
                  return console.log('could not find task', id);
                }
              });
            } else {
              this.tasks = new Task.constructor();
            }
            this.tasks.on('change', function() {
              return _this.trigger('save');
            });
            this.tasks.type = 'minor';
          }

          List.prototype.moveTask = function(task, list) {
            if (this.id === list.id) {
              return;
            }
            task.list = list.id;
            list.tasks.add(task);
            return this.tasks.remove(task);
          };

          List.prototype.moveCompleted = function() {
            return this.tasks.refresh(this.tasks.active(), true);
          };

          List.prototype.destroyTasks = function() {
            return this.tasks.each(function(task) {
              if (task.completed) {
                return task.destroy({
                  sync: false
                });
              } else {
                return task.list = 'inbox';
              }
            });
          };

          List.prototype.toJSON = function() {
            return {
              id: this.id,
              name: this.name,
              tasks: this.tasks.toArray()
            };
          };

          return List;

        })(Base.Model);
        ListCollection = (function(_super) {
          __extends(ListCollection, _super);

          ListCollection.prototype.className = 'list';

          ListCollection.prototype.model = List;

          function ListCollection() {
            ListCollection.__super__.constructor.apply(this, arguments);
          }

          return ListCollection;

        })(Sync.Collection);
        module.exports = new ListCollection();
        return module.exports.on('refresh', function() {
          if (List.current == null) {
            return;
          }
          if (List.exists(List.current.id)) {
            console.log('Updating List.current');
            return List.current = List.get(List.current.id);
          } else {
            console.log('Changing List.current to inbox');
            return List.current = List.get('inbox');
          }
        });
      }
    ], [
      {
        /*
          /Users/Admin/Projects/Nitro/source/scripts/models/default/list.json
        */

      }, function(require, module, exports) {
        return module.exports = [
          {
            "name": "Inbox",
            "tasks": ["c-0", "c-2", "c-4", "c-6", "c-8", "c-10", "c-12", "c-14"],
            "permanent": true,
            "id": "inbox"
          }
        ];
      }
    ], [
      {
        /*
          /Users/Admin/Projects/Nitro/source/scripts/models/default/task.json
        */

      }, function(require, module, exports) {
        return module.exports = [
          {
            "name": "Welcome to Nitro!",
            "date": "",
            "notes": "",
            "completed": false,
            "priority": 3,
            "list": "inbox",
            "id": "c-0"
          }, {
            "name": "Add a new task by using the box above",
            "date": "",
            "notes": "",
            "completed": false,
            "priority": 3,
            "list": "inbox",
            "id": "c-2"
          }, {
            "name": "Create a new list by using the box in the sidebar",
            "date": "",
            "notes": "",
            "completed": false,
            "priority": 2,
            "list": "inbox",
            "id": "c-4"
          }, {
            "name": "You can see all your tasks and completed tasks by clicking on the list in the sidebar",
            "date": "",
            "notes": "",
            "completed": false,
            "priority": 2,
            "list": "inbox",
            "id": "c-6"
          }, {
            "name": "Click on a task to expand it",
            "date": "",
            "notes": "<div>You can add notes, due dates and change the priority</div>",
            "completed": false,
            "priority": 2,
            "list": "inbox",
            "id": "c-8"
          }, {
            "name": "Group your tasks by clicking the lists icon to the right of the list title",
            "date": "",
            "notes": "",
            "completed": false,
            "priority": 1,
            "list": "inbox",
            "id": "c-10"
          }, {
            "name": "Get Nitro Pro to unlock more features and be awesome",
            "date": "",
            "notes": "",
            "completed": false,
            "priority": 1,
            "list": "inbox",
            "id": "c-12"
          }, {
            "name": "Thanks for checking out Nitro! We hope you enjoy it as much as we did creating it.",
            "date": "",
            "notes": "",
            "completed": false,
            "priority": 1,
            "list": "inbox",
            "id": "c-14"
          }
        ];
      }
    ], [
      {
        /*
          /Users/Admin/Projects/Nitro/source/scripts/controllers/auth.coffee
        */

        '../models/setting': 11,
        '../views/auth': 28,
        '../utils/event': 14,
        '../utils/config': 15
      }, function(require, module, exports) {
        var Auth, Event, Setting, View, config;
        Setting = require('../models/setting');
        View = require('../views/auth');
        Event = require('../utils/event');
        config = require('../utils/config');
        Auth = (function() {
          function Auth() {
            this.login = __bind(this.login, this);
            this.register = __bind(this.register, this);
            this.skip = __bind(this.skip, this);
            window.view = this.view = new View();
            this.view.on('login', this.login);
            this.view.on('register', this.register);
            this.view.on('skip', this.skip);
          }

          Auth.prototype.skip = function() {
            return Event.trigger('auth:skip');
          };

          Auth.prototype.loadToken = function(id, token) {
            Setting.uid = id;
            Setting.token = token;
            return Event.trigger('auth:token', id, token);
          };

          Auth.prototype.register = function(name, email, password) {
            var _this = this;
            return $.ajax({
              type: 'post',
              url: "http://" + config.server + "/register",
              data: {
                name: name,
                email: email,
                password: password
              },
              success: function(status) {
                return _this.view.trigger('register:success');
              },
              error: function(xhr, status, msg) {
                return _this.view.trigger('register:fail', xhr.status, xhr.responseText);
              }
            });
          };

          Auth.prototype.login = function(email, password) {
            var _this = this;
            return $.ajax({
              type: 'post',
              url: "http://" + config.server + "/login",
              data: {
                email: email,
                password: password
              },
              dataType: 'json',
              success: function(_arg) {
                var email, name, pro, token, uid;
                uid = _arg[0], token = _arg[1], email = _arg[2], name = _arg[3], pro = _arg[4];
                _this.view.trigger('login:success');
                Setting.pro = pro;
                Setting.user_name = name;
                Setting.user_email = email;
                return _this.loadToken(uid, token);
              },
              error: function(xhr, status, msg) {
                return _this.view.trigger('login:fail', xhr.status, xhr.responseText);
              }
            });
          };

          return Auth;

        })();
        return module.exports = Auth;
      }
    ], [
      {
        /*
          /Users/Admin/Projects/Nitro/source/scripts/views/auth.coffee
        */

        'base': 7,
        '../models/setting': 11,
        '../templates/auth': 29
      }, function(require, module, exports) {
        var Auth, Base, Setting;
        Base = require('base');
        Setting = require('../models/setting');
        Auth = (function(_super) {
          __extends(Auth, _super);

          Auth.prototype.template = require('../templates/auth');

          Auth.prototype.elements = {
            '.form': 'form',
            '.auth-name': 'name',
            '.auth-email': 'email',
            '.auth-password': 'password',
            'button': 'buttons',
            '.login': 'loginBtn',
            '.register': 'registerBtn',
            '.note-login': 'loginMessage',
            '.note-success': 'successMessage',
            '.error': 'errorMessage'
          };

          Auth.prototype.events = {
            'click .login': 'submit',
            'click .register': 'submit',
            'click .switch-mode': 'switchMode',
            'click .offline': 'skipAuth',
            'keydown input': 'keydown'
          };

          function Auth() {
            this.hideError = __bind(this.hideError, this);
            this.skipAuth = __bind(this.skipAuth, this);
            this.switchMode = __bind(this.switchMode, this);
            this.valid = __bind(this.valid, this);
            this.submit = __bind(this.submit, this);
            this.keydown = __bind(this.keydown, this);
            this.show = __bind(this.show, this);
            this.hide = __bind(this.hide, this);
            var _this = this;
            Base.touchify(this.events);
            Auth.__super__.constructor.apply(this, arguments);
            this.el = $('.auth');
            this.bind();
            this.mode = 'login';
            this.listen(Setting, {
              'offline login': this.hide
            });
            this.on('login:success', function() {
              _this.spinner(false);
              return _this.hide();
            });
            this.on('login:fail register:fail', function(status, message) {
              _this.spinner(false);
              return _this.showError(status, message);
            });
            this.on('register:success', function() {
              _this.spinner(false);
              _this.switchMode('login');
              return _this.showSuccess();
            });
          }

          Auth.prototype.hide = function() {
            this.el.fadeOut(300);
            return this.buttons.removeClass('active');
          };

          Auth.prototype.show = function() {
            return this.el.fadeIn(300);
          };

          Auth.prototype.keydown = function(e) {
            if (e.keyCode === 13) {
              this.submit();
            }
            return true;
          };

          Auth.prototype.submit = function() {
            if (this.valid()) {
              this.spinner(true);
              switch (this.mode) {
                case 'login':
                  return this.trigger('login', this.email.val(), this.password.val());
                case 'register':
                  return this.trigger('register', this.name.val(), this.email.val(), this.password.val());
              }
            }
          };

          Auth.prototype.valid = function() {
            var valid;
            if (this.mode) {
              valid = this.email.val().length && this.password.val().length;
            } else {
              valid = this.email.val().length && this.password.val().length && this.name.val().length;
            }
            if (!valid) {
              this.showError('Please  fill out all fields');
            }
            return valid;
          };

          Auth.prototype.switchMode = function(mode) {
            if (typeof mode !== 'string') {
              this.mode = this.mode === 'login' ? 'register' : 'login';
            } else {
              this.mode = mode;
            }
            this.el.toggleClass('login', this.mode === 'login');
            this.el.toggleClass('register', this.mode === 'register');
            this.hideError();
            switch (this.mode) {
              case 'login':
                return this.email.focus();
              case 'register':
                return this.name.focus();
            }
          };

          Auth.prototype.skipAuth = function() {
            this.hide();
            return this.trigger('skip');
          };

          Auth.prototype.hideError = function() {
            return this.errorMessage.removeClass('populated').empty();
          };

          Auth.prototype.showError = function(status, message) {
            return this.errorMessage.addClass('populated').html(this.template(status, message));
          };

          Auth.prototype.showSuccess = function() {
            this.hideError();
            this.loginMessage.addClass('hidden');
            return this.successMessage.removeClass('hidden');
          };

          Auth.prototype.spinner = function(status) {
            return this.buttons.toggleClass('active', status);
          };

          return Auth;

        })(Base.Controller);
        return module.exports = Auth;
      }
    ], [
      {
        /*
          /Users/Admin/Projects/Nitro/source/scripts/templates/auth.coffee
        */

        '../utils/config': 15
      }, function(require, module, exports) {
        var config;
        config = require('../utils/config');
        return module.exports = function(status, message) {
          console.log(status, message);
          switch (status) {
            case 404:
              return 'Could not connect to server.';
            default:
              switch (message) {
                case 'err_bad_pass':
                  return "Incorrect email or password. <a href=\"http://" + config.server + "/forgot\">Want to reset?</a>";
                case 'err_old_email':
                  return 'Sorry, but that email address has already been used';
                default:
                  return message;
              }
          }
        };
      }
    ], [
      {
        /*
          /Users/Admin/Projects/Nitro/source/scripts/views/keys.coffee
        */

        '../utils/keys': 9,
        'base': 7
      }, function(require, module, exports) {
        var Base, Keys, keys;
        keys = require('../utils/keys');
        Base = require('base');
        Keys = (function(_super) {
          __extends(Keys, _super);

          Keys.prototype.events = {
            'keyup': 'keyup',
            'blur .editable, input': 'blur',
            'focus .editable, input': 'focus'
          };

          function Keys() {
            this.keyup = __bind(this.keyup, this);
            this.blur = __bind(this.blur, this);
            this.focus = __bind(this.focus, this);
            Keys.__super__.constructor.apply(this, arguments);
            this.el = $('body');
            this.bind();
            this.input = null;
            this.focused = false;
          }

          Keys.prototype.focus = function(e) {
            this.input = $(e.target);
            return this.focused = true;
          };

          Keys.prototype.blur = function() {
            return this.focused = false;
          };

          Keys.prototype.keyup = function(e) {
            var keyCode;
            keyCode = e.keyCode;
            if (this.focused) {
              if (keyCode === keys.escape) {
                this.input.blur();
              }
              return true;
            }
            switch (keyCode) {
              case keys.escape:
                return this.tasks.collapseAll();
              case keys.n:
                return $(".new-task").focus().val("");
              case keys.l:
                return $(".new-list").focus().val("");
              case keys.f:
                return $(".search input").focus().val("");
              case keys.p:
                return $(".buttons .print").trigger("click");
              case keys.comma:
                return $(".settingsButton img").trigger("click");
              case keys.k:
                if ($(".sidebar .current").prev().length === 0) {
                  return $(".sidebar .completed").trigger("click");
                } else {
                  $(".sidebar .current").prev().trigger("click");
                  return $(".new-task").blur();
                }
                break;
              case keys.j:
                if ($(".sidebar .current").next().hasClass("lists")) {
                  $($(".sidebar .lists").children()[0]).trigger("click");
                  return $(".new-task").blur();
                } else {
                  $(".sidebar .current").next().trigger("click");
                  return $(".new-task").blur();
                }
            }
          };

          return Keys;

        })(Base.Controller);
        return module.exports = Keys;
      }
    ], [
      {
        /*
          /Users/Admin/Projects/Nitro/source/scripts/views/loadingScreen.coffee
        */

        'base': 7,
        '../utils/event': 14
      }, function(require, module, exports) {
        var Base, Event, LoadingScreen;
        Base = require('base');
        Event = require('../utils/event');
        LoadingScreen = (function(_super) {
          __extends(LoadingScreen, _super);

          function LoadingScreen() {
            this.show = __bind(this.show, this);
            this.hide = __bind(this.hide, this);
            LoadingScreen.__super__.constructor.apply(this, arguments);
            this.el = $('.loading-screen');
            this.bind();
            Event.on('app:ready', this.hide);
          }

          LoadingScreen.prototype.hide = function() {
            return this.el.fadeOut(300);
          };

          LoadingScreen.prototype.show = function() {
            return this.el.fadeIn(300);
          };

          return LoadingScreen;

        })(Base.Controller);
        return module.exports = LoadingScreen;
      }
    ], [
      {
        /*
          /Users/Admin/Projects/Nitro/source/scripts/views/lists.coffee
        */

        'base': 7,
        '../models/list': 24,
        '../utils/keys': 9,
        '../views/list/item': 33
      }, function(require, module, exports) {
        var Base, List, ListItem, Lists, keys;
        Base = require('base');
        List = require('../models/list');
        keys = require('../utils/keys');
        ListItem = require('../views/list/item');
        Lists = (function(_super) {
          __extends(Lists, _super);

          Lists.prototype.elements = {
            'ul': 'lists',
            '.create-list': 'input'
          };

          Lists.prototype.events = {
            'keyup .create-list': 'keyup'
          };

          function Lists() {
            this.select = __bind(this.select, this);
            this.addAll = __bind(this.addAll, this);
            this.addOne = __bind(this.addOne, this);
            this.createNew = __bind(this.createNew, this);
            this.keyup = __bind(this.keyup, this);
            Base.touchify(this.events);
            Lists.__super__.constructor.apply(this, arguments);
            this.el = $('.sidebar');
            this.bind();
            this.listen(List, {
              'create:model': this.addOne,
              'refresh': this.addAll,
              'select:model': this.select
            });
          }

          Lists.prototype.keyup = function(e) {
            if (e.which === keys.enter && this.input.val().length) {
              return this.createNew();
            }
          };

          Lists.prototype.createNew = function() {
            var list, name;
            name = this.input.val();
            this.input.val('');
            list = List.create({
              name: name
            });
            return list.trigger('select');
          };

          Lists.prototype.addOne = function(list) {
            var listItem;
            if (list.id === 'inbox') {
              return;
            }
            listItem = new ListItem({
              list: list
            });
            return this.lists.append(listItem.render().el);
          };

          Lists.prototype.addAll = function() {
            this.lists.empty();
            return List.forEach(this.addOne);
          };

          Lists.prototype.select = function() {
            return this.lists.find('.current').removeClass('current');
          };

          return Lists;

        })(Base.Controller);
        return module.exports = Lists;
      }
    ], [
      {
        /*
          /Users/Admin/Projects/Nitro/source/scripts/views/list/item.coffee
        */

        'base': 7,
        '../../templates/list': 34
      }, function(require, module, exports) {
        var Base, ListItem;
        Base = require('base');
        ListItem = (function(_super) {
          __extends(ListItem, _super);

          ListItem.prototype.template = require('../../templates/list');

          ListItem.prototype.elements = {
            '.name': 'name',
            '.count': 'count'
          };

          ListItem.prototype.events = {
            'click': 'click'
          };

          function ListItem() {
            this.remove = __bind(this.remove, this);
            this.select = __bind(this.select, this);
            this.click = __bind(this.click, this);
            this.updateName = __bind(this.updateName, this);
            this.updateCount = __bind(this.updateCount, this);
            this.render = __bind(this.render, this);
            Base.touchify(this.events);
            ListItem.__super__.constructor.apply(this, arguments);
            this.listen([
              this.list, {
                'select': this.select,
                'change': this.updateName,
                'before:destroy': this.remove
              }, this.list.tasks, {
                'change': this.updateCount
              }
            ]);
          }

          ListItem.prototype.render = function() {
            this.el = $(this.template(this.list));
            this.bind();
            return this;
          };

          ListItem.prototype.updateCount = function() {
            return this.count.text(this.list.tasks.length);
          };

          ListItem.prototype.updateName = function() {
            return this.name.text(this.list.name);
          };

          ListItem.prototype.click = function() {
            return this.list.trigger('select');
          };

          ListItem.prototype.select = function() {
            return this.el.addClass('current');
          };

          ListItem.prototype.remove = function() {
            this.unbind();
            return this.el.remove();
          };

          return ListItem;

        })(Base.Controller);
        return module.exports = ListItem;
      }
    ], [
      {
        /*
          /Users/Admin/Projects/Nitro/source/scripts/templates/list.coffee
        */

        '../models/list': 24
      }, function(require, module, exports) {
        var List;
        List = require('../models/list');
        return module.exports = function(list) {
          var _ref;
          return "<li data-item=\"" + list.id + "\" class=\"list" + (((_ref = List.current) != null ? _ref.id : void 0) === list.id ? " current" : "") + "\">\n  <div class=\"arrow\"></div>\n  <span class=\"name\">" + list.name + "</span>\n  <div class=\"count\">" + list.tasks.length + "</div>\n</li>";
        };
      }
    ], [
      {
        /*
          /Users/Admin/Projects/Nitro/source/scripts/views/title.coffee
        */

        'base': 7,
        '../models/list': 24,
        '../utils/keys': 9
      }, function(require, module, exports) {
        var Base, List, Title, keys;
        Base = require('base');
        List = require('../models/list');
        keys = require('../utils/keys');
        Title = (function(_super) {
          __extends(Title, _super);

          Title.prototype.elements = {
            'h1': 'title'
          };

          Title.prototype.events = {
            'keyup h1': 'rename',
            'keypress h1': 'preventer'
          };

          function Title() {
            this.rename = __bind(this.rename, this);
            this.render = __bind(this.render, this);
            Base.touchify(this.events);
            Title.__super__.constructor.apply(this, arguments);
            this.el = $('.tasks .title');
            this.bind();
            this.listen(List, {
              'select:model': this.render
            });
          }

          Title.prototype.render = function(list) {
            this.list = list;
            this.title.text(this.list.name);
            if (this.list.permanent) {
              return this.title.removeAttr('contenteditable');
            } else {
              return this.title.attr('contenteditable', true);
            }
          };

          Title.prototype.rename = function(e) {
            return this.list.name = this.title.text();
          };

          Title.prototype.preventer = function(e) {
            if (e.keyCode === keys.enter) {
              return e.preventDefault();
            }
          };

          return Title;

        })(Base.Controller);
        return module.exports = Title;
      }
    ], [
      {
        /*
          /Users/Admin/Projects/Nitro/source/scripts/views/list_buttons.coffee
        */

        'base': 7,
        '../models/list': 24,
        './modal': 37
      }, function(require, module, exports) {
        var Base, List, ListButtons;
        Base = require('base');
        List = require('../models/list');
        ListButtons = (function(_super) {
          __extends(ListButtons, _super);

          ListButtons.prototype.elements = {
            '.trash': 'deleteBtn',
            '.sort': 'sortBtn'
          };

          ListButtons.prototype.events = {
            'click .trash': 'trash',
            'click .email': 'email',
            'click .print': 'print',
            'click .share': 'share',
            'click .sort': 'sort'
          };

          function ListButtons() {
            this.update = __bind(this.update, this);
            Base.touchify(this.events);
            ListButtons.__super__.constructor.apply(this, arguments);
            this.el = $('.list-buttons');
            this.bind();
            this.listen(List, {
              'select:model': this.update
            });
          }

          ListButtons.prototype.update = function(list) {
            if (list.permanent) {
              this.deleteBtn.fadeOut(150);
            } else {
              this.deleteBtn.fadeIn(150);
            }
            if (list.disabled) {
              return this.sortBtn.fadeOut(150);
            } else {
              return this.sortBtn.fadeIn(150);
            }
          };

          ListButtons.prototype.trash = function() {
            return Modal.get('trashList').run();
          };

          ListButtons.prototype.email = function() {
            return Modal.get('email').show();
          };

          ListButtons.prototype.print = function() {
            return window.print();
          };

          ListButtons.prototype.share = function() {
            return Modal.get('share').show();
          };

          ListButtons.prototype.sort = function() {
            return Setting.toggle('sort');
          };

          return ListButtons;

        })(Base.Controller);
        return module.exports = ListButtons;
      }
    ], [
      {
        /*
          /Users/Admin/Projects/Nitro/source/scripts/views/modal.coffee
        */

        'base': 7,
        'jqueryify': 1,
        '../utils/keys': 9,
        '../models/setting': 11,
        '../controllers/sync': 12,
        '../models/list': 24
      }, function(require, module, exports) {
        var $, Base, CONFIG, Keys, Modal, Sync, modals, setting;
        Base = require('base');
        $ = require('jqueryify');
        Keys = require('../utils/keys');
        CONFIG = require('../utils/conf');
        setting = require('../models/setting');
        Sync = require('../controllers/sync');
        Modal = (function(_super) {
          __extends(Modal, _super);

          function Modal(opts) {
            Base.touchify(opts.events);
            Modal.__super__.constructor.apply(this, arguments);
          }

          Modal.prototype.state = false;

          Modal.prototype.show = function() {
            var _this = this;
            if (this.state !== false) {
              return;
            }
            this.state = true;
            this.el.show(0).addClass('show');
            if (this.onShow) {
              this.onShow();
            }
            return setTimeout((function() {
              return _this.el.on('click.modal, touchend.modal', function(event) {
                if (event.target.className.indexOf('modal') >= 0) {
                  return _this.hide();
                }
              });
            }), 500);
          };

          Modal.prototype.hide = function() {
            var _this = this;
            if (this.state !== true) {
              return;
            }
            this.state = false;
            this.el.removeClass('show');
            setTimeout((function() {
              _this.el.hide(0);
              if (_this.onHide) {
                return _this.onHide();
              }
            }), 350);
            return this.el.off('click.modal, touchend.modal');
          };

          return Modal;

        })(Base.Controller);
        modals = [];
        return module.exports = {
          get: function(name) {
            return modals[name];
          },
          init: function() {
            modals['trashTask'] = new Modal({
              el: $('.modal.delete-task'),
              events: {
                'click .true': 'delete',
                'click .false': 'hide'
              },
              run: function(task) {
                this.task = task;
                if (setting.confirmDelete) {
                  return this.show();
                } else {
                  return this["delete"]();
                }
              },
              "delete": function() {
                var _ref;
                if ((_ref = this.task) != null) {
                  _ref.destroy();
                }
                return this.hide();
              }
            });
            modals['trashList'] = new Modal({
              el: $('.modal.delete-list'),
              events: {
                'click .true': 'delete',
                'click .false': 'hide'
              },
              run: function() {
                if (setting.confirmDelete) {
                  return this.show();
                } else {
                  return this["delete"]();
                }
              },
              "delete": function() {
                List.current.trigger('kill');
                return this.hide();
              }
            });
            modals['email'] = new Modal({
              el: $('.modal.email'),
              elements: {
                'input': 'input'
              },
              events: {
                'click button': 'submit',
                'keyup input': 'keyup'
              },
              keyup: function(e) {
                if (e.keyCode === Keys.ENTER) {
                  return this.submit();
                }
              },
              submit: function() {
                var email, listId, uid;
                if (setting.isPro()) {
                  email = this.input.val();
                  if (!email.match(/.+@.+\..+/)) {
                    return;
                  }
                  uid = require('../models/setting').get('uid');
                  listId = require('../models/list').current.id;
                  Sync.emit('emailList', [uid, listId, email]);
                } else {
                  $('.modal.proventor').modal('show');
                }
                return this.hide();
              },
              onShow: function() {
                return this.input.focus();
              },
              onHide: function() {
                return this.input.val('');
              }
            });
            return modals['share'] = new Modal({
              el: $('.modal.share')
            });
          }
        };
      }
    ], [
      {
        /*
          /Users/Admin/Projects/Nitro/source/scripts/views/tasks.coffee
        */

        'base': 7,
        '../views/tasks.item': 39,
        '../models/task': 23,
        '../models/list': 24,
        '../models/setting': 11,
        '../utils/keys': 9,
        '../utils/date': 43,
        '../utils/timer': 40,
        '../templates/task': 41
      }, function(require, module, exports) {
        var Base, List, Setting, Task, TaskItem, Tasks, dateDetector, delay, keys;
        Base = require('base');
        TaskItem = require('../views/tasks.item');
        Task = require('../models/task');
        List = require('../models/list');
        Setting = require('../models/setting');
        keys = require('../utils/keys');
        dateDetector = require('../utils/date');
        delay = require('../utils/timer');
        Tasks = (function(_super) {
          __extends(Tasks, _super);

          Tasks.prototype.template = require('../templates/task');

          Tasks.prototype.elements = {
            'ul.tasks': 'tasks',
            'input.new-task': 'input'
          };

          Tasks.prototype.events = {
            'click': 'collapseOnClick',
            'scroll': 'scrollbars',
            'keydown input.new-task': 'createNew'
          };

          function Tasks() {
            this.scrollbars = __bind(this.scrollbars, this);
            this.collapseOnClick = __bind(this.collapseOnClick, this);
            this.collapse = __bind(this.collapse, this);
            this.createNew = __bind(this.createNew, this);
            this.render = __bind(this.render, this);
            this.refresh = __bind(this.refresh, this);
            this.addOne = __bind(this.addOne, this);
            this.bindTask = __bind(this.bindTask, this);
            Base.touchify(this.events);
            Tasks.__super__.constructor.apply(this, arguments);
            this.el = $('.main');
            this.bind();
            this.views = [];
            this.timers = {};
            this.currentTask;
            this.currentList;
            this.listen([
              Task, {
                'refresh': this.refresh,
                'create:model': this.addOne
              }, List, {
                'select:model': this.render
              }, Setting, {
                'change:sort': this.render
              }
            ]);
          }

          Tasks.prototype.bindTask = function(view) {
            var _this = this;
            return view.on('select', function() {
              _this.collapse();
              return _this.currentTask = view;
            });
          };

          Tasks.prototype.addOne = function(task) {
            var view;
            view = new TaskItem({
              task: task
            });
            this.tasks.prepend(view.render().el);
            this.bindTask(view);
            this.views.push(view);
            return this.el.removeClass('empty');
          };

          Tasks.prototype.refresh = function() {
            if (List.current) {
              return this.render(List.current);
            }
          };

          Tasks.prototype.render = function(list) {
            var completed, html, last, oldItems, task, tasks, _i, _len, _ref, _ref1,
              _this = this;
            this.el.removeClass('empty');
            this.el.find('.message').remove();
            if (list instanceof List.model || list.id === 'all' || list.id === 'completed') {
              this.currentList = list;
            } else {
              console.log('debug', list);
            }
            this.input.toggle(!list.disabled);
            oldItems = this.views.slice(0);
            this.views = [];
            delay(1000, function() {
              var item, _i, _len, _results;
              _results = [];
              for (_i = 0, _len = oldItems.length; _i < _len; _i++) {
                item = oldItems[_i];
                _results.push(item.release());
              }
              return _results;
            });
            html = '';
            if (list.id === 'filter') {
              tasks = list.tasks;
              this.el.append(view.special);
            } else if (list != null ? list.tasks : void 0) {
              tasks = list.tasks;
              this.el.append(view.standard);
            } else {
              tasks = Task.list(list.id);
              this.el.append(view.empty);
            }
            if (false) {
              tasks = Task.sortTasks(tasks);
              last = (_ref = tasks[0]) != null ? _ref.priority : void 0;
              completed = (_ref1 = tasks[0]) != null ? _ref1.completed : void 0;
              for (_i = 0, _len = tasks.length; _i < _len; _i++) {
                task = tasks[_i];
                if (completed && !task.completed) {
                  completed = false;
                  task.group = true;
                }
                if (!completed && task.priority !== last) {
                  task.group = true;
                }
                last = task.priority;
                if (list.id === 'all') {
                  task.listName = List.get(task.list).name;
                }
                html = this.template(task) + html;
              }
            } else {
              list.tasks.forEach(function(task) {
                return html += _this.template(task);
              });
            }
            this.tasks.html(html);
            this.timers.bindTasks = delay(400, function() {
              return list.tasks.forEach(function(task) {
                var view;
                view = new TaskItem({
                  task: task,
                  el: _this.tasks.find("#task-" + task.id)
                });
                _this.bindTask(view);
                return _this.views.push(view);
              });
            });
            if (tasks.length === 0) {
              this.el.addClass('empty');
            }
            if (!is_touch_device()) {
              return this.input.focus();
            }
          };

          Tasks.prototype.createNew = function(e) {
            var name, _ref;
            if (e.keyCode === keys.enter && this.input.val().length) {
              name = this.input.val();
              this.input.val('');
              return Task.create({
                name: name,
                list: (_ref = this.currentList) != null ? _ref.id : void 0,
                date: dateDetector.parse(name)
              });
            }
          };

          Tasks.prototype.collapse = function() {
            if (this.currentTask) {
              return this.currentTask.collapse();
            }
          };

          Tasks.prototype.collapseOnClick = function(e) {
            if (e.target.className === 'main tasks') {
              return this.collapse();
            }
          };

          Tasks.prototype.scrollbars = function(e) {
            var target;
            target = $(e.currentTarget);
            target.addClass('show');
            clearTimeout(this.scrollbarTimeout);
            return this.scrollbarTimeout = setTimeout(function() {
              return target.removeClass('show');
            }, 1000);
          };

          Tasks.prototype.setupDraggable = function() {
            return $('body').on('mouseover', '.main .task', function() {
              if (Setting.sort && !$(this).hasClass('ui-draggable') && !List.current.disabled) {
                return $(this).draggable({
                  distance: 10,
                  scroll: false,
                  cursorAt: {
                    top: 15,
                    left: 30
                  },
                  helper: function(event, task) {
                    var element, id;
                    id = $(task).attr('id');
                    element = "<div data-id=\'" + id + "\' class=\'helper\'>" + ($(this).find('.name').text()) + "</div>";
                    $('body').append(element);
                    return $("[data-id=" + id + "]");
                  }
                });
              }
            });
          };

          Tasks.prototype.setupSortable = function() {
            var self;
            self = this;
            return $(this.el[1]).sortable({
              distance: 10,
              scroll: false,
              cursorAt: {
                top: 15,
                left: 30
              },
              helper: function(event, task) {
                var element, id;
                id = $(task).attr('id');
                element = "<div data-id=\'" + id + "\' class=\'helper\'>" + ($(task).find('.name').text()) + "</div>";
                $('body').append(element);
                return $("[data-id=" + id + "]");
              },
              update: function(event, ui) {
                var arr;
                arr = [];
                $(this).children().each(function(index) {
                  return arr.unshift($(this).attr('id').slice(5));
                });
                return self.list.updateAttribute('tasks', arr);
              }
            });
          };

          return Tasks;

        })(Base.Controller);
        return module.exports = Tasks;
      }
    ], [
      {
        /*
          /Users/Admin/Projects/Nitro/source/scripts/views/tasks.item.coffee
        */

        'base': 7,
        './modal': 37,
        '../models/list': 24,
        '../models/setting': 11,
        '../utils/keys': 9,
        '../utils/timer': 40,
        '../utils/translate': 10,
        '../templates/task': 41
      }, function(require, module, exports) {
        var Base, List, TaskItem, delay, keys, setting, translate;
        Base = require('base');
        List = require('../models/list');
        setting = require('../models/setting');
        keys = require('../utils/keys');
        delay = require('../utils/timer');
        translate = require('../utils/translate');
        TaskItem = (function(_super) {
          __extends(TaskItem, _super);

          TaskItem.prototype.template = require('../templates/task');

          TaskItem.prototype.elements = {
            '.name': 'name',
            '.input-name': 'inputName',
            '.date': 'date',
            '.notes': 'notesParent',
            '.notes .inner': 'notes',
            'time': 'time'
          };

          TaskItem.prototype.events = {
            'click .delete': 'remove',
            'click .priority-button div': 'setPriority',
            'click .checkbox': 'toggleCompleted',
            'click .tag': 'tagClick',
            'click': 'expand',
            'blur .input-name': 'endEdit',
            'keypress .input-name': 'endEditOnEnter',
            'focus .notes': 'notesEdit',
            'blur .notes': 'notesSave',
            'change .date': 'datesSave'
          };

          function TaskItem() {
            this.tagClick = __bind(this.tagClick, this);
            this.datesSave = __bind(this.datesSave, this);
            this.notesSave = __bind(this.notesSave, this);
            this.notesEdit = __bind(this.notesEdit, this);
            this.updateName = __bind(this.updateName, this);
            this.endEditOnEnter = __bind(this.endEditOnEnter, this);
            this.endEdit = __bind(this.endEdit, this);
            this.updatePriority = __bind(this.updatePriority, this);
            this.setPriority = __bind(this.setPriority, this);
            this.updateCompleted = __bind(this.updateCompleted, this);
            this.toggleCompleted = __bind(this.toggleCompleted, this);
            this.collapse = __bind(this.collapse, this);
            this.expand = __bind(this.expand, this);
            this.release = __bind(this.release, this);
            this.remove = __bind(this.remove, this);
            this.render = __bind(this.render, this);
            Base.touchify(this.events);
            TaskItem.__super__.constructor.apply(this, arguments);
            this.expanded = false;
            this.listen(this.task, {
              'destroy': this.release,
              'change:name': this.updateName,
              'change:priority': this.updatePriority,
              'change:completed': this.updateCompleted
            });
          }

          TaskItem.prototype.render = function() {
            this.el = $(this.template(this.task));
            this.bind();
            return this;
          };

          TaskItem.prototype.remove = function() {
            return Modal.get('trashTask').run(this.task);
          };

          TaskItem.prototype.release = function() {
            this.unbind();
            return this.el.remove();
          };

          TaskItem.prototype.expand = function(e) {
            var notes;
            if (!this.expanded) {
              this.trigger('select');
              this.expanded = true;
              this.inputName.val(this.task.name);
              this.el.addClass('expanded animout');
              notes = this.notes.parent();
              return delay(300, function() {
                return notes.addClass('auto');
              });
            }
          };

          TaskItem.prototype.collapse = function() {
            if (this.expanded) {
              this.expanded = false;
              return this.el.removeClass('expanded');
            }
          };

          TaskItem.prototype.toggleCompleted = function(e) {
            var order;
            e.stopPropagation();
            if (this.task.completed === false) {
              this.task.completed = new Date().getTime();
            } else {
              this.task.completed = false;
            }
            if (false) {
              order = List.get(this.task.list).tasks.slice(0);
              if (order.indexOf(this.task.id) === -1) {
                order.push(this.task.id);
                return List.get(this.task.list).tasks = order;
              }
            } else if (false) {
              settings.moveCompleted();
              return this.el.remove();
            }
          };

          TaskItem.prototype.updateCompleted = function() {
            return this.el.toggleClass('completed', this.task.completed);
          };

          TaskItem.prototype.setPriority = function(e) {
            var priority;
            priority = $(e.target).data('id');
            return this.task.priority = priority;
          };

          TaskItem.prototype.updatePriority = function() {
            return this.el.removeClass('p1 p2 p3').addClass('p' + this.task.priority);
          };

          TaskItem.prototype.endEdit = function() {
            var val;
            val = this.inputName.val();
            if (val.length) {
              return this.task.name = val;
            } else {
              return this.task.destroy();
            }
          };

          TaskItem.prototype.endEditOnEnter = function(e) {
            if (e.which === keys.enter) {
              return this.inputName.blur();
            }
          };

          TaskItem.prototype.updateName = function() {
            return this.name.html(this.task.name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/#(\w+)/g, ' <span class="tag">#$1</span>'));
          };

          TaskItem.prototype.notesEdit = function() {
            if (this.notes.text() === translate('Notes')) {
              this.notes.text('');
            }
            return this.notesParent.removeClass('placeholder');
          };

          TaskItem.prototype.notesSave = function() {
            var text;
            text = this.notes.html();
            if (text === '') {
              this.notes.text(translate('Notes'));
              return this.notesParent.addClass('placeholder');
            } else {
              return this.task.notes = text;
            }
          };

          TaskItem.prototype.datesSave = function() {
            if (this.date.val().length > 0) {
              this.task.updateAttribute('date', this.date.datepicker('getDate').getTime());
              this.el.find('img').css('display', 'inline-block');
              this.time.text(Task.prettyDate(new Date(this.task.date)).words);
              return this.time.attr('class', Task.prettyDate(new Date(this.task.date)).className);
            } else {
              this.task.updateAttribute('date', '');
              this.el.find('img').removeAttr('style');
              return this.time.text('');
            }
          };

          TaskItem.prototype.tagClick = function(e) {
            e.stopPropagation();
            return List.trigger('change:current', {
              name: 'Tagged with ' + $(e.currentTarget).text(),
              id: 'filter',
              tasks: Task.tag($(e.currentTarget).text().substr(1)),
              disabled: true,
              permanent: true
            });
          };

          return TaskItem;

        })(Base.Controller);
        return module.exports = TaskItem;
      }
    ], [
      {
        /*
          /Users/Admin/Projects/Nitro/source/scripts/utils/timer.coffee
        */

      }, function(require, module, exports) {
        return module.exports = function(duration, fn) {
          return setTimeout(fn, duration);
        };
      }
    ], [
      {
        /*
          /Users/Admin/Projects/Nitro/source/scripts/templates/task.coffee
        */

        '../utils/prettydate': 42,
        '../utils/translate': 10
      }, function(require, module, exports) {
        var prettyDate, tags, text, translate;
        prettyDate = require('../utils/prettydate');
        translate = require('../utils/translate');
        text = {};
        translate.ready(function() {
          return text = translate({
            notes: 'Notes',
            date: 'Due Date',
            checkbox: 'Mark as completed',
            low: 'Set priority to low',
            medium: 'Set priority to medium',
            high: 'Set priority to high'
          });
        });
        tags = function(text) {
          if (!text) {
            return;
          }
          return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/#(\S+)/g, ' <span class="tag">#$1</span>');
        };
        return module.exports = function(task) {
          var date;
          date = prettyDate(task.date);
          return "<li id=\"task-" + task.id + "\" class=\"task" + (task.group ? ' group' : '') + (task.completed ? ' completed' : '') + " p" + task.priority + "\">\n  <div class=\"checkbox\" title=\"" + text.checkbox + "\"></div>\n  <div class=\"name\">" + (tags(task.name)) + "</div>\n  <input type=\"text\" class=\"input-name\">\n  <div class=\"right-controls\">" + (task.date ? "<img width='10' height='10' style='display: inline-block' src='img/calendar.png'>      <time class='" + date.className + "'>" + date.words + "</time>      <input class='date' placeholder='" + text.date + "' value='" + task.date + "'>" : "<img width='10' height='10' src='img/calendar.png'>      <time></time>      <input class='date' placeholder='" + text.date + "' value=''>") + (task.listName ? "<span class='listName'>" + task.listName + "</span>" : "") + "\n    <div class=\"priority-button\">\n      <div data-id=\"1\" title=\"" + text.low + "\" class=\"low\"></div>\n      <div data-id=\"2\" title=\"" + text.medium + "\" class=\"medium\"></div>\n      <div data-id=\"3\" title=\"" + text.high + "\" class=\"high\"></div>\n    </div>\n    <div class=\"delete\"></div>\n  </div>\n  <div class='notes" + (!task.notes ? " placeholder" : "") + "'>\n    <div class='inner editable' contenteditable='true'>" + (task.notes || "Notes") + "</div>\n  </div>\n</li>";
        };
      }
    ], [
      {
        /*
          /Users/Admin/Projects/Nitro/source/scripts/utils/prettydate.coffee
        */

        '../utils/translate': 10
      }, function(require, module, exports) {
        var month, translate;
        translate = require('../utils/translate');
        month = [];
        translate.ready(function() {
          return month = translate(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
        });
        return module.exports = function(date) {
          var className, difference, now, oneDay, words;
          if (!(date instanceof Date)) {
            return {
              words: '',
              className: ''
            };
          }
          now = new Date();
          difference = 0;
          oneDay = 86400000;
          difference = Math.ceil((date.getTime() - now.getTime()) / oneDay);
          words = '';
          className = '';
          /*
                
            Difference
            ==  5: '5 days left'
            ==  1: 'Due tomorrow'
            ==  0: 'Due today'
            == -1: 'Due yesterday'
            == -5: '5 days overdue'
          */

          if (difference === -1) {
            words = translate('yesterday');
            className = 'overdue';
          } else if (difference < -1) {
            difference = Math.abs(difference);
            words = difference + ' ' + translate('days ago');
            className = 'overdue';
          } else if (difference === 0) {
            words = translate('today');
            className = 'due';
          } else if (difference === 1) {
            words = translate('tomorrow');
            className = 'soon';
          } else if (difference < 15) {
            words = 'in ' + difference + ' days';
          } else {
            words = month[date.getMonth()] + ' ' + date.getDate();
          }
          return {
            words: words,
            className: className
          };
        };
      }
    ], [
      {
        /*
          /Users/Admin/Projects/Nitro/source/scripts/utils/date.coffee
        */

      }, function(require, module, exports) {
        /*
        
          Nitro Date
          ==========
        
          Reads a sentence and figures out a date for it.
        
          Written by George Czabania in February 2013.
        */

        var Now, api, dateParser, defineTrigger, removeTrigger, triggers;
        Now = (function() {
          function Now() {
            this.time = new Date();
            this.setup();
          }

          Now.prototype.setup = function() {
            this.day = this.time.getDate();
            this.weekDay = this.time.getDay();
            this.month = this.time.getMonth() + 1;
            return this.year = this.time.getFullYear();
          };

          Now.prototype.print = function(gap) {
            if (gap == null) {
              gap = "/";
            }
            return "" + this.day + gap + this.month + gap + this.year;
          };

          Now.prototype.value = function() {
            return this.time;
          };

          Now.prototype.increment = function(key, value) {
            switch (key) {
              case "day":
                this.time.setDate(this.day + value);
                break;
              case "month":
                this.time.setMonth(--value);
                break;
              case "year":
                this.time.setYear(year);
                break;
              default:
                return false;
            }
            this.setup();
            return true;
          };

          return Now;

        })();
        triggers = {};
        defineTrigger = function(trigger, fn) {
          var regexp;
          regexp = new RegExp(trigger, "i");
          return triggers[trigger] = {
            regexp: regexp,
            fn: fn
          };
        };
        removeTrigger = function(trigger) {
          return delete triggers[trigger];
        };
        dateParser = function(text) {
          var date, match, obj, trigger;
          for (trigger in triggers) {
            obj = triggers[trigger];
            if (match = text.match(obj.regexp)) {
              date = obj.fn(new Now(), match);
              return (date != null ? date.value() : void 0) || false;
            }
          }
          return false;
        };
        defineTrigger("today", function(now) {
          return now;
        });
        defineTrigger("tomorrow", function(now) {
          now.increment("day", 1);
          return now;
        });
        defineTrigger("a week", function(now) {
          now.increment("day", 7);
          return now;
        });
        defineTrigger("next week", function(now) {
          now.increment("day", 8 - now.time.getDay());
          return now;
        });
        defineTrigger("(monday|tuesday|wednesday|thursday|friday|saturday|sunday)", function(now, match) {
          var date, days, diff;
          days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
          date = days.indexOf(match[0].toLowerCase());
          diff = date - now.weekDay;
          now.increment("day", diff);
          if (diff <= 0) {
            now.increment("day", 7);
          }
          return now;
        });
        api = {
          parse: dateParser,
          define: defineTrigger,
          remove: removeTrigger
        };
        return module != null ? module.exports = api : void 0;
      }
    ]
  ]);

}).call(this);
