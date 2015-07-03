"use strict";

var ControllerSpielfeld = {
    // Verbindet das Modell eines Spielfelds mit der Anzeige desselben.
    connect: function (model, view) {
        // Wir bauen das Spielfeld als DIV Tabelle auf
        var html = '';

        for (var zeile = 0; zeile < model.hoehe; zeile++) {
            html += '<div>';

            // Zum einfachen Auffinden werden alle echten Zellen mit einer CSS Klasse markiert - die auch praktisch in der CSS Datei verwendet werden kann
            for (var spalte = 0; spalte < model.breite ; spalte++)
                html += '<div class="spielfeldZelle"></div>';

            html += '</div>';
        }

        view.innerHTML = html;

        // Alle erzeugten Zellen ermitteln
        var zellen = view.querySelectorAll('.spielfeldZelle');

        // Die Anzeige der Zellen mit den jeweiligen Modellen verbinden
        for (var zs = 0; zs < zellen.length; zs++)
            ControllerZelle.connect(model.zellen[zs], zellen[zs]);

        // Auf das Sende des Spiels geeignet in der Anzeige reagieren
        model.fertig = function (gewonnen) {
            alert(gewonnen ? "GEWONNEN" : "VERLOREN");
        };

        // Und ein erstes Feld ohne Mine und auch ohne Minen im direkten Umfeld als Starthilfe setzen
        model.freiesFeldSuchen();
    },
};