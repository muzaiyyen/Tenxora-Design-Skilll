<?php
// Minimal WordPress stand-ins to exercise template-tenxora-design.php outside WordPress.
define('ABSPATH', __DIR__);
$GLOBALS['T'] = ['path'=>$argv[1], 'content'=>$argv[2] ?? '', 'shortcode'=>($argv[3] ?? '')==='sc'];
$THEME = __DIR__.'/docroot/wp-content/themes/tenxora-2026';
$GLOBALS['filters'] = [];
function get_permalink(){ return 'https://tenxora.services/'.$GLOBALS['T']['path'].'/'; }
function home_url($p='/'){ return 'https://tenxora.services'.$p; }
function wp_parse_url($u,$c=-1){ return parse_url($u,$c); }
function get_theme_file_path($f){ return $GLOBALS['THEME'].'/'.$f; }
function locate_template($a){ return __DIR__.'/fallback.php'; }
function have_posts(){ return true; }
function the_post(){}
function get_post(){ return (object)['post_content'=>$GLOBALS['T']['content']]; }
function apply_filters($n,$v){ return $v; }
function shortcode_exists($s){ return $GLOBALS['T']['shortcode'] && $s==='tenxora_contact'; }
function do_shortcode($s){ return '<form class="tx-contact" method="post" action="/wp-admin/admin-post.php"><input type="hidden" name="action" value="tenxora_contact"><label>Name<input name="name" required></label><label>Email<input type="email" name="email"></label><label>Message<textarea name="m"></textarea></label><label><input type="checkbox" required> I agree</label><button type="submit">Send message</button></form>'; }
function add_action(){}
function wp_head(){ echo '<title>LIVE SEO TITLE</title><meta name="description" content="LIVE DESC"><link rel="canonical" href="'.get_permalink().'"><script type="application/ld+json">{"@type":"WebPage"}</script>'; }
function wp_footer(){ echo '<div id="live-consent">consent tool</div>'; }
function is_admin_bar_showing(){ return false; }
function wp_dequeue_style(){}
include $THEME.'/template-tenxora-design.php';
