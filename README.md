# JBLOCKS
### En blockplugin för WordPress
#### Skapad av Joacim Bäcklund för Fostira AB 2023

## I. ÖVERSIKT

JBlocks är en blockplugin för WordPress 6.2 som består av en php-pluginfil, en stilmall och en mapp med block. Pluginen registrerar blocken i mappen blocks
och läser ut dem i Gutenberg Block Editor under kategorin "JBlocks". Till många av blocken hör inställningar som visas i Inspector Controls (högerpanelen).

Detta dokument är tänkt som en liten guide för er som ska jobba och vidareutveckla pluggen.  
Det är svårt att förklara utvecklingsdetaljer i text men hoppas att ni ska bli hjälpta av det här och spara lite tid. 

## II. SKAPA ETT BLOCK I JAVASCRIPT

Denna plugin använder block gjorda med JavaScript. Gutenberg Block API använder inslag av React så det är bra att kika lite på det också innan man börjar.

### Skapa en ny .js fil i mappen /blocks

Ett nytt block börjas med denna kod:

    wp.blocks.registerBlockType("jblocks/exempel", {
        [Kod...]
    })

Blocket behöver först lite basic information. Här anger man saker som titel, beskrivning, ikon etc. 
Saker som behöver lagras i variabler, typ ID eller metadata, läggs under attributes. Kolla på ett färdigt block för att se hur det ser ut. 

### Edit och Save

I sin enklaste form styrs blocket av två funktioner: edit (redigeringsläget) och save (visning på frontend).

HTML element som div, p, img etc skapas med hjälp av return wp.element.createElement().

### EXEMPEL PÅ ETT BLOCK:

    wp.blocks.registerBlockType("jblocks/exempel", {
        title: "Exempelblock",
        icon: "smiley",
        category: "common",
    
        edit: function (props) {
            
            return wp.element.createElement(
                "p",
                null,
                "Hello World"
            );
        },
    
        save: function (props) {
            
            return wp.element.createElement(
                "p",
                null,
                "Hello World!"
            );
        },
    });

Detta block skriver ut "Hello World" i både redigering och på frontend inom p-taggar.
Istället för null kan man ange klasser, id och andra attribut:

    return wp.element.createElement(
        "p",
        {
            className: "exempel"
        },
        "Hello World"
    );

Koden skulle skapa samma meddelande men p-taggarna skulle ha CSS klassen "exempel".  

## III. LÄGG TILL BLOCK I PLUGIN

Pluggen behöver en Javascript-fil i mappen /blocks samt två funktioner i jblocks.php för att det nya blocket ska fungera.

### EXEMPEL PÅ BLOCKSTRUKTUR FÖR ETT NYTT BLOCK "exempel.js":

### 1. Skapa blockfilen i mappen /blocks som .js enligt steg II i guiden.

### 2. Registrera script i jblocks.php:

Byt ut "exempel" i sluggen "exempel-script" mot namnet på blocket och byt ut filnamn i sökvägen "blocks/exempel.js"

        wp_register_script(
            "exempel-script",
            plugins_url("blocks/exempel.js", __FILE__),
            array("wp-blocks", "wp-components", "wp-element", "wp-i18n", "wp-editor"), << RÖR EJ!
            filemtime( plugin_dir_path(__FILE__) . "blocks/exempel.js")
        );

### 3. Registrera blocket i plugin:

Byt ut exempel mot namnet på blockets Javascriptfil (utan .js)

        register_block_type("jblocks/exempel", array(
            "editor_script" => "exempel-script",
            "editor_style"  => "jblocks-style", //<< RÖR EJ!
            "style"         => "jblocks-style", //<< RÖR EJ!
            "category"      => "jblocks-category" //<< RÖR EJ!
        ));

### 4. Gör en ny ZIP-fil och importera plugin eller lägg till/uppdatera med WP File Manager.

## IV. RENDER CALLBACK

Tyvärr går det inte att köra Javascriptfunktioner direkt i save i blocken. För att köra funktioner måste man göra det efter att blocket har laddat klart. 
Detta görs genom att registrera skriptet som ska köras och sen lägga till parametern "render_callback" i register_block_type funktionen för blocket som ska köra skriptet.

Ett exempel på det är blocket JB SLIDESHOW:

    register_block_type("jblocks/slideshow", array(
        "editor_script" => "slideshow-script",
        "editor_style"  => "jblocks-style",
		"style"         => "jblocks-style",
        "category"      => "jblocks-category",
        "render_callback" => "jblocks_slideshow_carousel" <---- KÖR FUNKTION HÄR
    ));

Efter man lagt till render_callback och vill köra ett separat script så måste skriptet registreras precis som blockskripten
med wp_register_script:

    wp_register_script(
        "carousel-script",
        plugins_url("js/carousel.js", __FILE__),
        array("wp-blocks", "wp-components", "wp-element", "wp-i18n", "wp-editor"),
        filemtime(plugin_dir_path(__FILE__) . "js/carousel.js")
    );

Det sista som behöver göras är att skapa funktionen som render_callback hänvisar till. Detta kan man göra längst ner i php-filen:

function jblocks_slideshow_carousel($attributes, $content) {
	wp_enqueue_script("carousel-script");
    return $content;
}

Här använder funktionen $attributes (blockets attribut) och $content (blockets innehåll) som först läses in på frontend för att den
sen ska köa och köra skriptet carousel.js med wp_enqueue_script när allt har laddat.

Det finns en separat mapp /js där separata skript som inte är block kan läggas till. Kom ihåg sökvägen bara "js/..."
