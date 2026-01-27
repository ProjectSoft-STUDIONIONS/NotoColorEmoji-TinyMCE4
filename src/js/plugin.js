
	let pluginManager = tinymce.util.Tools.resolve("tinymce.PluginManager"),
		tools = tinymce.util.Tools.resolve("tinymce.util.Tools"),
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
			// Button notocoloremoji
			editor.addButton('notocoloremoji', {
				icon: false,
				text: "😀",
				onclick: () => {
					tinymce.activeEditor.windowManager.open({
						title: 'Emoji',
						resizable : true,
						class: "notocoloremoji",
						resizable : true,
						body: {
							type: 'tabpanel',
							items: [
								{
									type: "label",
									title: "Smiles",
									html: smilesFn(emojis$01)
								},
								{
									type: "label",
									title: "Emotics",
									html: smilesFn(emojis$02)
								},
								{
									type: "label",
									title: "People",
									html: smilesFn(emojis$03)
								},
								{
									type: "label",
									title: "Animals",
									html: smilesFn(emojis$04)
								},
								{
									type: "label",
									title: "Nature",
									html: smilesFn(emojis$05)
								},
								{
									type: "label",
									title: "Food and Drinks",
									html: smilesFn(emojis$06)
								},
								{
									type: "label",
									title: "Places and Travels",
									html: smilesFn(emojis$07)
								},
								{
									type: "label",
									title: "Events and Celebrations",
									html: smilesFn(emojis$08)
								},
								{
									type: "label",
									title: "Objects and Things",
									html: smilesFn(emojis$09)
								},
								{
									type: "label",
									title: "Symbols",
									html: smilesFn(emojis$10)
								},
								{
									type: "label",
									title: "Flags",
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
				},
			});
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
