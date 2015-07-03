"use strict";

var ControllerZustand = {
    // Enthält eine Zahl, wenn noch eine asynchrone Aktion aktiv ist.
    aktiv: undefined,

    // Verbindet die Anzeige der Spielzeit mit dem Modell des Spielfelds.
    connect: function (model, view) {
        // Immer erst eine aktive Benachrichtigung entfernen
        window.clearTimeout(ControllerZustand.aktiv);

        // Wird periodisch aufgerufen, solange das Spiel läuft
        function zeitAktualisieren() {
            // Nachsehen, ob das Spiel vielleicht schon vorbei ist
            var ergebnis = model.ergebnis;
            if (ergebnis !== undefined) {
                // Die Spielzeit am Ende wird so genau wir möglich angezeigt
                view.innerHTML = ergebnis;
            }
            else {
                // Aktuelle Spielzeit nur auf ganze Sekunden anzeigen
                view.innerHTML = Math.round(model.spielzeit());

                // Und später nocheinmal hier vorbeischauen
                ControllerZustand.aktiv = window.setTimeout(zeitAktualisieren, 100);
            }
        };

        // Erstmalig starten
        zeitAktualisieren();
    }
};