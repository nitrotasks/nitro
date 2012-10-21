// Tags plugin 2
plugin.add(function() {
	// Clicking a tag
	$tasks.on('click', '.tag', function() {
		// Go to All Tasks list
		$('#Lall .name').trigger('click')
		// Run search - We should give the searchbox an ID
		$search.val($(this).text()).trigger('keyup')
		
	})
})