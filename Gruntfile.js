module.exports = function(grunt) {
	require('time-grunt')(grunt);

	const fs = require('fs'),
		chalk = require('chalk'),
		PACK = grunt.file.readJSON('package.json'),
		date = new  Date(),
		year = date.getFullYear(),
		month = String(date.getMonth() + 1).padStart(2, "0"),
		day = String(date.getDate()).padStart(2, "0");

	grunt.log.writeln();
	fs.writeFileSync('src/js/01$update.js', `let update = "${grunt.template.today("yyyy-mm-dd'T'HH-MM-ss").replace(/[- ]+/gi, '')}";
let version = "v${PACK.version}";
`);
	grunt.log.writeln('File ' + chalk.cyan(`src/js/01$update.js`) + ' created or replace.' + chalk.yellow('...OK'));
	grunt.log.writeln();

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
							replacement: ` * @lastupdate$1${grunt.template.today("yyyy-mm-dd HH:MM:ss")}`,
						},
						{
							pattern: /\@modx_category(\s+).+/gi,
							replacement: `@modx_category Utilites`,
						},
					],
				},
			},
		},
		less: {
			main: {
				options : {
					compress: false,
					ieCompat: false,
					plugins: [],
					modifyVars: {
						fontpath: "/assets/plugins/tinymce4/tinymce/plugins/notocoloremoji/fonts"
					},
				},
				files : {
					'temp/css/plugin.css' : [
						'src/less/main.less'
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
 * Last Update: ${grunt.template.today("yyyy-mm-dd HH:MM:ss")}
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
					]
				}
			}
		},
		requirejs: {
			main: {
				options: {
					baseUrl: "src/js/",
					out: "test/js/plugin.js",
					paths: {},
					wrap: true,
					skipModuleInsertion: true,
					optimize: "none",
					include: [
						// hash
						"01$update.js",
						// Languages
						// Переменная
						"02$lang.js",
						// Локализации
						"02-01$lang-ru.js",
						"02-02$lang-ru_RU.js",
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
			}
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
 * Last Update: ${grunt.template.today("yyyy-mm-dd HH-MM")}
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
							"test/js/plugin.js"
						],
						dest: "assets/plugins/tinymce4/tinymce/plugins/notocoloremoji",
						filter: "isFile",
						rename: function (dst, src) {
							return dst + "/" + src.replace(".js", ".min.js");
						}
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
