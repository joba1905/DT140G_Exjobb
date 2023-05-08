// Registrerar blocket "JB Timestamp" som ett custom Gutenbergblock för tidsstämplar och text.

wp.blocks.registerBlockType("jblocks/timestamp", {
    title: "JB Timestamp",
    icon: "clock",
    category: "jblocks-category",
    description: "Detta är ett tidsstämpelblock med formatet [HH:MM:SS.]",
    attributes: {
        content: { // Textinnehåll
            type: "string",
            default: "Jag är ett exempel på en tidsstämpel."
        },

        isBold: { // Fet text. false = normal
            type: "boolean",
            default: false
        },

        timestamp: { // Tidsstämpel
            type: "string",
            default: ""
        }
    },
    example: {
        attributes: { // Visar blockinfo och bild på blocket i listan
            preview: true
        }
    },

    // Funktioner och attribut för blocket i redigeringsläge.

    edit: function (props) {

        // Blockattribut
        var content = props.attributes.content;
        var isBold = props.attributes.isBold;
        var timestamp = props.attributes.timestamp;

        if (timestamp === "") { // Kontroll om tidsstämpel redan finns. Skapa endast tidsstämpel på ett nytt block.
            var date = new Date();
            var hours = date.getHours().toString().padStart(2, "0"); // Konvertera till textsträng och lägg på 0 före om timmen är 0-9 (längd < 2)
            var minutes = date.getMinutes().toString().padStart(2, "0"); // Samma för minuter
            var seconds = date.getSeconds().toString().padStart(2, "0"); // Samma för sekunder
            timestamp = "[" + hours + ":" + minutes + ":" + seconds + "]"; // Formatera sträng för timestamp

            props.setAttributes({timestamp: timestamp}); // Tilldela tidsstämpel till blockattribut
        }

        function updateText(newContent) { // Uppdaterar textinnehåll
            props.setAttributes({content: newContent});
        }
		
        function textBold() { // Funktion för normal/fet text 
            props.setAttributes({isBold: !isBold});
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

                    wp.element.createElement( // Toggleknapp för fet text av/på
                        wp.components.ToggleControl,
                        {
                            label: "Fet text",
                            checked: isBold,
                            onChange: textBold
                        }
                    )
                )
            ),

            wp.element.createElement( // Tidsstämpeln renderas i editorn med WYSIWYG och tilldelas klassen ".wp-block-jblocks-timestamp"
                wp.editor.RichText,
                {
                    tagName: "p",
                    className: props.className,
                    value: props.attributes.content,
                    onChange: updateText,
                    style: {
                        fontWeight: isBold ? "bold" : "normal" // Shorthand för if-else om text är tjock eller inte.
                    }
                }
            )
        );
    },

    // Inställningar för visning av block på frontend

    save: function (props) {

        var content = props.attributes.content;
        var isBold = props.attributes.isBold;
        var timestamp = "<strong>" + props.attributes.timestamp + "</strong>"; // Lägger till fet text runt tidsstämpeln

        if (isBold) { // Om fet text = true
            content = "<strong>" + content + "</strong>";
        }

        return wp.element.createElement( // Tidsstämpelblocket renderas inom en div som har samma klass.
            "div",
            null,
            wp.element.createElement( // Skapar p-taggar runt content
                "p",
                null,
                wp.element.createElement( // Saniterar textinnehåll innanför p-taggar
                    wp.element.RawHTML, 
                    null, 
					timestamp + " " + content
                ) 
            )
        );
    },
});