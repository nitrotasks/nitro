$(function() {
	//Adds button to panel
	$panel.right.prepend('<button class="settingsbtn"></button>')
	$settingsbtn = $('.settingsbtn')
	$settingsbtn.on('click', function() {
		$('#prefsDialog').modal();
	})
	$('body').append('\
		<div id="prefsDialog">\
			<ul class="nav nav-tabs"><li class="active"><a href="#" data-target="#tabGeneral" data-toggle="tab" class="translate" data-translate="general">g</a></li><li><a href="#" data-target="#tabLanguage" data-toggle="tab" class="translate" data-translate="language">g</a></li><li><a href="#" data-target="#tabTheme" data-toggle="tab" class="translate" data-translate="theme">g</a></li><li><a href="#" data-target="#tabSync" data-toggle="tab" class="translate" data-translate="sync">g</a></li><li><a href="#" data-target="#tabAbout" data-toggle="tab" class="translate" data-translate="about">g</a></li></ul>\
			<div class="tab-content">  \
				<div class="tab-pane active" id="tabGeneral">\
				<form>\
					<input type="checkbox" id="deleteWarnings"><label for="deleteWarnings" class="translate" data-translate="hideWarnings"></label><br>\
					<label class="description translate" data-translate="deleteWarningsDescription"></label>\
					<hr>\
					<label class="left translate" data-translate="nextDescription"> </label><select id="nextAmount">\
						<option value="noLists" class="translate" data-translate="nextNoLists"></option>\
						<option value="everything" class="translate" data-translate="nextEverything"></option>\
					</select>\
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
								<td class="language"><a href="#" data-value="bad">Bad English</a></td>\
								<td class="author"><a href="mailto:jono@joncoooper.com">Jono Cooper</a>\
							</tr>\
								<!--td class="language"><a href="#" data-value="hungarian">Magyar</a></td>\
								<td class="author"><a href="mailto:sjozsef0227@gmail.com">József Samu</a>\
							</td>\
							<tr>\
								<td class="language"><a href="#" data-value="pirate">English (Pirate)</a></td>\
								<td class="author">Caffeinated Code</td>\
								<td class="language"><a href="#" data-value="portuguese">Português</a></td>\
								<td class="author"><a href="mailto:email@belenos.me">Belenos Govannon</a></td>	\
							</tr>\
							<tr>\
								<td class="language"><a href="#" data-value="german">Deutsch</a></td>\
								<td class="author"><a href="mailto:d.peteranderl@googlemail.com">Dennis Peteranderl</a>, <a href="info@agentur-simon.de">Bertram Simon</a></td>\
								<td class="language"><a href="#" data-value="russian">Русский</a></td>\
								<td class="author"><a href="mailto:a.pryah@gmail.com">Andrej Pryakhin</a></td>\
							</tr>\
							<tr>\
								<td class="language"><a href="#" data-value="spanish">Español</a></td>\
								<td class="author"><a href="mailto:admin@bumxu.com">Juande Martos</a></td></td>\
								<td class="language"><a href="#" data-value="finnish">Suomi</a></td>\
								<td class="author"><a href="mailto:rami.selin@gmail.com">Rami Selin</a></td>\
							</tr>\
							<tr>\
								<td class="language"><a href="#" data-value="basque">Euskara</a></td>\
								<td class="author"><a href="mailto:atxooy@gmail.com">Naxo Oyanguren</a></td>\
								<td class="language"><a href="#" data-value="vietnamese">Tiếng Việt</a></td>\
								<td class="author"><a href="mailto:dinhquan@narga.net">Nguyễn Đình Quân</a></td>\
							</tr>\
							<tr>\
								<td class="language"><a href="#" data-value="french">Français</a></td>\
								<td class="author"><a href="mailto:maurin.raphael@gmail.com">Raphaël Maurin</a></td>\
								<td class="language"><a href="#" data-value="arabic">‏العربية‏</a></td>\
								<td class="author"><a href="mailto:fouad.hassouneh@gmail.com">Fouad Hassouneh</td>\
							</tr>\
							<tr>\
								<td class="language"><a href="#" data-value="italian">Italiano</a></td>\
								<td class="author"><a href="mailto:lmassa@bwlab.it.com">Luigi Massa</a></td>\
								<td class="language"><a href="#" data-value="chinese">中文(简体)</a></td>\
								<td class="author"><a href="mailto:1132321739qq@gmail.com">tuhaihe</a>, 2012</td>\
							</tr>\
							<tr>\
								<td class="language"><a href="#" data-value="polish">Polski</a></td>\
								<td class="author">Marcin Tydelski,<br>Kajetan Szczepaniak</td>\
								<td class="language"><a href="#" data-value="turkish">Türkçe</a></td>\
								<td class="author"><a href="mailto:selimssevgi@gmail.com">Selim Sırrı Sevgi</a></td>\
							</tr-->\
						</tbody>\
					</table>  \
				</div>\
				<div class="tab-pane" id="tabTheme">  \
					<label class="left translate" data-translate="pickTheme"></label><select id="theme">\
						<option value="default">Default</option>\
						<option value="linux">Linux</option>\
						<option value="coffee">Blue Coffee</option>\
						<option value="wunderlist">Wunderlist</option>\
						<option value="bieber">Justin Bieber</option>\
						<option value="none">None</option>\
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
							<a class="icon" href="#" data-service="dropbox"><img src="css/img/dropbox.png"></a>\
							<a class="icon" href="#" data-service="ubuntu"><img src="css/img/ubuntu.png"></a>\
						</div>\
					</div>\
					<div class="waiting">\
						<p><span class="translate" data-translate="syncAuthenticate"> </span><a class="cancel">Cancel</a></p>\
						<img class="spinner" src="css/img/spinner.gif">\
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
							<option value="auto" class="translate" data-translate="syncAuto"></option>\
						</select><br>\
						<label class="description translate" data-translate="syncDescription"></label>\
					</div>\
				</div>\
				<div class="tab-pane" id="tabAbout">\
					<img src="css/img/nitro_128.png" class="center">\
					<h2>Nitro <span></span></h2>\
					<p class="center">By George Czabania & Jono Cooper<br>\
					Copyright © 2012 Caffeinated Code<br>\
					Licensed under the BSD licence</p>\
					<hr>\
					<h3>Donors</h3>\
					<p>A huge thanks to everyone that donated! To make a donation, visit our <a href="http://nitrotasks.com/#donate">website</a>.</p>\
					<ul>\
						<li>Gabriel Favaro</li>\
						<li>James Thomas</li>\
					</ul>\
					<ul>\
						<li>Sergio Rubi</li>\
						<li>James Mendenhall</li>\
						<li>Nekhelesh Ramananthan</li>\
						<li>Valentin Vago</li>\
						<li>Sebastian Alvarez</li>\
						<li>Pierre Quillery</li>\
					</ul>\
					<ul>\
						<li>Icon designed by Николай Гармаш (Nicholay Garmash)</li>\
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
							<td>Scheduled</td>\
						</tr>	\
						<tr>\
							<td>4</td>\
							<td>Logbook</td>\
						</tr>	\
						<tr>\
							<td>5</td>\
							<td>All Tasks</td>\
						</tr>\
				</div>\
			</div>\
		</div>\
	');
	//Because it needs time to load
	setTimeout(function() {
		$('#prefsDialog .translate').map(function () {
			$(this).html($.i18n._($(this).attr('data-translate')));
		})
		$('#tabAbout h2 span').html(version)
	}, 300)

	var $tabSync = $('#tabSync')

	/**********************************
		SETTINGS
	**********************************/

	// CHECK BOXES [DELETE WARNINGS & LOW GRAPHICS MODE]
	$('#tabGeneral form input').change(function () {

		core.storage.prefs.deleteWarnings = $('#deleteWarnings').prop('checked')
		core.storage.save()

	})

	// NEXT AMOUNT
	$('#nextAmount').change(function () {

		core.storage.prefs.nextAmount = this.value;
		core.storage.save();

		//Reloads next if it is selected
		if (ui.session.selected === 'next') {
			$('#Lnext .name').click();
		}
	});

	// THEME
	$('#theme').change(function () {
		// Get value
		var theme = $(this)[0].value;

		// Set CSS file
		$('link.theme').attr('href', 'css/' + theme + '.css').ready(function () {
			$(window).resize();
		});

		//Saves Theme
		core.storage.prefs.theme = theme;
		core.storage.save();

		// Reload sidebar
		ui.reloadSidebar()

		//Tells Python
		if (app == 'python') {
			document.title = 'theme|' + core.storage.prefs.theme
		}
	});

	/**********************************
		CUSTOM BACKGROUNDS
	**********************************/

	// REMOVE CUSTOM BACKGROUND
	$('#removeBG').click(function () {
		localStorage.removeItem('background');
		$tasks[0].style.backgroundImage = 'none';
	});

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
				var files = (e.files || e.dataTransfer.files);
				setBG(files[0]);
				return false;
			}
		}
	});

	// BUTTON UPLOAD
	$('#chooseBG').change(function (e) {
		var files = $(this)[0].files;
		setBG(files[0]);
	});

	// Takes a file and sets it as the background
	var setBG = function (f) {
		core.storage.prefs.bgSize = this.value;
		var reader = new FileReader();
		reader.onload = function (event) {

			localStorage.removeItem('background');
			localStorage.setItem('background', event.target.result);

			$tasks[0].style.backgroundImage = 'url(' + event.target.result + ')';
		};
		reader.readAsDataURL(f);
		core.storage.save()
	};

	// BACKGROUND SIZE
	$('#backgroundSize').change(function () {
		core.storage.prefs.bgSize = this.value;
		switch (this.value) {
		case 'tile':
			$tasks.removeClass('shrink zoom').addClass('tile');
			break;
		case 'shrink':
			$tasks.removeClass('tile zoom').addClass('shrink');
			break;
		case 'zoom':
			$tasks.removeClass('tile shrink').addClass('zoom');
			break;
		}
		core.storage.save();
	});

	// HEADING COLOR
	$('#headingColor').change(function () {
		core.storage.prefs.bgColor = this.value;
		core.storage.save();

		$tasks.find('h2').removeClass('light dark').addClass(core.storage.prefs.bgColor);
	});

	/**********************************
			LOADING PREFERENCES
	**********************************/
	$('#deleteWarnings').prop('checked', core.storage.prefs.deleteWarnings);
	$('#nextAmount').val(core.storage.prefs.nextAmount);
	$('#theme').val(core.storage.prefs.theme);
	$('#backgroundSize').val(core.storage.prefs.bgSize);
	$('#headingColor').val(core.storage.prefs.bgColor);

	// CUSTOM BACKGROUND
	if (localStorage.hasOwnProperty('background')) {
		$tasks[0].style.backgroundImage = 'url(' + localStorage.getItem('background') + ')';
	} else if (core.storage.prefs.hasOwnProperty('background')) {
		$tasks[0].style.backgroundImage = 'url(' + core.storage.prefs.background + ')';
	}

	$tasks.addClass(core.storage.prefs.bgSize);

	// LANGUAGE
	$('#tabLanguage a.current').removeClass('current');
	$('#tabLanguage .language a').each(function () {
		if ($(this).data('value') === core.storage.prefs.lang) {
			$(this).addClass('current');
		}
	});
	$('#tabLanguage').bind('click', function (e) {
		if ($(e.srcElement).is('.language a')) {
			core.storage.prefs.lang = $(e.srcElement).data('value');
			core.storage.save();

			window.location.reload();
			return false;
		}
	});

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

	var animateTab = function(tab, from, to) {
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
			}, 300)
		})
	}

	$tabSync.find('a.icon').click(function() {
			
		var service = $(this).data('service');
			
		// Run sync
		sync.run(service, function (result) {
			if(result) {
				$tabSync.find('.email').html(core.storage.prefs.sync.email);
				$tabSync.find('.service').html(service);
				animateTab($tabSync, $tabSync.find('.waiting'), $tabSync.find('.settings'))
			} else {
				$tabSync.find('.waiting p').html("Could not sync with server...")
				setTimeout(function() {
					animateTab($tabSync, $tabSync.find('.waiting'), $tabSync.find('.connect'))
				}, 5000)
			}
		})
		
		animateTab($tabSync, $tabSync.find('.connect'), $tabSync.find('.waiting'))
	})

	$tabSync.find('a.cancel').click(function() {

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

	// SYNC TYPE
	$('#syncInterval').change(function () {
		var interval = this.value
		core.storage.prefs.sync.interval = interval
		core.storage.save()
	})

});
