//  http://gojs.net/latest/samples/index.html
//  Timed functions    
    var fKortstePadIteratie;
//  Globals
    var gKnooppunten;
    var pOnderzoeken;
    var gBeginpunt;
    var gEindpunt;    
    var gWeegfactor;
    var gInteraties;
    var gGevonden;
    var xMax = 10;
    var yMax = 10;
    var xScale = 10;
    var yScale = 10;
    var ctx;      
//
function cLink(pEindpunt, pAfstand, pTijd) {
    this.Punt    = pEindpunt;
    this.Afstand = pAfstand;
    this.Tijd    = pTijd;
}
cLink.prototype.Kosten = function () {
    return this.Afstand;
}
function cKnooppunt(pPuntnummer, pX, pY, pZwaarte) {
    this.Punt        = pPuntnummer;
    this.X           = pX;
    this.Y           = pY;
    this.Zwaarte     = pZwaarte;
    this.Links       = [];
    this.Bezocht     = false;
    this.Onderzoeken = true;
    this.Rang        = Infinity;
    this.Kosten      = Infinity;
    this.Kruimelpad  = -1;
}
cKnooppunt.prototype.kleurVeld = function (pKleur) {
    var canvas = document.getElementById('canvasAster');
    if (canvas.getContext){
        ctx = canvas.getContext('2d');
        ctx.fillStyle = pKleur;
        ctx.fillRect (xScale * this.X, yScale * this.Y, xScale, yScale);
    }
};
cKnooppunt.prototype.tekstVeld = function (pTekst) {
    ctx.fillText(pTekst, 10 * this.X + 3, 10 * this.Y + 6);
};
cKnooppunt.prototype.veldBezocht    = function() { this.kleurVeld("rgba(223,0,0,0.5)"); };
cKnooppunt.prototype.veldKruimelpad = function() { this.kleurVeld("rgba(0,195,0,0.5)"); };
cKnooppunt.prototype.HTMLtableRow = function() {
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
    lTekst += '<td>' + this.Zwaarte + '</td>';
    if (this.Onderzoeken) { lTekst += '<td>Onbekend</td>';  } 
    else                  { lTekst += '<td>Onderzocht</td>';}
    if (this.Bezocht    ) { lTekst += '<td>Bezocht</td>' ;  }
    else                  { lTekst += '<td>Onbetreden</td>';}
    lTekst += '<td>' + this.Rang + '</td>';
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
    var HTMLknooppuntTabelHeader = ['Knooppunt', 'X', 'Y', 'Zwaarte', 'Onderzoeken', 'Bezocht', 'Rang', 'Kosten', 'Kruimelpad', 'heeft', 'Links'];
function dumpKnooppunten(pPunten) {
    var lTekst = 'Aantal knooppunten = ' + gKnooppunten.length;
    lTekst += '<table><tr>';
    for (i = 0; i < HTMLknooppuntTabelHeader.length; i++) { lTekst += '<th>' + HTMLknooppuntTabelHeader[i] + '</th>'; }
    for (var i = 0; i < gKnooppunten.length; i++) { lTekst += gKnooppunten[i].HTMLtableRow(); }
    lTekst += '</tr></table>';
    document.getElementById("knooppunten").innerHTML = lTekst;
    // dump(lTekst);
}
function knooppuntID(pX,pY) { return pX + yMax * pY; }
function initCanvas() {
    var canvas = document.getElementById('canvasAster');
    if (canvas.getContext){
        ctx = canvas.getContext('2d');
        ctx.scale(4, 4);
        var w = 10;
        var h = 10;
        var dx = 0;
        ctx.font="3px Verdana";
        ctx.fillStyle = "rgb(223,223,223)";
        ctx.fillRect (0,0,100,100);
        ctx.fillStyle = "rgb(195,195,195)";
        try { for (var y = 0; y < 100; y += 10) {
            for (var x = 0; x < 100; x += 20) {
                dx = y % 20;
                ctx.fillRect (x + dx,y,w,h);
        }}}   
        catch(err) { alert(err);}
    }
}
function initNetwerk() {
    // gKnooppunten =
    // [ new cKnooppunt( 0, 0,0, [                                      new cLink( 1,1,1), new cLink( 4,1,1)])
    // , new cKnooppunt( 1, 1,0, [                   new cLink( 0,1,1), new cLink( 2,1,1), new cLink( 5,1,1)])
    // , new cKnooppunt( 2, 2,0, [                   new cLink( 1,1,1), new cLink( 3,1,1), new cLink( 6,1,1)])
    // , new cKnooppunt( 3, 3,0, [                   new cLink( 2,1,1),                    new cLink( 7,1,1)])
    // , new cKnooppunt( 4, 0,1, [new cLink( 0,1,1),                    new cLink( 5,1,1), new cLink( 8,1,1)])
    // , new cKnooppunt( 5, 1,1, [new cLink( 1,1,1), new cLink( 4,1,1), new cLink( 6,1,1), new cLink( 9,1,1)])
    // , new cKnooppunt( 6, 2,1, [new cLink( 2,1,1), new cLink( 5,1,1), new cLink( 7,1,1), new cLink(10,1,1)])
    // , new cKnooppunt( 7, 3,1, [new cLink( 3,1,1), new cLink( 6,1,1),                    new cLink(11,1,1)])
    // , new cKnooppunt( 8, 0,2, [new cLink( 4,1,1),                    new cLink( 9,1,1), new cLink(12,1,1)])
    // , new cKnooppunt( 9, 1,2, [new cLink( 5,1,1), new cLink( 8,1,1), new cLink(10,1,1), new cLink(13,1,1)])
    // , new cKnooppunt(10, 2,2, [new cLink( 6,1,1), new cLink( 9,1,1), new cLink(11,1,1), new cLink(14,1,1)])
    // , new cKnooppunt(11, 3,2, [new cLink( 7,1,1), new cLink(10,1,1),                    new cLink(15,1,1)])
    // , new cKnooppunt(12, 0,3, [new cLink( 8,1,1),                    new cLink(13,1,1)                   ])
    // , new cKnooppunt(13, 1,3, [new cLink( 9,1,1), new cLink(12,1,1), new cLink(14,1,1)                   ])
    // , new cKnooppunt(14, 2,3, [new cLink(10,1,1), new cLink(13,1,1), new cLink(15,1,1)                   ])
    // , new cKnooppunt(15, 3,3, [new cLink(11,1,1), new cLink(14,1,1),                                     ])
    // ];
    gKnooppunten = [];
    try {
        for (var y = 0; y < 10; y++) {
            for (var x = 0; x < 10; x++) {
                // var lLinks = [];
                // if (x > 0) { lLinks.push(new cLink(knooppuntID(x-1,y),10,10)); }
                // if (x < 9) { lLinks.push(new cLink(knooppuntID(x+1,y),10,10)); }
                // if (y > 0) { lLinks.push(new cLink(knooppuntID(x,y-1),10,10)); }
                // if (y < 9) { lLinks.push(new cLink(knooppuntID(x,y+1),10,10)); }
                // var lZwaarte = 51 - (x-5) * (x-5) - (y - 5) * (y - 5);
                // var lZwaarte = 51 - 5 * Math.pow((x % 4) - 2, 2) - 5 * Math.pow((y % 4) - 2, 2);
                if (x < 5 && y < 5) { lZwaarte = Math.pow(2 - x, 2) + Math.pow(2 - y, 2); }
                else if (x < 5)     { lZwaarte = Math.pow(2 - x, 2) + Math.pow(7 - y, 2); }
                else if (y < 5)     { lZwaarte = Math.pow(7 - x, 2) + Math.pow(2 - y, 2); }
                else                { lZwaarte = Math.pow(7 - x, 2) + Math.pow(7 - y, 2); }
                lZwaarte = 50 - 5 * lZwaarte;
                if (x == 3 && y == 6) { lZwaarte = 55; }
                if (x == 6 && y == 3) { lZwaarte = 55; }
                if (x == 4 && y == 5) { lZwaarte = 60; }
                if (x == 5 && y == 4) { lZwaarte = 60; }
                if (x == 4 && y == 4) { lZwaarte = 30; }
                if (x == 5 && y == 5) { lZwaarte = 30; }

                if (2 < x && 2 < y && x < 7 && y < 7) { lZwaarte = 55; }
                if (3 < x && 3 < y && x < 6 && y < 6) { lZwaarte = 60; }
                
                gKnooppunten.push(new cKnooppunt(knooppuntID(x,y),x,y,lZwaarte));   
                var lGrijs = 255 - 4 * lZwaarte;
                var lKleur = lGrijs;
                for (var i = 1; i < 3; i++) {lKleur += ',' + lGrijs;}
                // kleurVeld(x,y,'rgb(' + lKleur + ')');
                gKnooppunten[gKnooppunten.length - 1].kleurVeld('rgb(' + lKleur + ')');
                ctx.fillStyle = 'rgb(127,127,255)';
                gKnooppunten[gKnooppunten.length - 1].tekstVeld(gKnooppunten[gKnooppunten.length - 1].Zwaarte);
        }}   
    }
    catch(err) {alert(err);}
    // dumpKnooppunten();
}
//  http://mcc.id.au/2004/10/shortest-path-js.html
//  http://mcc.id.au/2004/10/dijkstra.js
//  http://www.w3schools.com/jsref/jsref_obj_array.asp
function onderzoekPunt(pX,pY,pNabijPunt) {
    var lPunt = knooppuntID(pX,pY);
    var lKosten = gKnooppunten[pNabijPunt].Kosten + gKnooppunten[lPunt].Zwaarte;
    // var lPuntIndex = pOnderzoeken.IndexOf(lPunt);
    var lPuntIndex = -1;
    for (var k = 0; k < pOnderzoeken.length; k++) {
        if (pOnderzoeken[k] == lPunt) {lPuntIndex = k;}
    }
    if (lPuntIndex >= 0) {
        //  Punt zit al in te onderzoeken set
        //  Verwijder het punt uit de te onderzoeken set als het nieuwe pad beter is
        if (lKosten < gKnooppunten[lPunt].Kosten) {
            dump('Splitsen op ' + lPuntIndex + ' van ' + pOnderzoeken);
            pOnderzoeken.splice(lPuntIndex, 1);
            dump(pOnderzoeken);
            // alert(110);
        }
    }
    else if (gKnooppunten[lPunt].Bezocht) {
        if (lKosten < gKnooppunten[lPunt].Kosten) {
            //  Punt is al bezocht, maar duurder. Met een goede heuristiek mag dit niet voorkomen
            alert(116);
        }
    } else {
        //  Punt is nog niet bezocht en zit niet in de ondezoeksset
        var dX = Math.abs(gKnooppunten[gEindpunt].X - gKnooppunten[lPunt].X);
        var dY = Math.abs(gKnooppunten[gEindpunt].Y - gKnooppunten[lPunt].Y);
        // alert('dX = ' + dX + '  dY = ' + dY);
        var lRang = lKosten + gWeegfactor * (dX + dY);

        gKnooppunten[lPunt].Rang   = lRang;
        gKnooppunten[lPunt].Kosten = lKosten;
        gKnooppunten[lPunt].Onderzocht = true;
        gKnooppunten[lPunt].Kruimelpad = pNabijPunt;
        pOnderzoeken.push(lPunt);
    }
    return (lPunt == gEindpunt);
}
function kortstePadIteratie() {
    if (gGevonden || pOnderzoeken.length <= 0 || gIteraties++ > 200) {
        clearInterval(fKortstePadIteratie);
        // dumpKnooppunten(gKnooppunten);
        document.getElementById("resultaat").innerHTML = gevolgdeWeg();
        ctx.scale(0.25, 0.25);
    } else {
        dumpKnooppunten(gKnooppunten);
        var lNabijIndex = -1;
        var lNabijPunt = -1;
        var lNabijRang = Infinity;
        for (var j = 0; j < pOnderzoeken.length; j++) {
            lPunt = pOnderzoeken[j];
            if (!gKnooppunten[lPunt].Bezocht) {
                if (lNabijRang > gKnooppunten[lPunt].Rang) {
                    lNabijRang = gKnooppunten[lPunt].Rang;
                    lNabijIndex = j;
                    lNabijPunt = lPunt;
        }   }   }
        // dump('Iteratie ' + gIteraties + '. Dichtsbijzijnd ' + pOnderzoeken[lNabijIndex] + ' (' + lNabijRang + ')');
        if (lNabijPunt >= 0) {
            var lX = gKnooppunten[lNabijPunt].X;
            var lY = gKnooppunten[lNabijPunt].Y;
            gKnooppunten[lNabijPunt].Onderzoeken = false;
            gKnooppunten[lNabijPunt].Bezocht = true;
            gKnooppunten[lNabijPunt].veldBezocht();
            ctx.fillText(gKnooppunten[lNabijPunt].Rang, 10 * lX, 10 * lY);
            if (lX > 0) {gGevonden |= onderzoekPunt(lX - 1, lY, lNabijPunt);}
            if (lX < 9) {gGevonden |= onderzoekPunt(lX + 1, lY, lNabijPunt);}
            if (lY > 0) {gGevonden |= onderzoekPunt(lX, lY - 1, lNabijPunt);}
            if (lY < 9) {gGevonden |= onderzoekPunt(lX, lY + 1, lNabijPunt);}
            // dump(pOnderzoeken);
        }
    }
}
function kortstePad() {
    gGevonden = false;
    gIteraties = 0;
    pOnderzoeken = [];
    gKnooppunten[gBeginpunt].Rang   = 0;
    gKnooppunten[gBeginpunt].Kosten = 0;
    pOnderzoeken.push(gBeginpunt);
    fKortstePadIteratie = setInterval(kortstePadIteratie, 100);
}
function gevolgdeWeg() {
    var lTekst = '';
    var lPrefix = '';
    var lZwaarte = 0;
    lPunt = gEindpunt;
    while (lPunt >= 0) {
        gKnooppunten[lPunt].veldKruimelpad();
        lTekst = lPunt + lPrefix + lTekst;
        lPrefix = ' - ';
        lZwaarte += gKnooppunten[lPunt].Zwaarte;
        lPunt = gKnooppunten[lPunt].Kruimelpad;
    }
    return 'Gevolgde weg = ' + lTekst + '. Zwaarte = ' + lZwaarte;
}
function voorbeeldKortstePad() {
    document.getElementById("resultaat").innerHTML = '';
    document.getElementById("uitvoer").innerHTML = '';
    initCanvas();
    gWeegfactor = document.getElementById("weegfactor").value;
    if (gWeegfactor == '') { gWeegfactor = 10; }
    initNetwerk();
    gBeginpunt = knooppuntID(1,1);
    gEindpunt  = knooppuntID(8,8);
    gKnooppunten[gBeginpunt].veldKruimelpad();
    gKnooppunten[gEindpunt].veldKruimelpad();
    alert('Start analyse');
    kortstePad();
}
