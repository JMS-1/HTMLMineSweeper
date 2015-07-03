"use strict"

function Spielfeld(spielfeld) {
    this.breite = parseInt(spielfeld.getAttribute('data-breite'));
    this.hoehe = parseInt(spielfeld.getAttribute('data-hoehe'));
    this.minen = parseInt(spielfeld.getAttribute('data-minen'));

    this.zuPrüfen = this.breite * this.hoehe - this.minen;
    this.zellen = [];

    var felder = this.htmlAufbauen(spielfeld);

    for (var zs = 0; zs < felder.length; zs++) {
        var zelle = new Zelle(this, Math.floor(zs / this.breite), zs % this.breite);

        this.zellen.push(zelle);

        ControllerZelle.connect(zelle, felder[zs]);
    }

    this.minenVerstecken();

    this.erstesFeldSuchen();
}

Spielfeld.prototype.htmlAufbauen = function (spielfeld) {
    var html = '';

    for (var zeile = 0; zeile < this.hoehe; zeile++) {
        html += '<div>';

        for (var spalte = 0; spalte < this.breite ; spalte++) {
            html += '<div class="spielfeldZelle"></div>';
        }

        html += '</div>';
    }

    spielfeld.innerHTML = html;

    return spielfeld.querySelectorAll('.spielfeldZelle');
}

Spielfeld.prototype.erstesFeldSuchen = function () {
    for (; ;) {
        var zelle = this.zufallsZelle();
        if (this.minenZählen(zelle) > 0)
            continue;

        zelle.prüfen();

        return;
    }
}

Spielfeld.prototype.minenVerstecken = function () {
    for (var zuVerstecken = this.minen; zuVerstecken-- > 0;) {
        var zelle = this.zufallsZelle();
        if (zelle.istMine)
            zuVerstecken++;
        else
            zelle.versteckeMine();
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

    alert((zuPrüfen == 0) ? 'GEWONNEN' : 'VERLOREN');
}

Spielfeld.register = function (spielfeld) {
    new Spielfeld(spielfeld);
}