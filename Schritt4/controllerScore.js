"use strict";

var ControllerHighScore = {
    connect: function (model, viewAlles, viewArt, viewSpieler, viewName, viewErgebnis, viewEintragen) {
        var spielfeld = model.spielfeld;

        // Anzeige der Art
        viewArt.textContent = spielfeld.hoehe + ' Zeilen, ' + spielfeld.breite + ' Spalten,' + spielfeld.minen + ' Minen';

        viewName.onkeyup = function () {
            if (this.value == '')
                viewEintragen.setAttribute('disabled', 'disabled');
            else
                viewEintragen.removeAttribute('disabled');
        }

        viewEintragen.onclick = function () {
            model.eintragen(viewName.value, spielfeld.ergebnis);

            viewAlles.style.display = 'none';
        }

        // Sobald wir gewonnen haben entsprechend reagieren
        spielfeld.gewonnen = function () {
            var ergebnis = spielfeld.ergebnis;
            if (!model.istHighScore(ergebnis))
                return;

            var html = '';

            model.spieler.forEach(function (spieler) {
                html += '<tr><td>' + spieler.name + '</td><td>' + spieler.zeit + 's</td></tr>';
            });

            viewSpieler.innerHTML = html;
            viewErgebnis.textContent = ergebnis + 's';

            viewAlles.style.display = '';
        };

        // Verstecken
        viewAlles.style.display = 'none';
    }
};