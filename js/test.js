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
	//Cache Selectors/Volumes/Files/George/Documents/Github/Nitro/css/style.css
	ui.initLoad();
	ui.reload();
});

var ui = {
	initLoad: function() {
		//Buttons
		$('#smartlists').html('<h2>Focus</h2><ul></ul>');
		ui.lists.draw('today');
		ui.lists.draw('next');
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
				var obj = $$(ui.templates.listTemplate, {id: listId, name: listId});
				$$.document.append(obj, $('#smartlists ul'));
			} else {
				var obj = $$(ui.templates.listTemplate, {id: listId, name: core.storage.lists.items[listId].name});
				$$.document.append(obj, $('#lists ul'));
			}
			$(obj.view.$()).attr('id', 'L' + obj.model.get('id'))
		}
	},
	templates: {
		listTemplate: $$({}, '<li data-bind="name"></li>', {
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

					//Logged Tasks
					var logged = undefined;
					if (data.list == 'logbook') {
						logged = 'checked';
					};

					//Add to View
					tmpView.prepend($$(ui.templates.task.compressed, {id: tasks[i], content: data.content, notes: data.notes, date: data.date, priority: data.priority, logged: logged}));
				}
				$$.document.append(tmpView, $('#tasks ul'));
			}
		}),

		task: {
			compressed: $$({}, '<li data-bind="class=id"><input data-bind="checked=logged" type="checkbox"><div data-bind="content" class="content"></div></li>', {

				'click &': function(e) {

					//No event handler things in input or selected.
					if (e.target.nodeName == 'INPUT' || e.target.nodeName == 'TEXTAREA' || e.target.nodeName == 'BUTTON') {
						return;
					}

					if (e.metaKey) {
						$(this.view.$()).toggleClass('selected');
					} else {
						$('#tasks .selected').removeClass('selected');
						$(this.view.$()).addClass('selected');
					}
				},

				'click input[type=checkbox]': function(e) {
					if($(e.currentTarget).prop('checked')) {
						core.task(this.model.get('id')).move('logbook');
					} else {
						core.task(this.model.get('id')).move(ui.session.selected);
					}
				},

				'dblclick &': function(e) {
					//Cache the selector
					var view = $(this.view.$());

					//No event handler things in input or selected.
					if (e.target.nodeName == 'INPUT' || e.target.nodeName == 'TEXTAREA' || e.target.nodeName == 'BUTTON') {
						return;
					}
					
					//Checks if it's expanded & if it isn't expand it.
					if (!view.hasClass('expanded')) {
						//Clear out the Dom
						view.empty();
						$$.document.append($$(ui.templates.task.expand, {id: this.model.get('id'), content: this.model.get('content'), notes: this.model.get('notes'), date: this.model.get('date'), priority: this.model.get('priority')}), view);
						view.addClass('expanded').height(view.height() + view.removeClass('selected').children('div').children('.hidden').show(0).height());

					} else {
						//Collapses
						view.removeClass('expanded').css('height', '');
						var id = this.model.get('id');

						setTimeout(function() {
							var orig = view.prev()
							view.remove();

							var data = core.storage.tasks[id];

							//Logged Tasks
							var logged = undefined;
							if (data.list == 'logbook') {
								logged = 'checked';
							};

							var data = $$(ui.templates.task.compressed, {id: id, content: data.content, notes: data.notes, date: data.date, priority: data.priority, logged: logged});

							//If it's the first task in a list, .prev won't work
							if (orig.length == 0) {
								$$.document.prepend(data, $('#tasks ul'));
							} else {
								$$.document.after(data, orig);
							}
							
						}, 150);
					}
				}
			}),

			expand: $$({}, '<div><input type="checkbox"><input data-bind="content" type="text"><button data-bind="priority"></button><input placeholder="Due Date" type="text" data-bind="date"><div class="hidden"><textarea data-bind="notes"></textarea></div></div>', {	

				'change input[data-bind=content]': function() {
					core.storage.tasks[this.model.get('id')].content = this.model.get('content');
					core.storage.save();
				},

				'change input[data-bind=date]': function() {
					core.storage.tasks[this.model.get('id')].date = this.model.get('date');
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
					$$.document.append($$(ui.templates.task.compressed, {id: taskId, content: core.storage.tasks[taskId].content, notes: core.storage.tasks[taskId].notes, date: core.storage.tasks[taskId].date, priority: core.storage.tasks[taskId].priority}), $('#tasks ul'));
				}		
			}
		}),
		taskDeleteBTN: $$({name: 'Delete'}, '<button data-bind="name"/>', {
			'click &': function() {
				var task = $('#tasks .selected');

				//Deletes from CLI & then removes from DOM
				core.task(parseInt(task.removeClass('selected').attr('class'))).move('trash');
				task.remove();
			}
		})
	}
}
