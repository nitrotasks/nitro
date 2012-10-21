/* ./plugins/autosize.js */

// Autosize 1.9 - jQuery plugin for textareas
// (c) 2011 Jack Moore - jacklmoore.com
// license: www.opensource.org/licenses/mit-license.php

(function ($, undefined) {
	var 
	hidden = 'hidden',
	borderBox = 'border-box',
	copy = '<textarea style="position:absolute; top:-9999px; left:-9999px; right:auto; bottom:auto; -moz-box-sizing:content-box; -webkit-box-sizing:content-box; box-sizing:content-box; word-wrap:break-word; height:0 !important; min-height:0 !important; overflow:hidden">',
	// line-height is omitted because IE7/IE8 doesn't return the correct value.
	copyStyle = [
		'fontFamily',
		'fontSize',
		'fontWeight',
		'fontStyle',
		'letterSpacing',
		'textTransform',
		'wordSpacing',
		'textIndent'
	],
	oninput = 'oninput',
	onpropertychange = 'onpropertychange';

	$.fn.autosize = function (className) {
		return this.each(function () {
			var 
			ta = this,
			$ta = $(ta),
			mirror,
			minHeight = $ta.height(),
			maxHeight = parseInt($ta.css('maxHeight'), 10),
			active,
			i = copyStyle.length,
			resize,
			boxOffset = 0;

			if ($ta.css('box-sizing') === borderBox || $ta.css('-moz-box-sizing') === borderBox || $ta.css('-webkit-box-sizing') === borderBox){
				boxOffset = $ta.outerHeight() - $ta.height();
			}

			if ($ta.data('mirror') || $ta.data('ismirror')) {
				// if autosize has already been applied, exit.
				// if autosize is being applied to a mirror element, exit.
				return;
			} else {
				mirror = $(copy).data('ismirror', true).addClass(className || 'autosizejs')[0];

				resize = $ta.css('resize') === 'none' ? 'none' : 'horizontal';

				$ta.data('mirror', $(mirror)).css({
					overflow: hidden, 
					overflowY: hidden, 
					wordWrap: 'break-word',
					resize: resize
				});
			}

			// Opera returns '-1px' when max-height is set to 'none'.
			maxHeight = maxHeight && maxHeight > 0 ? maxHeight : 9e4;

			// Using mainly bare JS in this function because it is going
			// to fire very often while typing, and needs to very efficient.
			function adjust() {
				var height, overflow;
				// the active flag keeps IE from tripping all over itself.  Otherwise
				// actions in the adjust function will cause IE to call adjust again.
				if (!active) {
					active = true;

					mirror.value = ta.value;

					mirror.style.overflowY = ta.style.overflowY;

					// Update the width in case the original textarea width has changed
					mirror.style.width = $ta.css('width');

					// Needed for IE to reliably return the correct scrollHeight
					mirror.scrollTop = 0;

					// Set a very high value for scrollTop to be sure the 
					// mirror is scrolled all the way to the bottom.
					mirror.scrollTop = 9e4;

					height = mirror.scrollTop;
					overflow = hidden;
					if (height > maxHeight) {
						height = maxHeight;
						overflow = 'scroll';
					} else if (height < minHeight) {
						height = minHeight;
					}
					ta.style.overflowY = overflow;

					ta.style.height = height + boxOffset + 'px';
					var $task = $(ta).closest('li')
					$task.height($task.find('.boxhelp').height() + height + boxOffset)
					
					// This small timeout gives IE a chance to draw it's scrollbar
					// before adjust can be run again (prevents an infinite loop).
					setTimeout(function () {
						active = false;
					}, 1);
				}
			}

			// mirror is a duplicate textarea located off-screen that
			// is automatically updated to contain the same text as the 
			// original textarea.  mirror always has a height of 0.
			// This gives a cross-browser supported way getting the actual
			// height of the text, through the scrollTop property.
			while (i--) {
				mirror.style[copyStyle[i]] = $ta.css(copyStyle[i]);
			}

			$('body').append(mirror);

			if (onpropertychange in ta) {
				if (oninput in ta) {
					// Detects IE9.  IE9 does not fire onpropertychange or oninput for deletions,
					// so binding to onkeyup to catch most of those occassions.  There is no way that I
					// know of to detect something like 'cut' in IE9.
					ta[oninput] = ta.onkeyup = adjust;
				} else {
					// IE7 / IE8
					ta[onpropertychange] = adjust;
				}
			} else {
				// Modern Browsers
				ta[oninput] = adjust;
			}

			$(window).resize(adjust);

			// Allow for manual triggering if needed.
			$ta.bind('autosize', adjust);

			// Call adjust in case the textarea already contains text.
			adjust();
		});
	};

}(jQuery));
/* ./plugins/bootstrap-datepicker.js */

/* =========================================================
 * bootstrap-datepicker.js
 * http://www.eyecon.ro/bootstrap-datepicker
 * =========================================================
 * Copyright 2012 Stefan Petre
 * Improvements by Andrew Rowls
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */

!function( $ ) {

	// Picker object

	var Datepicker = function(element, options){
		this.element = $(element);
		this.language = options.language||this.element.data('date-language')||"i18n";
		this.language = this.language in dates ? this.language : "i18n";
		this.format = DPGlobal.parseFormat(options.format||this.element.data('date-format')||'mm/dd/yyyy');
		this.picker = $(DPGlobal.template)
							.appendTo('body')
							.on({
								click: $.proxy(this.click, this),
								mousedown: $.proxy(this.mousedown, this)
							});
		this.isInput = this.element.is('input');
		this.component = this.element.is('.date') ? this.element.find('.add-on') : false;
		if(this.component && this.component.length === 0)
			this.component = false;

		if (this.isInput) {
			this.element.on({
				focus: $.proxy(this.show, this),
				blur: $.proxy(this._hide, this),
				keyup: $.proxy(this.update, this),
				keydown: $.proxy(this.keydown, this)
			});
		} else {
			if (this.component){
				// For components that are not readonly, allow keyboard nav
				this.element.find('input').on({
					focus: $.proxy(this.show, this),
					blur: $.proxy(this._hide, this),
					keyup: $.proxy(this.update, this),
					keydown: $.proxy(this.keydown, this)
				});

				this.component.on('click', $.proxy(this.show, this));
				var element = this.element.find('input');
				element.on({
					blur: $.proxy(this._hide, this)
				})
			} else {
				this.element.on('click', $.proxy(this.show, this));
			}
		}

		this.autoclose = false;
		if ('autoclose' in options) {
			this.autoclose = options.autoclose;
		} else if ('dateAutoclose' in this.element.data()) {
			this.autoclose = this.element.data('date-autoclose');
		}

		switch(options.startView){
			case 2:
			case 'decade':
				this.viewMode = this.startViewMode = 2;
				break;
			case 1:
			case 'year':
				this.viewMode = this.startViewMode = 1;
				break;
			case 0:
			case 'month':
			default:
				this.viewMode = this.startViewMode = 0;
				break;
		}

		this.todayBtn = (options.todayBtn||this.element.data('date-today-btn')||false);

		this.weekStart = ((options.weekStart||this.element.data('date-weekstart')||dates[this.language].weekStart||0) % 7);
		this.weekEnd = ((this.weekStart + 6) % 7);
		this.startDate = -Infinity;
		this.endDate = Infinity;
		this.setStartDate(options.startDate||this.element.data('date-startdate'));
		this.setEndDate(options.endDate||this.element.data('date-enddate'));
		this.fillDow();
		this.fillMonths();
		this.update();
		this.showMode();
	};

	Datepicker.prototype = {
		constructor: Datepicker,

		show: function(e) {
			this.picker.show();
			this.height = this.component ? this.component.outerHeight() : this.element.outerHeight();
			this.place();
			$(window).on('resize', $.proxy(this.place, this));
			if (e ) {
				e.stopPropagation();
				e.preventDefault();
			}
			if (!this.isInput) {
				$(document).on('mousedown', $.proxy(this.hide, this));
			}
			this.element.trigger({
				type: 'show',
				date: this.date
			});
		},

		_hide: function(e){
			// When going from the input to the picker, IE handles the blur/click
			// events differently than other browsers, in such a way that the blur
			// event triggers a hide before the click event can stop propagation.
			if ($.browser.msie) {
				var t = this, args = arguments;

				function cancel_hide(){
					clearTimeout(hide_timeout);
					e.target.focus();
					t.picker.off('click', cancel_hide);
				}

				function do_hide(){
					t.hide.apply(t, args);
					t.picker.off('click', cancel_hide);
				}

				this.picker.on('click', cancel_hide);
				var hide_timeout = setTimeout(do_hide, 100);
			} else {
				return this.hide.apply(this, arguments);
			}
		},

		hide: function(e){
			this.picker.hide();
			$(window).off('resize', this.place);
			this.viewMode = this.startViewMode;
			this.showMode();
			if (!this.isInput) {
				$(document).off('mousedown', this.hide);
			}
			if (e && e.currentTarget.value)
				this.setValue();
			this.element.trigger({
				type: 'hide',
				date: this.date
			});
		},

		setValue: function() {
			var formated = DPGlobal.formatDate(this.date, this.format, this.language);
			if (!this.isInput) {
				if (this.component){
					this.element.find('input').prop('value', formated);
				}
				this.element.data('date', formated);
			} else {
				this.element.prop('value', formated);
			}
		},

		setStartDate: function(startDate){
			this.startDate = startDate||-Infinity;
			if (this.startDate !== -Infinity) {
				this.startDate = DPGlobal.parseDate(this.startDate, this.format, this.language);
			}
			this.update();
			this.updateNavArrows();
		},

		setEndDate: function(endDate){
			this.endDate = endDate||Infinity;
			if (this.endDate !== Infinity) {
				this.endDate = DPGlobal.parseDate(this.endDate, this.format, this.language);
			}
			this.update();
			this.updateNavArrows();
		},

		place: function(){
			var offset = this.component ? this.component.offset() : this.element.offset();
			this.picker.css({
				top: offset.top + this.height,
				left: offset.left - 150
			});
		},

		update: function(){
			this.date = DPGlobal.parseDate(
				this.isInput ? this.element.prop('value') : this.element.data('date') || this.element.find('input').prop('value'),
				this.format, this.language
			);
			if (this.date < this.startDate) {
				this.viewDate = new Date(this.startDate);
			} else if (this.date > this.endDate) {
				this.viewDate = new Date(this.endDate);
			} else {
				this.viewDate = new Date(this.date);
			}
			this.fill();
		},

		fillDow: function(){
			var dowCnt = this.weekStart;
			var html = '<tr>';
			while (dowCnt < this.weekStart + 7) {
				html += '<th class="dow">'+dates[this.language].daysMin[(dowCnt++)%7]+'</th>';
			}
			html += '</tr>';
			this.picker.find('.datepicker-days thead').append(html);
		},

		fillMonths: function(){
			var html = '';
			var i = 0
			while (i < 12) {
				html += '<span class="month">'+dates[this.language].monthsShort[i++]+'</span>';
			}
			this.picker.find('.datepicker-months td').html(html);
		},

		fill: function() {
			var d = new Date(this.viewDate),
				year = d.getFullYear(),
				month = d.getMonth(),
				startYear = this.startDate !== -Infinity ? this.startDate.getFullYear() : -Infinity,
				startMonth = this.startDate !== -Infinity ? this.startDate.getMonth() : -Infinity,
				endYear = this.endDate !== Infinity ? this.endDate.getFullYear() : Infinity,
				endMonth = this.endDate !== Infinity ? this.endDate.getMonth() : Infinity,
				currentDate = this.date.valueOf();
			this.picker.find('.datepicker-days thead th:eq(1)')
						.text(dates[this.language].months[month]+' '+year);
			this.picker.find('tfoot th.today')
						.text(dates[this.language].today)
						.toggle(this.todayBtn);
			this.updateNavArrows();
			this.fillMonths();
			var prevMonth = new Date(year, month-1, 28,0,0,0,0),
				day = DPGlobal.getDaysInMonth(prevMonth.getFullYear(), prevMonth.getMonth());
			prevMonth.setDate(day);
			prevMonth.setDate(day - (prevMonth.getDay() - this.weekStart + 7)%7);
			var nextMonth = new Date(prevMonth);
			nextMonth.setDate(nextMonth.getDate() + 42);
			nextMonth = nextMonth.valueOf();
			html = [];
			var clsName;
			while(prevMonth.valueOf() < nextMonth) {
				if (prevMonth.getDay() == this.weekStart) {
					html.push('<tr>');
				}
				clsName = '';
				if (prevMonth.getFullYear() < year || (prevMonth.getFullYear() == year && prevMonth.getMonth() < month)) {
					clsName += ' old';
				} else if (prevMonth.getFullYear() > year || (prevMonth.getFullYear() == year && prevMonth.getMonth() > month)) {
					clsName += ' new';
				}
				if (prevMonth.valueOf() == currentDate) {
					clsName += ' active';
				}
				if (prevMonth.valueOf() < this.startDate || prevMonth.valueOf() > this.endDate) {
					clsName += ' disabled';
				}
				html.push('<td class="day'+clsName+'">'+prevMonth.getDate() + '</td>');
				if (prevMonth.getDay() == this.weekEnd) {
					html.push('</tr>');
				}
				prevMonth.setDate(prevMonth.getDate()+1);
			}
			this.picker.find('.datepicker-days tbody').empty().append(html.join(''));
			var currentYear = this.date.getFullYear();

			var months = this.picker.find('.datepicker-months')
						.find('th:eq(1)')
							.text(year)
							.end()
						.find('span').removeClass('active');
			if (currentYear == year) {
				months.eq(this.date.getMonth()).addClass('active');
			}
			if (year < startYear || year > endYear) {
				months.addClass('disabled');
			}
			if (year == startYear) {
				months.slice(0, startMonth).addClass('disabled');
			}
			if (year == endYear) {
				months.slice(endMonth+1).addClass('disabled');
			}

			html = '';
			year = parseInt(year/10, 10) * 10;
			var yearCont = this.picker.find('.datepicker-years')
								.find('th:eq(1)')
									.text(year + '-' + (year + 9))
									.end()
								.find('td');
			year -= 1;
			for (var i = -1; i < 11; i++) {
				html += '<span class="year'+(i == -1 || i == 10 ? ' old' : '')+(currentYear == year ? ' active' : '')+(year < startYear || year > endYear ? ' disabled' : '')+'">'+year+'</span>';
				year += 1;
			}
			yearCont.html(html);
		},

		updateNavArrows: function() {
			var d = new Date(this.viewDate),
				year = d.getFullYear(),
				month = d.getMonth();
			switch (this.viewMode) {
				case 0:
					if (this.startDate !== -Infinity && year <= this.startDate.getFullYear() && month <= this.startDate.getMonth()) {
						this.picker.find('.prev').css({visibility: 'hidden'});
					} else {
						this.picker.find('.prev').css({visibility: 'visible'});
					}
					if (this.endDate !== Infinity && year >= this.endDate.getFullYear() && month >= this.endDate.getMonth()) {
						this.picker.find('.next').css({visibility: 'hidden'});
					} else {
						this.picker.find('.next').css({visibility: 'visible'});
					}
					break;
				case 1:
				case 2:
					if (this.startDate !== -Infinity && year <= this.startDate.getFullYear()) {
						this.picker.find('.prev').css({visibility: 'hidden'});
					} else {
						this.picker.find('.prev').css({visibility: 'visible'});
					}
					if (this.endDate !== Infinity && year >= this.endDate.getFullYear()) {
						this.picker.find('.next').css({visibility: 'hidden'});
					} else {
						this.picker.find('.next').css({visibility: 'visible'});
					}
					break;
			}
		},

		click: function(e) {
			e.stopPropagation();
			e.preventDefault();
			var target = $(e.target).closest('span, td, th');
			if (target.length == 1) {
				switch(target[0].nodeName.toLowerCase()) {
					case 'th':
						switch(target[0].className) {
							case 'switch':
								this.showMode(1);
								break;
							case 'prev':
							case 'next':
								var dir = DPGlobal.modes[this.viewMode].navStep * (target[0].className == 'prev' ? -1 : 1);
								switch(this.viewMode){
									case 0:
										this.viewDate = this.moveMonth(this.viewDate, dir);
										break;
									case 1:
									case 2:
										this.viewDate = this.moveYear(this.viewDate, dir);
										break;
								}
								this.fill();
								break;
							case 'today':
								var date = new Date();
								date.setHours(0);
								date.setMinutes(0);
								date.setSeconds(0);
								date.setMilliseconds(0);

								this.showMode(-2);
								this._setDate(date);
								break;
						}
						break;
					case 'span':
						if (!target.is('.disabled')) {
							this.viewDate.setDate(1);
							if (target.is('.month')) {
								var month = target.parent().find('span').index(target);
								this.viewDate.setMonth(month);
							} else {
								var year = parseInt(target.text(), 10)||0;
								this.viewDate.setFullYear(year);
							}
							this.showMode(-1);
							this.fill();
						}
						break;
					case 'td':
						if (target.is('.day') && !target.is('.disabled')){
							var day = parseInt(target.text(), 10)||1;
							var year = this.viewDate.getFullYear(),
								month = this.viewDate.getMonth();
							if (target.is('.old')) {
								if (month == 0) {
									month = 11;
									year -= 1;
								} else {
									month -= 1;
								}
							} else if (target.is('.new')) {
								if (month == 11) {
									month = 0;
									year += 1;
								} else {
									month += 1;
								}
							}
							this._setDate(new Date(year, month, day,0,0,0,0));
						}
						break;
				}
			}
		},

		_setDate: function( date ){
			this.date = date;
			this.viewDate = date;
			this.fill();
			this.setValue();
			this.element.trigger({
				type: 'changeDate',
				date: this.date
			});
			var element;
			if (this.isInput) {
				element = this.element;
			} else if (this.component){
				element = this.element.find('input');
			}
			if (element) {
				element.change();
				if (this.autoclose) {
					element.blur();
				}
			}
		},

		mousedown: function(e){
			e.stopPropagation();
			e.preventDefault();
		},

		moveMonth: function(date, dir){
			if (!dir) return date;
			var new_date = new Date(date.valueOf()),
				day = new_date.getDate(),
				month = new_date.getMonth(),
				mag = Math.abs(dir),
				new_month, test;
			dir = dir > 0 ? 1 : -1;
			if (mag == 1){
				test = dir == -1
					// If going back one month, make sure month is not current month
					// (eg, Mar 31 -> Feb 31 == Feb 28, not Mar 02)
					? function(){ return new_date.getMonth() == month; }
					// If going forward one month, make sure month is as expected
					// (eg, Jan 31 -> Feb 31 == Feb 28, not Mar 02)
					: function(){ return new_date.getMonth() != new_month; };
				new_month = month + dir;
				new_date.setMonth(new_month);
				// Dec -> Jan (12) or Jan -> Dec (-1) -- limit expected date to 0-11
				if (new_month < 0 || new_month > 11)
					new_month = (new_month + 12) % 12;
			} else {
				// For magnitudes >1, move one month at a time...
				for (var i=0; i<mag; i++)
					// ...which might decrease the day (eg, Jan 31 to Feb 28, etc)...
					new_date = this.moveMonth(new_date, dir);
				// ...then reset the day, keeping it in the new month
				new_month = new_date.getMonth();
				new_date.setDate(day);
				test = function(){ return new_month != new_date.getMonth(); };
			}
			// Common date-resetting loop -- if date is beyond end of month, make it
			// end of month
			while (test()){
				new_date.setDate(--day);
				new_date.setMonth(new_month);
			}
			return new_date;
		},

		moveYear: function(date, dir){
			return this.moveMonth(date, dir*12);
		},

		keydown: function(e){
			if (this.picker.is(':not(:visible)')){
				if (e.keyCode == 27) // allow escape to hide and re-show picker
					this.show();
				return;
			}
			var dateChanged = false,
				dir, day, month;
			switch(e.keyCode){
				case 27: // escape
					this.hide();
					e.preventDefault();
					break;
				case 37: // left
				case 39: // right
					dir = e.keyCode == 37 ? -1 : 1;
					if (e.ctrlKey){
						this.date = this.moveYear(this.date, dir);
						this.viewDate = this.moveYear(this.viewDate, dir);
					} else if (e.shiftKey){
						this.date = this.moveMonth(this.date, dir);
						this.viewDate = this.moveMonth(this.viewDate, dir);
					} else {
						this.date.setDate(this.date.getDate() + dir);
						this.viewDate.setDate(this.viewDate.getDate() + dir);
					}
					this.setValue();
					this.update();
					e.preventDefault();
					dateChanged = true;
					break;
				case 38: // up
				case 40: // down
					dir = e.keyCode == 38 ? -1 : 1;
					if (e.ctrlKey){
						this.date = this.moveYear(this.date, dir);
						this.viewDate = this.moveYear(this.viewDate, dir);
					} else if (e.shiftKey){
						this.date = this.moveMonth(this.date, dir);
						this.viewDate = this.moveMonth(this.viewDate, dir);
					} else {
						this.date.setDate(this.date.getDate() + dir * 7);
						this.viewDate.setDate(this.viewDate.getDate() + dir * 7);
					}
					this.setValue();
					this.update();
					e.preventDefault();
					dateChanged = true;
					break;
				case 13: // enter
					this.hide();
					e.preventDefault();
					break;
			}
			if (dateChanged){
				this.element.trigger({
					type: 'changeDate',
					date: this.date
				});
				var element;
				if (this.isInput) {
					element = this.element;
				} else if (this.component){
					element = this.element.find('input');
				}
				if (element) {
					element.change();
				}
			}
		},

		showMode: function(dir) {
			if (dir) {
				this.viewMode = Math.max(0, Math.min(2, this.viewMode + dir));
			}
			this.picker.find('>div').hide().filter('.datepicker-'+DPGlobal.modes[this.viewMode].clsName).show();
			this.updateNavArrows();
		}
	};

	$.fn.datepicker = function ( option ) {
		var args = Array.apply(null, arguments);
		args.shift();
		return this.each(function () {
			var $this = $(this),
				data = $this.data('datepicker'),
				options = typeof option == 'object' && option;
			if (!data) {
				$this.data('datepicker', (data = new Datepicker(this, $.extend({}, $.fn.datepicker.defaults,options))));
			}
			if (typeof option == 'string') data[option].apply(data, args);
		});
	};

	$.fn.datepicker.defaults = {
	};
	$.fn.datepicker.Constructor = Datepicker;
	var dates = $.fn.datepicker.dates = {
		// Nitro is using its own dictionary for translations
		// If you wish to add translations for day/month names, see this folder: /js/translations/
		i18n: {
			days: [
				$.i18n._("sunday"),
				$.i18n._("monday"),
				$.i18n._("tuesday"),
				$.i18n._("wednesday"),
				$.i18n._("thursday"),
				$.i18n._("friday"),
				$.i18n._("saturday"),
				$.i18n._("sunday")
			],
			daysShort: [
				$.i18n._("sunShort"),
				$.i18n._("monShort"),
				$.i18n._("tueShort"),
				$.i18n._("wedShort"),
				$.i18n._("thuShort"),
				$.i18n._("friShort"),
				$.i18n._("satShort"),
				$.i18n._("sunShort")
			],
			daysMin: [
				$.i18n._("sunMin"),
				$.i18n._("monMin"),
				$.i18n._("tueMin"),
				$.i18n._("wedMin"),
				$.i18n._("thuMin"),
				$.i18n._("friMin"),
				$.i18n._("satMin"),
				$.i18n._("sunMin")
			],
			months: [
				$.i18n._("january"),
				$.i18n._("february"),
				$.i18n._("march"),
				$.i18n._("april"),
				$.i18n._("may"),
				$.i18n._("june"),
				$.i18n._("july"),
				$.i18n._("august"),
				$.i18n._("september"),
				$.i18n._("october"),
				$.i18n._("november"),
				$.i18n._("december")
			],
			monthsShort: [
				$.i18n._("janShort"),
				$.i18n._("febShort"),
				$.i18n._("marShort"),
				$.i18n._("aprShort"),
				$.i18n._("mayShort"),
				$.i18n._("junShort"),
				$.i18n._("julShort"),
				$.i18n._("augShort"),
				$.i18n._("sepShort"),
				$.i18n._("octShort"),
				$.i18n._("novShort"),
				$.i18n._("decShort")
			],
			today: $.i18n._('today')
		}
	}

	var DPGlobal = {
		modes: [
			{
				clsName: 'days',
				navFnc: 'Month',
				navStep: 1
			},
			{
				clsName: 'months',
				navFnc: 'FullYear',
				navStep: 1
			},
			{
				clsName: 'years',
				navFnc: 'FullYear',
				navStep: 10
		}],
		isLeapYear: function (year) {
			return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0))
		},
		getDaysInMonth: function (year, month) {
			return [31, (DPGlobal.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]
		},
		validParts: /dd?|mm?|MM?|yy(?:yy)?/g,
		nonpunctuation: /[^ -\/:-@\[-`{-~\t\n\r]+/g,
		parseFormat: function(format){
			// IE treats \0 as a string end in inputs (truncating the value),
			// so it's a bad format delimiter, anyway
			var separators = format.replace(this.validParts, '\0').split('\0'),
				parts = format.match(this.validParts);
			if (!separators || !separators.length || !parts || parts.length == 0){
				throw new Error("Invalid date format.");
			}
			return {separators: separators, parts: parts};
		},
		parseDate: function(date, format, language) {
			if (date instanceof Date) return date;
			if (/^[-+]\d+[dmwy]([\s,]+[-+]\d+[dmwy])*$/.test(date)) {
				var part_re = /([-+]\d+)([dmwy])/,
					parts = date.match(/([-+]\d+)([dmwy])/g),
					part, dir;
				date = new Date();
				for (var i=0; i<parts.length; i++) {
					part = part_re.exec(parts[i]);
					dir = parseInt(part[1]);
					switch(part[2]){
						case 'd':
							date.setDate(date.getDate() + dir);
							break;
						case 'm':
							date = Datepicker.prototype.moveMonth.call(Datepicker.prototype, date, dir);
							break;
						case 'w':
							date.setDate(date.getDate() + dir * 7);
							break;
						case 'y':
							date = Datepicker.prototype.moveYear.call(Datepicker.prototype, date, dir);
							break;
					}
				}
				return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
			}
			var parts = date ? date.match(this.nonpunctuation) : [],
				date = new Date(),
				parsed = {},
				setters_order = ['yyyy', 'yy', 'M', 'MM', 'm', 'mm', 'd', 'dd'],
				setters_map = {
					yyyy: function(d,v){ return d.setFullYear(v); },
					yy: function(d,v){ return d.setFullYear(2000+v); },
					m: function(d,v){ return d.setMonth(v-1); },
					d: function(d,v){ return d.setDate(v); }
				},
				val, filtered, part;
			setters_map['M'] = setters_map['MM'] = setters_map['mm'] = setters_map['m'];
			setters_map['dd'] = setters_map['d'];
			date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
			if (parts.length == format.parts.length) {
				for (var i=0, cnt = format.parts.length; i < cnt; i++) {
					val = parseInt(parts[i], 10)||1;
					part = format.parts[i];
					switch(part) {
						case 'MM':
							filtered = $(dates[language].months).filter(function(){
								var m = this.slice(0, parts[i].length),
									p = parts[i].slice(0, m.length);
								return m == p;
							});
							val = $.inArray(filtered[0], dates[language].months) + 1;
							break;
						case 'M':
							filtered = $(dates[language].monthsShort).filter(function(){
								var m = this.slice(0, parts[i].length),
									p = parts[i].slice(0, m.length);
								return m == p;
							});
							val = $.inArray(filtered[0], dates[language].monthsShort) + 1;
							break;
					}
					parsed[part] = val;
				}
				for (var i=0, s; i<setters_order.length; i++){
					s = setters_order[i];
					if (s in parsed)
						setters_map[s](date, parsed[s])
				}
			}
			return date;
		},
		formatDate: function(date, format, language){
			var val = {
				d: date.getDate(),
				m: date.getMonth() + 1,
				M: dates[language].monthsShort[date.getMonth()],
				MM: dates[language].months[date.getMonth()],
				yy: date.getFullYear().toString().substring(2),
				yyyy: date.getFullYear()
			};
			val.dd = (val.d < 10 ? '0' : '') + val.d;
			val.mm = (val.m < 10 ? '0' : '') + val.m;
			var date = [],
				seps = $.extend([], format.separators);
			for (var i=0, cnt = format.parts.length; i < cnt; i++) {
				if (seps.length)
					date.push(seps.shift())
				date.push(val[format.parts[i]]);
			}
			return date.join('');
		},
		headTemplate: '<thead>'+
							'<tr>'+
								'<th class="prev"><i class="icon-arrow-left"/></th>'+
								'<th colspan="5" class="switch"></th>'+
								'<th class="next"><i class="icon-arrow-right"/></th>'+
							'</tr>'+
						'</thead>',
		contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>',
		footTemplate: '<tfoot><tr><th colspan="7" class="today"></th></tr></tfoot>'
	};
	DPGlobal.template = '<div class="datepicker dropdown-menu">'+
							'<div class="datepicker-days">'+
								'<table class=" table-condensed">'+
									DPGlobal.headTemplate+
									'<tbody></tbody>'+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
							'<div class="datepicker-months">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
							'<div class="datepicker-years">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
						'</div>';
}( window.jQuery )
/* ./plugins/cleanDB.js */

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
/* ./plugins/cmd.js */

// CMD
// Easily do something in a single line

cmd = function (cmd) {
	// Contains all the commands

	switch(cmd) {
		// File Menu
		case 'newtask':
			$addBTN.click()
			break
		case 'newlist':
			$sidebar.find('.listAddBTN').click()
			break
		case 'sync':
			$runSync.click()
			break

		// Edit Menu
		case 'find':
			$search.focus()
			break
		case 'prefs':
			$settingsbtn.click()
			$('a[data-target=#tabGeneral]').tab('show')
			break

		// Sort
		case 'sort-magic':
			$sortType.find('.magic').parent().click()
			break
		case 'sort-default':
			$sortType.find('.default').parent().click()
			break
		case 'sort-priority':
			$sortType.find('.priority').parent().click()
			break
		case 'sort-date':
			$sortType.find('.date').parent().click()
			break

		// GoTo
		case 'today':
			$('#Ltoday .name').click()
			break
		case 'next':
			$('#Lnext .name').click()
			break
		case 'scheduled':
			$('#Lscheduled .name').click()
			break
		case 'logbook':
			$('#Llogbook .name').click()
			break
		case 'allTasks':
			$('#Lall .name').click()
			break

		// View menu
		case 'language':
			$settingsbtn.click()
			$('a[data-target=#tabLanguage]').tab('show')
			break
		case 'theme':
			$settingsbtn.click()
			$('a[data-target=#tabTheme]').tab('show')
			break
		case 'syncSettings':
			$settingsbtn.click()
			$('a[data-target=#tabSync]').tab('show')
			break

		// Help Menu
		case 'about':
			$settingsbtn.click()
			$('a[data-target=#tabAbout]').tab('show')
			break
		case 'donors':
			cmd('about')
			break
		case 'donate':
			window.location = 'http://nitrotasks.com/donate.html'
			break
		case 'help':
			cmd('about')
			break
		case 'bug':
			window.location = 'https://github.com/stayradiated/Nitro/issues'
			break

		// Extra stuff for keyboard shortcuts
		case 'editTask':
			// $editBTN.click()
			$tasks.find('.selected').map(function() {
				$(this).trigger(jQuery.Event('dblclick', {metaKey: true}))
			})
			break
		case 'editList':
			$sidebar.find('.selected .name').dblclick()
			break
		case 'check':
			$tasks.find('.selected .checkbox').click()
			break
		case 'delete':
			// if($warning.is(':visible')) $("#overlay").click()
			$delBTN.click()
			break

		case 'prevTask':
			if(!$tasks.find('.selected').length) {
				$tasks.find('li').first().addClass('selected')
			} else {
				if(ui.session.selected === 'next') {
					if($tasks.find('.selected').is(':first-of-type')) {
						$tasks.find('.selected').parent().prev().prev().find('li').last().find('.content').click()
					} else {
						$tasks.find('.selected').prevAll('li:not(".hidden")').first().find('.content').click()
					}
				} else {
					$tasks.find('.selected').prev('li').find('.content').click()
				}
			}
			
			break
		case 'nextTask':
			if(!$tasks.find('.selected').length) {
				$tasks.find('li').first().addClass('selected')
			} else {
				if(ui.session.selected === 'next') {
					if($tasks.find('.selected').is(':last-of-type')) {
						$tasks.find('.selected').parent().next().next().find('li').first().find('.content').click()
					} else {
						$tasks.find('.selected').nextAll('li:not(".hidden")').first().find('.content').click()
					}
				} else {
					$tasks.find('.selected').next('li').find('.content').click()
				}
			}
			break
		case 'prevList':
			if(!$sidebar.find('.selected').length) {
				$sidebar.find('li').first().find('.name').click()
			} else if ($sidebar.find('.selected').is(':first-of-type')) {
				$sidebar.find('.selected').parent().prev('h2').prev('ul').find('li').last().find('.name').click()
			} else {
				$sidebar.find('.selected').prev('li').find('.name').click()
			}
			break
		case 'nextList':
			if(!$sidebar.find('.selected').length) {
				$sidebar.find('li').first().find('.name').click()
			} else if ($sidebar.find('.selected').is(':last-of-type')) {
				$sidebar.find('.selected').parent().next('h2').next('ul').find('li').first().find('.name').click()
			} else {
				$sidebar.find('.selected').next('li').find('.name').click()
			}
			break

		case 'moveTaskUp':
			if($tasks.find('.selected').length) {
				var $this = $tasks.find('.selected').first(),
					id = $this.attr('data-id'),
					$parent = $this.parent()

				if(ui.session.selected === 'next') {
					var l = core.storage.lists.items[$parent.attr('id')].order,
						i = l.indexOf(id)
				} else {
					var	l = core.storage.lists.items[ui.session.selected].order,
						i = l.indexOf(id)
				}

				if(i > 0) {
					l.splice(i, 1)
					l.splice(i - 1, 0, id)

					if($parent.is('.wholeList')) {
						$parent.find('li, p').remove()
						for (var i in l) {
							$parent.addClass('wholeList').append(ui.tasks.draw(l[i]))
						}
					} else {
						$sidebar.find('.selected .name').click()
					}

					$tasks.find('[data-id='+id+']').addClass('selected')
					core.storage.save()
				}
			}
			break
		case 'moveTaskDown':
			if($tasks.find('.selected').length) {
				var $this = $tasks.find('.selected').first(),
					id = $this.attr('data-id'),
					$parent = $this.parent()

				if(ui.session.selected === 'next') {
					var l = core.storage.lists.items[$parent.attr('id')].order,
						i = l.indexOf(id)
				} else {
					var	l = core.storage.lists.items[ui.session.selected].order,
						i = l.indexOf(id)
				}

				if(i > -1 && !$this.is(':last-of-type')) {
					l.splice(i, 1)
					l.splice(i + 1, 0, id)

					if($parent.is('.wholeList')) {
						$parent.find('li, p').remove()
						for (var i in l) {
							$parent.addClass('wholeList').append(ui.tasks.draw(l[i]))
						}
					} else {
						$sidebar.find('.selected .name').click()
					}

					$tasks.find('[data-id='+id+']').addClass('selected')
					core.storage.save()
				}
			}
			break
		case 'moveListUp':
			var id = ui.session.selected,
				l = core.storage.lists.order,
				i = l.indexOf(id)
			if(i > 0) {
				l.splice(i, 1)
				l.splice(i - 1, 0, id)
				ui.reload()
				$('#L' + id + ' .name').click()
				core.storage.save()
			}
			break
		case 'moveListDown':
			var id = ui.session.selected,
				l = core.storage.lists.order,
				i = l.indexOf(id)
			if(i > -1) {
				l.splice(i, 1)
				l.splice(i + 1, 0, id)
				ui.reload()
				$('#L' + id + ' .name').click()
				core.storage.save()
			}
			break

		case 'escape':
			$('#overlay, #settingsOverlay').click()
			break
	}
}

// Mac Wrapper
macWrapper = function(input) {
	// example input: "<NSMenuItem: 0x10012e170 Next>"
	var raw = input.split(' '),
		command = "";
		
	// Remove first two values
	raw.splice(0, 2);
	
	var length = raw.length;
	for (var i = 0; i < length; i++) {
		if (i == length - 1) {
			command += raw[i].slice(0,-1);
		} else {
			command += raw[i] + " ";
		}
	}
	
	console.log(command);
	
	switch (command) {
		case "New Task":
			cmd('newtask');
			break;
		case "New List":
			cmd('newlist');
			break;
		case "Sync":
			cmd("sync");
			break;
		case "Today":
			cmd("today");
			break;
		case "Next":
			cmd("next");
			break;
		case "Logbook":
			cmd("logbook");
			break;
		case "All Tasks":
			cmd("allTasks");
			break;
		case "About Nitro":
			cmd("about");
			break;
		case "Preferences…":
			cmd("prefs");
			break;
	}
}
/* ./plugins/filter.js */

/* Filters Plugin for Nitro
 * By Jono Cooper & George Czabania
 * Licensed under the BSD License
 */

//Adds as a plugin
plugin.add(function() {
	
	console.log("Loaded filter.js")
	
	filter = function(list, filters) {
		
		// This will check one task and either return true or false
		var check = function(task, key, property) {
			
			// Handles multiple properties in an array
			if(typeof property === 'object') {
				var match = false;
				// Loop through this
				for(var i = 0; i < property.length; i++) {			
					if(check(task, key, property[i])) {
						match = true;
					}
				}
				return match;
			}
			
			// Formats the property value
			switch(key) {
				
				case "logged":
						
					// Get tasks that are logged
					if (property === true) {
						if(typeof task[key] == 'number') return true;
						
					// Get tasks that were logged after a certain time
					} else if (typeof property == 'number') {
						if(task[key] >= property) return true;
					}
					break;
					
				case "notes":
				
					// Get tasks with notes
					if (property === true) {
						// Notes must have at least one non-space char
						if(task[key].match(/\S/)) return true;
					}
					break;
					
				case "priority":
				
					// Gets tasks without a priority
					if (property === false) {
						property = "none";
					
					// Get tasks that have a priority
					} else if (property === true) {
						if(task[key] !== "none") return true;
					}
					break;
					
				case "date":
				
					if (property === true) {
						if (task[key] != false) return true;
					}
				
					var due = new Date(task[key]),
						today = new Date();
						
					if (property == 'month') {
						if (due.getMonth() == today.getMonth()) return true;
					}
				
					// Copy date parts of the timestamps, discarding the time parts.
					var one = new Date(due.getFullYear(), due.getMonth(), due.getDate());
					var two = new Date(today.getFullYear(), today.getMonth(), today.getDate());
					
					// Do the math.
					var millisecondsPerDay = 1000 * 60 * 60 * 24;
					var millisBetween = one.getTime() - two.getTime();
					var days = millisBetween / millisecondsPerDay;
					
					// Round down.
					var diff = Math.floor(days);
					
					// Get tasks due today
					if (property == 'overdue') {
						if (diff < 0) return true
					} else if (property == 'today') {
						if (diff === 0) return true;
					} else if(property == 'tomorrow') {
						if (diff <= 1) return true;
					} else if (property == 'week') {
						if (diff <= 7) return true;
					} else if (property == 'fortnight') {
						if (diff <= 14) return true;
					} else if (typeof property == 'number') {
						if (diff <= property) return true;
					}
					break;
			}
			
			if(task[key] == property) {
				return true;
			} else {
				return false;
			}
		}
		
		var results = [];		
		
		// Loop through tasks
		for(var i = 0; i < list.length; i++) {
			
			var task = core.storage.tasks[list[i]];
			
			for(var key in filters) {
				
				// Convert string to boolean
				if(filters[key] === 'true') filters[key] = true;
				if(filters[key] === 'false') filters[key] = false;
				
				if(check(task, key, filters[key])) {
					
					results.push(list[i]);
					
				}
				
			}
			
		}

		// Get all tasks that are logged, but not in the logbook
		if(filters === 'logged') {
			for (var i in core.storage.tasks) {
				if(
					!core.storage.tasks[i].hasOwnProperty('deleted') && // Not deleted
					 core.storage.tasks[i].logged && 					// Logged
					 core.storage.tasks[i].list !== 'logbook'			// Not in logbook
				) {
					results.push(i);
				}
			}
		}
		
		return results;
		
	};
	
});
/* ./plugins/keys.js */

// Keyboard Shortcuts!

key('up, k', function() {cmd('prevTask')})
key('down, j', function() {cmd('nextTask')})
key('⌘+up, ⌘+k', function() {cmd('moveTaskUp')})
key('⌘+down, ⌘+j', function() {cmd('moveTaskDown')})

key('⇧+up, ⇧+k, i', function() {cmd('prevList')})
key('⇧+down, ⇧+j, u', function() {cmd('nextList')})
key('⇧+⌘+up, ⇧+⌘+k', function() {cmd('moveListUp')})
key('⇧+⌘+down, ⇧+⌘+j', function() {cmd('moveListDown')})

key('space', function() {cmd('check')})
key('enter', function() {cmd('editTask'); return false})
key('⌘+enter', function() {cmd('editList'); return false})

key('delete', function() {cmd('delete')})

if (app != 'mac') {
	key('f', function() {cmd('find'); return false})
	key('p', function() {cmd('prefs')})
	// key('a', function() {cmd('about')})
	// key('h', function() {cmd('help')})

	key('n, t', function() {cmd('newtask'); return false})
	key('l', function() {cmd('newlist'); return false})
	key('s', function() {cmd('sync')})

	key('1', function() {cmd('today')})
	key('2', function() {cmd('next')})
	key('3', function() {cmd('logbook')})
	key('4', function() {cmd('allTasks')})
}

key('esc', function() {cmd('escape')})

// Lists
$lists.on('keydown', 'input', function(e) {
	if(e.keyCode === 13) {
		ui.toggleListEdit($(this).parent(), 'close')
	}
})

// Tasks
$tasks.on('keydown', 'input.content', function(e) {
	if(e.keyCode === 13) {
		var $this = $(this).closest('li'),
			id = $this.attr('data-id')
		ui.toggleTaskEdit($this, {}, function() {
			$tasks.find('[data-id='+id+']').click()
		})
	}
})

$tasks.on('keydown', 'input, textarea', function(e) {
	if(e.keyCode === 27) {
		var $this = $(this).closest('li'),
			id = $this.attr('data-id')
		ui.toggleTaskEdit($this, {}, function() {
			$tasks.find('[data-id='+id+']').click()
		})
	}
})
/* ./plugins/search.js */

/* Nitro Search Plugin
 * By Jono Cooper & George Czabania
 * Licensed under the BSD License
 */

 /*jshint asi:true*/

//Adds as a plugin
plugin.add(function() {

	// Append search box to DOM and cache element
	$panel.right.append('<input id="search" type="search" placeholder="'+$.i18n._('search')+'">')
	$search = $("#search")


	// Run search when the user enters a key
	$search.on('keyup', function() {

		var $this = $(this),
			input = $this.val()

		if (input === '') {

			// If there's no input, just load list
			$sidebar.find('.selected .name').click()

		} else {

			// Puts the results into the UI
			$tasks.html('<h2>'+$.i18n._('searchResults')+': ' + $this.val() + '</h2><ul></ul>')

			// Set vars
			var query = input.split(' '),
				results = [],
				loggedResults = [],
				search, str, tasks, key

			// All Tasks list
			if (ui.session.selected == 'all') {

				// Loop through all tasks
				for (key in core.storage.tasks) {

					// Ignore deleted tasks
					if(!core.storage.tasks[key].hasOwnProperty('deleted')) {

						// Search Task
						str = searcher(key, query)
						if (str) {
							if (core.storage.tasks[key].list === 'logbook') {
								loggedResults.push(str)
							} else {
								results.push(str)
							}
						}
					}
				}

			// Today list
			} else if (ui.session.selected == 'today') {

				// Search tasks that are due today as well
				tasks = core.list('today').populate()
				for (key in tasks) {
					str = searcher(tasks[key], query)
					if (str) {
						results.push(str)
					}
				}

			// Every other list
			} else {
				tasks = core.storage.lists.items[ui.session.selected].order
				for (key in tasks) {
					str = searcher(tasks[key], query)
					if(str) results.push(str)
				}
			}

			// Draws
			$tasks.find('ul').append(ui.lists.drawTasks(results))

			// Offer to show logged results
			if (loggedResults.length) {

				// Add a button with correctly pluralized text
				$tasks.append('<a class="showMore">' +
					((loggedResults.length === 1) ? $l._('showLoggedTask') : $l._('showLoggedTasks', [loggedResults.length])) +
					'</a>')

				// Show the logged results when the button is clicked
				$tasks.find('.showMore').click(function () {
					$tasks.find('ul').append(ui.lists.drawTasks(loggedResults))
					$(this).hide()
				})
			}
		}
	})

	// Will determine wether a task matches a query
	var searcher = function(taskId, query) {
		var pass1 = [],
			pass2 = true;

		// Loop through each word in the query
		for (var q = 0; q < query.length; q++) {

			// Create new search
			search = new RegExp(query[q], 'i');

			if(typeof(taskId) == 'function') {
				//Nope. Not a good idea
				return;
			}

			var task = core.storage.tasks[taskId]

			// Search
			if (search.test(task.content + task.notes)) {
				pass1.push(true);
			} else {
				pass1.push(false);
			}
		}

		// This makes sure that the task has matched each word in the query
		for (var p = 0; p < pass1.length; p++) {
			if (pass1[p] === false) {
				pass2 = false;
			}
		}

		// If all terms match then add task to the results array
		if (pass2) return (taskId)
		else return false
	}
})
/* ./plugins/settings.js */

$(function() {
	//Adds button to panel
	$panel.right.prepend('<button class="settingsbtn"></button>')
	$settingsbtn = $('.settingsbtn')
	$settingsbtn.on('click', function () {
		$tasks.find('.expanded').dblclick();
		$('#prefsDialog').modal();
	})
	$('body').append('\
		<div id="prefsDialog">\
			<ul class="nav nav-tabs"><li class="active"><a href="#" data-target="#tabGeneral" data-toggle="tab" class="translate" data-translate="general">g</a></li><li><a href="#" data-target="#tabLanguage" data-toggle="tab" class="translate" data-translate="language">g</a></li><li><a href="#" data-target="#tabTheme" data-toggle="tab" class="translate" data-translate="theme">g</a></li><li><a href="#" data-target="#tabSync" data-toggle="tab" class="translate" data-translate="sync">g</a></li><li><a href="#" data-target="#tabAbout" data-toggle="tab" class="translate" data-translate="about">g</a></li></ul>\
			<div class="tab-content">  \
				<div class="tab-pane active" id="tabGeneral">\
				<form>\
					<input type="checkbox" id="deleteWarnings"><label for="deleteWarnings" class="translate" data-translate="hideWarnings"></label><br>\
					<label class="description translate" data-translate="deleteWarningsDescription"></label><br>\
					<label class="left translate" for="weekStartsOn" data-translate="weekStartsOn"></label><select id="weekStartsOn">\
						<option class="translate" data-translate="sunday" value="0"></option>\
						<option class="translate" data-translate="monday" value="1"></option>\
						<option class="translate" data-translate="tuesday" value="2"></option>\
						<option class="translate" data-translate="wednesday" value="3"></option>\
						<option class="translate" data-translate="thursday" value="4"></option>\
						<option class="translate" data-translate="friday" value="5"></option>\
						<option class="translate" data-translate="saturday" value="6"></option>\
					</select>\
					<br>\
					<label class="left translate" for="dateFormat" data-translate="dateFormat"></label>\
					<select id="dateFormat" class="right">\
						<option class="translate" data-translate="dmy" value="dd/mm/yyyy">day/month/year</option>\
						<option class="translate" data-translate="mdy" value="mm/dd/yyyy">month/day/year</option>\
						<option class="translate" data-translate="ymd" value="yyyy/mm/dd">year/month/day</option>\
					</select>\
					<hr>\
					<label class="left translate" data-translate="nextDescription"> </label><select id="nextAmount">\
						<option value="noLists" class="translate" data-translate="nextNoLists"></option>\
						<option value="everything" class="translate" data-translate="nextEverything"></option>\
					</select>\
					<hr>\
					<label class="left translate" data-translate="resetnitro"> </label><button id="cleardata" class="translate" data-translate="cleardata"></button>\
				</form>\
				</div>  \
				<div class="tab-pane" id="tabLanguage">\
					<table>\
						<thead>\
							<tr>\
								<th class="translate" data-translate="language"></th>\
								<th class="translate" data-translate="authortext"></th>\
								<th class="translate" data-translate="language"></th>\
								<th class="translate" data-translate="authortext"></th>\
							</tr>\
						</thead>\
						<tbody>\
							<tr>\
								<td class="language"><a href="#" data-value="english">English</a></td>\
								<td class="author">Caffeinated Code</td>\
								<td class="language"><a href="#" data-value="hungarian">Magyar</a></td>\
								<td class="author"><a href="mailto:sjozsef0227@gmail.com">József Samu</a>\
							</tr>\
							<tr>\
								<td class="language"><a href="#" data-value="pirate">English (Pirate)</a></td>\
								<td class="author">Caffeinated Code</td>\
								<td class="language"><a href="#" data-value="dutch">Nederlands</a></td>\
								<td class="author"><a href="mailto:erik.am@solcon.nl">Erik Ammerlaan</a>\
							</tr>\
							<tr>\
								<td class="language"><a href="#" data-value="german">Deutsch</a></td>\
								<td class="author"><a href="mailto:d.peteranderl@googlemail.com">Dennis Peteranderl</a>, <a href="info@agentur-simon.de">Bertram Simon</a></td>\
								<td class="language"><a href="#" data-value="portuguese">Português</a></td>\
								<td class="author"><a href="mailto:email@belenos.me">Belenos Govannon</a></td>	\
							</tr>\
							<tr>\
								<td class="language"><a href="#" data-value="spanish">Español</a></td>\
								<td class="author"><a href="mailto:admin@bumxu.com">Juande Martos</a></td></td>\
								<td class="language"><a href="#" data-value="russian">Русский</a></td>\
								<td class="author"><a href="mailto:a.pryah@gmail.com">Andrej Pryakhin</a></td>\
							</tr>\
							<tr>\
								<td class="language"><a href="#" data-value="basque">Euskara</a></td>\
								<td class="author"><a href="mailto:atxooy@gmail.com">Naxo Oyanguren</a></td>\
								<td class="language"><a href="#" data-value="finnish">Suomi</a></td>\
								<td class="author"><a href="mailto:rami.selin@gmail.com">Rami Selin</a></td>\
							</tr>\
							<tr>\
								<td class="language"><a href="#" data-value="french">Français</a></td>\
								<td class="author"><a href="mailto:maurin.raphael@gmail.com">Raphaël Maurin</a>,<br>Stanley Holt</td>\
								<td class="language"><a href="#" data-value="vietnamese">Tiếng Việt</a></td>\
								<td class="author"><a href="mailto:dinhquan@narga.net">Nguyễn Đình Quân</a></td>\
							</tr>\
							<tr>\
								<td class="language"><a href="#" data-value="italian">Italiano</a></td>\
								<td class="author"><a href="mailto:lmassa@bwlab.it.com">Luigi Massa</a></td>\
								<td class="language"><a href="#" data-value="arabic">‏العربية‏</a></td>\
								<td class="author"><a href="mailto:fouad.hassouneh@gmail.com">Fouad Hassouneh</td>\
							</tr>\
							<tr>\
								<td class="language"><a href="#" data-value="polish">Polski</a></td>\
								<td class="author">Marcin Tydelski,<br>Kajetan Szczepaniak</td>\
								<td class="language"><a href="#" data-value="chinese">中文(简体)</a></td>\
								<td class="author"><a href="mailto:1132321739qq@gmail.com">tuhaihe</a></td>\
							</tr>\
							<tr>\
								<td class="language"><a href="#" data-value="bulgarian">Български</a></td>\
								<td class="author"><a href="mailto:rextans@gmail.com">Belkin Fahri</a></td>\
								<td class="language"><a href="#" data-value="turkish">Türkçe</a></td>\
								<td class="author"><a href="mailto:selimssevgi@gmail.com">Selim Sırrı Sevgi</a></td>\
							</tr>\
						</tbody>\
					</table>  \
					<button id="cleardataweb">Sign Out</button>\
				</div>\
				<div class="tab-pane" id="tabTheme">\
					<label class="left translate" data-translate="pickTheme"></label><select id="theme">\
						<option value="default">Default</option>\
						<option value="linux">Linux</option>\
						<option value="coffee">Blue Coffee</option>\
						<option value="metro">Metro</option>\
						<option value="wunderlist">Wunderlist</option>\
						<option value="rtl">Right to Left</option>\
					</select><br>\
					<label class="description translate" data-translate="themeDescription"></label>\
					<div class="pythonshit">\
						<hr>\
						<label class="left translate" data-translate="replaceDefault"></label><input type="file" id="chooseBG"><br>\
						<label class="left translate" data-translate="useDefault"></label><button id="removeBG" class="translate" data-translate="removeBG"></button><br>\
						<label class="left translate" data-translate="bgSize"></label><select id="backgroundSize">\
							<option value="zoom" class="translate" data-translate="fill"></option>\
							<option value="shrink" class="translate" data-translate="shrink"></option>\
							<option value="tile" class="translate" data-translate="tile"></option>\
						</select>\
						<label class="description translate" data-translate="bgDescription"></label>\
						<hr>\
						<label class="left translate" data-translate="headingColor"></label>\
						<select id="headingColor">\
							<option value="" class="translate" data-translate="default"></option>\
							<option value="light" class="translate" data-translate="light"></option>\
							<option value="dark" class="translate" data-translate="dark"></option>\
						</select>\
						<label class="description translate" data-translate="headingDescription"></label>\
					</div>\
				</div>\
				<div class="tab-pane" id="tabSync">\
					<div class="connect">\
						<h2>Choose a service to setup Nitro Sync</h2>\
						<div class="icons">\
							<a class="button dropbox" href="#" data-service="dropbox"><img src="css/img/dropbox.png">Dropbox</a>\
							<a class="button ubuntu" href="#" data-service="ubuntu"><img src="css/img/ubuntu.png">Ubuntu</a>\
							<a class="button signup" href="http://db.tt/quaCEy3D" target="_blank">Create Account</a>\
							<a class="button signup" href="https://login.ubuntu.com/+new_account" target="_blank">Create Account</a>\
						</div>\
					</div>\
					<div class="waiting">\
						<p><span class="translate" data-translate="syncAuthenticate"> </span><a class="cancel translate" data-translate="cancel"></a></p>\
						<div class="spinner"><div class="bar1"></div><div class="bar2"></div><div class="bar3"></div><div class="bar4"></div><div class="bar5"></div><div class="bar6"></div><div class="bar7"></div><div class="bar8"></div><div class="bar9"></div><div class="bar10"></div><div class="bar11"></div><div class="bar12"></div></div>\
					</div>\
					<div class="settings">\
						<a class="left logout translate" data-translate="syncLogout" href="#"></a>\
						<label class="left translate" data-translate="syncLoggedIn"></label><span class="email right">Not logged in.</span><br>\
						<label class="left translate" data-translate="syncService"></label><span class="service">No service set.</span>					\
						<!--label class="left">Delete server: </label><button class="deleteserver">Delete</button>\
						<label class="description">WARNING: This will delete the nitro_data.json file on your storage account! This action cannot be undone!</label>\
						<label class="left">Delete client: </label><button class="deleteclient">Delete client</button>\
						<label class="description">WARNING: This will delete all your tasks! You will lose everything!</label-->\
						<hr>\
						<label class="left translate" data-translate="syncLabel"></label><select id="syncInterval">\
							<option value="never" class="translate" data-translate="syncNever"></option>\
							<option value="manual" class="translate" data-translate="syncManual"></option>\
							<option value="timer" class="translate" data-translate="syncTimer"></option>\
						</select><br>\
						<label class="description translate" data-translate="syncDescription"></label>\
					</div>\
				</div>\
				<div class="tab-pane" id="tabAbout">\
					<img width="128" height="128" src="css/img/nitro_256.png" class="center">\
					<h2>Nitro <span></span></h2>\
					<p class="center">By <a href="https://twitter.com/GeorgeCzabania">George Czabania</a> & <a href="https://twitter.com/consindo">Jono Cooper</a><br>\
					Copyright © 2012 <a href="http://caffeinatedco.de">Caffeinated Code</a><br>\
					Licensed under the BSD licence</p>\
					<hr>\
					<h3>Special Thanks</h3>\
					<ul>\
						<li><a href="https://github.com/mlms13">Michael Martin-Smucker</a> - Help with translations and creator of Metro theme</li>\
						<li>Icon designed by Николай Гармаш (Nicholay Garmash)</li>\
						<li>A huge thanks to all the translators!</li>\
					</ul>\
					<h3>Donors</h3>\
					<p>A huge thanks to everyone that donated! To make a donation, visit our <a href="http://nitrotasks.com/#donate">website</a>.</p>\
					<ul>\
						<li>Omar Rodriguez</li>\
						<li>Gabriel Favaro</li>\
						<li>Andrew (Extreme Gaming & Computers)</li>\
						<li>James Thomas</li>\
						<li>Fanny Monteiro</li>\
					</ul>\
					<ul>\
						<li>Sergio Rubio</li>\
						<li>James Mendenhall</li>\
						<li>Nekhelesh Ramananthan</li>\
						<li>Nasser Alshammari</li>\
						<li>Valentin Vago</li>\
						<li>Martin Degeling</li>\
						<li>Pierre Quillery</li>\
						<li>Luo Qi</li>\
						<li>Lochlan Bunn</li>\
					</ul>\
					<hr>\
					<h3>Keyboard Shortcuts</h3>\
					<table>\
						<tr class="break"><td colspan="2">Standard</td></tr>\
						<tr>\
							<td>N</td>\
							<td>Add task</td>\
						</tr>\
						<tr>\
							<td>L</td>\
							<td>Add list</td>\
						</tr>\
						<tr>\
							<td>F</td>\
							<td>Search</td>\
						</tr>\
						<tr>\
							<td>P</td>\
							<td>Settings</td>\
						</tr>\
						<tr class="break"><td colspan="2">Selecting and Moving Tasks</td></tr>\
						<tr>\
							<td>Up, J</td>\
							<td>Selects the task above</td>\
						</tr>\
						<tr>\
							<td>Down, K</td>\
							<td>Selects the task below</td>\
						</tr>\
						<tr>\
							<td>Cmd/Ctrl Up, Cmd/Ctrl J</td>\
							<td>Move task up one</td>\
						</tr>\
						<tr>\
							<td>Cmd/Ctrl Down, Cmd/Ctrl k</td>\
							<td>Move task down one</td>\
						</tr>\
						<tr class="break"><td colspan="2">Selecting and Moving Lists</td></tr>\
						<tr>\
							<td>Shift Up</td>\
							<td>Select the list above</td>\
						</tr>\
						<tr>\
							<td>Shift Down</td>\
							<td>Select the list below</td>\
						</tr>\
						<tr>\
							<td>Cmd/Ctrl Shift Up</td>\
							<td>Move the list up one</td>\
						</tr>\
						<tr>\
							<td>Cmd/Ctrl Shift Down</td>\
							<td>Move the list down one</td>\
						</tr>\
						<tr class="break"><td colspan="2">Editing Tasks and Lists</td></tr>\
						<tr>\
							<td>Spacebar</td>\
							<td>Check off task</td>\
						</tr>\
						<tr>\
							<td>Enter</td>\
							<td>Edit task</td>\
						</tr>\
						<tr>\
							<td>Shift Enter</td>\
							<td>Edit list</td>\
						</tr>\
						<tr class="break"><td colspan="2">Smart lists</td></tr>\
						<tr>\
							<td>1</td>\
							<td>Today</td>\
						</tr>\
						<tr>\
							<td>2</td>\
							<td>Next</td>\
						</tr>		\
						<tr>\
							<td>3</td>\
							<td>Logbook</td>\
						</tr>	\
						<tr>\
							<td>4</td>\
							<td>All Tasks</td>\
						</tr>\
				</div>\
			</div>\
		</div>\
	');

	$('#prefsDialog .translate').map(function () {
		$(this).html($.i18n._($(this).attr('data-translate')));
	})
	$('#tabAbout h2 span').html(version)
	// Only show linux theme in Python version
	if(app != 'python') $('#theme').find('[value=linux]').remove()

	var $tabSync = $('#tabSync')

	/**********************************
		SETTINGS
	**********************************/

	// CHECK BOXES [Delete Warnings & Week Starts on]
	$('#tabGeneral form input, #weekStartsOn, #dateFormat').change(function () {
		core.storage.prefs.deleteWarnings = $('#deleteWarnings').prop('checked')
		core.storage.prefs.weekStartsOn = parseInt($('#weekStartsOn').val())
		core.storage.prefs.dateFormat = $('#dateFormat').val()
		core.storage.save()

		// Refresh tasks dates
		$('#sidebar').find('.selected .name').click()
	})

	// NEXT AMOUNT
	$('#nextAmount').change(function () {

		core.storage.prefs.nextAmount = this.value
		core.storage.save()

		//Reloads next if it is selected
		if (ui.session.selected === 'next') {
			$('#Lnext .name').click()
		}
	})

	// THEME
	$('#theme').change(function () {
		// Get value
		var theme = $(this)[0].value

		// Set CSS file
		$('link.theme').attr('href', 'css/' + theme + '.css').ready(function () {
			$(window).resize()
		})

		//Saves Theme
		core.storage.prefs.theme = theme
		core.storage.save()

		// Reload sidebar
		ui.reloadSidebar()

		//Tells Python
		if (app == 'python') {
			document.title = 'theme|' + core.storage.prefs.theme
		}
	})

	/**********************************
		CUSTOM BACKGROUNDS
	**********************************/

	// REMOVE CUSTOM BACKGROUND
	$('#removeBG').click(function () {
		localStorage.removeItem('background')
		$tasks[0].style.backgroundImage = 'none'
	})

	// DRAG AND DROP
	$body.bind({
		dragover: function () {
			// Stop the window from opening the file
			return false;
		},
		drop: function (e) {
			// Get the files from the event
			e = e || window.event;
			e.preventDefault();
			e = e.originalEvent || e;
			if (e.hasOwnProperty('files') || e.hasOwnProperty('dataTransfer')) {
				var files = (e.files || e.dataTransfer.files)
				setBG(files[0])
				return false;
			}
		}
	})

	// BUTTON UPLOAD
	$('#chooseBG').change(function (e) {
		var files = $(this)[0].files
		setBG(files[0])
	})

	// Takes a file and sets it as the background
	var setBG = function (f) {
		core.storage.prefs.bgSize = this.value
		var reader = new FileReader()
		reader.onload = function (event) {

			localStorage.removeItem('background')
			localStorage.setItem('background', event.target.result)

			$tasks[0].style.backgroundImage = 'url(' + event.target.result + ')'
		}
		reader.readAsDataURL(f)
		core.storage.save()
	}

	// BACKGROUND SIZE
	$('#backgroundSize').change(function () {
		core.storage.prefs.bgSize = this.value;
		switch (this.value) {
		case 'tile':
			$tasks.removeClass('shrink zoom').addClass('tile')
			break;
		case 'shrink':
			$tasks.removeClass('tile zoom').addClass('shrink')
			break;
		case 'zoom':
			$tasks.removeClass('tile shrink').addClass('zoom')
			break;
		}
		core.storage.save()
	})

	// HEADING COLOR
	$('#headingColor').change(function () {
		core.storage.prefs.bgColor = this.value
		core.storage.save()

		$tasks.find('h2').removeClass('light dark').addClass(core.storage.prefs.bgColor)
	})

	/**********************************
			LOADING PREFERENCES
	**********************************/
	$('#deleteWarnings').prop('checked', core.storage.prefs.deleteWarnings)
	$('#weekStartsOn').val(core.storage.prefs.weekStartsOn)
	$('#dateFormat').val(core.storage.prefs.dateFormat)
	$('#nextAmount').val(core.storage.prefs.nextAmount)
	$('#theme').val(core.storage.prefs.theme)
	$('#backgroundSize').val(core.storage.prefs.bgSize)
	$('#headingColor').val(core.storage.prefs.bgColor)

	// CUSTOM BACKGROUND
	if (localStorage.hasOwnProperty('background')) {
		$tasks[0].style.backgroundImage = 'url(' + localStorage.getItem('background') + ')'
	} else if (core.storage.prefs.hasOwnProperty('background')) {
		$tasks[0].style.backgroundImage = 'url(' + core.storage.prefs.background + ')'
	}

	$tasks.addClass(core.storage.prefs.bgSize)

	// LANGUAGE
	$('#tabLanguage a.current').removeClass('current')
	$('#tabLanguage .language a').each(function () {
		if ($(this).data('value') === core.storage.prefs.lang) {
			$(this).addClass('current')
		}
	})
	$('#tabLanguage').bind('click', function (e) {
		if ($(e.srcElement).is('.language a')) {
			core.storage.prefs.lang = $(e.srcElement).data('value')
			core.storage.save();

			window.location.reload()
			return false;
		}
	})

	// SYNC
	$('#syncInterval').val(core.storage.prefs.sync.interval)
	if(core.storage.prefs.sync.hasOwnProperty('access')) {		
		// Load settings
		$tabSync.find('.email').html(core.storage.prefs.sync.email)
		$tabSync.find('.service').html(core.storage.prefs.sync.service)
		// Show settings
		$tabSync.find('.connect').hide()
		$tabSync.find('.settings').show()
	}


	/**********************************
				SYNC
	**********************************/

	var animateTab = function(tab, from, to, cb) {
		var oldHeight = tab.height()
		tab.height('auto')
		from.hide()
		to.show()
		var newHeight = tab.height()
		to.hide()
		from.show().fadeOut(150, function() {
			tab.height(oldHeight)
			to.fadeIn(150)
			tab.animate({
				height: newHeight
			}, 300, function() {
				if(typeof cb === 'function') cb()
			})
		})
	}

	$('.ubuntu, .dropbox').click(function() {
			
		var service = $(this).data('service')
			
		// Run sync
		sync.run(service, function (result) {
			if(result) {
				$tabSync.find('.email').html(core.storage.prefs.sync.email)
				$tabSync.find('.service').html(service);
				animateTab($tabSync, $tabSync.find('.waiting'), $tabSync.find('.settings'))
			} else {
				$tabSync.find('.waiting p').html($.i18n._('syncError'))
				setTimeout(function() {
					animateTab($tabSync, $tabSync.find('.waiting'), $tabSync.find('.connect'), function() {
						$tabSync.find('.waiting p').html($.i18n._('syncAuthenticate'))
					})
				}, 5000)
			}
		})
		
		animateTab($tabSync, $tabSync.find('.connect'), $tabSync.find('.waiting'))
	})

	$tabSync.find('a.cancel').click(function() {

		core.storage.prefs.sync.active = false
		animateTab($tabSync, $tabSync.find('.waiting'), $tabSync.find('.connect'))

	})

	$tabSync.find('.logout').click(function () {
		// Delete tokens from localStorage
		delete core.storage.prefs.sync.email
		delete core.storage.prefs.sync.access
		delete core.storage.prefs.sync.service
		core.storage.save()
		// Go back to main page
		animateTab($tabSync, $tabSync.find('.settings'), $tabSync.find('.connect'))
	})

	$('#cleardata').click(function(e) {
		//Because it's a bloody button
		e.preventDefault()
		var markup = Mustache.to_html(templates.dialog.modal, {
			id: 'clearDataModal',
			title: $l._('warning'),
			message: $l._('clearDataMsg'),
			button: {yes: $l._('deleteOneYes'), no: $l._('deleteOneNo')}
		})
		$body.append(markup)
		var $modal = $('#clearDataModal'),
			$this = $(this).parent()

		$modal.modal()
		$modal.find('button').bind('click', function(e) {

			if($(e.target).hasClass('no')) {
				$modal.modal('hide').remove()
				return
			}
			//We're Deleting Everything
			localStorage.clear()
			window.location.reload()
		})

	})

	$('#cleardataweb').click(function() {
		//We're Deleting Everything
		localStorage.clear()
		window.location.reload()
	})

	// SYNC TYPE
	$('#syncInterval').change(function () {
		var interval = this.value
		switch(interval) {
			case 'timer':
				sync.timer()
				break
		}
		core.storage.prefs.sync.interval = interval
		core.storage.save()
	})

})

/* ./plugins/sort.js */

/* Sorting Plugin for Nitro
 * Requried by main.js - so don't remove it
 * By Jono Cooper & George Czabania
 * Licensed under the BSD License
 */

/*jshint asi: true, multistr: true*/

// Globals
var $sortType

//Adds as a plugin
plugin.add(function() {
	
	console.log("Loaded sort.js")

	$panel.left.append('\
		<span>\
		<button data-toggle="dropdown" class="sort">'+$.i18n._("sortbtn")+'</button>\
		<ul class="dropdown-menu">\
			<li class="current" data-value="magic"><span class="icon magic"></span>'+$.i18n._("sortMagic")+'</li>\
			<li data-value="manual"><span class="icon hand"></span>'+$.i18n._("sortDefault")+'</li>\
            <li data-value="title"><span class="icon title"></span>' + $.i18n._("sortTitle") + '</li>\
			<li data-value="date"><span class="icon date"></span>' + $.i18n._("sortDate") + '</li>\
			<li data-value="priority"><span class="icon priority"></span>'+$.i18n._("sortPriority")+'</li>\
		</ul>\
		</span>')

	$sortType = $('.panel .left span ul li')
	$sortType.on('click', function() {
		$sortType.removeClass('current')
		$(this).addClass('current')
		var val = $(this).attr('data-value')
		core.storage.prefs.listSort[ui.session.selected] = val
		$('#L' + ui.session.selected + ' .name').click()
		core.storage.save()
	})
	var priorityWorth = { none: 0, low: 1, medium: 2, high: 3 };

	var getDateWorth = function(timestamp) {

		if(timestamp === "") {
			return 0;
		}

		var due = new Date(timestamp),
			today = new Date();

		// Copy date parts of the timestamps, discarding the time parts.
		var one = new Date(due.getFullYear(), due.getMonth(), due.getDate());
		var two = new Date(today.getFullYear(), today.getMonth(), today.getDate());
		
		// Do the math.
		var millisecondsPerDay = 1000 * 60 * 60 * 24;
		var millisBetween = one.getTime() - two.getTime();
		var days = millisBetween / millisecondsPerDay;
		
		// Round down.
		var diff = Math.floor(days)

		if(diff > 14) {
			diff = 14
		}

		return 14 - diff + 1;

	}
	
	plugin.sort = function(array, method) {

		// Clone list
		list = array.slice(0)

		// Convert task IDs to obects
		for(var i = 0; i < list.length; i++) {
			var id = list[i];
			list[i] = core.storage.tasks[list[i]];
			list[i].arrayID = id;
		}
		
		// Sorting methods
		switch(method) {
			
			case "magic":
				list.sort(function(a, b) {

					var rating = {
						a: getDateWorth(a.date),
						b: getDateWorth(b.date)
					}

					var worth = { none: 0, low: 2, medium: 4, high: 6 }

					rating.a += worth[a.priority]
					rating.b += worth[b.priority]

					if(a.logged && !b.logged) return 1
					else if(!a.logged && b.logged) return -1
					else if(a.logged && b.logged) return 0

					return rating.b - rating.a
	
				})
				break
				
			case "manual":
				break;
				
			case "priority":
				
				list.sort(function(a,b) {
					if(a.logged && !b.logged) return 1
					else if(!a.logged && b.logged) return -1
					else if(a.logged && b.logged) return 0
					return priorityWorth[b.priority] - priorityWorth[a.priority]
				});
				break;
				
			case "date":
				list.sort(function(a,b) {
					if(a.logged && !b.logged) return 1
					else if(!a.logged && b.logged) return -1
					else if(a.logged && b.logged) return 0
					// Handle tasks without dates
					if(a.date === "" && b.date !== "") return 1;
					else if(b.date === "" && a.date !== "") return -1;
					else if (a.date === "" && b.date === "") return 0;
					// Sort by priority if dates match
					if (a.date == b.date) return priorityWorth[b.priority] - priorityWorth[a.priority];
					// Sort timestamps
					return a.date -  b.date
				});
				break;

			case "title":
				list.sort(function(a,b) {
					if (a.content < b.content) return -1
					if (a.content > b.content) return 1
				})
				break;
			
		}
		
		// Unconvert task IDs to obects
		for (var i = 0; i < list.length; i++) {
			var id = list[i].arrayID
			delete list[i].arrayID
			list[i] = id
		}
		
		return list;
		
	};
	
});
/* ./plugins/sync.js */

/* Nitro Sync Plugin
 * By Jono Cooper & George Czabania
 * Licensed under the BSD License
 * Uses jQuery for AJAX calls
 */

//Adds as a plugin
plugin.add(function() {

	$panel.right.prepend('<button class="runSync"></button>')
	$runSync = $('.runSync')

	$panel.right.on('click', '.runSync', function() {
		$this = $(this)

		if($this.hasClass('running')) {
			// Do nothing...
		} else if(core.storage.prefs.sync.hasOwnProperty('access') && core.storage.prefs.sync.interval !== 'never') {
			$this.addClass('running')
			sync.run(core.storage.prefs.sync.service, function(success, time) {
				if(success) {
					console.log("Everything worked - took " + time/1000 + "s")
				} else {
					// Display notification that sync failed
					sync.notify("Could not sync with server...")
				}
				$this.removeClass('running')
			})
		} else {
			$settingsbtn.trigger('click')
			$('a[data-target=#tabSync]').tab('show');
		}
	})

	sync = {

		// Prevent navigation during sync
		preventNav: function(status) {
			var message = "Nitro is currently syncing";

			if (status == 'on' || status === true) {
				window.onbeforeunload = function() {
					return message;
				}
			} else if (status == 'off' || status === false) {
				window.onbeforeunload = false;
			}
		},

		// Timer
		timer: function() {
			$runSync.addClass('running')
			sync.run(core.storage.prefs.sync.service, function(success) {
				if(success && core.storage.prefs.sync.interval == 'timer') {
					console.log("Everything worked - running again in 2 minutes")
					setTimeout(function() {
						if(core.storage.prefs.sync.interval == 'timer') sync.timer()
					}, 30000)
				} else {
					sync.notify("Could not sync with server...")
				}
				$runSync.removeClass('running')
			})
		},

		// Magical function that handles connect and emit
		run: function (service, cb) {

			var time = core.timestamp()
			console.log("Starting sync...")

			callback = function() {
				sync.preventNav('off')
				core.storage.prefs.sync.active = false
				if (typeof cb == 'function') cb.apply(this, arguments);
			}

			if (service) {
				core.storage.prefs.sync.service = service;
			} else if (!core.storage.prefs.sync.hasOwnProperty('service')) {
				console.log("Error: Don't know what service to use.");
				return;
			}

			core.storage.prefs.sync.active = true
			sync.preventNav('on')

			if (core.storage.prefs.sync.hasOwnProperty('access')) {

				sync.emit(function(success) {
					time = core.timestamp() - time
					if (typeof callback === "function") callback(success, time);
				});

			} else {

				sync.connect(function (result) {
					if(result) {
						sync.emit(function(success) {
							time = core.timestamp() - time
							if (typeof callback === "function") callback(success, time)
						})
					} else {
						if (typeof callback === "function") callback(result, 0)
					}
				})
			}

		},
		ajaxdata: {
			'data': {}
		},
		connect: function (callback) {

			console.log("Connecting to Nitro Sync server")

			var requestURL = function(service, cb) {

				console.log("Requesting URL")

				var ajaxdata = sync.ajaxdata
				ajaxdata.watch('data', function (id, oldval, newval) {
					ajaxdata.unwatch()
					cb(newval)
				})
				
				console.log("Sync Service: " + service)

				$.ajax({
					type: "POST",
					url: core.storage.prefs.sync.url + '/request_url',
					dataType: 'json',
					data: {
						service: service,
						app: app
					},
					success: function (data) {
						ajaxdata.data = data
					},
					error: function(data) {
						ajaxdata = 'error'
					}
				})
			}

			var showPopup = function(url) {
				if (app == 'python') {
					document.title = 'isolate_window|' + url
				} else if (app == 'web') {
					core.storage.prefs.sync.resume = true;
					core.storage.save();
					window.onbeforeunload = false;
					document.location.href = url;
				} else {
					var width = 960,
						height = 600
						left = (screen.width / 2) - (width / 2),
						top = (screen.height / 2) - (height / 2)
					window.open(url, Math.random(), 'toolbar=no, type=popup, status=no, width='+width+', height='+height+', top='+top+', left='+left)
				}
			}

			var authorizeToken = function (token, service, cb) {

				console.log("Getting access token");

				var ajaxdata = sync.ajaxdata
				ajaxdata.watch('data', function (id, oldval, newval) {
					ajaxdata.unwatch()
					console.log(newval)

					if(newval == 'not_verified') {
						console.log("Try again")
						if(core.storage.prefs.sync.active) {
							setTimeout(function() {
								authorizeToken(token, service, cb)	
							}, 1500)
						}

					} else if(newval == 'error' || newval == 'failed') {
						console.log("Connection failed. Server probably timed out.")
						cb(false)

					} else {
						console.log("Got access token")
						core.storage.prefs.sync.access = newval.access
						core.storage.prefs.sync.email = newval.email
						delete core.storage.prefs.sync.token
						core.storage.save()
						cb(true)
					}
				})

				$.ajax({
					type: "POST",
					url: core.storage.prefs.sync.url + '/auth',
					dataType: 'json',
					data: {
						token: token,
						service: service
					},
					success: function (data) {
						ajaxdata.data = data
					},
					error: function(data) {
						ajaxdata.data = 'error'
					}
				})
			}

			// Connect

			var service = core.storage.prefs.sync.service;
			if (app == 'web' && core.storage.prefs.sync.resume === true) {
				core.storage.prefs.sync.resume = false;
				core.storage.save();
				authorizeToken(core.storage.prefs.sync.token, service, callback);
			} else {
				requestURL(service, function(result) {
					if(result == 'error') {
						callback(false)
					} else {
						console.log("Request URL: " + result.authorize_url)
						core.storage.prefs.sync.token = result
						showPopup(result.authorize_url)
						authorizeToken(result, service, function(result) {
							callback(result)
						})
					}
				})
			}
		},

		emit: function (callback) {
			var client = {
					tasks: core.storage.tasks,
					lists: core.storage.lists,
					stats: {
						uid: core.storage.prefs.sync.email,
						os: app,
						language: core.storage.prefs.lang,
						version: version
					}
				},
				ajaxdata = sync.ajaxdata

			//Watches Ajax request
			ajaxdata.watch('data', function (id, oldval, newval) {
				newval = decompress(newval);
				console.log("Finished sync");
				core.storage.tasks = newval.tasks;
				core.storage.lists = newval.lists;
				core.storage.store();
				if(typeof callback === 'function') callback(true)
				ui.reload();
			});

			$.ajax({
				type: "POST",
				url: core.storage.prefs.sync.url + '/sync/',
				dataType: 'json',
				data: {
					data: JSON.stringify(compress(client)),
					access: core.storage.prefs.sync.access,
					service: core.storage.prefs.sync.service
				},
				success: function (data) {
					if (data != 'failed') {
						ajaxdata.data = data;
						return true;
					} else {
						if(typeof callback === 'function') callback(false)
						return false;
					}
				},
				error: function () {
					console.log("Hello")
					if(typeof callback === 'function') callback(false)
					return false;
				}
			});
		},
		notify:function (msg) {
			$runSync.before('<div class="message">'+msg+'</div>')
			var $msg = $panel.right.find('.message')
			$msg.hide().fadeIn(300)
			setTimeout(function() {
				$msg.fadeOut(500, function() {
					$(this).remove()
				})
			}, 4000)
		},
		auto: {
			timer: false,
			run: function() {

				if (core.storage.prefs.sync.active) {
					setTimeout(sync.auto.run, 500);
					return;
				}

				//Clear the timer
				if (sync.auto.timer) {
					clearTimeout(sync.auto.timer);
				}
				//Runs every 10 secs
				sync.auto.timer = setTimeout(function() {
					if (core.storage.prefs.sync.active == false) {
						$('#web-sync-status').addClass('active');
						sync.run(core.storage.prefs.sync.service, function(success, time) {
							$('#web-sync-status').removeClass('active');
						});
					}
				}, 10000);
			}
		}
	}

	function compress(obj) {
		var chart = {
			name: 'a',
			tasks: 'b',
			content: 'c',
			priority: 'd',
			date: 'e',
			today: 'f',  		// Deprecated
			showInToday: 'g', 	// Deprecated
			list: 'h',
			lists: 'i',
			logged: 'j',
			time: 'k',
			sync: 'l',
			synced: 'm',
			order: 'n',
			queue: 'o',
			length: 'p',
			notes: 'q',
			items: 'r',
			next: 's',
			someday: 't',
			deleted: 'u',
			logbook: 'v',
			scheduled: 'w',
			version: 'x',
			tags: 'y'
		},
			out = {};

		for (var key in obj) {
			if (chart.hasOwnProperty(key)) {
				out[chart[key]] = obj[key];
				if (typeof obj[key] === 'object' && isArray(obj[key]) == false) {
					out[chart[key]] = compress(out[chart[key]]);
				}
			} else {
				out[key] = obj[key];
				if (typeof obj[key] === 'object' && isArray(obj[key]) == false) {
					out[key] = compress(out[key]);
				}
			}
		}
		return out;
	}

	function decompress(obj) {
		var chart = {
			a: 'name',
			b: 'tasks',
			c: 'content',
			d: 'priority',
			e: 'date',
			f: 'today',
			g: 'showInToday',
			h: 'list',
			i: 'lists',
			j: 'logged',
			k: 'time',
			l: 'sync',
			m: 'synced',
			n: 'order',
			o: 'queue',
			p: 'length',
			q: 'notes',
			r: 'items',
			s: 'next',
			t: 'someday',
			u: 'deleted',
			v: 'logbook',
			w: 'scheduled',
			x: 'version',
			y: 'tags'
		},
			out = {};

		for (var key in obj) {
			if (chart.hasOwnProperty(key)) {
				out[chart[key]] = obj[key];
				if (typeof obj[key] === 'object' && isArray(obj[key]) == false) {
					out[chart[key]] = decompress(out[chart[key]]);
				}
			} else {
				out[key] = obj[key];
				if (typeof obj[key] === 'object' && isArray(obj[key]) == false) {
					out[key] = decompress(out[key]);
				}
			}
		}
		return out;
	}

	// Because typeof is useless here
	function isArray(obj) {
		return obj.constructor == Array;
	}

	// object.watch
	if (!Object.prototype.watch) {
		Object.defineProperty(Object.prototype, "watch", {
			enumerable: false,
			configurable: true,
			writable: false,
			value: function (prop, handler) {
				var
				oldval = this[prop],
					newval = oldval,
					getter = function () {
						return newval;
					},
					setter = function (val) {
						oldval = newval;
						return newval = handler.call(this, prop, oldval, val);
					};

				if (delete this[prop]) { // can't watch constants
					Object.defineProperty(this, prop, {
						get: getter,
						set: setter,
						enumerable: true,
						configurable: true
					});
				}
			}
		});
	}

	// object.unwatch
	if (!Object.prototype.unwatch) {
		Object.defineProperty(Object.prototype, "unwatch", {
			enumerable: false,
			configurable: true,
			writable: false,
			value: function (prop) {
				var val = this[prop];
				delete this[prop]; // remove accessors
				this[prop] = val;
			}
		});
	}
});
/* ./plugins/tags.js */

// Tags plugin 2
plugin.add(function() {
	// Clicking a tag
	$tasks.on('click', '.tag', function() {
		// Go to All Tasks list
		$('#Lall .name').trigger('click')
		// Run search - We should give the searchbox an ID
		$search.val($(this).text()).trigger('keyup')
		
	})
})
/* ./plugins/upgrade.js */

// Upgrade localStorage from 1.3.1 to 1.4

// plugin.add(function() {

	upgrade = function(storage) {

		if(storage === 'empty') return
		console.log("Running database upgrade")
		
		// Back up original data
		$.polyStorage.set('old_data', storage)

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
		prefs.sync.active   = prefs.sync.active    		|| false
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

		lists.items[lists.items.length] = {
			name: 'Scheduled',
			order: [],
			time: {
				order: 0
			}
		}

		var scheduledID = lists.items.length
		lists.order.push(scheduledID)
		lists.items.length++

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
				_this.list = scheduledID
				_this.tags = []
				if(_this.priority === 'important') _this.priority = 'high'
				delete _this.next
				delete _this.ends
				delete _this.type
				delete _this.recurType
				delete _this.recurInterval

				lists.items[scheduledID].order.push(id)
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

		// Reset
		prefs.theme = "default"
		prefs.lang = "english"

		// Transfer
		prefs.bgColor = prefs.bg.color
		if(prefs.nextAmount == "threeItems") prefs.nextAmount = "everything"
		delete prefs.bg
		delete prefs.gpu
		delete prefs.over50
		prefs.sync.interval = 'manual'

		// Set version
		prefs.version = version
		
		
		
	
		// --------------------------
		// 			MERGE
		// --------------------------
		
		for(var i = 0; i < core.storage.lists.items.length; i++) {
			
			var _this = core.storage.lists.items[i]
			
			// Don't merge deleted tasks
			if(!_this.hasOwnProperty('deleted')) {
				
				var newID = lists.items.length
				lists.items[newID] = $.extend(true, {}, _this)
				lists.items.length++
				
				// Fix up task.list
				for(var j = 0; j < _this.order.length; j++) {
					core.storage.tasks[_this.order[j]].list = newID
				}
				
				// Fix up list order
				lists.order.push(newID)
				
			}
		}

		for(var i = 0; i < core.storage.tasks.length; i++) {
			
			var _this = core.storage.tasks[i]
			
			// Don't merge deleted tasks
			if(!_this.hasOwnProperty('deleted')) {
				
				var newID = tasks.length
				tasks[newID] = $.extend(true, {}, _this)
				tasks.length++
				
				// Smartlists
				if(_this.list == 'today' || _this.list == 'next' || _this.list == 'logbook') {
					lists.items[_this.list].order.push(newID)
					
				// Custom lists
				} else {
					var index = lists.items[_this.list].order.indexOf(i)
					if(index > -1) lists.items[_this.list].order.splice(index, 1, newID)	
				}	
			}
		}
		
		
		
		
		
		// --------------------------
		// 			SAVE
		// --------------------------

		localStorage.removeItem('jStorage')
		core.storage.tasks = tasks
		core.storage.lists = lists
		core.storage.prefs = prefs
		core.storage.save()

	}
// })
/* ./plugins/url.js */

plugin.add(function() {
	
	plugin.url = function(text) {
		return {
			toHTML: function() {
				var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
				return text.replace(exp,'<a target=_blank href=$1>$1</a>');
			},
			toText: function() {
				var exp = /<a\b[^>]*>(.*?)<\/a>/ig;
				return text.replace(exp, '$1');
			}
		}
	}
})
