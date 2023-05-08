// Registrerar blocket "JB Image" som ett custom Gutenbergblock för en bild.

wp.blocks.registerBlockType("jblocks/image", {
    title: "JB Image",
    icon: "format-image",
    category: "jblocks-category",
    description: "Detta är ett bildblock som använder bildattribut från Media Library.",

    attributes: { // Tilldela ID till bilden
        imageID: {
            type: "number"
        },

        imageURL: { // Metadata för URL till bild i Media Library
            type: "string",
            source: "attribute",
            selector: "img",
            attribute: "src"
        },

        imageAlt: { // Metadata för alt-text
            type: "string",
            source: "attribute",
            selector: "img",
            attribute: "alt"
        },

        imageTitle: { // Metadata för titel
            type: "string",
            source: "attribute",
            selector: "img",
            attribute: "title"
        },

        imageDescription: { // Metadata för bildbeskrivning
            type: "string",
            source: "text",
            selector: "p"
        }
    },

    // Funktioner och attribut för blocket i redigeringsläge.

    edit: function (props) {

        var attributes = props.attributes;

        var setImage = function (media) { // Hämta bildens metadata och sätt som blockattribut
            props.setAttributes({
                imageID: media.id,
                imageURL: media.sizes.full.url,
                imageAlt: media.alt,
                imageTitle: media.title,
                imageDescription: media.description
            });
        };

        return wp.element.createElement( // Aktivera inställningar i sidopanel
            wp.element.Fragment,
            null,
            wp.element.createElement(
                wp.editor.InspectorControls, null,
                wp.element.createElement(
                    wp.components.PanelBody, { // Wrappar inställningarna och gör dem in-line
                        title: "Bildinställningar",
                        initialOpen: true
                    },
                    wp.element.createElement( // Inputfält för alt-text. Hämtas från metadata.
                        wp.components.TextControl, {
                            label: "Alt Text",
                            value: attributes.imageAlt,
                            onChange: function (updateText) {
                                props.setAttributes({
                                    imageAlt: updateText,
                                });
                            },
                            help: "Denna text kommer att visas om bilden inte kan laddas och används av t.ex skärmläsare.",
                        }
                    ),
                    wp.element.createElement( // Inputfält för bildens titel. Hämtas från metadata.
                        wp.components.TextControl, {
                            label: "Titel (title)",
                            value: attributes.imageTitle,
                            onChange: function (updateText) {
                                props.setAttributes({
                                    imageTitle: updateText,
                                });
                            },
                            help: "Ange bildens titel.",
                        }
                    ),
                    wp.element.createElement( // Inputfält för bildbeskrivning. Hämtas från metadata.
                        wp.components.TextareaControl, {
                            label: "Beskrivning (description)",
                            value: attributes.imageDescription,
                            onChange: function (updateText) {
                                props.setAttributes({
                                    imageDescription: updateText,
                                });
                            },
                            help: "Denna text visas under bilden och används som bildbeskrivning.",
                        }
                    )
                )
            ),

            wp.element.createElement(wp.editor.MediaUpload, { // Skapar bilduppladdningsfunktion från Media Library med bild och knapp
                onSelect: setImage,
                type: "image",
                value: attributes.imageID,
                render: function (mediaLibrary) { // Funktion för att öppna Media Library med klick på knappen
                    return [
                        attributes.imageID ? wp.element.createElement( // Returnerar vald bild 
                            "img", 
                            { 
                                src: attributes.imageURL, 
                                key: "uploaded-image" 
                            }
                        ) : null, // Om bild inte är vald returneras bara uppladdningsknappen

                        wp.element.createElement( // Returnerar knapp som använder inbyggd WordPress CSS för bilduppladdning
                            wp.components.Button, { 
                                className: "button button-large",
                                onClick: mediaLibrary.open,
                                key: "upload-button",
                            },

                            // Shorthand för if-else. Om imageID inte finns: ladda upp ny bild. Om imageID finns: byt ut bild. 
                            !attributes.imageID ? "Ladda upp bild från Media Library.." : "Byt ut bild.." 
                        ),
                    ];
                },
            }),
        );
    },

    // Inställningar för visning av block på frontend

    save: function (props) {

        return wp.element.createElement( // Renderar en div med vald bild och eventuell bildbeskrivning innanför
            "div",
            null,
            wp.element.createElement( // Den uppladdade bilden med blockattribut från metadata
                "img", 
                {
                    src: props.attributes.imageURL,
                    alt: props.attributes.imageAlt,
                    title: props.attributes.imageTitle
                }
            ),
            
            props.attributes.imageDescription && wp.element.createElement( // Om en bildbeskrivning finns så skrivs denna ut under bilden
                "p", 
                null, 
                props.attributes.imageDescription
            )
        );
    },
});