function cLink( pEind, pAfstand) {
    this.punt    = pEind;
    this.afstand = pAfstand;
}
function cKnooppunt(pPuntnummer, pLinks) {
    this.punt  = pPuntnummer;
    this.links = pLinks;    
}
function initNetwerk() {
    lNetwerk   = [new cKnooppunt(0, [])];
    lNetwerk.push(new cKnooppunt(1, [new cLink(2,2), new cLink(3,4)                 ]));
    lNetwerk.push(new cKnooppunt(2, [new cLink(3,1), new cLink(4,4), new cLink(5,2) ]));
    lNetwerk.push(new cKnooppunt(3, [new cLink(5,3)                                 ]));
    lNetwerk.push(new cKnooppunt(4, [new cLink(6,2)                                 ]));
    lNetwerk.push(new cKnooppunt(5, [new cLink(4,3), new cLink(6,2)                 ]));
    lNetwerk.push(new cKnooppunt(6, [                                               ]));
    return lNetwerk;
}
function kortsteWeg(pBegin, pEind) {
    lNetwerk = initNetwerk();
    lPunten = [new cLink(0,0)];
    for (iKnooppunt = 1; iKnooppunt < lNetwerk.length; iKnooppunt++) {
        if (lNetwerk[iKnooppunt].punt = pBegin) {lAfstand = 0} else {lAfstand = 32767}
        lPunten.push(new cLink(lNetwerk[iKnooppunt].punt,lAfstand));
    }    
    lBezocht    = [new cLink(0,0)];
    lRestpunten = [new cLink(0,32767)];
    for (iPunt = 1; iPunt < lPunten.length; iPunt++) { lRestpunten.push(lPunten[iPunt]); }
    while (lRestpunten.length > 1) {
        //  Zoek restpunt met kleinste afstand            
        iRestpunt = 0;
        for (iPunt = 1; iPunt < lRestpunten.length; iPunt++)
            { if (lRestpunten[iRestpunt].afstand > lRestpunten[iPunt].afstand) {iRestpunt = iPunt;}}
        lBezocht.push(lPunten[iRestpunt]);
    }
    for (iKnooppunt = 1; iKnooppunt < lNetwerk.length; iKnooppunt++) {

}
function printNetwerk() {
    lNetwerk = initNetwerk();
    lHTML = '<hr><h2>Netwerk</h2>';
    for (iKnooppunt = 1; iKnooppunt < lNetwerk.length; iKnooppunt++) {
        lHTML += '<br />' + lNetwerk[iKnooppunt].punt;
        lHTML += ' [' + lNetwerk[iKnooppunt].links.length + ']: ';
        for (iLink = 0; iLink < lNetwerk[iKnooppunt].links.length; iLink++) {
            lHTML += lNetwerk[iKnooppunt].links[iLink].punt + '(' + lNetwerk[iKnooppunt].links[iLink].afstand + ') ';
        }
    }
    document.getElementById("netwerk").innerHTML = lHTML;     
}
