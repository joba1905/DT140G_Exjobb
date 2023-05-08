<?php
/**
 * Plugin Name: JBlocks
 * Description: En plugin skapad åt Fostira för egengjorda Gutenbergblock.
 * Version: 1.0
 * Author: Joacim Bäcklund
 */

// Failsafe. Hindrar användare att få direkt access till plugin

if (!defined("ABSPATH")) {
    exit;
}

// Kör script och stilmallar, registrera samtliga egengjorda block.

function jblocks_custom_blocks() {

    // Registrera JavaScript och textblock "JS Text".

    wp_register_script(
        "textblock-script",
        plugins_url("blocks/textblock.js", __FILE__),
        array("wp-blocks", "wp-components", "wp-element", "wp-i18n", "wp-editor"),
        filemtime(plugin_dir_path(__FILE__) . "blocks/textblock.js")
    );

    // Registrera CSS stilmall som samtliga block använder (Räcker med denna kodsnutt och behöver inte upprepas för varje block).

    wp_register_style(
        "jblocks-style",
        plugins_url("/style.css", __FILE__),
        array("wp-edit-blocks"),
        filemtime(plugin_dir_path(__FILE__) . "style.css")
    );

    register_block_type("jblocks/textblock", array(
        "editor_script" => "textblock-script",
        "editor_style"  => "jblocks-style",
		"style"         => "jblocks-style",
        "category"      => "jblocks-category",
    ));
	
	// Registrera Javascript och tidsstämpelblock "JS Timestamp".

    wp_register_script(
        "timestamp-script",
        plugins_url("blocks/timestamp.js", __FILE__),
        array("wp-blocks", "wp-components", "wp-element", "wp-i18n", "wp-editor"),
        filemtime(plugin_dir_path(__FILE__) . "blocks/timestamp.js")
    );

    register_block_type("jblocks/timestamp", array(
        "editor_script" => "timestamp-script",
        "editor_style"  => "jblocks-style",
		"style"         => "jblocks-style",
        "category"      => "jblocks-category",
    ));
    
    // Registrera Javascript och knappblocket "JS Button".

    wp_register_script(
        "button-script",
        plugins_url("blocks/button.js", __FILE__),
        array("wp-blocks", "wp-components", "wp-element", "wp-i18n", "wp-editor"),
        filemtime(plugin_dir_path(__FILE__) . "blocks/button.js")
    );

    register_block_type("jblocks/button", array(
        "editor_script" => "button-script",
        "editor_style"  => "jblocks-style",
		"style"         => "jblocks-style",
        "category"      => "jblocks-category",
    ));

    // Registrera Javascript och länkblocket "JS Link".

    wp_register_script(
        "link-script",
        plugins_url( "blocks/link.js", __FILE__),
        array("wp-blocks", "wp-components", "wp-element", "wp-i18n", "wp-editor"),
        filemtime(plugin_dir_path( __FILE__) . "blocks/link.js")
    );

    register_block_type( "jblocks/link", array(
        "editor_script" => "link-script",
        "editor_style"  => "jblocks-style",
		"style"         => "jblocks-style",
        "category"      => "jblocks-category",
    ));

    // Registrera Javascript och bilduppladdningsblocket "JS Image".

    wp_register_script(
        "image-script",
        plugins_url("blocks/image.js", __FILE__),
        array("wp-blocks", "wp-components", "wp-element", "wp-i18n", "wp-editor"),
        filemtime(plugin_dir_path(__FILE__) . "blocks/image.js")
    );

    register_block_type("jblocks/image", array(
        "editor_script" => "image-script",
        "editor_style"  => "jblocks-style",
		"style"         => "jblocks-style",
        "category"      => "jblocks-category",
    ));

    // Registrera Javascript och galleriblocket "JS Slideshow".

    wp_register_script(
        "slideshow-script",
        plugins_url("blocks/slideshow.js", __FILE__),
        array("wp-blocks", "wp-components", "wp-element", "wp-i18n", "wp-editor"),
        filemtime( plugin_dir_path(__FILE__) . "blocks/slideshow.js")
    );

    // Separat script för bildspelsfunktionen (carousel) i mappen /js

	wp_register_script(
        "carousel-script",
        plugins_url("js/carousel.js", __FILE__),
        array("wp-blocks", "wp-components", "wp-element", "wp-i18n", "wp-editor"),
        filemtime(plugin_dir_path(__FILE__) . "js/carousel.js")
    );

    register_block_type("jblocks/slideshow", array(
        "editor_script" => "slideshow-script",
        "editor_style"  => "jblocks-style",
		"style"         => "jblocks-style",
        "category"      => "jblocks-category",
        "render_callback" => "jblocks_slideshow_carousel" // Används för att köra skript efter att blocket har lästs in på frontend
    ));

    // *** Här kan fler block läggas till ***
    //
    // ----------------> <-----------------
    
    // Lägger till kategori "Jblocks" i array för blockkategorier och tilldela denna position längst upp i listan.

    add_filter("block_categories", function($categories) {
		return array_merge(
			array(
				array(
					"slug"  => "jblocks-category",
					"title" => "JBlocks"
				),
			),
			$categories
		);
	}, 10, 2);
}
add_action("init", "jblocks_custom_blocks");

// Funktion som läser in JavaScript "carousel.js"

function jblocks_slideshow_carousel($attributes, $content) {
	wp_enqueue_script("carousel-script"); // Köar och kör script "carousel.js" för slideshowfunktionalitet
    return $content; // Blockets innehåll från save-funktion/databas
}
