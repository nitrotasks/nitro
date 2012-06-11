/* Nitro Scheduled & Recurring Plugin
 * By Jono Cooper & George Czabania
 * Licensed under the BSD License
 */
plugin.add(function() {
	//Creates Scheduled List if it doesn't already exist
	if(!core.storage.lists.items.scheduled) { 
		core.storage.lists.items.scheduled = {order: [], time: {name: 0, order: 0}};
	}
	
	//Creates a list item
	var markup = Mustache.to_html(templates.list, {
		id: 'scheduled',
		name: $l._('scheduled')
	})

	//Nice shorthand Method
	$l = $.i18n;

	//Adds to Sidebar
	$('#Lnext').after(markup)
	var $this = $('#Lscheduled')

	//Updates Count
	$this.find('.count').html(core.list('scheduled').populate().length)

	$('body').append('\
		<div id="scheduledDialog">\
			<div class="inner">\
				<table>\
					<tr class="radioscheduled">\
						<td><input type="radio" name="scheduledtype" id="scheduledRadio" value="scheduled" checked></td>\
						<td><label for="scheduledRadio" class="translate" data-translate="scheduled"></label></td>\
					</tr>\
					<tr class="radioscheduled bottom">\
						<td><input type="radio" name="scheduledtype" value="recurring" id="recurringRadio"></td>\
						<td><label for="recurringRadio" class="translate" data-translate="recurring"></label><br></td>\
					</tr>\
					<tr class="schedule">\
						<td>\
							<label for="reviewNo" class="translate" data-translate="reviewNo"></label>\
						</td>\
						<td>\
							<input id="reviewNo" min="1" type="number">\
							<select id="reviewLength">\
								<option value="days" class="translate" data-translate="days"></option>\
								<option value="weeks" class="translate" data-translate="weeks"></option>\
								<option value="months" class="translate" data-translate="months"></option>\
								<option value="years" class="translate" data-translate="years"></option>\
							</select>\
						</td>\
					</tr>\
					<tr class="schedule">\
						<td>\
							<label for="reviewAction" class="translate" data-translate="reviewAction"></label>\
						</td>\
						<td>\
							<select class="reviewAction"></select><br>\
						</td>\
					</tr> <tr class="recurring"> <td><label for="recurType" class="translate" data-translate="recurType"></label></td> <td><select id="recurType"> <option value="daily" class="translate" data-translate="daily"></option>\
								<option value="weekly" class="translate" data-translate="weekly"></option>\
								<option value="monthly"class="translate" data-translate="monthly"></option>\
							</select></td>\
					</tr>\
				</table>\
					<div class="recurring" id="recurSpecial"></div>\
				<table>\
					<tr class="recurring"> <td><label for="recurNext" class="translate" data-translate="recurNext"></label></td> <td><input type="text" id="recurNext" placeholder="Next Occurance"></td> </tr> <tr class="recurring"> <td><label for="recurEnds" class="translate" data-translate="recurEnds"></label></td> <td><input type="text" id="recurEnds" placeholder="Last Occurance"></td> </tr> <tr class="recurring"> <td>\
							<label for="reviewAction" class="translate" data-translate="reviewAction"></label>\
						</td>\
						<td>\
							<select class="reviewAction"></select><br>\
						</td>\
					</tr>\
				</table>\
				<div id="buttonbox">\
					<button class="cancel translate" data-translate="cancel"></button>\
					<button class="create"></button>\
				</div>\
			</div>\
		</div>')

	$('#scheduledDialog .translate').map(function () {
		$(this).html($.i18n._($(this).attr('data-translate')));
	})

	//I'm bad at coding. Sue me.
	$('#scheduledDialog .inner .create').click(function () {

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
				plugin.scheduled.core.add('New Task', 'scheduled');

				//Edits Data inside of it
				var task = core.storage.tasks[core.storage.lists.items.scheduled.order.length - 1];

				//Calculates Difference
				//task.date = (Math.round((today.getTime() - tmpdate.getTime()) / 1000 / 60 / 60 /24));
				task.next = today.getTime();
				task.list = $('.schedule .reviewAction').val();


			} else if ($('#scheduledDialog input[type=radio]:checked').val() === 'recurring') {

				var test = $('#recurNext').val();
				if (test == '' || new Date(test) == 'Invalid Date') {
					return;
				}
				//Creates a new Recurring Task
				plugin.scheduled.core.add('New Task', 'recurring');

				//Edits Data inside of it
				var task = core.storage.tasks[core.storage.lists.items.scheduled.order.length - 1];
				task.next = new Date($('#recurNext').val()).getTime();

				//Makes sure that it doesn't break polyStorage. I dunno.
				if ($('#recurEnds').val() == '') {
					task.ends = '';
				} else {
					task.ends = new Date($('#recurEnds').val()).getTime();	
				}

				task.list = $('.recurring .reviewAction').val();
				task.recurType = $('#recurType').val();

				if (task.recurType === 'daily') {
					task.recurInterval = [parseInt($('#recurSpecial input').val())];
				} else if (task.recurType === 'weekly') {
					var interval = [];

					$('#recurSpecial div').map(function () {
						interval.push([parseInt($(this).children('input').val()), $(this).children('select').val(), task.next]);
					})

					task.recurInterval = interval;
				} else if (task.recurType == 'monthly') {
					var interval = [];

					$('#recurSpecial div').map(function () {
						interval.push([1, parseInt($(this).children('.type').val()), 'day', task.next]);
					})

					task.recurInterval = interval;
				}
			}

		} else {
			//THIS DOESN't WORK. Don't use it. Don't even try. Don't even look at it.
			var id = (core.storage.tasks[id].type).substr(0,1) + id;
			var task = core.storage.tasks[id.substr(1)];

			if (id.substr(0, 1) == 's') {

				//Edits Values
				task.next = new Date(today).getTime();
				task.list = $('.schedule .reviewAction').val()

			} else if (id.substr(0, 1) == 'r') {
				task.next = $('#recurNext').val();
				task.ends = $('#recurEnds').val();
				task.recurType = $('#recurType').val();

				if (task.recurType === 'daily') {
					task.recurInterval = [parseInt($('#recurSpecial input').val())];
				} else if (task.recurType === 'weekly') {
					var interval = [];

					$('#recurSpecial div').map(function () {
						interval.push([parseInt($(this).children('input').val()), $(this).children('select').val(), task.next]);
					})

					task.recurInterval = interval;
				} else if (task.recurType == 'monthly') {
					var interval = [];

					$('#recurSpecial div').map(function () {
						interval.push([1, parseInt($(this).children('.type').val()), 'day', task.next]);
					})

					task.recurInterval = interval;
				}
			}
		}

		//Saves
		core.storage.save();

		//Closes
		$('#scheduledDialog .inner').fadeOut(150);
		$('#scheduledDialog').hide(0);

		//Reschedule Schedule
		plugin.scheduled.core.update();

		//Reload UI
		$('#Lscheduled .name').click();
		obj.view.$('.count').html(core.list('scheduled').populate().length);
		obj.view.$().attr('id', 'L' + obj.model.get('id'));
		ui.lists.update().count();

	});

	$('#scheduledDialog .cancel').click(function () {
		$addBTN.click();
	});

	var weeks = '<input type="number"> weeks on <select><option value="1">Monday</option><option value="2">Tuesday</option><option value="3">Wednesday</option> <option value="4">Thursday</option> <option value="5">Friday</option> <option value="6">Saturday</option> <option value="0">Sunday</option></select>';
	var months = 'on the <select class="type"><option value="1">1st</option> <option value="2">2nd</option> <option value="3">3rd</option> <option value="4">4th</option> <option value="5">5th</option> <option value="6">6th</option> <option value="7">7th</option> <option value="8">8th</option> <option value="9">9th</option> <option value="10">10th</option> <option value="11">11th</option> <option value="12">12th</option> <option value="13">13th</option> <option value="14">14th</option> <option value="15">15th</option> <option value="16">16th</option> <option value="17">17th</option> <option value="18">18th</option> <option value="19">19th</option> <option value="20">20th</option> <option value="21">21st</option> <option value="22">22nd</option> <option value="23">23rd</option> <option value="24">24th</option> <option value="25">25th</option> <option value="26">26th</option> <option value="27">27th</option> <option value="28">28th</option> <option value="29">29th</option> <option value="30">30th</option> <option value="31">31st</option></select> day';

	$body.on('click', '.addRecur', function () {
		var length = $('#recurType').val();

		if (length === 'weekly') {
			$('#recurSpecial').append('<div>And ' + weeks + '<span class="removeRecur">-</span></div>')
		} else if (length === 'monthly') {
			$('#recurSpecial').append('<div>And ' + months + '<span class="removeRecur">-</span></div>')
		}

	});

	$body.on('click', '.removeRecur', function () {
		$(this).parent().remove();
	})

	//Date Picker
	$('#recurNext, #recurEnds').datepicker();

	$('#scheduledDialog input[type=radio]').on('change', function () {
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

	$('#recurType').on('change', function () {
		var toggle = $(this).val();

		if (toggle === 'daily') {
			$('#recurSpecial').html('<table><tr><td>Every:</td><td><input type="number" min="1" value="7"> days</td></tr></table>');
		} else if (toggle === 'weekly') {
			$('#recurSpecial').html('<div>Every ' + weeks + '<span class="addRecur">+</span></div>');
		} else if (toggle === 'monthly') {
			$('#recurSpecial').html('<div>Every month ' + months + '<span class="addRecur">+</span></div>');
		}
	});
		
	plugin.scheduled = {
		core: {
			add: function(name, type) {
				//ID of task
				var taskId = core.storage.tasks.length;
				core.storage.tasks.length++;

				if (type === 'scheduled') {
					core.storage.tasks[taskId] = {
						content: name,
						priority: 'none',
						date: '',
						notes: '',
						list: 'today',
						type: 'scheduled',
						next: '0',
						date: '',
						synced: false,
						time: {
							content: 0,
							priority: 0,
							date: 0,
							notes: 0,
							list: 0,
							type: 0,
							next: 0,
							date: 0
						}
					}

				} else if (type === 'recurring') {
					core.storage.tasks[taskId] = {
						content: name,
						priority: 'none',
						date: '',
						notes: '',
						list: 'today',
						type: 'recurring',
						next: '0',
						date: '',
						recurType: 'daily',
						recurInterval: [1],
						ends: '0',
						synced: false,
						time: {
							content: 0,
							priority: 0,
							date: 0,
							notes: 0,
							list: 0,
							type: 0,
							next: 0,
							date: 0,
							recurType: 0,
							recurInterval: 0,
							ends: 0
						}
					}
				}
				//Pushes to order
				core.storage.lists.items.scheduled.order.unshift(taskId);
				core.storage.save();
				console.log("Added a new " + type + " task")
			},

			update: function() {
				//Loops through all da tasks
				for (var i=0; i < core.storage.lists.items.scheduled.order.length; i++) {

					//Defines task for later
					var id = core.storage.lists.items.scheduled.order[i];
					var task = core.storage.tasks[id];

					if (task.next != '0') {

						//Add the task to the list if the date has been passed
						if (new Date(task.next).getTime() <= new Date().getTime()) {

							//Makes a new Task
							core.task().add(task.content, task.list);
							var data = core.storage.tasks[core.storage.tasks.length -1];

							//Sets Data
							data.notes = task.notes;
							data.priority = task.priority;

							//Task is scheduled
							if (task.type == 'scheduled') {

								//Deletes from scheduled
								console.log(id)					
								core.task(id).move('trash');
								console.log('Task: ' + id + ' has been scheduled');

							//Task is recurring
							} else if (task.type == 'recurring') {

								//Checks Ends
								if (task.ends != 0 || task.ends != '') {
									//If it's ended
									if (new Date(task.ends).getTime() <= new Date().getTime()) {
										//Task has finished.
										console.log('The recurring has come to an end. Casting into oblivion.');
										core.task(id).move('trash');
										return;
									}
								}

								//Calculates Due Date
								if (task.date != '') {
									//Adds number to next
									var tmpdate = new Date(task.next);
									tmpdate.setDate(tmpdate.getDate() + parseInt(task.date));
									data.date = tmpdate.getTime();
								}

								//Change the Next Date
								if (task.recurType == 'daily') {
									var tmpdate = new Date(task.next);
									tmpdate.setDate(tmpdate.getDate() + task.recurInterval[0]);
									task.next = tmpdate.getTime();
								} else if (task.recurType == 'weekly') {
									var nextArr = [];

									//Loop through everything and create new dates
									for (var key in task.recurInterval) {
										//Checks if date has been passed
										if (new Date(task.recurInterval[key][2]).getTime() <= new Date().getTime()) {
											//If it has, we'll work out the next date.

											//Adds Weeks
											task.recurInterval[key][2] = new Date(task.recurInterval[key][2]).setDate(new Date(task.recurInterval[key][2]).getDate() + (7 * parseInt(task.recurInterval[key][0])))


											//Adds Days
											var next = parseInt(task.recurInterval[key][1]),
											day = new Date(task.recurInterval[key][2]).getDay(),
											diff = (next - day) == 0 ? 7 : (next - day);

											//Final Date
											task.recurInterval[key][2] = new Date(task.recurInterval[key][2]).setDate(task.recurInterval[key][2] .getDate() + diff);

											//task.recurInterval[key][2] = cli.calc.dateConvert(Date.parse(task.recurInterval[key][2]).addWeeks(parseInt(task.recurInterval[key][0]) - 1).moveToDayOfWeek(parseInt(task.recurInterval[key][1])));
										}

										//Even if it hasn't, we'll still push it to an array.
										nextArr.push(new Date(task.recurInterval[key][2]).getTime());
									}
									//Next date as the next one coming up
									task.next = Array.min(nextArr).getTime();
								} else if (task.recurType == 'monthly') {
									var nextArr = []

									//Loop through everything and create new dates
									for (var key in task.recurInterval) {
										//Checks if date has been passed
										if (new Date(task.recurInterval[key][3]).getTime() <= new Date().getTime()) {
											if (task.recurInterval[key][2] == 'day') {
												
												//BROKEN. FIXME
												if (new Date.setDate(task.recurInterval[key][1]).getTime() <= new Date().getTime()) {
													//If it's been, set it for the next month
													task.recurInterval[key][3] = new Date().setDate(task.recurInterval[key][1]).setMonth(new Date().getMonth() + 1).getTime();
												} else {
													//If it hasn't, set it for this month
													task.recurInterval[key][3] = new Date().setDate(task.recurInterval[key][1]).getTime();
												}
											} else {
												//BROKEN. FIXME
												//This is a piece of crap that I don't plan to implement unless someone tells me to.
												/*
												var namearr = ['zero', 'set({day: 1})', 'second()', 'third()', 'fourth()', 'last()'];
												var datearr = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
												//Fuckit. Using eval. Stupid date.j
												/*var result = eval('Date.today().' + namearr[task.recurInterval[key][1]] + '.' + datearr[task.recurInterval[key][2]] + '()')

												console.log(result)

												//If it's already been, next month
												if (result.getTime() < new Date().getTime()) {
													var result = eval('Date.today().' + namearr[task.recurInterval[key][1]] + '.addMonths(1).' + datearr[task.recurInterval[key][2]] + '()')
												}

												task.recurInterval[key][3] = cli.calc.dateConvert(new Date(result));*/
											}
										}

										//Even if it hasn't, we'll still push it to an array.
										nextArr.push(new Date(task.recurInterval[key][3]).getTime());
									}

									//Next date as the next one coming up
									task.next = Array.min(nextArr).getTime();

								}
								console.log('Task: ' + i + ' has been recurred')
							}
							core.storage.save();
						};
					};
				};
			}
		},

		ui: {
			add: function() {
				$('#scheduledDialog .inner').fadeToggle(150).attr('data-type', 'add');
				$('.radioscheduled input[value=scheduled]').attr('checked', 'true');
				$('#scheduledDialog').toggle(0);
				plugin.scheduled.ui.init('add');
			},

			init: function (type) {
				if (type == 'edit') {
					var id = $('#scheduledDialog .inner').attr('data-type');
					var id = (core.storage.tasks[id].type).substr(0,1) + id;

					//Fills in Values
					var task = core.storage.tasks[id.substr(1)];
					var text = $.i18n._('edit');

					if (id.substr(0, 1) == 's') {

						//Zeros Days
						var today = new Date();
						today.setSeconds(0);
						today.setMinutes(0);
						today.setHours(0);
						var tmpdate = new Date(task.next)

						var no = (Math.round((tmpdate.getTime() - today.getTime()) / 1000 / 60 / 60 / 24)),
							length = 'days',
							action = task.list;

						//Hides Bits of UI
						$('#scheduledDialog .inner .schedule').show(0);
						$('#scheduledDialog .inner .recurring').hide(0);


					} else if (id.substr(0, 1) == 'r') {
						//Hides Bits of UI
						$('#scheduledDialog .inner .schedule').hide(0);
						$('#scheduledDialog .inner .recurring').show(0);

						//Changes UI
						$('#recurType').val(task.recurType).change();

						if (task.recurType == 'daily') {
							$('#recurSpecial input').val(task.recurInterval[0]);
						} else if (task.recurType == 'weekly') {
							for (var i = 0; i < task.recurInterval.length; i++) {
								if (i != 0) {
									$('.addRecur').click()
								}
								//Puts data in
								$($('#recurSpecial div')[i]).children('input').val(task.recurInterval[i][0]);
								$($('#recurSpecial div')[i]).children('select').val(task.recurInterval[i][1]);
							}
						} else if (task.recurType == 'monthly') {
							for (var i = 0; i < task.recurInterval.length; i++) {
								if (i != 0) {
									$('.addRecur').click()
								}
								//Puts data in
								$($('#recurSpecial div')[i]).children('.type').val(task.recurInterval[i][1]);
							}
						}

						$('#recurNext').datepicker('setDate', new Date(task.next));
						if ($('#recurEnds').val() != '') {
							$('#recurEnds').datepicker('setDate', new Date(task.ends));	
						} else {
							$('#recurEnds').val('');
						}
					}

					$('.radioscheduled').hide(0);

				} else {
					var no = 5,
						length = 'days',
						action = 'today',
						text = $.i18n._('create');

					$('.radioscheduled').show(0);
					$('#scheduledDialog .inner .schedule').show(0);
					$('#scheduledDialog .inner .recurring').hide(0);
				}

				var output = '<option value="today">' + $.i18n._('today') + '</option><option value="next">' + $.i18n._('next') + '</option>';
				for (var i = 0; i < core.storage.lists.order.length; i++) {
					output += '<option value="' + core.storage.lists.order[i] + '">' + core.storage.lists.items[core.storage.lists.order[i]].name + '</option>'
				};

				$('.reviewAction').html(output);

				//Updates UI
				$('#reviewNo').val(no);
				$('#reviewLength').val(length);
				$('.reviewAction').val(action);
				$('#scheduledDialog .inner .create').html(text)

			}
		}
	}
});
//Because functions have to be defined before being run
plugin.add(function() {
	//Updates Scheduled and Recurring Tasks
	plugin.scheduled.core.update();
})

//Because I'm lazy.
Array.max = function( array ){
    return Math.max.apply( Math, array );
};
Array.min = function( array ){
    return Math.min.apply( Math, array );
};