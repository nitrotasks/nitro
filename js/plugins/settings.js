$(function() {
	//Adds button to panel
	//$panel.right.prepend('<button class="settingsbtn"></button>')
	$settingsbtn = $('.settingsbtn')
	$settingsbtn.on('click', function () {
		$tasks.find('.expanded').dblclick();
		$('#prefsDialog').modal();
	})
	$('body').append('\
		<div id="prefsDialog">\
			<ul class="nav nav-tabs"><li class="active"><a href="#" data-target="#tabGeneral" data-toggle="tab" class="translate" data-translate="general">g</a></li><li><a href="#" data-target="#tabLanguage" data-toggle="tab" class="translate" data-translate="language">g</a></li><li><a href="#" data-target="#tabSync" data-toggle="tab" class="translate" data-translate="sync">g</a></li><li><a href="#" data-target="#tabAbout" data-toggle="tab" class="translate" data-translate="about">g</a></li></ul>\
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
