var task = $$({}, '<li><p data-bind="content"/></li>');


//Add Task
var button = $$({add: 'Add Task'}, '<button data-bind="add"/>', {
	'click &': function() {

		var obj = $$(task, {content:'Joe Doe'});
		$$.document.append(obj, $('ul'));

	}
});
$$.document.append(button);