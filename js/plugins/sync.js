/* Nitro Sync Plugin
 * By Jono Cooper & George Czabania
 * Licensed under the BSD License
 * Uses jQuery for AJAX calls
 */

//Adds as a plugin
plugin.add(function() {

	var app = 'js',
		version = '1.4';

	sync = {
		// Magical function that handles connect and emit
		run: function (service, callback) {

			if (service) {
				core.storage.prefs.sync.service = service;
			} else if (!core.storage.prefs.sync.hasOwnProperty('service')) {
				console.log("Error: Don't know what service to use.");
				if (typeof callback === "function") callback(false);
				else return;
			}

			// ui.sync.beforeunload('on');

			if (core.storage.prefs.sync.hasOwnProperty('access')) {

				sync.emit();

				if (typeof callback === "function") callback(true);

			} else {

				sync.connect(function (result) {
					sync.emit();

					if (typeof callback === "function") callback(result);
				});

			}

		},
		ajaxdata: {
			'data': {}
		},
		connect: function (callback) {

			console.log("Connecting to Nitro Sync server");

			if (core.storage.prefs.sync.hasOwnProperty('access')) {

				var ajaxdata = sync.ajaxdata;

				//Yes, this code is in the complete wrong order but we need python integration
				ajaxdata.watch('data', function (id, oldval, newval) {
					console.log(newval);
					if (newval == "success") {
						console.log("Nitro Sync server is ready");
						callback(true);
					} else if (newval == "failed") {
						console.log("Could not connect to Dropbox");
						callback(false);
					}

					//Unbind AJAX thing
					ajaxdata.unwatch();

				});

				if (app == 'python') {
					document.title = 'null';
					document.title = 'ajax|access|' + core.storage.prefs.sync.access + '|' + core.storage.prefs.sync.service;
				} else {
					$.ajax({
						type: "POST",
						url: core.storage.prefs.sync.url + '/auth/',
						dataType: 'json',
						data: {
							access: JSON.stringify(core.storage.prefs.sync.access),
							service: core.storage.prefs.sync.service
						},
						success: function (data) {

							ajaxdata.data = data;
						}
					});
				}
			} else {
				var ajaxdata = sync.ajaxdata;

				//Yes, this code is in the complete wrong order but we need python integration
				ajaxdata.watch('data', function (id, oldval, newval) {

					console.log("Verifying Storagebackend");
					core.storage.prefs.sync.token = newval;

					// Display popup window
					if (app == 'python') {
						document.title = 'frame|' + newval.authorize_url;
					} else {
						var left = (screen.width / 2) - (800 / 2),
							top = (screen.height / 2) - (600 / 2),
							title = "Authorise Nitro",
							targetWin = window.open(newval.authorize_url, title, 'toolbar=no, type=popup, status=no, width=800, height=600, top=' + top + ', left=' + left);

						if (app == 'web') {
							$('#login .container').html('<div class="loading">Loading... You may need to disable your popup blocker.</div>');
						}
					}

					//Unbind first AJAX thing
					ajaxdata.unwatch();

					//New Ajax Request
					ajaxdata.watch('data', function (id, oldval, newval) {
						console.log("Nitro Sync server is ready");
						core.storage.prefs.sync.access = newval.access;
						core.storage.prefs.sync.email = newval.email;
						delete core.storage.prefs.sync.token;
						callback(true);
						core.storage.save();

						//Unbind AJAX thing
						ajaxdata.unwatch();
					});

					//^ Ajax Request we're watching for
					if (app == 'python') {
						document.title = 'null';
						document.title = 'ajax|token|' + JSON.stringify(core.storage.prefs.sync.token) + '|' + core.storage.prefs.sync.service;
					} else {
						$.ajax({
							type: "POST",
							url: core.storage.prefs.sync.url + '/auth/',
							dataType: 'json',
							data: {
								token: core.storage.prefs.sync.token,
								service: core.storage.prefs.sync.service
							},
							success: function (data) {
								ajaxdata.data = data;
							}
						});
					}

					return newval;
				})

				//^ Ajax Request we're watching for
				if (app == 'python') {
					document.title = 'null';
					document.title = 'ajax|reqURL|' + core.storage.prefs.sync.service;
				} else {
					$.ajax({
						type: "POST",
						url: core.storage.prefs.sync.url + '/auth/',
						dataType: 'json',
						data: {
							reqURL: 'true',
							service: core.storage.prefs.sync.service
						},
						success: function (data) {
							ajaxdata.data = data;
						}
					});
				}
			}
		},

		emit: function () {
			var coreent = {
				tasks: core.storage.tasks,
				lists: core.storage.lists,
				stats: {
					uid: core.storage.prefs.sync.email,
					os: app,
					language: core.storage.prefs.lang,
					version: version
				}
			};

			var ajaxdata = sync.ajaxdata;

			//Watches Ajax request
			ajaxdata.watch('data', function (id, oldval, newval) {
				newval = decompress(newval);
				console.log("Finished sync");
				core.storage.tasks = newval.tasks;
				core.storage.lists = newval.lists;
				core.storage.save();
				// ui.sync.reload();
			});

			//^ Ajax Request we're watching for
			if (app == 'python') {
				document.title = 'null';
				document.title = 'ajax|sync|' + JSON.stringify(compress(coreent)) + '|' + JSON.stringify(core.storage.prefs.sync.access) + '|' + core.storage.prefs.sync.service;
			} else {
				$.ajax({
					type: "POST",
					url: core.storage.prefs.sync.url + '/sync/',
					dataType: 'json',
					data: {
						data: JSON.stringify(compress(coreent)),
						access: core.storage.prefs.sync.access,
						service: core.storage.prefs.sync.service
					},
					success: function (data) {
						if (data != 'failed') {
							ajaxdata.data = data;
							return true;
						} else {
							return false;
						}
					},
					error: function () {
						alert('An error occured. If it had nothing to do with your internet, it has been reported to the developers =)')
					}
				});
			}
		}
	}

	function compress(obj) {
		var chart = {
			name: 'a',
			tasks: 'b',
			content: 'c',
			priority: 'd',
			date: 'e',
			today: 'f',
			showInToday: 'g',
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
			deleted: 'u'
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
			u: 'deleted'
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