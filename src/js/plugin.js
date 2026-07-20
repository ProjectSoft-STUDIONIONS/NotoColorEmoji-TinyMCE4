
// Регистрация локалей
tinymce.PluginManager.requireLangPack('emoticons');
// Ctegories
var categoryNameMap = {
	symbols: 'Symbols',
	people: 'People',
	animals_and_nature: 'Animals and Nature',
	food_and_drink: 'Food and Drink',
	activity: 'Activity',
	travel_and_places: 'Travel and Places',
	objects: 'Objects',
	flags: 'Flags',
};
var keys = Object.keys;
var each = (obj, calbak) => {
	var props = keys(obj);
	for (var k = 0, len = props.length; k < len; k++) {
		var i = props[k];
		var x = obj[i];
		calbak(x, i);
	}
};
	// Менеджер
const pluginManager = tinymce.PluginManager,
	// Инструменты
	tools = tinymce.util.Tools,
	// Утилиты
	domUtils = tinymce.dom.DOMUtils,
	// Кол-во символов в строке
	emoticons_length = 29,
	// Метадата плагина
	metadata = {
		name: "Noto Color Emoji plugin for TinyMCE4",
		url: "https://github.com/ProjectSoft-STUDIONIONS/NotoColorEmoji-TinyMCE4",
		author: "ProjectSoft <projectsoft2009@yandex.ru>"
	},
	// Локали категорий
	localizedCategories = () => {
		each(categoryNameMap, (a, b) => {
			categoryNameMap[b] = tinymce.translate(a);
		});
	},
	getHtml = (groupEmojis) => {
		let html = ``;
		let props = keys(groupEmojis);
		for (var k = 0, len = props.length; k < len; k++) {
			let obj = groupEmojis[props[k]];
			html += `<span class="notocoloremoji-emoji-td-charset" data-mce-emoji="${obj["char"]}" tabindex="-1" title="${obj["tooltip"]}" role="option" aria-label="${obj["tooltip"]}" style="padding: 5px;">${obj["char"]}</span> `;
		}
		return html;
	},
	renderContentTabHtml = (item, editor) => {
		// Выбрать из emojis символы определённой категории
		const animalEmojis = Object.fromEntries(
			Object.entries(emojis)
				.filter(([_, data]) => data.category === `${item}`)
				.map(([key, data]) => [
					key,
					Object.assign(
						{},
						data,
						{ tooltip: tinymce.translate(key) }
					)
				])
		);
		return `<div class="notocoloremoji-emojis" style="white-space: wrap;display: flex;flex-direction: row;flex-wrap: wrap;user-select: none;align-items: flex-start;justify-content: flex-start;max-height: 100%;gap: 6px;padding: 10px 2px 5px;overflow: auto;">${getHtml(animalEmojis)}</div>`;;
	},
	editorInit = (editor, url) => {
		// Инициализация плагина
		editor.on("init", () => {
				// Документ с редактором
			let doc = editor.editorManager.DOM.doc,
				// Находим head в документе с редактором
				head = doc.querySelector('head'),
				// Определяем суффикс имени файла.
				suffix = editor.settings.cache_suffix || "",
				// Выбираем все теги link с id="emoticons-css"
				links = [...doc.querySelectorAll('link#emoticons-css')],
				// Формируем ссылку по всем правилам API.
				_url = tools._addCacheSuffix(url + `/plugin${editor.suffix}.css`),
				// Будущий link
				link;
			// Линков нет. Вставляем.
			if(links.length == 0) {
				link = doc.createElement('link');
				link.id = `emoticons-css`;
				link.rel = "stylesheet";
				link.type = "text/css";
				link.href = _url;
				head.append(link);
			}
		});
	},
	Plugin = () => {
		pluginManager.add("emoticons", function(editor, url) {
			localizedCategories();
			editorInit(editor, url);
			// Построение
			var items = [];
			// Проходим по категориям. Формируем label вкладки.
			// Это происходит только один раз при инициализации плагина.
			for(var item in categoryNameMap){
				let push = {
					type: "label",
					classes: `emoticon-${item} emoticons-wrapp`,
					title: categoryNameMap[item],
					// Рендерим html для вкладки по типу категории
					html: renderContentTabHtml(item, editor),
				};
				items.push(push);
			}
			// Добавляем кнопку
			const onclick = () => {
				// Открываем диалог
				editor.windowManager.open(
					{
						title: tinymce.translate('Emoji'),
						resizable : true,
						classes: "notocoloremoji-dialog",
						size: 'normal',
						body: {
							// Панель с табами
							type: 'tabpanel',
							// Табы с ренднром html
							items: items,
							// Клик
							onclick: (e) => {
								// Определяем объект на котором кликнули
								let target = e.target;
								// Если объект есть и есть у объекта аттрибут
								if(target && target.hasAttribute("data-mce-emoji")) {
									// Получаем символ
									let emoji_charset = target.getAttribute("data-mce-emoji");
									// Вставляем символ
									editor.insertContent(emoji_charset);
									// Закрываем диалог
									editor.windowManager.close();
								}
							}
						},
						buttons: [
							// Кнопка на GitHub плагина
							{
								name: 'custom',
								text: metadata.name,
								disabled: false,
								primary: false,
								classes: "notocoloremoji-github",
								onclick: (e) => {
									e.preventDefault();
									// Переходим на GitHub страницу плагина
									window.open(metadata.url, 'NotoColorEmoji-TinyMCE4');
									return !1;
								},
							},
							// Кнопка закрытия окна
							{
								text: 'Close',
								primary: true,
								classes: 'primary',
								onclick: () => {
									// Закрываем диалог
									editor.windowManager.close();
								}
							}
						]
					}
				);
			};
			editor.addButton('emoticons', {
				icon: "emoticons",
				tooltip: "Emoji",
				onclick: onclick,
				shortcut: 'Ctrl+E',
				classes: "notocoloremoji-button",
			});
			// Добавляем пункт меню к инструментам
			editor.addMenuItem('emoticons', {
				icon: "emoticons",
				text: "Emoji",
				onclick: onclick,
				context: "insert",
				appendToContext: true,
				shortcut: 'Ctrl+E',
				classes: "notocoloremoji-menu-item",
			});
			editor.shortcuts.add('Ctrl+E', tinymce.translate('Emoji'), onclick);
			return {
				getMetadata: () => metadata
			};
		});
	};
Plugin();

