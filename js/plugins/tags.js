// Tags plugin 2

plugin.add(function() {

	$tasks.on('change', 'input.tags', function() {

		var $this = $(this).closest('li'),
			val = $(this).val(),
			model = {
				id: $this.attr('data-id')
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