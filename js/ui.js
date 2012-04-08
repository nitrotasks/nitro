/* Nitro UI 
 *
 * Copyright (C) 2012 Caffeinated Code <http://caffeinatedco.de>
 * Copyright (C) 2012 Jono Cooper
 * Copyright (C) 2012 George Czabania
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 * Neither the name of Caffeinated Code nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */


$(document).ready(function() {
	//Refreshes Today
	cli.calc.todayQueue.refresh();

	//Language init - For computers that don't have the pref there
	if (!cli.storage.prefs.lang) {
		cli.storage.prefs.lang = 'english';
		cli.storage.save();
	}

	//Loads in - JavaScript Version
	$.getJSON('js/translations/' + cli.storage.prefs.lang + '.json', function(data) {  
		language(data)
	});

	// Theme init
	if (!cli.storage.prefs.theme) {
		cli.storage.prefs.theme = 'default';
		cli.storage.save();
	}

	$('link.theme').attr('href', 'css/themes/' + cli.storage.prefs.theme + '.css');

	//Loads - Python Version
	//document.title = 'null';
	//document.title = 'load|' + cli.storage.prefs.lang + '.json';

});

function language(data) {
	$.i18n.setDictionary(data);

	//Adds in Translations
	$('.translate').map(function() {
		$(this).text($.i18n._($(this).attr('data-translate')));
	});

	//Adds in Translated Title Text
	$('.translateTitle').map(function() {
		$(this).attr('title', $.i18n._($(this).attr('data-translate')));
	});

	//Search is placeholder - needs to be done manually
	$('#search').attr('placeholder', $.i18n._('search'));

	//Date Picker
	var i=1; 
	$('#showTime').children().map(function() { 
		if (i == 1) {
			$(this).text($.i18n._('1day'));
		} else if (i == 15) {
			$(this).text($.i18n._('never'));
		} else {
			$(this).text($.i18n._('moreday', [i]));
		};
		i++;
	})

	//This has to be done after language

	//Resizes tasks
	$(window).resize()

	ui.init();
	ui.tasks.init();
	ui.tasks.selected.init();
	ui.lists.updateCount('all');
	ui.tasks.populate('today');
}

$(window).resize(function() {
	$('#userLists').height($(window).height() - 200);
})


var toggleFx = function() {
	deCSS3.init( document.querySelectorAll( '.deCSS3-Style' ) );
	$.fx.off = !$.fx.off;
};

ui = {
	listEditMode: 'none',
	listClicks: 0,

	init: function() {
		$('#date').hide(0);

		/* Makes lists show up */
		for (var i=0; i<cli.storage.lists.order.length; i++) {
			$('#userLists').append('<li id="' + cli.storage.lists.order[i] + 'List"><div class="editIcon" title="' + $.i18n._('titleEditList') + '"></div><div class="view">' + cli.storage.lists.items[cli.storage.lists.order[i]].name  + '<div class="count">0</div></div><div class="edit"><input type="text" value="' +  cli.storage.lists.items[cli.storage.lists.order[i]].name + '"><div class="delete" title="' + $.i18n._('titleDeleteList') + '"></div><div class="save" title="' + $.i18n._('titleSaveList') + '"></div></div></li>');
		}

		/* Buttons */
		$('#addListBTN').click(function() {
			//Appends to UI
			$('#userLists').append('<li id="' + (cli.storage.lists.items.length) + 'List"><div class="editIcon" title="' + $.i18n._('titleEditList') + '"></div><div class="view">' + $.i18n._('newList') + '<div class="count">0</div></div><div class="edit"><input type="text" value="' + $.i18n._('newList') + '"><div class="delete" title="' + $.i18n._('titleDeleteList') + '"></div><div class="save" title="' + $.i18n._('titleSaveList') + '"></div></li>');

			//Makes it droppable
			$('#sidebar ul li').droppable('destroy');
			$('#sidebar ul li').droppable(ui.lists.dropOptions);

			//Adds to CLI
			cli.list('', $.i18n._('newList')).add();

			//Clicks the new list
			$('#' + (cli.storage.lists.items.length - 1) + 'List').click()
			ui.lists.openEditMode();
		});

		$('body').on('click', '#userLists li .delete', function() {
			if (cli.storage.prefs.deleteWarnings) {
				ui.lists.delete(ui.lists.selected());
				$('#nextList').click();
			} else {

				$('#warning').click(function(e) {
					e.stopPropagation();
					return false;
				})
				.find('p').html($.i18n._('listWarning')).parent()
				.find('.yes').html($.i18n._('yesList')).parent().fadeIn(75)
				.find('.yes').off('click')
				.on('click', function() {
					$(this).parent().fadeOut(75);
					var id = ui.lists.selected();
					ui.lists.delete(id);
					$(document).off('click');
					$('#nextList').click();
				})
				.parent().find('.no').off('click')
				.on('click', function() {
					$(document).off('click');
					$(this).parent().fadeOut(75);
				});

				//Closes when not clicked in square box
				setTimeout("$(document).click(function() {$('#warning').fadeOut(75); $(document).off('click');});", 100);
			}
		});

		$('body').on('click', '#sidebar ul li', function(){
			if (!$(this).hasClass('selected')) {
				$('#editBTN, #deleteBTN').addClass('disabled');
				//Changes selected
				$('#sidebar ul li.selected').removeClass('selected');
				$(this).addClass('selected');

				ui.lists.closeEditMode();

				//Sends the id of the list to populate
				var id = $(this).attr('id').substring(0, $(this).attr('id').length - 4);
				ui.tasks.populate(id);
			}
		});

		$('body').on('click', '#sidebar ul li .editIcon', function(){
			ui.lists.openEditMode();
		});

		//Enter Key closes list editing
		$('body').on('keydown', '#sidebar ul li input', function(e){
			if(e.keyCode === 13) {
				ui.lists.closeEditMode();
			}
		});

		//Enter key closes task editing
		$('body').on('keydown', '#tasks ul li .todotxt input', function(e){
			if(e.keyCode === 13) {
				//Weird Fix
				$(this).parent().html($(this).val());
				$('#editBTN').click();
			}
		});

		$('body').on('click', '#sidebar ul li .save', function(){
			ui.lists.closeEditMode();
		});

		//Adds a new task
		$('#addBTN').click(function() {
			//Closes current task
			$('#overlay').click();

			cli.addTask($.i18n._('newTask'), ui.lists.selected());
			
			// Shows in UI
			$('#tasks ul').first().prepend(ui.tasks.draw(cli.storage.tasks.length - 1));

			//Remove notice
			$('#tasks .explanation').remove();		

			//Update list count if task is added to today
			if (ui.lists.selected() == 'today') {
				ui.lists.updateCount('all');
			} else {
				ui.lists.updateCount();
			}

			//Expands Task
			ui.tasks.selected.expand($('#task' + (cli.storage.tasks.length - 1)))
		});

		// Edit selected tasks
		$('#editBTN').click(function() {
			if ($('#tasks .selected').length || $('#tasks .expanded').length) {
				//Close expanded
				if ($('#tasks .expanded').length) {
					ui.tasks.selected.collapse($('#tasks ul li.expanded'));
				}

				//Open Selected
				if ($('#tasks .selected').length) {
					ui.tasks.selected.expand($('#tasks .selected'));
				} else {
					$('#editBTN, #deleteBTN').addClass('disabled');
				}
			}
		});

		// Delete selected tasks
		$('#deleteBTN').click(function() {
			if (cli.storage.prefs.deleteWarnings) {
				if($('#tasks .selected').length) {
					var id = $('#tasks .selected').attr('id').substr(4, $('#tasks .selected').attr('id').length);
				} else {
					var id = $('#tasks .expanded').attr('id').substr(4, $('#tasks .expanded').attr('id').length);
				}
				cli.deleteTask(id);
				$('#task' + id).remove();
				
				//Disable edit and delete button if there is no expanded or selected task
				if(!$('#tasks .selected').length && !$('#tasks .expanded').length) {
					$('#editBTN, #deleteBTN').addClass('disabled');
				}

				ui.lists.updateCount('all');
			} else {
				if($('#tasks .selected').length || $('#tasks .expanded').length) {
					$('#warning')
						.find('p').html($.i18n._('taskWarning')).parent()
						.find('.yes').html($.i18n._('yesTask')).parent().fadeIn(75)
						.find('.yes').off('click')
						.on('click', function() {
							$(this).parent().fadeOut(75);
							if($('#tasks .selected').length) {
								var id = $('#tasks .selected').attr('id').substr(4, $('#tasks .selected').attr('id').length);
							} else {
								var id = $('#tasks .expanded').attr('id').substr(4, $('#tasks .expanded').attr('id').length);
							}
							cli.deleteTask(id);
							$('#task' + id).remove();
							
							//Disable edit and delete button if there is no expanded or selected task
							if(!$('#tasks .selected').length && !$('#tasks .expanded').length) {
								$('#editBTN, #deleteBTN').addClass('disabled');
							}

							ui.lists.updateCount('all');
							$(document).off('click');

						})
						.parent().find('.no').off('click')
						.on('click', function() {
							$(this).parent().fadeOut(75);
							$(document).off('click');
						});

					//Closes when not clicked in square box
					setTimeout("$(document).click(function() {$('#warning').fadeOut(75); $(document).off('click');});", 100);
				}
			}

 		});

		// Logbook
		$('#logbookBTN').click(function() {
			$('#editBTN, #deleteBTN').addClass('disabled');
			$('#sidebar ul li.selected').removeClass('selected');
			ui.tasks.populate('logbook');
		});

		// Settings pop up
		$('#settingsBTN img').click(function() {
			if($('.settings').is(':visible')) {
				$('.settings').fadeOut(100);

			} else {
				//Adds prefs in
				$('#deleteWarnings').prop('checked', cli.storage.prefs.deleteWarnings);
				$('#gpu').prop('checked', cli.storage.prefs.gpu);
				$('#over50').prop('checked', cli.storage.prefs.over50);
				$('#nextAmount').val(cli.storage.prefs.nextAmount);
				$('#language').val(cli.storage.prefs.lang);
				$('#theme').val(cli.storage.prefs.theme);

				$('.settings').fadeIn(100);
			}
		});

		//Check Boxes
		$('.settings form input').change(function() {

			cli.storage.prefs.deleteWarnings = $('#deleteWarnings').prop('checked');
			cli.storage.prefs.gpu = $('#gpu').prop('checked');
			cli.storage.prefs.over50 = $('#over50').prop('checked');

			cli.storage.save();

			if ($(this).attr('id') == 'gpu') {
				toggleFx();
			};

			console.log('Settings Saved');
		});

		$('#language').change(function() {
			//Saves Lang
			cli.storage.prefs.lang = $(this).val();
			cli.storage.save();

			//Reloads App
			window.location.reload();
		});

		$('#theme').change(function() {
			var theme = $(this).val();

			$('link.theme').attr('href', 'css/themes/' + theme + '.css')

			if(theme == 'bieber') {
				$('#brand').html('<img src="css/themes/bieber/heart.png" style="padding-right:8px;position: relative;top: -2px;">Justin Bieber');
				$('body').append('<audio></audio>');
				var $audio = $('audio'),
					audio = $audio.get(0);
				$audio.attr('src','css/themes/bieber/stl.mp3');
				audio.load();
				audio.play();
				audio.addEventListener('ended', function() {
					this.currentTime = 0;
					this.play();
				}, false);
			}
			
			//Saves Theme
			cli.storage.prefs.theme = theme;
			cli.storage.save();
		});

		//Select box
		$('.settings form select').change(function() {
			cli.storage.prefs.nextAmount = $('#nextAmount').val();
			cli.storage.save();

			console.log('Settings Saved');

			if (ui.lists.selected() == 'next') {
				ui.tasks.populate('next');
			};
		});

		/* INIT SETTINGS */
		if (cli.storage.prefs.gpu) {
			toggleFx();
		};

		// Search
		$('#search').keyup(function() {
			$('#editBTN, #deleteBTN').addClass('disabled');
			$('#sidebar ul li.selected').removeClass('selected');
			var query = this.value,
				results = cli.populate('search', query);
			$('#tasks').html('<h2>' + $.i18n._('searchResults') + query + '</h2><ul></ul>');
			for(var i = 0; i < results.length; i++) {
				$('#tasks ul').append(ui.tasks.draw(results[i]));
			}
		});

		//Sorting list
		$('#userLists').sortable({
			containment: 'parent', 
			axis: 'y', 
			distance: 20, 
			placeholder: 'listPlaceholder',
			stop: function(event, ui) {

				//Saves Everything, including order
				var listOrder = new Array();

				//Loops through lists & adds the to an array
				$('#userLists').children().map(function() { 
					listOrder.push(parseInt($(this).attr('id').substring(0, $(this).attr('id').length - 4))); 
				});

				//Saves
				cli.list().order(listOrder);
			}
		});

		$('#sidebar ul li').droppable(ui.lists.dropOptions);

		/* More buttons */
		$('body').on('click', '#tasks .moarTasks', function() {
			//Adds in missing tasks
			var items = cli.populate('list', ui.lists.selected());
			var parent = $(this).parent();
			$(this).remove();

			for (var i=50; i<items.length; i++) {
				parent.append(ui.tasks.draw(items[i]));	
			}
		});

		$('body').on('click', '#tasks .expandList', function() {
			var id = $(this).parent().attr('id');
			$('#' + id + 'List').click()
		});

	},
	lists: {
		selected: function() { 
			if($('#sidebar ul li.selected').length) {
				return $('#sidebar ul li.selected').attr('id').substring(0, $('#sidebar ul li.selected').attr('id').length - 4);	
			} else {
				return '';
			}
		},
			

		openEditMode: function() {
			$('#' + ui.lists.selected() + 'List').addClass('edit');
			$('#' + ui.lists.selected() + 'List .view').hide(0);

			$('#' + ui.lists.selected() + 'List .edit').show(0);
			$('#' + ui.lists.selected() + 'List .edit input').focus();

			ui.listEditMode = ui.lists.selected();
		},

		closeEditMode: function() {
			if (ui.listEditMode != 'none') {

				var newName = $('#' + ui.listEditMode + 'List .edit input').val();

				$('#' + ui.listEditMode + 'List').removeClass('edit');
				$('#' + ui.listEditMode + 'List .edit').hide(0);
				$('#' + ui.listEditMode + 'List .view').html(newName + '<div class="count"></div>').show(0);

				ui.lists.updateCount('all');
				
				$('#tasks h2').html(newName);

				//Edits list (FIX FOR DELETED LIST)
				try {
					cli.list(ui.listEditMode, newName).rename();
				} catch (err) {}
				ui.listEditMode = 'none';

			};
		},

		delete: function(id) {
			// Deletes list
			cli.list(id).delete();

			// Removes list from menu and then selects the next list
			var $listToDelete = $('#' + id + 'List');
			if($('#userLists li').length == 1) $listToDelete.remove();
			else if($listToDelete.is(':last-child')) $listToDelete.prev().addClass('selected').next().remove();
			else $listToDelete.next().addClass('selected').prev().remove();
		},

		updateCount: function(type) {
			var type = type || 'selected';
			switch(type) {
				case 'all':
					$('#sidebar ul li').map(function() {
						var list = $(this).attr('id').substring(0, $(this).attr('id').length - 4);
						$('#sidebar ul li#' + list + 'List .count').html(cli.populate('list', list).length);
					});
					return;
				case 'selected':
					var list = $('#sidebar ul li.selected').attr('id').substring(0, $('#sidebar ul li.selected').attr('id').length - 4);
					break;
				default:
					var list = $('#sidebar ul li#' + type + 'List').attr('id').substring(0, $('#sidebar ul li#' + type + 'List').attr('id').length - 4);
					break;
			}
			$('#sidebar ul li#' + list + 'List .count').html(cli.populate('list', list).length);
		},
		dropOptions: {
			hoverClass: "dragHover",
			accept: '#tasks ul li',
			drop: function(event, uix) {
				listId = $(this).attr('id').substring(0, $(this).attr('id').length - 4);
				taskId = $(uix.draggable).attr('id').substring(4, $(uix.draggable).attr('id').length);

				//Next list if task is dropped into same list
				if (ui.lists.selected() == 'next') {

					if (cli.taskData(taskId).display().list == $(event.target).attr('id').substring(0, $(event.target).attr('id').length - 4)) {
						return;
					}
				};

				//If item in Today is added to today
				if ($(event.target).attr('id').substring(0, $(event.target).attr('id').length - 4) == 'today') {
					cli.today(taskId).add();
				} else {
					//Moves Task
					cli.moveTask(taskId, listId);
				}

				//Updates Tasks
				ui.tasks.populate(ui.lists.selected())

				//Update Counts
				ui.lists.updateCount('all');
			}
		}
	},
	tasks: {
		clicks: 0,
		lastClicked: "",

		populate: function(id) {

			var items = cli.populate('list', id);

			if (id == 'logbook') {
				$('#tasks').html('<h2>' + $.i18n._('logbook') + '</h2><ul id="logbook"></ul>');

				//Populates
				for (var i=0; i < items.length; i++) {
					$('#tasks ul').append(ui.tasks.draw(items[i]));

					// Set checked to true
					$('#task' + items[i]).addClass('logged');
					$('#task' + items[i] + " input[type=checkbox]").prop('checked', true);
				};

				//If nothing is logged, a description appears
				if (items.length == 0) {
					$('#tasks').append('<div class="explanation">' + $.i18n._('logbookText') + '</div>');
				}

				//Breaks loop
				return;
			};

			//Clears page
			$('#tasks').html('');
			
			if (id == 'next' && cli.storage.prefs.nextAmount != 'noLists') {
				for (var i=0; i<cli.storage.lists.order.length; i++) {
					var listData = cli.storage.lists.items[cli.storage.lists.order[i]];
					var newListItems = cli.populate('list', cli.storage.lists.order[i]);

					if (newListItems.length != 0) {
						//Makes a new section for a new list
						$('#tasks').append('<h2 class="' + cli.storage.lists.order[i] + '">' + listData.name + '</h2><ul id="' + cli.storage.lists.order[i] + '"></ul>');

						//Loop inside a loop. Loopception...
						for (var l=0; l<newListItems.length; l++) {

							if (l == 3 && cli.storage.prefs.nextAmount == 'threeItems') {
								//Because english matters
								if (parseInt(newListItems.length) - 3 == 1) {
									$('#tasks ul#' + cli.storage.lists.order[i]).append('<p class="expandList">' + $.i18n._('oneMore') + '</p>');
								} else {
									$('#tasks ul#' + cli.storage.lists.order[i]).append('<p class="expandList">' + $.i18n._('oneMore', [(parseInt(newListItems.length) - 3)]) + '</p>');
								};
								break;
							}

							//Draws each task in the new list
							$('#tasks ul#' + cli.storage.lists.order[i]).append(ui.tasks.draw(newListItems[l]));
						};
					};				
				};
			}

			//Fixes a bug that I don't know how to reproduce...
			// Causes name of list to be undefined
			if (ui.lists.selected() == 'today') {
				$('#tasks').prepend('<h2>' + $.i18n._('today') + '</h2><ul id="' + id + '"></ul>');
			} else if (ui.lists.selected() == 'next') {
				$('#tasks').prepend('<h2>' + $.i18n._('next') + '</h2><ul id="' + id + '"></ul>');
			} else if (ui.lists.selected() == 'someday') {
				$('#tasks').prepend('<h2>' + $.i18n._('someday') + '</h2><ul id="' + id + '"></ul>');
			} else {
				$('#tasks').prepend('<h2>' + cli.storage.lists.items[id].name + '</h2><ul id="' + id + '"></ul>');
			}
			

			//Populates
			for (var i=0; i < items.length; i++) {
				//Checks if element exists first
				if ($('#task' + items[i]).length == 0) {
					$('#tasks ul#' + id).append(ui.tasks.draw(items[i]));
				} else {
					$('#tasks ul#' + id).append('<li class="hidden" data-id="' + items[i] + '"></li>')
				};

				if (i == 49) {
				 	if(!cli.storage.prefs.over50) {
						//English Helps
						if (parseInt(items.length) - 50 == 1) {
							$('#tasks ul#' + id).append('<p class="moarTasks">' + $.i18n._('oneMore') + '</p>');
						} else {
							$('#tasks ul#' + id).append('<p class="moarTasks">' + $.i18n._('oneMore', [(parseInt(newListItems.length) - 50)]) + '</p>');
						};
						break;
					};
				};
			};

			//If there are no tasks, there is an explanation
			if (items.length == 0 && $('#tasks ul').length == 1) {
				if (ui.lists.selected() == 'today') {
					var reason = $.i18n._('todayText');
				} else if (ui.lists.selected() == 'next') {
					var reason = $.i18n._('nextText');
				} else if (ui.lists.selected() == 'someday') {
					var reason = $.i18n._('somedayText');
				} else {
					var reason = $.i18n._('customText');
				}
				$('#tasks').append('<div class="explanation">' + reason + '</div>')
			}

			$('#tasks ul').sortable({
				placeholder: "placeholder",
				distance: 20,
				appendTo:'body',
				items: 'li',
				helper:function(){ return $("<div class='dragbox'></div>"); },
				cursorAt:{top:15,left:15},
				scroll: false,
				connectWith: $('#tasks ul'),
				stop: function(event, elem) {

					var from = event.target.id;
					var to = $(elem.item).parent().attr('id');

					var id = $(elem.item).attr('id').substring(4, $(elem.item).attr('id').length);
					var data = cli.taskData(id).display();

					//If the list has been changed...
					if (from != to) {
						data.list = to;
						cli.taskData(id).edit(data);
					}

					ui.tasks.sortStop(event, elem);

					//If on the motherfucking three mode. 
					//Fuck fuck I've spent two fucking hours making this work
					if (ui.lists.selected() == 'next') {
						if(cli.storage.prefs.nextAmount == 'threeItems') {
							ui.tasks.populate('next')
						}

						cli.today(id).calculate()
						ui.lists.updateCount('all');
					}
				}
			});
		},

		sortStop: function(event, elem) {
			

			//Removes duplicates from next list (if any)
			if (ui.lists.selected() == 'next') {
				var hiddenValues = new Array();
				$('#next .hidden').map(function() { 
					hiddenValues.push($(this).attr('data-id'))
				});

				for (var i=0; i<hiddenValues.length; i++) {
					//If it is next & has a hidden item, remove the hidden item
					if ($('#next #task' + hiddenValues[i]).length != 0) {
						$('#next li[data-id=' + hiddenValues[i] + ']').remove();
						console.log('Hidden Item: ' + hiddenValues[i] + ' removed!');
					}
				}
			};

			var taskOrder = new Array();

			$('#tasks ul#' + ui.lists.selected()).children('li').map(function() {

				if ($(this).children('input[type=checkbox]').attr('checked')) {
					//Log item
				} else {
					if ($(this).hasClass('hidden')) {
						taskOrder.push($(this).attr('data-id'));
					} else {
						var id = $(this).attr('id').substring(4, $(this).attr('id').length); 
						taskOrder.push(id);
					};								
				};	
			});
			cli.list(ui.lists.selected()).taskOrder(taskOrder);

			if (ui.lists.selected() == 'next') {
				//Special Next list
				if (cli.storage.prefs.nextAmount != 'noLists') {
					for (var i=0; i<cli.storage.lists.order.length; i++) {
						console.log(cli.storage.lists.order[i]);
						//Gotta love loopception 😄
						var tmpOrder = new Array;
						$('#tasks ul#' + cli.storage.lists.order[i]).children('li').map(function() {
							
							if ($(this).children('input[type=checkbox]').attr('checked')) {
								//Log item
							} else {
								var id = $(this).attr('id').substring(4, $(this).attr('id').length); 
								tmpOrder.push(id);
							};
						});

						if (cli.storage.prefs.nextAmount == 'threeItems') {
							//gets old array
							var oldArr = cli.populate('list', cli.storage.lists.order[i]);
							oldArr.splice(0,3);
							var finalArr = tmpOrder.concat(oldArr);
							cli.list(cli.storage.lists.order[i]).taskOrder(finalArr);

						} else {
							cli.list(cli.storage.lists.order[i]).taskOrder(tmpOrder);
						}
					}
				}

				//Updates Counts for all lists
				ui.lists.updateCount('all');
			};

			//Deletes empty lists
			$('#tasks ul:not(#next)').map(function(){ 
				if ($(this).children().length == 0) {
					$('#tasks h2.' + $(this).attr('id')).remove(); $(this).remove(); 
				}
			});
		},

		draw: function(id) {
			var data = cli.taskData(id).display();

			//Draws the checkbox
			if (data.priority != 'none') {
				var priority = 'class="' + data.priority + '" ';
			} else {
				var priority = '';
			};

			if (ui.lists.selected() != 'today') {
				//Draws the today label
				if (data.today == 'yesAuto' || data.today == 'manual') {
					var today = '<span class="todayLabel">' + $.i18n._('doToday') + '</span>'
				} else if (data.today == 'noAuto' || data.today == 'false') {
					var today = ''
				};
			} else {
				var today = '';
			}

			//Draws the date label
			if (data.date != '') {
				var date = '<span class="dateLabel ' + cli.calc.prettyDate.difference(data.date)[1] + '">' + cli.calc.prettyDate.difference(data.date)[0] + '</span>';
			} else {
				var date = '';
			}

			return '<li ' + priority + 'id="task' + id + '"><div class="boxhelp"><div class="checkbox"><input type="checkbox"></div><div class="todotxt">' + data.content + '</div><div class="labels">' + today + date + '</div></div></li>';
		},

		init: function() {
			//Overlay
			$('#overlay').click(function() {
				if ($('#date').css('display') != 'block') {
					$('#editBTN, #deleteBTN').addClass('disabled');
					$('#tasks ul li.selected').removeClass('selected');
					ui.tasks.selected.collapse($('#tasks ul li.expanded'))
					$('.settings').fadeOut(150);
				};				
			});

			// Checking off tasks
			$('body').on('change', '#tasks ul li input[type=checkbox]', function() {

				var id = $(this).closest('li').attr('id').substr(4, $(this).closest('li').attr('id').length);
				cli.logbook(id);

				if ($(this).prop('checked')) {
					$('#task' + id).addClass('logged');
				} else {
					$('#task' + id).removeClass('logged');
				}

				if ($('#task' + id + ' input[type=checkbox]').attr('checked') != 'checked') {
					cli.today(id).calculate()
				} 
				//Update counts
				ui.lists.updateCount('all');

			});

			// Priority
			$('body').on('click', '#tasks .priority', function() {

				// Get id of task
				var id = $(this).closest('li').attr('id').substr(4, $(this).closest('li').attr('id').length);

				// Remove old checkbox colour
				$('#tasks #task' + id).removeClass(cli.priority(id).get());

				// Update priority
				cli.priority(id).set();

				// Display priority (Html and Class)
				$(this).html($.i18n._(cli.priority(id).get())).removeClass().addClass(cli.priority(id).get() + ' priority');

				// Add new checkbox colour
				$('#tasks #task' + id).addClass(cli.priority(id).get());
			});

			//Edit mode
			$('body').on('click', '#tasks ul li .todotxt', function(e){

				//Enables Edit button & delete button
				$('#editBTN, #deleteBTN').removeClass('disabled');

				//TIL, you can't just copy de pasty code expecting it to work.
				ui.tasks.clicks++
				setTimeout("ui.tasks.clicks = 0", 300);

				//"this" seems to be playing up. We'll use ids instead
				var id = $(this).parent().parent().attr('id');

				if ($('#' + id).hasClass('expanded')) {
					if (ui.tasks.clicks == 2 && id == ui.tasks.lastClicked) {
						//Close on double click
						$('#tasks ul li.expanded .todotxt').blur();
						ui.tasks.selected.collapse($('#tasks ul li.expanded'));
					};
				} else {
					
					$('#tasks ul li.selected:not(#' + id + ')').removeClass('selected');
					//$('#editBTN').removeClass('disabled');

					$('#' + id).toggleClass('selected');

					if (ui.tasks.clicks == 1) {
						ui.tasks.lastClicked = id;	
					} else if (ui.tasks.clicks == 2 && id == ui.tasks.lastClicked) {

						ui.tasks.selected.collapse($('#tasks ul li.expanded'));

						if ($(this).parent().hasClass('expanded')) {
							//Do Nothing
						} else {
							ui.tasks.selected.expand($('#' + id));
						};
					};

					/*if ($('#tasks ul li.selected').length == 0 && $('#tasks ul li.margin').length == 0) {
						$('#editBTN').addClass('disabled');
					};*/
				};
			});

		},

		selected: {
			init: function() {
				$('body').on('blur', '#tasks ul li .todotxt input', function() {
					var id = $(this).parent().parent().parent().attr('id').substring(4, $(this).parent().parent().parent().attr('id').length);
					var data = cli.taskData(id).display();

					//Edits Data
					data.content = $(this).val();
					cli.taskData(id).edit(data);
				});

				$('body').on('click', '.#tasks ul li .labels .today', function() {
					var id = $(this).parent().parent().parent().attr('id').substring(4, $(this).parent().parent().parent().attr('id').length);
	
					if ($(this).hasClass('inToday')) {
						//Takes out of today

						//Checkbox & Label
						$('#task' + id).removeClass('today')
						$(this).removeClass('inToday').html($.i18n._('showInToday'));

						//We need to remove the other node in Next
						if (ui.lists.selected() == 'next') {
							$('#next li.hidden').map(function() {
								if ($(this).attr('data-id') == id) {
									$(this).remove();
								}
							});
						}

						//Cli
						cli.today(id).remove();
						
					} else {
						//Adds to Today

						//Checkbox & Label
						$('#task' + id).addClass('today')
						$(this).addClass('inToday').html($.i18n._('removeFromToday'));

						if (ui.lists.selected() == 'next') {
							if (cli.taskData(id).display().list != 'next') {
								$('#next').append('<li class="hidden" data-id="' + id + '"></li>');
							}
						}
						
						cli.today(id).add();
					};

					if (ui.lists.selected() == 'today') {
						ui.tasks.populate(ui.lists.selected())
					} else {
						ui.tasks.sortStop();
					};

					//Updates counts
					ui.lists.updateCount('all');
				});

				/* Date Select */
				$('#datepicker').datepicker({
					onSelect: function() {
						var id = $('#tasks ul li.expanded').attr('id').substring(4, $('#tasks ul li.expanded').attr('id').length);

						//Saves Date
						var task = cli.taskData(id).display();
						task.date = cli.calc.dateConvert($('#datepicker').datepicker('getDate'));

						cli.taskData(id).edit(task);

						//Edits UI
						$('#task' + id + ' .labels .date').html(cli.calc.prettyDate.difference(task.date)[0]);

						//Runs a bunch of Today functions
						cli.calc.date(id);
						cli.today(id).calculate();

						if (cli.taskData(id).display().today == 'yesAuto' || cli.taskData(id).display().today == 'manual') {
							$('#tasks ul li.expanded .labels .today').addClass('inToday').html($.i18n._('removeFromToday'));
						} else if (cli.taskData(id).display().today == 'noAuto' || cli.taskData(id).display().today == 'false') {
							$('#tasks ul li.expanded .labels .today').removeClass('inToday').html($.i18n._('showInToday'));
						};

						ui.lists.updateCount('all');
					}
				}).children().show();

				//jQuery UI Locales
				if ($.i18n._('jqueryui') != 'en') {
					//TODO: Future Ajax Request for Localizations
				};
 
				//Remove Date
				$('#removeDate').click(function() {
					var id = $('#tasks ul li.expanded').attr('id').substring(4, $('#tasks ul li.expanded').attr('id').length);

					//Hides window thing
					$('#date').hide(0);
					$('#task' + id + ' .labels .date').html($.i18n._('setDueDate'));
					$(document).off('click');

					//Removes Date
					var data = cli.taskData(id).display()
					data.date = '';

					//Changes to false if yesAuto or noAuto
					if (data.today == 'yesAuto' || data.today == 'noAuto') {
						$('#task' + id + ' .labels .today').html($.i18n._('showInToday')).removeClass('inToday');
						data.today = 'false';
					}
					cli.taskData(id).edit(data);

					//Runs a bunch of Today functions
					cli.calc.date(id);
					cli.today(id).calculate();

					if (ui.lists.selected() == 'today') {
						ui.tasks.populate(ui.lists.selected())
					} else {
						ui.tasks.sortStop();
					};
					ui.lists.updateCount('all');
				});

				/* Date Close */
				$('body').on('click', '.labels .date', function(e) {
					//Position of datepicker
					var pos = $(this).offset();
					if (pos.top - 100 < 15 ) {
						var top = 115;
					} else {
						var top = $(this).offset().top;
					}

					$('#date').show();
					
					//Puts new data into date picker
					var id = $(this).parent().parent().parent().attr('id').substring(4, $(this).parent().parent().parent().attr('id').length);
					var date = cli.taskData(id).display().date;
					
					//Only populate date picker if it has a date
					if (date == '') {
						$('#datepicker').datepicker('setDate', new Date);
					} else {
						$('#datepicker').datepicker('setDate', date);
					};

					//Populate Show in today box
					$('#showTime').val(cli.taskData(id).display().showInToday);
						
					$('#date').css({'left': pos.left - 275, 'top': top - 100});

					$("#date").click(function(e) {
					    e.stopPropagation(); // This is the preferred method.
					    return false;        // This should not be used unless you do not want
					                         // any click events registering inside the div
					});

					function dateClose() {
						$(document).click(function() {
							//Hides Picker
							$('#date').hide();
							$(this).off('click');
							if (ui.lists.selected() == 'today') {
								ui.tasks.populate(ui.lists.selected())
							} else {
								ui.tasks.sortStop();
							};
						});
					}
					setTimeout(dateClose, 100);
				});

				/* Show in Today */
				$('#showTime').change(function() {
					var id = $('#tasks ul li.expanded').attr('id').substring(4, $('#tasks ul li.expanded').attr('id').length);

					//Saves Date
					var task = cli.taskData(id).display();
					task.showInToday = $(this).val();

					cli.taskData(id).edit(task);

					//Runs a bunch of Today functions
					cli.calc.date(id);
					cli.today(id).calculate();

					if (cli.taskData(id).display().today == 'yesAuto' || cli.taskData(id).display().today == 'manual') {
						$('#tasks ul li.expanded .labels .today').addClass('inToday').html($.i18n._('removeFromToday'));
					} else if (cli.taskData(id).display().today == 'noAuto' || cli.taskData(id).display().today == 'false') {
						$('#tasks ul li.expanded .labels .today').removeClass('inToday').html($.i18n._('showInToday'));
					};
				});

				/* Notes */
				$('body').on('blur', '#tasks ul li textarea', function() {
					var id = $(this).parent().parent().attr('id').substring(4, $(this).parent().parent().attr('id').length);
					var data = cli.taskData(id).display();

					//Edits Data
					data.notes = $(this).val();
					cli.taskData(id).edit(data);

				});
			},
			expand: function(id) {
				id.addClass('expanded').removeClass('selected');
				var data = id.attr('id').substring(4, id.attr('id').length);
				var taskData = cli.taskData(data).display();

				//Draws the Today Label
				if (taskData.today == 'manual' || taskData.today == 'yesAuto') {
					var today = '<span class="today inToday">' + $.i18n._('removeFromToday') + '</span>';
				} else {
					var today = '<span class="today">' + $.i18n._('showInToday') + '</span>';
				};

				if (taskData.date == '') {
					var date = '">' + $.i18n._('setDueDate');
				} else {
					var date = cli.calc.prettyDate.difference(taskData.date)[1] + '">' + cli.calc.prettyDate.difference(taskData.date)[0];
				}


				//Adds expanded data
				id.children().children('.todotxt').html('<input type="text" placeholder="' + $.i18n._('taskName') + '" value="' + taskData.content + '">').children('input').focus();
				id.children().children('.labels').html(today + '<span class="priority ' + taskData.priority + '">' + $.i18n._(taskData.priority) + '</span><span class="date ' + date + '</span>')
				id.append('<div class="hidden"><textarea placeholder="' + $.i18n._('notes') + '">' + taskData.notes + '</textarea></div>');

				//Auto resize
				$('#content textarea').TextAreaExpander()

				//Animations
				id.addClass('margin');
				id.children('.hidden').slideDown(150, function() {
					$('#content textarea').focus().closest('li').find('input').focus();
				});
			},

			collapse: function(id) {
				if (id.attr('id')) {

					//Gets taskData
					var data = id.attr('id').substring(4, id.attr('id').length);
					var taskData = cli.taskData(data).display()

					//Calculates labels
					if (ui.lists.selected() !== 'today') {
						//Draws the today label
						if (taskData.today == 'yesAuto' || taskData.today == 'manual') {
							var today = '<span class="todayLabel">' + $.i18n._('doToday') + '</span>'
						} else if (taskData.today == 'noAuto' || taskData.today == 'false') {
							var today = ''
						};
					} else {
						var today = '';
					}

					//Draws the date label
					if (taskData.date !== '') {
						var date = '<span class="dateLabel ' + cli.calc.prettyDate.difference(taskData.date)[1] + '">' + cli.calc.prettyDate.difference(taskData.date)[0] + '</span>';
					} else {
						var date = '';
					}

					//Turns edit mode off
					id.children().children('.todotxt').html(taskData.content);
					id.children().children('.labels').html(today + date);

					//Animations
					id.children('.hidden').slideUp(150);
					id.addClass('deletion').removeClass('margin');
					setTimeout("$('#tasks ul li.deletion .hidden').remove()", 150);
					setTimeout("$('#tasks ul li.deletion').removeClass('deletion expanded')", 150);
				}
			}
		}
	}
};
/* Konami Code */
var konami_keys = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
var konami_index = 0;
$(document).keydown(function(e){
    if(e.keyCode === konami_keys[konami_index++]){
        if(konami_index === konami_keys.length){
            $(document).unbind('keydown', arguments.callee);
            $('body').append('<section id="song"><a onclick="play(\'george\')" href="#"><img src="images/george.png"></a><a onclick="play(\'jono\')" href="#"><img src="images/jono.png"></a></section>');
            $('#song').fadeIn(300);
        }
    }else{
        konami_index = 0;
    }
});

function play(developer) {
	//Gets Data from server
	$.getJSON('http://nitrotasks.com/music/?callback=?', function(data) {
		if (developer == 'george') {
			var music = data[0];
		} else if (developer == 'jono') {
			var music = data[1];
		}

		//Chooses a random song
		var song = Math.floor(Math.random() * music.length);

		//Plays it
		var audioElement = document.createElement('audio');
		audioElement.setAttribute('src', music[song]);
		audioElement.play();
	});
	$('#song').fadeOut(300);
}