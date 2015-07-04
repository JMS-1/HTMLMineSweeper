"use strict";

var ControllerHighScore = {
    connect: function (model, viewAlles, viewArt, viewSpieler, viewName, viewErgebnis, viewEintragen) {
        // Anzeige der Art
        viewArt.textContent = model.hoehe + ' Zeilen, ' + model.breite + ' Spalten, ' + model.minen + ' Minen';

        viewName.onkeyup = function () {
            if (this.value == '')
                viewEintragen.setAttribute('disabled', 'disabled');
            else
                viewEintragen.removeAttribute('disabled');
        }

        viewEintragen.onclick = function () {
            model.highScore.eintragen(viewName.value, model.ergebnis);

            viewAlles.style.display = 'none';
        }

        // Erstellt die Liste der Ergebnisse.
        function aktualisieren() {
            var html = '';

            model.highScore.spieler.forEach(function (spieler) {
                html += '<tr><td>' + spieler.name + '</td><td>' + spieler.zeit + 's</td></tr>';
            });

            viewSpieler.innerHTML = html;
        }

        // Sobald wir gewonnen haben entsprechend reagieren
        model.gewonnen = function () {
            var ergebnis = model.ergebnis;
            if (!model.highScore.istHighScore(ergebnis))
                return;

            viewErgebnis.textContent = ergebnis + 's';

            aktualisieren();

            viewAlles.style.display = '';
        };

        // Erstmalig aufbereiten
        aktualisieren();

        // Verstecken
        viewAlles.style.display = 'none';
    }
};