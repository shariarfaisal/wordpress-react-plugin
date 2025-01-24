<?php

/*
  Plugin Name: TubeOnAI Free Tools Plugin
  Version: 1.0
  Author: Faisal
  Author URI: https://github.com/shariarfaisal
*/

if( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

function tubeonaifreetoolspluginregister() {
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'tubeonaifreetoolspluginregister' );