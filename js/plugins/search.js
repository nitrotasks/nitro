/* Nitro Search Plugin
 * By Jono Cooper & George Czabania
 * Licensed under the BSD License
 */

//Adds as a plugin
plugin.add(function() {

	$(document).on('loaded', function() {
		$panel.right.append('<input id="search" type="search" placeholder="'+$.i18n._('Search')+'">')
		$search = $("#search")
	
		$search.on('keyup', function() {

			var $this = $(this),
				input = $this.val()

			var searcher = function(key) {
				var pass1 = [],
					pass2 = true;

				// Loop through each word in the query
				for (var q = 0; q < query.length; q++) {

					// Create new search
					search = new RegExp(query[q], 'i');

					if(typeof(key) == 'function') {
						//Nope. Not a good idea
						return;
					}

					var task = core.storage.tasks[key]

					// Search
					if (search.test(task.content + task.notes + '#' + task.tags.toString().replace(/,/g,' #'))) {
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
				if (pass2) {
					return (key)
				}
			}
			
			if (input == '') {
				//If there's no input, just load list
				$sidebar.find('.selected .name').click();
			} else {
				//Puts the results into the UI
				$tasks.html('<h2>Search Results: ' + $this.val() + '</h2><ul></ul>')

				//There is some input
				// Set vars
				var query = input.split(' '),
					results = [],
					search;

				if (ui.session.selected == 'all') {
					// Search loop
					for (var t = 0; t < core.storage.tasks.length; t++) {

						// If task exists
						if (core.storage.tasks[t]) {

							//Seaches Task
							var str = searcher(t);
							if (str != undefined) {
								results.push(str);
							}
						}
					}

				} else {
					for (var key in core.storage.lists.items[ui.session.selected].order) {
						var str = parseInt(searcher(core.storage.lists.items[ui.session.selected].order[key]))
						if (!isNaN(str)) {
							results.push(str);
						}
					}
				}
				// Draws
				$tasks.find('ul').append(ui.lists.drawTasks(results))
			}
		})
	})
})