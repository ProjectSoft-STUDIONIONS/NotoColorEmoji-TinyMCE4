let pluginManager = tinymce.PluginManager,
	tools = tinymce.util.Tools,
	domUtils = tinymce.dom.DOMUtils,
	// Переменные параметров
	notocoloremoji_length = 30,
	exclude = [],
	// Метадата плагина
	plugin_metadata = {
		name: "Noto Color Emoji plugin for TinyMCE4",
		url: "https://github.com/ProjectSoft-STUDIONIONS/NotoColorEmoji-TinyMCE4",
		author: "ProjectSoft <projectsoft2009@yandex.ru>"
	},
	// Родитель
	self = this,
	// Доступные вкладки
	default_emotics = [
		"smiles",
		"emotics",
		"people",
		"animals",
		"nature",
		"food",
		"places",
		"events",
		"objects",
		"symbols",
		"flags"
	],
	// Генератор html для таба
	renderContentTabHtml = (arr, editor) => {
		notocoloremoji_length = parseInt(tinymce.activeEditor.getParam('notocoloremoji_length', 'string', 29));
		notocoloremoji_length = notocoloremoji_length ? notocoloremoji_length : 29;
		const chunks = (a, size) => Array.from( new Array(Math.ceil(a.length / size)), (_, i) => a.slice(i * size, i * size + size) );
		let html = '';
		html += `<div class="wrapper-emojis"><div role="presentation" cellspacing="0" class="mce-grid table-emoji table-emoji-columns">`;
		/**
		 * При сборке html применяем перевод для названий иконок
		 */
		arr = chunks(arr, notocoloremoji_length);
		tools.each(arr, (obj) => {
			html += `<div class="table-emoji-rows">`;
			tools.each(obj, (s) => {
				let title = tinymce.translate(s.title),
					value = s.value;
				html += `<div class="notocoloremoji-emoji-td-charset" data-mce-emoji="${value}" tabindex="-1" title="${title}" role="option" aria-label="${title}">${value}</div>`;
			});
			html += "</div>";
		});
		html += `</div></div>`;
		return html;
	},
	// Генерация кнопки, пункта меню, информации
	addButtons = (editor, url) => {
		// Получаем параметры
		exclude = tinymce.activeEditor.getParam('notocoloremoji_exclude', 'array', []);
		exclude = typeof exclude == "object" ? Array.from(exclude) : [];
		// Собрать элементы (вкладки) исключив запрещённые пользователем
		let emojis_list = [], items = [];
		emojis_list = default_emotics.filter((element) => !exclude.includes(element));
		for(const item of emojis_list){
			if(self[item]) {
				let push = {
					type: "label",
					classes: `emoticon-${item} emoticons-wrapp`,
					title: tinymce.translate(item),
					html: renderContentTabHtml(self[item], editor)
				};
				items.push(push);
			}
		}
		// Данные готовы
		/**
		 * Функция клика
		 */
		let onclick = () => {
			// Открываем диалог
			editor.windowManager.open({
				title: tinymce.translate('Emoji'),
				resizable : true,
				classes: "notocoloremoji-dialog",
				size: 'normal',
				body: {
					type: 'tabpanel',
					items: items,
					onclick: (e) => {
						let target = e.target;
						if(target && target.hasAttribute("data-mce-emoji")) {
							// Получаем Emoji
							let emoji_charset = target.getAttribute("data-mce-emoji");
							// Вставляем Emoji
							editor.insertContent(emoji_charset);
							// Закрываем диалог
							editor.windowManager.close();
						}
					}
				},
				buttons: [
					// Собтветственно информация о плагине
					{
						name: 'custom',
						text: `NotoColorEmoji-TinyMCE4 ${version}`,
						disabled: false,
						primary: false,
						classes: 'notocoloremoji-tinymce4-link',
						//align: 'end',
						onclick: function(e) {
							e.preventDefault();
							// Переходим на GitHub страницу плагина
							window.open(plugin_metadata.url, 'NotoColorEmoji-TinyMCE4');
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
		if (tinymce.majorVersion < 5) {
			editor.addButton('notocoloremoji', {
				icon: false,
				text: "😀",
				tooltip: tinymce.translate("Emoji Noto Color Emoji"),
				onclick: onclick,
				shortcut: 'Ctrl+Alt+E',
				classes: "notocoloremoji-button",
			});
			/**
			 * Добавляем пункт меню к инструментам "Вставить"
			 * Меню notocoloremoji
			 */
			editor.addMenuItem('notocoloremoji', {
				icon: "emoticons",
				text: tinymce.translate("Emoji"),
				onclick: onclick,
				context: "insert",
				prependToContext: true,
				shortcut: 'Ctrl+Alt+E',
				classes: "notocoloremoji-menu-item",
			});
			/**
			 * Shotcuts. Быстрые клавиши
			 */
			editor.shortcuts.add('Ctrl+Alt+E', 'Insert Emoji', onclick);
		} else {
			editor.ui.registry.addButton('notocoloremoji', {
				icon: false,
				text: "😀",
				tooltip: tinymce.translate("Emoji Noto Color Emoji"),
				onclick: onclick,
				shortcut: 'Ctrl+Alt+E',
				classes: "notocoloremoji-button",
			});
			editor.ui.registry.addMenuItem('notocoloremoji', {
				icon: "emoticons",
				text: tinymce.translate("Emoji"),
				onclick: onclick,
				context: "insert",
				prependToContext: true,
				shortcut: 'Ctrl+Alt+E',
				classes: "notocoloremoji-menu-item",
			});
			editor.addShortcut('Ctrl+Alt+E', 'Insert Emoji', onclick);
		}
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
		 * Если доступна нижняя панель
		 * Добавляем ссылку на плагин
		 */
		if(editor.theme.panel){
			let status;
			// Ищем статусбар
			status = editor.theme.panel.find("#statusbar")[0];
			// Если есть, то вставляем ссылку на GitHub страницу плагина
			if(status){
				setTimeout(function() {
					status.insert(
						{
							type: "label",
							name: "notocoloremoji-tinymce4",
							html: `<a href="${plugin_metadata.url}" target="_blank"><em>NotoColorEmoji-TinyMCE4 ${version}</em></a>`,
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
			return  plugin_metadata;
		}
	};
});
