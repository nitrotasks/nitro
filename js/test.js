//Session Vars
sessionStorage.setItem('selected', sessionStorage.getItem('selected') || 'today');

//Templates



//When everything is ready
$(document).ready(function() {
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

		$$.document.append(ui.buttons.taskAddBTN, $('#panel'));

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
	reload: function() {
		//Populates Template
		$('#lists').html('<h2>Lists</h2><ul></ul>');
		$$.document.append(ui.buttons.listAddBTN, $('#lists h2'));
		for (var i=0; i<core.storage.lists.order.length; i++) {
			ui.lists.draw(core.storage.lists.order[i]);
		}
		//Simulates Click on selected list
		$('#L' + sessionStorage.getItem('selected')).click();
	},
	tasks: {
		//Draws a task to the DOM.
		draw: function(taskId) {
			var obj = $$(ui.templates.taskTemplate, {id: taskId, content: core.storage.tasks[taskId].content});
			$$.document.append(obj, $('#tasks ul'));
		}
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
		taskTemplate: $$({}, '<li data-bind="content"></li>'),
		listTemplate: $$({}, '<li data-bind="name"></li>', {
			'click &': function() {
				//Selected List
				sessionStorage.setItem('selected', this.model.get('id'));
				$('.selected').removeClass('selected');
				$(this.view.$()).addClass('selected');

				//Gets list id & populates
				$('#tasks').html('<div><h2>' + this.model.get('name') + '</h2><ul></ul></div>')
				var tasks = core.list(this.model.get('id')).populate();

				//Loops and adds each task to the dom
				for (var i=0; i<tasks.length; i++) {
					ui.tasks.draw(tasks[i]);
				} 
			}
		})
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
		taskAddBTN: $$({name: 'Add Task'}, '<button data-bind="name"/>', {
			'click &': function() {
				if (sessionStorage.getItem('selected') != 'all') {
					//Adds a task with the core
					var taskId = core.task().add('New Task', sessionStorage.getItem('selected'));
					ui.tasks.draw(taskId);
				}		
			}
		})
	}
}
