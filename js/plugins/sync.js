/* Nitro Sync Plugin
 * By Jono Cooper & George Czabania
 * Licensed under the BSD License
 * Uses jQuery for AJAX calls
 */

//Adds as a plugin
plugin.add(function() {

	$panel.right.prepend('<button class="runSync"></button>')
	$runSync = $('.runSync')

	$panel.right.on('click', '.runSync', function() {
		$this = $(this)

		if($this.hasClass('running')) {
			// Do nothing...
		} else if(core.storage.prefs.sync.hasOwnProperty('access') && core.storage.prefs.sync.interval !== 'never') {
			$this.addClass('running')
			sync.run(core.storage.prefs.sync.service, function(success, time) {
				if(success) {
					console.log("Everything worked - took " + time/1000 + "s")
				} else {
					// Display notification that sync failed
					sync.notify("Could not sync with server...")
				}
				$this.removeClass('running')
			})
		} else {
			$settingsbtn.trigger('click')
			$('a[data-target=#tabSync]').tab('show');
		}
	})

	sync = {

		// Prevent navigation during sync
		preventNav: function(status) {
			var message = "Nitro is currently syncing";

			if (status == 'on' || status === true) {
				window.onbeforeunload = function() {
					return message;
				}
			} else if (status == 'off' || status === false) {
				window.onbeforeunload = false;
			}
		},

		// Timer
		timer: function() {
			$runSync.addClass('running')
			sync.run(core.storage.prefs.sync.service, function(success) {
				if(success && core.storage.prefs.sync.interval == 'timer') {
					console.log("Everything worked - running again in 2 minutes")
					setTimeout(function() {
						if(core.storage.prefs.sync.interval == 'timer') sync.timer()
					}, 30000)
				} else {
					sync.notify("Could not sync with server...")
				}
				$runSync.removeClass('running')
			})
		},

		// Magical function that handles connect and emit
		run: function (service, cb) {

			var time = core.timestamp()

			if (typeof(cb) == "function") {
				callback = function() {
					sync.preventNav('off')
					core.storage.prefs.sync.active = false
					cb.apply(this, arguments)
				}
			}

			if (service) {
				core.storage.prefs.sync.service = service;
			} else if (!core.storage.prefs.sync.hasOwnProperty('service')) {
				console.log("Error: Don't know what service to use.");
				return;
			}

			core.storage.prefs.sync.active = true
			sync.preventNav('on')

			if (core.storage.prefs.sync.hasOwnProperty('access')) {

				sync.emit(function(success) {
					time = core.timestamp() - time
					if (typeof callback === "function") callback(success, time);
				});

			} else {

				sync.connect(function (result) {
					if(result) {
						sync.emit(function(success) {
							time = core.timestamp() - time
							if (typeof callback === "function") callback(success, time)
						})
					} else {
						if (typeof callback === "function") callback(result, 0)
					}
				})
			}

		},
		ajaxdata: {
			'data': {}
		},
		connect: function (callback) {

			console.log("Connecting to Nitro Sync server")

			var requestURL = function(service, cb) {

				console.log("Requesting URL")

				var ajaxdata = sync.ajaxdata
				ajaxdata.watch('data', function (id, oldval, newval) {
					ajaxdata.unwatch()
					cb(newval)
				})
				
				console.log("Sync Service: " + service)

				$.ajax({
					type: "POST",
					url: core.storage.prefs.sync.url + '/request_url',
					dataType: 'json',
					data: {
						service: service,
						app: app
					},
					success: function (data) {
						ajaxdata.data = data
					},
					error: function(data) {
						ajaxdata = 'error'
					}
				})
			}

			var showPopup = function(url) {
				if (app == 'python') {
					document.title = 'isolate_window|' + url
				} else if (app == 'web') {
					core.storage.prefs.sync.resume = true;
					core.storage.save();
					document.location.href = url;
				} else {
					var width = 960,
						height = 600
						left = (screen.width / 2) - (width / 2),
						top = (screen.height / 2) - (height / 2)
					window.open(url, Math.random(), 'toolbar=no, type=popup, status=no, width='+width+', height='+height+', top='+top+', left='+left)
				}
			}

			var authorizeToken = function (token, service, cb) {

				console.log("Getting access token");

				var ajaxdata = sync.ajaxdata
				ajaxdata.watch('data', function (id, oldval, newval) {
					ajaxdata.unwatch()
					console.log(newval)

					if(newval == 'not_verified') {
						console.log("Try again")
						if(core.storage.prefs.sync.active) {
							setTimeout(function() {
								authorizeToken(token, service, cb)	
							}, 1500)
						}

					} else if(newval == 'error' || newval == 'failed') {
						console.log("Connection failed. Server probably timed out.")
						cb(false)

					} else {
						console.log("Got access token")
						core.storage.prefs.sync.access = newval.access
						core.storage.prefs.sync.email = newval.email
						delete core.storage.prefs.sync.token
						core.storage.save()
						cb(true)
					}
				})

				$.ajax({
					type: "POST",
					url: core.storage.prefs.sync.url + '/auth',
					dataType: 'json',
					data: {
						token: token,
						service: service
					},
					success: function (data) {
						ajaxdata.data = data
					},
					error: function(data) {
						ajaxdata.data = 'error'
					}
				})
			}

			// Connect

			var service = core.storage.prefs.sync.service;
			if (app == 'web' && core.storage.prefs.sync.resume === true) {
				core.storage.prefs.sync.resume = false;
				core.storage.save();
				authorizeToken(core.storage.prefs.sync.token, service, callback);
			} else {
				requestURL(service, function(result) {
					if(result == 'error') {
						callback(false)
					} else {
						console.log("Request URL: " + result.authorize_url)
						core.storage.prefs.sync.token = result
						showPopup(result.authorize_url)
						authorizeToken(result, service, function(result) {
							callback(result)
						})
					}
				})
			}
		},

		emit: function (callback) {
			var client = {
					tasks: core.storage.tasks,
					lists: core.storage.lists,
					stats: {
						uid: core.storage.prefs.sync.email,
						os: app,
						language: core.storage.prefs.lang,
						version: version
					}
				},
				ajaxdata = sync.ajaxdata

			//Watches Ajax request
			ajaxdata.watch('data', function (id, oldval, newval) {
				newval = decompress(newval);
				console.log("Finished sync");
				core.storage.tasks = newval.tasks;
				core.storage.lists = newval.lists;
				core.storage.save();
				if(typeof callback === 'function') callback(true)
				ui.reload();
			});

			$.ajax({
				type: "POST",
				url: core.storage.prefs.sync.url + '/sync/',
				dataType: 'json',
				data: {
					data: JSON.stringify(compress(client)),
					access: core.storage.prefs.sync.access,
					service: core.storage.prefs.sync.service
				},
				success: function (data) {
					if (data != 'failed') {
						ajaxdata.data = data;
						return true;
					} else {
						if(typeof callback === 'function') callback(false)
						return false;
					}
				},
				error: function () {
					console.log("Hello")
					if(typeof callback === 'function') callback(false)
					return false;
				}
			});
		},
		notify:function (msg) {
			$runSync.before('<div class="message">'+msg+'</div>')
			var $msg = $panel.right.find('.message')
			$msg.hide().fadeIn(300)
			setTimeout(function() {
				$msg.fadeOut(500, function() {
					$(this).remove()
				})
			}, 4000)
		}
	}

	function compress(obj) {
		var chart = {
			name: 'a',
			tasks: 'b',
			content: 'c',
			priority: 'd',
			date: 'e',
			today: 'f',  		// Deprecated
			showInToday: 'g', 	// Deprecated
			list: 'h',
			lists: 'i',
			logged: 'j',
			time: 'k',
			sync: 'l',
			synced: 'm',
			order: 'n',
			queue: 'o',
			length: 'p',
			notes: 'q',
			items: 'r',
			next: 's',
			someday: 't',
			deleted: 'u',
			logbook: 'v',
			scheduled: 'w',
			version: 'x',
			tags: 'y'
		},
			out = {};

		for (var key in obj) {
			if (chart.hasOwnProperty(key)) {
				out[chart[key]] = obj[key];
				if (typeof obj[key] === 'object' && isArray(obj[key]) == false) {
					out[chart[key]] = compress(out[chart[key]]);
				}
			} else {
				out[key] = obj[key];
				if (typeof obj[key] === 'object' && isArray(obj[key]) == false) {
					out[key] = compress(out[key]);
				}
			}
		}
		return out;
	}

	function decompress(obj) {
		var chart = {
			a: 'name',
			b: 'tasks',
			c: 'content',
			d: 'priority',
			e: 'date',
			f: 'today',
			g: 'showInToday',
			h: 'list',
			i: 'lists',
			j: 'logged',
			k: 'time',
			l: 'sync',
			m: 'synced',
			n: 'order',
			o: 'queue',
			p: 'length',
			q: 'notes',
			r: 'items',
			s: 'next',
			t: 'someday',
			u: 'deleted',
			v: 'logbook',
			w: 'scheduled',
			x: 'version',
			y: 'tags'
		},
			out = {};

		for (var key in obj) {
			if (chart.hasOwnProperty(key)) {
				out[chart[key]] = obj[key];
				if (typeof obj[key] === 'object' && isArray(obj[key]) == false) {
					out[chart[key]] = decompress(out[chart[key]]);
				}
			} else {
				out[key] = obj[key];
				if (typeof obj[key] === 'object' && isArray(obj[key]) == false) {
					out[key] = decompress(out[key]);
				}
			}
		}
		return out;
	}

	// Because typeof is useless here
	function isArray(obj) {
		return obj.constructor == Array;
	}

	// object.watch
	if (!Object.prototype.watch) {
		Object.defineProperty(Object.prototype, "watch", {
			enumerable: false,
			configurable: true,
			writable: false,
			value: function (prop, handler) {
				var
				oldval = this[prop],
					newval = oldval,
					getter = function () {
						return newval;
					},
					setter = function (val) {
						oldval = newval;
						return newval = handler.call(this, prop, oldval, val);
					};

				if (delete this[prop]) { // can't watch constants
					Object.defineProperty(this, prop, {
						get: getter,
						set: setter,
						enumerable: true,
						configurable: true
					});
				}
			}
		});
	}

	// object.unwatch
	if (!Object.prototype.unwatch) {
		Object.defineProperty(Object.prototype, "unwatch", {
			enumerable: false,
			configurable: true,
			writable: false,
			value: function (prop) {
				var val = this[prop];
				delete this[prop]; // remove accessors
				this[prop] = val;
			}
		});
	}
});