﻿"use strict";

function starten() {
    // Ab jetzt gibt es nur noch ein Spielfeld
    var spielfeld = document.getElementById('mineSweeper');

    // Größe ermitteln
    var größe = document.getElementById('auswahlGröße');
    var split = größe.options[größe.selectedIndex].value.split('x');

    // Über die Attribute in der Anzeige werden die Eckdaten des Spielfelds ermittelt
    var hoehe = parseInt(split[0]);
    var breite = parseInt(split[1]);
    var minen = parseInt(split[2]);

    // Modell des Spielfelds anlegen
    var model = new Spielfeld(breite, hoehe, minen);

    // Das Modell mit der Anzeige verbinden
    ControllerSpielfeld.connect(model, spielfeld);

    // Anzeige des Spielzustands
    var zeit = document.getElementById('zeit');

    // Auch hier das Modell mit der Anzeige verbinden
    ControllerZustand.connect(model, zeit);

    // Umschalter für das automatische Erweitern leerer Zellen
    var auto = document.getElementById('autoErweitern');

    // Modell mit der Anzeige verbinden
    ControllerAutoErweiterung.connect(model, auto);

    // Und ein erstes Feld ohne Mine und auch ohne Minen im direkten Umfeld als Starthilfe setzen
    model.freiesFeldSuchen();
}
