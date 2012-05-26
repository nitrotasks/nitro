//Session Vars
sessionStorage.setItem('selected', sessionStorage.getItem('selected') || 'today');

//Templates
var taskTemplate = $$({}, '<li data-bind="content"></li>');
var listTemplate = $$({}, '<li data-bind="name"></li>', {
	'click &': function() {
		//Selected List
		sessionStorage.setItem('selected', this.model.get('id'));
		$('.selected').removeClass('selected');
		$(this.view.$()).addClass('selected');

		//Gets list id & populates
		$('#tasks').html('List<ul></ul>')
		var tasks = core.list(this.model.get('id')).populate();

		//Loops and adds each task to the dom
		for (var i=0; i<tasks.length; i++) {
			ui.tasks.draw(tasks[i]);
		} 
	}
});
//Buttons
var listAddBTN = $$({name: 'Add List'}, '<button data-bind="name"/>', {
	'click &': function() {

		//Adds a list with the core
		var listId = core.list().add('New List');
		ui.lists.draw(listId);
	}
});
var taskAddBTN = $$({name: 'Add Task'}, '<button data-bind="name"/>', {
	'click &': function() {

		//Adds a task with the core
		var taskId = core.task().add('New Task', sessionStorage.getItem('selected'));
		ui.tasks.draw(taskId);
	}
});

//When everything is ready
$(document).ready(function() {
	$$.document.append(taskAddBTN);
	$$.document.append(listAddBTN);

	ui.reload();
})

var ui = {
	reload: function() {
		//Populates Template
		$('#lists').html('<ul></ul>');
		for (var i=0; i<core.storage.lists.order.length; i++) {
			ui.lists.draw(core.storage.lists.order[i]);
		}
		//Simulates Click on selected list
		$('#L' + sessionStorage.getItem('selected')).click();
	},
	tasks: {
		//Draws a task to the DOM.
		draw: function(taskId) {
			var obj = $$(taskTemplate, {id: taskId, content: core.storage.tasks[taskId].content});
			$$.document.append(obj, $('#tasks ul'));
		}
	},
	lists: {
		//Draws a list to the DOM
		draw: function(listId) {
			var obj = $$(listTemplate, {id: listId, name: core.storage.lists.items[listId].name});
			$$.document.append(obj, $('#lists ul'));
			$(obj.view.$()).attr('id', 'L' + obj.model.get('id'))
		}
	}
}
