"use strict";

var ControllerZelle = {
    // Verbindet das Spielmodell einer Zelle mit der zugehörigen Anzeige.
    connect: function (model, view) {

        // Anzahl der Minen in der unmittelbaren Umgebung der Zelle ermitteln
        var minen = model.spielfeld.minenZählen(model);

        // Diese Anzahl in die Anzeige übernehmen
        view.innerHTML = '<div>' + ((minen > 0) ? minen : '') + '</div>';

        // Anzeige für Zellen mit Minen vorbereiten
        if (model.istMine)
            view.setAttribute('data-mine', 'ja');

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
                view.setAttribute('data-gesperrt', model.istGesperrt ? 'ja' : 'nein');
        };

        // Zelle auf Mine prüfen
        view.onclick = function () {
            model.prüfen();
        };

        // Geprüfte Zellen in der Anzeige markieren
        model.nachPrüfung = function () {
            view.setAttribute('data-getestet', 'ja');
        };
    },
};