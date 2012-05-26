var taskModel = $$({}, '<li data-bind="content"></li>');


//Add Task
var button = $$({add: 'Add Task'}, '<button data-bind="add"/>', {
	'click &': function() {

		//Adds a task with the core
		var task = core.task().add('New Task', 'today');

		//Populates model
		var obj = $$(taskModel, core.storage.tasks[task]);
		$$.document.append(obj, $('ul'));

	}
});
$$.document.append(button);