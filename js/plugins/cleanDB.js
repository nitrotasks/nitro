plugin.cleanDB = function() {

	console.log("Running cleanDB v2")

	var time = Date.now()

// -------------------------------------------------
// 		VERSION 2.0
// -------------------------------------------------

	var defaults = {
		task: function() {
			return {
				content: 'New Task',
				priority: 'none',
				date: '',
				notes: '',
				list: 'today',
				logged: false,
				time: {
					content: 0,
					priority: 0,
					date: 0,
					notes: 0,
					list: 0,
					logged: 0
				}
			}
		},
		list: function() {
			return {
				name: 'New List',
				order: [],
				time: {
					name: 0,
					order: 0
				}
			}
		},
		smartlist: function() {
			return {
				order: [],
				time: {
					order: 0
				}
			}
		},
		server: function() {
			return {
				tasks: {},
				lists: {
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
						logbook:{
							order:[],
							time:{
								order:0
							}
						}
					},
					time: 0
				}
			}
		}
	}

	var isArray = function(obj) { return obj.constructor == Array }
	var isObject = function(obj) { return obj.constructor == Object }
	var isNumber = function(obj) { return !isNaN(parseFloat(obj)) && isFinite(obj) }

	var d = core.storage
	var o = new defaults.server()

	// Tasks
	var tasks
	if(d.hasOwnProperty('tasks')) tasks = d.tasks
	else tasks = new defaults.server().tasks

	// Find length
	for(var i in tasks) {

		// Only run if this is an object
		if(isObject(tasks[i])) var _this = tasks[i]
		else continue

		// Create default task
		o.tasks[i] = new defaults.task()


		// Deleted
		if(_this.hasOwnProperty('deleted')) {
			if(isNumber(_this.deleted) || isNumber(Number(_this.deleted))) {
				o.tasks[i] = {
					deleted: Number(_this.deleted)
				}
			} else {
				o.tasks[i] = {
					deleted: 0
				}
			}
		}

		// Content
		if(_this.hasOwnProperty('content')) {
			o.tasks[i].content = _this.content
		}

		// Priority
		if(_this.hasOwnProperty('priority')) {
			if(_this.priority === 'important') _this.priority = 'high'
			if(	_this.priority === 'none' || _this.priority === 'low' || _this.priority === 'medium' || _this.priority === 'high') {
				o.tasks[i].priority = _this.priority
			}
		}

		// Date
		if(_this.hasOwnProperty('date')) {
			if(isNumber(_this.date)) {
				o.tasks[i].date = _this.date
			} else {
				var Dt = new Date(_this.date).getTime()
				if(!isNaN(Dt)) {
					o.tasks[i].date = Dt
				}
			}
		}

		// Notes
		if(_this.hasOwnProperty('notes')) {
			o.tasks[i].notes = _this.notes
		}

		// Tags
		if(_this.hasOwnProperty('tags')) {
			if(isArray(_this.tags)) {
				//Turns them into a hashtag
				for (var b=0; b<_this.tags.length; b++) {
					_this.tags[b] = "#" + _this.tags[b]
				}
				o.tasks[i].content += " " + _this.tags.join(" ")
			}
		}

		// Logged
		if(_this.hasOwnProperty('logged')) {
			if(isNumber(_this.logged)) {
				o.tasks[i].logged = _this.logged
			} else if(_this.logged === 'true' || _this.logged === true) {
				o.tasks[i].logged = Date.now()
			}
		}

		// List -- May be able to remove this.
		if(_this.hasOwnProperty('list')) {
			o.tasks[i].list = _this.list
		}

		// Timestamps
		if(_this.hasOwnProperty('time')) {
			if(isObject(_this.time)) {
				for(var j in o.tasks[i].time) {
					if(isNumber(_this.time[j])) {
						o.tasks[i].time[j] = _this.time[j]
					} else {
						var Dt = new Date(_this.time[j]).getTime()
						if(isNumber(Dt)) {
							o.tasks[i].time[j] = Dt
						}
					}
				}
			}
		}
	}
	
	// Lists
	var lists
	if(d.hasOwnProperty('lists')) lists = d.lists
	else lists = new defaults.server().lists
	
	for(var i in lists.items) {
		
		if(isObject(lists.items[i])) var _this = lists.items[i]
		else continue

		// Create blank list
		if (i == 'today' || i == 'next' || i == 'logbook') {
			o.lists.items[i] = new defaults.smartlist()
		} else {
			o.lists.items[i] = new defaults.list()
		}
		
		// Deleted
		if(_this.hasOwnProperty('deleted')) {
			if(isNumber(Number(_this.deleted))) {
				o.lists.items[i] = {
					deleted: Number(_this.deleted)
				}
			} else {
				o.lists.items[i] = {
					deleted: 0
				}
			}
		}
			
		// Name
		if(_this.hasOwnProperty('name')) {
			o.lists.items[i].name = _this.name
		}		
		
		// Order
		if(_this.hasOwnProperty('order')) {
			if(isArray(_this.order)) {
				
				// All tasks in list
				for(var j = 0; j < _this.order.length; j++) {
					if(o.tasks.hasOwnProperty(_this.order[j])) {
						if(!o.tasks[_this.order[j]].hasOwnProperty('deleted')) {
							
							// Push to order
							o.lists.items[i].order.push(_this.order[j].toString())
							
							// Update task.list
							o.tasks[_this.order[j]].list = i
							
						}
					}
				}
			}
		}
		
		// Timestamps
		if(_this.hasOwnProperty('time')) {
			if(isObject(_this.time)) {
				for(var j in o.lists.items[i].time) {
					if(isNumber(_this.time[j])) {
						o.lists.items[i].time[j] = _this.time[j]
					} else {
						var Dt = new Date(_this.time[j]).getTime()
						if(isNumber(Dt)) {
							o.lists.items[i].time[j] = Dt
						}
					}
				}
			}
		}
	}
	
	// List order. Part I: Moving and Removing.
	for(var i = 0; i < lists.order.length; i++) {
		var _this = lists.order[i].toString()
		if(typeof _this == 'object' && o.lists.items.hasOwnProperty(_this) && _this != 'today' && _this != 'next' && _this != 'logbook') {
			if(!o.lists.items[_this].hasOwnProperty('deleted')) {
				o.lists.order.push(_this)
			}
		}
	}
	
	// List order. Part II: Hidden Lists.
	for(var i in o.lists.items) {
		var _this = o.lists.items[i]
		if(typeof _this == 'object' && !_this.hasOwnProperty('deleted') && i != 'today' && i != 'next' && i != 'logbook') {
			var index = o.lists.order.indexOf(i)
			if(index < 0) {
				o.lists.order.push(i.toString())
			}
		}
	}
	
	// List Time
	if(lists.hasOwnProperty('time')) {
		o.lists.time = Number(lists.time)
	}

	d.prefs.sync = d.prefs.sync || {}
	d.prefs.sync.url = "http://app.nitrotasks.com"
	if (typeof d.prefs.sync == 'string') {
		d.prefs.sync = { url: "http://app.nitrotasks.com", interval: 'manual'}
	}
	if (d.prefs.sync.service !== 'dropbox' && d.prefs.sync.service !== 'ubuntu') {
		delete d.prefs.sync.access
		delete d.prefs.sync.email
		delete d.prefs.sync.active
		delete d.prefs.sync.service
	}

	d.tasks = o.tasks
	d.lists = o.lists

	core.storage.save()

	console.log("Cleaning complete. Took " + (Date.now() - time)/1000 + "s")

}