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

    for (var zeile = 0; zeile < spielfeld.childNodes.length; zeile++)
        for (var spalte = 0; spalte < spielfeld.childNodes[zeile].childNodes.length; spalte++) {
            var feld = spielfeld.childNodes[zeile].childNodes[spalte];

            feld.spieldaten = {
                spalte: spalte,
                zeile: zeile,
                minen: 0,
            };

            feld.onclick = function () {
                this.innerHTML = this.spieldaten.minen;
                this.setAttribute('data-getestet', 'ja');
            }

            felder.push(feld);
        }

    for (var zuVerstecken = minen; zuVerstecken > 0;) {
        var feld = felder[Math.floor(Math.random() * felder.length)];
        if (feld.getAttribute('data-inhalt') !== null)
            continue;

        zuVerstecken--;

        feld.setAttribute('data-inhalt', 'mine');

        var daten = feld.spieldaten;

        for (var zeile = daten.zeile - 1; zeile <= daten.zeile + 1; zeile++)
            if ((zeile >= 0) && (zeile < hoehe))
                for (var spalte = daten.spalte - 1; spalte <= daten.spalte + 1; spalte++)
                    if ((spalte >= 0) && (spalte < breite))
                        felder[zeile * breite + spalte].spieldaten.minen += 1;
    }
}

