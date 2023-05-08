// Registrerar blocket "JB Text" som ett custom Gutenbergblock för textfält.

wp.blocks.registerBlockType( "jblocks/textblock", {
	title: "JB Text",
	icon: "text",
	category: "jblocks-category",
    description: "Detta är ett textblock. Du kan välja textstorlek och stil.",
    attributes: {
        content: { // Textinnehåll
            type: "string",
            default: "Jag är en exempeltext."
        },
		
		isBold: { // Fet text. false = normal
            type: "boolean",
            default: false
        },
		
		fontSize: { // Textstorlek. normal / large
            type: "string",
            default: "normal"
        }
    },
	example: {
		"attributes": { // Visar blockinfo och bild på blocket i listan
			"preview": true
		}
	},

    // Funktioner och attribut för blocket i redigeringsläge.

	edit: function(props) {

		//Blockattribut
        var content = props.attributes.content;
        var isBold = props.attributes.isBold;
		var fontSize = props.attributes.fontSize;

        function updateText(newContent) { // Uppdatera textinnehåll
            props.setAttributes({content: newContent});
        }

        function textBold() { // Funktion för normal/fet text 
            props.setAttributes({isBold: !isBold});
        }
		
		function updateSize(newSize) { // Funktion för textstorlek normal/stor
            props.setAttributes({fontSize: newSize});
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
                        title: "Textinställningar",
                        initialOpen: true 
                    },

                    wp.element.createElement( // Toggleknapp fet text av/på
                        wp.components.ToggleControl,
                        {
                            label: "Fet text",
                            checked: isBold,
                            onChange: textBold,
                        }
                    ),
					
					wp.element.createElement( // Radioknappar för textstorlek normal/stor
                        wp.components.RadioControl,
                        {
                            label: "Textstorlek",
                            selected: fontSize,
                            options: [
                                { label: "Normal", value: "normal" },
                                { label: "Stor", value: "large" },
                            ],
                            onChange: updateSize,
                        }
                    )
                )
            ),
            
            wp.element.createElement( // Textblocket renderas i editorn med WYSIWYG inom en div som tilldelas klassen ".wp-block-jblocks-textblock"
                wp.editor.RichText,
                {
                    tagName: "div",
                    className: props.className,
                    value: props.attributes.content,
                    onChange: updateText,
                    style: {
                        fontWeight: isBold ? "bold" : "normal", // Shorthand för if-else om text är tjock eller inte.
						fontSize: fontSize === "large" ? "1.2em" : "1em" // Shorthand för if-else om stor text är på eller av.
                    }
                }
            )
        );
    },

   	// Inställningar för visning av block på frontend
    save: function(props) {
		
        var content = props.attributes.content;
        var isBold = props.attributes.isBold;
        var fontSize = props.attributes.fontSize || "normal"; // OR-kontroll om stor text annars normal

        if (isBold) { //Om fet text = true
            content = "<strong>" + content + "</strong>";
        }

        return wp.element.createElement( // Textblocket renderas inom en div som tilldelas klassen ".wp-block-jblocks-textblock"
            "div",
            null,
            wp.element.createElement( // Skapar p-taggar runt content
                "p",
                {
                    style: {
                        fontSize: fontSize === "large" ? "1.2em" : "1em" // Shorthand för if-else. Beror på om stor text är på eller av. 
                    }
                },
				wp.element.createElement(wp.element.RawHTML, null, content) // Saniterar textinnehåll innanför p-taggar
            )
        );
    },
});