 /*
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


var $body = $('body'),
	$tasks = $('#tasks .tasksContent'),
	$sidebar = $('#sidebar'),
	$smartlists = $('#smartlists'),
	$lists = $('#lists')
	$panel = {
		right: $('#tasks .panel .right'),
		left: $('#tasks .panel .left')
	},
	$addBTN = $(),
	$delBTN = $(),
	plugin = {
		add: function(fn) {
			fn();
		}
	}

var ui = {
	language: function (data) {
		//Loads Translation Pack in
		$.i18n.setDictionary(data);

		//Nice shorthand Method
		$l = $.i18n;
	},
	initLoad: function() {
		
		// Fixes for mac version
		if (app == 'mac') {
			// Stop the default system beep on keypress
			$(document).on('keydown', function(e) {
				if (!$('input, textarea').is(':focus')) {
					if (e.metaKey) return true;
					return false; 
				}
			})
		}

		// Move sidebar to the right
		ui.reloadSidebar()

		// Run Upgrade function
		if (app == 'python') {
			var get = function(name, def) {

				var json_decode = $.evalJSON || (window.JSON && (JSON.decode || JSON.parse)) || function(str){
					return String(str).evalJSON();
				}

				// Get data from Python
				document.title = 'null';
				document.title = 'get|' + name;

				// If key doesn't have any data assigned to it return the default value (if assigned)
				if(xcode == "(null)" && typeof def != undefined) { 
					return def;
				} else {
					return json_decode(xcode);
				}
			}
			var tmpdata = {}
			tmpdata.tasks = get('tasks', 'empty')
			tmpdata.lists = get('lists', 'empty')
			tmpdata.prefs = get('prefs', 'empty')

			if (tmpdata.tasks != 'empty' && tmpdata.lists != 'empty' && tmpdata.prefs != 'empty') {
				upgrade(tmpdata)
				//Delete old DB
				document.title = 'deleteOld| '
			}
		} else {
			upgrade($.polyStorage.get('jStorage', 'empty'))
		}

		// Clean
		plugin.cleanDB()
		
		// Web Version
		if (app == 'web') {
			// Run sync if our shit is loaded
			$('html').addClass('web')
			var loader = '<div id="syncloader" class="spinner"><div class="bar1"></div><div class="bar2"></div><div class="bar3"></div><div class="bar4"></div><div class="bar5"></div><div class="bar6"></div><div class="bar7"></div><div class="bar8"></div><div class="bar9"></div><div class="bar10"></div><div class="bar11"></div><div class="bar12"></div></div>'
			$('body').css('background', '#fff').append(loader).append('<script src="js/libs/modernizr.min.js"></script>')

			//Download Button
			$('#tasks .panel .right').prepend('<a href="http://nitrotasks.com" title="Download Nitro" class="downloadbtn"></a>')

			// Sync status
			$('body').append('<div id="web-sync-status">Syncing...</div>');

			//No settings but language
			$('[data-target=#tabLanguage]').click()

			$('.ubuntu, .dropbox').click(function() {
				$('#splash').css('opacity', '0')
				$('body').append(loader)
			})

			if (core.storage.prefs.sync.service && core.storage.prefs.sync.resume || core.storage.prefs.sync.access) {
				if (core.storage.prefs.sync.service && core.storage.prefs.sync.resume) {
					$('body').append('<div style="font-size: 12px; padding: 5px;">Authorizing...</div>')
					//If they haven't authorized in 10secs, they fucked it up.
					setTimeout(function() {
						if (core.storage.prefs.sync.hasOwnProperty('token')) {
							window.location.reload()
						}
					}, 10000)
				}
				//Callback Removes Splash Screen
				sync.run(core.storage.prefs.sync.service, function() {
					$('#syncloader').remove();
					$('body').removeAttr("style");
					$('.web #content').show(0);
					ui.reload();
				});
			} else {
				$('#splash').show(0).css('opacity', '1')
				$('#syncloader').css('opacity', '0')
			}
		}

		//Buttons
		$sidebar.find('h2.smartlists')
			.html($l._('focus'))
			.append(Mustache.to_html(templates.button.listToggle,{
				title: "Hide lists"
			}))

		// Append  smartlists
		var markup = "", smartlists = [
			['today', $.i18n._('today')],
			['next', $.i18n._('next')],
			['logbook', $.i18n._('logbook')],
			['all', $.i18n._('all')]
		]
		for(var i = 0; i < smartlists.length; i++) { markup += ui.lists.draw(smartlists[i]) }
		$smartlists.append(markup).trigger('ready')
		
		$panel.left.prepend(Mustache.to_html(templates.button.deleteTask, {name: $l._('deletebtn') }))
		$panel.left.prepend(Mustache.to_html(templates.button.addTask, {name: $l._('addbtn') }))

		$addBTN = $panel.left.find('button.add')
		$delBTN = $panel.left.find('button.delete')

		//Splitter Resizing
		$('.vsplitbar').on('mouseup', function(){
			if ($('#tasks .panel').width() < 550) {
				$('#tasks .panel .left button').css({'font-size': '0', 'padding': '0 5px'}).width(54)
				$('#tasks .panel .right').show(0)

				if ($('#tasks .panel').width() < 489) {
					$('#tasks .panel .right').hide(0)
				}
			} else {
				$('#tasks .panel .right').show(0)
				$('#tasks .panel .left button').removeAttr("style")
			}
		})

		//Splitter
		var height = $(window).height(),
			width = $(window).width()

		$(window).resize(function() {
			//Causes lag without it?
			if (height != $(window).height() || width != $(window).width()) {
				//Redefines
				height = $(window).height(),
				width = $(window).width()

				//Splitter
				$('#content').trigger('resize');

				//Content Height
				$('.tasksContent').height(height - $('.panel').height());

				//Responsive Panel
				$('.vsplitbar').trigger('mouseup')
			}
		});	

		// Theme init
		core.storage.prefs.theme = core.storage.prefs.theme || 'default'
		$('link.theme').attr('href', 'css/' + core.storage.prefs.theme + '.css').ready(function () {
			//I can't trigger it?
			$tasks.height(height - $('.panel').height())
			ui.reload()
			$('html').addClass('loaded')
			$('.loader').fadeOut(300)
		});

		//Tells Python to hide / show the fucking panel
		if (app == 'python') {
			document.title = 'theme|' + core.storage.prefs.theme
		}

		//Collapse Lists
		$sidebar.find('h2.lists').html($l._('lists'))
		$sidebar.append(Mustache.to_html(templates.button.addList, {name: $.i18n._('addList')}))

		//Good idea to save? If theme or lang needs to be saved?
		core.storage.save();
	},
	session: {
		selected: core.storage.prefs.selected || 'today'
	},
	reload: function() {
		//Populates Template
		var markup = ""
		for (var i=0; i<core.storage.lists.order.length; i++) {
			markup += ui.lists.draw(core.storage.lists.order[i])
		}
		$lists.html(markup)
		
		//Causes a resync
		$('#L' + ui.session.selected + ' .name').click();

		//Sortable Lists
		$lists.sortable().bind('sortupdate', function() {
			//Triggered when the user stopped sorting and the DOM position has changed.
			//Saves Everything
			var listOrder = []

			//Loops through lists & adds the to an array
			$lists.children().map(function () {
				listOrder.push($(this).attr('id').substr(1))
			});

			console.log(listOrder)

			//Saves
			core.storage.lists.order = listOrder;
			core.storage.save([['list-order', null, null]])
		});

		//Droppable
		ui.lists.droppable('ul li:not("#Lall")')

		//Update Counts
		ui.lists.update().count()
	},
	reloadSidebar: function() {
		$('.vsplitbar').remove()
		if(core.storage.prefs.theme === 'wunderlist' || core.storage.prefs.theme === 'rtl') {
			$sidebar.insertAfter('#tasks')
			if(core.storage.prefs.theme === 'wunderlist') {
				$search.insertAfter($sidebar.find('.brand'))
			}
			$('#content').splitter({sizeRight: true})
		} else {
			$sidebar.insertBefore('#tasks')
			$search.insertAfter($panel.right.find('.settingsbtn'))
			$('#content').splitter({sizeLeft: true})
		}
	},
	lists: {
		//Draws a list to the DOM
		draw: function(listID) {
			if(typeof listID != 'object') {
				var list = core.storage.lists.items[listID],
				obj = Mustache.to_html(templates.list, {
						id: listID,
						name: list.name,
						count: 0
					})
			} else {
				obj = Mustache.to_html(templates.list, {
					id: listID[0],
					name: listID[1],
					count: 0
				})
			}
			return obj
		},

		// Easy way to use drawSingleTask to render a list
		drawTasks: function(tasks) {

			var markup = "",
				listName = "thisList" // dictionary key for our current list name

			if (tasks.length == 0) {
				//Display a messsage
				markup = '<div class="noTasks">'

				// if the selected list is a predefined list with a name we recognize...
				if (ui.session.selected === 'today' || ui.session.selected === 'next' ||
					ui.session.selected === 'logbook' || ui.session.selected === 'all') {

					// the list name conviently maps to the correct dictionary key
					listName = ui.session.selected
				}
				// find the "No Tasks..." translation and append the localized list name to it
				markup += $.i18n._('noTasksInList', [$.i18n._(listName)])
				markup += '</div>'
					
			} else {
				//Loops and adds each task to a tmp view
				for (var i=0; i<tasks.length; i++) {
					markup += ui.lists.drawSingleTask(tasks[i])
				}
			}

			return markup
		},

		// Draws Task then appends it to a tmpview
		drawSingleTask: function(id) {
			
			var model = core.storage.tasks[id]

			//Checked Tasks
			var logged = 'checkbox ' + model.priority, checked = null
			if (model.logged) checked = 'checked'

			// Extra details
			var date = false, list = false
			switch(ui.session.selected) {

				case 'today':
					list = core.storage.lists.items[model.list].name
					date = core.date(model.date).getDaysLeft()
					break

				case 'logbook':
					// Show date the task was completed
					date = {
						words: core.date(model.logged).getDate(),
						className: 'logged'
					}
					// Don't show opacity in logbook
					checked = 'checked logbook'
					break

				case 'all':
					// Translated Name or Custom Name
					list = core.storage.lists.items[model.list].name || model.list

				default:
					// Show task due date
					date = core.date(model.date).getDaysLeft()
			}


			//Hashtags Yall.
			var hashTag = new RegExp("\\s#([^ ]*)", "ig")
			var temp = Mustache.to_html(templates.task.collapsed, {
				id: id,
				checked: checked,
				content: (" " + model.content.replace(hashTag, ' <span class="tag">#$1</span>')).slice(1),
				notes: model.notes,
				date: date,
				list: (model.list.length < 8) ? $.i18n._(list) : list,
				priority: model.priority,
				logged: logged
			})

			return temp
		},
		update: function() {
			return {
				count: function() {

					// Update all list counts
					for (var id in core.storage.lists.items) {
						if (!core.storage.lists.items[id].hasOwnProperty('deleted')) {
							var count = filter(core.list(id).populate(), {logged: false})			
							$('#L' + id).find('.count').html(count.length);
						}
					}

					var focusLists = ['all', 'logbook'];
					for (var id = 0; id < focusLists.length; id++) {
						$('#L' + focusLists[id]).find('.count').html(core.list(focusLists[id]).populate().length);
					}

					// Today
					var todayTotal = filter(core.list('today').populate(), {logged: false}).length
					$('#Ltoday .count').html(todayTotal)

					// Set Title
					if (app == 'python') {
						//Tells Python
						document.title = 'count|' + todayTotal
					} else if (app == 'mac') {
						macgap.dock.badge = todayTotal > 0 ? todayTotal.toString() : "";
					} else {
						document.title = todayTotal > 0 ? todayTotal + " - Nitro" : "Nitro";
					}
				},
				logbook: function() {

					// Loop through all tasks
					for(var id in core.storage.tasks) {

						// If task is not deleted
						if(!core.storage.tasks[id].hasOwnProperty('deleted')) {

							// If task is logged but not in logbook
							if(core.storage.tasks[id].logged && core.storage.tasks[id].list != 'logbook') {

								// Add to logbook
								core.task(id).move('logbook');

							}
						}
					}

					ui.lists.update().count()
				}
			}
		},
		droppable: function(elem){
			$sidebar.find(elem).on('dragenter', function(e) {
				$(this).addClass('dragHover')
			}).on('dragleave', function(e) {
				$(this).removeClass('dragHover')
			}).on('drop', function(e) {
				var listId = $(this).attr('id').substr(1),
					taskId = e.originalEvent.dataTransfer.getData('application/json')

				if(core.storage.tasks[taskId].list !== listId || ui.session.selected == 'all') {

					// Moves Task
					core.task(taskId).move(listId)

					// Removes and Saves
					if(ui.session.selected != 'all') {
						$('#tasks .tasksContent li[data-id=' + taskId + '], li.sortable-placeholder').remove()
					}

					// If we're in the next list, we may as well reload
					if (ui.session.selected == 'next' || ui.session.selected == 'all') {
						$sidebar.find('.selected').click()
					}

					// Update Counts
					ui.lists.update().count()
					$(this).removeClass('dragHover')

				    // Update .boxhelp .list if "All List" is selected
					if(ui.session.selected == 'all'){
					    $('#Lall .name').click();
					}
					
				}
			})
		}
	},
	sortStop: function() {
		
		if(ui.session.selected != 'all') {
		
			// Saves order of tasks in list
			var taskOrder = []
			$tasks.find('ul').first().find('li').map(function () {
				var id = $(this).attr('data-id')
	
				//If not in the correct list, move to the list.
				if (core.storage.tasks[id].list != ui.session.selected) {
					core.task(id).move(ui.session.selected);
				}
	
				//If not checked, add to list
				if (!$(this).children('.checkbox').hasClass('checked')) {
					taskOrder.push(id);
				}
			});
			//Saves
			core.storage.lists.items[ui.session.selected].order = taskOrder;

			//Only in the next list
			if (ui.session.selected == 'next' && core.storage.prefs.nextAmount == 'everything') {
				//Loops through lists to save order
				for (var i=0; i<core.storage.lists.order.length; i++) {
					//New Array
					NtaskOrder = [];
					//This needs to be put into a function...
					$('#tasks > .tasksContent > ul.' + core.storage.lists.order[i] + ' > li').map(function () {
						var id = $(this).attr('data-id')
	
						//If not in the correct list, move to the list.
						if (core.storage.tasks[id].list != core.storage.lists.order[i]) {
							core.task(id).move(core.storage.lists.order[i]);
						}
	
						//If not checked, add to list
						if (!$(this).children('.checkbox').hasClass('checked')) {
							NtaskOrder.push(id);
						}
					});
	
					//Saves to order
					core.storage.lists.items[core.storage.lists.order[i]].order = NtaskOrder;
				}
			}
	
			core.storage.save([['lists', ui.session.selected, 'order']]);
		}
		
		ui.lists.update().count();
		
	},
	toggleListEdit: function(_this, forceClose) {
		if(_this.length) {
			if(_this.find('input').length || forceClose !== undefined) {
				var $input = _this.find('input'),
					model = {
						name: $input.val(),
						id: _this.attr('id').substr(1)
					}

				// Sometimes it triggers fucking blur more than once...
				try {
					$input.replaceWith('<span class="name">' + model.name + '</span>')
					core.storage.lists.items[model.id].name = model.name
					core.storage.save([['lists', model.id, 'name']])
					_this.find('.edit').removeClass('open')
					_this.find('.name').click()
				} catch(e) {}
			} else {
				var $name = _this.find('.name')
				if(_this.closest('ul').attr('id') == 'lists') {
					var name = $name.text()
					$name.replaceWith('<input type="text" value="' + name + '" placeholder="Enter the list name">')
					_this.find('input').focus()
					_this.find('.edit').addClass('open')
				}
			}
		}
	},
	toggleTaskEdit: function($this, e, cb) {

		var id = $this.attr('data-id')
			model = core.storage.tasks[id]

		//Checked Tasks
		var logged = 'checkbox ' + model.priority, checked = null
		if (core.storage.tasks[id].logged) checked = 'checked'
		
		//Checks if it's expanded & if it isn't expand it.
		if (!$this.hasClass('expanded')) {
		
			/* EXPANDING */
			var dateStr = ''
			if (model.date != '') {
				var modelDate = new Date(model.date);

				// Format date
				dateStr = core.locale.formatDate(core.storage.prefs.dateFormat, modelDate);
			}
			

			var markup = Mustache.to_html(templates.task.expanded, {
				id: id,
				checked: checked,
				content: plugin.url(model.content).toText(),
				notes: model.notes,
				notesPlaceholder : $l._('notes'),
				datePlaceholder: $l._('dueDate'),
				date: dateStr,
				extra: core.date(model.date).getDaysLeft()[0],
				priority: model.priority,
				// Because of Translated Version
				i18n_priority: $l._(model.priority),
				logged: logged
			})

			// Collapses other tasks
			if(!e.metaKey && !e.ctrlKey) $tasks.find('.expanded').dblclick()

			$this
				.html(markup)
				.addClass('expanded')
				.height($this.height() + $this.removeClass('selected').find('.hidden').show().height())
				.find('textarea').autosize().closest('li')
				.trigger('expand')
				.find('input.content').focus()
				
			setTimeout(function() {
				$this.removeClass('animate height')
			}, 150)

			if(typeof cb === 'function') cb()

		} else {

			/* COLLAPSING */

			$this.removeClass('expanded').addClass('animate height').css('height', $this.find('.boxhelp').height())

			//So data gets saved.
			$this.find('input, textarea').blur()
			
			var orig = $this.prev().attr('data-id')

			setTimeout(function() {

				$this.remove()
				
				var markup = ui.lists.drawTasks([id])

				//If it's the first task in a list, .prev won't work
				if (orig === undefined) {
					if (ui.session.selected == 'all' || ui.session.selected == 'logbook' || ui.session.selected == 'today') {
						$tasks.find('ul').prepend(markup)
					} else if (model.list == ui.session.selected) {
						$tasks.find('ul').first().prepend(markup)
					} else {
						$tasks.find('ul.' + model.list).prepend(markup)
					}
				} else {
					$tasks.find('ul li[data-id="' + orig + '"]').after(markup)
				}

				$tasks.find('ul li[data-id="' + id + '"]').trigger('collapse')

				if(typeof cb === 'function') cb()

				// after a task has changed, reload the list to re-sort (Breaks stuff)
				//$sidebar.find('.selected .name').click()
				
			}, 150)
		}
	},

	panel: {

		// Toggle button disable status
		updateButtons: function(obj) {

			// Class name to add to buttons when disabled
			var CLASS = 'disabled'

			$addBTN.addClass(CLASS)
			$delBTN.addClass(CLASS)

			// Add
			if (!obj.hasOwnProperty('add')) {
				if (ui.session.selected != 'logged' &&
					ui.session.selected != 'all') {
					obj.add = true
				}
			}
			if (obj.add) {
				$addBTN.removeClass(CLASS)
			}
			// Delete
			if (obj.del) {
				$delBTN.removeClass(CLASS)
			}

		}
	}
}

// Load correct language, plugins and init

	// Set first run defaults
	core.storage.prefs.lang = core.storage.prefs.lang || core.locale.lang();
	core.storage.prefs.dateFormat = core.storage.prefs.dateFormat || core.locale.dateFormat();

	var langScript, pluginsScript;

	langScript = document.createElement('script');
	langScript.src = 'js/translations/' + core.storage.prefs.lang + '.js';

	// when the language script has loaded, load plugins
	langScript.onload = langScript.onreadystatechange = function () {
		pluginsScript = document.createElement('script');
		pluginsScript.src = 'js/plugins.js';

		// when the plugins have loaded, initialize the UI
		pluginsScript.onload = pluginsScript.onreadystatechange = function () {
			ui.initLoad();
		}
		document.body.appendChild(pluginsScript);
	}
	document.body.appendChild(langScript);


// ------------------------------------//
//              TEMPLATES              //
// ------------------------------------//

// LISTS

$sidebar.on('click', '.name, .count', function() {
	
	// Cache ID of list
	var $this = $(this).parent(),
		model =  {
			id: $this.attr('id').substr(1),
			name: $this.find('.name').text(),
		}

	//Selected List
	ui.toggleListEdit($lists.find('input').parent(), 'close')
	$sidebar.find('.selected').removeClass('selected')
	$this.addClass('selected')
	ui.session.selected = model.id
	core.storage.prefs.selected = ui.session.selected
	core.storage.store()

	//Gets list id & populates
	var tasks = core.list(model.id).populate()
	$tasks.html('<h2>' + model.name + '</h2><ul>' + ui.lists.drawTasks(tasks) + '</ul>')
	
	//Adds Color
	$tasks.find('h2').addClass(core.storage.prefs.bgColor)

	//Set sort type
	$sortType.removeClass('current');
	$('.panel .dropdown-menu li[data-value=' + core.storage.prefs.listSort[model.id] + ']').addClass('current');

	if (ui.session.selected == 'next' && core.storage.prefs.nextAmount == 'everything') {

		var markup = "", listID, listName, listOrder

		for (var l=0; l<core.storage.lists.order.length; l++) {
			//Defines Stuff for easier access
			listID = core.storage.lists.order[l]
			listName = core.storage.lists.items[listID].name
			listOrder = plugin.sort(core.list(listID).populate(), 'magic')

			//Makes sure there is something in the list
			if (listOrder.length != 0) {
				//New DOM Nodes
				markup += '<h2>' + listName + '</h2>' + '<ul class="' + listID + '">' + ui.lists.drawTasks(listOrder) + '</ul>'
			}						
		}
		$tasks.append(markup)
	}

	//All Can't be sorted
	// else if (ui.session.selected == 'all') {
	// 	return true

	// Show Add tasks to logbook
	else if (ui.session.selected == 'logbook') {
		var loggedTasks = filter([], 'logged').length
		if (loggedTasks === 1) {
			$tasks.find('h2').after('<button id="updateLogbook" class="button">' + $.i18n._('moveToLogbookSingle') + '</button>')
		} else if (loggedTasks > 1) {
			$tasks.find('h2').after('<button id="updateLogbook" class="button">' + $.i18n._('moveToLogbookPlural', [loggedTasks]) + '</button>')
		}
	}

	switch (ui.session.selected) {
		case 'logbook':
			// Update Panel Buttons
			ui.panel.updateButtons({del: false, add: false})
			break
		default:
			// Update Panel Buttons
			ui.panel.updateButtons({del: false})
			break
	}

	setTimeout(function() {
		$tasks.find('ul').sortable().bind('sortupdate', function(ev) {
			//Triggered when the user stopped sorting and the DOM position has changed.
			ui.sortStop()
		})
	}, 100)

	return true
})

// List edit button
$lists.on('click', '.edit', function(e) {
	ui.toggleListEdit($(this).parent())
})

// Doubleclick list name to edit
$lists.on('dblclick', '.name', function() {
	ui.toggleListEdit($(this).parent())
})

// Deleting a List
$lists.on('click', '.delete', function() {

	var markup = Mustache.to_html(templates.dialog.modal, {
		id: 'deleteListModal',
		title: $l._('warning'),
		message: $l._('deleteList'),
		button: {yes: $l._('deleteOneYes'), no: $l._('deleteOneNo')}
	})
	$body.append(markup)
	var $modal = $('#deleteListModal'),
		$this = $(this).parent()

	$modal.modal()

	$modal.find('button').bind('click', function(e) {

		if($(e.target).hasClass('no')) {
			$modal.modal('hide').remove()
			return
		}

		var model = {
				id: $this.attr('id').substr(1)
			}

		// Delete list
		core.list(model.id).delete()

		$modal.modal('hide').remove()

		// Update DOM
		// Last list -> Go to Today
		if($lists.children().length == 1) {
			$this.remove()
			$('#Ltoday .name').click()
		// List is bottom -> Prev list
		} else if($this.is(':last-child')) {
			$this.prev().find('.name').click().parent().next().remove()
		// There is a list after this -> Go to it
		} else {
			$this.next().find('.name').click().parent().prev().remove()
		}
		
		// Update List count
		ui.lists.update().count()

	})

	//If the user has disabled the warnings
	if (core.storage.prefs.deleteWarnings) {
		$modal.find('button.yes').trigger('click')
	}
})


// TASKS
// -----

// Selecting a task
$tasks.on('click', 'li', function(e) {
	var $this = $(this)
	//No event handler things in input or selected.
	if (e.target.nodeName == 'INPUT' || e.target.nodeName == 'TEXTAREA' || e.target.nodeName == 'BUTTON' || $(e.target).hasClass('checkbox')) {
		return
	}
	if (e.metaKey || e.ctrlKey) {
		// Select multiple tasks
		$this.toggleClass('selected')
	} else {
		$tasks.find('.selected').removeClass('selected')
		$this.addClass('selected')
	}
	// Update Panel Buttons
	ui.panel.updateButtons({del: true})
})

// Completing a task
$tasks.on('click', '.checkbox', function() {

	var $selected,
		$parent = $(this).closest('li')

	if($parent.hasClass('selected')) {
		$selected = $tasks.find('.selected')
	} else {
		$selected = $parent
	}

	// Doesn't work in Logbook
	if(ui.session.selected != 'logbook') {

		$selected.map(function() {

			var $this = $(this),
				model = {
					id: $this.attr('data-id')
				}

			//Changes Appearance
			$this.toggleClass('checked')

			//Moves it around for real.
			core.task(model.id).toggle()

		})

		// Update count
		ui.lists.update().count()

	}
})

// Expanding a task
$tasks.on('dblclick', 'li', function(e) {

	var $this = $(this)

	//No event handler things in input or selected.
	if (e.target.nodeName == 'INPUT' || e.target.nodeName == 'TEXTAREA' || e.target.nodeName == 'BUTTON' || $(e.target).hasClass('checkbox')) {
		return
	}

	ui.toggleTaskEdit($this, e)
})

$tasks.on('expand', 'li', function() {

	var $this = $(this),
		id = $this.attr('data-id'),
		model = core.storage.tasks[id]

	$this.find('.date')
		.datepicker({weekStart: core.storage.prefs.weekStartsOn, format: core.storage.prefs.dateFormat})
		.on('change', function() {
			// Use the new date, or an empty string if Date.parse doesn't understand the input
			input = $(this).val();

			// Converts D/M/Y to Y/M/D, format required by Date.parse
			if (core.storage.prefs.dateFormat == 'dd/mm/yyyy')
				input = $(this).val().substr(6, 4) + '/' + $(this).val().substr(3, 2) + '/' + $(this).val().substr(0, 2)

			var newDate = Date.parse(input) || '';
			core.storage.tasks[id].date = newDate
			ui.lists.update().count()
			core.storage.save([['tasks', id, 'date']])
		})
	//Focus correct input
	var $input = $this.find('input[data-bind=content]')
	setTimeout(function() {
		$input.focus()
	}, 150);
})

// Deselecting all tasks
$('#tasks > .tasksContent').click(function(e) {
	if(e.target.nodeName == 'UL' || e.target.nodeName == 'H2' || e.target.className.indexOf('tasksContent') > -1) {
		$tasks.find('.expanded').dblclick()
		$tasks.find('.selected').removeClass('selected')
		ui.panel.updateButtons({del: false})
	}
})

// Content
$tasks.on('change', 'li input.content', function() {
	var id = $(this).closest('li').attr('data-id')
	core.storage.tasks[id].content = plugin.url($(this).val()).toHTML()
	core.storage.save([['tasks', id, 'content']])
})

// Priority
$tasks.on('click', '.priority', function() {
	var $this = $(this).closest('li'),
		id = $this.attr('data-id'),
		model = core.storage.tasks[id],
		original = model.priority,
		next = original

	switch(original) {
		case 'none':
			next = "low"
			break
		case 'low':
			next = "medium"
			break
		case 'medium':
			next = "high"
			break
		case 'high':
			next = "none"
			break
	}
	//Do this first, so the ui feels faster
	$(this).removeClass(original).addClass(next).html($l._(next))

	//Change Colours of checkbox
	$this.find('.checkbox').removeClass(original).addClass(next)

	//Saves
	model.priority = next
	core.storage.save([['tasks', id, 'priority']])
})

// Notes
$tasks.on('change', 'textarea', function() {
	var id = id = $(this).closest('li').attr('data-id')
	core.storage.tasks[id].notes = $(this).val()
	core.storage.save([['tasks', id, 'notes']])
})


// BUTTONS
// -------

// Updates the logbook with an animation
$tasks.on('click', '#updateLogbook', function() {

	// Get current tasks in logbook
	var orig = core.list('logbook').populate().slice(0),
		$this = $(this)

	// Update logbook
	ui.lists.update().logbook()

	// Get the tasks that are in the logbook after the update
	var tasks = core.list('logbook').populate().slice(0),

		// Get the newly logged tasks
		diff = tasks.filter(function(i) {return !(orig.indexOf(i) > -1);})

	// Get the markup for the newly logged tasks
	tasks = ui.lists.drawTasks(diff)

	// Prepends and fades in the new tasks
	var loadNew = function() {

		// Prepend the new tasks, then select them
		var $newTasks = $tasks.find('ul').prepend(tasks).find('li').slice(0, diff.length)

		// Set opacity to 0
		$newTasks.css({
			opacity: 0
		})

		// Use CSS transitions and allow DOM to update
		setTimeout(function() {
			$newTasks.css({opacity: 1})
		}, 5)

		// Updated button text
		$this.html("All completed tasks moved to logbook")
	}

	// If there are already tasks in the logbook...
	if(orig.length > 0) {

		// Get the height of a task -> Not perfect, but works
		var height = diff.length * $tasks.find('ul li .label').height(),

			// Create a temp div that moves the tasks down
			$temp = $tasks.find('ul').prepend('<div id="tempDiv"></div>').find('#tempDiv')

		// Expand the temp div to the right height
		$temp.animate({height: height}, 300, function() {

			// When it is finished, replace it with the new tasks
			$temp.remove()
			loadNew()
		})

	// Else just load the new tasks
	} else {
		$tasks.find('.noTasks').remove()
		loadNew()
	}	
})


// Adding a list
$sidebar.on('click', '.listAddBTN', function() {
	ui.toggleListEdit($lists.find('input').parent(), 'close')
	var listId = core.list().add($l._('nlist'))
	$lists.append(ui.lists.draw(listId))
	
	// Edit List Name
	$('#L' + listId).find('.name').dblclick()
})


// Adding a task
$panel.left.on('click', 'button.add', function() {
	var list = ui.session.selected
	if (list != 'all' && list != 'logbook') {
		//Adds a task with the core
		var taskId = core.task().add($l._('ntask'), list),
			markup = ui.lists.drawSingleTask(taskId)

		$tasks.find('ul').first().prepend(markup)

		//Expands Task
		$('#tasks ul li[data-id=' + taskId + ']').dblclick()

		//Remove Notice
		$('.noTasks').remove();
		
		// Update list count
		ui.lists.update().count()

		setTimeout(function() {
			$tasks.find('ul').sortable().bind('sortupdate', function(ev) {
				//Triggered when the user stopped sorting and the DOM position has changed.
				ui.sortStop()
			})
		}, 1000)

	}
})


// Deleting a task
$panel.left.on('click', 'button.delete', function() {

	var $selected = $tasks.find('.selected')

	if($selected.length) {

		var message, yes, no
		if($selected.length > 1) {
			message = $l._('deleteMore', [$selected.length])
			yes = $l._('deleteMoreYes')
			no = $l._('deleteMoreNo')
		} else {
			message = $l._('deleteOne')
			yes = $l._('deleteOneYes')
			no = $l._('deleteOneNo')
		}

		var markup = Mustache.to_html(templates.dialog.modal, {
			id: "deleteTaskModal",
			title: $l._("warning"),
			message: message,
			button: {yes: yes, no: no}
		})
		$body.append(markup)
		$modal = $('#deleteTaskModal')
		$modal.modal()

		$modal.find('button').bind('click', function(e) {

			if($(e.target).hasClass('no')) {
				$modal.modal('hide').remove()
				return
			}

			var lists = {}

			// Deletes from CLI
			$selected.each(function() {
				var taskId = $(this).attr('data-id')
				core.task(taskId).move('trash')
			})
			
			// Update list count
			ui.lists.update().count()
			
			// Remove from DOM			
			$selected.remove()
			$modal.modal('hide').remove()
		})

		//If the user has disabled the warnings
		if (core.storage.prefs.deleteWarnings) {
			$modal.find('button.yes').trigger('click')
		}
	}
})


// Hiding smart lists
$sidebar.on('click', '.list-toggle', function() {
	var $this = $(this),
		$h2 = $this.parent(),
		$ul = $h2.next('ul')
		
	if($h2.hasClass('collapsed')) {
		$h2.removeClass('collapsed')
		$this.removeClass('collapsed')
		$ul.slideDown(150, function() {
			height = $(window).height()
		})
	} else {
		$this.addClass('collapsed')
		$ul.slideUp(150, function() {
			$h2.addClass('collapsed')
		})
	}
})


String.prototype.toNum = function () {
	var x = parseInt(this, 10);
	if (x > -100) {
		return x;
	} else {
		return this.toString();
	}
}

function colorize(color) {
	//Changes Color
	var lighter = tinycolor.lighten(tinycolor.lighten(tinycolor.lighten(color))).toHexString()
	var darkish = tinycolor.darken(tinycolor.darken(color)).toHexString()
	var darkest = tinycolor.darken(darkish).toHexString()
	$('body').append('<style>\
		#sidebar ul li.selected {\
			background: ' + color + ';\
			border: 1px solid ' + darkish + ';\
			border-left: none;\
			border-right: none;\
			text-shadow: 0 1px 1px ' + darkest + ';\
		}\
		#tasks .tasksContent ul li.selected {\
			background: ' + lighter + '\
	</style>')
}
