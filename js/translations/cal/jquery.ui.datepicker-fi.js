/* Finnish initialisation for the jQuery UI date picker plugin. */
jQuery(function($){
	$.datepicker.regional['fi'] = {
		closeText: 'Sulje',
		prevText: 'Edellinen',
		nextText: 'Seuraava',
		currentText: 'Tänään',
		monthNames: ['tammikuu','helmikuu','maaliskuu','huhtikuu','toukokuu','kesäkuu',
		'heinäkuu','elokuu','syyskuu','lokakuu','marraskuu','joulukuu'],
		monthNamesShort: ['tammi','helmi','maalis','huhti','touko','kesä',
		'heinä','elo','syys','loka','marras','joulu'],
		dayNames: ['sunnuntai','maanantai','tiistai','keskiviikko','torstai','perjantai','lauantai'],
		dayNamesShort: ['sun','maa','tii','kes','tor','per','lau'],
		dayNamesMin: ['sun','maa','tii','kes','tor','per','lau'],
		weekHeader: 'viikko',
		dateFormat: 'mm/dd/yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['fi']);
});
