/* Nitro CLI
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

console.info('Nitro 1.3\nCopyright (C) 2012 Caffeinated Code\nBy George Czabania & Jono Cooper');
var socket;
var cli = {
	timestamp: {
		update: function (id, key) {
			return {
				task: function () {
					cli.storage.tasks[id].time[key] = Date.now();
					cli.timestamp.sync();
				},
				list: function () {
					if (id !== 0) {
						cli.storage.lists.items[id].time[key] = Date.now();
						cli.timestamp.sync();
					}
				},
				scheduled: function () {
					cli.storage.lists.scheduled[id].time[key] = Date.now();
					cli.timestamp.sync();
				}
			};
		},
		sync: function () {
			if (cli.storage.prefs.sync === 'auto') {
				ui.sync.running();
				cli.storage.sync();
			} else {
				ui.sync.active();
			}
		},
		upgrade: function () {

			var passCheck = true;

			// Check tasks for timestamps
			for(var id in cli.storage.tasks) {
				if (id !== 'length' && !cli.storage.tasks[id].hasOwnProperty('deleted')) {

					// Check task has time object
					if (!cli.storage.tasks[id].hasOwnProperty('time')) {
						console.log("Upgrading task: '" + id + "' to Nitro 1.1 (timestamps)");
						passCheck = false;

						cli.storage.tasks[id].time = {
							content: 0,
							priority: 0,
							date: 0,
							notes: 0,
							today: 0,
							showInToday: 0,
							list: 0,
							logged: 0
						};
					}

					// Check task has sync status
					if (!cli.storage.tasks[id].hasOwnProperty('synced')) {
						console.log("Upgrading task: '" + id + "' to Nitro 1.1 (sync)");
						passCheck = false;

						cli.storage.tasks[id].synced = false;
					}
					break;
				}
			}

			// Check lists for timestamps
			for(var id in cli.storage.lists.items) {
				if (id !== 'length' && id !== '0') {

					// Check list has time object
					if (!cli.storage.lists.items[id].hasOwnProperty('time') || typeof(cli.storage.lists.items[id].time) === 'number') {
						console.log("Upgrading list: '" + id + "' to Nitro 1.2 (timestamp)");
						passCheck = false;

						// Add or reset time object
						cli.storage.lists.items[id].time = {
							name: 0,
							order: 0
						};						
					}

					if (id !== 'today' && id !== 'next' && id !== 'someday') {
						// Check list has synced status
						if (!cli.storage.lists.items[id].hasOwnProperty('synced')) {
							console.log("Upgrading list: '" + id + "' to Nitro 1.2 (sync)");
							passCheck = false;

							cli.storage.lists.items[id].synced = 'false';
						}
					}

					// Convert everything to numbers
					for  (var x = 0; x < cli.storage.lists.items[id].order.length; x++) {
						if(typeof cli.storage.lists.items[id].order[x] === 'string') {
							cli.storage.lists.items[id].order[x] = cli.storage.lists.items[id].order[x].toNum();
						}
					}
				}
			}

			//Check someday list
			if (cli.storage.lists.items.someday) {
				console.log('Upgrading DB to Nitro 1.3');
				//Create Someday List
				cli.list('', 'Someday').add();

				for (var key in cli.storage.lists.items.someday.order) {
					//Moves Tasks into New List
					cli.moveTask(cli.storage.lists.items.someday.order[key], cli.storage.lists.items.length - 1);
				}

				delete cli.storage.lists.items.someday;
				cli.storage.save();
			}

			//Check for scheduled
			if (!cli.storage.lists.scheduled) {
				cli.storage.lists.scheduled = {length: 0};
			}

			// Check preferences exist. If not, set to default
			cli.storage.lists.deleted = cli.storage.lists.deleted   || {};
			cli.storage.lists.time     = cli.storage.prefs.time     || 0;
			cli.storage.prefs.sync     = cli.storage.prefs.sync     || 'manual';
			cli.storage.prefs.lang     = cli.storage.prefs.lang     || 'english';
			cli.storage.prefs.bg       = cli.storage.prefs.bg       || {};
			cli.storage.prefs.bg.color = cli.storage.prefs.bg.color || '';
			cli.storage.prefs.bg.size  = cli.storage.prefs.bg.size  || 'tile';

			// Save
			cli.storage.save();

			if (passCheck) {
				// Database is up to date
				console.log("Database is up to date")
			} else {
				// Database was old
				console.log("Database was old")

				if (app == 'js') {
					console.log("Regex all the things!")

					//Regexes for funny chars
					localStorage.jStorage = localStorage.jStorage.replace(/\\\\/g, "&#92;").replace(/\|/g, "&#124").replace(/\\"/g, "&#34;").replace(/\'/g, "&#39;");

					//Reloads jStorage
					$.jStorage.reInit()
				};
			}
		}
	},
	escape: function (str) {
		//Regexes a bunch of shit that breaks the Linux version

		if (typeof str === 'string') {
			str = str
				.replace(/\\/g, "&#92;") // Backslash
				.replace(/\|/g, "&#124") // Pipe
				.replace(/\"/g, "&#34;") // Quote
				.replace(/\'/g, "&#39;"); // Apostrophe
			return str;
		} else {
			return str;
		}
		
	},
	addTask: function (name, list) {
		name = cli.escape(name);
		// Creates a task

		//Id of task
		var id = cli.storage.tasks.length;
		cli.storage.tasks.length++;

		//Saves to Localstorage
		cli.storage.tasks[id] = {
			content: name,
			priority: 'none',
			date: '',
			notes: '',
			today: 'false',
			showInToday: '1',
			list: list,
			logged: false,
			time: {
				content: 0,
				priority: 0,
				date: 0,
				notes: 0,
				today: 0,
				showInToday: 0,
				list: 0,
				logged: 0
			},
			synced: false
		};

		if (list === 'today') {
			cli.today(id).add();
		} else {
			//Pushes to array
			cli.storage.lists.items[list].order.unshift(id);
		}

		// Timestamp (list order)
		cli.timestamp.update(list, 'order').list();

		//Saves to disk
		cli.storage.save();

		//Returns something
		console.log("Created Task: '" + name + "' with id: " + id + " in list: " + list);

	},
	deleteTask: function (id) {
		var task = cli.taskData(id).display();

		// Timestamp (list order)
		cli.timestamp.update(task.list, 'order').list();

		cli.calc.removeFromList(id, task.list);

		//Changes task List to 0 so today.calculate removes it.
		task.list = 0;
		cli.taskData(id).edit(task);

		//Removes from Today and Next
		cli.today(id).calculate();

		//Removes from list
		cli.calc.removeFromList(id, 0);

		//Deletes Data
		cli.storage.tasks[id] = { deleted: Date.now() };

		//Saves
		cli.storage.save();
	},
	populate: function (type, query, searchlist) {
		query = cli.escape(query);
		// Displays a list
		switch(type) {
			case "list":
				// Get tasks from list

				if (query === 'logbook') {
					var logbook = [];

					for (var t = 0; t < cli.storage.tasks.length; t++) {
						// looooooping through the tasks
						if (cli.storage.tasks[t]) {
							if (cli.storage.tasks[t].logged) {
								var data = cli.taskData(t).display();
								//remove today & date data
								data.date = '';
								data.today = 'false';
								cli.taskData(t).edit(data);

								logbook.push(t);
							}
						}
					}

					return logbook;
				
				} else if (query === 'all') {

					var results = [];

					// Search loop
					for (var t = 0; t < cli.storage.tasks.length; t++) {

						// If task exists
						if (cli.storage.tasks[t]) {

							// Exclude logged tasks
							if (cli.storage.tasks[t].logged == false || cli.storage.tasks[t].logged == 'false') {
								results.push(t);
							}
						}
					}
					return results;
				} else if (query === 'scheduled') {
					var results = []
					for (key in cli.storage.lists.scheduled) {
						//Pushes Results
						if (cli.storage.lists.scheduled[key].type === 'scheduled') {
							results.push('s' + key);
						} else if (cli.storage.lists.scheduled[key].type === 'recurring') {
							results.push('r' + key);
						};
					};
					return results;
				} else {

					if (query in cli.storage.lists.items) {
						return cli.storage.lists.items[query].order;
					} else {
						return [];
					}

				}

				break;

			case "search":
				// Run search

				// Set vars
				var query = query.split(' '),
					results = [],
					search;

				function searcher(key) {
					var pass1 = [],
						pass2  = true;

					// Loop through each word in the query
					for (var q = 0; q < query.length; q++) {

						// Create new search
						search = new RegExp(query[q], 'i');

						// Search
						if (search.test(cli.storage.tasks[key].content + cli.storage.tasks[key].notes)) {
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

				if (searchlist == 'all') {
					// Search loop
					for (var t = 0; t < cli.storage.tasks.length; t++) {

						// If task exists
						if (cli.storage.tasks[t]) {

							// Exclude logged tasks
							if (cli.storage.tasks[t].logged == false || cli.storage.tasks[t].logged == 'false') {

								//Seaches Task
								var str = searcher(t);
								if (str != undefined) {
									results.push(str);
								}				
							}
						}
					}
				} else if (searchlist == 'logbook') {
					//Do Something
				} else {
					for (var key in cli.storage.lists.items[searchlist].order) {
						var str = parseInt(searcher(cli.storage.lists.items[searchlist].order[key]))
						if (!isNaN(str)) {
							results.push(str);
						}
					}
				}
				return results;
		}
	},
	moveTask: function (id, list) {
		// Moves task to list

		var task = cli.taskData(id).display(),
			lists = cli.storage.lists.items;

		// Remove task from old list
		cli.calc.removeFromList(id, task.list);

		// Add task to new list
		lists[list].order.push(id);

		// Update timestamp
		cli.timestamp.update(id, 'list').task();
		cli.timestamp.update(task.list, 'order').list();
		cli.timestamp.update(list, 'order').list();

		// Update task.list
		task.list = list;

		cli.today(id).calculate();

		//If it's dropped in Someday, we strip the date & today
		if (list === 'someday') {
			task.date = '';
			cli.today(id).remove();
		}

		// Save
		cli.taskData(id).edit(task);
		cli.storage.lists.items = lists;
		cli.storage.save();

		console.log('The task with the id: ' + id + ' has been moved to the ' + list + ' list');
	},
	today: function (id) {
		return {
			add: function () {
				// Adds to Today Manually
				var task = cli.taskData(id).display();

				task.today = 'manual';
				task.showInToday = '1';
				cli.today(id).calculate();

			},
			remove: function () {
				// Removes from Today Manually
				var task = cli.taskData(id).display();

				task.today = 'false';
				task.showInToday = 'none';

				if (task.list === 'today') {
					task.list = 'next';
				}

				cli.today(id).calculate();
			},
			calculate: function () {
				/* This is the function that I wish I had.
				Removes from today or next then
				Depending on the due date etc, the function chucks it into today, next etc */

				// Removes from Today & Next
				var task = cli.taskData(id).display(),
					lists = cli.storage.lists.items;
				
				// Remove task from Today
				cli.calc.removeFromList(id, 'today');
				
				// Remove task from Next
				cli.calc.removeFromList(id, 'next');
				
				console.log('List: ' + task.list);
				cli.timestamp.update(id, 'showInToday').task();
				cli.timestamp.update(id, 'list').task();

				// Update timestamp
				cli.timestamp.update(id, 'today').task();

				//If the task is due to be deleted, then delete it
				if (task.list === 0) {
					return;
				}

				//If task is in logbook, do nothing
				if (task.logged) {
					return;
				}

				//Calculates date. Changes today Status
				cli.calc.date(id);
				
				//If the task.list is today, we place back in today & next
				if (task.list === 'today') {
					
					lists.today.order.unshift(id);
					lists.next.order.unshift(id);

					console.log('List in today, placed in today');
				} else {
					//If the task is either manually in today, or has a date, we place in Today and next
					if (task.today === 'manual' || task.today === 'yesAuto') {
						//Adds to Today & Next arrays
						console.log('List either manually set or Date set. In today');
						lists.today.order.unshift(id);
						lists.next.order.unshift(id);
					} else {
						console.log('Not in today');
						//Do nothing unless in Next list
						if (task.list === 'next') {
							//Adds to Next array
							lists.next.order.unshift(id);
						}
					}
				}

				// DeDupe today and next lists
				cli.storage.lists.items.today.order = deDupe(cli.storage.lists.items.today.order);
				cli.storage.lists.items.next.order = deDupe(cli.storage.lists.items.next.order)
				
				//Saves data
				cli.storage.save();
			}
		};
	},
	logbook: function (id) {
		// Toggles an item to/from the logbook

		var task = cli.taskData(id).display(),
			lists = cli.storage.lists.items;

		// Check if task exists
		if (!task) {
			console.log('No task with id: ' + id + ' exists');
			return;
		}

		task.logged = !task.logged;

		//If list is deleted, set to next
		if (!(task.list in lists)) {
			task.list = 'next';
		}

		if (task.logged) { // Uncomplete -> Complete
			//Gets name of list
			var oldlist = task.list;

			//Puts it in List 0 where it goes to die
			cli.moveTask(id, 0);
			cli.calc.removeFromList(id, 0);

			//Moves it back to original list
			task.list = oldlist;

			console.log("Task with id: " + id + " has been completed");
		} else {
			// Complete -> Uncomplete

			// Add task to list
			lists[task.list].order.push(id);

			console.log("Task with id: " + id + " has been uncompleted");
		}

		// Update timestamp
		cli.timestamp.update(id, 'logged').task();

		cli.taskData(id).edit(task);
		cli.storage.lists.items = lists;
		cli.storage.save();
	},
	priority: function (id) {
		return {
			get: function () {
				//Scheduled
				if (typeof(id) != 'number' && id.substr(0,1) === 's' || typeof(id) != 'number' && id.substr(0,1) === 'r') {
					var priority = cli.storage.lists.scheduled[id.toString().substr(1)].priority;
				} else {
					var priority = cli.storage.tasks[id].priority;	
				}
				return priority;
			},
			set: function () {
				if (typeof(id) != 'number' && id.substr(0,1) === 's' || typeof(id) != 'number' && id.substr(0,1) === 'r') {
					var priority = cli.storage.lists.scheduled[id.toString().substr(1)].priority;
				} else {
					var priority = cli.storage.tasks[id].priority;	
				}
				switch(priority) {
					case "low":
						priority = "medium";
						break;
					case "medium":
						priority = "important";
						break;
					case "important":
						priority = "none";
						break;
					case "none":
						priority = "low";
						break;
				}

				

				if (typeof(id) != 'number' && id.substr(0,1) === 's' || typeof(id) != 'number' && id.substr(0,1) === 'r') {
					cli.timestamp.update(id.toString().substr(1), 'priority').scheduled();
					cli.storage.lists.scheduled[id.toString().substr(1)].priority = priority;
				} else {
					cli.timestamp.update(id, 'priority').task();
					cli.storage.tasks[id].priority = priority;
				}
				
				cli.storage.save();
				return priority;
			}
		};
	},
	taskData: function (id) {
		return {
			display: function () {
				// Returns taskData as object
				return cli.storage.tasks[id];

			},
			edit: function (obj) {
				// Edit taskData
				$.each(obj, function (i, value) {
					if (typeof value === "string") {
						obj[i] = cli.escape(value);
					}
					if (obj[i] !== $.jStorage.get('tasks')[id][i] && i !== 'time') {
						cli.timestamp.update(id, i).task();
					}
				});

				cli.storage.tasks[id] = obj;
				cli.storage.save();
				
			}
		};
	},
	list: function (id, name) {
		name = cli.escape(name);

		return {
			add: function () {
				// Adds a list
				var newId = cli.storage.lists.items.length;

				//Chucks data in object
				cli.storage.lists.items[newId] = {
					name: name,
					order: [],
					time: {
						name: 0,
						order: 0
					},
					synced: false
				};

				//Adds to order array
				cli.storage.lists.order.push(newId);

				//Returns something
				console.log("Created List: '" + name + "' with id: " + newId);

				// Update timestamp for list order
				cli.storage.lists.time = Date.now();

				//Updates Total
				cli.storage.lists.items.length++;
				cli.storage.save();
			},
			rename: function () {
				// Renames a list
				cli.storage.lists.items[id].name = name;
				cli.timestamp.update(id, 'name').list();

				//Saves to localStorage
				cli.storage.save();

				//Returns something
				console.log("Renamed List: " + id + " to: '" + name + "'");
			},
			remove: function () {
				//Deletes data in list
				for (var i=0; i<cli.storage.lists.items[id].order.length; i++) {
					cli.today(cli.storage.lists.items[id].order[i]).remove();
					cli.storage.tasks[cli.storage.lists.items[id].order[i]] = {deleted: Date.now()};
				}

				//Deletes actual list
				delete cli.storage.lists.items[id]
				cli.storage.lists.deleted[id] = Date.now();
				cli.storage.lists.order.splice(jQuery.inArray(id, cli.storage.lists.order), 1);

				// Update timestamp for list order
				cli.storage.lists.time = Date.now();

				//Saves to disk
				cli.storage.save();

				//Returns something
				console.log("Deleted List: " + id);
			},
			taskOrder: function (order) {
				//Order of tasks
				cli.timestamp.update(id, 'order').list();
				cli.storage.lists.items[id].order = order;
				cli.storage.save();
			},
			order: function (order) {
				// Order of lists
				cli.storage.lists.time = Date.now();
				cli.storage.lists.order = order;
				cli.storage.save();
			}
		};
	},
	calc: {
		//Another object where calculations are done
		removeFromList: function (id, list) {

			var task = cli.taskData(id).display(),
				lists = cli.storage.lists.items;

			// DOES NOT REMOVE LIST FROM TASK
			// List must be manually removed from task.list
			// task.list = '';
			
			// Remove task from Today
			for(var i = 0; i < lists[list].order.length; i++) {
				if (lists[list].order[i] === id) {
					lists[list].order.splice(i, 1);
					console.log('Removed: ' + id + ' from ' + list);
				}
			}

			// cli.taskData(id).edit(task);
			cli.storage.lists.items = lists;
			cli.storage.save();
		},

		date: function (id) {
			var task = cli.taskData(id).display(),
				lists = cli.storage.lists.items;

			//If it's already in today, do nothing. If it doesn't have a date, do nothing.
			if (task.today !== 'manual' && task.date !== '') {
				if (task.showInToday === 'none') {
					//Remove from today
					task.today = 'false';
					console.log('Specified to not show in today');

					//Remove from queue
					if (cli.storage.queue[id]) {
						delete cli.storage.queue[id];
					}

				} else {
					console.log('Due date, running queue function');

					//Due date + days to show in today
					var date = new Date(task.date);
					date.setDate(date.getDate() - parseInt(task.showInToday, 10));
					var final = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getUTCFullYear();

					cli.storage.queue[id] = final;

					cli.storage.save();

					//Refreshes Date Queue
					cli.calc.todayQueue.refresh();
				}
			}
		},
		dateConvert: function (olddate) {
			//Due date + days to show in today
			var date = new Date(olddate);
			var final = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getUTCFullYear();

			return final;
		},
		prettyDate: {
			convert: function (date) {
				date = date.split('/');
				date = new Date(date[2], date[0] - 1, date[1]);
				//If it's the current year, don't add the year.
				if (date.getFullYear() === new Date().getFullYear()) {
					date = date.toDateString().substring(4).replace(" 0"," ").replace(" " + new Date().getFullYear(), '');
				} else {
					date = date.toDateString().substring(4).replace(" 0"," ");
				}
				return date;
			},
			difference: function (date) {

				if (date === '') {
					return ['', ''];
				} else {
					var	now = new Date(),
						date = date.split('/'),
						difference = 0,
						oneDay = 86400000; // 1000*60*60*24 - one day in milliseconds

					// Convert to JS
					date = new Date(date[2], date[0] - 1, date[1]);
					
					// Find difference between days
					difference = Math.ceil((date.getTime() - now.getTime()) / oneDay);

					// Show difference nicely
					if (difference < -1) {
						// Overdue
						difference = Math.abs(difference);
						if (difference !== 1) {
							return [$.i18n._('daysOverdue', [difference]), 'overdue'];
						}
					} else if (difference === -1) {
						// Yesterday
						return ["due yesterday", 'due'];
					} else if (difference === 0) {
						// Due
						return ["due today", 'due'];
					} else if (difference === 1) {
						// Due
						return ["due tomorrow", ''];
					} else if (difference < 15) {
						// Due in the next 15 days
						if (difference !== 1) {
							return [$.i18n._('daysLeft', [difference]), ''];
						}
					} else {
						// Due after 15 days
						var month = $.i18n._('month');
						return [month[date.getMonth()] + " " + date.getDate(), ''];
					}
				}
			}
		},
		todayQueue: {
			
			refresh: function () {

				for (var key in cli.storage.queue) {
					key = Number(key);
					console.log(key +  " -> " + cli.storage.queue[key]);

					var targetdate = new Date(cli.storage.queue[key]);
					var todaydate = new Date();

					//Reset to 0:00
					todaydate.setSeconds(0);
					todaydate.setMinutes(0);
					todaydate.setSeconds(0);

					//If today is the same date as the queue date or greater, put the task in today and next
					if (todaydate >= targetdate) {
						
						cli.storage.tasks[key].today = 'yesAuto';

						//Adds to today & next lists
						cli.storage.lists.items.today.order.push(key);

						//Makes sure it doesn't it doesn't double add to next
						if (cli.storage.tasks[key].list !== 'next') {
							cli.storage.lists.items.next.order.push(key);
						}

						delete cli.storage.queue[key];

					} else {
						//Wait till tomorrow.
						cli.storage.tasks[key].today = 'noAuto';
					}
					cli.storage.save();
				}
			}
		}
	},

	scheduled: {
		add: function(name, type) {
			console.log("Added a new " + type + " task")
			if (type === 'scheduled') {
				cli.storage.lists.scheduled[cli.storage.lists.scheduled.length] = {
					content: name,
					priority: 'none',
					date: '',
					notes: '',
					list: 'today',
					type: 'scheduled',
					next: '0',
					date: '',
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
				cli.storage.lists.scheduled[cli.storage.lists.scheduled.length] = {
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

			cli.storage.lists.scheduled.length++;
			cli.storage.save();
		},

		edit: function(id, obj) {
			//Returns data if nothing is passed to it
			if (obj) {
				$.each(obj, function (i, value) {
					if (typeof value === "string") {
						obj[i] = cli.escape(value);
					}
					if (obj[i] !== $.jStorage.get('lists').scheduled[id][i] && i !== 'time') {
						cli.timestamp.update(id, i).scheduled();
					}
				});
				cli.storage.lists.scheduled[id] = obj;
				cli.storage.save();
			};
			
			return cli.storage.lists.scheduled[id];
		},

		update: function() {
			//Loops through all da tasks
			for (var i=0; i < cli.storage.lists.scheduled.length; i++) {

				//Checks if tasks exists
				if (cli.storage.lists.scheduled[i]) {
					var task = cli.storage.lists.scheduled[i];

					if (task.next != '0') {

						//Add the task to the list if the date has been passed
						if (new Date(task.next).getTime() <= new Date().getTime()) {

							cli.addTask(task.content, task.list);
							var data = cli.taskData(cli.storage.tasks.length -1).display();

							//Sets Data
							data.notes = task.notes;
							data.priority = task.priority;

							//Task is scheduled
							if (task.type == 'scheduled') {

								cli.taskData(cli.storage.tasks.length -1).edit(data);

								//Deletes from scheduled							
								delete cli.storage.lists.scheduled[i];
								console.log('Task: ' + i + ' has been scheduled');

							//Task is recurring
							} else if (task.type == 'recurring') {

								//Calculates Due Date
								if (task.date != '') {
									//Adds number to next
									var tmpdate = new Date(task.next);
									tmpdate.setDate(tmpdate.getDate() + parseInt(task.date));
									data.date = cli.calc.dateConvert(tmpdate);

									//Saves
									cli.taskData(cli.storage.tasks.length -1).edit(data);
									cli.calc.date(cli.storage.tasks.length -1);
								}

								//Change the Next Date
								if (task.recurType == 'daily') {
									var tmpdate = new Date(task.next);
									tmpdate.setDate(tmpdate.getDate() + task.recurInterval[0]);
									task.next = cli.calc.dateConvert(tmpdate);
								} else if (task.recurType == 'weekly') {
									var nextArr = [];

									//Loop through everything and create new dates
									for (var key in task.recurInterval) {
										//Checks if date has been passed
										if (new Date(task.recurInterval[key][2]).getTime() <= new Date().getTime()) {
											//If it has, we'll work out the next date.
											task.recurInterval[key][2] = cli.calc.dateConvert(Date.parse(task.recurInterval[key][2]).addWeeks(parseInt(task.recurInterval[key][0]) - 1).moveToDayOfWeek(parseInt(task.recurInterval[key][1])));
										}

										//Even if it hasn't, we'll still push it to an array.
										nextArr.push(new Date(task.recurInterval[key][2]).getTime());
									}
									//Next date as the next one coming up
									task.next = cli.calc.dateConvert(Array.min(nextArr));
								} else if (task.recurType == 'monthly') {
									var nextArr = []

									//Loop through everything and create new dates
									for (var key in task.recurInterval) {
										//Checks if date has been passed
										if (new Date(task.recurInterval[key][3]).getTime() <= new Date().getTime()) {
											if (task.recurInterval[key][2] == 'day') {
												
												if (Date.today().set({day: task.recurInterval[key][1]}).getTime() <= new Date().getTime()) {
													//If it's been, set it for the next month
													task.recurInterval[key][3] = cli.calc.dateConvert(Date.today().set({day: task.recurInterval[key][1]}).addMonths(1).getTime());
												} else {
													//If it hasn't, set it for this month
													task.recurInterval[key][3] = cli.calc.dateConvert(Date.today().set({day: task.recurInterval[key][1]}).getTime());
												}
											} else {
												console.log('boop')
												var namearr = ['zero', 'set({day: 1})', 'second()', 'third()', 'fourth()', 'last()'];
												var datearr = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
												//Fuckit. Using eval. Stupid date.js
												var result = eval('Date.today().' + namearr[task.recurInterval[key][1]] + '.' + datearr[task.recurInterval[key][2]] + '()')

												console.log(result)

												//If it's already been, next month
												if (result.getTime() < new Date().getTime()) {
													var result = eval('Date.today().' + namearr[task.recurInterval[key][1]] + '.addMonths(1).' + datearr[task.recurInterval[key][2]] + '()')
												}

												task.recurInterval[key][3] = cli.calc.dateConvert(new Date(result));
											}
										}

										//Even if it hasn't, we'll still push it to an array.
										nextArr.push(new Date(task.recurInterval[key][3]).getTime());
									}

									//Next date as the next one coming up
									task.next = cli.calc.dateConvert(Array.min(nextArr));

								}

								//Saves
								cli.scheduled.edit(i, task);	

								console.log('Task: ' + i + ' has been recurred')
							}

							cli.storage.save();
						}
					};
				};
			};
		}
	},

	storage: {
		//Object where data is stored
		tasks: $.jStorage.get('tasks', {length: 0}),
		queue: $.jStorage.get('queue', {}),
		lists: $.jStorage.get('lists', {order: [], items:{today: {name: "Today", order:[], time: {name: 0, order: 0}}, next: {name: "Next", order:[], time: {name: 0, order: 0}}, 0: {order:[]}, length: 1}, time: 0}),
		prefs: $.jStorage.get('prefs', {deleteWarnings: false, gpu: false, nextAmount: 'threeItems', over50: true, lang: 'english', bg: {color: '', size: 'tile'}, sync: {}}),
		// NB: Over 50 caps amount of tasks in List to 50 but causes drag and drop problems.
		// I CBF fixing it.

		save: function () {
			//Saves to localStorage
			$.jStorage.set('tasks', cli.storage.tasks);
			$.jStorage.set('lists', cli.storage.lists);
			$.jStorage.set('queue', cli.storage.queue);
			$.jStorage.set('prefs', cli.storage.prefs);
		},

		sync: {

			// Magical function that handles connect and emit
			run: function() {

				if(cli.storage.prefs.access) {
					cli.storage.sync.emit()
				} else {
					cli.storage.sync.connect(function() {
						cli.storage.sync.emit();
					});
				}

			},
			connect: function (callback) {

				console.log("Connecting to Nitro Sync server");

				if(cli.storage.prefs.sync.hasOwnProperty('access')) {
					$.ajax({
						type: "POST",
						url: 'http://localhost:3000/auth/',
						dataType: 'json',
						data: {access: cli.storage.prefs.sync.access, service: 'ubuntu'},
						success: function (data) {
							console.log(data);
							if(data == "success") {
								console.log("Nitro Sync server is ready");
								callback();
							} else if (data == "failed") {
								console.log("Could not connect to Dropbox");
							}
						}
					});
				} else {
					$.ajax({
						type: "POST",
						url: 'http://localhost:3000/auth/',
						dataType: 'json',
						data: {reqURL: 'true', service: 'ubuntu'},
						success: function (data) {
							console.log("Verifying dropbox");
							cli.storage.prefs.sync.token = data;
							// Display popup window
							var left = (screen.width/2)-(800/2),
								top = (screen.height/2)-(600/2),
								title = "Authorise Nitro",
								targetWin = window.open (data.authorize_url, title, 'toolbar=no, type=popup, status=no, width=800, height=600, top='+top+', left='+left);
							$.ajax({
								type: "POST",
								url: 'http://localhost:3000/auth/',
								dataType: 'json',
								data: {token: cli.storage.prefs.sync.token, service: 'ubuntu'},
								success: function (data) {
									console.log("Nitro Sync server is ready");
									cli.storage.prefs.sync.access = data;
									callback();
									cli.storage.save();
								}
							});
						}
					});
				}
			},

			emit: function () {
				var client = {
					tasks: cli.storage.tasks,
					queue: cli.storage.queue,
					lists: cli.storage.lists
				};

				console.log(JSON.stringify(compress(client)));

				$.ajax({
					type: "POST",
					url: 'http://localhost:3000/sync/',
					dataType: 'json',
					data: {data: JSON.stringify(compress(client)), access: cli.storage.prefs.sync.access, service: 'ubuntu'},
					success: function (data) {
						if(data != 'failed') {
							data = decompress(data);
							console.log("Finished sync");
							cli.storage.tasks = data.tasks;
							cli.storage.queue = data.queue;
							cli.storage.lists = data.lists;
							cli.storage.save();
							ui.sync.reload();
						} else {
							console.log("Sync failed. You probably need to delete cli.storage.prefs.sync.");
						}
					}
				});

			}
		}
	}
};

function deDupe(arr) {
	var r = [];
	o:for(var i = 0, n = arr.length; i < n; i++) {
		for(var x = 0, y = r.length; x < y; x++) {
			if (r[x]===arr[i]) {
				continue o;
			}
		}
		r[r.length] = arr[i];
	}
	return r;
}

// My super awesome function that converts a string to a number
// "421".toNum()  -> 421
// "word".toNum() -> "word"
String.prototype.toNum = function () {
	var x = parseInt(this, 10);
	if(x > -100) {
		return x;
	} else {
		return this.toString();
	}
}

// "http://google.com" -> "<a href=http://google.com>http://google.com</a>"
function convertStringToLink(text) {
	var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
	return text.replace(exp,'<a href=$1>$1</a>');
}
function convertLinkToString(text) {
	var exp = /<a\b[^>]*>(.*?)<\/a>/ig;
	return text.replace(exp, '$1');
}

function compress(obj) {
	var chart = {
		name :       'a',
		tasks:       'b',
		content:     'c',
		priority:    'd',
		date:        'e',
		today:       'f',
		showInToday: 'g',
		list:        'h',
		lists:       'i',
		logged:      'j',
		time:        'k',
		sync:        'l',
		synced:      'm',
		order:       'n',
		queue:       'o',
		length:      'p',
		notes:       'q',
		items:       'r',
		next:        's',
		someday:     't',
		deleted:     'u'
	},
	out = {};

	for (var key in obj) {
		if (chart.hasOwnProperty(key)) {
			out[chart[key]] = obj[key];
			if (typeof obj[key] === 'object' && isArray(obj[key]) == false) {
				out[chart[key]] = compress(out[chart[key]]);
			}
		} else {
			out[key] = obj[key];
			if (typeof obj[key] === 'object' && isArray(obj[key]) == false) {
				out[key] = compress(out[key]);
			}
		}
	}
	return out;
}

function decompress(obj) {
	var chart = {
		a: 'name',
		b: 'tasks',
		c: 'content',
		d: 'priority',
		e: 'date',
		f: 'today',
		g: 'showInToday',
		h: 'list',
		i: 'lists',
		j: 'logged',
		k: 'time',
		l: 'sync',
		m: 'synced',
		n: 'order',
		o: 'queue',
		p: 'length',
		q: 'notes',
		r: 'items',
		s: 'next',
		t: 'someday',
		u: 'deleted'
	},
	out = {};

	for (var key in obj) {
		if (chart.hasOwnProperty(key)) {
			out[chart[key]] = obj[key];
			if (typeof obj[key] === 'object' && isArray(obj[key]) == false) {
				out[chart[key]] = decompress(out[chart[key]]);
			}
		} else {
			out[key] = obj[key];
			if (typeof obj[key] === 'object' && isArray(obj[key]) == false) {
				out[key] = decompress(out[key]);
			}
		}
	}
	return out;
}
//Because I'm lazy.
Array.max = function( array ){
    return Math.max.apply( Math, array );
};
Array.min = function( array ){
    return Math.min.apply( Math, array );
};

// Because typeof is useless here
function isArray(obj) {
    return obj.constructor == Array;
}
