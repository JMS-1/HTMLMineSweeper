"use strict";

/*
  Objekte dieser Klasse beschreiben einzelne Zellen des Spielfelds. Folgende Informationen werden
  statisch verwaltet:
        spielfeld: Spielfeld                das Spielfeld zur Zelle
        zeile: number                       die 0-basierte laufende Nummer der Zeile der Zelle auf dem Spielfelds
        spalte: number                      die 0-basierte laufende Nummer der Spalte der Zelle auf dem Spielfelds

  Zusätzlich werden folgende Informationen passend zum Spielverlauf angeboten:
        istMine: boolean                    gesetzt, wenn in der Zelle eine Mine versteckt ist
        istGesperrt: boolean                gesetzt, wenn die Zelle für Prüfungen gesperrt wurde, weil der Verdacht einer Mine besteht
        istGeprüft: boolean                 gesetzt, sobald die Zelle durch Aufdecken geprüft wurde
        istBeendet: boolean                 gesetzt, wenn das Spiel als beendet gemeldet wurde

  Änderungen am Spielzustand werden durch folgende Methoden gemeldet:
        nachPrüfung: () => void             wird aufgerufen, wenn istGeprüft erstmalig gesetzt wird
*/
function Zelle(spielfeld, zeile, spalte) {
    this.spielfeld = spielfeld;
    this.spalte = spalte;
    this.zeile = zeile;

    this.initialisieren();
}

// Setzt alle Spielinformationen auf den Grundzustand zurück.
Zelle.prototype.initialisieren = function () {
    this.istGesperrt = false;
    this.istGeprüft = false;
    this.istBeendet = false;
    this.istMine = false;

    this.nachPrüfung = null;
}

// Schaltet die Prüfsperre um.
Zelle.prototype.sperreUmschalten = function () {
    // Nicht möglich, wenn das Spiel beendet oder die Zelle bereits aufgedeckt wurde
    if (this.istBeendet)
        return;
    if (this.istGeprüft)
        return;

    this.istGesperrt = !this.istGesperrt;
}

// Deckt die Zelle aus und prüft dabei, ob eine Mine versteckt ist.
Zelle.prototype.prüfen = function () {
    // Nicht möglich, wenn das Spiel beendet, die Zelle bereitsaufgedeckt oder gesperrt wurde
    if (this.istBeendet)
        return;
    if (this.istGeprüft)
        return;
    if (this.istGesperrt)
        return;

    // Zelle optisch aufdecken
    this.alsGeprüftMarkieren();

    // Je nach Inhalt der Zelle an das Spielfeld melden
    if (this.istMine)
        this.spielfeld.verloren();
    else
        this.spielfeld.erfolgreichGeprüft();
}

// Beendet das Spiel.
Zelle.prototype.beenden = function () {
    this.istBeendet = true;

    // Alle Minen werden nun aufgedeckt
    if (this.istMine)
        this.alsGeprüftMarkieren();
}

// Markiert eine Zelle als aufgedeckt.
Zelle.prototype.alsGeprüftMarkieren = function () {
    // Die Zelle wurde bereits aufgedeckt
    if (this.istGeprüft)
        return;

    this.istGeprüft = true;

    // Benachrichtigung auf Wunsch einmalig auslösen und so die Anzeige bei Bedarf aktualisieren - letzteres ist nicht Aufgabe des Modells der Zelle!
    if (this.nachPrüfung !== null)
        this.nachPrüfung();
}
