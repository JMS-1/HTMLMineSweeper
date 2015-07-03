"use strict";

var ControllerZustand = {
    aktiv: undefined,

    connect: function (model, viewZeit) {
        window.clearTimeout(ControllerZustand.aktiv);

        function zeitAktualisieren() {
            var ergebnis = model.ergebnis;
            if (ergebnis !== undefined) {
                viewZeit.innerHTML = ergebnis;
            }
            else {
                viewZeit.innerHTML = Math.round(model.spielzeit());

                ControllerZustand.aktiv = window.setTimeout(zeitAktualisieren, 100);
            }
        };

        zeitAktualisieren();
    }
};