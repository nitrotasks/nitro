templates = {
	list: '<li id="L{{id}}"><span class="name">{{name}}</span><button class="edit"></button><button class="delete"></button><span class="count">{{count}}</span></li>',
	task: {
		collapsed: '\
			<li data-id="{{id}}" class="{{checked}} animate height">\
				<div class="boxhelp">\
					<div class="{{logged}}"></div>\
					<div class="content">{{{content}}}</div>\
					{{#notes}}<div class="notes"></div>{{/notes}}\
					{{#date}}<div class="{{date.className}} label">{{date.words}}</div>{{/date}}\
					{{#list}}<div class="list label">{{list}}</div>{{/list}}\
				</div>\
			</li>',
		expanded: '<div>\
			<div class="boxhelp">\
				<div class="{{logged}}"></div>\
				<input class="content" value="{{content}}" type="text">\
				<button class="priority {{priority}}">{{i18n_priority}}</button><input value="{{date}}" type="text" class="date" placeholder="{{datePlaceholder}}">\
			</div>\
			<div class="hidden">\
				<textarea placeholder="{{notesPlaceholder}}">{{notes}}</textarea>\
			</div>\
		</div>'
	},
	button: {
		addTask: '<button class="add">{{name}}</button>',
		deleteTask: '<button class="delete">{{name}}</button>',
		addList: '<div class="listAddBTN">{{name}}</div>',
		listToggle: '<div class="list-toggle" title="{{title}}"><div class="icon"></div></div>'
	},
	dialog: {
		modal: '\
			<div class="modal" id="{{id}}">\
				<h3>{{title}}</h3>\
				<p class="message">{{message}}</p>\
				{{#button}}\
					<div class="button-container">\
						<button class="yes">{{button.yes}}</button>\
						<button class="no">{{button.no}}</button>\
					</div>\
				{{/button}}\
			</div>'
	}
}