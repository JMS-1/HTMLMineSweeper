"use strict";

function starten() {
    // So markieren wir in der Anzeige alle unsere Spielfelder
    var spielfelder = document.querySelectorAll('.mineSweeper');

    for (var i = 0; i < spielfelder.length; i++) {
        // Über die Attribute in der Anzeige werden die Eckdaten des Spielfelds ermittelt
        var spielfeld = spielfelder[i];

        var breite = parseInt(spielfeld.getAttribute('data-breite'));
        var hoehe = parseInt(spielfeld.getAttribute('data-hoehe'));
        var minen = parseInt(spielfeld.getAttribute('data-minen'));

        // Ein neues Modell eines Spielfelds wird schließlich mit der Anzeige verbunden
        ControllerSpielfeld.connect(new Spielfeld(breite, hoehe, minen), spielfeld);
    }
}
