
	let pluginManager = tinymce.util.Tools.resolve("tinymce.PluginManager"),
		tools = tinymce.util.Tools.resolve("tinymce.util.Tools"),
		domUtils = tinymce.util.Tools.resolve("tinymce.dom.DOMUtils"),
		_ = tinymce.util.Tools.resolve("tinymce.util.Delay"),
		parts = 10,
		// Генератор html для таба
		smilesFn = (arr) => {
			let html = '';
			html += '<div class="wrapper-emojis"><div role="presentation" cellspacing="0" class="mce-grid table-emoji">';
			//let sml = splitTo(arr, 15);
			tools.each(arr, (s) => {
				let title = s.title,
					value = s.value;
				html += '<div data-mce-emoji="' + value + '" tabindex="-1" title="' + title + '" role="option" aria-label="' + title + '">';
				html += 	value;
				html += '</div>';
			});
			html += '</div></div>';
			return html;
		},
		addButtons = (editor, url) => {
			let onclick = () => {
					let emojis$temp = [...emojis$04, ...emojis$05];
					tinymce.activeEditor.windowManager.open({
						title: translate('Emoji'),
						resizable : true,
						class: "notocoloremoji",
						resizable : true,
						body: {
							type: 'tabpanel',
							items: [
								{
									type: "label",
									classes: "emoticon-smiles",
									title: translate("Smiles"),
									html: smilesFn(emojis$01)
								},
								{
									type: "label",
									classes: "emoticon-emotics",
									title: translate("Emotics"),
									html: smilesFn(emojis$02)
								},
								{
									type: "label",
									classes: "emoticon-people",
									title: translate("People"),
									html: smilesFn(emojis$03)
								},
								{
									type: "label",
									classes: "emoticon-animals",
									title: translate("Animals and Nature"),
									html: smilesFn(emojis$temp)
								},
								{
									type: "label",
									classes: "emoticon-food",
									title: translate("Food and Drinks"),
									html: smilesFn(emojis$06)
								},
								{
									type: "label",
									classes: "emoticon-places",
									title: translate("Places and Travels"),
									html: smilesFn(emojis$07)
								},
								{
									type: "label",
									classes: "emoticon-events",
									title: translate("Events and Celebrations"),
									html: smilesFn(emojis$08)
								},
								{
									type: "label",
									classes: "emoticon-objects",
									title: translate("Objects and Things"),
									html: smilesFn(emojis$09)
								},
								{
									type: "label",
									classes: "emoticon-symbols",
									title: translate("Symbols"),
									html: smilesFn(emojis$10)
								},
								{
									type: "label",
									classes: "emoticon-flags",
									title: translate("Flags"),
									html: smilesFn(emojis$11)
								},
							],
							onclick: (e) => {
								let target = e.target;
								if(target && target.hasAttribute("data-mce-emoji")) {
									let emoji = target.getAttribute("data-mce-emoji");
									editor.insertContent(emoji);
									editor.windowManager.close();
								}
							},
						},
						buttons: [
							// Собственно информация о плагине
							{
								name: 'custom',
								text: `NotoCoorEmoji-TinyMCE4 ${version}`,
								disabled: false,
								primary: false,
								//align: 'end',
								onclick: function(e) {
									e.preventDefault();
									window.open('https://github.com/ProjectSoft-STUDIONIONS/NotoCoorEmoji-TinyMCE4', 'NotoCoorEmoji-TinyMCE4');
									return !1;
								},
							},
						],
					});
				};
			// Button notocoloremoji
			editor.addButton('notocoloremoji', {
				icon: false,
				text: "😀",
				tooltip: translate("Emoji"),
				onclick: onclick,
				shortcut: 'Ctrl+Alt+E',
				classes: "notocoloremoji-button",
			});
			// Меню notocoloremoji
			editor.addMenuItem('notocoloremoji', {
				icon: "emoticons",
				text: translate("Emoji"),
				onclick: onclick,
				context: "insert",
				prependToContext: !1,
				shortcut: 'Ctrl+Alt+E',
				classes: "notocoloremoji-menu-item",
			});
			editor.shortcuts.add('Ctrl+Alt+E', 'Insert Emoji', onclick);
/*
			*/
		};
	pluginManager.add("notocoloremoji", function(editor, url) {
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
			if(editor.theme.panel){
				status = editor.theme.panel.find("#statusbar")[0];
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
		// Добавляем кнопки
		addButtons(editor, url);
		return {
			getMetadata: () => {
				return  {
					name: "Noto Color Emoji plugin for TinyMCE4",
					url: "https://github.com/ProjectSoft-STUDIONIONS/NotoCoorEmoji-TinyMCE4"
				};
			}
		};
	});
