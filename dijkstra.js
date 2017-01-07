function cLink(pEindpunt, pAfstand, pTijd) {
    this.Punt    = pEindpunt;
    this.Afstand = pAfstand;
    this.Tijd    = pTijd;
}
function cKnooppunt(pPuntnummer, pLinks) {
    this.Punt       = pPuntnummer;
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
    for (var i = 0; i < pPunten.length; i++) { lTekst += pPunten[i].HTMLtableRow(6); }
    lTekst += '</table>';
    document.getElementById("knooppunten").innerHTML = lTekst;
    // dump(lTekst);
}
function initNetwerk() {
    lNetwerk =
    [ new cKnooppunt(0, [new cLink(1,2,2), new cLink(2,4,4)])
    , new cKnooppunt(1, [new cLink(2,1,1), new cLink(3,4,4), new cLink(4,2,2)])
    , new cKnooppunt(2, [new cLink(4,3,3)])
    , new cKnooppunt(3, [new cLink(5,2,2)])
    , new cKnooppunt(4, [new cLink(3,3,3), new cLink(5,2,2)])
    , new cKnooppunt(5, [])
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
    while (!lGevonden && nBezocht < nPunten && nIteraties++ < 8) {
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
    var shortestPathInfo = kortstePad(lKnooppunten, 0, 5);
    dumpKnooppunten(lKnooppunten);
    document.getElementById("resultaat").innerHTML = gevolgdeWeg(lKnooppunten, 0, 5);
}
