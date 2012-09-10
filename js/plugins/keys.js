// Keyboard Shortcuts!

key('up, k', function() {cmd('prevTask')})
key('down, j', function() {cmd('nextTask')})
key('⌘+up, ⌘+k', function() {cmd('moveTaskUp')})
key('⌘+down, ⌘+j', function() {cmd('moveTaskDown')})

key('⇧+up, ⇧+k, i', function() {cmd('prevList')})
key('⇧+down, ⇧+j, u', function() {cmd('nextList')})
key('⇧+⌘+up, ⇧+⌘+k', function() {cmd('moveListUp')})
key('⇧+⌘+down, ⇧+⌘+j', function() {cmd('moveListDown')})

key('space', function() {cmd('check')})
key('enter', function() {cmd('editTask'); return false})
key('⌘+enter', function() {cmd('editList'); return false})

key('delete', function() {cmd('delete')})

if (app != 'mac') {
	key('f', function() {cmd('find'); return false})
	key('p', function() {cmd('prefs')})
	// key('a', function() {cmd('about')})
	// key('h', function() {cmd('help')})

	key('n, t', function() {cmd('newtask'); return false})
	key('l', function() {cmd('newlist'); return false})
	key('s', function() {cmd('sync')})

	key('1', function() {cmd('today')})
	key('2', function() {cmd('next')})
	key('3', function() {cmd('logbook')})
	key('4', function() {cmd('allTasks')})
}

key('esc', function() {cmd('escape')})

// Lists
$lists.on('keydown', 'input', function(e) {
	if(e.keyCode === 13) {
		ui.toggleListEdit($(this).parent(), 'close')
	}
})

// Tasks
$tasks.on('keydown', 'input.content', function(e) {
	if(e.keyCode === 13) {
		var $this = $(this).closest('li'),
			id = $this.attr('data-id')
		ui.toggleTaskEdit($this, {}, function() {
			$tasks.find('[data-id='+id+']').click()
		})
	}
})

$tasks.on('keydown', 'input, textarea', function(e) {
	if(e.keyCode === 27) {
		var $this = $(this).closest('li'),
			id = $this.attr('data-id')
		ui.toggleTaskEdit($this, {}, function() {
			$tasks.find('[data-id='+id+']').click()
		})
	}
})