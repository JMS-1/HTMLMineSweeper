"use strict";

var ControllerSpielfeld = {
    // Verbindet das Modell eines Spielfelds mit der Anzeige desselben.
    connect: function (model, view) {
        var cssSpielfeld = 'spielfeld';
        var cssZeile = 'spielfeldZeile';
        var cssZelle = 'spielfeldZelle';
        
        // Wir bauen das Spielfeld als DIV Tabelle auf
        var html = '';

        for (var zeile = 0; zeile < model.hoehe; zeile++) {
            html += '<div class="' + cssZeile + '">';

            // Zum einfachen Auffinden werden alle echten Zellen mit einer CSS Klasse markiert - die auch praktisch in der CSS Datei verwendet werden kann
            for (var spalte = 0; spalte < model.breite ; spalte++)
                html += '<div class="' + cssZelle + '"></div>';

            html += '</div>';
        }

        view.innerHTML = html;

        // Anzeige des Spielfelds einmalig vorbereiten
        if (view.className.indexOf(' ' + cssSpielfeld) < 0)
            view.className += ' ' + cssSpielfeld;

        // Alle erzeugten Zellen ermitteln
        var zellen = view.querySelectorAll('.' + cssZelle);

        // Die Anzeige der Zellen mit den jeweiligen Modellen verbinden
        for (var zs = 0; zs < zellen.length; zs++)
            ControllerZelle.connect(model.zellen[zs], zellen[zs]);
    },
};