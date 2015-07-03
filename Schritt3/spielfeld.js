"use strict";

function Spielfeld(breite, hoehe, minen) {
    this.breite = breite;
    this.hoehe = hoehe;
    this.minen = minen;

    this.initialisieren();
}

Spielfeld.prototype.initialisieren = function () {
    this.zuPrüfen = this.breite * this.hoehe - this.minen;
    this.zellen = [];

    for (var zeile = 0; zeile < this.hoehe; zeile++)
        for (var spalte = 0; spalte < this.breite; spalte++)
            this.zellen.push(new Zelle(this, zeile, spalte));

    for (var zuVerstecken = this.minen; zuVerstecken-- > 0;) {
        var zelle = this.zufallsZelle();
        if (zelle.istMine)
            zuVerstecken++;
        else
            zelle.istMine = true;
    }

    this.fertig = null;
}

Spielfeld.prototype.freiesFeldSuchen = function () {
    for (; ;) {
        var zelle = this.zufallsZelle();
        if (this.minenZählen(zelle) > 0)
            continue;

        zelle.prüfen();

        return;
    }
}

Spielfeld.prototype.minenZählen = function (zelle) {
    var minen = 0;

    for (var zeile = Math.max(0, zelle.zeile - 1) ; zeile <= Math.min(zelle.zeile + 1, this.hoehe - 1) ; zeile++)
        for (var spalte = Math.max(0, zelle.spalte - 1) ; spalte <= Math.min(zelle.spalte + 1, this.breite - 1) ; spalte++)
            if (this.zellen[zeile * this.breite + spalte].istMine)
                minen++;

    return minen;
}

Spielfeld.prototype.zufallsZelle = function () {
    return this.zellen[Math.floor(Math.random() * this.zellen.length)];
}

Spielfeld.prototype.verloren = function () {
    this.prüfen(-1);
}

Spielfeld.prototype.erfolgreichGeprüft = function () {
    this.prüfen(this.zuPrüfen - 1);
}

Spielfeld.prototype.istBeendet = function () {
    return (this.zuPrüfen < 1);
}

Spielfeld.prototype.prüfen = function (zuPrüfen) {
    this.zuPrüfen = zuPrüfen;

    if (!this.istBeendet())
        return;

    this.zellen.forEach(function (zelle) {
        zelle.beenden();
    });

    if (this.fertig !== null)
        this.fertig(zuPrüfen == 0);
}
