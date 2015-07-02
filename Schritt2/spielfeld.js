"use strict"

function Spielfeld(spielfeld) {
    var _this = this;

    this.breite = parseInt(spielfeld.getAttribute('data-breite'));
    this.hoehe = parseInt(spielfeld.getAttribute('data-hoehe'));
    this.minen = parseInt(spielfeld.getAttribute('data-minen'));
    this.zuPrüfen = this.breite * this.hoehe - this.minen;

    this.zellen = [];

    var html = '';
    for (var zeile = 0; zeile < this.hoehe; zeile++) {
        html += '<div>';

        for (var spalte = 0; spalte < this.breite ; spalte++) {
            html += '<div></div>';
        }

        html += '</div>';
    }

    spielfeld.innerHTML = html;

    for (var zeile = 0; zeile < spielfeld.childNodes.length; zeile++)
        for (var spalte = 0; spalte < spielfeld.childNodes[zeile].childNodes.length; spalte++) {
            var feld = spielfeld.childNodes[zeile].childNodes[spalte];

            feld.spieldaten = new Zelle(this, zeile, spalte, feld);

            feld.oncontextmenu = function (ev) {
                return false;
            };

            feld.onmouseup = function (ev) {
                if (ev.button !== 2)
                    return;

                ev.preventDefault();
                ev.stopPropagation();

                this.spieldaten.sperreUmschalten();
            };

            feld.onclick = function () {
                this.spieldaten.prüfen();
            };

            this.zellen.push(feld);
        }

    for (var zuVerstecken = this.minen; zuVerstecken > 0;) {
        var feld = this.zufallsFeld();
        if (feld.getAttribute('data-inhalt') !== null)
            continue;

        zuVerstecken--;

        feld.setAttribute('data-inhalt', 'mine');

        var daten = feld.spieldaten;

        daten.istMine = true;

        for (var zeile = daten.zeile - 1; zeile <= daten.zeile + 1; zeile++)
            if ((zeile >= 0) && (zeile < this.hoehe))
                for (var spalte = daten.spalte - 1; spalte <= daten.spalte + 1; spalte++)
                    if ((spalte >= 0) && (spalte < this.breite))
                        this.zellen[zeile * this.breite + spalte].spieldaten.minen += 1;
    }

    for (; ;) {
        var feld = this.zufallsFeld();
        if (feld.spieldaten.minen > 0)
            continue;

        feld.click();

        break;
    }
}

Spielfeld.prototype.zufallsFeld = function () {
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

    this.zellen.forEach(function (feld) {
        feld.spieldaten.beenden();
    });

    alert((zuPrüfen == 0) ? 'GEWONNEN' : 'VERLOREN');
}