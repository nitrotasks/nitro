/* Nitro Core
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

//Core Module
var core = {
	task: function(id) {
		return {
			add: function(name, list) {
				//ID of task
				var taskId = core.storage.tasks.length;
				core.storage.tasks.length++;

				//Saves
				core.storage.tasks[taskId] = {
					content: name,
					priority: 'none',
					date: '',
					notes: '',
					list: list,
					logged: false,
					time: {
						content: 0,
						priority: 0,
						date: 0,
						notes: 0,
						list: 0,
						logged: 0
					},
					synced: false
				};

				//Pushes to array
				core.storage.lists.items[list].order.unshift(taskId);
				core.storage.save();
				console.log('Adding Task: ' + name + ' into list: ' + list);

				return taskId;
			},

			/* Move a task somewhere.
			e.g: core.task(0).move('next');

			To delete something, move to 'trash' */

			move: function(list) {
				//Fix for scheduled list
				if (core.storage.tasks[id].type) {
					var old = 'scheduled';
				} else {
					var old = core.storage.tasks[id].list;
				}

				// Dropping a task onto the Logbook completes it
				if(list == 'logbook' && !core.storage.tasks[id].logged) {
					core.storage.tasks[id].logged = core.timestamp();
					console.log('Logged ' + id);
					core.storage.save(['tasks', id, 'logged']);
				}

				// Taking a task out of the logbook
				if(core.storage.tasks[id].list == list && core.storage.tasks[id].logged && list != 'logbook') {
					console.log("Unlogging task")
					core.storage.tasks[id].logged = false;
					core.storage.save(['tasks', id, 'logged']);
				} else if (list === 'trash') {
					//Remove from list
					core.storage.lists.items[old].order.remove(id);
					// delete core.storage.tasks[id];
					core.storage.tasks[id] = {deleted: core.timestamp()};
					console.log('Deleted: ' + id);
					// Saves - but doesn't mess with timestamps
					core.storage.save();
				} else if (list === 'completed') {
					// Don't actually move the task
					core.storage.tasks[id].logged = core.timestamp();
					console.log('Logged ' + id);
					core.storage.save(['tasks', id, 'logged']);
				} else {
					//Remove from list
					core.storage.lists.items[old].order.remove(id);
					//Move to other list
					core.storage.lists.items[list].order.unshift(id);
					core.storage.tasks[id].list = list;
					console.log('Moved: ' + id + ' to ' + list);
					//Saves
					core.storage.save([['tasks', id, 'list'],['lists', list, 'order'],['lists', old, 'order']]);
				}
			}			
		}
	},

	list: function(id) {
		return {
			add: function(name) {
				//New ID
				var listId = core.storage.lists.items.length;
				core.storage.lists.items.length++;

				//Chucks data in object
				core.storage.lists.items[listId] = {
					name: name,
					order: [],
					time: {
						name: 0,
						order: 0
					},
					synced: false
				};

				//Adds to order array
				core.storage.lists.order.push(listId);
				core.storage.save();
				console.log("Created List: '" + name + "' with id: " + listId);

				return listId;
			},
			delete: function() {
				//Deletes tasks in a list
				for (var i = core.storage.lists.items[id].order.length - 1; i >= 0; i--) {
					core.task(core.storage.lists.items[id].order[i]).move('trash');
				}

				//Remove from List order
				var index = core.storage.lists.order.indexOf(id);
				if(index > -1) {
					core.storage.lists.order.splice(index, 1);
				}

				//Deletes List
				core.storage.lists.items[id] = {deleted: core.timestamp()};
				core.storage.save();
			},
			populate: function() {
				switch(id) {

					case 'today':

						// Get current tasks in today list and also get tasks that are due today
						var current = core.storage.lists.items.today.order,
							today = filter(core.list('all').populate(), {date: 'today'}),
							smartTasks = []

						// Loop through each task currently in today and check to see if it is actually
						// in the today list or if it was added there by this function
						for(var i = 0; i < current.length; i++) {
							if(core.storage.tasks[current[i]].list !== 'today') {
								smartTasks.push(current[i])
							}
						}

						// Make sure the task is still in today
						var remove = smartTasks.filter(function(i) {return !(today.indexOf(i) > -1);})

						// Remove each task that was in today but not anymore
						for(var i = 0; i < remove.length; i++) {
							current.splice(current.indexOf(remove[i]), 1)
						}

						// Add in any new tasks
						var add = today.filter(function(i) {return !(current.indexOf(i) > -1);})
						current = current.concat(add)

						return current

					case 'all':

						var results = [];

						// Loop
						for (var i=0; i<core.storage.tasks.length; i++) {
							if(!core.storage.tasks[i].hasOwnProperty('deleted') && !core.storage.tasks[i].logged) {
								results.push(i);
							}
						}

						return plugin.sort(results, core.storage.prefs.listSort['all'])

					default: 
						if (core.storage.lists.items.hasOwnProperty(id)) {
							var order = core.storage.lists.items[id].order
							if(!core.storage.prefs.listSort.hasOwnProperty(id)) {
								core.storage.prefs.listSort[id] = 'magic'
							}
							return plugin.sort(order, core.storage.prefs.listSort[id])
							//return order
						} else {
							return [];
						}
				}
			}
		}
	},
	
	date:  function(timestamp) {
		return {
			getDaysLeft: function() {
				if(!timestamp) return false
				
				// Create Date()
				var date = new Date(timestamp),
					now = new Date(),
					difference = 0,
					oneDay = 86400000; // 1000*60*60*24 - one day in milliseconds

				// Find difference between days
				difference = Math.ceil((date.getTime() - now.getTime()) / oneDay)

				var words, className = ''

				// Show difference nicely
				if (difference < -1) {
					// Overdue
					difference = Math.abs(difference);
					if (difference !== 1) {
						// return [$.i18n._('daysOverdue', [difference]), 'overdue'];
						words = difference + ' days overdue'
						className = 'overdue'
					}
				} else if (difference === -1) {
					// Yesterday
					words = 'due yesterday'
					className = 'overdue'
				} else if (difference === 0) {
					// Due;
					words = 'due today'
					className = 'due'
				} else if (difference === 1) {
					// Due
					words = 'due tomorrow'
					className = 'soon'
				} else if (difference < 15) {
					// Due in the next 15 days
					words = difference + ' days left'
				} else {
					// Due after 15 days
					var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
					words = month[date.getMonth()] + " " + date.getDate()
				}

				return {
					words: words,
					className: className
				}		
			},
			
			getDate: function() {
			
			if(!timestamp) return false;
				
				var date = new Date(timestamp),
					now = new Date(),
					d = 0,
					oneDay = 86400000;
					
				// Find difference between days
				d = Math.ceil((date.getTime() - now.getTime()) / oneDay);
				
				if(d == 0) {
					return "Today"
				} else if (d == -1) {
					return "Yesterday"
				} else {
					var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
					return date.getDate() + " " + month[date.getMonth()];
				}
			}
		}
	},
	
	storage: {
		tasks: $.polyStorage.get('tasks', {
			length:0
		}),
		lists: $.polyStorage.get('lists', {
			order: [],
			items: {
				today: {
					order: [],
					time: {
						order: 0
					}
				},
				next: {
					order: [],
					time: {
						order: 0
					}
				},
				logbook: {
					order: [],
					time: {
						order: 0
					}
				},
				length: 0
			},
			time: 0
		}),
		prefs: $.polyStorage.get('prefs', {
			listSort: {},
			sync: {
				url: "http://localhost:3000"
			}
		}),
		save: function(arr) {

			if(typeof arr == 'object') {
				for(var i = 0; i < arr.length; i++) {
					var type = arr[i][0],
						id = arr[i][1],
						key = arr[i][2];
					switch(type) {
						case 'tasks':
							console.log('Updating timestamp for '+ key +' in task '+ id);
							core.storage.tasks[id].time[key] = core.timestamp();
							break;
						case 'lists':
							console.log('Updating timestamp for '+ key +' in list '+ id);
							core.storage.lists.items[id].time[key] = core.timestamp();
							break;
						case 'list-order':
							console.log('Updating timestamp for List order');
							core.storage.lists.time = core.timestamp();
							break;
					}
				}
			}
			
			$.polyStorage.set('tasks', this.tasks);
			$.polyStorage.set('lists', this.lists);
			$.polyStorage.set('prefs', this.prefs);
		}
	},
	timestamp: function() {
		return Date.now();
	}
}
Array.prototype.remove= function(){
	var what, a= arguments, L= a.length, ax;
	while(L && this.length){
		what= a[--L];
		while((ax= this.indexOf(what))!= -1){
			this.splice(ax, 1);
		}
	}
	return this;
}