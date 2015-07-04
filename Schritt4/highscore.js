"use strict";

function HighScore(spielfeld) {
    this.spielfeld = spielfeld;
    this.schlüssel = spielfeld.hoehe + 'x' + spielfeld.breite + 'x' + spielfeld.minen;

    this.ergebnisse = JSON.parse(window.localStorage.getItem(HighScore.schlüssel)) || {};
    this.spieler = this.ergebnisse[this.schlüssel];

    if (this.spieler == undefined)
        this.ergebnisse[this.schlüssel] = (this.spieler = []);
}

HighScore.schlüssel = 'jms.mineSweeper';

HighScore.maximaleAnzahl = 10;

HighScore.nachZeitVergleichen = function (spieler1, spieler2) {
    if (spieler1.zeit < spieler2.zeit)
        return -1;
    else if (spieler1.zeit > spieler2.zeit)
        return +1;
    else
        return 0;
}

HighScore.prototype.eintragen = function (spieler, ergebnis) {
    this.spieler.push({ name: spieler, zeit: ergebnis });
    this.spieler.sort(HighScore.nachZeitVergleichen);
    this.spieler.splice(HighScore.maximaleAnzahl, this.spieler.length);

    window.localStorage.setItem(HighScore.schlüssel, JSON.stringify(this.ergebnisse));
}

HighScore.prototype.istHighScore = function (ergebnis) {
    if (this.spieler.length < HighScore.maximaleAnzahl)
        return true;
    else
        return (ergebnis < this.spieler[this.spieler.length - 1].zeit);
}