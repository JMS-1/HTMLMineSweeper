"use strict";

function starten() {
    var spielfelder = document.querySelectorAll('.mineSweeper');

    for (var i = 0; i < spielfelder.length; i++) {
        var spielfeld = spielfelder[i];

        var breite = parseInt(spielfeld.getAttribute('data-breite'));
        var hoehe = parseInt(spielfeld.getAttribute('data-hoehe'));
        var minen = parseInt(spielfeld.getAttribute('data-minen'));

        ControllerSpielfeld.connect(new Spielfeld(breite, hoehe, minen), spielfeld);
    }
}
