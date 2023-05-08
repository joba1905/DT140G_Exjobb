// Hitta alla div:ar med slideshows
var slideshows = document.querySelectorAll(".wp-block-jblocks-slideshow");

slideshows.forEach(function (slideshow) { // För varje enskild slideshow i funktionen
    var imgIndex = 0; // Index börjar på 0
    var images = slideshow.querySelectorAll(".jblocks-slideimg"); // Välj alla bilder (img) i slideshow
    var descriptions = slideshow.querySelectorAll(".jblocks-slidetext"); // Välj alla bildbeskrivningar (p) i slideshow

    function carousel() { // Funktion för att stega igenom index för bilder/text, visar en bild/text åt gången och döljer resten. 
        for (var i = 0; i < images.length; i++) {
            images[i].style.display = "none";
            descriptions[i].style.display = "none";
        }

        imgIndex++;

        if (imgIndex > images.length) {
            imgIndex = 1;
        }

        images[imgIndex - 1].style.display = "block";
        descriptions[imgIndex - 1].style.display = "block";

        setTimeout(carousel, 4000); // Ställ in visningstid (millisekunder) för varje bild (Standard: 4000 = 4 sekunder per bild)
    }

    carousel();
});