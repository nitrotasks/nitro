/* Nitro Search Plugin
 * By Jono Cooper & George Czabania
 * Licensed under the BSD License
 */

 /*jshint asi:true*/

//Adds as a plugin
plugin.add(function() {

	// Append search box to DOM and cache element
	$panel.right.append('<input id="search" type="search" placeholder="'+$.i18n._('search')+'">')
	$search = $("#search")


	// Run search when the user enters a key
	$search.on('keyup', function() {

		var $this = $(this),
			input = $this.val()

		if (input === '') {

			// If there's no input, just load list
			$sidebar.find('.selected .name').click()

		} else {

			// Puts the results into the UI
			$tasks.html('<h2>'+$.i18n._('searchResults')+': ' + $this.val() + '</h2><ul></ul>')

			// Set vars
			var query = input.split(' '),
				results = [],
				loggedResults = [],
				search, str, tasks, key

			// All Tasks list
			if (ui.session.selected == 'all') {

				// Loop through all tasks
				for (key in core.storage.tasks) {

					// Ignore deleted tasks
					if(!core.storage.tasks[key].hasOwnProperty('deleted')) {

						// Search Task
						str = searcher(key, query)
						if (str) {
							if (core.storage.tasks[key].list === 'logbook') {
								loggedResults.push(str)
							} else {
								results.push(str)
							}
						}
					}
				}

			// Today list
			} else if (ui.session.selected == 'today') {

				// Search tasks that are due today as well
				tasks = core.list('today').populate()
				for (key in tasks) {
					str = searcher(tasks[key], query)
					if (str) {
						results.push(str)
					}
				}

			// Every other list
			} else {
				tasks = core.storage.lists.items[ui.session.selected].order
				for (key in tasks) {
					str = searcher(tasks[key], query)
					if(str) results.push(str)
				}
			}

			// Draws
			$tasks.find('ul').append(ui.lists.drawTasks(results))

			// Offer to show logged results
			if (loggedResults.length) {

				// Add a button with correctly pluralized text
				$tasks.append('<a class="showMore">' +
					((loggedResults.length === 1) ? $l._('showLoggedTask') : $l._('showLoggedTasks', [loggedResults.length])) +
					'</a>')

				// Show the logged results when the button is clicked
				$tasks.find('.showMore').click(function () {
					$tasks.find('ul').append(ui.lists.drawTasks(loggedResults))
					$(this).hide()
				})
			}
		}
	})

	// Will determine wether a task matches a query
	var searcher = function(taskId, query) {
		var pass1 = [],
			pass2 = true;

		// Loop through each word in the query
		for (var q = 0; q < query.length; q++) {

			// Create new search
			search = new RegExp(query[q], 'i');

			if(typeof(taskId) == 'function') {
				//Nope. Not a good idea
				return;
			}

			var task = core.storage.tasks[taskId]

			// Search
			if (search.test(task.content + task.notes)) {
				pass1.push(true);
			} else {
				pass1.push(false);
			}
		}

		// This makes sure that the task has matched each word in the query
		for (var p = 0; p < pass1.length; p++) {
			if (pass1[p] === false) {
				pass2 = false;
			}
		}

		// If all terms match then add task to the results array
		if (pass2) return (taskId)
		else return false
	}
})