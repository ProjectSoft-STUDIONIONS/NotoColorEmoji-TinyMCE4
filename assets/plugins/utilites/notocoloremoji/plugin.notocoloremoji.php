<?php
/**
 * NotoColorEmoji
 *
 * Подключение Noto Color Emoji в админке
 *
 * @category     plugin
 * @version      1.2.1
 * @package      evo
 * @internal     @events OnManagerTopPrerender,OnManagerMainFrameHeaderHTMLBlock
 * @internal     @properties 
 * @internal     @modx_category Utilites
 * @internal     @installset base
 * @internal     @disabled 0
 * @homepage     https://github.com/ProjectSoft-STUDIONIONS/NotoCoorEmoji-TinyMCE4#readme
 * @license      https://github.com/ProjectSoft-STUDIONIONS/NotoCoorEmoji-TinyMCE4/blob/main/LICENSE GNU General Public License v3.0 (GPL-3.0)
 * @reportissues https://github.com/ProjectSoft-STUDIONIONS/NotoCoorEmoji-TinyMCE4/issues
 * @author       Чернышёв Андрей aka ProjectSoft <projectsoft2009@yandex.ru>
 * @lastupdate   2026-01-30 16:37:26
 */

if (!defined('MODX_BASE_PATH')):
	http_response_code(403);
	die('For');
endif;

$e = &$modx->event;
$params = $e->params;

$output = "";

switch ($e->name) {
	// Подключение к фреймам админки и к основному контенту админки
	case 'OnManagerMainFrameHeaderHTMLBlock':
	case 'OnManagerTopPrerender':
		// Подключение стилей к административной панели
		// Для правильного отображения Emoji в контролах и контенте административной панели
		$css_path = 'assets/plugins/tinymce4/tinymce/plugins/notocoloremoji/plugin.min.css';
		// Фиксированно. Зависит только от даты обновления при сборке плагина
		$mtime = "20260130T163725";
		$output = <<<EOD
<link rel="stylesheet" type="text/css" href="{$modx->config['site_url']}{$css_path}?v={$mtime}">
EOD;
		$modx->event->output($output);
		break;
	default:
		// code...
		break;
}
