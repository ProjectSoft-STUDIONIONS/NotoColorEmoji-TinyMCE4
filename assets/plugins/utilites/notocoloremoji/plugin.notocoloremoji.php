<?php
/**
 * NotoColorEmoji
 *
 * Подключение Noto Color Emoji в админке
 *
 * @category     plugin
 * @version      1.1.0
 * @package      evo
 * @internal     @events OnDocFormRender,OnManagerTopPrerender
 * @internal     @properties 
 * @internal     @modx_category Utilites
 * @internal     @installset base
 * @internal     @disabled 0
 * @homepage     https://github.com/ProjectSoft-STUDIONIONS/NotoCoorEmoji-TinyMCE4#readme
 * @license      https://github.com/ProjectSoft-STUDIONIONS/NotoCoorEmoji-TinyMCE4/blob/main/LICENSE GNU General Public License v3.0 (GPL-3.0)
 * @reportissues https://github.com/ProjectSoft-STUDIONIONS/NotoCoorEmoji-TinyMCE4/issues
 * @author       Чернышёв Андрей aka ProjectSoft <projectsoft2009@yandex.ru>
 * @lastupdate   2026-01-28 00:27:11
 */

if (!defined('MODX_BASE_PATH')):
	http_response_code(403);
	die('For');
endif;

$e = &$modx->event;
$params = $e->params;

$output = "";

switch ($e->name) {
	case 'OnDocFormRender':
		$output = <<<EOD
<!-- Noto Color Emoji link Delete -->
EOD;
		$modx->event->output($output);
		break;
	case 'OnManagerTopPrerender':
		$css_path = 'assets/plugins/tinymce4/tinymce/plugins/notocoloremoji/plugin.min.css';
		$mtime = is_file(MODX_BASE_PATH . $css_path) ? filemtime(MODX_BASE_PATH . $css_path) : '1768553104';
		$output = <<<EOD
<link rel="stylesheet" type="text/css" href="/{$css_path}?v={$mtime}">
EOD;
		$modx->event->output($output);
		break;
	default:
		// code...
		break;
}
