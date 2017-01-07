    var gKnooppunten;
function cLink(pEindpunt, pAfstand, pTijd) {
    this.Punt    = pEindpunt;
    this.Afstand = pAfstand;
    this.Tijd    = pTijd;
}
function cKnooppunt(pPuntnummer, pX, pY, pLinks) {
    this.Punt        = pPuntnummer;
    this.X           = pX;
    this.Y           = pY;
    this.Links       = pLinks;
    this.Bezocht     = false;
    this.Onderzoeken = true;
    this.Kosten      = Infinity;
    this.Kruimelpad  = -1;
}
cKnooppunt.prototype.HTMLtableRow = function(nPunten) {
    var lTekst = '';
    var lLinks = '';
    for (var j = 0; j < this.Links.length; j++) {
        lLinks += ' ' + this.Links[j].Punt; 
        lLinks += ' (' + this.Links[j].Afstand + ')'; 
    }
    lTekst += '<tr>';
    lTekst += '<td>' + this.Punt + '</td>';
    lTekst += '<td>' + this.X + '</td>';
    lTekst += '<td>' + this.Y + '</td>';
    if (this.Onderzoeken) { lTekst += '<td>Onbekend</td>'; } else {lTekst += '<td>Onderzocht</td>';}
    if (this.Bezocht    ) { lTekst += '<td>Bezocht</td>' ; } else {lTekst += '<td>Onbetreden</td>';}
    lTekst += '<td>' + this.Kosten + '</td>';
    lTekst += '<td>' + this.Kruimelpad + '</td>';
    lTekst += '<td>' + this.Links.length + '</td>';
    lTekst += '<td>' + lLinks + '</td>';
    lTekst += '</tr>';
    return lTekst;
};
function dump(pTekst) {
    document.getElementById("uitvoer").innerHTML += '<br />' + pTekst;
}
function dumpKnooppunten(pPunten) {
    var lTekst = 'Aantal knooppunten = ' + pPunten.length;
    lTekst += '<table>';
    lTekst += '<tr><th>Knooppunt</th><th>X</th><th>Y</th><th>Onderzoeken</th><th>Bezocht</th><th>Kosten</th><th>Kruimelpad</th><th>heeft</th><th>Links</th></tr>';
    for (var i = 0; i < pPunten.length; i++) { lTekst += pPunten[i].HTMLtableRow(16); }
    lTekst += '</table>';
    document.getElementById("knooppunten").innerHTML = lTekst;
    // dump(lTekst);
}
function initNetwerk() {
    gKnooppunten =
    [ new cKnooppunt( 0, 0,0, [                                      new cLink( 1,1,1), new cLink( 4,1,1)])
    , new cKnooppunt( 1, 1,0, [                   new cLink( 0,1,1), new cLink( 2,1,1), new cLink( 5,1,1)])
    , new cKnooppunt( 2, 2,0, [                   new cLink( 1,1,1), new cLink( 3,1,1), new cLink( 6,1,1)])
    , new cKnooppunt( 3, 3,0, [                   new cLink( 2,1,1),                    new cLink( 7,1,1)])
    , new cKnooppunt( 4, 0,1, [new cLink( 0,1,1),                    new cLink( 5,1,1), new cLink( 8,1,1)])
    , new cKnooppunt( 5, 1,1, [new cLink( 1,1,1), new cLink( 4,1,1), new cLink( 6,1,1), new cLink( 9,1,1)])
    , new cKnooppunt( 6, 2,1, [new cLink( 2,1,1), new cLink( 5,1,1), new cLink( 7,1,1), new cLink(10,1,1)])
    , new cKnooppunt( 7, 3,1, [new cLink( 3,1,1), new cLink( 6,1,1),                    new cLink(11,1,1)])
    , new cKnooppunt( 8, 0,2, [new cLink( 4,1,1),                    new cLink( 9,1,1), new cLink(12,1,1)])
    , new cKnooppunt( 9, 1,2, [new cLink( 5,1,1), new cLink( 8,1,1), new cLink(10,1,1), new cLink(13,1,1)])
    , new cKnooppunt(10, 2,2, [new cLink( 6,1,1), new cLink( 9,1,1), new cLink(11,1,1), new cLink(14,1,1)])
    , new cKnooppunt(11, 3,2, [new cLink( 7,1,1), new cLink(10,1,1),                    new cLink(15,1,1)])
    , new cKnooppunt(12, 0,3, [new cLink( 8,1,1),                    new cLink(13,1,1)                   ])
    , new cKnooppunt(13, 1,3, [new cLink( 9,1,1), new cLink(12,1,1), new cLink(14,1,1)                   ])
    , new cKnooppunt(14, 2,3, [new cLink(10,1,1), new cLink(13,1,1), new cLink(15,1,1)                   ])
    , new cKnooppunt(15, 3,3, [new cLink(11,1,1), new cLink(14,1,1),                                     ])
    ];
}
//  http://mcc.id.au/2004/10/shortest-path-js.html
//  http://mcc.id.au/2004/10/dijkstra.js
//  http://www.w3schools.com/jsref/jsref_obj_array.asp
function kortstePad(pBeginpunt, pEindpunt) {
    var lOnderzoeken = [];
    var lGevonden = false;
    var nPunten = gKnooppunten.length;
    var nBezocht = 0;
    var nIteraties = 0;
    gKnooppunten[pBeginpunt].Kosten = 0;
    lOnderzoeken.push(pBeginpunt);
    while (!lGevonden && lOnderzoeken.length > 0 && nBezocht < nPunten && nIteraties++ < 15) {
        dumpKnooppunten(gKnooppunten);
        var lNabijIndex = -1;
        var lNabijPunt = -1;
        var lNabijKosten = Infinity;
        for (var j = 0; j < lOnderzoeken.length; j++) {
            lPunt = lOnderzoeken[j];
            if (!gKnooppunten[lPunt].Bezocht) {
                if (lNabijKosten > gKnooppunten[lPunt].Kosten) {
                    lNabijKosten = gKnooppunten[lPunt].Kosten;
                    lNabijIndex = j;
                    lNabijPunt = lPunt;
        }   }   }
        dump('Iteratie ' + nIteraties + '. Dichtsbijzijnd ' + lOnderzoeken[lNabijIndex] + ' (' + lNabijKosten + ')');
        alert(89);
        if (lNabijPunt >= 0) {
            gKnooppunten[lNabijPunt].Onderzoeken = false;
            gKnooppunten[lNabijPunt].Bezocht = true;
            nBezocht++;
            for (var j = 0; j < gKnooppunten[lNabijPunt].Links.length; j++) {
                var lPunt = gKnooppunten[lNabijPunt].Links[j].Punt;
                var dX = Math.abs(gKnooppunten[pEindpunt].X - gKnooppunten[lPunt].X);
                var dY = Math.abs(gKnooppunten[pEindpunt].Y - gKnooppunten[lPunt].Y);
                // alert('dX = ' + dX + '  dY = ' + dY);
                var lKosten = gKnooppunten[lNabijPunt].Kosten + 10 * gKnooppunten[lNabijPunt].Links[j].Afstand + 4 * (dX + dY);
                // var lPuntIndex = lOnderzoeken.IndexOf(lPunt);
                var lPuntIndex = -1;
                for (var k = 0; k < lOnderzoeken.length; k++) {
                    if (lOnderzoeken[k] == lPunt) {lPuntIndex = k;}
                }
                if (lPuntIndex >= 0) {
                    //  Punt zit al in te onderzoeken set
                    //  Verwijder het punt uit de te onderzoeken set als het nieuwe pad beter is
                    if (lKosten < gKnooppunten[lPunt].Kosten) {
                        lOnderzoeken.splice(lPuntIndex, 1);
                        alert(110);
                    }
                } 
                else if (gKnooppunten[lPunt].Bezocht) {
                    if (lKosten < gKnooppunten[lPunt].Kosten) {
                        //  Punt is al bezocht, maar duurder. Met een goede heuristiek mag dit niet voorkomen
                        alert(116);
                    }
                } else {
                    //  Punt is nog niet bezocht en zit niet in de ondezoeksset
                    gKnooppunten[lPunt].Kosten = lKosten;
                    gKnooppunten[lPunt].Onderzocht = true;
                    gKnooppunten[lPunt].Kruimelpad = lNabijPunt;
                    lOnderzoeken.push(lPunt);
                }
                lGevonden = lGevonden || (lPunt == pEindpunt);
            }
            dump(lOnderzoeken);
        }
    }
}
function gevolgdeWeg(pBeginpunt, pEindpunt) {
    var lTekst = pEindpunt;
    lPunt = pEindpunt;
    while (lPunt != pBeginpunt) {
        lPunt = gKnooppunten[lPunt].Kruimelpad;
        lTekst = lPunt + ' - ' + lTekst;
    }
    return lTekst;
}
function voorbeeldKortstePad() {
    document.getElementById("uitvoer").innerHTML = '';
    initNetwerk();
    var shortestPathInfo = kortstePad(5, 15);
    dumpKnooppunten(gKnooppunten);
    document.getElementById("resultaat").innerHTML = gevolgdeWeg(5, 15);
}
