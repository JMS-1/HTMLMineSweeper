var ControllerZelle = {
    connect: function (model, view) {

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

        model.wirdMine = function () {
            view.setAttribute('data-mine', 'ja');
        }

        model.minenAnzeigen = function (minen) {
            if (minen > 0)
                view.innerHTML = minen;
        }
    },
};