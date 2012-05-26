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
					list: id,
					time: {
						content: 0,
						priority: 0,
						date: 0,
						notes: 0,
						list: 0,
					},
					synced: false
				};

				//Pushes to array
				core.storage.lists.items[list].order.unshift(taskId);
				console.log(this)
				console.log('Adding Task: ' + name + ' into list: ' + list);

				return taskId;
			},

			/* Move a task somewhere.
			e.g: core.task(0).move('next');

			To delete something, move to 'trash' */

			move: function(list) {
				//Remove from list
				var taskList = core.storage.lists.items[core.storage.tasks[id].list].order,
					index = taskList.indexOf(list);
				if (index > -1) taskList.splice(index, 1);
				
				if (list === 'trash') {
					delete core.storage.tasks[id];
					console.log('Deleted: ' + id);
				} else {
					//Move to other list
					core.storage.lists.items[list].order.unshift(id);
					core.storage.tasks[id].list = list;
					console.log('Moved: ' + id + ' to ' + list);
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
				console.log("Created List: '" + name + "' with id: " + listId);
			},
			delete: function() {
				//Deletes tasks in a list
				for (var i = 0; i < core.storage.lists.items[id].order.length; i++) {
					core.task(cli.storage.lists.items[id].order[i]).move('trash');
				}

				//Remove from List order
				var index = core.storage.lists.order.indexOf(id);
				if(index > -1) {
					core.storage.lists.order.splice(index, 1);
				}

				//Deletes List
				delete core.storage.lists.items[id];
			},
			populate: function() {
				if (id == 'all') {

					var results = [];

					// Loop
					for (var i=0; i<core.storage.tasks.length; i++) {

						// If task exists
						if (core.storage.tasks[i]) {
							results.push(i);
						}
					}

					return results;

				} else {

					if (id in core.storage.lists.items) {
						return core.storage.lists.items[id].order;
					} else {
						return [];
					}
				}
			}
		}
	},
	storage: {
		tasks: {
			length:0
		},
		lists: {
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
		}
	}
}