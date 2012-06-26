/* ./plugins/autosize.js */

// Autosize 1.9 - jQuery plugin for textareas
// (c) 2011 Jack Moore - jacklmoore.com
// license: www.opensource.org/licenses/mit-license.php

(function ($, undefined) {
	var 
	hidden = 'hidden',
	borderBox = 'border-box',
	copy = '<textarea style="position:absolute; top:-9999px; left:-9999px; right:auto; bottom:auto; -moz-box-sizing:content-box; -webkit-box-sizing:content-box; box-sizing:content-box; word-wrap:break-word; height:0 !important; min-height:0 !important; overflow:hidden">',
	// line-height is omitted because IE7/IE8 doesn't return the correct value.
	copyStyle = [
		'fontFamily',
		'fontSize',
		'fontWeight',
		'fontStyle',
		'letterSpacing',
		'textTransform',
		'wordSpacing',
		'textIndent'
	],
	oninput = 'oninput',
	onpropertychange = 'onpropertychange',
	test = $(copy)[0];

	test.setAttribute(oninput, "return");

	if ($.isFunction(test[oninput]) || onpropertychange in test) {
		$.fn.autosize = function (className) {
			return this.each(function () {
				var 
				ta = this,
				$ta = $(ta),
				mirror,
				minHeight = $ta.height(),
				maxHeight = parseInt($ta.css('maxHeight'), 10),
				active,
				i = copyStyle.length,
				resize,
				boxOffset = 0;

				if ($ta.css('box-sizing') === borderBox || $ta.css('-moz-box-sizing') === borderBox || $ta.css('-webkit-box-sizing') === borderBox){
					boxOffset = $ta.outerHeight() - $ta.height();
				}

				if ($ta.data('mirror') || $ta.data('ismirror')) {
					// if autosize has already been applied, exit.
					// if autosize is being applied to a mirror element, exit.
					return;
				} else {
					mirror = $(copy).data('ismirror', true).addClass(className || 'autosizejs')[0];

					resize = $ta.css('resize') === 'none' ? 'none' : 'horizontal';

					$ta.data('mirror', $(mirror)).css({
						overflow: hidden, 
						overflowY: hidden, 
						wordWrap: 'break-word',
						resize: resize
					});
				}

				// Opera returns '-1px' when max-height is set to 'none'.
				maxHeight = maxHeight && maxHeight > 0 ? maxHeight : 9e4;

				// Using mainly bare JS in this function because it is going
				// to fire very often while typing, and needs to very efficient.
				function adjust() {
					var height, overflow;
					// the active flag keeps IE from tripping all over itself.  Otherwise
					// actions in the adjust function will cause IE to call adjust again.
					if (!active) {
						active = true;

						mirror.value = ta.value;

						mirror.style.overflowY = ta.style.overflowY;

						// Update the width in case the original textarea width has changed
						mirror.style.width = $ta.css('width');

						// Needed for IE to reliably return the correct scrollHeight
						mirror.scrollTop = 0;

						// Set a very high value for scrollTop to be sure the 
						// mirror is scrolled all the way to the bottom.
						mirror.scrollTop = 9e4;

						height = mirror.scrollTop;
						overflow = hidden;
						if (height > maxHeight) {
							height = maxHeight;
							overflow = 'scroll';
						} else if (height < minHeight) {
							height = minHeight;
						}
						ta.style.overflowY = overflow;

						ta.style.height = height + boxOffset + 'px';
						var $task = $(ta).closest('li')
						$task.height($task.find('.boxhelp').height() + height + boxOffset)
						
						// This small timeout gives IE a chance to draw it's scrollbar
						// before adjust can be run again (prevents an infinite loop).
						setTimeout(function () {
							active = false;
						}, 1);
					}
				}

				// mirror is a duplicate textarea located off-screen that
				// is automatically updated to contain the same text as the 
				// original textarea.  mirror always has a height of 0.
				// This gives a cross-browser supported way getting the actual
				// height of the text, through the scrollTop property.
				while (i--) {
					mirror.style[copyStyle[i]] = $ta.css(copyStyle[i]);
				}

				$('body').append(mirror);

				if (onpropertychange in ta) {
					if (oninput in ta) {
						// Detects IE9.  IE9 does not fire onpropertychange or oninput for deletions,
						// so binding to onkeyup to catch most of those occassions.  There is no way that I
						// know of to detect something like 'cut' in IE9.
						ta[oninput] = ta.onkeyup = adjust;
					} else {
						// IE7 / IE8
						ta[onpropertychange] = adjust;
					}
				} else {
					// Modern Browsers
					ta[oninput] = adjust;
				}

				$(window).resize(adjust);

				// Allow for manual triggering if needed.
				$ta.bind('autosize', adjust);

				// Call adjust in case the textarea already contains text.
				adjust();
			});
		}; 
	} else {
		// Makes no changes for older browsers (FireFox3- and Safari4-)
		$.fn.autosize = function () {
			return this;
		};
	}

}(jQuery));
/* ./plugins/cleanDB.js */

plugin.cleanDB = function() {

	console.log("Running cleanDB")

	var time = Date.now()

// -------------------------------------------------
// 		VERSION 1.4
// -------------------------------------------------

	var defaults = {
		task: {
			content: 'New Task',
			priority: 'none',
			date: '',
			notes: '',
			list: 'today',
			logged: false,
			tags: [],
			time: {
				content: 0,
				priority: 0,
				date: 0,
				notes: 0,
				list: 0,
				logged: 0,
				tags: 0
			},
			synced: false
		},
		list: {
			name: 'New List',
			order: [],
			time: {
				name: 0,
				order: 0
			},
			synced: false
		},
		smartlist: {
			order: [],
			time: {
				order: 0
			}
		},
		server: {
			tasks: {
				length: 0
			},
			lists: {
				order: [],
				items: {
					today: {
						order: [],
						time: {
							order: 0
						}
					},
					next: {
						order: [],
						time: {
							order: 0
						}
					},
					logbook:{
						order:[],
						time:{
							order:0
						}
					},
					length: 0
				},
				time: 0
			}
		}
	}

	var isArray = function(obj) { return obj.constructor == Array }
	var isObject = function(obj) { return obj.constructor == Object }
	var isNumber = function(obj) { return !isNaN(parseFloat(obj)) && isFinite(obj) }
	var clone = function(obj) { return $.extend(true, {}, obj) }

	var d = core.storage
	var o = clone(defaults.server)

	// Tasks
	var tasks
	if(d.hasOwnProperty('tasks')) tasks = d.tasks
	else tasks = clone(defaults.server.tasks)

	// Find length
	var length = -1
	for(var k in tasks) {
		if(typeof tasks[k] === 'object') {
			if(Number(k) > length) length = Number(k)
		}
	}
	length++
	o.tasks.length = length
	for(var i = 0; i < length; i++) {
		
		o.tasks[i] = clone(defaults.task)
		if(tasks.hasOwnProperty(i)) {
			var _this = tasks[i]
		} else {
			o.tasks[i] = { deleted: 0 }
		}

		// Deleted
		if(_this.hasOwnProperty('deleted')) {
			if(isNumber(_this.deleted) || isNumber(Number(_this.deleted))) {
				o.tasks[i] = {
					deleted: Number(_this.deleted)
				}
			} else {
				o.tasks[i] = {
					deleted: 0
				}
			}
		}

		// Content
		if(_this.hasOwnProperty('content')) {
			if(typeof _this.content === 'string') {
				o.tasks[i].content = _this.content
			}
		}

		// Priority
		if(_this.hasOwnProperty('priority')) {
			if(_this.priority === 'important') _this.priority = 'high'
			if(	_this.priority === 'none' || _this.priority === 'low' || _this.priority === 'medium' || _this.priority === 'high') {
				o.tasks[i].priority = _this.priority
			}
		}

		// Date
		if(_this.hasOwnProperty('date')) {
			if(isNumber(_this.date)) {
				o.tasks[i].date = _this.date
			} else if(typeof _this.date === 'string') {
				var Dt = new Date(_this.date).getTime()
				if(isNumber(Dt)) {
					o.tasks[i].date = Dt
				}
			}
		}

		// Notes
		if(_this.hasOwnProperty('notes')) {
			if(typeof _this.notes === 'string') {
				o.tasks[i].notes = _this.notes
			}
		}

		// Tags
		if(_this.hasOwnProperty('tags')) {
			if(isArray(_this.tags)) {
				for(var j = 0; j < _this.tags.length; j++) {
					if(typeof _this.tags[j] === 'string') {
						o.tasks[i].tags.push(_this.tags[j])
					}
				}
			}
		}

		// Logged
		if(_this.hasOwnProperty('logged')) {
			if(isNumber(_this.logged)) {
				o.tasks[i].logged = _this.logged
			} else if(_this.logged === 'true' || _this.logged === true) {
				o.tasks[i].logged = Date.now()
			}
		}

		// List
		if(_this.hasOwnProperty('list')) {
			if(isNumber(Number(_this.list))) {
				o.tasks[i].list = Number(_this.list)
			} else if(	_this.list === 'today' || _this.list === 'next' || _this.list === 'logbook') {
				o.tasks[i].list = _this.list
			}
		}

		// Timestamps
		if(_this.hasOwnProperty('time')) {
			if(isObject(_this.time)) {
				for(var j in o.tasks[i].time) {
					if(isNumber(_this.time[j])) {
						o.tasks[i].time[j] = _this.time[j]
					} else {
						var Dt = new Date(_this.time[j]).getTime()
						if(isNumber(Dt)) {
							o.tasks[i].time[j] = Dt
						}
					}
				}
			}
		}

		// Synced
		if(_this.hasOwnProperty('synced')) {
			if(_this.synced === 'true') _this.synced = true
			if(typeof _this.synced === 'boolean') {
				o.tasks[i].synced = _this.synced
			}
		}

		// Scheduled
		// if(_this.hasOwnProperty('type')) {
		// 	if(_this.type === 'scheduled') {
		// 		if(_this.hasOwnProperty('next')) {
		// 			o.tasks[i].type = _this.type
		// 			o.tasks[i].next = Number(_this.next)
		// 			o.tasks[i].time.type = Number(_this.time.type) || 0
		// 			o.tasks[i].time.next = Number(_this.time.next) || 0
		// 		}
		// 	} else if(_this.type === 'recurring') {
		// 		var valid = true
		// 		if(!_this.hasOwnProperty('next')) valid = false
		// 		if(!_this.hasOwnProperty('ends')) valid = false
		// 		if(_this.hasOwnProperty('recurType')) {
		// 			if(_this.recurType !== 'daily' || _this.recurType !== 'weekly' || _this.recurType !== 'monthly') valid = false
		// 		} else valid = false
		// 		if(!_this.hasOwnProperty('recurInterval')) valid = false
		// 		if(valid) {
		// 			o.tasks[i].type = _this.type
		// 			o.tasks[i].next = Number(_this.next)
		// 			o.tasks[i].ends = Number(_this.ends)
		// 			o.tasks[i].recurType = _this.recurType
		// 			o.tasks[i].recurInterval = _this.recurInterval
		// 			o.tasks[i].time.type = Number(_this.time.type) || 0
		// 			o.tasks[i].time.next = Number(_this.time.next) || 0
		// 			o.tasks[i].time.ends = Number(_this.time.ends) || 0
		// 			o.tasks[i].time.recurType = Number(_this.time.recurType) || 0
		// 			o.tasks[i].time.recurInterval = Number(_this.time.recurInterval) || 0
		// 		}
		// 	}
		// }
	}
	
	// Lists
	var lists
	if(d.hasOwnProperty('lists')) lists = d.lists
	else lists = clone(defaults.server.lists)
	
	// Find length
	length = -1
	for(var k in lists.items) {
		if(typeof lists.items[k] === 'object') {
			if(Number(k) > length) length = Number(k)
		}
	}
	length++
	o.lists.items.length = length
	
	var tempArray = ['today','next','logbook']
	for(var i = 0; i < length; i++) {
		tempArray.push(i)
	}
	
	for(var n = 0; n < tempArray.length; n++) {
		i = tempArray[n]
		
		// Create blank list
		if (i == 'today' || i == 'next' || i == 'logbook') {
			o.lists.items[i] = clone(defaults.smartlist)
			if(lists.items.hasOwnProperty(i)) {
				var _this = lists.items[i]
			}	
		} else {
			o.lists.items[i] = clone(defaults.list)
			if(lists.items.hasOwnProperty(i)) {
				var _this = lists.items[i]
			} else  {
				o.tasks[i] = { deleted: 0 }
			}	
		}
		
		// Deleted
		if(_this.hasOwnProperty('deleted')) {
			if(isNumber(_this.deleted) || isNumber(Number(_this.deleted))) {
				o.lists.items[i] = {
					deleted: Number(_this.deleted)
				}
			} else {
				o.lists.items[i] = {
					deleted: 0
				}
			}
		}
			
		// Name
		if(_this.hasOwnProperty('name')) {
			if(typeof _this.name === 'string') {
				o.lists.items[i].name = _this.name
			} else if(isNumber(_this.name)) {
				o.lists.items[i].name = _this.name.toString()
			}
		}
		
		
		// Order
		if(_this.hasOwnProperty('order')) {
			if(isArray(_this.order)) {
				
				// All tasks in list
				for(var j = 0; j < _this.order.length; j++) {
					if(o.tasks.hasOwnProperty(_this.order[j])) {
						if(!o.tasks[_this.order[j]].hasOwnProperty('deleted')) {
							
							// Push to order
							o.lists.items[i].order.push(_this.order[j])
							
							// Update task.list
							o.tasks[_this.order[j]].list = i
							
						}
					}
				}
			}
		}
		
		// Timestamps
		if(_this.hasOwnProperty('time')) {
			if(isObject(_this.time)) {
				for(var j in o.lists.items[i].time) {
					if(isNumber(_this.time[j])) {
						o.lists.items[i].time[j] = _this.time[j]
					} else {
						var Dt = new Date(_this.time[j]).getTime()
						if(isNumber(Dt)) {
							o.lists.items[i].time[j] = Dt
						}
					}
				}
			}
		}
		
		// Synced
		if(_this.hasOwnProperty('synced')) {
			if(_this.synced === 'true') _this.synced = true
			if(typeof _this.synced === 'boolean') {
				o.lists.items[i].synced = _this.synced
			}
		}
	}
	
	// List order. Part II: Removing.
	for(var i = 0; i < lists.order.length; i++) {
		var _this = lists.order[i]
		if(o.lists.items.hasOwnProperty(_this)) {
			if(!o.lists.items[_this].hasOwnProperty('deleted')) {
				o.lists.order.push(_this)
			}
		}
	}
	
	// List order. Part I: Adding.
	for(var i = 0; i < o.lists.items.length; i++) {
		var _this = o.lists.items[i]
		if(!_this.hasOwnProperty('deleted')) {
			var index = o.lists.order.indexOf(i)
			if(index < 0) {
				o.lists.order.push(i)
			}
		}
	}
	
	// List Time
	if(lists.hasOwnProperty('time')) {
		o.lists.time = Number(lists.time)
	}

	d.tasks = o.tasks
	d.lists = o.lists

	core.storage.save()

	console.log("Cleaning complete. Took " + (Date.now() - time)/1000 + "s")

}
/* ./plugins/cmd.js */

// CMD
// Easily do something in a single line

cmd = function (cmd) {
	// Contains all the commands

	switch(cmd) {
		// File Menu
		case 'newtask':
			$addBTN.click()
			break
		case 'newlist':
			$sidebar.find('.listAddBTN').click()
			break
		case 'sync':
			$runSync.click()
			break

		// Edit Menu
		case 'find':
			$search.focus()
			break
		case 'prefs':
			$settingsbtn.click()
			$('a[data-target=#tabGeneral]').tab('show')
			break

		// Sort
		case 'sort-magic':
			$sortType.find('.magic').parent().click()
			break
		case 'sort-default':
			$sortType.find('.default').parent().click()
			break
		case 'sort-priority':
			$sortType.find('.priority').parent().click()
			break
		case 'sort-date':
			$sortType.find('.date').parent().click()
			break

		// GoTo
		case 'today':
			$('#Ltoday .name').click()
			break
		case 'next':
			$('#Lnext .name').click()
			break
		case 'scheduled':
			$('#Lscheduled .name').click()
			break
		case 'logbook':
			$('#Llogbook .name').click()
			break
		case 'allTasks':
			$('#Lall .name').click()
			break

		// View menu
		case 'language':
			$settingsbtn.click()
			$('a[data-target=#tabLanguage]').tab('show')
			break
		case 'theme':
			$settingsbtn.click()
			$('a[data-target=#tabTheme]').tab('show')
			break
		case 'syncSettings':
			$settingsbtn.click()
			$('a[data-target=#tabSync]').tab('show')
			break

		// Help Menu
		case 'about':
			$('#aboutDialog .version').html(version)
			$('#aboutDialog').fadeToggle(150)
			$('#settingsOverlay').toggle(0)
			break
		case 'donors':
			$('#donateDialog').fadeToggle(150)
			$('#settingsOverlay').toggle(0)
			break
		case 'donate':
			window.location = 'http://nitrotasks.com/donate.html'
			break
		case 'help':
			window.location = 'http://nitrotasks.com/help'
			break
		case 'bug':
			window.location = 'https://github.com/stayradiated/Nitro/issues'
			break

		// Extra stuff for keyboard shortcuts
		case 'editTask':
			// $editBTN.click()
			$tasks.find('.selected').map(function() {
				$(this).trigger(jQuery.Event('dblclick', {metaKey: true}))
			})
			break
		case 'editList':
			$sidebar.find('.selected .name').dblclick()
			break
		case 'check':
			$tasks.find('.selected .checkbox').click()
			break
		case 'delete':
			// if($warning.is(':visible')) $("#overlay").click()
			$delBTN.click()
			break

		case 'prevTask':
			if(!$tasks.find('.selected').length) {
				$tasks.find('li').first().addClass('selected')
			} else {
				if(ui.session.selected === 'next') {
					if($tasks.find('.selected').is(':first-of-type')) {
						$tasks.find('.selected').parent().prev().prev().find('li').last().find('.content').click()
					} else {
						$tasks.find('.selected').prevAll('li:not(".hidden")').first().find('.content').click()
					}
				} else {
					$tasks.find('.selected').prev('li').find('.content').click()
				}
			}
			
			break
		case 'nextTask':
			if(!$tasks.find('.selected').length) {
				$tasks.find('li').first().addClass('selected')
			} else {
				if(ui.session.selected === 'next') {
					if($tasks.find('.selected').is(':last-of-type')) {
						$tasks.find('.selected').parent().next().next().find('li').first().find('.content').click()
					} else {
						$tasks.find('.selected').nextAll('li:not(".hidden")').first().find('.content').click()
					}
				} else {
					$tasks.find('.selected').next('li').find('.content').click()
				}
			}
			break
		case 'prevList':
			if(!$sidebar.find('.selected').length) {
				$sidebar.find('li').first().find('.name').click()
			} else if ($sidebar.find('.selected').is(':first-of-type')) {
				$sidebar.find('.selected').parent().prev('h2').prev('ul').find('li').last().find('.name').click()
			} else {
				$sidebar.find('.selected').prev('li').find('.name').click()
			}
			break
		case 'nextList':
			if(!$sidebar.find('.selected').length) {
				$sidebar.find('li').first().find('.name').click()
			} else if ($sidebar.find('.selected').is(':last-of-type')) {
				$sidebar.find('.selected').parent().next('h2').next('ul').find('li').first().find('.name').click()
			} else {
				$sidebar.find('.selected').next('li').find('.name').click()
			}
			break

		case 'moveTaskUp':
			if($tasks.find('.selected').length) {
				var $this = $tasks.find('.selected').first(),
					id = $this.attr('data-id').toNum(),
					$parent = $this.parent()

				if(ui.session.selected === 'next') {
					var l = core.storage.lists.items[$parent.attr('id')].order,
						i = l.indexOf(id)
				} else {
					var	l = core.storage.lists.items[ui.session.selected].order,
						i = l.indexOf(id)
				}

				if(i > 0) {
					l.splice(i, 1)
					l.splice(i - 1, 0, id)

					if($parent.is('.wholeList')) {
						$parent.find('li, p').remove()
						for (var i in l) {
							$parent.addClass('wholeList').append(ui.tasks.draw(l[i]))
						}
					} else {
						$sidebar.find('.selected .name').click()
					}

					$tasks.find('[data-id='+id+']').addClass('selected')
					core.storage.save()
				}
			}
			break
		case 'moveTaskDown':
			if($tasks.find('.selected').length) {
				var $this = $tasks.find('.selected').first(),
					id = $this.attr('data-id').toNum(),
					$parent = $this.parent()

				if(ui.session.selected === 'next') {
					var l = core.storage.lists.items[$parent.attr('id')].order,
						i = l.indexOf(id)
				} else {
					var	l = core.storage.lists.items[ui.session.selected].order,
						i = l.indexOf(id)
				}

				if(i > -1 && !$this.is(':last-of-type')) {
					l.splice(i, 1)
					l.splice(i + 1, 0, id)

					if($parent.is('.wholeList')) {
						$parent.find('li, p').remove()
						for (var i in l) {
							$parent.addClass('wholeList').append(ui.tasks.draw(l[i]))
						}
					} else {
						$sidebar.find('.selected .name').click()
					}

					$tasks.find('[data-id='+id+']').addClass('selected')
					core.storage.save()
				}
			}
			break
		case 'moveListUp':
			var id = ui.session.selected,
				l = core.storage.lists.order,
				i = l.indexOf(id)
			if(i > 0) {
				l.splice(i, 1)
				l.splice(i - 1, 0, id)
				ui.reload()
				$('#L' + id + ' .name').click()
				core.storage.save()
			}
			break
		case 'moveListDown':
			var id = ui.session.selected,
				l = core.storage.lists.order,
				i = l.indexOf(id)
			if(i > -1) {
				l.splice(i, 1)
				l.splice(i + 1, 0, id)
				ui.reload()
				$('#L' + id + ' .name').click()
				core.storage.save()
			}
			break

		case 'escape':
			$('#overlay, #settingsOverlay').click()
			break
	}
}
/* ./plugins/filter.js */

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
					if (property == 'overdue') {
						if (diff < 0) return true
					} else if (property == 'today') {
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

		// Get all tasks that are logged, but not in the logbook
		if(filters === 'logged') {
			for (var i=0; i<core.storage.tasks.length; i++) {
				if(!core.storage.tasks[i].hasOwnProperty('deleted') && core.storage.tasks[i].logged && core.storage.tasks[i].list !== 'logbook') {
					results.push(i);
				}
			}
		}
		
		return results;
		
	};
	
});
/* ./plugins/keys.js */

// Keyboard Shortcuts!

key('up, k', function() {cmd('prevTask')})
key('down, j', function() {cmd('nextTask')})
key('⌘+up, ⌘+k', function() {cmd('moveTaskUp')})
key('⌘+down, ⌘+j', function() {cmd('moveTaskDown')})

key('⇧+up, ⇧+k, i', function() {cmd('prevList')})
key('⇧+down, ⇧+j, u', function() {cmd('nextList')})
key('⇧+⌘+up, ⇧+⌘+k', function() {cmd('moveListUp')})
key('⇧+⌘+down, ⇧+⌘+j', function() {cmd('moveListDown')})

key('space', function() {cmd('check')})
key('enter', function() {cmd('editTask'); return false})
key('⌘+enter', function() {cmd('editList'); return false})

key('delete', function() {cmd('delete')})

key('f', function() {cmd('find'); return false})
key('p', function() {cmd('prefs')})
// key('a', function() {cmd('about')})
// key('h', function() {cmd('help')})

key('n, t', function() {cmd('newtask'); return false})
key('l', function() {cmd('newlist'); return false})
key('s', function() {cmd('sync')})

key('1', function() {cmd('today')})
key('2', function() {cmd('next')})
key('3', function() {cmd('scheduled')})
key('4', function() {cmd('logbook')})
key('5', function() {cmd('allTasks')})

key('esc', function() {cmd('escape')})

// Lists
$lists.on('keydown', 'input', function(e) {
	if(e.keyCode === 13) {
		ui.toggleListEdit($(this).parent(), 'close')
	}
})

// Tasks
$tasks.on('keydown', 'input.content', function(e) {
	if(e.keyCode === 13) {
		var $this = $(this).closest('li'),
			id = $this.attr('data-id').toNum()
		ui.toggleTaskEdit($this, {}, function() {
			$tasks.find('[data-id='+id+']').click()
		})
	}
})

$tasks.on('keydown', 'input, textarea', function(e) {
	if(e.keyCode === 27) {
		var $this = $(this).closest('li'),
			id = $this.attr('data-id').toNum()
		ui.toggleTaskEdit($this, {}, function() {
			$tasks.find('[data-id='+id+']').click()
		})
	}
})
/* ./plugins/search.js */

/* Nitro Search Plugin
 * By Jono Cooper & George Czabania
 * Licensed under the BSD License
 */

//Adds as a plugin
plugin.add(function() {

	$(document).on('loaded', function() {
		$panel.right.append('<input id="search" type="search" placeholder="'+$.i18n._('Search')+'">')
		$search = $("#search")
	
		$search.on('keyup', function() {

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

					var task = core.storage.tasks[key]

					// Search
					if (search.test(task.content + task.notes + '#' + task.tags.toString().replace(/,/g,' #'))) {
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
})
/* ./plugins/settings.js */

$(function() {
	//Adds button to panel
	$panel.right.prepend('<button class="settingsbtn"></button>')
	$settingsbtn = $('.settingsbtn')
	$settingsbtn.on('click', function() {
		$('#prefsDialog').modal();
	})
	$('body').append('\
		<div id="prefsDialog">\
			<ul class="nav nav-tabs"><li class="active"><a href="#" data-target="#tabGeneral" data-toggle="tab" class="translate" data-translate="general">g</a></li><li><a href="#" data-target="#tabLanguage" data-toggle="tab" class="translate" data-translate="language">g</a></li><li><a href="#" data-target="#tabTheme" data-toggle="tab" class="translate" data-translate="theme">g</a></li><li><a href="#" data-target="#tabSync" data-toggle="tab" class="translate" data-translate="sync">g</a></li><li><a href="#" data-target="#tabAbout" data-toggle="tab" class="translate" data-translate="about">g</a></li></ul>\
			<div class="tab-content">  \
				<div class="tab-pane active" id="tabGeneral">\
				<form>\
					<input type="checkbox" id="deleteWarnings"><label for="deleteWarnings" class="translate" data-translate="hideWarnings"></label><br>\
					<label class="description translate" data-translate="deleteWarningsDescription"></label>\
					<hr>\
					<label class="left translate" data-translate="nextDescription"> </label><select id="nextAmount">\
						<option value="noLists" class="translate" data-translate="nextNoLists"></option>\
						<option value="everything" class="translate" data-translate="nextEverything"></option>\
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
								<td class="language"><a href="#" data-value="hungarian">Magyar</a></td>\
								<td class="author"><a href="mailto:sjozsef0227@gmail.com">József Samu</a>\
							</tr>\
								<td class="language"><a href="#" data-value="hungarian">Magyar</a></td>\
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
						<option value="linux">Linux</option>\
						<option value="coffee">Blue Coffee</option>\
						<option value="wunderlist">Wunderlist</option>\
						<option value="bieber">Justin Bieber</option>\
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
							<option value="" class="translate" data-translate="default"></option>\
							<option value="light" class="translate" data-translate="light"></option>\
							<option value="dark" class="translate" data-translate="dark"></option>\
						</select>\
						<label class="description translate" data-translate="headingDescription"></label>\
					</div>\
				</div>\
				<div class="tab-pane" id="tabSync">\
					<div class="connect">\
						<h2>Choose a service to setup Nitro Sync</h2>\
						<div class="icons">\
							<a class="button dropbox" href="#" data-service="dropbox"><img src="css/img/dropbox.png">Dropbox</a>\
							<a class="button ubuntu" href="#" data-service="ubuntu"><img src="css/img/ubuntu.png">Ubuntu</a>\
							<a class="button signup" href="http://db.tt/quaCEy3D" target="_blank">Create Account</a>\
							<a class="button signup" href="https://login.ubuntu.com/+new_account" target="_blank">Create Account</a>\
						</div>\
					</div>\
					<div class="waiting">\
						<p><span class="translate" data-translate="syncAuthenticate"> </span><a class="cancel translate" data-translate="cancel"></a></p>\
						<img class="spinner" src="css/img/spinner.gif">\
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
						</select><br>\
						<label class="description translate" data-translate="syncDescription"></label>\
					</div>\
				</div>\
				<div class="tab-pane" id="tabAbout">\
					<img src="css/img/nitro_128.png" class="center">\
					<h2>Nitro <span></span></h2>\
					<p class="center">By George Czabania & Jono Cooper<br>\
					Copyright © 2012 Caffeinated Code<br>\
					Licensed under the BSD licence</p>\
					<hr>\
					<h3>Donors</h3>\
					<p>A huge thanks to everyone that donated! To make a donation, visit our <a href="http://nitrotasks.com/#donate">website</a>.</p>\
					<ul>\
						<li>Gabriel Favaro</li>\
						<li>James Thomas</li>\
					</ul>\
					<ul>\
						<li>Sergio Rubi</li>\
						<li>James Mendenhall</li>\
						<li>Nekhelesh Ramananthan</li>\
						<li>Valentin Vago</li>\
						<li>Sebastian Alvarez</li>\
						<li>Pierre Quillery</li>\
					</ul>\
					<ul>\
						<li>Icon designed by Николай Гармаш (Nicholay Garmash)</li>\
					</ul>\
					<hr>\
					<h3>Keyboard Shortcuts</h3>\
					<table>\
						<tr class="break"><td colspan="2">Standard</td></tr>\
						<tr>\
							<td>N</td>\
							<td>Add task</td>\
						</tr>\
						<tr>\
							<td>L</td>\
							<td>Add list</td>\
						</tr>\
						<tr>\
							<td>F</td>\
							<td>Search</td>\
						</tr>\
						<tr>\
							<td>P</td>\
							<td>Settings</td>\
						</tr>\
						<tr class="break"><td colspan="2">Selecting and Moving Tasks</td></tr>\
						<tr>\
							<td>Up, J</td>\
							<td>Selects the task above</td>\
						</tr>\
						<tr>\
							<td>Down, K</td>\
							<td>Selects the task below</td>\
						</tr>\
						<tr>\
							<td>Cmd/Ctrl Up, Cmd/Ctrl J</td>\
							<td>Move task up one</td>\
						</tr>\
						<tr>\
							<td>Cmd/Ctrl Down, Cmd/Ctrl k</td>\
							<td>Move task down one</td>\
						</tr>\
						<tr class="break"><td colspan="2">Selecting and Moving Lists</td></tr>\
						<tr>\
							<td>Shift Up</td>\
							<td>Select the list above</td>\
						</tr>\
						<tr>\
							<td>Shift Down</td>\
							<td>Select the list below</td>\
						</tr>\
						<tr>\
							<td>Cmd/Ctrl Shift Up</td>\
							<td>Move the list up one</td>\
						</tr>\
						<tr>\
							<td>Cmd/Ctrl Shift Down</td>\
							<td>Move the list down one</td>\
						</tr>\
						<tr class="break"><td colspan="2">Editing Tasks and Lists</td></tr>\
						<tr>\
							<td>Spacebar</td>\
							<td>Check off task</td>\
						</tr>\
						<tr>\
							<td>Enter</td>\
							<td>Edit task</td>\
						</tr>\
						<tr>\
							<td>Shift Enter</td>\
							<td>Edit list</td>\
						</tr>\
						<tr class="break"><td colspan="2">Smart lists</td></tr>\
						<tr>\
							<td>1</td>\
							<td>Today</td>\
						</tr>\
						<tr>\
							<td>2</td>\
							<td>Next</td>\
						</tr>		\
						<tr>\
							<td>3</td>\
							<td>Scheduled</td>\
						</tr>	\
						<tr>\
							<td>4</td>\
							<td>Logbook</td>\
						</tr>	\
						<tr>\
							<td>5</td>\
							<td>All Tasks</td>\
						</tr>\
				</div>\
			</div>\
		</div>\
	');
	//Because it needs time to load
	$(document).on('loaded', function() {
		$('#prefsDialog .translate').map(function () {
			$(this).html($.i18n._($(this).attr('data-translate')));
		})
		$('#tabAbout h2 span').html(version)
		// Only show linux theme in Python version
		if(app != 'python') $('#theme').find('[value=linux]').remove()
	})

	var $tabSync = $('#tabSync')

	/**********************************
		SETTINGS
	**********************************/

	// CHECK BOXES [DELETE WARNINGS & LOW GRAPHICS MODE]
	$('#tabGeneral form input').change(function () {

		core.storage.prefs.deleteWarnings = $('#deleteWarnings').prop('checked')
		core.storage.save()

	})

	// NEXT AMOUNT
	$('#nextAmount').change(function () {

		core.storage.prefs.nextAmount = this.value;
		core.storage.save();

		//Reloads next if it is selected
		if (ui.session.selected === 'next') {
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

		// Reload sidebar
		ui.reloadSidebar()

		//Tells Python
		if (app == 'python') {
			document.title = 'theme|' + core.storage.prefs.theme
		}
	});

	/**********************************
		CUSTOM BACKGROUNDS
	**********************************/

	// REMOVE CUSTOM BACKGROUND
	$('#removeBG').click(function () {
		localStorage.removeItem('background');
		$tasks[0].style.backgroundImage = 'none';
	});

	// DRAG AND DROP
	$body.bind({
		dragover: function () {
			// Stop the window from opening the file
			return false;
		},
		drop: function (e) {
			// Get the files from the event
			e = e || window.event;
			e.preventDefault();
			e = e.originalEvent || e;
			if (e.hasOwnProperty('files') || e.hasOwnProperty('dataTransfer')) {
				var files = (e.files || e.dataTransfer.files);
				setBG(files[0]);
				return false;
			}
		}
	});

	// BUTTON UPLOAD
	$('#chooseBG').change(function (e) {
		var files = $(this)[0].files;
		setBG(files[0]);
	});

	// Takes a file and sets it as the background
	var setBG = function (f) {
		core.storage.prefs.bgSize = this.value;
		var reader = new FileReader();
		reader.onload = function (event) {

			localStorage.removeItem('background');
			localStorage.setItem('background', event.target.result);

			$tasks[0].style.backgroundImage = 'url(' + event.target.result + ')';
		};
		reader.readAsDataURL(f);
		core.storage.save()
	};

	// BACKGROUND SIZE
	$('#backgroundSize').change(function () {
		core.storage.prefs.bgSize = this.value;
		switch (this.value) {
		case 'tile':
			$tasks.removeClass('shrink zoom').addClass('tile');
			break;
		case 'shrink':
			$tasks.removeClass('tile zoom').addClass('shrink');
			break;
		case 'zoom':
			$tasks.removeClass('tile shrink').addClass('zoom');
			break;
		}
		core.storage.save();
	});

	// HEADING COLOR
	$('#headingColor').change(function () {
		core.storage.prefs.bgColor = this.value;
		core.storage.save();

		$tasks.find('h2').removeClass('light dark').addClass(core.storage.prefs.bgColor);
	});

	/**********************************
			LOADING PREFERENCES
	**********************************/
	$('#deleteWarnings').prop('checked', core.storage.prefs.deleteWarnings);
	$('#nextAmount').val(core.storage.prefs.nextAmount);
	$('#theme').val(core.storage.prefs.theme);
	$('#backgroundSize').val(core.storage.prefs.bgSize);
	$('#headingColor').val(core.storage.prefs.bgColor);

	// CUSTOM BACKGROUND
	if (localStorage.hasOwnProperty('background')) {
		$tasks[0].style.backgroundImage = 'url(' + localStorage.getItem('background') + ')';
	} else if (core.storage.prefs.hasOwnProperty('background')) {
		$tasks[0].style.backgroundImage = 'url(' + core.storage.prefs.background + ')';
	}

	$tasks.addClass(core.storage.prefs.bgSize);

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

	// SYNC
	$('#syncInterval').val(core.storage.prefs.sync.interval)
	if(core.storage.prefs.sync.hasOwnProperty('access')) {		
		// Load settings
		$tabSync.find('.email').html(core.storage.prefs.sync.email)
		$tabSync.find('.service').html(core.storage.prefs.sync.service)
		// Show settings
		$tabSync.find('.connect').hide()
		$tabSync.find('.settings').show()
	}


	/**********************************
				SYNC
	**********************************/

	var animateTab = function(tab, from, to, cb) {
		var oldHeight = tab.height()
		tab.height('auto')
		from.hide()
		to.show()
		var newHeight = tab.height()
		to.hide()
		from.show().fadeOut(150, function() {
			tab.height(oldHeight)
			to.fadeIn(150)
			tab.animate({
				height: newHeight
			}, 300, function() {
				if(typeof cb === 'function') cb()
			})
		})
	}

	$tabSync.find('a.button:not(".signup")').click(function() {
			
		var service = $(this).data('service');
			
		// Run sync
		sync.run(service, function (result) {
			if(result) {
				$tabSync.find('.email').html(core.storage.prefs.sync.email);
				$tabSync.find('.service').html(service);
				animateTab($tabSync, $tabSync.find('.waiting'), $tabSync.find('.settings'))
			} else {
				$tabSync.find('.waiting p').html($.i18n._('syncError'))
				setTimeout(function() {
					animateTab($tabSync, $tabSync.find('.waiting'), $tabSync.find('.connect'), function() {
						$tabSync.find('.waiting p').html($.i18n._('syncAuthenticate'))
					})
				}, 5000)
			}
		})
		
		animateTab($tabSync, $tabSync.find('.connect'), $tabSync.find('.waiting'))
	})

	$tabSync.find('a.cancel').click(function() {

		core.storage.prefs.sync.active = false
		animateTab($tabSync, $tabSync.find('.waiting'), $tabSync.find('.connect'))

	})

	$tabSync.find('.logout').click(function () {
		// Delete tokens from localStorage
		delete core.storage.prefs.sync.email
		delete core.storage.prefs.sync.access
		delete core.storage.prefs.sync.service
		core.storage.save()
		// Go back to main page
		animateTab($tabSync, $tabSync.find('.settings'), $tabSync.find('.connect'))
	})

	// SYNC TYPE
	$('#syncInterval').change(function () {
		var interval = this.value
		switch(interval) {
			case 'timer':
				sync.timer()
				break
		}
		core.storage.prefs.sync.interval = interval
		core.storage.save()
	})

});

/* ./plugins/sort.js */

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

	$(document).on('loaded', function() {
		$panel.left.append('\
			<span>\
			<button data-toggle="dropdown" class="sort">'+$.i18n._("sortbtn")+'</button>\
			<ul class="dropdown-menu">\
			  <li class="current" data-value="magic"><span class="icon magic"></span>'+$.i18n._("sortMagic")+'</li>\
			  <li data-value="manual"><span class="icon hand"></span>'+$.i18n._("sortDefault")+'</li>\
			  <li data-value="priority"><span class="icon priority"></span>'+$.i18n._("sortPriority")+'</li>\
			  <li data-value="date"><span class="icon date"></span>'+$.i18n._("sortDate")+'</li>\
			</ul>\
			</span>')

		$sortType = $('.panel .left span ul li')
		$sortType.on('click', function() {
			$sortType.removeClass('current')
			$(this).addClass('current')
			var val = $(this).attr('data-value')
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
	
	plugin.sort = function(array, method) {

		// Clone list
		list = array.slice(0)

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

					var worth = { none: 0, low: 2, medium: 6, high: 10 }

					rating.a += worth[a.priority]
					rating.b += worth[b.priority]

					if(a.logged && !b.logged) return 1
					else if(!a.logged && b.logged) return -1
					else if(a.logged && b.logged) return 0

					return rating.b - rating.a
	
				})
				break
				
			case "manual":
				break;
				
			case "priority":
				
				list.sort(function(a,b) {
					var worth = { none: 0, low: 1, medium: 2, high: 3 };
					if(a.logged && !b.logged) return 1
					else if(!a.logged && b.logged) return -1
					else if(a.logged && b.logged) return 0
					return worth[b.priority] - worth[a.priority]
				});
				break;
				
			case "date":
				list.sort(function(a,b) {
					if(a.logged && !b.logged) return 1
					else if(!a.logged && b.logged) return -1
					else if(a.logged && b.logged) return 0
					// Handle tasks without dates
					if(a.date=="" && b.date !== "") return 1;
					else if(b.date=="" && a.date !== "") return -1;
					else if (a.date == "" && b.date == "") return 0;
					// Sort timestamps
					return a.date -  b.date
				});
				break;
			
		}
		
		// Unconvert task IDs to obects
		for(var i = 0; i < list.length; i++) {
			var id = list[i].arrayID
			delete list[i].arrayID
			list[i] = id
		}
		
		return list;
		
	};
	
});
/* ./plugins/sync.js */

/* Nitro Sync Plugin
 * By Jono Cooper & George Czabania
 * Licensed under the BSD License
 * Uses jQuery for AJAX calls
 */

//Adds as a plugin
plugin.add(function() {

	$(document).on('loaded', function() {
		$panel.right.prepend('<button class="runSync"></button>')
		$runSync = $('.runSync')
	})

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
		run: function (service, callback) {

			var time = core.timestamp()

			if (service) {
				core.storage.prefs.sync.service = service;
			} else if (!core.storage.prefs.sync.hasOwnProperty('service')) {
				console.log("Error: Don't know what service to use.");
				return;
			}

			core.storage.prefs.sync.active = true

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

				switch(app) {
					case 'python':
						document.title = 'null'
						document.title = 'ajax|reqURL|' + service
						break
					case 'js':
						$.ajax({
							type: "POST",
							url: core.storage.prefs.sync.url + '/request_url',
							dataType: 'json',
							data: {
								service: service
							},
							success: function (data) {
								ajaxdata.data = data
							},
							error: function(data) {
								ajaxdata = 'error'
							}
						})
						break
				}
			}

			var showPopup = function(url) {
				switch(app) {
					case 'python':
						document.location = url
						break
					case 'web':
						$('#login .container').html('<div class="loading">Loading... You may need to disable your popup blocker.</div>')
					case 'js':
						var width = 960,
							height = 600
							left = (screen.width / 2) - (width / 2),
							top = (screen.height / 2) - (height / 2)
						window.open(url, Math.random(), 'toolbar=no, type=popup, status=no, width='+width+', height='+height+', top='+top+', left='+left)
						break
				}
			}

			var authorizeToken = function (token, service, cb) {

				console.log("Getting access token")

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

				switch(app) {
					case 'python':
						document.title = 'null'
						document.title = 'ajax|token|' + JSON.stringify(token) + '|' + service
						break
					case 'js':
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
						break
				}
			}

			// Connect

			var service = core.storage.prefs.sync.service
			requestURL(service, function(result) {
				if(result == 'error') {
					callback(false)
				} else {
					core.storage.prefs.sync.token = result
					showPopup(result.authorize_url)
					authorizeToken(result, service, function(result) {
						callback(result)
					})
				}
			})
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

			//^ Ajax Request we're watching for
			if (app == 'python') {
				document.title = 'null';
				document.title = 'ajax|sync|' + JSON.stringify(compress(client)) + '|' + JSON.stringify(core.storage.prefs.sync.access) + '|' + core.storage.prefs.sync.service;
			} else {
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
			}
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
/* ./plugins/tags.js */

// Tags plugin 2

plugin.add(function() {

	$tasks.on('change', 'input.tags', function() {

		var $this = $(this).closest('li'),
			val = $(this).val(),
			model = {
				id: $this.attr('data-id').toNum()
			},
			task = core.storage.tasks[model.id]

		var tags = val.split(/\s*,\s*/)

		// Because regex is hard
		for(var i = 0; i < tags.length; i++) {
			if(tags[i].length == 0) {
				tags.splice(i, 1)
			}
		}

		task.tags = tags
		core.storage.save([['tasks', model.id, 'tags']])

	})

	// Clicking a tag
	$tasks.on('click', '.tag', function() {

		// Get tag name
		var tag = '#' + $(this).text();
		// Go to All Tasks list
		$('#Lall .name').trigger('click')
		// Run search - We should give the searchbox an ID
		$search.val(tag).trigger('keyup')
		
	})

})
/* ./plugins/upgrade.js */

// Upgrade localStorage from 1.3.1 to 1.4

// plugin.add(function() {

	upgrade = function(storage) {

		if(storage === 'empty') return
		console.log("Running database upgrade")
		
		// Back up original data
		$.polyStorage.set('old_data', storage)

		var tasks = storage.tasks,
			lists = storage.lists,
			prefs = storage.prefs

		var convertDate = function(date) {
			var date = new Date(date)
			return date.getTime()
		}

		// --------------------------
		// 			>> 1.3.1
		// --------------------------

		// Check tasks for timestamps
		for(var id in tasks) {
			if (id !== 'length' && !tasks[id].hasOwnProperty('deleted')) {
				var _this = tasks[id]
				// Check task has time object
				if (!_this.hasOwnProperty('time')) {
					_this.time = {
						content: 0,
						priority: 0,
						date: 0,
						notes: 0,
						today: 0,
						showInToday: 0,
						list: 0,
						logged: 0
					}
				}
				// Check task has sync status
				if (!_this.hasOwnProperty('synced')) {
					_this.synced = false
				}
				// Make sure list is a number
				if(typeof _this.list === 'string') _this.list = _this.list.toNum()
			}
		}
		// Check lists for timestamps
		for(var id in lists.items) {
			if (id !== 'length' && id !== '0') {
				var _this = lists.items[id]
				// Check if list has been deleted
				if (!_this.hasOwnProperty('deleted')) {
					// Check list has time object
					if (!_this.hasOwnProperty('time') || typeof(_this.time) === 'number') {					
						// Add or reset time object
						_this.time = {
							name: 0,
							order: 0
						}				
					}
					if (id !== 'today' && id !== 'next' && id !== 'someday') {
						// Check list has synced status
						if (!_this.hasOwnProperty('synced')) {				
							_this.synced = 'false';
						}
					}
					// Convert everything to numbers
					for  (var x = 0; x < _this.order.length; x++) {
						if(typeof _this.order[x] === 'string') {
							_this.order[x] = _this.order[x].toNum();
						}
					}
				}					
			}
		}
		// Make sure all lists exist
		for(var id = 1; id < lists.items.length; id++) {
			if(!lists.items.hasOwnProperty(id)) {
				lists.items[id] = {
					deleted: 0
				}
			}
		}
		//Check someday list
		if (lists.items.someday) {
			//Create Someday List
			var id = lists.items.length
			lists.items[id] = $.extend(true, {}, lists.items.someday)
			lists.items.length++
			lists.order.push(id)
			delete lists.items.someday
			// Update task.list
			for (var i = lists.items[id].order.length - 1; i >= 0; i--) {
				var _this  = lists.items[id].order[i]
				_this.list = id
			}
		}
		//Check for scheduled
		if (!lists.scheduled) {
			lists.scheduled = {length: 0}
		}
		// Check preferences exist. If not, set to default
		lists.time          = prefs.time   				|| 0
		prefs.sync 			= prefs.sync 				|| {}
		prefs.sync.interval = prefs.sync.interval  		|| 'manual'
		prefs.sync.active   = prefs.sync.active    		|| true
		prefs.sync.url      = prefs.sync.url       		|| 'http://app.nitrotasks.com'
		prefs.sync.timer    = prefs.sync.timer     		|| 120000
		prefs.lang          = prefs.lang           		|| 'english'
		prefs.bg            = prefs.bg             		|| {}
		prefs.bg.color      = prefs.bg.color       		|| ''
		prefs.bg.size       = prefs.bg.size        		|| 'tile'

		// --------------------------
		// 			LISTS
		// --------------------------

		// Fix up List 0
		lists.items[0] = {deleted: 0}

		// Add in logbook
		lists.items.logbook = {
			order: [],
			time: {
				order: 0
			}
		}

		lists.items[lists.items.length] = {
			name: 'Scheduled',
			order: [],
			time: {
				order: 0
			}
		}

		var scheduledID = lists.items.length
		lists.order.push(scheduledID)
		lists.items.length++

		// Fix Next list
		for (var i = lists.items.next.order.length - 1; i >= 0; i--) {
			var id = lists.items.next.order[i],
				_this = tasks[id]
			if(_this.list !== 'next') {
				lists.items.next.order.splice(i, 1)
			}
		};

		// Move scheduled tasks
		for (var key in lists.scheduled) {
			if(key !== 'length') {
				var _this = lists.scheduled[key],
					id = tasks.length
				console.log(_this, id)
				tasks[id] = $.extend(true, {}, _this)
				_this = tasks[id]
				_this.list = scheduledID
				_this.tags = []
				if(_this.priority === 'important') _this.priority = 'high'
				delete _this.next
				delete _this.ends
				delete _this.type
				delete _this.recurType
				delete _this.recurInterval

				lists.items[scheduledID].order.push(id)
				tasks.length++
			}
		}

		delete lists.scheduled


		// --------------------------
		// 			TASKS
		// --------------------------

		for(var key in tasks) {

			if(key != 'length') {

				var _this = tasks[key]

				// Remove old properties
				delete _this.showInToday
				delete _this.today
				if(_this.hasOwnProperty('time')) {
					delete _this.time.showInToday
					delete _this.time.today
				}

				// Important -> High
				if(_this.priority === 'important') _this.priority = 'high'

				// Updated logged propety
				if(_this.logged === "true" || _this.logged === true) {
					_this.logged === core.timestamp()
					_this.list = 'logbook'
					lists.items.logbook.order.push(key)
				}

				// Add tags
				_this.tags = []

				// Update date property
				if(_this.date !== "" && _this.hasOwnProperty('date')) {
					_this.date = convertDate(_this.date)
				}

			}

		}


		// --------------------------
		// 			PREFS
		// --------------------------

		// Add in listSort
		prefs.listSort = {}

		// Reset
		prefs.theme = "default"
		prefs.lang = "english"

		// Transfer
		prefs.bgColor = prefs.bg.color
		if(prefs.nextAmount == "threeItems") prefs.nextAmount = "everything"
		delete prefs.bg
		delete prefs.gpu
		delete prefs.over50
		prefs.sync.interval = 'manual'

		// Set version
		prefs.version = version
		
		
		
	
		// --------------------------
		// 			MERGE
		// --------------------------
		
		for(var i = 0; i < core.storage.lists.items.length; i++) {
			
			var _this = core.storage.lists.items[i]
			
			// Don't merge deleted tasks
			if(!_this.hasOwnProperty('deleted')) {
				
				var newID = lists.items.length
				lists.items[newID] = $.extend(true, {}, _this)
				lists.items.length++
				
				// Fix up task.list
				for(var j = 0; j < _this.order.length; j++) {
					core.storage.tasks[_this.order[j]].list = newID
				}
				
				// Fix up list order
				lists.order.push(newID)
				
			}
		}

		for(var i = 0; i < core.storage.tasks.length; i++) {
			
			var _this = core.storage.tasks[i]
			
			// Don't merge deleted tasks
			if(!_this.hasOwnProperty('deleted')) {
				
				var newID = tasks.length
				tasks[newID] = $.extend(true, {}, _this)
				tasks.length++
				
				// Smartlists
				if(_this.list == 'today' || _this.list == 'next' || _this.list == 'logbook') {
					lists.items[_this.list].order.push(newID)
					
				// Custom lists
				} else {
					var index = lists.items[_this.list].order.indexOf(i)
					if(index > -1) lists.items[_this.list].order.splice(index, 1, newID)	
				}	
			}
		}
		
		
		
		
		
		// --------------------------
		// 			SAVE
		// --------------------------

		localStorage.removeItem('jStorage')
		core.storage.tasks = tasks
		core.storage.lists = lists
		core.storage.prefs = prefs
		core.storage.save()

	}
// })
/* ./plugins/url.js */

plugin.add(function() {
	
	plugin.url = function(text) {
		return {
			toHTML: function() {
				var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
				return text.replace(exp,'<a target=_blank href=$1>$1</a>');
			},
			toText: function() {
				var exp = /<a\b[^>]*>(.*?)<\/a>/ig;
				return text.replace(exp, '$1');
			}
		}
	}
})
