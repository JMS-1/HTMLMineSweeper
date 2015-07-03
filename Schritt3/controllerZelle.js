"use strict";

var ControllerZelle = {
    connect: function (model, view) {

        var minen = model.spielfeld.minenZählen(model);

        view.innerHTML = '<div>' + ((minen > 0) ? minen : '') + '</div>';

        if (model.istMine)
            view.setAttribute('data-mine', 'ja');

        view.oncontextmenu = function (ev) {
            return false;
        };

        view.onmouseup = function (ev) {
            if (ev.button !== 2)
                return;

            ev.preventDefault();
            ev.stopPropagation();

            var warGesperrt = model.istGesperrt;

            model.sperreUmschalten();

            if (model.istGesperrt !== warGesperrt)
                view.setAttribute('data-gesperrt', model.istGesperrt ? 'ja' : 'nein');
        };

        view.onclick = function () {
            model.prüfen();
        };

        model.nachPrüfung = function () {
            view.setAttribute('data-getestet', 'ja');
        };
    },
};