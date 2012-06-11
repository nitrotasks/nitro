$(document).ready(function() {
	//Adds button to panel
	$panel.right.prepend('<button id="settingsbtn">Settings</button>')
	var $settingsbtn = $('#settingsbtn')
	$settingsbtn.on('click', function() {
		$('#prefsDialog').fadeToggle(150)
	})
	$('body').append('\
		<div id="prefsDialog">\
			<ul class="nav nav-tabs"><li class="active"><a href="#" data-target="#tabGeneral" data-toggle="tab" class="translate" data-translate="general">g</a></li><li><a href="#" data-target="#tabLanguage" data-toggle="tab" class="translate" data-translate="language">g</a></li><li><a href="#" data-target="#tabTheme" data-toggle="tab" class="translate" data-translate="theme">g</a></li><li><a href="#" data-target="#tabSync" data-toggle="tab" class="translate" data-translate="sync">g</a></li></ul>\
			<div class="tab-content">  \
				<div class="tab-pane active" id="tabGeneral">\
				<form>\
					<input type="checkbox" id="deleteWarnings"><label for="deleteWarnings" class="translate" data-translate="hideWarnings"></label><br>\
					<label class="description translate" data-translate="deleteWarningsDescription"></label>\
					<hr>\
					<label class="left translate" data-translate="nextDescription"> </label><select id="nextAmount">\
						<option value="noLists" class="translate" data-translate="nextNoLists"></option>\
						<option value="threeItems" class="translate" data-translate="nextThreeLists"></option>\
						<option value="everything" class="translate" data-translate="nextEntireLists"></option>\
					</select>\
				</form>\
				</div>  \
				<div class="tab-pane" id="tabLanguage">\
					<table>\
						<thead>\
							<tr>\
								<th class="translate" data-translate="language"></th>\
								<th class="translate" data-translate="authortext"></th>\
								<th class="translate" data-translate="language"></th>\
								<th class="translate" data-translate="authortext"></th>\
							</tr>\
						</thead>\
						<tbody>\
							<tr>\
								<td class="language"><a href="#" data-value="english">English</a></td>\
								<td class="author">Caffeinated Code</td>\
								<td class="language"><a href="#" data-value="bad">Bad English</a></td>\
								<td class="author"><a href="mailto:jono@joncoooper.com">Jono Cooper</a>\
							</tr>\
								<!--td class="language"><a href="#" data-value="hungarian">Magyar</a></td>\
								<td class="author"><a href="mailto:sjozsef0227@gmail.com">József Samu</a>\
							</td>\
							<tr>\
								<td class="language"><a href="#" data-value="pirate">English (Pirate)</a></td>\
								<td class="author">Caffeinated Code</td>\
								<td class="language"><a href="#" data-value="portuguese">Português</a></td>\
								<td class="author"><a href="mailto:email@belenos.me">Belenos Govannon</a></td>	\
							</tr>\
							<tr>\
								<td class="language"><a href="#" data-value="german">Deutsch</a></td>\
								<td class="author"><a href="mailto:d.peteranderl@googlemail.com">Dennis Peteranderl</a>, <a href="info@agentur-simon.de">Bertram Simon</a></td>\
								<td class="language"><a href="#" data-value="russian">Русский</a></td>\
								<td class="author"><a href="mailto:a.pryah@gmail.com">Andrej Pryakhin</a></td>\
							</tr>\
							<tr>\
								<td class="language"><a href="#" data-value="spanish">Español</a></td>\
								<td class="author"><a href="mailto:admin@bumxu.com">Juande Martos</a></td></td>\
								<td class="language"><a href="#" data-value="finnish">Suomi</a></td>\
								<td class="author"><a href="mailto:rami.selin@gmail.com">Rami Selin</a></td>\
							</tr>\
							<tr>\
								<td class="language"><a href="#" data-value="basque">Euskara</a></td>\
								<td class="author"><a href="mailto:atxooy@gmail.com">Naxo Oyanguren</a></td>\
								<td class="language"><a href="#" data-value="vietnamese">Tiếng Việt</a></td>\
								<td class="author"><a href="mailto:dinhquan@narga.net">Nguyễn Đình Quân</a></td>\
							</tr>\
							<tr>\
								<td class="language"><a href="#" data-value="french">Français</a></td>\
								<td class="author"><a href="mailto:maurin.raphael@gmail.com">Raphaël Maurin</a></td>\
								<td class="language"><a href="#" data-value="arabic">‏العربية‏</a></td>\
								<td class="author"><a href="mailto:fouad.hassouneh@gmail.com">Fouad Hassouneh</td>\
							</tr>\
							<tr>\
								<td class="language"><a href="#" data-value="italian">Italiano</a></td>\
								<td class="author"><a href="mailto:lmassa@bwlab.it.com">Luigi Massa</a></td>\
								<td class="language"><a href="#" data-value="chinese">中文(简体)</a></td>\
								<td class="author"><a href="mailto:1132321739qq@gmail.com">tuhaihe</a>, 2012</td>\
							</tr>\
							<tr>\
								<td class="language"><a href="#" data-value="polish">Polski</a></td>\
								<td class="author">Marcin Tydelski,<br>Kajetan Szczepaniak</td>\
								<td class="language"><a href="#" data-value="turkish">Türkçe</a></td>\
								<td class="author"><a href="mailto:selimssevgi@gmail.com">Selim Sırrı Sevgi</a></td>\
							</tr-->\
						</tbody>\
					</table>  \
				</div>\
				<div class="tab-pane" id="tabTheme">  \
					<label class="left translate" data-translate="pickTheme"></label><select id="theme">\
						<option value="default">Default</option>\
						<option value="none">None</option>\
					</select><br>\
					<label class="description translate" data-translate="themeDescription"></label>\
					<div class="pythonshit">\
						<hr>\
						<label class="left translate" data-translate="replaceDefault"></label><input type="file" id="chooseBG"><br>\
						<label class="left translate" data-translate="useDefault"></label><button id="removeBG" class="translate" data-translate="removeBG"></button><br>\
						<label class="left translate" data-translate="bgSize"></label><select id="backgroundSize">\
							<option value="zoom" class="translate" data-translate="fill"></option>\
							<option value="shrink" class="translate" data-translate="shrink"></option>\
							<option value="tile" class="translate" data-translate="tile"></option>\
						</select>\
						<label class="description translate" data-translate="bgDescription"></label>\
						<hr>\
						<label class="left translate" data-translate="headingColor"></label>\
						<select id="headingColor">\
							<option value="light" class="translate" data-translate="light"></option>\
							<option value="dark" class="translate" data-translate="dark"></option>\
							<option value="" class="translate" data-translate="default"></option>\
						</select>\
						<label class="description translate" data-translate="headingDescription"></label>\
					</div>\
				</div>\
				<div class="tab-pane" id="tabSync">\
					<div class="connect">\
						<blockquote><h1>Nitro Sync Beta</h1><span class="translate" data-translate="donateText"></span></blockquote>\
						<hr>\
						<div class="icons">\
							<a class="icon" href="#" data-service="dropbox"><img src="images/dropbox.png"></a>\
							<a class="icon" href="#" data-service="ubuntu"><img src="images/ubuntu.png"></a>\
						</div>\
					</div>\
					<div class="waiting">\
						<p class="translate" data-translate="syncAuthenticate"></p>\
						<img class="spinner" src="images/spinner.gif">\
						<button class="cancel translate" data-translate="cancel"></button>\
					</div>\
					<div class="settings">\
						<a class="left logout translate" data-translate="syncLogout" href="#"></a>\
						<label class="left translate" data-translate="syncLoggedIn"></label><span class="email right">Not logged in.</span><br>\
						<label class="left translate" data-translate="syncService"></label><span class="service">No service set.</span>					\
						<!--label class="left">Delete server: </label><button class="deleteserver">Delete</button>\
						<label class="description">WARNING: This will delete the nitro_data.json file on your storage account! This action cannot be undone!</label>\
						<label class="left">Delete client: </label><button class="deleteclient">Delete client</button>\
						<label class="description">WARNING: This will delete all your tasks! You will lose everything!</label-->\
						<hr>\
						<label class="left translate" data-translate="syncLabel"></label><select id="syncInterval">\
							<option value="never" class="translate" data-translate="syncNever"></option>\
							<option value="manual" class="translate" data-translate="syncManual"></option>\
							<option value="timer" class="translate" data-translate="syncTimer"></option>\
							<option value="auto" class="translate" data-translate="syncAuto"></option>\
						</select><br>\
						<label class="description translate" data-translate="syncDescription"></label>\
					</div>			\
				</div>\
			</div>\
		</div>\
	');
	$('#prefsDialog .translate').map(function () {
			$(this).html($.i18n._($(this).attr('data-translate')));
	});

	/**********************************
		SETTINGS
	**********************************/

	// CHECK BOXES [DELETE WARNINGS & LOW GRAPHICS MODE]
	$('#tabGeneral form input').change(function () {

		core.storage.prefs.deleteWarnings = $('#deleteWarnings').prop('checked');
		core.storage.save();

	});

	// NEXT AMOUNT
	$('#nextAmount').change(function () {

		core.storage.prefs.nextAmount = this.value;
		core.storage.save();

		//Reloads next if it is selected
		if (ui.lists.selected() === 'next') {
			$('#Lnext .name').click();
		}
	});

	// THEME
	$('#theme').change(function () {
		// Get value
		var theme = $(this)[0].value;

		// Set CSS file
		$('link.theme').attr('href', 'css/' + theme + '.css').ready(function () {
			$(window).resize();
		});

		//Saves Theme
		core.storage.prefs.theme = theme;
		core.storage.save();
	});

	/**********************************
			LOADING PREFERENCES
	**********************************/
	//$('#deleteWarnings').prop('checked', cli.storage.prefs.deleteWarnings);
	//$('#nextAmount').val(cli.storage.prefs.nextAmount);
	$('#theme').val(core.storage.prefs.theme);

	// LANGUAGE
	$('#tabLanguage a.current').removeClass('current');
	$('#tabLanguage .language a').each(function () {
		if ($(this).data('value') === core.storage.prefs.lang) {
			$(this).addClass('current');
		}
	});
	$('#tabLanguage').bind('click', function (e) {
		if ($(e.srcElement).is('.language a')) {
			core.storage.prefs.lang = $(e.srcElement).data('value');
			core.storage.save();

			window.location.reload();
			return false;
		}
	});
});






/*********************************************** 
     Begin search.js 
***********************************************/ 

/* Nitro Search Plugin
 * By Jono Cooper & George Czabania
 * Licensed under the BSD License
 */

//Adds as a plugin
plugin.add(function() {

	//Load plugin on document ready
	$(document).ready(function() {
		$panel.right.append('<input id="search" type="search" placeholder="Search">')
		$search = $("#search")
	});

	$panel.right.on('keyup', '#search', function() {

		var $this = $(this),
			input = $this.val()

		var searcher = function(key) {
			var pass1 = [],
				pass2 = true;

			// Loop through each word in the query
			for (var q = 0; q < query.length; q++) {

				// Create new search
				search = new RegExp(query[q], 'i');

				if(typeof(key) == 'function') {
					//Nope. Not a good idea
					return;
				}

				// Search
				if (search.test(core.storage.tasks[key].content + core.storage.tasks[key].notes)) {
					pass1.push(true);
				} else {
					pass1.push(false);
				}
			}

			// This makes sure that the task has matched each word in the query
			for (var p = 0; p < pass1.length; p++) {
				if (pass1[p] === false) {
					pass2 = false;
				}
			}

			// If all terms match then add task to the results array
			if (pass2) {
				return (key)
			}
		}
		
		if (input == '') {
			//If there's no input, just load list
			$sidebar.find('.selected .name').click();
		} else {
			//Puts the results into the UI
			$tasks.html('<h2>Search Results: ' + $this.val() + '</h2><ul></ul>')

			//There is some input
			// Set vars
			var query = input.split(' '),
				results = [],
				search;

			if (ui.session.selected == 'all') {
				// Search loop
				for (var t = 0; t < core.storage.tasks.length; t++) {

					// If task exists
					if (core.storage.tasks[t]) {

						//Seaches Task
						var str = searcher(t);
						if (str != undefined) {
							results.push(str);
						}
					}
				}

			} else {
				for (var key in core.storage.lists.items[ui.session.selected].order) {
					var str = parseInt(searcher(core.storage.lists.items[ui.session.selected].order[key]))
					if (!isNaN(str)) {
						results.push(str);
					}
				}
			}
			// Draws
			$tasks.find('ul').append(ui.lists.drawTasks(results))
		}
	})
})

/*********************************************** 
     Begin sort.js 
***********************************************/ 

/* Sorting Plugin for Nitro
 * Requried by main.js - so don't remove it
 * By Jono Cooper & George Czabania
 * Licensed under the BSD License
 */

// Globals
var $sortType

//Adds as a plugin
plugin.add(function() {
	
	console.log("Loaded sort.js")

	$(document).ready(function() {
		$panel.left.prepend('\
			<select id="sortType">\
				<option value="magic">Magic</option>\
				<option value="manual">Manual</option>\
				<option value="priority">Priority</option>\
				<option value="date">Date</option>\
			</select>')
		$sortType = $('#sortType')
		$sortType.on('change', function() {
			var val = $sortType.val(), list
			core.storage.prefs.listSort[ui.session.selected] = val
			$('#L' + ui.session.selected + ' .name').click()
			core.storage.save()
		})
	})

	var getDateWorth = function(timestamp) {

		if(timestamp == "") {
			return 0;
		}

		var due = new Date(timestamp),
			today = new Date();

		// Copy date parts of the timestamps, discarding the time parts.
		var one = new Date(due.getFullYear(), due.getMonth(), due.getDate());
		var two = new Date(today.getFullYear(), today.getMonth(), today.getDate());
		
		// Do the math.
		var millisecondsPerDay = 1000 * 60 * 60 * 24;
		var millisBetween = one.getTime() - two.getTime();
		var days = millisBetween / millisecondsPerDay;
		
		// Round down.
		var diff = Math.floor(days);

		if(diff > 14) {
			diff = 14
		}

		return 14 - diff + 1;

	}
	
	plugin.sort = function(list, method) {

		// Convert task IDs to obects
		for(var i = 0; i < list.length; i++) {
			var id = list[i];
			list[i] = core.storage.tasks[list[i]];
			list[i].arrayID = id;
		}
		
		// Sorting methods
		switch(method) {
			
			case "magic":
				list.sort(function(a, b) {

					var rating = {
						a: getDateWorth(a.date),
						b: getDateWorth(b.date)
					}

					var worth = { none: 0, low: 3, medium: 6, high: 9 }

					rating.a += worth[a.priority]
					rating.b += worth[b.priority]

					if(a.logged && !b.logged) return true
					else if(!a.logged && b.logged) return false
					else if(a.logged && b.logged) return null

					else if(rating.a < rating.b) return true
					else if (rating.c > rating.b) return false
					else return null
	
				})
				break
				
			case "manual":
				break;
				
			case "priority":
				
				list.sort(function(a,b) {
					var worth = { none: 0, low: 1, medium: 2, high: 3 };
					if(a.logged && !b.logged) return true
					else if(!a.logged && b.logged) return false
					else if(a.logged && b.logged) return null
					else if(worth[a.priority] < worth[b.priority]) return true;
					else if(worth[a.priority] > worth[b.priority]) return false;
					else return null
				});
				break;
				
			case "date":
				list.sort(function(a,b) {
					if(a.logged && !b.logged) return true
					else if(!a.logged && b.logged) return false
					else if(a.logged && b.logged) return null
					// Handle tasks without dates
					if(a.date=="" && b.date !== "") return true;
					else if(b.date=="" && a.date !== "") return false;
					else if (a.date == "" && b.date == "") return null;
					// Sort timestamps
					else if(a.date >  b.date) return true;
					else if(a.date <  b.date) return false;
					else return null
				});
				break;
			
		}
		
		// Unconvert task IDs to obects
		for(var i = 0; i < list.length; i++) {
			list[i] = list[i].arrayID;
		}
		
		return list;
		
	};
	
});

/*********************************************** 
     Begin filter.js 
***********************************************/ 

/* Filters Plugin for Nitro
 * By Jono Cooper & George Czabania
 * Licensed under the BSD License
 */

//Adds as a plugin
plugin.add(function() {
	
	console.log("Loaded filter.js")
	
	filter = function(list, filters) {
		
		// This will check one task and either return true or false
		var check = function(task, key, property) {
			
			// Handles multiple properties in an array
			if(typeof property === 'object') {
				var match = false;
				// Loop through this
				for(var i = 0; i < property.length; i++) {			
					if(check(task, key, property[i])) {
						match = true;
					}
				}
				return match;
			}
			
			// Formats the property value
			switch(key) {
				
				case "logged":
						
					// Get tasks that are logged
					if (property === true) {
						if(typeof task[key] == 'number') return true;
						
					// Get tasks that were logged after a certain time
					} else if (typeof property == 'number') {
						if(task[key] >= property) return true;
					}
					break;
					
				case "notes":
				
					// Get tasks with notes
					if (property === true) {
						// Notes must have at least one non-space char
						if(task[key].match(/\S/)) return true;
					}
					break;
					
				case "priority":
				
					// Gets tasks without a priority
					if (property === false) {
						property = "none";
					
					// Get tasks that have a priority
					} else if (property === true) {
						if(task[key] !== "none") return true;
					}
					break;
					
				case "date":
				
					if (property === true) {
						if (task[key] != false) return true;
					}
				
					var due = new Date(task[key]),
						today = new Date();
						
					if (property == 'month') {
						if (due.getMonth() == today.getMonth()) return true;
					}
				
					// Copy date parts of the timestamps, discarding the time parts.
					var one = new Date(due.getFullYear(), due.getMonth(), due.getDate());
					var two = new Date(today.getFullYear(), today.getMonth(), today.getDate());
					
					// Do the math.
					var millisecondsPerDay = 1000 * 60 * 60 * 24;
					var millisBetween = one.getTime() - two.getTime();
					var days = millisBetween / millisecondsPerDay;
					
					// Round down.
					var diff = Math.floor(days);
					
					// Get tasks due today
					if (property == 'today') {
						if (diff === 0) return true;
					} else if(property == 'tomorrow') {
						if (diff <= 1) return true;
					} else if (property == 'week') {
						if (diff <= 7) return true;
					} else if (property == 'fortnight') {
						if (diff <= 14) return true;
					} else if (typeof property == 'number') {
						if (diff <= property) return true;
					}
					break;
			}
			
			if(task[key] == property) {
				return true;
			} else {
				return false;
			}
		}
		
		var results = [];		
		
		// Loop through tasks
		for(var i = 0; i < list.length; i++) {
			
			var task = core.storage.tasks[list[i]];
			
			for(var key in filters) {
				
				// Convert string to boolean
				if(filters[key] === 'true') filters[key] = true;
				if(filters[key] === 'false') filters[key] = false;
				
				if(check(task, key, filters[key])) {
					
					results.push(list[i]);
					
				}
				
			}
			
		}
		
		return results;
		
	};
	
});

/*********************************************** 
     Begin timer.js 
***********************************************/ 

timer = {

	loadList: function() {
		var $list = $('#L0 .name')[0]

		console.time("n")

		for(var i = 1; i < 2; i++) {

			$list.click()

		}
		console.timeEnd("n")

	},

	addTask: function() {

		var $btn = $('button.add')[0]

		console.time("n")

		for(var i = 1; i < 101; i++) {

			$btn.click()

		}
		console.timeEnd("n")

	},

	mustache: function(list) {

		$('body').empty();

		var tasks = ""

		console.time("n")

		for(var i = 0; i < list.length; i++) {

			var data = core.storage.tasks[list[i]];

			tasks += Mustache.to_html(templates.task.collapsed, {
				id: i,
				content: data.content,
				notes: data.notes,
				date: data.date,
				priority: data.priority
			})

		}

		$('body').html(tasks)

		console.timeEnd("n")

	}

}

/*********************************************** 
     Begin sync.js 
***********************************************/ 

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