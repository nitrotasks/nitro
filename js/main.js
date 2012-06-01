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

//When everything is ready
$(document).ready(function() {
	//Cache Selectors
	ui.initLoad();
	ui.reload();
});

var ui = {
	initLoad: function() {
		//Buttons
		$('#smartlists').html('<h2>Focus</h2><ul></ul>');
		ui.lists.draw('today');
		ui.lists.draw('next');
		ui.lists.draw('logbook');
		ui.lists.draw('all');

		$$.document.append(ui.buttons.taskAddBTN, $('#tasks .panel'));
		$$.document.append(ui.buttons.taskDeleteBTN, $('#tasks .panel'));

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

				$('#content').trigger('resize');
			}
		});
	},
	session: {
		selected: 'today'
	},
	reload: function() {
		//Populates Template
		$('#lists').html('<h2>Lists</h2><ul></ul>');
		$$.document.append(ui.buttons.listAddBTN, $('#lists h2'));
		for (var i=0; i<core.storage.lists.order.length; i++) {
			ui.lists.draw(core.storage.lists.order[i]);
		}
		//Simulates Click on selected list
		$('#L' + ui.session.selected).click();
	},
	lists: {
		//Draws a list to the DOM
		draw: function(listId) {
			if (typeof(listId) == 'string') {
					
				switch(listId) {
					case 'all':
						var obj = $$(ui.templates.listTemplate, {id: listId, name: listId, count: core.list('all').populate().length});
						break;
					default:
						var obj = $$(ui.templates.listTemplate, {id: listId, name: listId});
						break;
				}
				
				$$.document.append(obj, $('#smartlists ul'));
			} else {
				var list = core.storage.lists.items[listId];
				var obj = $$(ui.templates.listTemplate, {id: listId, name: list.name, count: list.order.length});
				$$.document.append(obj, $('#lists ul'));
			}
			$(obj.view.$()).attr('id', 'L' + obj.model.get('id'))
		},
		update: function(listId) {
			return {
				count: function() {
					// Update specified list
					if(listId) {
						var list = core.storage.lists.items[listId];			
						$('#L' + listId).find('.count').html(list.order.length);
					}
										
					// Update the All Tasks list				
					$('#Lall').find('.count').html(core.list('all').populate().length);
				}
			}
		}
	},
	sortStop: function() {
		//Saves order of tasks in list
		var taskOrder = []
		$('#tasks li').map(function () {

			//If not checked, add to list
			if (!$(this).children('.checkbox').hasClass('checked')) {
				taskOrder.push(parseInt($(this).removeClass('expanded').attr('class')));
			}
		});
		//Saves to order
		core.storage.lists.items[ui.session.selected].order = taskOrder;
		core.storage.save();
	},
	templates: {
		listTemplate: $$({}, '<li><span class="name" data-bind="name"></span><span class="count" data-bind="count"></span><button class="delete">Delete</button></li>', {
			'click &': function() {
				//Selected List
				$('#sidebar .selected').removeClass('selected');
				$(this.view.$()).addClass('selected');
				ui.session.selected = this.model.get('id');

				//Gets list id & populates
				$('#tasks .content').empty().html('<h2>' + this.model.get('name') + '</h2><ul></ul>')
				var tasks = core.list(this.model.get('id')).populate();

				//Loops and adds each task to a tmp view
				var tmpView = $$({});
				for (var i=0; i<tasks.length; i++) {
					//Makes it nice
					var data = core.storage.tasks[tasks[i]];

					//Checked Tasks
					var logged = 'checkbox';
					if (data.list == 'logbook') {
						logged += ' checked';
					}

					tmpView.append(
						$$(ui.templates.task.compressed, {
							id: tasks[i],
							content: data.content,
							notes: data.notes,
							date: data.date,
							priority: data.priority,
							logged: logged
						})
					);
				}
				$$.document.append(tmpView, $('#tasks ul'));
				$('#tasks ul').sortable({
					placeholder: "placeholder",
					distance: 20,
					appendTo: 'body',
					items: 'li',
					scroll: false,
					connectWith: $('#tasks ul'),
					stop: function (event, elem) {

						ui.sortStop(event, elem);
					}
				});
			},
			'dblclick .name': function() {
				var name = prompt("New name", this.model.get('name'));
				if(name) {
					core.storage.lists.items[this.model.get('id')].name = name;
					this.model.set({name: name});
					core.storage.save();
				}
			},
			'click .delete': function() {
				var id = this.model.get('id');
				
				// Delete list
				core.list(id).delete();
				
				// Update DOM				
				$(this.view.$()).remove();
				
				// Update List count
				ui.lists.update().count();
			}
		}),

		task: {

			compressed: $$({}, '<li data-bind="class=id"><div data-bind="class=logged"></div><div data-bind="content" class="content"></div></li>', {

				'click &': function(e) {

					//No event handler things in input or selected.
					if (e.target.nodeName == 'INPUT' || e.target.nodeName == 'TEXTAREA' || e.target.nodeName == 'BUTTON' || $(e.target).hasClass('checkbox')) {
						return;
					}

					if (e.metaKey) {
						$(this.view.$()).toggleClass('selected');
					} else {
						$('#tasks .selected').removeClass('selected');
						$(this.view.$()).addClass('selected');
					}
				},

				'click .checkbox': function(e) {
					//Changes Appearance
					$(e.currentTarget).toggleClass('checked')

					//Moves it around for real.
					if($(e.currentTarget).hasClass('checked')) {
						core.task(this.model.get('id')).move('logbook');
					} else {
						core.task(this.model.get('id')).move(ui.session.selected);
					}
				},

				'dblclick &': function(e) {
					//Cache the selector
					var view = $(this.view.$());

					//No event handler things in input or selected.
					if (e.target.nodeName == 'INPUT' || e.target.nodeName == 'TEXTAREA' || e.target.nodeName == 'BUTTON' || $(e.target).hasClass('checkbox')) {
						return;
					}
					
					//Checks if it's expanded & if it isn't expand it.
					if (!view.hasClass('expanded')) {
						//Clear out the Dom
						view.empty();
						//Checked Tasks
						var logged = 'checkbox';
						if (core.storage.tasks[this.model.get('id')].list == 'logbook') {
							logged += ' checked';
						}

						$$.document.append(
							$$(ui.templates.task.expand, 
								{id: this.model.get('id'),
								content: this.model.get('content'),
								notes: this.model.get('notes'),
								date: this.model.get('date'),
								priority: this.model.get('priority'),
								logged: logged
							}), view);

						view.addClass('expanded').height(view.height() + view.removeClass('selected').children('div').children('.hidden').show(0).height());

					} else {
						//Collapses
						view.removeClass('expanded').css('height', '');
						var id = this.model.get('id');

						setTimeout(function() {
							var orig = view.prev()
							view.remove();
							var data = core.storage.tasks[id];

							//Checked Tasks
							var logged = 'checkbox';
							if (data.list == 'logbook') {
								logged += ' checked';
							}

							var model = $$(ui.templates.task.compressed, {
								id: id,
								content: data.content,
								notes: data.notes,
								date: data.date,
								priority: data.priority,
								logged: logged
							})

							//If it's the first task in a list, .prev won't work
							if (orig.length == 0) {
								$$.document.prepend(model, $('#tasks ul'));
							} else {
								$$.document.after(model, orig);
							}
							
						}, 150);
					}
				}
			}),

			expand: $$({}, '<div><div data-bind="class=logged"></div><input data-bind="content" type="text"><button data-bind="priority"></button><input placeholder="Due Date" type="text" class="date"><div class="hidden"><textarea data-bind="notes"></textarea></div></div>', {

				'create': function() {
					//Sets the localized date =D
					$(this.view.$()).children('.date').datepicker().datepicker('setDate', new Date(this.model.get('date')));
				},

				'change input[data-bind=content]': function() {
					core.storage.tasks[this.model.get('id')].content = this.model.get('content');
					core.storage.save();
				},

				'change .date': function() {
					var view = $(this.view.$());
					core.storage.tasks[this.model.get('id')].date = view.children('.date').datepicker("getDate").getTime();
					core.storage.save();
				},

				'click button[data-bind=priority]': function() {
					var p = this.model.get('priority');

					if (p == 'none') {
						this.model.set({priority: 'low'});
					} else if (p == 'low') {
						this.model.set({priority: 'medium'});
					} else if (p == 'medium') {
						this.model.set({priority: 'high'});
					} else if (p == 'high') {
						this.model.set({priority: 'none'});
					}
				},

				'change textarea[data-bind=notes]': function() {
					core.storage.tasks[this.model.get('id')].notes = this.model.get('notes');
					core.storage.save();
				}
			})
		}
	}, 
	buttons: {
		//Buttons
		listAddBTN: $$({name: 'Add List'}, '<button data-bind="name"/>', {
			'click &': function() {
				//Adds a list with the core
				var listId = core.list().add('New List');
				ui.lists.draw(listId);

				//Selects List
				$('#L' + listId).click();
			}
		}),
		taskAddBTN: $$({name: 'Add'}, '<button data-bind="name"/>', {
			'click &': function() {
				var list = ui.session.selected;
				if (list != 'all') {
					//Adds a task with the core
					var taskId = core.task().add('New Task', list);
					var data = core.storage.tasks[taskId];

					//Checked Tasks
					var logged = 'checkbox';
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
						}), $('#tasks ul')
					);
					
					// Update list count
					ui.lists.update(list).count();
				}		
			}
		}),
		taskDeleteBTN: $$({name: 'Delete'}, '<button data-bind="name"/>', {
			'click &': function() {
				var selected = $('#tasks .selected'),
					lists = {};

				// Deletes from CLI
				for(var i = 0; i < selected.length; i++) {
					var taskId = Number($(selected[i]).removeClass('selected').attr('class'));
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
		})
	}
}
//This is the best plugin system in the world.
var plugin = {
	add: function(fn) {
		fn();
	}
}