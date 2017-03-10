//  Zie ook http://home.scarlet.be/math/nl/ellipse.htm
var Xm;
var Ym;
function initEllipsCanvas() {
    var canvas = document.getElementById('ellips');
    if (canvas.getContext){
        gEllipsCanvas = canvas.getContext('2d');
        gEllipsCanvas.strokeStyle = 'rgb(0,0,0)';
        gEllipsCanvas.fillStyle="#FF0000";
        gEllipsCanvas.setTransform(1, 0, 0, 1, 0, 0);
        gEllipsCanvas.clearRect(0, 0, canvas.width, canvas.height);
        Xm = canvas.width  / 2;
        Ym = canvas.height / 2;
    }
}
function WisCanvas() { gEllipsCanvas.clearRect(0, 0, 2*Xm, 2*Ym); }
{// class cXY
    function cXY(pX,pY) {
        var X;
        var Y;
        this.X = Number(pX);
        this.Y = Number(pY);
    }
    cXY.prototype.MoveTo = function() { gEllipsCanvas.moveTo(Xm + this.X,Ym - this.Y); }
    cXY.prototype.LineTo = function() { gEllipsCanvas.lineTo(Xm + this.X,Ym - this.Y); }
    cXY.prototype.Draw   = function() { gEllipsCanvas.fillRect(Xm + this.X - 1,Ym - this.Y - 1, 3 ,3); }
    cXY.prototype.DrawIfPoints = function() { if (document.getElementById('ellips-eindpunt-kruisvak').checked) this.Draw(); }
}
{// class cLijn
    function cLijn(pBeginpunt,pEindpunt) {
        var Beginpunt;
        var Eindpunt;
        this.Beginpunt = pBeginpunt;
        this.Eindpunt  = pEindpunt;
        this.Kleur     = 'rgb(0,0,0)';
    }
    cLijn.prototype.SetKleur  = function(pKleur) { this.Kleur = pKleur; }
    cLijn.prototype.TekenLijn = function() {
        gEllipsCanvas.strokeStyle = this.Kleur;
        gEllipsCanvas.beginPath();
        this.Beginpunt.MoveTo();
        this.Eindpunt.LineTo();
        gEllipsCanvas.stroke();
        this.Beginpunt.DrawIfPoints();
        this.Eindpunt.DrawIfPoints();
    }
}
{// class cKromme
    function cKromme() {
        var Coordinaten;
        this.Coordinaten = [];
    }
    cKromme.prototype.Punt = function(pXY) { this.Coordinaten.push(pXY); }
    cKromme.prototype.AantalPunten = function() { return this.Coordinaten.length; }
    cKromme.prototype.TekenKromme = function() {
        gEllipsCanvas.strokeStyle = 'rgb(40,0,0)';
        gEllipsCanvas.beginPath();
        for (var i = 0; i < this.Coordinaten.length; i++) {
            if (i == 0) this.Coordinaten[i].MoveTo();
            else        this.Coordinaten[i].LineTo();
        }
        gEllipsCanvas.stroke();
        for (var i = 0; i < this.Coordinaten.length; i++) this.Coordinaten[i].DrawIfPoints();
    }
}
{// class cEllips
    function cEllips(pLangeAs, pKorteAs) {
        var LangeAs;
        var KorteAs;
        var Kromme;
        var Xraaklijn;
        var Yraaklijn;
        var Xnormaal;
        var Ynormaal;
        var Kader;
        var Normalen;
        this.LangeAs = pLangeAs;
        this.KorteAs = pKorteAs;
        this.Kromme = new cKromme();
    }
    cEllips.prototype.X = function(pPhi) { return this.LangeAs * Math.cos(this.t(pPhi)); }
    cEllips.prototype.Y = function(pPhi) { return this.KorteAs * Math.sin(this.t(pPhi)); }
    cEllips.prototype.t = function(pPhi) {
        var lt;
        var tanPhi = 0;
             if (pPhi % 360 ==   0) { lt = 0/2 * Math.PI; }
        else if (pPhi % 360 ==  90) { lt = 1/2 * Math.PI; }
        else if (pPhi % 360 == 180) { lt = 2/2 * Math.PI; }
        else if (pPhi % 360 == 270) { lt = 3/2 * Math.PI; }
        else {
            tanPhi = Math.tan(pPhi * Math.PI / 180.0);
            if (pPhi % 360 < 180) {
                if (tanPhi > 0) lt =           Math.atan(tanPhi * this.KorteAs/this.LangeAs);
                else            lt = Math.PI + Math.atan(tanPhi * this.KorteAs/this.LangeAs);
            } else {
                if (tanPhi > 0) lt =     Math.PI + Math.atan(tanPhi * this.KorteAs/this.LangeAs);
                else            lt = 2 * Math.PI + Math.atan(tanPhi * this.KorteAs/this.LangeAs);
            }
        }
        console.log(pPhi, pPhi % 360, tanPhi, lt * 180.0 / Math.PI);
        return lt;
    }
    cEllips.prototype.VoegPuntToe = function(pPhi) { this.Kromme.Punt(new cXY(this.X(pPhi),this.Y(pPhi))); }
    cEllips.prototype.EllipsPunten = function(pHoekInterval) {
        for (var phi = 0; phi <= 360; phi += pHoekInterval) this.VoegPuntToe(phi);
    }
    cEllips.prototype.MaakNormaal = function(pPhi) {
        var a = this.LangeAs;
        var b = this.KorteAs;
        var sint = Math.sin(this.t(pPhi));
        var cost = Math.cos(this.t(pPhi));
        var tant = Math.tan(this.t(pPhi));
        var lEllipsPunt;
        var lXsnij;
        var lYsnij;
        var lXsnijpunt;
        var lYsnijpunt;
        var lKader;
        lEllipsPunt = new cXY(this.X(pPhi),this.Y(pPhi));
        lXsnij = (a*a - b*b) / a * Math.cos(this.t(pPhi));
        lYsnij = (b*b - a*a) / b * Math.sin(this.t(pPhi));
        lXsnijpunt  = new cXY( lXsnij,      0);
        lYsnijpunt  = new cXY(      0, lYsnij);
        this.Xnormaal = new cLijn(lEllipsPunt, lXsnijpunt); lXnormaal.SetKleur('rgb(0,0,255)');
        this.Ynormaal = new cLijn(lYsnijpunt , lXsnijpunt); lYnormaal.SetKleur('rgb(0,255,255)');
    }
    cEllips.prototype.TekenEllips = function() { this.Kromme.TekenKromme(); }
    cEllips.prototype.TekenNormaal = function(pPhi) {
        var a;
        var b;
        var lEllipsPunt;
        var lXsnij;
        var lYsnij;
        var lXsnijpunt;
        var lYsnijpunt;
        var lXnormaal;
        var lYnormaal;
        var lKader;
            a = this.LangeAs;
            b = this.KorteAs;
            lEllipsPunt = new cXY(this.X(pPhi),this.Y(pPhi));
            lXsnij = (a*a - b*b) / a * Math.cos(this.t(pPhi));
            lYsnij = (b*b - a*a) / b * Math.sin(this.t(pPhi));
            lXsnijpunt  = new cXY( lXsnij,      0);
            lYsnijpunt  = new cXY(      0, lYsnij);
            lXnormaal = new cLijn(lEllipsPunt, lXsnijpunt); lXnormaal.SetKleur('rgb(0,0,255)');
            lYnormaal = new cLijn(lYsnijpunt , lXsnijpunt); lYnormaal.SetKleur('rgb(0,255,255)');
            lKader = new cKromme();
            lKader.Punt(lXsnijpunt);
            lKader.Punt(new cXY(lXsnij,lEllipsPunt.Y));
            lKader.Punt(lEllipsPunt);
            lKader.Punt(new cXY(lEllipsPunt.X,0));
            //
            lXnormaal.TekenLijn();
            lYnormaal.TekenLijn();
            if (document.getElementById('ellips-kader-kruisvak').checked) lKader.TekenKromme();
    }
    cEllips.prototype.TekenNormalen = function(pHoekInterval) {
        var a;
        var b;
        var lEllipsPunt;
        var lXsnij;
        var lYsnij;
        var lXsnijpunt;
        var lYsnijpunt;
        var lXnormaal;
        var lYnormaal;
        for (var phi = pHoekInterval; phi < 90; phi += pHoekInterval) {
            a = this.LangeAs;
            b = this.KorteAs;
            lEllipsPunt = new cXY(this.X(phi),this.Y(phi));
            lXsnij = (a*a - b*b) / a * Math.cos(this.t(phi));
            lYsnij = (b*b - a*a) / b * Math.sin(this.t(phi));
            lXsnijpunt  = new cXY( lXsnij,      0);
            lYsnijpunt  = new cXY(      0, lYsnij);
            lXnormaal = new cLijn(lEllipsPunt, lXsnijpunt); lXnormaal.SetKleur('rgb(0,0,255)');
            lYnormaal = new cLijn(lYsnijpunt , lXsnijpunt); lYnormaal.SetKleur('rgb(0,0,255)');
            lXnormaal.TekenLijn();
            lYnormaal.TekenLijn();
        }
    }
    cEllips.prototype.TekenRaaklijn = function(pPhi) {
        var a;
        var b;
        var sint = Math.sin(this.t(pPhi));
        var cost = Math.cos(this.t(pPhi));
        var tant = Math.tan(this.t(pPhi));
        var lEllipsPunt;
        var lXsnij;
        var lYsnij;
        var lXsnijpunt;
        var lYsnijpunt;
        var lXraaklijn;
        var lYraaklijn;
            a = this.LangeAs;
            b = this.KorteAs;
            lEllipsPunt = new cXY(this.X(pPhi),this.Y(pPhi));
            lXsnij = a * (cost + sint * tant);
            lYsnij = b * (sint + cost / tant);
            lXsnijpunt  = new cXY( lXsnij,      0);
            lYsnijpunt  = new cXY(      0, lYsnij);
            lXraaklijn = new cLijn(lEllipsPunt, lXsnijpunt); lXraaklijn.SetKleur('rgb(0,0,255)');
            lYraaklijn = new cLijn(lEllipsPunt, lYsnijpunt); lYraaklijn.SetKleur('rgb(0,255,255)');
            lXraaklijn.TekenLijn();
            lYraaklijn.TekenLijn();
    }
}
function TekenEllipsen(pPhi = undefined) {
    var a = Number(document.getElementById('ellips-lange-as').value);
    var b = Number(document.getElementById('ellips-korte-as').value);
    var phiInterval = Number(document.getElementById('ellips-normalen-hoekinterval').value);
    var lXas = new cLijn(new cXY(-a,0), new cXY(a,0));
    var lYas = new cLijn(new cXY(0,-b), new cXY(0,b));
    lEllips = new cEllips(a,b);
    lEllips.EllipsPunten(5);
    //
    lXas.TekenLijn();
    lYas.TekenLijn();
    lEllips.TekenEllips();
    if (pPhi == undefined) { lEllips.TekenNormalen(phiInterval); }
    else                   { lEllips.TekenNormaal(pPhi); lEllips.TekenRaaklijn(pPhi); }
}
