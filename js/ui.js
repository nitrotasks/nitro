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

// Define system (python|js|web)
var app = 'web';

/********************************************************************************
	MAIN INIT
********************************************************************************/

var $body, $addBTN, $editBTN, $deleteBTN, $logbookBTN, $settingsBTN, $syncBTN, $tasks, $sidebar, $userLists, $addListBTN, $warning;

$(document).ready(function () {
	"use strict";

	//Login thing
	if (app != 'web') {
		$('#login').remove();
	}

	// Theme init
	cli.storage.prefs.theme = cli.storage.prefs.theme || 'default';
	$('link.theme')
		.attr('href', 'css/themes/' + cli.storage.prefs.theme + '.css')
		.ready(function () {
			$(window).resize();
		});

	// Cached selectors
	$body        = $('body');
	$addBTN      = $('#addBTN');
	$editBTN     = $('#editBTN');
	$deleteBTN   = $('#deleteBTN');
	$logbookBTN  = $('#logbookBTN');
	$settingsBTN = $('#settingsBTN');
	$syncBTN     = $('#syncBTN');
	$tasks       = $('#tasks');
	$sidebar     = $('#sidebar');
	$userLists   = $('#userLists');
	$addListBTN  = $('#addListBTN');
	$warning     = $('#warning');

	// Make sure the database is up to date
	cli.timestamp.upgrade();

	//Reschedule Schedule
	cli.scheduled.update();

	// Check the dates on the Today list
	cli.calc.todayQueue.refresh();

	// Loads Translation
	$('#languagescript').attr('src', 'js/translations/' + cli.storage.prefs.lang + '.js');

	// Load different versions
	if (app == 'python') {
		//Removes unwanted things
		$('.pythonshit').remove();
	};
	
	// Sets up keyboard shortcuts
	ui.external.key();

	// GPU init
	if (cli.storage.prefs.gpu) {
		toggleFx();
	}
});

$(window).resize(function () {
	"use strict";
	if (cli.storage.prefs.theme === 'wunderlist') {
		$userLists.height($(window).height() - $('#userLists').offset().top - 36);
	} else {
		$userLists.height($(window).height() - $('#userLists').offset().top);
	}
});

var toggleFx = function () {
	"use strict";
	deCSS3.init(document.querySelectorAll('.deCSS3-Style'));
	$.fx.off = !$.fx.off;
};

/********************************************************************************
	THE UI
********************************************************************************/

var ui = {
	listEditMode: 'none',
	listClicks: 0,

	/**************************************************************
		INIT
	**************************************************************/

	init: function () {
		"use strict";

		//Loading Button
		if (app == 'web') {
			$('#loading button').click(function() {
				$(this).remove();
				$('#loading').css('z-index', '0');
				$('#everything').css({'opacity': '1', '-webkit-transform': 'scale(1)'});
			})

		} else {
			$('#loading').remove();
		};

		// Hide datepicker
		$('#date').hide(0);

		// Makes lists show up
		ui.lists.populate();



		/**********************************
			PANEL BUTTONS
		**********************************/

		// ADD TASK BUTTON
		$addBTN.click(function () {

			if (!$(this).hasClass('disabled')) {

				// Closes current task
				$('#overlay').click();

				if (ui.lists.selected() == 'scheduled') {
					$('#scheduledDialog .inner').fadeToggle(150).attr('data-type', 'add');
					$('.radioscheduled input[value=scheduled]').attr('checked', 'true');
					$('#scheduledDialog').toggle(0);
					ui.tasks.scheduled('add');
				} else {
					
					// Adds a new task via the CLI
					cli.addTask($.i18n._('newTask'), ui.lists.selected());

					// Show task in UI
					$('#tasks ul').first().prepend(ui.tasks.draw(cli.storage.tasks.length - 1));
					$('#tasks .explanation').remove();

					//Update list count if task is added to today
					if (ui.lists.selected() === 'today') {
						ui.lists.updateCount();
					} else {
						ui.lists.updateCount();
					}

					//Expands Task
					ui.tasks.selected.expand($('#T' + (cli.storage.tasks.length - 1)));
				};
			};		
		});

		// EDIT TASK BUTTON
		$editBTN.click(function () {

			// Only run if at least one task is selected or expanded
			if ($('#tasks .selected').length || $('#tasks .expanded').length) {

				// Expand Selected
				if ($('#tasks .selected').length) {

					if ($('#tasks .expanded').length) {
						ui.tasks.selected.collapse($('#tasks li.expanded'));
					}

					ui.tasks.selected.expand($('#tasks .selected'));

				// Close expanded
				} else {
					if ($('#tasks .expanded').length) {
						ui.tasks.selected.collapse($('#tasks li.expanded'), "stay_selected");
					}
				}
			}
		});

		// DELETE TASK BUTTON
		$deleteBTN.click(function () {

			var id = ui.tasks.selected.getID();

			if (cli.storage.prefs.deleteWarnings) {

				cli.deleteTask(id);
				$('#T' + id).remove();
				ui.lists.updateCount();

				//Disable edit and delete button if there is no expanded or selected task
				if (!$('#tasks .selected').length && !$('#tasks .expanded').length) {
					$editBTN.addClass('disabled');
					$deleteBTN.addClass('disabled');
				}

			} else if ($tasks.find('.selected').length) {

				$warning
					.find('p').html($.i18n._('taskWarning')).parent()
					.find('.yes').html($.i18n._('yesTask')).parent().fadeIn(75)
					.find('.yes').off('click')
					.on('click', function () {
						$(this).parent().fadeOut(75);
						cli.deleteTask(id);
						$('#T' + id).remove();
						ui.lists.updateCount();

						//Disable edit and delete button if there is no expanded or selected task
						if (!$('#tasks .selected').length && !$('#tasks .expanded').length) {
							$editBTN.addClass('disabled');
							$deleteBTN.addClass('disabled');
						}
						$(document).off('click');

					})
					.parent().find('.no').off('click')
					.on('click', function () {
						$(this).parent().fadeOut(75);
						$(document).off('click');
					});

				//Closes when not clicked in square box
				setTimeout(function () {
					$(document).click(function () {
						$('#warning').fadeOut(75);
						$(document).off('click');
					});
				}, 100);
			}
		});



		/**********************************
			SIDEBAR
		**********************************/

		// ADD LIST BUTTON
		$addListBTN.click(function () {
			// Appends to UI
			$('#userLists').append('\
				<li id="L' + (cli.storage.lists.items.length) + '">\
					<div class="editIcon" title="' + $.i18n._('titleEditList') + '"></div>\
					<div class="delete" title="' + $.i18n._('titleDeleteList') + '"></div>\
					<div class="count">0</div>\
					<div class="view">\
						<p>' + $.i18n._('newList') + '</p>\
					</div>\
					<div class="edit">\
						<input type="text" value="' + $.i18n._('newList') + '">\
						<div class="save" title="' + $.i18n._('titleSaveList') + '">\
					</div>\
				</li>');

			// Makes it droppable
			$('#sidebar ul li').droppable('destroy').droppable(ui.lists.dropOptions);

			// Adds to CLI
			cli.list('', $.i18n._('newList')).add();

			// Clicks the new list
			$('#L' + (cli.storage.lists.items.length - 1)).click();
			ui.lists.openEditMode();
		});

		// DELETE LIST BUTTON
		$body.on('click', '#userLists li .delete', function () {

			if (cli.storage.prefs.deleteWarnings) {
				// Delete straight away, no questions asked
				ui.lists.remove(ui.lists.selected());

			} else {
				// Display warning modal
				$('#warning')
					.click(function (e) {
						e.stopPropagation();
						return false;
					})
					.find('p').html($.i18n._('listWarning')).parent()
					.find('.yes').html($.i18n._('yesList')).parent().fadeIn(75)
					.find('.yes').off('click')
					.on('click', function () {
						$(this).parent().fadeOut(75);
						var id = ui.lists.selected();
						ui.lists.remove(id);
						$(document).off('click');
					})
					.parent().find('.no').off('click')
					.on('click', function () {
						$(document).off('click');
						$(this).parent().fadeOut(75);
					});

				//Closes when not clicked in square box
				setTimeout(function () {
					$(document).click(function () {
						$('#warning').fadeOut(75);
						$(document).off('click');
					});
				}, 100);
			}
		});

		// SELECTING A LIST
		$body.on('click', '#sidebar ul li', function () {

			if (!$(this).hasClass('selected')) {

				$editBTN.addClass('disabled');
				$deleteBTN.addClass('disabled');
				$addBTN.removeClass('disabled');

				// Changes selected
				$('#sidebar ul li.selected').removeClass('selected');
				$(this).addClass('selected');

				ui.lists.closeEditMode();

				// Sends the id of the list to populate
				ui.tasks.populate(ui.lists.selected());
			}
		});

		// EDITING A LIST
		$body.on('click', '#sidebar .editIcon', function () {
			ui.lists.openEditMode();
		});

		// Enter Key closes list editing
		$body.on('keydown', '#sidebar input', function (e) {
			if (e.keyCode === 13) {
				ui.lists.closeEditMode();
			}
		});

		// Clicking the save button closes enter mode
		$body.on('click', '#sidebar ul li .save', function () {
			ui.lists.closeEditMode();
		});

		// LOGBOOK BUTTON
		$logbookBTN.click(function () {
			$addBTN.addClass('disabled');
			$editBTN.addClass('disabled');
			$deleteBTN.addClass('disabled');
			$sidebar.find('.selected').removeClass('selected');
			ui.tasks.populate('logbook');
		});

		/**********************************
			SETTINGS
		**********************************/

		// DROP DOWN MENU
		$settingsBTN.find('img').click(function () {
			$settingsBTN.find('ul').slideToggle(150);
		});
		$settingsBTN.find('li').click(function () {
			$settingsBTN.find('ul').fadeOut(100);
			ui.external.cmd($(this).attr('class'));
		});

		// CHECK BOXES [DELETE WARNINGS & LOW GRAPHICS MODE]
		$('#tabGeneral form input').change(function () {

			cli.storage.prefs.deleteWarnings = $('#deleteWarnings').prop('checked');
			cli.storage.prefs.gpu = $('#gpu').prop('checked');
			cli.storage.save();

			if ($(this).attr('id') === 'gpu') {
				toggleFx();
			}

			console.log('Settings Saved');
		});

		// NEXT AMOUNT
		$('#nextAmount').change(function () {

			cli.storage.prefs.nextAmount = this.value;
			cli.storage.save();

			if (ui.lists.selected() === 'next') {
				ui.tasks.populate('next');
			}

			console.log('Settings Saved');
		});

		// THEME
		$('#theme').change(function () {

			// Get value
			var theme = $(this)[0].value;

			// Set CSS file
			$('link.theme')
				.attr('href', 'css/themes/' + theme + '.css')
				.ready(function () {
					$(window).resize();
				});

			//Saves Theme
			cli.storage.prefs.theme = theme;
			cli.storage.save();
		});

		// SYNC
		$('#setUpSync').click(function() {
			$('#prefsDialog').fadeOut(150);
			$('#syncDialog').fadeIn(150);
		})

		/**********************************
			SCHEDULED TASKS
		**********************************/

		$('#scheduledDialog .inner .create').click(function() {

			var id = $(this).parent().parent().attr('data-type');

			

			//Calculates Date
			var date = parseInt($('#reviewNo').val());
			var unit = $('#reviewLength').val();

			//Zeros Days
			var today = new Date();
			today.setSeconds(0);
			today.setMinutes(0);
			today.setHours(0);
			var tmpdate = new Date()
			//tmpdate.setSeconds(0);
			//tmpdate.setMinutes(0);
			//tmpdate.setHours(0);


			if (unit == 'days') {
				today.setDate(today.getDate() + date);
			} else if (unit == 'weeks') {
				today.setDate(today.getDate() + (date * 7));
			} else if (unit == 'months') {
				today.setMonth(today.getMonth() + date);
			} else if (unit == 'years') {
				today.setYear(today.getFullYear() + date);
			};

			if (id == 'add') {
				if ($('#scheduledDialog input[type=radio]:checked').val() === 'scheduled') {
					//Creates a new Scheduled Task
					cli.scheduled.add('New Task', 'scheduled');

					//Edits Data inside of it
					var task = cli.scheduled.edit(cli.storage.lists.scheduled.length -1);

					//Calculates Difference
					//task.date = (Math.round((today.getTime() - tmpdate.getTime()) / 1000 / 60 / 60 /24));
					task.next = cli.calc.dateConvert(today);
					task.list = $('#reviewAction').val();

					//Saves
					cli.scheduled.edit(cli.storage.lists.scheduled.length -1, task);

				} else if ($('#scheduledDialog input[type=radio]:checked').val() === 'recurring') {

					var test = $('#recurNext').val();
					if (test == '' || new Date(test) == 'Invalid Date') {
						return;
					}
					//Creates a new Recurring Task
					cli.scheduled.add('New Task', 'recurring');	

					//Edits Data inside of it
					var task = cli.scheduled.edit(cli.storage.lists.scheduled.length -1);

					task.next = $('#recurNext').val();
					task.ends = $('#recurEnds').val();
					task.recurType = $('#recurType').val();

					if (task.recurType === 'daily') {
						task.recurInterval = [parseInt($('#recurSpecial input').val())];
					} else if (task.recurType === 'weekly') {
						var interval = [];

						$('#recurSpecial div').map(function() { 
							interval.push([parseInt($(this).children('input').val()), $(this).children('select').val(), task.next]);
						})

						task.recurInterval = interval;
					} else if (task.recurType == 'monthly') {
						var interval = [];

						$('#recurSpecial div').map(function() { 
							interval.push([1, parseInt($(this).children('.type').val()), 'day', task.next]);
						})

						task.recurInterval = interval;
					}

					//Saves
					cli.scheduled.edit(cli.storage.lists.scheduled.length -1, task);
				}

			} else {
				var task = cli.scheduled.edit(id.substr(2));

				if (id.substr(1,1) == 's') {
					
					//Edits Values
					task.next = cli.calc.dateConvert(today);
					task.list = $('#reviewAction').val();

				} else if (id.substr(1,1) == 'r') {
					task.next = $('#recurNext').val();
					task.ends = $('#recurEnds').val();
					task.recurType = $('#recurType').val();

					if (task.recurType === 'daily') {
						task.recurInterval = [parseInt($('#recurSpecial input').val())];
					} else if (task.recurType === 'weekly') {
						var interval = [];

						$('#recurSpecial div').map(function() { 
							interval.push([parseInt($(this).children('input').val()), $(this).children('select').val(), task.next]);
						})

						task.recurInterval = interval;
					} else if (task.recurType == 'monthly') {
						var interval = [];

						$('#recurSpecial div').map(function() { 
							interval.push([1, parseInt($(this).children('.type').val()), 'day', task.next]);
						})

						task.recurInterval = interval;
					}
				}

				//Saves
				cli.scheduled.edit(id.substr(2), task);
			}

			//Closes
			$('#scheduledDialog .inner').fadeOut(150);
			$('#scheduledDialog').hide(0);

			//Reschedule Schedule
			cli.scheduled.update();

			//Reload UI
			ui.tasks.populate('scheduled');
			ui.lists.updateCount();

		});
			
		$('#scheduledDialog .cancel').click(function() {
			$addBTN.click();
		});

		var weeks = '<input type="number"> weeks on <select><option value="1">Monday</option><option value="2">Tuesday</option><option value="3">Wednesday</option> <option value="4">Thursday</option> <option value="5">Friday</option> <option value="6">Saturday</option> <option value="0">Sunday</option></select>';
		var months = 'on the <select class="type"><option value="1">1st</option> <option value="2">2nd</option> <option value="3">3rd</option> <option value="4">4th</option> <option value="5">5th</option> <option value="6">6th</option> <option value="7">7th</option> <option value="8">8th</option> <option value="9">9th</option> <option value="10">10th</option> <option value="11">11th</option> <option value="12">12th</option> <option value="13">13th</option> <option value="14">14th</option> <option value="15">15th</option> <option value="16">16th</option> <option value="17">17th</option> <option value="18">18th</option> <option value="19">19th</option> <option value="20">20th</option> <option value="21">21st</option> <option value="22">22nd</option> <option value="23">23rd</option> <option value="24">24th</option> <option value="25">25th</option> <option value="26">26th</option> <option value="27">27th</option> <option value="28">28th</option> <option value="29">29th</option> <option value="30">30th</option> <option value="31">31st</option></select> day';

		$body.on('click', '.addRecur', function() {
			var length = $('#recurType').val();

			if (length === 'weekly') {
				$('#recurSpecial').append('<div>And ' + weeks + '<span class="removeRecur">-</span></div>')
			} else if (length === 'monthly') {
				$('#recurSpecial').append('<div>And ' + months + '<span class="removeRecur">-</span></div>')
			}
			
		});

		$body.on('click', '.removeRecur', function() {
			$(this).parent().remove();
		})

		//Date Picker
		$('#recurNext, #recurEnds').datepicker();

		$('#scheduledDialog input[type=radio]').on('change', function() {
			var toggle = $(this).val();

			if (toggle === 'scheduled') {
				$('#scheduledDialog .inner .schedule').show(0);
				$('#scheduledDialog .inner .recurring').hide(0);
			} else if (toggle === 'recurring') {
				$('#scheduledDialog .inner .schedule').hide(0);
				$('#scheduledDialog .inner .recurring').show(0);
			}
		});

		//First time:
		$('#recurSpecial').html('<table><tr><td>Every:</td><td><input type="number" min="1" value="7"> days</td></tr></table>');

		$('#recurType').on('change', function() {
			var toggle = $(this).val();

			if (toggle === 'daily') {
				$('#recurSpecial').html('<table><tr><td>Every:</td><td><input type="number" min="1" value="7"> days</td></tr></table>');
			} else if (toggle === 'weekly') {
				$('#recurSpecial').html('<div>Every ' + weeks + '<span class="addRecur">+</span></div>');
			} else if (toggle === 'monthly') {
				$('#recurSpecial').html('<div>Every month ' + months + '<span class="addRecur">+</span></div>');
			}
		});

		/**********************************
			CUSTOM BACKGROUNDS
		**********************************/

		// REMOVE CUSTOM BACKGROUND
		$('#removeBG').click(function () {
			localStorage.removeItem('background');
			$tasks[0].style.backgroundImage = 'none';
		});

		// DRAG AND DROP
		$body.bind({
			dragover: function () {
				// Stop the window from opening the file
				return false;
			},
			drop: function (e) {
				// Get the files from the event
				e = e || window.event;
				e.preventDefault();
				e = e.originalEvent || e;
				if (e.hasOwnProperty('files') || e.hasOwnProperty('dataTransfer')) {
					var files = (e.files || e.dataTransfer.files);
					setBG(files[0]);
					return false;
				}
			}
		});

		// BUTTON UPLOAD
		$('#chooseBG').change(function (e) {
			var files = $(this)[0].files;
			setBG(files[0]);
		});

		// Takes a file and sets it as the background
		var setBG = function (f) {
			var reader = new FileReader();
			reader.onload = function (event) {

				if (app === 'js') {
					localStorage.removeItem('background');
					localStorage.setItem('background', event.target.result);
				} else {
					cli.storage.prefs.background = event.target.result;
				}

				$tasks[0].style.backgroundImage = 'url(' + event.target.result + ')';
			};
			reader.readAsDataURL(f);
		};

		// BACKGROUND SIZE
		$('#backgroundSize').change(function () {
			cli.storage.prefs.bg.size = this.value;
			switch (this.value) {
				case 'tile':
					$tasks.removeClass('shrink zoom').addClass('tile');
					break;
				case 'shrink':
					$tasks.removeClass('tile zoom').addClass('shrink');
					break;
				case 'zoom':
					$tasks.removeClass('tile shrink').addClass('zoom');
					break;
			}
			cli.storage.save();
		});

		// HEADING COLOR
		$('#headingColor').change(function () {
			cli.storage.prefs.bg.color = this.value;
			cli.storage.save();

			$('#tasks h2, #tasks p').removeClass('light dark').addClass($(this)[0].value);
		});

		/**********************************
			WEB UI LOGIN THING
		**********************************/
		$('#login a').click(function() {
			var service = $(this).attr('class');

			//$('#tabSync a.icon[data-service=' + service + ']').click();
			// Run sync
			if (service == 'anon') {
				$('#login').hide(0);
			} else {
				//Syncs
				cli.storage.sync.run(service, function (result) {
					if(result) {
						$('#login').html('Success! Loading...')
					} else {
						alert('Sync failed :(')
					}
				});

				//Adds Logout Button
				$('#settingsBTN ul').append('<li class="logout">Logout</li>');
				if (cli.storage.prefs.sync.hasOwnProperty('access')) {
					$('#login').hide(0);
				}

				$('#tabSync').html('Not available on web version.');
				$('#settingsBTN ul .logout').click(function() {
					delete localStorage.jStorage;
					delete localStorage.background;
					window.location.reload();
				});
			}
			
		})

		/**********************************
			SYNC
		**********************************/
		
		if(cli.storage.prefs.sync.hasOwnProperty('access')) {
			var $tabSync = $('#tabSync');
			
			// Load settings
			$tabSync.find('.email').html(cli.storage.prefs.sync.email);
			$tabSync.find('.service').html(cli.storage.prefs.sync.service);
			
			// Show settings
			$tabSync.find('.connect').hide();
			$tabSync.find('.settings').show();
		}
		
		$('#tabSync a.icon').click(function() {
			
			var $tabSync = $('#tabSync'),
				service = $(this).data('service');
				
				
			// Run sync
			cli.storage.sync.run(service, function (result) {
				if(result) {
					$tabSync.find('.email').html(cli.storage.prefs.sync.email);
					$tabSync.find('.service').html(service);
					$tabSync.find('.waiting').hide(0);
					$tabSync.find('.settings').show(0);
				} else {
					alert('Sync failed :(')
				}
			});			
			
			var height = $tabSync.height();
			
			$tabSync.find('.connect').fadeOut(0, function() {
				$tabSync.height(height)
			});
			$tabSync.find('.waiting').show(0);
		});
		
		$('#tabSync button.cancel').click(function () {
			$('#tabSync').find('.waiting').hide(0);
			$('#tabSync').find('.connect').show(0);
		});
		
		$('#tabSync .logout').click(function () {
			var $tabSync = $('#tabSync');
			
			// Delete tokens from localstorage
			cli.storage.prefs.sync = {};
			cli.storage.save();
			
			// Go back to main page
			$tabSync.find('.settings').hide();
			$tabSync.find('.connect').show(); 
		});
		
		// SYNC TYPE
		$('#syncInterval').change(function () {
			var interval = this.value;
			switch (interval) {
			case 'auto':
				cli.storage.prefs.sync.active = false;
				setTimeout(function () {
					cli.storage.prefs.sync.active = true;
				}, 15000);
				break;
			case 'never':
				$syncBTN.addClass('disabled');
				cli.storage.prefs.sync.active = false;
				break;
			case 'timer':
				cli.storage.prefs.sync.active = true;
				var syncTimer = function () {
					if(cli.storage.prefs.sync.active) {
						cli.storage.sync.run();
						ui.sync.running();
						setTimeout(function() {
							syncTimer();
						}, cli.storage.prefs.sync.timer);
					}
				}
				syncTimer();
				break;
			default:
				cli.storage.prefs.sync.active = false;
			}
			
			cli.storage.prefs.sync.interval = interval;
			cli.storage.save();
		});

		// SYNC BUTTON
		$syncBTN.click(function () {
			if (cli.storage.prefs.sync.hasOwnProperty('access') && !$(this).is('.running') && cli.storage.prefs.sync !== 'never') {
				ui.sync.running('on');
				cli.storage.sync.run();
			} else if (!cli.storage.prefs.sync.hasOwnProperty('access')) {
				ui.external.cmd('syncSettings');
			} else {
				alert("Sync is turned off. You need to turn it back on to use this button.");
			}
		});



		/**********************************
			LOADING PREFERENCES
		**********************************/

		$('#deleteWarnings').prop('checked', cli.storage.prefs.deleteWarnings);
		$('#gpu').prop('checked', cli.storage.prefs.gpu);
		$('#nextAmount').val(cli.storage.prefs.nextAmount);
		$('#theme').val(cli.storage.prefs.theme);
		$('#backgroundSize').val(cli.storage.prefs.bg.size);
		$('#headingColor').val(cli.storage.prefs.bg.color);
		$('#syncInterval').val(cli.storage.prefs.sync.interval);

		// CUSTOM BACKGROUND
		if (localStorage.hasOwnProperty('background')) {
			$tasks[0].style.backgroundImage = 'url(' + localStorage.getItem('background') + ')';
		} else if (cli.storage.prefs.hasOwnProperty('background')) {
			$tasks[0].style.backgroundImage = 'url(' + cli.storage.prefs.background + ')';
		}

		$tasks.addClass(cli.storage.prefs.bg.size);

		// LANGUAGE
		$('#tabLanguage a.current').removeClass('current');
		$('#tabLanguage .language a').each(function () {
			if ($(this).data('value') === cli.storage.prefs.lang) {
				$(this).addClass('current');
			}
		});
		$('#tabLanguage').bind('click', function (e) {
			if ($(e.srcElement).is('.language a')) {
				cli.storage.prefs.lang = $(e.srcElement).data('value');
				cli.storage.save();

				window.location.reload();
				return false;
			}
		});



		/**********************************
			SEARCH
		**********************************/

		$('#search').keyup(function () {
			// Disable buttons
			$addBTN.addClass('disabled');
			$editBTN.addClass('disabled');
			$deleteBTN.addClass('disabled');

			// Get query and run search
			var query = this.value,
				results = cli.populate('search', query, ui.lists.selected());

			var taskResults = '';

			// Display results
			for(var i = 0; i < results.length; i++) {
				taskResults += ui.tasks.draw(results[i]);
			}

			if (query.length == 0) {
				ui.tasks.populate(ui.lists.selected());
				// Re-enable buttons
				$addBTN.removeClass('disabled');
			} else {
				if(results.length) {
					$tasks.html('<h2 class="' + cli.storage.prefs.bg.color + '">' + $.i18n._('searchResults') + query + '</h2><ul>' + taskResults + '</ul>')
				} else {
					$tasks.html('<h2 class="' + cli.storage.prefs.bg.color + '">' + $.i18n._('noResults') + '</h2><ul></ul>');
				}
			}
			
			
			
			
		});



		/**********************************
			REORDING TASKS
		**********************************/
		$('#userLists').sortable({
			containment: 'parent',
			axis: 'y',
			distance: 20,
			placeholder: 'listPlaceholder',
			stop: function (event, ui) {

				//Saves Everything, including order
				var listOrder = [];

				//Loops through lists & adds the to an array
				$('#userLists').children().map(function () {
					listOrder.push($(this).attr('id').substr(1).toNum());
				});

				//Saves
				cli.list().order(listOrder);
			}
		});

		$('#sidebar ul li').droppable(ui.lists.dropOptions);



		/**********************************
			SHOW MORE TASKS
		**********************************/

		$body.on('click', '#tasks .expandList', function () {
			var $parent = $(this).parent();
			var items = cli.populate('list', $parent.attr('id'));
			$parent.find('li, p').remove();
			for (var i in items) {
				if($('#T' + items[i]).length) {

				} else {
					$parent.addClass('wholeList').append(ui.tasks.draw(items[i]));
				}
				
			}
		});



		/**********************************
			OVERLAY
		**********************************/

		// OVERLAY
		$('#settingsOverlay').click(function () {
			$(this).hide(0);
			$('#prefsDialog, #aboutDialog, #donateDialog, #syncDialog').fadeOut(100);
		});

		// OVERLAY
		$('#overlay').click(function () {
			if ($('#date').css('display') !== 'block') {
				$deleteBTN.addClass('disabled');
				$editBTN.addClass('disabled');
				$tasks.find('.selected').removeClass('selected');
				ui.tasks.selected.collapse($('#tasks .expanded'));
				$('.settings').fadeOut(150);
			}
		});



		/**********************************
			TASKS
		**********************************/

		// KEYBOARD SHORTCUTS
		$body.on('keydown', '#tasks input', function (e) {
			if(e.keyCode === 13) {
				// $(this).parent().html($(this).val());
				$editBTN.click();
				return false;
			}
		});

		$body.on('keydown', '#tasks input, #tasks textarea', function (e) {
			if (e.keyCode === 27) {
				$editBTN.click();
				return false;
			}
		});

		// CHECKBOX
		$body.on('change', '#tasks input[type=checkbox]', function () {

			var id = $(this).closest('li').attr('id').substr(1).toNum();
			cli.logbook(id);

			if ($(this).prop('checked')) {
				$('#T' + id).addClass('logged');
			} else {
				$('#T' + id).removeClass('logged');
			}

			if ($('#T' + id + ' input[type=checkbox]').attr('checked') !== 'checked') {
				cli.today(id).calculate();
			}

			// Update list count
			ui.lists.updateCount();

		});

		// PRIORITY
		$body.on('click', '#tasks .priority', function () {

			// Get id of task
			var id = $(this).closest('li').attr('id').substr(1).toNum();

			// Remove old checkbox colour
			$('#T' + id).removeClass(cli.priority(id).get());

			// Update priority
			cli.priority(id).set();

			// Display priority (HTML and Class)
			$(this)
				.html($.i18n._(cli.priority(id).get()))
				.removeClass()
				.addClass(cli.priority(id).get() + ' priority');

			// Add new checkbox colour
			$('#T' + id).addClass(cli.priority(id).get());

		});

		// EDITING A TASK
		$body.on('click', '#tasks .todotxt', function (e) {

			$editBTN.removeClass('disabled');
			$deleteBTN.removeClass('disabled');

			ui.tasks.clicks++;
			setTimeout(function () {
				ui.tasks.clicks = 0;
			}, 300);

			var id = $(this).closest('li').attr('id').substr(1).toNum();

			if ($('#T' + id).hasClass('expanded')) {

				if (ui.tasks.clicks === 2 && id === ui.tasks.lastClicked) {

					//Close on double click
					$('#tasks .expanded .todotxt').blur();
					ui.tasks.selected.collapse($('#tasks .expanded'), "stay_selected");

				}

			} else {

				$('#tasks .selected:not(#T' + id + ')').removeClass('selected');
				$('#T' + id).toggleClass('selected');

				if (ui.tasks.clicks === 1) {

					ui.tasks.lastClicked = id;

				} else if (ui.tasks.clicks === 2 && id === ui.tasks.lastClicked) {

					ui.tasks.selected.collapse($('#tasks .expanded'));

					if (!$(this).parent().hasClass('expanded')) {

						ui.tasks.selected.expand($('#T' + id));

					}
				}

				/*if ($('#tasks ul li.selected').length == 0 && $('#tasks ul li.margin').length == 0) {
					$editBTN.addClass('disabled');
				};*/
			}
		});

		/**********************************
			SELECTED TASK
		**********************************/

		// SAVE NAME WHEN INPUT LOSES FOCUS
		$body.on('blur', '#tasks .todotxt input', function () {
			var id = $(this).closest('li').attr('id').substr(1).toNum();

			//Edit Data
			if (id.toString().substr(0, 1) === 's' || id.toString().substr(0, 1) === 'r') {
				var data = cli.scheduled.edit([id.toString().substr(1)]);
				data.content = convertStringToLink(this.value);
				cli.scheduled.edit([id.toString().substr(1)], data);
			} else {
				var data = cli.taskData(id).display();
				data.content = convertStringToLink(this.value);
				cli.taskData(id).edit(data);
			}
			
		});

		// SHOW IN TODAY BUTTON
		$body.on('click', '#tasks ul li .labels .today', function () {
			var id = $(this).closest('li').attr('id').substr(1).toNum();

			if ($(this).hasClass('inToday')) {
				// Takes out of today


				// Checkbox & Label
				$('#T' + id).removeClass('today');

				$(this).removeClass('inToday').html($.i18n._('showInToday'));

				// We need to remove the other node in Next
				if (ui.lists.selected() === 'next') {
					$('#next li.hidden').map(function () {
						if ($(this).attr('data-id').toNum() === id) {
							$(this).remove();
						}
					});
				}

				//Cli
				cli.today(id).remove();
				
			} else {
				//Adds to Today

				//Checkbox & Label
				$('#T' + id).addClass('today');
				$(this).addClass('inToday').html($.i18n._('removeFromToday'));

				if (ui.lists.selected() === 'next') {
					if (cli.taskData(id).display().list !== 'next') {
						$('#next').append('<li class="hidden" data-id="' + id + '"></li>');
					}
				}
				
				cli.today(id).add();
			}

			if (ui.lists.selected() === 'today') {
				ui.tasks.populate(ui.lists.selected());
			} else {
				ui.tasks.sortStop();
			}

			//Updates counts
			ui.lists.updateCount();
		});

		// SET DUE DATE
		$('#datepicker').datepicker({
			onSelect: function () {
				var id = $('#tasks .expanded').attr('id').substr(1).toNum();

				//Saves Date
				var task = cli.taskData(id).display();
				task.date = cli.calc.dateConvert($('#datepicker').datepicker('getDate'));

				//Draws the date label
				$('.date').removeClass().addClass('date ' + cli.calc.prettyDate.difference(task.date)[1]);

				cli.taskData(id).edit(task);

				//Edits UI
				$('#T' + id + ' .date').html(cli.calc.prettyDate.difference(task.date)[0]);

				//Runs a bunch of Today functions
				cli.calc.date(id);
				cli.today(id).calculate();

				if (cli.taskData(id).display().today === 'yesAuto' || cli.taskData(id).display().today === 'manual') {
					$('#tasks li.expanded div.labels span.today').addClass('inToday').html($.i18n._('removeFromToday'));
				} else if (cli.taskData(id).display().today === 'noAuto' || cli.taskData(id).display().today === 'false') {
					$('#tasks li.expanded div.labels span.today').removeClass('inToday').html($.i18n._('showInToday'));
				}

				ui.lists.updateCount();
			}
		}).children().show();

		// REMOVE DATE
		$('#removeDate').click(function () {
			var id = $('#tasks ul li.expanded').attr('id').substr(1).toNum();

			//Hides window thing
			$('#date').hide(0);
			$('#task' + id + ' .labels .date').html($.i18n._('setDueDate'));
			$(document).off('click');

			//Removes Date
			var data = cli.taskData(id).display();
			data.date = '';

			//Changes to false if yesAuto or noAuto
			if (data.today === 'yesAuto' || data.today === 'noAuto') {
				$('#task' + id + ' .labels .today').html($.i18n._('showInToday')).removeClass('inToday');
				data.today = 'false';
			}
			cli.taskData(id).edit(data);

			//Runs a bunch of Today functions
			cli.calc.date(id);
			cli.today(id).calculate();

			if (ui.lists.selected() === 'today') {
				ui.tasks.populate(ui.lists.selected());
			} else {
				ui.tasks.sortStop();
			}
			ui.lists.updateCount();
		});

		// CLOSE DATEPICKER
		$body.on('click', '.labels .date', function (e) {

			if (ui.lists.selected() === 'scheduled') {
				$('#scheduledDialog .inner').fadeToggle(150).attr('data-type', $(this).parent().parent().parent().attr('id'));
				$('#scheduledDialog').toggle(0);
				ui.tasks.scheduled('edit');
			} else {
				//Position of datepicker
				var pos = $(this).offset();
				var top;
				if (pos.top - 100 < 15 ) {
					top = 115;
				} else {
					top = $(this).offset().top;
				}

				$('#date').show();
				
				//Puts new data into date picker
				var id = $(this).closest('li').attr('id').substr(1).toNum();
				var date = cli.taskData(id).display().date;
				
				//Only populate date picker if it has a date
				if (date === '') {
					$('#datepicker').datepicker('setDate', new Date());
				} else {
					$('#datepicker').datepicker('setDate', date);
				}

				//Populate Show in today box
				$('#showTime').val(cli.taskData(id).display().showInToday);
					
				$('#date').css({'left': pos.left - 275, 'top': top - 100});

				$("#date").click(function (e) {
					e.stopPropagation();
					return false;
				});

				setTimeout(dateClose, 100);
			}

			function dateClose() {
				$(document).click(function () {
					//Hides Picker
					$('#date').hide();
					$(this).off('click');
					if (ui.lists.selected() === 'today') {
						ui.tasks.populate(ui.lists.selected());
					} else {
						ui.tasks.sortStop();
					}
				});
			}
		});

		/* Show in Today */
		$('#showTime').change(function () {
			var id = $('#tasks ul li.expanded').attr('id').substr(1).toNum();

			//Saves Date
			var task = cli.taskData(id).display();
			task.showInToday = this.value;

			cli.taskData(id).edit(task);

			//Runs a bunch of Today functions
			cli.calc.date(id);
			cli.today(id).calculate();

			if (cli.taskData(id).display().today === 'yesAuto' || cli.taskData(id).display().today === 'manual') {

				$('#tasks ul li.expanded .labels .today')
					.addClass('inToday')
					.html($.i18n._('removeFromToday'));

			} else if (cli.taskData(id).display().today === 'noAuto' || cli.taskData(id).display().today === 'false') {

				$('#tasks ul li.expanded .labels .today')
					.removeClass('inToday')
					.html($.i18n._('showInToday'));

			}
		});

		/* Notes */
		$body.on('blur', '#tasks ul li textarea', function () {
			var id = $(this).closest('li').attr('id').substr(1).toNum();

			//Edit Data
			if (id.toString().substr(0, 1) === 's' || id.toString().substr(0, 1) === 'r') {
				var data = cli.scheduled.edit([id.toString().substr(1)]);
				data.notes = this.value;
				cli.scheduled.edit([id.toString().substr(1)], data);
			} else {
				var data = cli.taskData(id).display();
				data.notes = this.value;
				cli.taskData(id).edit(data);
			}
		});
	},



	/**************************************************************
		SYNC
	**************************************************************/

	sync: {



		/**********************************
			SYNC BUTTON STYLES
		**********************************/

		running: function (type) {
			type = type || 'on';
			switch(type) {
				case 'on':
					$syncBTN.addClass('running');
					break;
				case 'off':
					$syncBTN.removeClass('running');
					break;
			}
		},
		active: function (type) {
			type = type || 'on';
			switch(type) {
				case 'on':
					if(cli.storage.prefs.sync.interval !== 'never' && cli.storage.prefs.sync.interval !== 'auto') {
						$syncBTN.addClass('active');
					}
					break;
				case 'off':
					$syncBTN.removeClass('active');
					break;
			}
		},
		
		
		
		/**********************************
			SYNC BUTTON STYLES
		**********************************/
		beforeunload: function (type) {
			type = type || 'on';
			switch(type) {
				case 'on':
					window.onbeforeunload = function () {
						return "Sync hasn't finished yet!"
					};
					break;
				case 'off':
					window.onbeforeunload = null;
					break;
			}	
		},



		/**********************************
			RELOAD UI
		**********************************/

		reload: function () {
			console.log("Reloading UI");
			
			// Ubind onbeforeunload
			ui.sync.beforeunload('off');

			// Stop sync icon
			ui.sync.active('off');
			ui.sync.running('off');

			// Get selected list
			var sel = ui.lists.selected();

			// Makes lists show up
			ui.lists.populate();

			// Display tasks
			ui.tasks.populate(sel);
			$('#' + sel).addClass('selected');

			ui.lists.updateCount();

			if (app == 'web') {
				$('#login').hide(0);
			}

		}
	},



	/**************************************************************
		LISTS
	**************************************************************/

	lists: {


		/**********************************
			GET SELECTED LIST
		**********************************/

		selected: function () {
			if($('#sidebar ul li.selected').length) {
				return $('#sidebar ul li.selected').attr('id').substr(1).toNum();
			} else {
				return 'logbook';
			}
		},



		/**********************************
			POPUPLATE SIDEBAR
		**********************************/

		populate: function () {

			var output = "";

			// Clear lists
			$userLists.html('');

			// Loop through lists and generate HTML for each list
			for (var i=0; i<cli.storage.lists.order.length; i++) {
				output += '\
					<li id="L' + cli.storage.lists.order[i] + '">\
						<div class="editIcon" title="' + $.i18n._('titleEditList') + '"></div>\
						<div class="delete" title="' + $.i18n._('titleDeleteList') + '"></div>\
						<div class="count"></div>\
						<div class="view">\
							<p>' + cli.storage.lists.items[cli.storage.lists.order[i]].name  + '</p>\
						</div>\
						<div class="edit">\
							<input type="text" value="' +  cli.storage.lists.items[cli.storage.lists.order[i]].name + '">\
							<div class="save" title="' + $.i18n._('titleSaveList') + '"></div>\
						</div>\
					</li>';
			}

			$userLists.html(output);
		},



		/**********************************
			START EDITING LIST
		**********************************/

		openEditMode: function () {
			$('#L' + ui.lists.selected()).addClass('edit');
			$('#L' + ui.lists.selected() + ' .view').hide(0);
			$('#L' + ui.lists.selected() + ' .edit').show(0);
			$('#L' + ui.lists.selected() + ' .edit input').select();

			ui.listEditMode = ui.lists.selected();
		},



		/**********************************
			FINISH EDITING LIST
		**********************************/

		closeEditMode: function () {
			if (ui.listEditMode !== 'none') {

				var newName = $('#L' + ui.listEditMode + ' .edit input').blur().val();

				$('#L' + ui.listEditMode).removeClass('edit');
				$('#L' + ui.listEditMode + ' .edit').hide(0);
				$('#L' + ui.listEditMode + ' .view p').html(newName).parent().show(0);

				ui.lists.updateCount();
				
				$('#tasks h2').html(newName);

				// Renames list
				cli.list(ui.listEditMode, newName).rename();
				ui.listEditMode = 'none';

			}
		},


		/**********************************
			DELETE LIST
		**********************************/

		remove: function (id) {
			// Deletes list
			cli.list(id).remove();

			// Close edit mode
			ui.listEditMode = 'none';

			// Get list
			var $listToDelete = $('#L' + id);

			// Removes list from sidebar and then selects a new one
			if($('#userLists li').length === 1) {
				// The last list left -> select next list
				$listToDelete.remove();
				$('#Lnext').click();
			} else if($listToDelete.is(':last-child')) {
				// The list is at the bottom -> Select the one above it
				$listToDelete.prev().click().next().remove();
			} else {
				// The list has one below it -> select it
				$listToDelete.next().click().prev().remove();
			}
			
			ui.lists.updateCount();
		},



		/**********************************
			UPDATE LIST COUNT
		**********************************/

		updateCount: function () {
			$('#sidebar li').map(function () {
				$(this).find('.count').html(cli.populate('list', $(this).attr('id').substr(1).toNum()).length);
			});
		},



		/**********************************
			MOVING A TASK TO A NEW LIST
		**********************************/

		dropOptions: {
			hoverClass: "dragHover",
			accept: '#tasks li',
			drop: function (event, uix) {
				var listId = $(this).attr('id').substr(1).toNum(),
					taskId = $(uix.draggable).attr('id').substr(1).toNum();

				//Next list if task is dropped into same list
				if (ui.lists.selected() === 'next') {
					if (cli.taskData(taskId).display().list === $(event.target).attr('id').substr(1).toNum()) {
						return;
					}
				}

				//If item in Today is added to today
				if ($(event.target).attr('id').substr(1).toNum() === 'today') {
					cli.today(taskId).add();
				} else {
					//Moves Task
					cli.moveTask(taskId, listId);
				}

				//Updates Tasks
				ui.tasks.populate(ui.lists.selected());

				//Update Counts
				ui.lists.updateCount();
			}
		}
	},



	/**************************************************************
		TASKS
	**************************************************************/

	tasks: {
		clicks: 0,
		lastClicked: "",

		scheduled: function(type) {
			if (type == 'edit') {
				var id = $('#scheduledDialog .inner').attr('data-type');

				//Fills in Values
				var task = cli.scheduled.edit(id.substr(2));
				var text = 'Edit';

				if (id.substr(1,1) == 's') {
					
					//Zeros Days
					var today = new Date();
					today.setSeconds(0);
					today.setMinutes(0);
					today.setHours(0);
					var tmpdate = new Date(task.next)

					var no = (Math.round((tmpdate.getTime() - today.getTime()) / 1000 / 60 / 60 /24)),
						length = 'days',
						action = task.list;
					
					//Hides Bits of UI
					$('#scheduledDialog .inner .schedule').show(0);
					$('#scheduledDialog .inner .recurring').hide(0);
					

				} else if (id.substr(1,1) == 'r') {
					//Hides Bits of UI
					$('#scheduledDialog .inner .schedule').hide(0);
					$('#scheduledDialog .inner .recurring').show(0);

					//Changes UI
					$('#recurType').val(task.recurType).change();

					if (task.recurType == 'daily') {
						$('#recurSpecial input').val(task.recurInterval[0]);
					} else if (task.recurType == 'weekly') {
						for (var i=0; i<task.recurInterval.length; i++) {
							if (i != 0) {
								$('.addRecur').click()
							}
							//Puts data in
							$($('#recurSpecial div')[i]).children('input').val(task.recurInterval[i][0]);
							$($('#recurSpecial div')[i]).children('select').val(task.recurInterval[i][1]);
						}
					} else if (task.recurType == 'monthly') {
						for (var i=0; i<task.recurInterval.length; i++) {
							if (i != 0) {
								$('.addRecur').click()
							}
							//Puts data in
							$($('#recurSpecial div')[i]).children('.type').val(task.recurInterval[i][1]);
						}
					}

					$('#recurNext').val(task.next);
					$('#recurEnds').val(task.ends);
				}

				$('.radioscheduled').hide(0);

			} else {
				var no = 5,
					length = 'days',
					action = 'today',
					text = 'Create';

				$('.radioscheduled').show(0);
				$('#scheduledDialog .inner .schedule').show(0);
				$('#scheduledDialog .inner .recurring').hide(0);

				
			}

			//Updates UI
			$('#reviewNo').val(no);
			$('#reviewLength').val(length);
			$('#reviewAction').val(action);
			$('#scheduledDialog .inner .create').html(text)

		},

		/**********************************
			POPULATE LIST WITH TASKS
		**********************************/

		populate: function (id) {

			// Get task IDs in that list
			var items = cli.populate('list', id);

			// LOGBOOK

			if (id === 'logbook') {
				$tasks.html('<h2 class="' + cli.storage.prefs.bg.color + '">' + $.i18n._('logbook') + '</h2><ul id="logbook"></ul>');

				// Populates
				var content = '';
				for (var i = 0; i < items.length; i++) {
					content += ui.tasks.draw(items[i]);
				}
				$('#tasks ul').html(content);

				//If nothing is logged, a description appears
				if (items.length === 0) {
					$tasks.append('<div class="explanation">' + $.i18n._('logbookText') + '</div>');
				}

				//Breaks loop
				return;
			}

			// Clears page
			$tasks.html('');
			
			// NEXT - MULTIPLE LISTS

			if (id === 'next' && cli.storage.prefs.nextAmount !== 'noLists') {

				for (var i = 0; i < cli.storage.lists.order.length; i++) {

					var listData = cli.storage.lists.items[cli.storage.lists.order[i]],
						newListItems = cli.populate('list', cli.storage.lists.order[i]);

					if (newListItems.length !== 0) {

						// Makes a new section for a new list
						$tasks.append('<h2 class="' + cli.storage.lists.order[i] + " " + cli.storage.prefs.bg.color + '">' + listData.name + '</h2><ul id="' + cli.storage.lists.order[i] + '"></ul>');

						// Loop inside a loop. Loopception...
						for (var l = 0; l < newListItems.length; l++) {

							if (l === 3 && cli.storage.prefs.nextAmount === 'threeItems') {

								// Because english matters
								if (newListItems.length - 3 === 1) {
									$('#tasks ul#' + cli.storage.lists.order[i]).append('<p class="expandList ' + cli.storage.prefs.bg.color + '">' + $.i18n._('oneMore') + '</p>');
								} else {
									$('#tasks ul#' + cli.storage.lists.order[i]).append('<p class="expandList ' + cli.storage.prefs.bg.color + '">' + $.i18n._('morethanOne', [newListItems.length - 3]) + '</p>');
								}
								break;
							}

							//Draws each task in the new list
							$('#tasks ul#' + cli.storage.lists.order[i]).append(ui.tasks.draw(newListItems[l]));
						}
					}
				}
			}

			switch(ui.lists.selected()) {
				case 'today':
					$tasks.prepend('<h2 class="' + cli.storage.prefs.bg.color + '">' + $.i18n._('today') + '</h2><ul id="' + id + '"></ul>');
					break;
				case 'next':
					$tasks.prepend('<h2 class="' + cli.storage.prefs.bg.color + '">' + $.i18n._('next') + '</h2><ul id="' + id + '"></ul>');
					break;
				case 'someday':
					$tasks.prepend('<h2 class="' + cli.storage.prefs.bg.color + '">' + $.i18n._('someday') + '</h2><ul id="' + id + '"></ul>');
					break;
				case 'scheduled':
					$tasks.prepend('<h2 class="' + cli.storage.prefs.bg.color + '">Scheduled</h2><ul id="' + id + '"></ul>');
					break;
				case 'all':
					$addBTN.addClass('disabled');
					$tasks.prepend('<h2 class="' + cli.storage.prefs.bg.color + '">' + $.i18n._('all') + '</h2><ul id="' + id + '"></ul>');
					break;
				default:
					$tasks.prepend('<h2 class="' + cli.storage.prefs.bg.color + '">' + cli.storage.lists.items[id].name + '</h2><ul id="' + id + '"></ul>');
					break;
			}
			
			taskshtml = '';

			//Populates
			for (var i=0; i < items.length; i++) {
				if ($('#T' + items[i]).length) {
					// Task already exists
					taskshtml += '<li class="hidden" data-id="' + items[i] + '"></li>';
				} else {
					taskshtml += ui.tasks.draw(items[i]);
				}
			}

			//Less Reflows == Better
			$('#tasks ul#' + id).html(taskshtml)

			//If there are no tasks, there is an explanation
			if (items.length === 0 && $('#tasks ul').length === 1) {

				var reason;

				switch(ui.lists.selected()) {
					case 'today':
						reason = $.i18n._('todayText');
						break;
					case 'next':
						reason = $.i18n._('nextText');
						break;
					case 'someday':
						reason = $.i18n._('somedayText');
						break;
					default:
						reason = $.i18n._('customText');
						break;
				}

				$tasks.append('<div class="explanation">' + reason + '</div>');
			}

			if (ui.lists.selected() == 'scheduled' || ui.lists.selected() == 'all') {
				//No sorting in scheduled or all tasks.
				return;
			}

			$('#tasks ul').sortable({
				placeholder: "placeholder",
				distance: 20,
				appendTo:'body',
				items: 'li',
				cursorAt: {
					top:15,
					left:15
				},
				scroll: false,
				connectWith: $('#tasks ul'),
				helper: function () {
					return $("<div class='dragbox'></div>");
				},
				stop: function (event, elem) {

					var from = event.target.id,
						to = $(elem.item).parent().attr('id'),
						id = $(elem.item).attr('id').substr(1).toNum(),
						data = cli.taskData(id).display();

					// If the list has been changed...
					if (from !== to) {
						data.list = to;
						cli.taskData(id).edit(data);
					}

					ui.tasks.sortStop(event, elem);

					// If on the motherfucking three mode.
					// Fuck fuck I've spent two fucking hours making this work
					if (ui.lists.selected() === 'next') {
						if(cli.storage.prefs.nextAmount === 'threeItems') {
							ui.tasks.populate('next');
						}

						// Recomment in if it breaks something!
						// cli.today(id).calculate()
						ui.lists.updateCount();
					}
				}
			});
		},



		/**********************************
			SOMETHING TO DO WITH SORTING
		**********************************/

		sortStop: function (event, elem) {
			
			// Removes duplicates from next list (if any)
			if (ui.lists.selected() === 'next') {

				var hiddenValues = [];

				$('#next .hidden').map(function () {
					hiddenValues.push($(this).attr('data-id'));
				});

				for (var i=0; i<hiddenValues.length; i++) {

					//If it is next & has a hidden item, remove the hidden item
					if ($('#next #T' + hiddenValues[i]).length) {
						$('#next li[data-id=' + hiddenValues[i] + ']').remove();
						console.log('Hidden Item: ' + hiddenValues[i] + ' removed!');
					}
				}
			}

			var taskOrder = [];

			$('#tasks ul#' + ui.lists.selected()).children('li').map(function () {

				if ($(this).children('input[type=checkbox]').attr('checked')) {
					//Log item
				} else {
					if ($(this).hasClass('hidden')) {
						taskOrder.push($(this).attr('data-id'));
					} else {
						var id = $(this).attr('id').substr(1).toNum();
						taskOrder.push(id);
					}
				}
			});
			cli.list(ui.lists.selected()).taskOrder(taskOrder);

			if (ui.lists.selected() === 'next') {
				//Special Next list
				if (cli.storage.prefs.nextAmount !== 'noLists') {
					for (var i=0; i<cli.storage.lists.order.length; i++) {
						//Gotta love loopception 
						var tmpOrder = [];
						$('#tasks ul#' + cli.storage.lists.order[i]).children('li').map(function () {
							
							if ($(this).children('input[type=checkbox]').attr('checked')) {
								//Log item
							} else {
								var id = $(this).attr('id').substr(1).toNum();
								tmpOrder.push(id);
							}

						});

						if (cli.storage.prefs.nextAmount === 'threeItems') {
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
				ui.lists.updateCount();
			}

			// Deletes empty lists
			$('#tasks ul:not(#next)').map(function () {
				if ($(this).children().length === 0) {
					$('#tasks h2.' + $(this).attr('id')).remove(); $(this).remove();
				}
			});
		},



		/**********************************
			GENERATE HTML FOR A TASK
		**********************************/

		draw: function (id) {

			if (id.toString().substr(0,1) === 's' || id.toString().substr(0,1) === 'r') {
				var data = cli.storage.lists.scheduled[parseInt(id.toString().substr(1))];
			} else {
				var data = cli.taskData(id).display();
			};

			// CHECKBOX
			var priority = "";
			if (data.priority !== 'none') {
				priority = 'class="' + data.priority + '" ';
			}
			// TODAY LABEL
			var today = "";
			if (ui.lists.selected() !== 'today') {
				if (data.today === 'yesAuto' || data.today === 'manual') {
					today = '<span class="todayLabel">' + $.i18n._('doToday') + '</span>';
				}
			}
			

			// DATE LABEL
			var date = "";
			if (data.date !== '') {
				date = '<span class="dateLabel ' + cli.calc.prettyDate.difference(data.date)[1] + '">' + cli.calc.prettyDate.difference(data.date)[0] + '</span>';
			};

			// NOTES
			var notes = "";
			if (data.notes !== '') {
				//TODO: Breaks firefox! Fix it later
				//notes = '<span class="notesIcon"></span>'
			}

			var logged = '';
			if (id.toString().substr(0,1) === 'r') {
				var checkbox = '<img src="images/recur.png">';
			} else if (id.toString().substr(0,1) === 's') {
				var checkbox = '<img src="images/scheduled.png">';
			} else if (cli.storage.tasks[id] && cli.storage.tasks[id].logged == true || cli.storage.tasks[id] && cli.storage.tasks[id].logged == 'true') {
				var checkbox = '<input type="checkbox" checked>';
				var logged = 'class="logged"'
			} else {
				var checkbox = '<input type="checkbox">';
			}

			return '<li ' + priority + 'id="T' + id + '" ' + logged + '><div class="boxhelp"><div class="checkbox">' + checkbox + '</div><div class="todotxt">' + data.content + '</div>' + notes + '<div class="labels">' + today + date + '</div></div></li>';
		},

		selected: {


			/**********************************
				GET SELECTED TASK ID
			**********************************/

			getID: function () {
				if($tasks.find('.selected').length) {
					return $tasks.find('.selected').attr('id').substr(1).toNum();
				} else if($tasks.find('.expanded').length) {
					return $tasks.find('.expanded').attr('id').substr(1).toNum();
				} else {
					return '';
				}
			},



			/**********************************
				EXPAND A TASK
			**********************************/

			expand: function (task) {
				task.addClass('expanded').removeClass('selected');
				var id = task.attr('id').substr(1).toNum();

				//Use the correct data store
				if (ui.lists.selected() === 'scheduled') {
					id = id.substr(1);
					var taskData = cli.storage.lists.scheduled[id];
				} else {
					var taskData = cli.taskData(id).display();
				};
				
				//Draws the Today Label
				var today = '';
				if (ui.lists.selected() !== 'scheduled') {
					if (taskData.today === 'manual' || taskData.today === 'yesAuto') {
						today = '<span class="today inToday">' + $.i18n._('removeFromToday') + '</span>';
					} else {
						today = '<span class="today">' + $.i18n._('showInToday') + '</span>';
					}
				}

				var date;
				//We'll do something special here later =)
				if (ui.lists.selected() === 'scheduled') {
					date = '">Schedule';
				} else {
					if (taskData.date === '') {
						date = '">' + $.i18n._('setDueDate');
					} else {
						date = cli.calc.prettyDate.difference(taskData.date)[1] + '">' + cli.calc.prettyDate.difference(taskData.date)[0];
					}
				}

				taskData.content = convertLinkToString(taskData.content);

				//Adds expanded data
				task.children().children('.todotxt').html('<input type="text" placeholder="' + $.i18n._('taskName') + '" value="' + taskData.content + '">').children('input').focus();
				task.children().children('.labels').html(today + '<span class="priority ' + taskData.priority + '">' + $.i18n._(taskData.priority) + '</span><span class="date ' + date + '</span>');
				task.append('<div class="hidden"><textarea placeholder="' + $.i18n._('notes') + '">' + taskData.notes + '</textarea></div>');

				//Auto resize
				$('#content textarea').TextAreaExpander(0, 400);

				//Animations
				task.addClass('margin').children('.boxhelp').children('.todotxt').children('input').select();
				task.children('.hidden').slideDown(150);
			},



			/**********************************
				COLLAPSE A TASK
			**********************************/

			collapse: function (id, staySelected) {
				if (id.attr('id')) {

					//Gets taskData
					var data = id.attr('id').substr(1).toNum();
					var taskData = cli.taskData(data).display();

					//Calculates labels
					if (ui.lists.selected() !== 'today' && ui.lists.selected() !== 'scheduled') {
						//Draws the today label
						if (taskData.today === 'yesAuto' || taskData.today === 'manual') {
							today = '<span class="todayLabel">' + $.i18n._('doToday') + '</span>';
						} else if (taskData.today === 'noAuto' || taskData.today === 'false') {
							today = '';
						}
					} else {
						today = '';
					}

					var date;
					//Draws the date label
					if (ui.lists.selected() === 'scheduled') {
						//Add a countdown thing
						date = ''
					} else {
						if (taskData.date !== '') {
							date = '<span class="dateLabel ' + cli.calc.prettyDate.difference(taskData.date)[1] + '">' + cli.calc.prettyDate.difference(taskData.date)[0] + '</span>';
						} else {
							date = '';
						}
					}
					

					//Turns edit mode off
					id.children().children('.todotxt').html(convertStringToLink(id.find('input[type="text"]').val()));
					id.children().children('.labels').html(today + date);

					//Animations
					id.children('.hidden').slideUp(150);
					id.addClass('deletion').removeClass('margin');
					setTimeout(function () {
						$('#tasks ul li.deletion .hidden').remove();
						$('#tasks ul li.deletion').removeClass('deletion expanded');
						if(staySelected) {
							$(id).addClass('selected');
						}
					}, 150);
				}
			}
		}
	},
	external: {



		/**********************************
			KEYBOARD SHORTCUTS
		**********************************/

		key: function () {
			key('up, k', function () {ui.external.cmd('prevTask');});
			key('down, j', function () {ui.external.cmd('nextTask');});
			key('⌘+up, ⌘+k', function () {ui.external.cmd('moveTaskUp');});
			key('⌘+down, ⌘+j', function () {ui.external.cmd('moveTaskDown');});

			key('⇧+up, ⇧+k, i', function () {ui.external.cmd('prevList');});
			key('⇧+down, ⇧+j, u', function () {ui.external.cmd('nextList');});
			key('⇧+⌘+up, ⇧+⌘+k', function () {ui.external.cmd('moveListUp');});
			key('⇧+⌘+down, ⇧+⌘+j', function () {ui.external.cmd('moveListDown');});

			key('space', function () {ui.external.cmd('check');});
			key('enter', function () {ui.external.cmd('editTask'); return false;});
			key('⌘+enter', function () {ui.external.cmd('editList'); return false;});

			key('delete', function() {ui.external.cmd('delete');});

			key('f', function () {ui.external.cmd('find'); return false;});
			key('p', function () {ui.external.cmd('prefs');});
			// key('a', function () {ui.external.cmd('about');});
			// key('h', function () {ui.external.cmd('help');});

			key('n, t', function () {ui.external.cmd('newtask'); return false;});
			key('l', function () {ui.external.cmd('newlist'); return false;});
			key('s', function () {ui.external.cmd('sync');});

			key('1', function () {ui.external.cmd('today');});
			key('2', function () {ui.external.cmd('next');});
			key('3', function () {ui.external.cmd('someday');});
			key('4', function () {ui.external.cmd('logbook');});

			key('esc', function() {ui.external.cmd('escape');});
		},



		/**********************************
			COMMAND WRAPPERS
		**********************************/

		cmd: function (cmd) {
			// Contains all the commands

			switch(cmd) {
				// File Menu
				case 'newtask':
					$addBTN.click();
					break;
				case 'newlist':
					$addListBTN.click();
					break;
				case 'sync':
					$('#prefsDialog').fadeIn(100);
					$('a[data-target=#tabSync]').tab('show');
					$('#settingsOverlay').show(0);
					break;

				// Edit Menu
				case 'find':
					$('#search').focus();
					break;
				case 'prefs':
					$('#prefsDialog').fadeToggle(150);
					$('a[data-target=#tabGeneral]').tab('show');
					$('#settingsOverlay').toggle(0);
					break;

				// GoTo
				case 'today':
					$('#todayList').click();
					break;
				case 'next':
					$('#nextList').click();
					break;
				case 'someday':
					$('#somedayList').click();
					break;
				case 'logbook':
					$logbookBTN.click();
					break;

				// View menu
				case 'language':
					$('#prefsDialog').fadeToggle(150);
					$('a[data-target=#tabLanguage]').tab('show');
					$('#settingsOverlay').toggle(0);
					break;
				case 'theme':
					$('#prefsDialog').fadeToggle(150);
					$('a[data-target=#tabTheme]').tab('show');
					$('#settingsOverlay').toggle(0);
					break;
				case 'syncSettings':
					$('#prefsDialog').fadeToggle(150);
					$('a[data-target=#tabSync]').tab('show');
					$('#settingsOverlay').toggle(0);
					break;

				// Help Menu
				case 'about':
					$('#aboutDialog').fadeToggle(150);
					$('#settingsOverlay').toggle(0);
					break;
				case 'donors':
					$('#donateDialog').fadeToggle(150);
					$('#settingsOverlay').toggle(0);
					break;
				case 'donate':
					window.location = 'http://nitrotasks.com/donate.html';
					break;
				case 'help':
					window.location = 'http://nitrotasks.com/help';
					break;
				case 'bug':
					window.location = 'https://github.com/stayradiated/Nitro/issues';
					break;

				// Extra stuff for keyboard shortcuts
				case 'editTask':
					$editBTN.click();
					break;
				case 'editList':
					$('.selected .editIcon').click();
					break;
				case 'check':
					$('.selected input[type=checkbox]').click();
					break;
				case 'delete':
					if($warning.is(':visible')) $("#overlay").click();
					else $deleteBTN.click();
					break;

				case 'prevTask':
					if(!$('#tasks .selected').length) {
						$('#tasks li').first().addClass('selected');
					} else {
						if(ui.lists.selected() === 'next') {
							if($('#tasks .selected').is(':first-of-type')) {
								$('#tasks .selected').parent().prev().prev().find('li').last().find('.todotxt').click();
							} else {
								$('#tasks .selected').prevAll('li:not(".hidden")').first().find('.todotxt').click();
							}
						} else {
							$('#tasks .selected').prev('li').find('.todotxt').click();
					}
					}
					
					break;
				case 'nextTask':
					if(!$('#tasks .selected').length) {
						$('#tasks li').first().addClass('selected');
					} else {
						if(ui.lists.selected() === 'next') {
							if($('#tasks .selected').is(':last-of-type')) {
								$('#tasks .selected').parent().next().next().find('li').first().find('.todotxt').click();
							} else {
								$('#tasks .selected').nextAll('li:not(".hidden")').first().find('.todotxt').click();
							}
						} else {
							$('#tasks .selected').next('li').find('.todotxt').click();
						}
					}
					break;
				case 'prevList':
					if(!$('#sidebar .selected').length) {
						$('#sidebar li').first().click();
					} else if ($('#sidebar .selected').is(':first-of-type')) {
						$('#sidebar .selected').parent().prev('h2').prev('ul').find('li').last().click();
					} else {
						$('#sidebar .selected').prev('li').click();
					}
					break;
				case 'nextList':
					if(!$('#sidebar .selected').length) {
						$('#sidebar li').first().click();
					} else if ($('#sidebar .selected').is(':last-of-type')) {
						$('#sidebar .selected').parent().next('h2').next('ul').find('li').first().click();
					} else {
						$('#sidebar .selected').next('li').click();
					}
					break;

				case 'moveTaskUp':
					if($('#tasks .selected').length) {
						var id = ui.tasks.selected.getID(),
							$parent = $('#T' + id).parent();

						if(ui.lists.selected() === 'next') {
							var l = cli.storage.lists.items[$parent.attr('id')].order,
								i = l.indexOf(id);
						} else {
							var	l = cli.storage.lists.items[ui.lists.selected()].order,
								i = l.indexOf(id);
						}

						if(i > 0) {
							l.splice(i, 1);
							l.splice(i - 1, 0, id);

							if($parent.is('.wholeList')) {
								$parent.find('li, p').remove();
								for (var i in l) {
									$parent.addClass('wholeList').append(ui.tasks.draw(l[i]));
								}
							} else {
								ui.tasks.populate(ui.lists.selected());
							}

							$('#T' + id).addClass('selected');
							cli.storage.save();
						}
					}
					break;
				case 'moveTaskDown':
					if($('#tasks .selected').length) {
						var id = ui.tasks.selected.getID(),
							$parent = $('#T' + id).parent();

						if(ui.lists.selected() === 'next') {
							var l = cli.storage.lists.items[$parent.attr('id')].order,
								i = l.indexOf(id);
						} else {
							var	l = cli.storage.lists.items[ui.lists.selected()].order,
								i = l.indexOf(id);
						}

						if(i > -1 && !$('#T' + id).is(':last-of-type')) {
							l.splice(i, 1);
							l.splice(i + 1, 0, id);

							if($parent.is('.wholeList')) {
								$parent.find('li, p').remove();
								for (var i in l) {
									$parent.addClass('wholeList').append(ui.tasks.draw(l[i]));
								}
							} else {
								ui.tasks.populate(ui.lists.selected());
							}

							$('#T' + id).addClass('selected');
							cli.storage.save();
						}
					}
					break;
				case 'moveListUp':
					var id = ui.lists.selected(),
						l = cli.storage.lists.order,
						i = l.indexOf(id);
					if(i > 0) {
						l.splice(i, 1);
						l.splice(i - 1, 0, id);
						ui.lists.populate();
						$('#L' + id).addClass('selected');
						cli.storage.save();
					}
					break;
				case 'moveListDown':
					var id = ui.lists.selected(),
						l = cli.storage.lists.order,
						i = l.indexOf(id);
					if(i > -1) {
						l.splice(i, 1);
						l.splice(i + 1, 0, id);
						ui.lists.populate();
						$('#L' + id).addClass('selected');
						cli.storage.save();
					}
					break;

				case 'escape':
					$('#overlay, #settingsOverlay').click();
					break;
			}
		}
	},



	/**************************************************************
		LANGUAGE
	**************************************************************/

	language: function (data) {
		$.i18n.setDictionary(data);

		// Adds in Translations
		$('.translate').map(function () {
			$(this).html($.i18n._($(this).attr('data-translate')));
		});

		// Adds in Translated Title Text
		$('.translateTitle').map(function () {
			$(this).attr('title', $.i18n._($(this).attr('data-translate')));
		});

		// Search is placeholder - needs to be done manually
		$('#search').attr('placeholder', $.i18n._('search'));

		// Date Picker
		var i = 1;
		$('#showTime').children().map(function () {
			if (i === 1) {
				$(this).text($.i18n._('1day'));
			} else if (i === 15) {
				$(this).text($.i18n._('never'));
			} else {
				$(this).text($.i18n._('moreday', [i]));
			}
			i++;
		});

		// jQuery UI Locales
		if ($.i18n._('jqueryui') !== 'en') {
			$body.append('<script src="js/translations/cal/' + $.i18n._('jqueryui') + '"></script');
		}

		// This has to be done after language
		// Resizes tasks
		ui.init();
		ui.lists.updateCount();
		ui.tasks.populate(ui.lists.selected());
	}
};

/* Konami Code */
var kkeys = [],
konami    = '38,38,40,40,37,39,37,39,66,65';

$(document).keydown(function(e) {
	kkeys.push(e.keyCode);
	if (kkeys.toString().indexOf( konami ) >= 0) {
		$(document).unbind('keydown');
		$body.append('<section id="song"><a onclick="play(\'george\')" href="#"><img src="images/george.png"></a><a onclick="play(\'jono\')" href="#"><img src="images/jono.png"></a></section>');
		$('#song').fadeIn(300);
	}
});

function play(developer) {
	//Gets Data from server
	$.getJSON('http://nitrotasks.com/music/?callback=?', function (data) {
		var music;
		if (developer === 'george') {
			music = data[0];
		} else if (developer === 'jono') {
			music = data[1];
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