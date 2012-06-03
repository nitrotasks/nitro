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
	var obj = $$(ui.templates.listTemplate, {id: 'scheduled', name: $l._('scheduled')});
	$(document).ready(function() {
		//Adds to Sidebar
		$$.document.after(obj, $('#Lnext'));
		obj.view.$().attr('id', 'L' + obj.model.get('id'))

		//Updates Count
		obj.view.$('.count').html(core.list('scheduled').populate().length);
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

								//Deletes from scheduled		\
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
										//BROKEN. FIXME.
										/*
										//Checks if date has been passed
										if (new Date(task.recurInterval[key][2]).getTime() <= new Date().getTime()) {
											//If it has, we'll work out the next date.
											task.recurInterval[key][2] = cli.calc.dateConvert(Date.parse(task.recurInterval[key][2]).addWeeks(parseInt(task.recurInterval[key][0]) - 1).moveToDayOfWeek(parseInt(task.recurInterval[key][1])));
										}

										//Even if it hasn't, we'll still push it to an array.
										nextArr.push(new Date(task.recurInterval[key][2]).getTime());
										*/
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
												/*
												if (Date.today().set({day: task.recurInterval[key][1]}).getTime() <= new Date().getTime()) {
													//If it's been, set it for the next month
													task.recurInterval[key][3] = cli.calc.dateConvert(Date.today().set({day: task.recurInterval[key][1]}).addMonths(1).getTime());
												} else {
													//If it hasn't, set it for this month
													task.recurInterval[key][3] = cli.calc.dateConvert(Date.today().set({day: task.recurInterval[key][1]}).getTime());
												}*/
											} else {
												var namearr = ['zero', 'set({day: 1})', 'second()', 'third()', 'fourth()', 'last()'];
												var datearr = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
												//Fuckit. Using eval. Stupid date.js
												//BROKEN. FIXME
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
				alert('adding')
			}
		}
	}
});

//Because I'm lazy.
Array.max = function( array ){
    return Math.max.apply( Math, array );
};
Array.min = function( array ){
    return Math.min.apply( Math, array );
};