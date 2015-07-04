"use strict";

var ControllerZelle = {
    // Verbindet das Spielmodell einer Zelle mit der zugehörigen Anzeige.
    connect: function (model, view) {

        // Anzeige für die Minen vorbereiten
        if (model.istMine)
            view.className += ' mine';

        // Kontextmenü auf der Anzeige der Zelle deaktivieren
        view.oncontextmenu = function (ev) {
            return false;
        };

        // Eigenes Kontextmenü auf der Anzeige der Zelle aktivieren
        view.onmouseup = function (ev) {
            // Nur die rechte Maustaste
            if (ev.button !== 2)
                return;

            // Es ist keine weitere Bearbeitung ausser unserer erwünscht
            ev.preventDefault();
            ev.stopPropagation();

            // Alten Spielzustand ermitteln
            var warGesperrt = model.istGesperrt;

            // Die Zelle darf nun selbst entscheiden, was sie tut
            model.sperreUmschalten();

            // Bei Veränderung des Spielzustands wird die Anzeige angemessen angepasst
            if (model.istGesperrt !== warGesperrt)
                if (model.istGesperrt)
                    view.className += ' gesperrt';
                else
                    view.className = view.className.substr(0, view.className.length - 9);
        };

        // Zelle auf Mine prüfen
        view.onclick = function () {
            model.prüfen();
        };

        // Geprüfte Zellen in der Anzeige markieren
        model.nachPrüfung = function () {
            view.className += ' getested';

            // Anzahl der Minen in der Umgebung einblenden
            if (!model.istMine)
                if (model.minen > 0)
                    view.textContent = model.minen;
        };
    },
};