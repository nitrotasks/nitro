/* Nitro Search Plugin
 * By Jono Cooper & George Czabania
 * Licensed under the BSD License
 */

//Adds as a plugin
plugin.add(function() {

	//Load plugin on document ready
	$(document).ready(function() {
		$$.document.append(input, $('#tasks .panel .right'));	
	});

	var input = $$({}, '<input type="search" placeholder="Search">', {
		'keyup &': function() {
			var view = $(this.view.$());
			
			if (view.val() == '') {
				//If there's no input, just load list
				$('#sidebar .selected').click();
			} else {
				//Puts the results into the UI
				$('#tasks .content').empty().html('<h2>Search Results: ' + view.val() + '</h2><ul></ul>')
				
				//There is some input
				// Set vars
				var query = view.val().split(' '),
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

				//Loops and adds each task to a tmp view
				var tmpView = $$({});
				for (var i=0; i<results.length; i++) {
					//Makes it nice
					var data = core.storage.tasks[results[i]];
					tmpView.prepend($$(ui.templates.task.compressed, {id: results[i], content: data.content, notes: data.notes, date: data.date, priority: data.priority}));
				}
				$$.document.append(tmpView, $('#tasks ul'));
			}

			function searcher(key) {
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

					// Search
					if (search.test(core.storage.tasks[key].content + core.storage.tasks[key].notes)) {
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
		}
	});
})