// Upgrade localStorage from 1.3.1 to 1.4

plugin.add(function() {

	var plugin.upgrade = function() {

		var storage = $.polystorage.get('jstorage', 'empty')
		if(storage === 'empty') return

		var tasks = storage.tasks,
			lists = storage.lists,
			prefs = storage.prefs

		console.log(tasks,lists,prefs)

	}
})