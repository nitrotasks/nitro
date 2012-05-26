//Templates
var taskTemplate = $$({}, '<li data-bind="content"></li>');
var listTemplate = $$({}, '<li data-bind="name"></li>', {
	'click &': function() {
		var id = this.model.get('id');
		$('#tasks').html('List: <span>' + this.model.get('id') + '</span><ul></ul>')

		//Gets list id & populates
		var tasks = core.list(this.model.get('id')).populate();

		//Loops and adds each task to the dom
		for (var i=0; i<tasks.length; i++) {
			console.log(tasks[i])
			ui.tasks.draw(tasks[i]);
		} 
	}
});
//Buttons
var listAddBTN = $$({name: 'Add List'}, '<button data-bind="name"/>', {
	'click &': function() {

		//Adds a list with the core
		var list = core.list().add('New List');

		//Populates Template
		var obj = $$(listTemplate, {id: list, name: core.storage.lists.items[list].name});
		$$.document.append(obj, $('#lists ul'));
	}
});
var taskAddBTN = $$({name: 'Add Task'}, '<button data-bind="name"/>', {
	'click &': function() {

		//Adds a task with the core
		var taskId = core.task().add('New Task', $('#tasks span').html());
		ui.tasks.draw(taskId);
	}
});
$$.document.append(taskAddBTN);
$$.document.append(listAddBTN, $('#lists'));

var ui = {
	tasks: {
		//Draws a task to the DOM.
		draw: function(taskId) {
			var obj = $$(taskTemplate, {id: taskId, content: core.storage.tasks[taskId].content});
			$$.document.append(obj, $('#tasks ul'));
		}
	}
}
