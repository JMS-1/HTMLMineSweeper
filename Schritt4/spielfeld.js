"use strict";

/*
  Jedes Objekt dieser Klasse repräsentiert ein ganzes Spielfeld. Die Dimensionen
  werden dabei bei der Erzeugung vorgegeben und stehen dann als Informationen zur
  Verfügung:
        breite: number          die Anzahl der Zellen pro Zeile des Spielfelds
        hoehe: number           die Anzahl der Zeilen des Spielfelds
        minen: number           die Anzahl der Zellen, unter denen Minen versteckt sind.

  Weitere Informationen beschreiben den Zustand des Spiels:
        zellen: Zelle[]         alles Zellen, die zum Spiel gehören, angeordnet von rechts nach links und dann von oben nach unten
        zuPrüfen: number        die Anzahl der Zellen ohne Minen, die noch nicht aufgedeckt wurden
        start: Date             der Zeitpunkt, an dem das Spiel gestartet wurde       
        ergebnis: number        die Spielzeit bis zum Ende des Spiels in Sekunden

  Änderungen zum Spielverlauf werden über Benachrichtigungen mitgeteilt:
        fertig: (gewonnen: boolean) => void        wird aufgerufen, wenn das Spiel beendet ist - entweder, weil alle Zellen ohne Minen aufgedeckt sind oder versucht wurde, eine Zelle mit Mine aufzudecken
*/
function Spielfeld(breite, hoehe, minen) {
    this.breite = breite;
    this.hoehe = hoehe;
    this.minen = minen;

    this.initialisieren();
}

// Baut den Spielstand völlig neu auf.
Spielfeld.prototype.initialisieren = function () {
    this.zuPrüfen = this.breite * this.hoehe - this.minen;
    this.ergebnis = undefined;
    this.fertig = null;
    this.zellen = [];

    // Modelle für die Zellen erstellen und merken
    for (var zeile = 0; zeile < this.hoehe; zeile++)
        for (var spalte = 0; spalte < this.breite; spalte++)
            this.zellen.push(new Zelle(this, zeile, spalte));

    // Die gewünschte Anzahl von Minen verstecken
    for (var zuVerstecken = this.minen; zuVerstecken-- > 0;) {
        var zelle = this.zufallsZelle();
        if (zelle.istMine)
            zuVerstecken++;
        else
            zelle.istMine = true;
    }

    this.start = new Date();
}

// Sucht eine Zelle ohne Mine und ohne Minen im direkten Umfeld und führt die Prüfung darauf durch.
Spielfeld.prototype.freiesFeldSuchen = function () {
    for (; ;) {
        var zelle = this.zufallsZelle();
        if (this.minenZählen(zelle) > 0)
            continue;

        zelle.prüfen();

        return;
    }
}

// Ermittelt zu einer Zelle die Minen im direkten Umfeld.
Spielfeld.prototype.minenZählen = function (zelle) {
    var minen = 0;

    for (var zeile = Math.max(0, zelle.zeile - 1) ; zeile <= Math.min(zelle.zeile + 1, this.hoehe - 1) ; zeile++)
        for (var spalte = Math.max(0, zelle.spalte - 1) ; spalte <= Math.min(zelle.spalte + 1, this.breite - 1) ; spalte++)
            if (this.zellen[zeile * this.breite + spalte].istMine)
                minen++;

    return minen;
}

// Ermittelt eine zufällige Zelle.
Spielfeld.prototype.zufallsZelle = function () {
    return this.zellen[Math.floor(Math.random() * this.zellen.length)];
}

// Beendet das Spiel als verloren.
Spielfeld.prototype.verloren = function () {
    this.prüfen(-1);
}

// Vermerkt, dass eine weiter Zelle ohne Mine aufgedeckt wurde.
Spielfeld.prototype.erfolgreichGeprüft = function () {
    this.prüfen(this.zuPrüfen - 1);
}

// Meldet die Spielzeit in Sekunden.
Spielfeld.prototype.spielzeit = function () {
    var jetzt = new Date();

    return (jetzt.getTime() - this.start.getTime()) / 1000.0;
}

// Aktualisiert den Spielstand.
Spielfeld.prototype.prüfen = function (zuPrüfen) {
    // Spielstand übernehmen
    this.zuPrüfen = zuPrüfen;

    // Es gibt noch Zellen, die aufgedeckt werden können
    if (this.zuPrüfen > 0)
        return;

    // Spielzeit merken
    this.ergebnis = this.spielzeit();

    // Alle Zellen als beendet markieren und so weitere Aktionen des Anwenders unterbinden
    this.zellen.forEach(function (zelle) {
        zelle.beenden();
    });

    // Das Ende des Spiels mitteilen und dabei die Anzeige aktualisieren - das ist nicht Aufgabe des Modells!
    if (this.fertig !== null)
        this.fertig(zuPrüfen == 0);
}
