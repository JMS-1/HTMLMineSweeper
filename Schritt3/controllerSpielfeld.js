"use strict";

var ControllerSpielfeld = {
    connect: function (model, view) {
        var html = '';

        for (var zeile = 0; zeile < model.hoehe; zeile++) {
            html += '<div>';

            for (var spalte = 0; spalte < model.breite ; spalte++)
                html += '<div class="spielfeldZelle"></div>';

            html += '</div>';
        }

        view.innerHTML = html;

        var zellen = view.querySelectorAll('.spielfeldZelle');

        for (var zs = 0; zs < zellen.length; zs++)
            ControllerZelle.connect(model.zellen[zs], zellen[zs]);

        model.fertig = function (gewonnen) {
            alert(gewonnen ? "GEWONNEN" : "VERLOREN");
        };

        model.freiesFeldSuchen();
    },
};