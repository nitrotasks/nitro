// Upgrade localStorage from 1.3.1 to 1.4

// plugin.add(function() {

	upgrade = function() {

		var storage = $.polyStorage.get('jstorage', 'empty')
		if(storage === 'empty') return

		var tasks = storage.tasks,
			lists = storage.lists,
			prefs = storage.prefs



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

		// Move scheduled list
		if(!lists.scheduled.hasOwnProperty('order')) {
			lists.items.scheduled = {
				order: [],
				time: {
					order: 0
				}
			}
		} else {
			lists.items.scheduled = $.extend(true,{}, lists.scheduled)
		}

		delete lists.scheduled


		// --------------------------
		// 			TASKS
		// --------------------------

		for(var key in tasks) {

			var _this = tasks[key]

			// Remove old properties
			delete _this.showInToday
			delete _this.today
			// delete _this.time.today
			// delete _this.time.showInToday

			// Updated logged propety
			if(_this.logged === "true" || _this.logged === true) {
				_this.logged === core.timestamp()
				_this.list = 'logbook'
				lists.items.logbook.order.push(key)
			}

			// Update date property
			if(_this.date !== "" && _this.hasOwnProperty('date')) {
				var date = new Date(_this.date)
				_this.date = date.getTime()
			}

		}


		// --------------------------
		// 			PREFS
		// --------------------------

		// Add in listSort
		prefs.listSort = {}


		core.storage.tasks = tasks
		core.storage.lists = lists
		core.storage.prefs = prefs
		core.storage.save()

	}
// })