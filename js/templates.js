templates = {
	list: '<li id="L{{id}}"><span class="name">{{name}}</span><button class="edit"></button><button class="delete"></button><span class="count">{{count}}</span></li>',
	task: {
		collapsed: '<li data-id="{{id}}"><div class="boxhelp"><div class="{{logged}}"></div><div class="content">{{content}}</div><div class="{{extraClass}}" data-class="extra">{{extra}}</div></div></li>',
		expanded: '<div>\
			<div class="boxhelp">\
				<div class="{{logged}}"></div>\
				<input class="content" value="{{content}}" type="text">\
				<button class="priority {{priority}}">{{i18n_priority}}</button><input type="text" class="date">\
			</div>\
			<div class="hidden">\
				<textarea>{{notes}}</textarea>\
			</div>\
		</div>'
	},
	button: {
		addTask: '<button class="add">{{name}}</button>',
		deleteTask: '<button class="delete">{{name}}</button>',
		addList: '<div class="listAddBTN">{{name}}</div>'
	}
}