module.exports = function(grunt) {
	require('time-grunt')(grunt);

	const fs = require('fs'),
		chalk = require('chalk'),
		PACK = grunt.file.readJSON('package.json'),
		date = new  Date(),
		year = date.getFullYear(),
		month = String(date.getMonth() + 1).padStart(2, "0"),
		day = String(date.getDate()).padStart(2, "0"),
		update = grunt.template.today("yyyy-mm-dd'T'HH-MM-ss").replace(/[- ]+/gi, ''),

// При разработке/добавлении локализации всё добавляется здесь
		langs = [
			"be",
			"de",
			"en_GB",
			"ru",
			"uk"
		];
	grunt.log.writeln();
	fs.writeFileSync('src/js/01$update.js', `let update = "${update}";
let version = "v${PACK.version}";
tinymce.PluginManager.requireLangPack('notocoloremoji', '${langs.join(",")}');
`);
	grunt.log.writeln('File ' + chalk.cyan(`src/js/01$update.js`) + ' created or replace.' + chalk.yellow('...OK'));
	grunt.log.writeln();
//---------------------------------------------

	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		globalConfig : {},
		pkg : {},
		clean: {
			zip: ['*.zip'],
			temp: ['temp']
		},
		'string-replace': {
			tpl: {
				files: {
					'install/assets/plugins/': 'install/assets/plugins/**',
					'assets/plugins/utilites/notocoloremoji/': 'assets/plugins/utilites/notocoloremoji/**',
				},
				options: {
					replacements: [
						{
							pattern: /[ ]+\*(?:\s+)\@version(\s+)([\d.]+)/gi,
							replacement: ` * @version$1${PACK.version}`,
						},
						{
							pattern: /[ ]+\*(?:\s+)\@lastupdate(\s+)([\d.\- \:]+)/gi,
							replacement: ` * @lastupdate$1${grunt.template.today("yyyy-mm-dd HH:MM:00")}`,
						},
						{
							pattern: /\@modx_category(\s+).+/gi,
							replacement: `@modx_category Utilites`,
						},
						{
							pattern: /\$mtime(?:\s+)?=(?:\s+)"(?:.+)?";/g,
							replacement: `\$mtime = "${update}";`
						}
					],
				},
			},
			theme: {
				files: {
					"assets/plugins/tinymce4/theme/": "assets/plugins/tinymce4/theme/**"
				},
				options: {
					replacements: [
						{
							pattern: /<\?php\s+\/\*[^*]*\*+(?:[^\/*][^*]*\*+)*\//g,
							replacement: `<?php
/**
 * 
 * Plugins Noto Color Emoji for TinyMCE
 * 
 * Plugin:
 * [+] notocoloremoji
 * 
 * Button:
 * [+] notocoloremoji
 * 
 * Version: ${PACK.version}
 * License: GPL-3.0
 * Author: ProjectSoft <projectsoft2009@yandex.ru>
 * Last Update: ${grunt.template.today("yyyy-mm-dd HH:MM:00")}
 * Home Page URL: https://github.com/ProjectSoft-STUDIONIONS/NotoColorEmoji-TinyMCE4
 * 
 * Конфиг-параметры TinyMCE4 для сайта
 * https://www.tinymce.com/docs/configure/
 *
 * Приведенная ниже настройка конфигурации по умолчанию гарантирует, что все параметры редактора имеют резервное значение, а тип для каждого ключа известен.
 * $this->set($editorParam, $value, $type, $emptyAllowed=false)
 *
 * $editorParam = параметр для установки
 * $value = значение для установки
 * $type = строка, число, логическое значение, json (массив или строка)
 * $emptyAllowed = true, false (разрешает параметр: '' вместо возврата к значениям по умолчанию)
 * Если $editorParam пуст, а $emptyAllowed равен true, $defaultValue будет игнорироваться
 *
 * $this->modxParams содержит массив фактических настроек Modx/user-settings
 *
 */`
						}
					]
				}
			}
		},
		less: {
			main: {
				options : {
					compress: false,
					ieCompat: false,
					plugins: [],
					modifyVars: {
						fontpath: "/assets/plugins/tinymce4/tinymce/plugins/notocoloremoji/fonts",
						fontsize: "25px",
						emojisize: "34px"
					},
				},
				files : {
					'temp/css/plugin.css' : [
						'src/less/main.less'
					],
					'temp/css/content.css' : [
						'src/less/content.less'
					],
				}
			}
		},
		autoprefixer:{
			options: {
				browsers: [
					"last 4 version"
				],
				cascade: true
			},
			main: {
				files: {
					'temp/css/plugin.css' : [
						'temp/css/plugin.css'
					],
					'temp/css/content.css' : [
						'temp/css/content.css'
					],
				}
			}
		},
		cssmin: {
			main: {
				options: {
					mergeIntoShorthands: false,
					roundingPrecision: -1,
					banner: `/**
 * 
 * Plugins Noto Color Emoji for TinyMCE
 * 
 * Plugin:
 * [+] notocoloremoji
 * 
 * Button:
 * [+] notocoloremoji
 * 
 * Version: ${PACK.version}
 * License: GPL-3.0
 * Author: ProjectSoft <projectsoft2009@yandex.ru>
 * Last Update: ${grunt.template.today("yyyy-mm-dd HH:MM:00")}
 * Home Page URL: https://github.com/ProjectSoft-STUDIONIONS/NotoColorEmoji-TinyMCE4
 * 
 * TinyMCE plugin notocoloremoji
 * Разработка велась под EvolutionCMS
 * С дефолтных настроек всё работает
 * Для отображения шрифта на основном сайте и в редакторе админки
 * нужно разработать и подключить стили для этого. Для каждого данного случая должен быть отдельный файл.
 * Для редактора стили подключаются в конфигурации сайта.
 * Для сайта подключаются в шаблонах сайта в блоке head.
 */`
				},
				files: {
					"assets/plugins/tinymce4/tinymce/plugins/notocoloremoji/plugin.min.css": [
						"temp/css/plugin.css"
					],
					'assets/plugins/tinymce4/tinymce/plugins/notocoloremoji/content.min.css' : [
						'temp/css/content.css'
					],
				}
			}
		},
		requirejs: {
			main: {
				options: {
					baseUrl: "src/js/",
					out: "temp/js/plugin.js",
					paths: {},
					wrap: true,
					skipModuleInsertion: true,
					optimize: "none",
					include: [
						// hash
						"01$update.js",
						// Emoji
						"emojis$01.js",
						"emojis$02.js",
						"emojis$03.js",
						"emojis$04.js",
						"emojis$05.js",
						"emojis$06.js",
						"emojis$07.js",
						"emojis$08.js",
						"emojis$09.js",
						"emojis$10.js",
						"emojis$11.js",
						// Плагин
						"plugin.js",
					],
					done: function(done, output) {
						grunt.log.writeln(output.magenta);
						grunt.log.writeln("Build ".cyan + "done!\n");
						done();
					},
					error: function(done, err) {
						grunt.log.warn(err);
						done();
					}
				}
			},
		},
		uglify: {
			options: {
				sourceMap: false,
				banner: `/**
 * 
 * Plugins Noto Color Emoji for TinyMCE4
 * 
 * Plugin:
 * [+] notocoloremoji
 * 
 * Buttons:
 * [+] notocoloremoji
 * 
 * Version: ${PACK.version}
 * License: GPL-3.0
 * Author: ProjectSoft <projectsoft2009@yandex.ru>
 * Last Update: ${grunt.template.today("yyyy-mm-dd HH:MM:00")}
 * Home Page URL: https://github.com/ProjectSoft-STUDIONIONS/NotoColorEmoji-TinyMCE4
 */`,
				compress: {
					drop_console: false
				},
				output: {
					ascii_only: true
				}
			},
			app: {
				files: [
					{
						expand: true,
						flatten : true,
						src: [
							"temp/js/plugin.js"
						],
						dest: "assets/plugins/tinymce4/tinymce/plugins/notocoloremoji",
						filter: "isFile",
						rename: function (dst, src) {
							return dst + "/" + src.replace(".js", ".min.js");
						}
					},
					{
						expand: true,
						flatten : true,
						src: [
							"src/js/langs/*.js"
						],
						dest: "assets/plugins/tinymce4/tinymce/plugins/notocoloremoji/langs",
						filter: "isFile",
						/*rename: function (dst, src) {
							return dst + "/" + src;
						}*/
					},
				]
			},
		},
		copy: {
			main: {
				files: [
					{
						expand: true,
						cwd: 'node_modules/noto-color-emoji/src/fonts',
						src: ['*.*'],
						dest: 'assets/plugins/tinymce4/tinymce/plugins/notocoloremoji/fonts/',
					},
					{
						expand: true,
						cwd: 'node_modules/tinymce-i18n/langs',
						src: ['*.*'],
						dest: 'assets/plugins/tinymce4/tinymce/langs/',
					},
				]
			}
		},
		compress: {
			main: {
				options: {
					archive: `NotoColorEmoji.zip`,
				},
				files: [
					{
						src: [
							'assets/**',
							'install/**',
						],
						dest: `NotoColorEmoji/`,
					},
				],
			},
		},
	});
	grunt.registerTask('default',	[
		"clean",
		"string-replace",
		"requirejs",
		"less",
		"autoprefixer",
		"cssmin",
		"uglify",
		"copy",
		"compress"
	]);
};
