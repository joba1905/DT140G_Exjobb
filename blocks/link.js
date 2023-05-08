// Registrerar blocket "JB Link" som ett custom Gutenbergblock.

wp.blocks.registerBlockType("jblocks/link", {
    title: "JB Link",
    icon: "admin-links",
    category: "jblocks-category",
    description: "Detta block skapar en klickbar URL och ikon för länken kan väljas.",
    attributes: {
        content: { // Länktext
            type: "string",
            default: "Jag är en länk. Klicka på mig!",
        },

        url: { // Länkens URL 
            type: "string",
            default: "#",
        },

        icon: { // Länkikon 
            type: "string",
            default: "admin-links",
        }
    },
	example: {
		"attributes": { // Visar blockinfo och bild på blocket i listan
			"preview": true
		}
	},

    // Funktioner och attribut för blocket i redigeringsläge.
    
    edit: function(props) {

        // Blockattribut
        var content = props.attributes.content;
        var url = props.attributes.url;
        var icon = props.attributes.icon;

        function updateText(newContent) { // Uppdatera länktext
            props.setAttributes({content: newContent});
        }

        function updateURL(newUrl) { // Uppdatera URL 
            props.setAttributes({url: newUrl});
        }

        function updateIcon(newIcon) { // Byt länkikon
            props.setAttributes({icon: newIcon});
        }

        return wp.element.createElement(
            wp.element.Fragment,
            null,
            wp.element.createElement( // Aktivera inställningar i sidopanel
                wp.editor.InspectorControls,
                null,
                wp.element.createElement( // Wrappar inställningarna och gör dem in-line
                    wp.components.PanelBody,
                    {
                        title: "Länkinställningar",
                        initialOpen: true
                    },

                    wp.element.createElement( // Inputfält för länktext
                        wp.components.TextControl,
                        {
                            label: "Länktext",
                            value: content,
                            onChange: updateText
                        }
                    ),

                    wp.element.createElement( // Inputfält för URL
                        wp.components.TextControl,
                        {
                            label: "Ange URL",
                            value: url,
                            onChange: updateURL,
							help: "T.ex https://www.google.se"
                        }
                    ),

                    wp.element.createElement( // Dropdownlista för ikonväljare
                        wp.components.SelectControl,
                        {
                            label: "Ikon",
                            value: icon,
                            options: [
                                {value: "admin-links", label: "Länk"},
                                {value: "admin-page", label: "Sida"}
                            ],
                            onChange: updateIcon
                        }
                    )
                )
            ),

            wp.element.createElement( // Länkblocket renderas i editorn inom p-taggar (här vill man inte ha en aktiv länk) och tilldelas klassen ".wp-block-jblocks-link".
                "p",
                {
                    className: props.className
                },
                wp.element.createElement( // Lägger till vald ikon i ett span
                    wp.components.Dashicon,
                    {
                        icon: icon
                    }
                ),
                content
            )
        );
    },

    // Inställningar för visning av block på frontend
    save: function (props) {

        var content = props.attributes.content;
        var url = props.attributes.url;
        var icon = props.attributes.icon;

        return wp.element.createElement( // Länkblocket renderas inom a-taggar med samma klass och ikon. 
            "a",
            {
                href: url,
                className: props.className
            },
            wp.element.createElement(
                wp.components.Dashicon,
                {
                    icon: icon
                }
            ),
            content
        );
    },
});