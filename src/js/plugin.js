let pluginManager = tinymce.util.Tools.resolve("tinymce.PluginManager"),
	tools = tinymce.util.Tools.resolve("tinymce.util.Tools"),
	domUtils = tinymce.util.Tools.resolve("tinymce.dom.DOMUtils"),
	// Генератор html для таба
	renderContentTabHtml = (arr) => {
		let html = '';
		html += `<div class="wrapper-emojis"><div role="presentation" cellspacing="0" class="mce-grid table-emoji">`;
		/**
		 * При сборке html применяем перевод для названий иконок
		 */
		tools.each(arr, (s) => {
			let title = tinymce.translate(s.title),
				value = s.value;
			html += `<div data-mce-emoji="${value}" tabindex="-1" title="${title}" role="option" aria-label="${title}">${value}</div>`;
		});
		html += `</div></div>`;
		return html;
	},
	// Генерация кнопки, пункта меню, информации
	addButtons = (editor, url) => {
		let onclick = () => {
			// Объеденим Животные и Природа
			// Из-за малого кол-ва символов
			let emojis$temp = [...emojis$04, ...emojis$05];
			// Открываем диалог
			tinymce.activeEditor.windowManager.open({
				title: tinymce.translate('Emoji'),
				resizable : true,
				class: "notocoloremoji",
				resizable : true,
				body: {
					type: 'tabpanel',
					items: [
						{
							type: "label",
							classes: "emoticon-smiles",
							title: tinymce.translate("Smiles"),
							html: renderContentTabHtml(emojis$01)
						},
						{
							type: "label",
							classes: "emoticon-emotics",
							title: tinymce.translate("Emotics"),
							html: renderContentTabHtml(emojis$02)
						},
						{
							type: "label",
							classes: "emoticon-people",
							title: tinymce.translate("People"),
							html: renderContentTabHtml(emojis$03)
						},
						{
							type: "label",
							classes: "emoticon-animals",
							title: tinymce.translate("Animals and Nature"),
							html: renderContentTabHtml(emojis$temp)
						},
						{
							type: "label",
							classes: "emoticon-food",
							title: tinymce.translate("Food and Drinks"),
							html: renderContentTabHtml(emojis$06)
						},
						{
							type: "label",
							classes: "emoticon-places",
							title: tinymce.translate("Places and Travels"),
							html: renderContentTabHtml(emojis$07)
						},
						{
							type: "label",
							classes: "emoticon-events",
							title: tinymce.translate("Events and Celebrations"),
							html: renderContentTabHtml(emojis$08)
						},
						{
							type: "label",
							classes: "emoticon-objects",
							title: tinymce.translate("Objects and Things"),
							html: renderContentTabHtml(emojis$09)
						},
						{
							type: "label",
							classes: "emoticon-symbols",
							title: tinymce.translate("Symbols"),
							html: renderContentTabHtml(emojis$10)
						},
						{
							type: "label",
							classes: "emoticon-flags",
							title: tinymce.translate("Flags"),
							html: renderContentTabHtml(emojis$11)
						},
					],
					onclick: (e) => {
						let target = e.target;
						if(target && target.hasAttribute("data-mce-emoji")) {
							// Получаем Emoji
							let emoji = target.getAttribute("data-mce-emoji");
							// Вставляем Emoji
							editor.insertContent(emoji);
							// Закрываем диалог
							editor.windowManager.close();
						}
					},
				},
				buttons: [
					// Собтветственно информация о плагине
					{
						name: 'custom',
						text: `NotoCoorEmoji-TinyMCE4 ${version}`,
						disabled: false,
						primary: false,
						//align: 'end',
						onclick: function(e) {
							e.preventDefault();
							// Переходим на GitHub страницу плагина
							window.open('https://github.com/ProjectSoft-STUDIONIONS/NotoCoorEmoji-TinyMCE4', 'NotoCoorEmoji-TinyMCE4');
							return !1;
						},
					},
				],
			});
		};
		/**
		 * Добавляем кнопку
		 * Button notocoloremoji
		 */
		editor.addButton('notocoloremoji', {
			icon: false,
			text: "😀",
			tooltip: tinymce.translate("Emoji"),
			onclick: onclick,
			shortcut: 'Ctrl+Alt+E',
			classes: "notocoloremoji-button",
		});
		/**
		 * Добавляем пункт меню к инструментам Вставить
		 * Меню notocoloremoji
		 */
		editor.addMenuItem('notocoloremoji', {
			icon: "emoticons",
			text: tinymce.translate("Emoji"),
			onclick: onclick,
			context: "insert",
			prependToContext: !1,
			shortcut: 'Ctrl+Alt+E',
			classes: "notocoloremoji-menu-item",
		});
		/**
		 * Shotcuts
		 */
		editor.shortcuts.add('Ctrl+Alt+E', 'Insert Emoji', onclick);
	};
/**
 * Добавляем плагин
 */
pluginManager.add("notocoloremoji", function(editor, url) {
	/**
	 * При инициализации добавляем стили в страницу с редактором
	 */
	editor.on("init", () => {
		let doc = editor.editorManager.DOM.doc,
			/**
		 	 * Документ где применяется редактор TinyMCE
		 	 * 
			 * head Документа
			 */
			head = doc.querySelector('head'),
			/**
			 * Стиль
			 */
			link;
		link = doc.createElement('link');
		link.rel = "stylesheet";
		link.type = "text/css";
		link.id = domUtils.DOM.uniqueId();
		link.href = url + '/plugin.min.css?v=' + update;
		// Добавляем тег на страницу с редактором TinyMCE
		head.append(link);
		/**
		 * Пока оставим. Вполне возможно будет нужен
		 * 
		 * Вставка стилей в iframe редактора
		 */
		/*
		let doс_iframe = editor.getDoc(),
			uniqueId = domUtils.DOM.uniqueId(),
			lnk = domUtils.DOM.create("link", { id: uniqueId, rel: "stylesheet", href: link.href });
		doс_iframe.getElementsByTagName("head")[0].append(lnk);
		*/
		let status;
		/**
		 * Если доступна нижняя панель
		 * Добавляем ссылку на плагин
		 */
		if(editor.theme.panel){
			// Ищем статусбар
			status = editor.theme.panel.find("#statusbar")[0];
			// Если есть, то вставляем ссылку на GitHub страницу плагина
			if(status){
				setTimeout(function() {
					status.insert(
						{
							type: "label",
							name: "notocoloremoji-tinymce4",
							html: `<a href="https://github.com/ProjectSoft-STUDIONIONS/NotoCoorEmoji-TinyMCE4" target="_blank"><em>NotoCoorEmoji-TinyMCE4 ${version}</em></a>`,
							classes: "notocoloremoji-tinymce4 path",
							disabled: false,
						},
						0
					)
				}, 0);
			}
		}
	});
	/**
	 * Добавляем всё
	 */
	addButtons(editor, url);
	/**
	 * Возвращаем информацию о плагине
	 */
	return {
		getMetadata: () => {
			return  {
				name: "Noto Color Emoji plugin for TinyMCE4",
				url: "https://github.com/ProjectSoft-STUDIONIONS/NotoCoorEmoji-TinyMCE4",
				author: "ProjectSoft <projectsoft2009@yandex.ru>"
			};
		}
	};
});
