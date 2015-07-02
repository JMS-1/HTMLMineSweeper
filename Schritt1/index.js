function starten() {
    var spielfelder = document.querySelectorAll('.mineSweeper');

    for (var i = 0; i < spielfelder.length; i++)
        spielfeldVorbereiten(spielfelder[i]);
}

function spielfeldVorbereiten(spielfeld) {
    var breite = parseInt(spielfeld.getAttribute('data-breite'));
    var hoehe = parseInt(spielfeld.getAttribute('data-hoehe'));
    var minen = parseInt(spielfeld.getAttribute('data-minen'));

    var html = '';
    for (var zeile = 0; zeile < hoehe; zeile++) {
        html += '<div>';

        for (var spalte = 0; spalte < breite; spalte++) {
            html += '<div></div>';
        }

        html += '</div>';
    }

    spielfeld.innerHTML = html;

    var felder = [];
    var offen = breite * hoehe - minen;

    for (var zeile = 0; zeile < spielfeld.childNodes.length; zeile++)
        for (var spalte = 0; spalte < spielfeld.childNodes[zeile].childNodes.length; spalte++) {
            var feld = spielfeld.childNodes[zeile].childNodes[spalte];

            feld.spieldaten = {
                spalte: spalte,
                zeile: zeile,
                mine: false,
                minen: 0,
            };

            feld.oncontextmenu = function (ev) {
                return false;
            };

            feld.onmouseup = function (ev) {
                if (ev.button !== 2)
                    return;

                ev.preventDefault();
                ev.stopPropagation();

                if (offen < 1)
                    return;
                if (this.getAttribute('data-getestet') !== null)
                    return;

                if (this.getAttribute('data-gesperrt') !== null)
                    this.removeAttribute('data-gesperrt');
                else
                    this.setAttribute('data-gesperrt', 'ja');
            };

            feld.onclick = function () {
                if (offen < 1)
                    return;
                if (this.getAttribute('data-getestet') !== null)
                    return;
                if (this.getAttribute('data-gesperrt') !== null)
                    return;

                this.setAttribute('data-getestet', 'ja');

                var daten = this.spieldaten;
                if (daten.mine)
                    offen = -1;
                else {
                    offen--;

                    if (daten.minen > 0)
                        this.innerHTML = daten.minen;
                }

                if (offen > 0)
                    return;

                felder.forEach(function (feld) {
                    if (feld.spieldaten.mine)
                        feld.setAttribute('data-getestet', 'ja');
                });

                alert((offen == 0) ? 'GEWONNEN' : 'VERLOREN');
            };

            felder.push(feld);
        }

    for (var zuVerstecken = minen; zuVerstecken > 0;) {
        var feld = felder[Math.floor(Math.random() * felder.length)];
        if (feld.getAttribute('data-inhalt') !== null)
            continue;

        zuVerstecken--;

        feld.setAttribute('data-inhalt', 'mine');

        var daten = feld.spieldaten;

        daten.mine = true;

        for (var zeile = daten.zeile - 1; zeile <= daten.zeile + 1; zeile++)
            if ((zeile >= 0) && (zeile < hoehe))
                for (var spalte = daten.spalte - 1; spalte <= daten.spalte + 1; spalte++)
                    if ((spalte >= 0) && (spalte < breite))
                        felder[zeile * breite + spalte].spieldaten.minen += 1;
    }

    for (; ;) {
        var feld = felder[Math.floor(Math.random() * felder.length)];
        if (feld.spieldaten.mine)
            continue;

        feld.click();

        break;
    }
}

