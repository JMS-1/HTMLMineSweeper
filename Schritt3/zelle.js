"use strict"

function Zelle(spielfeld, zeile, spalte) {
    this.spielfeld = spielfeld;
    this.spalte = spalte;
    this.zeile = zeile;

    this.istGesperrt = false;
    this.istGeprüft = false;
    this.istBeendet = false;
    this.istMine = false;

    this.minenAnzeigen = null;
    this.nachPrüfung = null;
    this.wirdMine = null;
}

Zelle.prototype.sperreUmschalten = function () {
    if (this.istBeendet)
        return;
    if (this.istGeprüft)
        return;

    this.istGesperrt = !this.istGesperrt;
}

Zelle.prototype.prüfen = function () {
    if (this.istBeendet)
        return;
    if (this.istGeprüft)
        return;
    if (this.istGesperrt)
        return;

    this.alsGeprüftMarkieren();

    if (!this.istMine)
        if (this.minenAnzeigen !== null)
            this.minenAnzeigen(this.spielfeld.minenZählen(this));

    if (this.istMine)
        this.spielfeld.verloren();
    else
        this.spielfeld.erfolgreichGeprüft();
}

Zelle.prototype.beenden = function () {
    this.istBeendet = true;

    if (this.istMine)
        this.alsGeprüftMarkieren();
}

Zelle.prototype.alsGeprüftMarkieren = function () {
    if (this.istGeprüft)
        return;

    this.istGeprüft = true;

    if (this.nachPrüfung !== null)
        this.nachPrüfung();
}

Zelle.prototype.versteckeMine = function () {
    if (this.istMine)
        return;

    this.istMine = true;

    if (this.wirdMine !== null)
        this.wirdMine();
}