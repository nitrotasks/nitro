/* Nitro Core
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
$(document).ready(function() {
	//Language Init
	core.storage.prefs.lang = core.storage.prefs.lang || 'english';
	$('#languagescript').attr('src', 'js/translations/' + core.storage.prefs.lang + '.js');
})

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
	$delBTN = $()

var ui = {
	language: function (data) {
		//Loads Translation Pack in
		$.i18n.setDictionary(data);

		//Nice shorthand Method
		$l = $.i18n;

		// Loads Plugins!
		ui.initLoad();
		plugin.load();

		$('#tasks > .tasksContent').click(function(e) { 
			if(e.target.nodeName == 'UL' || e.target.nodeName == 'H2' || e.target.className == 'tasksContent') {
				$('.expanded').dblclick();
				$('#tasks .selected').removeClass('selected');
			}
		})
	},
	initLoad: function() {
		//Buttons
		$sidebar.find('h2.smartlists')
			.html($l._('focus'))
			.append(Mustache.to_html(templates.button.listToggle,{
				title: "Hide lists"
			}))

		// Append  smartlists
		var markup = "", smartlists = [['today', 'Today'], ['next', 'Next'], ['logbook', 'Logbook'], ['all', 'All Tasks']]
		for(var i = 0; i < smartlists.length; i++) { markup += ui.lists.draw(smartlists[i]) }
		$smartlists.append(markup).trigger('ready')
		
		$panel.left.prepend(Mustache.to_html(templates.button.deleteTask, {name: $l._('deletebtn') }))
		$panel.left.prepend(Mustache.to_html(templates.button.addTask, {name: $l._('addbtn') }))

		$addBTN = $panel.left.find('button.add')
		$delBTN = $panel.left.find('button.delete')

		//Splitter
		$('#content').splitter({sizeLeft: true});
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
			}
		});

		// Theme init
		core.storage.prefs.theme = core.storage.prefs.theme || 'default';
		$('link.theme').attr('href', 'css/' + core.storage.prefs.theme + '.css').ready(function () {
			//I can't trigger it?
			$('.tasksContent').height(height - $('.panel').height())
			ui.reload();
		});

		//Collapse Lists
		$sidebar.find('h2.lists').html($l._('lists'))
		$sidebar.append(Mustache.to_html(templates.button.addList, {name: "Add List"}))

		//Good idea to save? If theme or lang needs to be saved?
		core.storage.save();
	},
	session: {
		selected: 'today'
	},
	reload: function() {
		//Populates Template
		var markup = ""
		for (var i=0; i<core.storage.lists.order.length; i++) { markup += ui.lists.draw(core.storage.lists.order[i]) }
		$lists.html(markup)
		console.log($('#L' + ui.session.selected + ' .name'))
		$('#L' + ui.session.selected + ' .name').click();

		//Sortable Lists 
		$lists.sortable({
			containment: 'parent',
			axis: 'y',
			distance: 20,
			placeholder: 'listPlaceholder',
			helper: 'clone',
			stop: function() {
				//Saves Everything, including order
				var listOrder = []

				//Loops through lists & adds the to an array
				$lists.children().map(function () {
					listOrder.push($(this).attr('id').substr(1).toNum())
				});

				//Saves
				core.storage.lists.order = listOrder;
				core.storage.save([['list-order', null, null]])
			}
		});

		//Droppable
		$sidebar.find('ul li').droppable(ui.lists.dropOptions)

		//Update Counts
		ui.lists.update().count()
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

			var markup = ""			

			//Loops and adds each task to a tmp view
			for (var i=0; i<tasks.length; i++) {
				markup += ui.lists.drawSingleTask(tasks[i])
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
					//Translated Name or Custom Name
					if (typeof(model.list) == 'number') {
						list = core.storage.lists.items[model.list].name
					} else {
						list = $l._(model.list)
					}

				default:
					// Show task due date
					date = core.date(model.date).getDaysLeft()
			}

			var temp = Mustache.to_html(templates.task.collapsed, {
				id: id,
				checked: checked,
				content: model.content,
				notes: model.notes,
				date: date,
				list: list,
				priority: model.priority,
				logged: logged
			})

			// Render #hashtags - VERY SLOW TAKES 30ms
			// temp = $(temp).find('.content').html(hashTag(model.content)).closest('li').clone().wrap('<p>').parent().html()

			return temp
		},
		update: function() {
			return {
				count: function() {

					// Update all list counts
					for(var id = 0; id < core.storage.lists.items.length; id++) {
						if(!core.storage.lists.items[id].hasOwnProperty('deleted')) {
							var list = core.storage.lists.items[id];			
							$('#L' + id).find('.count').html(list.order.length);
						}
					}

					var focusLists = ['today', 'next', 'scheduled', 'logbook', 'all'];
					for (var id = 0; id < focusLists.length; id++) {
						$('#L' + focusLists[id]).find('.count').html(core.list(focusLists[id]).populate().length);
					}

					// Set Title
					var todayTotal = core.storage.lists.items['today'].order.length;
					todayTotal > 0 ? document.title = todayTotal + " - Nitro" : document.title = "Nitro";
				},
				logbook: function() {

					// Loop through all tasks
					for(var id = 0; id < core.storage.tasks.length; id++) {

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
		dropOptions: {
			hoverClass: "dragHover",
			accept: "#tasks li",
			drop: function (event, uix) {
				var listId = $(this).attr('id').substr(1).toNum(),
					taskId = $(uix.draggable).attr('data-id').toNum()

				if(core.storage.tasks[taskId].list !== listId) {

					//Moves Task
					core.task(taskId).move(listId);

					//Removes and Saves
					$(uix.draggable).remove();

					// If we're in the next list, we may as well reload
					if (ui.session.selected == 'next') {
						$('#Lnext .name').click();
					}

					//Update Counts - why on a delay?
					setTimeout(function() {
						ui.lists.update().count();
					}, 100);

				}
			}
		}
	},
	sortStop: function() {
		// Saves order of tasks in list
		var taskOrder = []
		$tasks.find('li').map(function () {
			var id = $(this).attr('data-id').toNum()

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
		if (ui.session.selected == 'next') {
			//Loops through lists to save order
			for (var i=0; i<core.storage.lists.order.length; i++) {
				//New Array
				NtaskOrder = [];
				//This needs to be put into a function...
				$('#tasks > .tasksContent > ul.' + core.storage.lists.order[i] + ' > li').map(function () {
					var id = $(this).attr('data-id').toNum()

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

		ui.lists.update().count();
		core.storage.save([['lists', ui.session.selected, 'order']]);
	}
}

// ------------------------------------//
//              TEMPLATES              //
// ------------------------------------//

// LISTS

$sidebar.on('click', '.name, .count', function() {
	
	// Cache ID of list
	var $this = $(this).parent(),
		model =  {
			id: $this.attr('id').substr(1).toNum(),
			name: $this.find('.name').text(),
		}

	//Selected List
	$('#sidebar .selected').removeClass('selected')
	$this.addClass('selected')
	ui.session.selected = model.id

	//Gets list id & populates
	var tasks = core.list(model.id).populate()
	$tasks.html('<h2>' + model.name + '</h2><ul>' + ui.lists.drawTasks(tasks) + '</ul>')

	// Set sort type
	$sortType.val(core.storage.prefs.listSort[model.id])

	if (ui.session.selected == 'next') {

		var markup = "", listID, listName

		for (var l=0; l<core.storage.lists.order.length; l++) {
			//Defines Stuff for easier access
			listID = core.storage.lists.order[l]
			listName = core.storage.lists.items[listID].name
			tasks = core.list(listID).populate()

			//Makes sure there is something in the list
			if (tasks.length != 0) {
				//New DOM Nodes
				markup += '<h2>' + listName + '</h2>' + '<ul class="' + listName + '">' + ui.lists.drawTasks(tasks) + '</ul>'
			}						
		}
		$tasks.append(markup)
	}

	//All Can't be sorted
	else if (ui.session.selected == 'all') {
		return true

	// Show Add tasks to logbook
	} else if (ui.session.selected == 'logbook') {
		var loggedTasks = filter([], 'logged').length
		if(loggedTasks > 0) {
			$tasks.find('h2').after('<button id="updateLogbook" class="button">Move '+ filter([], 'logged').length +' completed tasks to the Logbook</button>')
		}
	}	

	setTimeout(function() {

		$tasks.find('ul').sortable({
			placeholder: "placeholder",
			distance: 20,
			appendTo: 'body',
			items: 'li',
			scroll: false,
			forceHelperSize: false,
			connectWith: $tasks.find('ul'),
			cursorAt: {
				top: 15,
				left: 30
			},
			helper: function (e, el) {
				var name = $(el).find('.content').html(),
					$temp = $('body')
						.append('<span class="temp-helper" style="display: none; font-size: 13px; font-weight: bold;">' + name + '</span>')
						.find('.temp-helper'),
					width = $temp.width()
				$temp.remove()
			
				var $el = $(el).find('.content').clone()
				$el.width(width)
				$el.addClass('tasks')
				return $el
			},
			stop: function (event, elem) {
				ui.sortStop(event, elem)
			}
		});


	}, 100)

	return true
})

// List edit button
$sidebar.on('click', '.edit', function() {
	var $this = $(this)
	if(!$this.hasClass('open')) {
		$this.parent().find('.name').dblclick()
	} else {
		$this.removeClass('open')
	}
})

// Doubleclick list name to edit
$sidebar.on('dblclick', '.name', function() {
	var $this = $(this).parent()
	if($this.closest('ul').attr('id') == 'lists') {
		var name = $(this).text()
		$(this).after('<input type="text" value="' + name + '" placeholder="Enter the list name">').next().focus().prev().remove()
		$this.find('.edit').addClass('open')
	}
})

// Turn off edit mode if input loses focus
$sidebar.on('blur', 'input', function() {

	var $input = $(this),
		$this = $(this).parent(),
		model = {
			name: $input.val(),
			id: $this.attr('id').substr(1).toNum()
		}

	$input.after('<span class="name">' + model.name + '</span>').remove()
	core.storage.lists.items[model.id].name = model.name
	core.storage.save([['lists', model.id, 'name']])

})

// Deleting a task
$sidebar.on('click', '.delete', function() {
	var $this = $(this).parent(),
		model = {
			id: $this.attr('id').substr(1).toNum()
		}
	// Delete list
	core.list(model.id).delete()
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


// TASKS
// -----

$tasks.on('collapse', 'li', function() {
					
	// Convert tags
	var $content = $(this).find('.content'),
		text = $content.text()
	$content.html(hashTag(text))

	// Special Checkboxes for Scheduled
	if (ui && ui.session.selected == 'scheduled') {
		$(this).find('.checkbox').addClass(core.storage.tasks[this.model.get('id')].type);
	}
		
})			

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
})

// Completing a task
$tasks.on('click', '.checkbox', function() {

	var $this = $(this).closest('li'),
		model = {
			id: $this.attr('data-id').toNum()
		}

	// Doesn't work in Logbook
	if(ui.session.selected != 'logbook' && ui.session.selected != 'scheduled') {

		//Changes Appearance
		$this.toggleClass('checked')

		//Moves it around for real.
		if($this.hasClass('checked')) {
			core.task(model.id).move('completed')
		} else {
			core.task(model.id).move(core.storage.tasks[model.id].list)
		}

		// Update count
		ui.lists.update().count()

	}
})

// Clicking a tag
$tasks.on('click', '.tag', function() {

	// Get tag name
	var tag = $(this).text();
	// Go to All Tasks list
	$('#Lall .name').trigger('click')
	// Run search - We should give the searchbox an ID
	$search.val(tag).trigger('keyup')
	
})

// Expanding a task
$tasks.on('dblclick', 'li', function(e) {

	var $this = $(this),
		id = $this.attr('data-id').toNum()
		model = core.storage.tasks[id]

	//No event handler things in input or selected.
	if (e.target.nodeName == 'INPUT' || e.target.nodeName == 'TEXTAREA' || e.target.nodeName == 'BUTTON' || $(e.target).hasClass('checkbox')) {
		return
	}

	//Checked Tasks
	var logged = 'checkbox ' + model.priority, checked = null
	if (core.storage.tasks[id].logged) checked = 'checked'
	
	//Checks if it's expanded & if it isn't expand it.
	if (!$this.hasClass('expanded')) {
	
		/* EXPANDING */

		var markup = Mustache.to_html(templates.task.expanded, {
			id: id,
			checked: checked,
			content: model.content,
			notes: model.notes,
			date: model.date,
			extra: core.date(model.date).getDaysLeft()[0],
			priority: model.priority,
			// Because of Translated Version
			i18n_priority: $l._(model.priority),
			logged: logged
		})

		$this
			.html(markup)
			.addClass('expanded')
			.height($this.height() + $this.removeClass('selected').children('div').children('.hidden').show(0).height())
			.trigger('expand')
			.find('input.content').focus()

	} else {

		/* COLLAPSING */

		$this.removeClass('expanded').css('height', '')

		//So data gets saved.
		$this.find('input, textarea').blur()
		
		var orig = $this.prev().attr('data-id')

		setTimeout(function() {

			$this.remove()
			
			var markup = ui.lists.drawTasks([id])

			//If it's the first task in a list, .prev won't work
			if (orig == undefined) {
				if (ui.session.selected == 'all' || ui.session.selected == 'scheduled' || ui.session.selected == 'logbook') {
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
			
		}, 150)
	}
})

$tasks.on('expand', 'li', function() {

	var $this = $(this),
		id = $this.attr('data-id').toNum(),
		model = core.storage.tasks[id]

	//Sets the localized date =D
	if (ui) {
		if (ui.session.selected != 'scheduled' && model.date) {
			$this.find('.date').attr('placeholder', $l._('dueDate')).datepicker().datepicker('setDate', new Date(model.date))
		} else if (ui.session.selected != 'scheduled') {
			$this.find('.date').attr('placeholder', $l._('dueDate')).datepicker()
		} else {
			$this.find('.date').replaceWith('<button class="date">' + $l._('schedule') + '</button>');
			$this.find('.date').click(function() {
				$('#scheduledDialog .inner').fadeToggle(150).attr('data-type', id);
				$('#scheduledDialog').toggle(0);
				plugin.scheduled.ui.init('edit');
			});
		}

		//Sets the Placeholder - I'm lazy. TODO: Fix this
		$this.find('textarea').attr('placeholder', $l._('notes'));

	}
	//Focus correct input
	var $input = $this.find('input[data-bind=content]')
	setTimeout(function() {
		$input.focus()
	}, 150);
})

// Content
$tasks.on('change', 'li input.content', function() {
	var id = $(this).closest('li').attr('data-id').toNum()
	core.storage.tasks[id].content = $(this).val()
	core.storage.save([['tasks', id, 'content']])
})

// Date
$tasks.on('change', '.date', function() {
	var $this = $(this).closest('li'),
		id = $this.attr('data-id').toNum()
	core.storage.tasks[id].date = $(this).datepicker("getDate").getTime()
	core.storage.save([['tasks', id, 'date']])
})

// Priority
$tasks.on('click', '.priority', function() {
	var $this = $(this).closest('li'),
		id = $this.attr('data-id').toNum(),
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
	var id = id = $(this).closest('li').attr('data-id').toNum()
	core.storage.tasks[id].notes = $(this).val()
	core.storage.save([['tasks', id, 'notes']])
})



// BUTTONS
// -------

// Updates the logbook with an awesome animation
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
		loadNew()
	}	
})


// Adding a list
$sidebar.on('click', '.listAddBTN', function() {
	var listId = core.list().add($l._('nlist'))
	$lists.append(ui.lists.draw(listId))
	// Edit List Name
	$('#L' + listId).droppable(ui.lists.dropOptions).find('.name').dblclick()
})


// Adding a task
$panel.left.on('click', 'button.add', function() {
	var list = ui.session.selected
	if (list != 'all' && list != 'logbook' && list != 'scheduled') {
		//Adds a task with the core
		var taskId = core.task().add($l._('ntask'), list),
			markup = ui.lists.drawSingleTask(taskId)

		$tasks.find('ul').first().prepend(markup)

		//Collapses Task
		$('.expanded').dblclick()

		//Expands Task
		$('#tasks ul li[data-id=' + taskId + ']').dblclick()
		
		// Update list count
		ui.lists.update().count()

	} else if (list == 'scheduled') {
		//No other way to do this?
		plugin.scheduled.ui.add()
	}
})


// Deleting a task
$panel.left.on('click', 'button.delete', function() {
	var $selected = $tasks.find('.selected'),
		lists = {}

	// Deletes from CLI
	$selected.each(function() {
		var taskId = $(this).attr('data-id').toNum()
		core.task(taskId).move('trash')
	})
	
	// Update list count
	ui.lists.update().count()
	
	// Remove from DOM			
	$selected.remove()
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

//This is the best plugin system in the world.
var plugin = {
	add: function(fn) {
		fn();
	},
	load: function() {
		//Define Plugins in here
		// $('body').append('<script src=js/plugins.js></script>')
	}
}

// PLUGINS
function hashTag(q) {
	var hashTag = new RegExp("\\s#([^ ]*)", "ig");
	return q.replace(hashTag, ' <span class="tag">#$1</span>');
}

String.prototype.toNum = function () {
	var x = parseInt(this, 10);
	if (x > -100) {
		return x;
	} else {
		return this.toString();
	}
}