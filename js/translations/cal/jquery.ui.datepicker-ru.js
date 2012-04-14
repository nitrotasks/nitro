/* Russian initialisation for the jQuery UI date picker plugin. */
/* Written by Pryakhin Andrej (a.prayh@gmail.com). */
jQuery(function($){
	$.datepicker.regional['ru'] = {
		closeText: 'закрыть',
		prevText: '&#x3c;назад',
		nextText: 'вперёд&#x3e;',
		currentText: 'сегодня',
		monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь',
		'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
		monthNamesShort: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", 
		"Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
		dayNames: ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'],
		dayNamesShort: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
		dayNamesMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
		weekHeader: 'Ня',
		dateFormat: 'mm/dd/yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['ru']);
});
