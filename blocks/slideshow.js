// Registrerar blocket "JB Slideshow" som ett custom Gutenbergblock för en bildslideshow.

wp.blocks.registerBlockType("jblocks/slideshow", {
	title: "JB Slideshow",
	icon: "slides",
	category: "jblocks-category",
	description: "Skapa ett bildspel (slideshow) med flera bilder som spelas upp automatiskt.",

	attributes: {
		id: {
			type: "string",
			default: ""
		},
		
		images: { // Skapa en array med bilder till galleri. Varje bild behöver nedanstående blockattribut.
			type: "array",
			default: [],
			source: "query",
			selector: "img",
			query: { // Hämta metadata för varje bild i arrayen

				imageID: { // Metadata för bild ID
					type: "number",
					source: "attribute",
					attribute: "data-id",
				},

				imageURL: { // Metadata för URL till bild i Media Library
					type: "string",
					source: "attribute",
					attribute: "src",
				},

				imageAlt: { // Metadata för bildens alt-text
					type: "string",
					source: "attribute",
					attribute: "alt",
				},

				imageTitle: { // Metadata för bildens titel
					type: "string",
					source: "attribute",
					attribute: "title",
				},

				imageDescription: { // Metadata för bildbeskrivning
					type: "string",
  					source: "attribute",
  					attribute: "data-caption",
				},
			},
		},
	},

	// Funktioner och attribut för blocket i redigeringsläge.
	edit: function (props) {

		var attributes = props.attributes;
		var hasImages = props.attributes.images && props.attributes.images.length > 0; // Om det finns bilder i slideshowen.
		
		var setImages = function (media) { // Metadata från Media Library för bildernas attribut. Skapas för varje vald bild.
			var newImages = media.map(function (image) {
				return {
					imageURL: image.sizes.full.url,
					imageAlt: image.alt,
					imageTitle: image.title,
					imageDescription: image.caption
				};
			});

			props.setAttributes({ // Uppdaterar array med valda bilder
				images: newImages,
			});
		};

		return wp.element.createElement( // Aktivera inställningar i sidopanel
			wp.element.Fragment,
			null,
			wp.element.createElement( // Wrappar inställningarna och gör dem in-line
				wp.editor.InspectorControls,
				null,
				wp.element.createElement( // Skapa inställningar för slideshow (endast rubrik just nu)
					wp.components.PanelBody,
					{
						title: "Slideshowinställningar",
						initialOpen: true,
					},
					wp.element.createElement(
						wp.components.TextControl,
						{
						  label: "Namn på slideshow (ID)",
						  value: attributes.id,
						  onChange: function (value) {
							props.setAttributes(
								{
							  	  id: value
								}
							);
						  },
						  help: "Används för unik CSS-styling och är valfritt.",
					 	}
					)
				)
			),

			wp.element.createElement( // Skapar en div med klassen "wp-block-jblocks-slideshow-editor" och returnerar valda bilder (img-element) i array
				"div",
				{
					className: "wp-block-jblocks-slideshow-editor" // Tilldelar klass i redigeringsläget
				},

				attributes.images.map(function (image, index) {
					return wp.element.createElement("img", { // Returnerar varje bild med metadata
						key: index,
						src: image.imageURL,
						alt: image.imageAlt,
						title: image.imageTitle,
					});
				})
			),

			wp.element.createElement(wp.editor.MediaUpload, { // Skapar knapp för Media Library där bilder kan väljas till slideshow
				onSelect: setImages, 
				type: "image",
				gallery: true,
				multiple: true,
				render: function (mediaLibrary) { // Funktion för att öppna Media Library med klick på knappen
					return [
						wp.element.createElement( // Returnera knapp som använder inbyggd CSS för styling
							wp.components.Button,
							{
								className: "button button-large",
								onClick: mediaLibrary.open,
								key: "upload-button",
							},
							
							// Shorthand för if-else om det finns bilder i blocket eller inte. Justerar texten.
							hasImages ? "Byt ut bilder.." : "Lägg till bilder i slideshow.." 
						),
					];
				},
			}),
		);
	},

    // Inställningar för visning av block på frontend
    
	save: function (props) {
		var images = props.attributes.images;

		if (images.length > 0) { // Om slideshowen inte är tom

			var slideshow = images.map(function (image, index) { // Returnera array med bilder och attribut.
				return wp.element.createElement(
					"div",
					{
						className: "jblocks-slide",
						key: index 
					},

					wp.element.createElement(
						"img",
						{
						className: "jblocks-slideimg fade", // Tilldela klass på varje bild
						src: image.imageURL,
						alt: image.imageAlt,
						title: image.imageTitle,
						}
					),

					wp.element.createElement(
						"p",
						{ className: "jblocks-slidetext"},
						image.imageDescription
					)
				);
			});
			
			return wp.element.createElement( // Skapa en div för slideshow och skriv ut bilder inom denna. 
				"div",
				{ 
					id: props.attributes.id
				},
				slideshow
			);
				
		} else {
			// Om slideshow är tom
			return null;
		}
	}
});