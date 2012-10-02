// CMD
// Easily do something in a single line

cmd = function (cmd) {
	// Contains all the commands

	switch(cmd) {
		// File Menu
		case 'newtask':
			$addBTN.click()
			break
		case 'newlist':
			$sidebar.find('.listAddBTN').click()
			break
		case 'sync':
			$runSync.click()
			break

		// Edit Menu
		case 'find':
			$search.focus()
			break
		case 'prefs':
			$settingsbtn.click()
			$('a[data-target=#tabGeneral]').tab('show')
			break

		// Sort
		case 'sort-magic':
			$sortType.find('.magic').parent().click()
			break
		case 'sort-default':
			$sortType.find('.default').parent().click()
			break
		case 'sort-priority':
			$sortType.find('.priority').parent().click()
			break
		case 'sort-date':
			$sortType.find('.date').parent().click()
			break

		// GoTo
		case 'today':
			$('#Ltoday .name').click()
			break
		case 'next':
			$('#Lnext .name').click()
			break
		case 'scheduled':
			$('#Lscheduled .name').click()
			break
		case 'logbook':
			$('#Llogbook .name').click()
			break
		case 'allTasks':
			$('#Lall .name').click()
			break

		// View menu
		case 'language':
			$settingsbtn.click()
			$('a[data-target=#tabLanguage]').tab('show')
			break
		case 'theme':
			$settingsbtn.click()
			$('a[data-target=#tabTheme]').tab('show')
			break
		case 'syncSettings':
			$settingsbtn.click()
			$('a[data-target=#tabSync]').tab('show')
			break

		// Help Menu
		case 'about':
			$settingsbtn.click()
			$('a[data-target=#tabAbout]').tab('show')
			break
		case 'donors':
			cmd('about')
			break
		case 'donate':
			window.location = 'http://nitrotasks.com/donate.html'
			break
		case 'help':
			cmd('about')
			break
		case 'bug':
			window.location = 'https://github.com/stayradiated/Nitro/issues'
			break

		// Extra stuff for keyboard shortcuts
		case 'editTask':
			// $editBTN.click()
			$tasks.find('.selected').map(function() {
				$(this).trigger(jQuery.Event('dblclick', {metaKey: true}))
			})
			break
		case 'editList':
			$sidebar.find('.selected .name').dblclick()
			break
		case 'check':
			$tasks.find('.selected .checkbox').click()
			break
		case 'delete':
			// if($warning.is(':visible')) $("#overlay").click()
			$delBTN.click()
			break

		case 'prevTask':
			if(!$tasks.find('.selected').length) {
				$tasks.find('li').first().addClass('selected')
			} else {
				if(ui.session.selected === 'next') {
					if($tasks.find('.selected').is(':first-of-type')) {
						$tasks.find('.selected').parent().prev().prev().find('li').last().find('.content').click()
					} else {
						$tasks.find('.selected').prevAll('li:not(".hidden")').first().find('.content').click()
					}
				} else {
					$tasks.find('.selected').prev('li').find('.content').click()
				}
			}
			
			break
		case 'nextTask':
			if(!$tasks.find('.selected').length) {
				$tasks.find('li').first().addClass('selected')
			} else {
				if(ui.session.selected === 'next') {
					if($tasks.find('.selected').is(':last-of-type')) {
						$tasks.find('.selected').parent().next().next().find('li').first().find('.content').click()
					} else {
						$tasks.find('.selected').nextAll('li:not(".hidden")').first().find('.content').click()
					}
				} else {
					$tasks.find('.selected').next('li').find('.content').click()
				}
			}
			break
		case 'prevList':
			if(!$sidebar.find('.selected').length) {
				$sidebar.find('li').first().find('.name').click()
			} else if ($sidebar.find('.selected').is(':first-of-type')) {
				$sidebar.find('.selected').parent().prev('h2').prev('ul').find('li').last().find('.name').click()
			} else {
				$sidebar.find('.selected').prev('li').find('.name').click()
			}
			break
		case 'nextList':
			if(!$sidebar.find('.selected').length) {
				$sidebar.find('li').first().find('.name').click()
			} else if ($sidebar.find('.selected').is(':last-of-type')) {
				$sidebar.find('.selected').parent().next('h2').next('ul').find('li').first().find('.name').click()
			} else {
				$sidebar.find('.selected').next('li').find('.name').click()
			}
			break

		case 'moveTaskUp':
			if($tasks.find('.selected').length) {
				var $this = $tasks.find('.selected').first(),
					id = $this.attr('data-id'),
					$parent = $this.parent()

				if(ui.session.selected === 'next') {
					var l = core.storage.lists.items[$parent.attr('id')].order,
						i = l.indexOf(id)
				} else {
					var	l = core.storage.lists.items[ui.session.selected].order,
						i = l.indexOf(id)
				}

				if(i > 0) {
					l.splice(i, 1)
					l.splice(i - 1, 0, id)

					if($parent.is('.wholeList')) {
						$parent.find('li, p').remove()
						for (var i in l) {
							$parent.addClass('wholeList').append(ui.tasks.draw(l[i]))
						}
					} else {
						$sidebar.find('.selected .name').click()
					}

					$tasks.find('[data-id='+id+']').addClass('selected')
					core.storage.save()
				}
			}
			break
		case 'moveTaskDown':
			if($tasks.find('.selected').length) {
				var $this = $tasks.find('.selected').first(),
					id = $this.attr('data-id'),
					$parent = $this.parent()

				if(ui.session.selected === 'next') {
					var l = core.storage.lists.items[$parent.attr('id')].order,
						i = l.indexOf(id)
				} else {
					var	l = core.storage.lists.items[ui.session.selected].order,
						i = l.indexOf(id)
				}

				if(i > -1 && !$this.is(':last-of-type')) {
					l.splice(i, 1)
					l.splice(i + 1, 0, id)

					if($parent.is('.wholeList')) {
						$parent.find('li, p').remove()
						for (var i in l) {
							$parent.addClass('wholeList').append(ui.tasks.draw(l[i]))
						}
					} else {
						$sidebar.find('.selected .name').click()
					}

					$tasks.find('[data-id='+id+']').addClass('selected')
					core.storage.save()
				}
			}
			break
		case 'moveListUp':
			var id = ui.session.selected,
				l = core.storage.lists.order,
				i = l.indexOf(id)
			if(i > 0) {
				l.splice(i, 1)
				l.splice(i - 1, 0, id)
				ui.reload()
				$('#L' + id + ' .name').click()
				core.storage.save()
			}
			break
		case 'moveListDown':
			var id = ui.session.selected,
				l = core.storage.lists.order,
				i = l.indexOf(id)
			if(i > -1) {
				l.splice(i, 1)
				l.splice(i + 1, 0, id)
				ui.reload()
				$('#L' + id + ' .name').click()
				core.storage.save()
			}
			break

		case 'escape':
			$('#overlay, #settingsOverlay').click()
			break
	}
}

// Mac Wrapper
macWrapper = function(input) {
	// example input: "<NSMenuItem: 0x10012e170 Next>"
	var raw = input.split(' '),
		command = "";
		
	// Remove first two values
	raw.splice(0, 2);
	
	var length = raw.length;
	for (var i = 0; i < length; i++) {
		if (i == length - 1) {
			command += raw[i].slice(0,-1);
		} else {
			command += raw[i] + " ";
		}
	}
	
	console.log(command);
	
	switch (command) {
		case "New Task":
			cmd('newtask');
			break;
		case "New List":
			cmd('newlist');
			break;
		case "Sync":
			cmd("sync");
			break;
		case "Today":
			cmd("today");
			break;
		case "Next":
			cmd("next");
			break;
		case "Logbook":
			cmd("logbook");
			break;
		case "All Tasks":
			cmd("allTasks");
			break;
		case "About Nitro":
			cmd("about");
			break;
	}
}