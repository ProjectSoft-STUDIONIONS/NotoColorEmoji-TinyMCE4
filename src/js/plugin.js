
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
var each = function (obj, calbak) {
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
	localizedCategories = function() {
		each(categoryNameMap, function(a, b) {
			categoryNameMap[b] = tinymce.translate(a);
		});
	},
	renderContentTabHtml = function(item, editor) {
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
		var props = keys(animalEmojis),
			html = `<div class="notocoloremoji-emojis" style="white-space: wrap;display: flex;flex-direction: row;flex-wrap: wrap;user-select: none;align-items: flex-start;justify-content: flex-start;max-height: 100%;gap: 10px;padding: 10px 2px 5px;overflow: auto;">`;
		for (var k = 0, len = props.length; k < len; k++) {
			let obj = animalEmojis[props[k]];
			html += `<span class="notocoloremoji-emoji-td-charset" data-mce-emoji="${obj["char"]}" tabindex="-1" title="${obj["tooltip"]}" role="option" aria-label="${obj["tooltip"]}" style="padding: 5px;">${obj["char"]}</span> `;
		}
		return html + "</div>";//"<pre style=\"white-space: pre-wrap;width: 400px;\">" + JSON.stringify(animalEmojis, null, "\t") + "</pre>";
	},
	editorInit = function(editor, url) {
		// Инициализация плагина
		editor.on("init", () => {
			let doc = editor.editorManager.DOM.doc,
				head = doc.querySelector('head'),
				link;
			link = doc.createElement('link');
			link.rel = "stylesheet";
			link.type = "text/css";
			link.id = domUtils.DOM.uniqueId();
			link.href = url + '/plugin.min.css';
			// Добавляем тег на страницу с редактором TinyMCE
			head.append(link);
		});
	};
const Plugin = function() {
	pluginManager.add("emoticons", function(editor, url) {
		localizedCategories();
		editorInit(editor, url);
		// Построение
		var items = [];
		for(var item in categoryNameMap){
			let push = {
				type: "label",
				classes: `emoticon-${item} emoticons-wrapp`,
				title: categoryNameMap[item],
				//tooltip: categoryNameMap[item],
				html: renderContentTabHtml(item, editor),
			};
			items.push(push);
		}
		// Добавляем кнопку
		const onclick = function() {
			// Открываем диалог
			editor.windowManager.open(
				{
					title: tinymce.translate('Emoji'),
					resizable : true,
					classes: "notocoloremoji-dialog",
					size: 'normal',
					maxHeight: 710,
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
						{
							name: 'custom',
							text: metadata.name,
							disabled: false,
							primary: false,
							classes: "notocoloremoji-github",
							//align: 'end',
							onclick: function(e) {
								e.preventDefault();
								// Переходим на GitHub страницу плагина
								window.open(metadata.url, 'NotoColorEmoji-TinyMCE4');
								return !1;
							},
						},
						{
							text: 'Close',
							primary: true,
							classes: 'primary',
							onclick: function () {
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
			shortcut: 'Ctrl+Alt+E',
			classes: "notocoloremoji-button",
		});
		// Добавляем пункт меню к инструментам
		editor.addMenuItem('emoticons', {
			icon: "emoticons",
			text: "Emoji",
			onclick: onclick,
			context: "insert",
			prependToContext: true,
			shortcut: 'Ctrl+Alt+E',
			classes: "notocoloremoji-menu-item",
		});
		return {
			getMetadata: function() {
				return  metadata;
			}
		};
	});
};
Plugin();

