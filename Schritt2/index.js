"use strict"

function starten() {
    var spielfelder = document.querySelectorAll('.mineSweeper');

    for (var i = 0; i < spielfelder.length; i++)
        new Spielfeld(spielfelder[i]);
}
