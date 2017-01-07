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
}
{// class cLijn
    function cLijn(pBeginpunt,pEindpunt) {
        var Beginpunt;
        var Eindpunt;
        this.Beginpunt = pBeginpunt;
        this.Eindpunt  = pEindpunt;
    }
    cLijn.prototype.TekenLijn = function() {
        gEllipsCanvas.strokeStyle = 'rgb(0,0,0)';
        gEllipsCanvas.beginPath();
        this.Beginpunt.MoveTo();
        this.Eindpunt.LineTo();
        gEllipsCanvas.stroke();
        this.Beginpunt.Draw();
        this.Eindpunt.Draw();
    }
}
function cPolygoon() {
    var Coordinaten;
    this.Coordinaten = [];
}
    cPolygoon.prototype.Punt = function(pXY) { this.Coordinaten.push(pXY); }
    cPolygoon.prototype.TekenPolygoon = function() {
        gEllipsCanvas.strokeStyle = 'rgb(0,0,0)';
        gEllipsCanvas.beginPath();
        for (var i = 0; i < this.Coordinaten.length; i++) {
            if (i == 0) this.Coordinaten[i].MoveTo();
            else        this.Coordinaten[i].LineTo();
        }
        gEllipsCanvas.stroke();
        for (var i = 0; i < this.Coordinaten.length; i++) this.Coordinaten[i].Draw();
    }
{   //  "class" cEllips
    function cEllips(pLangeAs, pKorteAs) {
        var LangeAs;
        var KorteAs;
        var Polygoon;
        var Meridianen;
        var Parallellen;
        this.LangeAs = pLangeAs;
        this.KorteAs = pKorteAs;
        this.Polygoon = new cPolygoon();
        this.Meridianen  = [];
        this.Parallellen = [];
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
                if (tanPhi > 0) lt =           Math.atan(tanPhi * this.LangeAs/this.KorteAs);
                else            lt = Math.PI + Math.atan(tanPhi * this.LangeAs/this.KorteAs);
            } else {
                if (tanPhi > 0) lt =     Math.PI + Math.atan(tanPhi * this.LangeAs/this.KorteAs);
                else            lt = 2 * Math.PI + Math.atan(tanPhi * this.LangeAs/this.KorteAs);
            }
        }
        console.log(pPhi, pPhi % 360, tanPhi, lt);
        return lt;
    }
    // return Math.atan(     Math.tan(pPhi * Math.PI / 180.0) * this.LangeAs/this.KorteAs); }
    // cEllips.prototype.X = function(pPhi) { return this.LangeAs * Math.cos(pPhi * Math.PI / 180.0); }
    // cEllips.prototype.Y = function(pPhi) { return this.KorteAs * Math.sin(pPhi * Math.PI / 180.0); }
    cEllips.prototype.VoegPuntToe = function(pPhi) { this.Polygoon.Punt(new cXY(this.X(pPhi),this.Y(pPhi))); }
    cEllips.prototype.EllipsPunten = function(pHoekInterval) {
        for (var phi = 0; phi <= 360; phi += pHoekInterval) this.VoegPuntToe(phi);
    }
    cEllips.prototype.TekenEllips = function() { this.Polygoon.TekenPolygoon(); }
}
function TekenEllipsen() {
    var a = Number(document.getElementById('ellips-lange-as').value);
    var b = Number(document.getElementById('ellips-korte-as').value);
    var lXas = new cLijn(new cXY(-a,0), new cXY(a,0));
    var lYas = new cLijn(new cXY(0,-b), new cXY(0,b));
    lEllips = new cEllips(a,b);
    lEllips.EllipsPunten(5);
    //
    lXas.TekenLijn();
    lYas.TekenLijn();
    lEllips.TekenEllips();
}
