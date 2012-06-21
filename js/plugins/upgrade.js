// Upgrade localStorage from 1.3.1 to 1.4

// plugin.add(function() {

	upgrade = function() {

		var storage = $.polyStorage.get('jstorage', 'empty')
		if(storage === 'empty') return
		console.log("Running database upgrade")

		var tasks = storage.tasks,
			lists = storage.lists,
			prefs = storage.prefs

		var convertDate = function(date) {
			var date = new Date(date)
			return date.getTime()
		}

		// --------------------------
		// 			>> 1.3.1
		// --------------------------

		// Check tasks for timestamps
		for(var id in tasks) {
			if (id !== 'length' && !tasks[id].hasOwnProperty('deleted')) {
				var _this = tasks[id]
				// Check task has time object
				if (!_this.hasOwnProperty('time')) {
					_this.time = {
						content: 0,
						priority: 0,
						date: 0,
						notes: 0,
						today: 0,
						showInToday: 0,
						list: 0,
						logged: 0
					}
				}
				// Check task has sync status
				if (!_this.hasOwnProperty('synced')) {
					_this.synced = false
				}
				// Make sure list is a number
				if(typeof _this.list === 'string') _this.list = _this.list.toNum()
			}
		}
		// Check lists for timestamps
		for(var id in lists.items) {
			if (id !== 'length' && id !== '0') {
				var _this = lists.items[id]
				// Check if list has been deleted
				if (!_this.hasOwnProperty('deleted')) {
					// Check list has time object
					if (!_this.hasOwnProperty('time') || typeof(_this.time) === 'number') {					
						// Add or reset time object
						_this.time = {
							name: 0,
							order: 0
						}				
					}
					if (id !== 'today' && id !== 'next' && id !== 'someday') {
						// Check list has synced status
						if (!_this.hasOwnProperty('synced')) {				
							_this.synced = 'false';
						}
					}
					// Convert everything to numbers
					for  (var x = 0; x < _this.order.length; x++) {
						if(typeof _this.order[x] === 'string') {
							_this.order[x] = _this.order[x].toNum();
						}
					}
				}					
			}
		}
		// Make sure all lists exist
		for(var id = 1; id < lists.items.length; id++) {
			if(!lists.items.hasOwnProperty(id)) {
				lists.items[id] = {
					deleted: 0
				}
			}
		}
		//Check someday list
		if (lists.items.someday) {
			//Create Someday List
			var id = lists.items.length
			lists.items[id] = $.extend(true, {}, lists.items.someday)
			lists.items.length++
			lists.order.push(id)
			delete lists.items.someday
			// Update task.list
			for (var i = lists.items[id].order.length - 1; i >= 0; i--) {
				var _this  = lists.items[id].order[i]
				_this.list = id
			}
		}
		//Check for scheduled
		if (!lists.scheduled) {
			lists.scheduled = {length: 0}
		}
		// Check preferences exist. If not, set to default
		lists.time          = prefs.time   				|| 0
		prefs.sync 			= prefs.sync 				|| {}
		prefs.sync.interval = prefs.sync.interval  		|| 'manual'
		prefs.sync.active   = prefs.sync.active    		|| true
		prefs.sync.url      = prefs.sync.url       		|| 'http://app.nitrotasks.com'
		prefs.sync.timer    = prefs.sync.timer     		|| 120000
		prefs.lang          = prefs.lang           		|| 'english'
		prefs.bg            = prefs.bg             		|| {}
		prefs.bg.color      = prefs.bg.color       		|| ''
		prefs.bg.size       = prefs.bg.size        		|| 'tile'

		// --------------------------
		// 			LISTS
		// --------------------------

		// Fix up List 0
		lists.items[0] = {deleted: 0}

		// Add in logbook
		lists.items.logbook = {
			order: [],
			time: {
				order: 0
			}
		}

		lists.items.scheduled = {
			order: [],
			time: {
				order: 0
			}
		}

		// Fix Next list
		for (var i = lists.items.next.order.length - 1; i >= 0; i--) {
			var id = lists.items.next.order[i],
				_this = tasks[id]
			if(_this.list !== 'next') {
				lists.items.next.order.splice(i, 1)
			}
		};

		// Move scheduled tasks
		for (var key in lists.scheduled) {
			if(key !== 'length') {
				var _this = lists.scheduled[key],
					id = tasks.length
				console.log(_this, id)
				tasks[id] = $.extend(true, {}, _this)
				_this = tasks[id]
				_this.tags = []
				if(_this.priority === 'important') _this.priority = 'high'
				if(_this.next) _this.next = convertDate(_this.next)
				if(_this.ends) _this.ends = convertDate(_this.ends)

				lists.items.scheduled.order.push(id)
				tasks.length++
			}
		}

		delete lists.scheduled


		// --------------------------
		// 			TASKS
		// --------------------------

		for(var key in tasks) {

			if(key != 'length') {

				var _this = tasks[key]

				// Remove old properties
				delete _this.showInToday
				delete _this.today
				if(_this.hasOwnProperty('time')) {
					delete _this.time.showInToday
					delete _this.time.today
				}

				// Important -> High
				if(_this.priority === 'important') _this.priority = 'high'

				// Updated logged propety
				if(_this.logged === "true" || _this.logged === true) {
					_this.logged === core.timestamp()
					_this.list = 'logbook'
					lists.items.logbook.order.push(key)
				}

				// Add tags
				_this.tags = []

				// Update date property
				if(_this.date !== "" && _this.hasOwnProperty('date')) {
					_this.date = convertDate(_this.date)
				}

			}

		}


		// --------------------------
		// 			PREFS
		// --------------------------

		// Add in listSort
		prefs.listSort = {}
		prefs.version = "1.4"

		localStorage.removeItem('jstorage')
		core.storage.tasks = tasks
		core.storage.lists = lists
		core.storage.prefs = prefs
		core.storage.save()

	}
// })