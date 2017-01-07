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
cKnooppunt.prototype.HTMLtekst = function() {
    var lTekst = '';
    var lLinks = '';
    for (var j = 1; j < this.Links.length; j++) {
        lLinks += ' ' + this.Links[j].Punt; 
        lLinks += ' (' + this.Links[j].Afstand + ')'; 
    }
    lTekst += 'Knooppunt ' + this.Punt;
    if (this.Bezocht) { lTekst += ' Bezocht'; } else {lTekst += ' Onbetreden';}
    lTekst += ' kost ' + this.Kosten;
    lTekst += ' kruimel ' + this.Kruimelpad;
    lTekst += ' en heeft ' + (this.Links.length - 1) + ' verbindingen:' + lLinks;
    return lTekst;
};
function dump(pTekst) {
    document.getElementById("uitvoer").innerHTML += '<br />' + pTekst;
}
function dumpKnooppunten(pPunten) {
  dump('Aantal knooppunten = ' + (pPunten.length - 1));
  for (var i = 1; i < pPunten.length; i++) { dump(pPunten[i].HTMLtekst()); }
}
function initNetwerk() {
    lNul = new cLink(0,0,0);
    lNetwerk =
    [ new cKnooppunt(0, [lNul])
    , new cKnooppunt(1, [lNul, new cLink(2,2,2), new cLink(3,4,4)])
    , new cKnooppunt(2, [lNul, new cLink(3,1,1), new cLink(4,4,4), new cLink(5,2,2)])
    , new cKnooppunt(3, [lNul, new cLink(5,3,3)])
    , new cKnooppunt(4, [lNul, new cLink(6,2,2)])
    , new cKnooppunt(5, [lNul, new cLink(4,3,3), new cLink(6,2,2)])
    , new cKnooppunt(6, [lNul])
    ];
    return lNetwerk;
}
//  http://mcc.id.au/2004/10/shortest-path-js.html
//  http://mcc.id.au/2004/10/dijkstra.js
function kortstePad(pKnooppunten, pBeginpunt) {
    var nPunten     = pKnooppunten.length;
    var lBezocht    = new Array(nPunten);
    var lKosten     = new Array(nPunten);
    var lKruimelpad = new Array(nPunten);
    for (i = 1; i < nPunten; i++) { lBezocht[i] = false;    } lBezocht[pBeginpunt] = true;
    for (i = 1; i < nPunten; i++) { lKosten [i] = Infinity; } lKosten [pBeginpunt] = 0;
    pKnooppunten[pBeginpunt].Bezocht = true;
    pKnooppunten[pBeginpunt].Kosten  = 0;
    for (var i = 1; i < pKnooppunten[pBeginpunt].Links.length; i++) {
        lPunt = pKnooppunten[pBeginpunt].Links[i].Punt;
        lKruimelpad[lPunt] = pBeginpunt;
        lKosten[lPunt] = pKnooppunten[pBeginpunt].Links[i].Afstand;
        pKnooppunten[lPunt].Kruimelpad   = pBeginpunt;
        pKnooppunten[lPunt].Kosten       = pKnooppunten[pBeginpunt].Links[i].Afstand;
    }
    // dumpKnooppunten(pKnooppunten);
    // dump('Bezocht = ' + lBezocht);
    // dump('Kosten  = ' + lKosten);
    // dump('Kruimelpad = ' + lKruimelpad);
    for (var i = 1; i <= nPunten - 1; i++) {
        dump('<hr>');
        dump(pKnooppunten[i].HTMLtekst());
        var lNabijpunt = -1;
        var lNabijkosten = Infinity;
        for (var j = 1; j < nPunten; j++) {
            // dump('Nabij ? ' + lBezocht[j] + j + lKosten[j] + lNabijpunt + lNabijkosten);
            if (!lBezocht[j] && lKosten[j] < lNabijkosten) {
                lNabijkosten = lKosten[j];
                lNabijpunt = j;
            }
        }
        dump('Dichtsbijzijnd ' + lNabijpunt + ' (' + lNabijkosten + ')');
        if (lNabijpunt > 0) {
            lBezocht[lNabijpunt] = true;
            pKnooppunten[lNabijpunt].Bezocht = true;
            for (var j = 1; j < pKnooppunten[lNabijpunt].Links.length; j++) {
                lPunt = pKnooppunten[lNabijpunt].Links[j].Punt;
                if (!lBezocht[lPunt]) {
                    var lGoedkoper = lKosten[lNabijpunt] + pKnooppunten[lNabijpunt].Links[j].Afstand;
                    if (lKosten[lPunt] > lGoedkoper) {
                        lKosten[lPunt] = lGoedkoper;
                        lKruimelpad[lPunt] = lNabijpunt;
                        pKnooppunten[lPunt].Kruimelpad = lNabijpunt;
                        pKnooppunten[lPunt].Kosten     = lGoedkoper;
                    }
                }
            }
        }
        dumpKnooppunten(pKnooppunten);
        dump('Bezocht = ' + lBezocht);
        dump('Kosten  = ' + lKosten);
        dump('Kruimelpad = ' + lKruimelpad);
    }
    return  { "Beginpunt" : pBeginpunt
            , "Kosten"    : lKosten
            , "Kruimelpad": lKruimelpad
            };
}
function constructPath(shortestPathInfo, endVertex) {
  var path = [];
  while (endVertex != shortestPathInfo.Beginpunt) {
    path.unshift(endVertex);
    endVertex = shortestPathInfo.Kruimelpad[endVertex];
  }
  path.unshift(endVertex);
  return path;
}
function voorbeeldKortstePad() {
    document.getElementById("uitvoer").innerHTML = '';
    var shortestPathInfo = kortstePad(initNetwerk(), 1);
    document.getElementById("resultaat").innerHTML = shortestPathInfo;
    dump(shortestPathInfo.Beginpunt);
    dump(shortestPathInfo.Kosten);
    dump(shortestPathInfo.Kruimelpad);
    var path1to6 = constructPath(shortestPathInfo, 6);
    // dump(path1to6);
    document.getElementById("resultaat").innerHTML = path1to6;
}
