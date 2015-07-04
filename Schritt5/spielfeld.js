"use strict";

/*
  Jedes Objekt dieser Klasse repräsentiert ein ganzes Spielfeld. Die Dimensionen
  werden dabei bei der Erzeugung vorgegeben und stehen dann als Informationen zur
  Verfügung:
        breite: number          die Anzahl der Zellen pro Zeile des Spielfelds
        hoehe: number           die Anzahl der Zeilen des Spielfelds
        minen: number           die Anzahl der Zellen, unter denen Minen versteckt sind.
        highScore: HighScore    die Verwaltung der Ergebnisse

  Weitere Informationen beschreiben den Zustand des Spiels:
        zellen: Zelle[]         alles Zellen, die zum Spiel gehören, angeordnet von rechts nach links und dann von oben nach unten
        zuPrüfen: number        die Anzahl der Zellen ohne Minen, die noch nicht aufgedeckt wurden
        start: Date             der Zeitpunkt, an dem das Spiel gestartet wurde       
        ergebnis: number        die Spielzeit bis zum Ende des Spiels in Sekunden
        autoErweitern: boolean  gesetzt, wenn nach dem Prüfen von Zellen ohne Umfeld die Umfeldzellen auch geprüft werden sollen

  Änderungen zum Spielverlauf werden über Benachrichtigungen mitgeteilt:
        fertig: (gewonnen: boolean) => void     wird aufgerufen, wenn das Spiel beendet ist - entweder, weil alle Zellen ohne Minen aufgedeckt sind oder versucht wurde, eine Zelle mit Mine aufzudecken
        gewonnen: () => void                    wird aufgerufen, nachdem das Spiel gewonnen wurde - immer nach fertig   
*/
function Spielfeld(breite, hoehe, minen) {
    this.breite = breite;
    this.hoehe = hoehe;
    this.minen = minen;

    this.initialisieren();

    this.highScore = new HighScore(this);
}

// Baut den Spielstand völlig neu auf.
Spielfeld.prototype.initialisieren = function () {
    this.zuPrüfen = this.breite * this.hoehe - this.minen;
    this.autoErweitern = false;
    this.ergebnis = undefined;
    this.gewonnen = null;
    this.fertig = null;
    this.zellen = [];

    // Modelle für die Zellen erstellen und merken
    for (var zeile = 0; zeile < this.hoehe; zeile++)
        for (var spalte = 0; spalte < this.breite; spalte++)
            this.zellen.push(new Zelle(this, zeile, spalte));

    // Zellen ohne Minen
    var ohneMinen = this.zellen.slice();

    // Die gewünschte Anzahl von Minen verstecken
    while (ohneMinen.length > this.zuPrüfen) {
        // Eine der Zellen aussuchen
        var index = Math.floor(Math.random() * ohneMinen.length);
        var zelle = ohneMinen[index];

        // Aus dem Feld entfernen
        ohneMinen.splice(index, 1);

        // Eine Mine verstecken
        zelle.istMine = true;
    }

    // Nun noch das Umfeld aller Zellen prüfen
    this.zellen.forEach(function (zelle) {
        for (var zeile = Math.max(0, zelle.zeile - 1) ; zeile <= Math.min(zelle.zeile + 1, this.hoehe - 1) ; zeile++)
            for (var spalte = Math.max(0, zelle.spalte - 1) ; spalte <= Math.min(zelle.spalte + 1, this.breite - 1) ; spalte++)
                if (this.zellen[zeile * this.breite + spalte].istMine)
                    zelle.minen += 1;
    }, this);

    this.start = new Date();
}

// Sucht eine Zelle ohne Mine und ohne Minen im direkten Umfeld und führt die Prüfung darauf durch.
Spielfeld.prototype.freiesFeldSuchen = function () {
    for (var alleZellen = this.zellen.slice() ; alleZellen.length > 0;) {
        // Eine ermitteln
        var index = Math.floor(Math.random() * alleZellen.length)
        var zelle = alleZellen[index];

        // Anzahl der Minen ermitteln
        if (zelle.minen < 1) {
            zelle.prüfen();

            return;
        }

        // Entfernen
        alleZellen.splice(index, 1);
    }
}

// Beendet das Spiel als verloren.
Spielfeld.prototype.verloren = function (zelle) {
    this.prüfen(-1, zelle);
}

// Vermerkt, dass eine weiter Zelle ohne Mine aufgedeckt wurde.
Spielfeld.prototype.erfolgreichGeprüft = function (zelle) {
    this.prüfen(this.zuPrüfen - 1, zelle);
}

// Meldet die Spielzeit in Sekunden.
Spielfeld.prototype.spielzeit = function () {
    var jetzt = new Date();

    return (jetzt.getTime() - this.start.getTime()) / 1000.0;
}

// Aktualisiert den Spielstand.
Spielfeld.prototype.prüfen = function (zuPrüfen, zelle) {
    // Spielstand übernehmen
    this.zuPrüfen = zuPrüfen;

    // Es gibt noch Zellen, die aufgedeckt werden können
    if (this.zuPrüfen > 0) {
        if (this.autoErweitern)
            if (zelle.minen < 1)
                for (var zeile = Math.max(0, zelle.zeile - 1) ; zeile <= Math.min(zelle.zeile + 1, this.hoehe - 1) ; zeile++)
                    for (var spalte = Math.max(0, zelle.spalte - 1) ; spalte <= Math.min(zelle.spalte + 1, this.breite - 1) ; spalte++)
                        this.zellen[zeile * this.breite + spalte].prüfen();

        return;
    }

    // Spielzeit merken
    this.ergebnis = this.spielzeit();

    // Alle Zellen als beendet markieren und so weitere Aktionen des Anwenders unterbinden
    this.zellen.forEach(function (zelle) {
        zelle.beenden();
    });

    // Das Ende des Spiels mitteilen und dabei die Anzeige aktualisieren - das ist nicht Aufgabe des Modells!
    if (this.fertig !== null)
        this.fertig(zuPrüfen === 0);

    // Und wenn wir gewonnen haben, noch eine weitere Benachrichtigung
    if (zuPrüfen === 0)
        if (this.gewonnen !== null)
            this.gewonnen();
}
