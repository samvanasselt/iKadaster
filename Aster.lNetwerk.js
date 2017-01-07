    var lNetwerk;
function cLink(pEindpunt, pAfstand, pTijd) {
    this.Punt    = pEindpunt;
    this.Afstand = pAfstand;
    this.Tijd    = pTijd;
}
function cKnooppunt(pPuntnummer, pX, pY, pLinks) {
    this.Punt       = pPuntnummer;
    this.X          = pX;
    this.Y          = pY;
    this.Links      = pLinks;
    this.Bezocht    = false;
    this.Kosten     = Infinity;
    this.Kruimelpad = -1;
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
    if (this.Bezocht) { lTekst += '<td>Bezocht</td>'; } else {lTekst += '<td>Onbetreden</td>';}
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
    lTekst += '<tr><th>Knooppunt</th><th>Bezocht</th><th>Kosten</th><th>Kruimelpad</th><th>heeft</th><th>Links</th></tr>';
    for (var i = 0; i < pPunten.length; i++) { lTekst += pPunten[i].HTMLtableRow(16); }
    lTekst += '</table>';
    document.getElementById("knooppunten").innerHTML = lTekst;
    // dump(lTekst);
}
function initNetwerk() {
    lNetwerk =
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
    return lNetwerk;
}
//  http://mcc.id.au/2004/10/shortest-path-js.html
//  http://mcc.id.au/2004/10/dijkstra.js
function kortstePad(pKnooppunten, pBeginpunt, pEindpunt) {
    var lGevonden = false;
    var nPunten = pKnooppunten.length;
    var nBezocht = 0;
    pKnooppunten[pBeginpunt].Kosten  = 0;
    var nIteraties = 0;
    while (!lGevonden && nBezocht < nPunten && nIteraties++ < 100) {
        dumpKnooppunten(pKnooppunten);
        var lNabijpunt = -1;
        var lNabijkosten = Infinity;
        for (var j = 0; j < nPunten; j++) {
            if (!pKnooppunten[j].Bezocht && pKnooppunten[j].Kosten < lNabijkosten) {
                lNabijkosten = pKnooppunten[j].Kosten;
                lNabijpunt = j;
            }
        }
        dump('Iteratie ' + nIteraties + '. Dichtsbijzijnd ' + lNabijpunt + ' (' + lNabijkosten + ')');
        if (lNabijpunt >= 0) {
            pKnooppunten[lNabijpunt].Bezocht = true;
            nBezocht++;
            for (var j = 0; j < pKnooppunten[lNabijpunt].Links.length; j++) {
                lPunt = pKnooppunten[lNabijpunt].Links[j].Punt;
                if (!pKnooppunten[lPunt].Bezocht) {
                    var lGoedkoper = pKnooppunten[lNabijpunt].Kosten + pKnooppunten[lNabijpunt].Links[j].Afstand;
                    if (pKnooppunten[lPunt].Kosten > lGoedkoper) {
                        pKnooppunten[lPunt].Kosten = lGoedkoper;
                        pKnooppunten[lPunt].Kruimelpad = lNabijpunt;
                    }
                }
                lGevonden = lGevonden || (lPunt == pEindpunt);
            }
        }
    }
}
function gevolgdeWeg(pKnooppunten, pBeginpunt, pEindpunt) {
    var lTekst = pEindpunt;
    lPunt = pEindpunt;
    while (lPunt != pBeginpunt) {
        lPunt = pKnooppunten[lPunt].Kruimelpad;
        lTekst = lPunt + ' - ' + lTekst;
    }
    return lTekst;
}
function voorbeeldKortstePad() {
    document.getElementById("uitvoer").innerHTML = '';
    lKnooppunten = initNetwerk();
    var shortestPathInfo = kortstePad(lKnooppunten, 5, 15);
    dumpKnooppunten(lKnooppunten);
    document.getElementById("resultaat").innerHTML = gevolgdeWeg(lKnooppunten, 5, 15);
}
