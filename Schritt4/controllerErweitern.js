"use strict";

var ControllerAutoErweiterung = {
    // Verbindet den Umschalter für die automatisch Erweiterung von Zellen ohne direktes Umfeld mit dem Modell des Spielfelds.
    connect: function (model, view) {

        // Änderungen in der Anzeige an das Modell übernehmen
        view.onchange = function () {
            model.autoErweitern = view.checked;
        };

        // Den Anfangszustand aus der Anzeige in das Modell übertragen
        model.autoErweitern = view.checked;
    }
};