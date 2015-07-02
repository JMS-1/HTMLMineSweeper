"use strict"

function Zelle(spielfeld, zeile, spalte, feld) {
    this.spielfeld = spielfeld;
    this.spalte = spalte;
    this.zeile = zeile;

    this.istGesperrt = false;
    this.istGeprüft = false;
    this.istMine = false;

    this.feld = feld;
    feld.zelle = this;
}

Zelle.prototype.sperreUmschalten = function () {
    if (this.spielfeld.istBeendet())
        return;
    if (this.istGeprüft)
        return;

    this.istGesperrt = !this.istGesperrt;

    this.feld.setAttribute('data-gesperrt', this.istGesperrt ? 'ja' : 'nein');
}

Zelle.prototype.prüfen = function () {
    if (this.spielfeld.istBeendet())
        return;
    if (this.istGeprüft)
        return;
    if (this.istGesperrt)
        return;

    this.alsGeprüftMarkieren();

    if (!this.istMine) {
        var minen = this.spielfeld.minenZählen(this);
        if (minen > 0)
            this.feld.innerHTML = minen;
    }

    if (this.istMine)
        this.spielfeld.verloren();
    else
        this.spielfeld.erfolgreichGeprüft();
}

Zelle.prototype.beenden = function () {
    if (this.istMine)
        this.alsGeprüftMarkieren();
}

Zelle.prototype.alsGeprüftMarkieren = function () {
    this.istGeprüft = true;

    this.feld.setAttribute('data-getestet', 'ja');
}

Zelle.prototype.alsMine = function () {
    this.istMine = true;

    this.feld.setAttribute('data-mine', 'ja');
}