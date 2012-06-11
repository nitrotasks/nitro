timer = {

	loadList: function() {
		var $list = $('#L0 .name')[0]

		console.time("n")

		for(var i = 1; i < 2; i++) {

			$list.click()

		}
		console.timeEnd("n")

	},

	addTask: function() {

		var $btn = $('button.add')[0]

		console.time("n")

		for(var i = 1; i < 101; i++) {

			$btn.click()

		}
		console.timeEnd("n")

	},

	mustache: function(list) {

		$('body').empty();

		var tasks = ""

		console.time("n")

		for(var i = 0; i < list.length; i++) {

			var data = core.storage.tasks[list[i]];

			tasks += Mustache.to_html(templates.task.collapsed, {
				id: i,
				content: data.content,
				notes: data.notes,
				date: data.date,
				priority: data.priority
			})

		}

		$('body').html(tasks)

		console.timeEnd("n")

	}

}