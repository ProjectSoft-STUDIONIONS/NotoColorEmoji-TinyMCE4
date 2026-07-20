module.exports = function(grunt) {
	require('time-grunt')(grunt);
	require('load-grunt-tasks')(grunt);
	const fs = require('fs'),
		chalk = require('chalk'),
		PACK = grunt.file.readJSON('package.json'),
		date = new  Date(),
		year = date.getFullYear(),
		month = String(date.getMonth() + 1).padStart(2, "0"),
		day = String(date.getDate()).padStart(2, "0"),
		update = grunt.template.today("yyyy-mm-dd'T'HH-MM-ss").replace(/[- ]+/gi, '');
	grunt.initConfig({
		globalConfig : {},
		pkg : {},
		clean: {
			main: [
				'*.zip',
				'assets',
				'temp',
			],
		},
		less: {
			main: {
				options : {
					compress: false,
					ieCompat: false,
					plugins: [],
					modifyVars: {
						fontpath: "fonts",
					},
				},
				files : {
					'assets/plugins/tinymce4/tinymce/plugins/emoticons/plugin.css' : [
						'src/less/plugin.less',
					],
					/*
					// Под систему
					'C:/OSPanel/home/example.local/assets/plugins/tinymce4/tinymce/plugins/emoticons/plugin.css': [
						'src/less/plugin.less',
					],
					*/
				},
			},
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
					'assets/plugins/tinymce4/tinymce/plugins/emoticons/plugin.css' : [
						'assets/plugins/tinymce4/tinymce/plugins/emoticons/plugin.css',
					],
					/*
					// Под систему
					'C:/OSPanel/home/example.local/assets/plugins/tinymce4/tinymce/plugins/emoticons/plugin.css': [
						'C:/OSPanel/home/example.local/assets/plugins/tinymce4/tinymce/plugins/emoticons/plugin.css',
					],
					*/
				},
			},
		},
		cssmin: {
			main: {
				options: {
					mergeIntoShorthands: false,
					roundingPrecision: -1,
				},
				files: {
					"assets/plugins/tinymce4/tinymce/plugins/emoticons/plugin.min.css": [
						"assets/plugins/tinymce4/tinymce/plugins/emoticons/plugin.css"
					],
					/*
					// Под систему
					'C:/OSPanel/home/example.local/assets/plugins/tinymce4/tinymce/plugins/emoticons/plugin.min.css': [
						'C:/OSPanel/home/example.local/assets/plugins/tinymce4/tinymce/plugins/emoticons/plugin.css',
					],
					*/
				},
			},
		},
		requirejs: {
			main: {
				options: {
					baseUrl: "src/js/",
					out: "assets/plugins/tinymce4/tinymce/plugins/emoticons/plugin.js",
					paths: {},
					wrap: true,
					skipModuleInsertion: true,
					optimize: "none",
					include: [
						// Emoji
						"emojis.js",
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
			/*
			// Под систему
			site: {
				options: {
					baseUrl: "src/js/",
					out: "C:/OSPanel/home/example.local/assets/plugins/tinymce4/tinymce/plugins/emoticons/plugin.js",
					paths: {},
					wrap: true,
					skipModuleInsertion: true,
					optimize: "none",
					include: [
						// Emoji
						"emojis.js",
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
			*/
		},
		uglify: {
			options: {
				sourceMap: false,
				compress: {
					drop_console: false,
				},
				output: {
					ascii_only: true,
				},
			},
			main: {
				files: [
					{
						expand: true,
						cwd: 'assets/plugins/tinymce4/tinymce/plugins/emoticons/',
						src: ['plugin.js'],
						dest: 'assets/plugins/tinymce4/tinymce/plugins/emoticons/',
						filter: "isFile",
						rename: function (dst, src) {
							return dst + "/" + src.replace(".js", ".min.js");
						},
					},
					{
						expand: true,
						cwd: 'src/js/langs',
						src: ['*.js'],
						dest: 'assets/plugins/tinymce4/tinymce/plugins/emoticons/langs',
						filter: "isFile",
						rename: function (dst, src) {
							return dst + "/" + src.replace(".js", ".min.js");
						},
					},
					/*
					// Под систему
					{
						expand: true,
						cwd: 'assets/plugins/tinymce4/tinymce/plugins/emoticons/',
						src: ['plugin.js'],
						dest: 'C:/OSPanel/home/example.local/assets/plugins/tinymce4/tinymce/plugins/emoticons/',
						filter: "isFile",
						rename: function (dst, src) {
							return dst + "/" + src.replace(".js", ".min.js");
						},
					},
					{
						expand: true,
						cwd: 'src/js/langs',
						src: ['*.js'],
						dest: 'C:/OSPanel/home/example.local/assets/plugins/tinymce4/tinymce/plugins/emoticons/langs',
						filter: "isFile",
						rename: function (dst, src) {
							return dst + "/" + src.replace(".js", ".min.js");
						},
					},
					*/
				],
			}
		},
		copy: {
			main: {
				files: [
					{
						expand: true,
						cwd: 'node_modules/noto-color-emoji/src/fonts',
						src: ['*.*'],
						dest: 'assets/plugins/tinymce4/tinymce/plugins/emoticons/fonts/',
					},
					/*
					// Под систему
					{
						expand: true,
						cwd: 'node_modules/noto-color-emoji/src/fonts',
						src: ['*.*'],
						dest: 'C:/OSPanel/home/example.local/assets/plugins/tinymce4/tinymce/plugins/emoticons/fonts/',
					},
					*/
				],
			},
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
						],
						dest: `emoticons/`,
					},
				],
			},
		},
	});
	grunt.registerTask('default',	[
		"clean",
		"less",
		"autoprefixer",
		"cssmin",
		"requirejs",
		"uglify",
		"copy",
		"compress"
	]);
}
