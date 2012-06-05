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

var ui = {
	language: function (data) {
		//Loads Translation Pack in
		$.i18n.setDictionary(data);

		//Nice shorthand Method
		$l = $.i18n;

		$(document).ready(function() {
			ui.initLoad();
			ui.reload();
		});

		$('#tasks > .tasksContent').click(function(e) { 
			if(e.target.nodeName == 'UL' || e.target.nodeName == 'H2' || e.target.className == 'tasksContent') {
				$('.expanded').dblclick();
				$('#tasks .selected').removeClass('selected');
			}
		})
	},
	initLoad: function() {
		//Buttons
		$('#smartlists').html('\
			<h2>' + $l._('focus') + '\
			</h2>\
			<ul></ul>');
		ui.lists.draw('today');
		ui.lists.draw('next');
		ui.lists.draw('logbook');
		ui.lists.draw('all');

		$$.document.append($$(ui.buttons.taskAddBTN, {name: $l._('addbtn')}), $('#tasks .panel .left'));
		$$.document.append($$(ui.buttons.taskDeleteBTN, {name: $l._('deletebtn')}), $('#tasks .panel .left'));

		//Loads Selected List
		$('#L' + ui.session.selected + ' .name').click();

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
				$('.tasksContent').height(height - $('.panel').height())
				$('#lists ul').height(height - $('#lists ul').position().top)
			}
		});

		//I can't trigger it?
		$('.tasksContent').height(height - $('.panel').height())

		//Collapse Lists
		$('#lists').html('<h2>' + $l._('lists') + '</h2><ul></ul>');
		$$.document.append($$(ui.buttons.toggleFocus), $('#smartlists h2'));
		$$.document.append($$(ui.buttons.toggleFocus), $('#lists h2'));
		$$.document.append(ui.buttons.listAddBTN, $('#lists h2'));
	},
	session: {
		selected: 'today'
	},
	reload: function() {
		//Populates Template
		$('#lists ul').empty();
		
		
		for (var i=0; i<core.storage.lists.order.length; i++) {
			ui.lists.draw(core.storage.lists.order[i]);
		}

		//Sortable Lists 
		$('#lists ul').sortable({
			containment: 'parent',
			axis: 'y',
			distance: 20,
			placeholder: 'listPlaceholder',
			helper: 'clone',
			stop: function() {
				//Saves Everything, including order
				var listOrder = [];

				//Loops through lists & adds the to an array
				$('#lists ul').children().map(function () {
					listOrder.push($(this).attr('id').substr(1).toNum());
				});

				//Saves
				core.storage.lists.order = listOrder;
				core.storage.save([['list-order', null, null]]);
			}
		}).height($(window).height() - $('#lists ul').position().top);

		//Droppable
		$('#sidebar ul li').droppable(ui.lists.dropOptions);

		//Update Counts
		ui.lists.update().count();
	},
	lists: {
		//Draws a list to the DOM
		draw: function(listId) {
			if (typeof(listId) == 'string') {
					
				switch(listId) {
					case 'all':
						var obj = $$(ui.templates.listTemplate, {id: listId, name: $l._(listId), count: core.list('all').populate().length});
						break;
					case 'logbook':
						var obj = $$(ui.templates.listTemplate, {id: listId, name: $l._(listId), count: core.list('logbook').populate().length});
						break;
					default:
						var obj = $$(ui.templates.listTemplate, {id: listId, name: $l._(listId)});
						break;
				}
				
				$$.document.append(obj, $('#smartlists ul'));
			} else {
				var list = core.storage.lists.items[listId];
				var obj = $$(ui.templates.listTemplate, {id: listId, name: list.name, count: "0"});
				$$.document.append(obj, $('#lists ul'));
			}
			obj.view.$().attr('id', 'L' + obj.model.get('id'))
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

					// Update the Logbook
					$('#Llogbook').find('.count').html(core.list('logbook').populate().length);
							
					// Update the All Tasks list				
					$('#Lall').find('.count').html(core.list('all').populate().length);

					// Set Title
					var todayTotal = core.storage.lists.items['today'].order.length;
					todayTotal > 0 ? document.title = todayTotal + " - Nitro" : document.title = "Nitro";
				}
			}
		},
		dropOptions: {
			hoverClass: "dragHover",
			accept: "#tasks li",
			drop: function (event, uix) {
				var listId = $(this).attr('id').substr(1).toNum(),
					taskId = $(uix.draggable).attr('data-id').toNum();	

				//Moves Task
				core.task(taskId).move(listId);

				console.log(taskId)

				//Removes and Saves
				$(uix.draggable).remove();

				//If we're in the next list, we may as well reload (because I'm fucking lazy)
				if (ui.session.selected == 'next') {
					$('#Lnext .name').click();
				}

				//Update Counts - why on a delay?
				setTimeout(function() {
					ui.lists.update().count();
				}, 100);
			}
		}

	},
	sortStop: function() {
		//Saves order of tasks in list
		var taskOrder = []
		$('#tasks ul').first().children('li').map(function () {
			var id = Number($(this).attr('data-id'));

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
					var id = Number($(this).attr('data-id'));

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
	},
	templates: {
		listTemplate: $$({}, '\
			<li>\
				<span class="name" data-bind="name"></span>\
				<button class="edit">E</button>\
				<button class="delete">X</button>\
				<span class="count" data-bind="count"></span>\
			</li>', {
			
			'click .name, .count': function() {
				
				var listId = this.model.get('id');
			
				//Selected List
				$('#sidebar .selected').removeClass('selected');
				this.view.$().addClass('selected');
				ui.session.selected = listId;

				//Gets list id & populates
				$('#tasks .tasksContent').empty().html('<h2>' + this.model.get('name') + '</h2>')
				var tasks = core.list(listId).populate();

				//Drams Task then appends it to a tmpview
				var drawTask = function(i) {
					//Makes it nice
					var data = core.storage.tasks[tasks[i]];

					//Checked Tasks
					var logged = 'checkbox ' + data.priority;
					if (data.logged) {
						logged += ' checked';
					}
					
					// Extra details					
					var extraDetails = "";					
					switch(ui.session.selected) {
						case 'logbook':
							extraDetails += core.date(data.logged).getDate();
							break;
						case 'all':
							extraDetails += core.storage.lists.items[data.list].name;
							break;
						default:
							extraDetails += core.date(data.date).getDaysLeft()[0];
					}
					
					tmpView.append(
						$$(ui.templates.task.compressed, {
							id: tasks[i],
							content: data.content,
							notes: data.notes,
							date: data.date,
							extra: extraDetails,
							priority: data.priority,
							logged: logged
						})
					);
				}

				//Loops and adds each task to a tmp view
				var tmpView = $$({}, '<ul></ul>');
				for (var i=0; i<tasks.length; i++) {
					drawTask(i);
				}
				$$.document.append(tmpView, $('#tasks .tasksContent'));

				if (ui.session.selected == 'next') {
					for (var l=0; l<core.storage.lists.order.length; l++) {
						//Defines Stuff for easier access
						var list = core.storage.lists.order[l];
						var tasks = core.list(list).populate();

						//Makes sure there is something in the list
						if (tasks.length != 0) {
							//New DOM Node
							$('#tasks .tasksContent').append('<h2>' + core.storage.lists.items[list].name + '</h2>');

							//Loops and puts the tasks in
							var tmpView = $$({list: list}, '<ul data-bind="class=list"></ul>');
							for (var i=0; i<tasks.length; i++) {
								drawTask(i);
							}
							$$.document.append(tmpView, $('#tasks .tasksContent'));
						}						
					}
				}

				//All Can't be sorted
				if (ui.session.selected == 'all') {
					return true;
				}

				$('#tasks ul').sortable({
					placeholder: "placeholder",
					distance: 20,
					appendTo: 'body',
					items: 'li',
					scroll: false,
					forceHelperSize: false,
					connectWith: $('#tasks ul'),
					cursorAt: {
						top: 8,
						left: 30
					},
					helper: function (e, el) {

						var name = $(el).html(),
							$temp = $('body')
								.append('<span class="temp-helper" style="display: none; font-size: 13px; font-weight: bold;">' + name + '</span>')
								.find('.temp-helper'),
							width = $temp.width();
						$temp.remove();
					
						var $el = $(el).clone();
						$el.width(width);
						$el.addClass('tasks');
						return $el;
					},
					stop: function (event, elem) {

						ui.sortStop(event, elem);
					}
				});

				return true;
			},
			'click .edit': function() {
				var $edit = this.view.$('.edit');
				if(!$edit.hasClass('open')) {
					this.view.$('.name').dblclick();
					$edit.addClass('open').html('#');
				} else {
					$edit.removeClass('open').html('E');
				}
			},
			'dblclick .name': function() {
				if(this.view.$().closest('div').attr('id') == 'lists') {
					var name = this.model.get('name');
					this.view.$('.name').after('<input type="text" value="' + name + '" placeholder="Enter the list name">').next().focus().prev().remove();
					this.view.$('.edit').addClass('open');
				}
			},
			'blur input': function() {
				var $input = this.view.$('input'),
					name = $input.val(),
					id = this.model.get('id');
				
				$input.after('<span class="name" data-bind="name">' + name + '</span>').remove();
				this.model.set({name: name});
				core.storage.lists.items[id].name = name;
				
				core.storage.save([['lists', id, 'name']]);
			},
			'click .delete': function() {
				var id = this.model.get('id');
				
				// Delete list
				core.list(id).delete();
				
				// Update DOM				
				this.view.$().remove();
				
				// Update List count
				ui.lists.update().count();
			}
		}),

		task: {

			compressed: $$({}, '\
				<li data-bind="data-id=id">\
					<div class="boxhelp">\
						<div data-bind="class=logged"></div>\
						<div data-bind="content" class="content"></div>\
						<div data-bind="extra" class="extra"></div>\
					</div>\
				</li>', {
				
				
				'click &': function(e) {

					//No event handler things in input or selected.
					if (e.target.nodeName == 'INPUT' || e.target.nodeName == 'TEXTAREA' || e.target.nodeName == 'BUTTON' || $(e.target).hasClass('checkbox')) {
						return;
					}

					if (e.metaKey || e.ctrlKey) {
						this.view.$().toggleClass('selected');
					} else {
						$('#tasks .selected').removeClass('selected');
						this.view.$().addClass('selected');
					}
				},

				'click .checkbox': function(e) {
					//Changes Appearance
					$(e.currentTarget).toggleClass('checked');

					var id = this.model.get('id');

					//Moves it around for real.
					if($(e.currentTarget).hasClass('checked')) {
						core.task(id).move('logbook');
					} else {
						core.task(id).move(core.storage.tasks[id].list);
					}

					// Update count
					ui.lists.update().count();
				},

				'dblclick &': function(e) {
					//Cache the selector
					var view = this.view.$();

					//No event handler things in input or selected.
					if (e.target.nodeName == 'INPUT' || e.target.nodeName == 'TEXTAREA' || e.target.nodeName == 'BUTTON' || $(e.target).hasClass('checkbox')) {
						return;
					}
					
					//Checks if it's expanded & if it isn't expand it.
					if (!view.hasClass('expanded')) {
					
						/* EXPANDING */
						
						//Clear out the Dom
						view.empty();
						
						//Checked Tasks
						var logged = 'checkbox ' + this.model.get('priority');
						if (core.storage.tasks[this.model.get('id')].list == 'logbook') {
							logged += ' checked';
						}

						$$.document.append(
							$$(ui.templates.task.expand, 
								{id: this.model.get('id'),
								content: this.model.get('content'),
								notes: this.model.get('notes'),
								date: this.model.get('date'),
								extra: core.date(this.model.get('date')).getDaysLeft()[0],
								//Because of Translated Version
								priority: this.model.get('priority'),
								i18n_priority: $l._(this.model.get('priority')),
								logged: logged
							}), view);

						view.addClass('expanded').height(view.height() + view.removeClass('selected').children('div').children('.hidden').show(0).height());

					} else {
					
						/* COLLAPSING */
						
						view.removeClass('expanded').css('height', '');
						var id = this.model.get('id');

						//So data gets saved.
						view.children().children().blur();
						
						var orig = view.prev();

						setTimeout(function() {
							view.remove();
							var data = core.storage.tasks[id];

							//Checked Tasks
							var logged = 'checkbox ' + data.priority;
							if (data.list == 'logbook') {
								logged += ' checked';
							}
							
							// Extra details					
							var extraDetails = "";					
							switch(ui.session.selected) {
								case 'logbook':
									extraDetails += core.date(data.logged).getDate();
									break;
								case 'all':
									extraDetails += core.storage.lists.items[data.list].name;
									break;
								default:
									extraDetails += core.date(data.date).getDaysLeft()[0];
							}

							var model = $$(ui.templates.task.compressed, {
								id: id,
								content: data.content,
								notes: data.notes,
								date: data.date,
								extra: extraDetails,
								priority: data.priority,
								logged: logged
							});

							//If it's the first task in a list, .prev won't work
							if (orig.length == 0) {
								
								if (ui.session.selected == 'all' || ui.session.selected == 'scheduled' || ui.session.selected == 'logbook') {
									$$.document.prepend(model, $('#tasks ul'));
								} else if (data.list == ui.session.selected) {
									$$.document.prepend(model, $('#tasks ul').first());
								} else {
									$$.document.prepend(model, $('#tasks ul.' + data.list));
								}
							} else {
							
								$$.document.after(model, orig);
							}
							
						}, 150);
					}
				}
			}),

			expand: $$({}, '\
				<div>\
					<div class="boxhelp">\
						<div data-bind="class=logged"></div>\
						<input data-bind="content" type="text">\
						<button data-bind="i18n_priority, class=priority"></button><input type="text" class="date">\
					</div>\
					<div class="hidden">\
						<textarea data-bind="notes"></textarea>\
					</div>\
				</div>', {

				'create': function() {
					//Sets the localized date =D
					if (ui) {
						if (ui.session.selected != 'scheduled' && this.model.get('date')) {
							this.view.$('.date').attr('placeholder', $l._('dueDate')).datepicker().datepicker('setDate', new Date(this.model.get('date')));	
						} else if (ui.session.selected != 'scheduled') {
							this.view.$('.date').attr('placeholder', $l._('dueDate')).datepicker()
						} else {
							//OH SHIT! A CLICK HANDLER! Well I don't give a fuck.
							var id = this.model.get('id');
							this.view.$('.date').replaceWith('<button class="date">' + $l._('schedule') + '</button>');
							this.view.$('.date').click(function() {
								$('#scheduledDialog .inner').fadeToggle(150).attr('data-type', id);
								$('#scheduledDialog').toggle(0);
								plugin.scheduled.ui.init('edit');
							});
						}

						//Sets the Placeholder - I'm lazy. TODO: Fix this
						this.view.$('textarea').attr('placeholder', $l._('notes'));

					}
					//Focus correct input
					var input = $(this.view.$('input[data-bind=content]'));
					setTimeout(function() {
						input.focus();
					}, 150);
				},

				// Content
				'change input[data-bind=content]': function() {
					var id = this.model.get('id');
					core.storage.tasks[id].content = this.model.get('content');
					core.storage.save([['tasks', id, 'content']]);
				},

				// Date
				'change .date': function() {
					var view = this.view.$(),
						id = this.model.get('id');
					core.storage.tasks[id].date = this.view.$('.date').datepicker("getDate").getTime();
					core.storage.save([['tasks', id, 'date']]);
				},

				// Priority
				'click button[data-bind=i18n_priority, class=priority]': function() {
					var id = this.model.get('id'),
						original = this.model.get('priority'),
						next = original;
					switch(original) {
						case 'none':
							next = "low";
							break;
						case 'low':
							next = "medium";
							break;
						case 'medium':
							next = "high";
							break;
						case 'high':
							next = "none"
							break;
					}
					//Do this first, so the ui feels faster
					this.model.set({priority: next, i18n_priority: $l._(next)});

					//Change Colours of checkbox
					this.view.$('.checkbox').removeClass(original).addClass(next);

					//Saves
					core.storage.tasks[id].priority = next;
					core.storage.save([['tasks', id, 'priority']]);
				},

				// Notes
				'change textarea[data-bind=notes]': function() {
					var id = this.model.get('id');
					core.storage.tasks[id].notes = this.model.get('notes');
					core.storage.save([['tasks', id, 'notes']]);
				}
			})
		}
	}, 
	buttons: {
		//Buttons
		listAddBTN: $$({name: '+'}, '<button data-bind="name"/>', {
			'click &': function() {
				//Adds a list with the core
				var listId = core.list().add($l._('nlist'));
				ui.lists.draw(listId);

				//Selects List
				$('#L' + listId).droppable(ui.lists.dropOptions).children('.name').click();
			}
		}),
		taskAddBTN: $$({}, '<button class="add" data-bind="name"/>', {
			'click &': function() {
				var list = ui.session.selected;
				if (list != 'all' && list != 'logbook' && list != 'scheduled') {
					//Adds a task with the core
					var taskId = core.task().add($l._('ntask'), list);
					var data = core.storage.tasks[taskId];

					//Checked Tasks
					var logged = 'checkbox ' + data.priority;
					if (data.list == 'logbook') {
						logged += ' checked';
					}
					
					// Add to DOM
					$$.document.prepend(
						$$(ui.templates.task.compressed, {
							id: taskId,
							content: data.content,
							notes: data.notes,
							date: data.date,
							priority: data.priority,
							logged: logged
						}), $('#tasks ul').first()
					);

					//Expands Task
					$('#tasks ul li[data-id=' + taskId + ']').dblclick();
					
					// Update list count
					ui.lists.update(list).count();
				} else if (list == 'scheduled') {
					//No other way to do this?
					plugin.scheduled.ui.add();
				}
			}
		}),
		taskDeleteBTN: $$({}, '<button class="delete" data-bind="name"/>', {
			'click &': function() {
				var selected = $('#tasks .selected'),
					lists = {};

				// Deletes from CLI
				for(var i = 0; i < selected.length; i++) {
					var taskId = Number($(selected[i]).attr('data-id'));
					lists[core.storage.tasks[taskId].list] = true;
					
					// Remove task
					core.task(taskId).move('trash');
				}
				
				// Update list count
				for(var key in lists) {
					ui.lists.update(key).count();	
				}
				
				// Remove from DOM			
				selected.remove();
			}
		}),
		toggleFocus: $$({}, '<span class="list-toggle">O</span>', {
			'click &': function() {
				var $h2 = this.view.$().parent(),
					$ul = $h2.next('ul');
					
				// Hack
				$('#lists ul').height('auto');
				$('#lists ul').height($('#lists ul').height() + 2);
					
				if($h2.hasClass('collapsed')) {
					$h2.removeClass('collapsed');
					$ul.slideDown(150, function() {
						height = $(window).height();
						$('#lists ul').height(height - $('#lists ul').position().top);
					});
				} else {
					$ul.slideUp(150, function() {
						$h2.addClass('collapsed');
					});
				}
			}
		})
	}
}
//This is the best plugin system in the world.
var plugin = {
	add: function(fn) {
		fn();
	}
}
// My super awesome function that converts a string to a number
// "421".toNum()  -> 421
// "word".toNum() -> "word"
String.prototype.toNum = function () {
	var x = parseInt(this, 10);
	if (x > -100) {
		return x;
	} else {
		return this.toString();
	}
}