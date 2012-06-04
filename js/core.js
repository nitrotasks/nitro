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

				//Remove from list
				core.storage.lists.items[old].order.remove(id);

				if(core.storage.tasks[id].logged && list != 'logbook') {
					core.storage.tasks[id].logged = false;
					core.storage.save(['tasks', id, 'logged']);
				}
				
				if (list === 'trash') {
					// delete core.storage.tasks[id];
					core.storage.tasks[id] = {deleted: core.timestamp()};
					console.log('Deleted: ' + id);
					// Saves - but doesn't mess with timestamps
					core.storage.save();
				} else if (list === 'logbook') {
					// Don't actually move the task
					core.storage.tasks[id].logged = core.timestamp();
					console.log('Logged ' + id);
					core.storage.save(['tasks', id, 'logged']);
				} else {
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
				delete core.storage.lists.items[id];
				core.storage.save();
			},
			populate: function() {
				switch(id) {
					case 'all':

						var results = [];

						// Loop
						for (var i=0; i<core.storage.tasks.length; i++) {
							if(!core.storage.tasks[i].hasOwnProperty('deleted') && !core.storage.tasks[i].logged) {
								results.push(i);
							}
						}

						return results;

					case 'logbook': 

						var results = [];

						// Loop
						for (var i=0; i<core.storage.tasks.length; i++) {
							if(!core.storage.tasks[i].hasOwnProperty('deleted') && core.storage.tasks[i].logged) {
								results.push(i);
							}
						}
						
						results.sort(function(a, b) {
							console.log(a, b)
							return core.storage.tasks[a].logged > core.storage.tasks[b].logged;
						});

						return results;


					default: 
						if (id in core.storage.lists.items) {
							return core.storage.lists.items[id].order;
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
			
				console.log(timestamp);
			
				if(!timestamp) return ["",""];
				
				// Create Date()
				var date = new Date(timestamp),
					now = new Date(),
					difference = 0,
					oneDay = 86400000; // 1000*60*60*24 - one day in milliseconds

				// Find difference between days
				difference = Math.ceil((date.getTime() - now.getTime()) / oneDay);

				// Show difference nicely
				if (difference < -1) {
					// Overdue
					difference = Math.abs(difference);
					if (difference !== 1) {
						// return [$.i18n._('daysOverdue', [difference]), 'overdue'];
						return [difference + " days overdue", 'overdue'];
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
						return [difference + ' days left', ''];
					}
				} else {
					// Due after 15 days
					//var month = $.i18n._('month');
					return [month[date.getMonth()] + " " + date.getDate(), ''];
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
						name: 0,
						order: 0
					}
				},
				next: {
					order: [],
					time: {
						name: 0,
						order: 0
					}
				},
				length: 0
			},
			time: 0
		}),
		prefs: $.polyStorage.get('prefs', {
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
					}
				}
			}
			
			$.polyStorage.set('tasks', this.tasks);
			$.polyStorage.set('lists', this.lists);
			$.polyStorage.set('prefs', this.prefs);
		}
	},
	timestamp: function() {
		return Date.now() - 1333191600000;
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