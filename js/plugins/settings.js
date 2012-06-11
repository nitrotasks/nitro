$(document).ready(function() {
	//Adds button to panel
	$panel.right.prepend('<button id="settingsbtn">Settings</button>')
	var $settingsbtn = $('#settingsbtn')
	$settingsbtn.on('click', function() {
		$('#prefsDialog').fadeToggle(150)
	})
	$('body').append('\
		<div id="prefsDialog">\
			<ul class="nav nav-tabs"><li class="active"><a href="#" data-target="#tabGeneral" data-toggle="tab" class="translate" data-translate="general">g</a></li><li><a href="#" data-target="#tabLanguage" data-toggle="tab" class="translate" data-translate="language">g</a></li><li><a href="#" data-target="#tabTheme" data-toggle="tab" class="translate" data-translate="theme">g</a></li><li><a href="#" data-target="#tabSync" data-toggle="tab" class="translate" data-translate="sync">g</a></li></ul>\
			<div class="tab-content">  \
				<div class="tab-pane active" id="tabGeneral">\
				<form>\
					<input type="checkbox" id="deleteWarnings"><label for="deleteWarnings" class="translate" data-translate="hideWarnings"></label><br>\
					<label class="description translate" data-translate="deleteWarningsDescription"></label>\
					<hr>\
					<label class="left translate" data-translate="nextDescription"> </label><select id="nextAmount">\
						<option value="noLists" class="translate" data-translate="nextNoLists"></option>\
						<option value="threeItems" class="translate" data-translate="nextThreeLists"></option>\
						<option value="everything" class="translate" data-translate="nextEntireLists"></option>\
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
							<option value="light" class="translate" data-translate="light"></option>\
							<option value="dark" class="translate" data-translate="dark"></option>\
							<option value="" class="translate" data-translate="default"></option>\
						</select>\
						<label class="description translate" data-translate="headingDescription"></label>\
					</div>\
				</div>\
				<div class="tab-pane" id="tabSync">\
					<div class="connect">\
						<blockquote><h1>Nitro Sync Beta</h1><span class="translate" data-translate="donateText"></span></blockquote>\
						<hr>\
						<div class="icons">\
							<a class="icon" href="#" data-service="dropbox"><img src="images/dropbox.png"></a>\
							<a class="icon" href="#" data-service="ubuntu"><img src="images/ubuntu.png"></a>\
						</div>\
					</div>\
					<div class="waiting">\
						<p class="translate" data-translate="syncAuthenticate"></p>\
						<img class="spinner" src="images/spinner.gif">\
						<button class="cancel translate" data-translate="cancel"></button>\
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
					</div>			\
				</div>\
			</div>\
		</div>\
	');
	$('#prefsDialog .translate').map(function () {
			$(this).html($.i18n._($(this).attr('data-translate')));
	});

	/**********************************
		SETTINGS
	**********************************/

	// CHECK BOXES [DELETE WARNINGS & LOW GRAPHICS MODE]
	$('#tabGeneral form input').change(function () {

		core.storage.prefs.deleteWarnings = $('#deleteWarnings').prop('checked');
		core.storage.save();

	});

	// NEXT AMOUNT
	$('#nextAmount').change(function () {

		core.storage.prefs.nextAmount = this.value;
		core.storage.save();

		//Reloads next if it is selected
		if (ui.lists.selected() === 'next') {
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
	});

	/**********************************
			LOADING PREFERENCES
	**********************************/
	//$('#deleteWarnings').prop('checked', cli.storage.prefs.deleteWarnings);
	//$('#nextAmount').val(cli.storage.prefs.nextAmount);
	$('#theme').val(core.storage.prefs.theme);

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
});




