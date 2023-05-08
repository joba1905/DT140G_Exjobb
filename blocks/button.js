// Registrerar blocket "JB Button" som ett custom Gutenbergblock för en knapp.

wp.blocks.registerBlockType("jblocks/button", {
	title: "JB Button",
	icon: "button",
	category: "jblocks-category",
	description: "Detta är ett knapp-block.",
	attributes: {
		content: {
			type: "string",
			default: "Klicka på mig!"
		}
	},
	example: {
		"attributes": {
			"preview": true
		}
	},

	// Funktioner och attribut för blocket i redigeringsläge.

	edit: function (props) {

		var content = props.attributes.content;

		function updateText(newContent) { // Uppdatera knapptext
			props.setAttributes({content: newContent});
		}

		return wp.element.createElement(
			wp.element.Fragment,
			null,
			wp.element.createElement (
				wp.editor.InspectorControls,
				null,
				wp.element.createElement (
					wp.components.PanelBody,
					{
						title: "Knappinställningar",
						initialOpen: true
					},
					wp.element.createElement ( 
						wp.components.TextControl, {
							label: "Text på knappen",
							value: content,
							onChange: updateText
						}
					)
				)
			),

			wp.element.createElement( // Knappen renderas i editorn och tilldelas klassen ".wp-block-jblocks-button".
				"button",
				{
					className: props.className
				},
				content
			)
		);
	},

  	// Inställningar för visning av block på frontend
	save: function (props) {

    	var content = props.attributes.content;

		return wp.element.createElement ( // Knappen renderas i frontend med samma text och klass.
			"button",
			{
				className: props.className
			},
			content
		);
  	},
});