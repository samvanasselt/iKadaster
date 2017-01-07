var Um;  // X-coordinaat het middelpunt van het projectie vlak (canvas)
var Vm;  // Y-coordinaat
function initEllipsCanvas() {
    var canvas = document.getElementById('ellips');
    if (canvas.getContext){
        gEllipsCanvas = canvas.getContext('2d');
        gEllipsCanvas.setTransform(1, 0, 0, 1, 0, 0);
        gEllipsCanvas.clearRect(0, 0, canvas.width, canvas.height);
        Um = canvas.width  / 2;
        Vm = canvas.height / 2;
    }
}
{// class cRDpunt = Punt in het RD stelsel
    function cRDpunt(pxRD,pyRD) {
        var xRD;
        var yRD;
        this.xRD = pxRD;
        this.yRD = pyRD;
    }
}
{// class cBolPunt = Punt op een bol of ellipsoide
    function cBolPunt(pPhi, pLambda) {
        var Phi   ;
        var Lambda;
        this.Phi    = pPhi;
        this.Lambda = pLambda;
    }
}
{//"class" cXYZ = Punt in de driedimensionale ruimte
    function cXYZ(pX,pY,pZ) {
        var X;  //  Lijn door de nul-meridiaan
        var Y;  //  Lijn door de 90° meridiaan
        var Z;  //  Lijn door de polen
        this.X = pX;
        this.Y = pY;
        this.Z = pZ;
    }
    cXYZ.prototype.roteer = function(ef,el) {
        var xXas = this.X;
        var yXas = this.Y * Math.cos(ef * Math.PI / 180.0) + this.Z * Math.sin(ef * Math.PI / 180.0);
        var zXas = this.Y * Math.sin(ef * Math.PI / 180.0) + this.Z * Math.cos(ef * Math.PI / 180.0);
        this.X = xXas * Math.cos(el * Math.PI / 180.0) +   yXas * Math.sin(el * Math.PI / 180.0);
        this.Y = xXas * Math.sin(el * Math.PI / 180.0) +   yXas * Math.cos(el * Math.PI / 180.0);
        this.Z = zXas;
    }
}
{   //  "class" cLijn
    function cLijn(pBeginpunt,pEindpunt) {
        var Beginpunt;
        var Eindpunt;
        this.Beginpunt = pBeginpunt;
        this.Eindpunt  = pEindpunt;
    }
    cLijn.prototype.TekenLijn = function() {
        gEllipsCanvas.strokeStyle = 'rgb(0,0,0)';
        gEllipsCanvas.beginPath();
        gEllipsCanvas.moveTo(Um + this.Beginpunt.X, Vm - this.Beginpunt.Z);
        gEllipsCanvas.lineTo(Um + this.Eindpunt.X , Vm - this.Eindpunt.Z );
        gEllipsCanvas.stroke();
    }
}
{//"class" cPolygoon
    function cPolygoon() {
        var Coordinaten;
        this.Coordinaten = [];
    }
    cPolygoon.prototype.Punt = function(pXYZ) { this.Coordinaten.push(pXYZ); }
    cPolygoon.prototype.TekenPolygoon = function() {
        gEllipsCanvas.beginPath();
                                                          gEllipsCanvas.moveTo(Um + this.Coordinaten[0].X,Vm - this.Coordinaten[0].Z);
        for (var i = 0; i < this.Coordinaten.length; i++) gEllipsCanvas.lineTo(Um + this.Coordinaten[i].X,Vm - this.Coordinaten[i].Z);
                                                          gEllipsCanvas.lineTo(Um + this.Coordinaten[0].X,Vm - this.Coordinaten[0].Z);
        gEllipsCanvas.stroke();
    }
    cPolygoon.prototype.TekenGeroteerdePolygoon = function(ef,el) {
        for (var i = 0; i < this.Coordinaten.length; i++) this.Coordinaten[i].roteer(ef,el);
        this.TekenPolygoon();
    }
}
{   //  "class" cEllipsoide
    function cEllipsoide(pLangeAs, pKorteAs) {
        var LangeAs;
        var KorteAs;
        var Meridianen;
        var Parallellen;
        var Nederland;
        this.LangeAs = pLangeAs;
        this.KorteAs = pKorteAs;
        this.Meridianen  = [];
        this.Parallellen = [];
        this.NulMeridiaan;
        this.Nederland;
    }
    cEllipsoide.prototype.X = function(pPhi,pLambda) { return this.LangeAs * Math.cos(pPhi * Math.PI / 180.0) * Math.cos(pLambda * Math.PI / 180.0); }
    cEllipsoide.prototype.Y = function(pPhi,pLambda) { return this.LangeAs * Math.cos(pPhi * Math.PI / 180.0) * Math.sin(pLambda * Math.PI / 180.0); }
    cEllipsoide.prototype.Z = function(pPhi,pLambda) { return this.KorteAs * Math.sin(pPhi * Math.PI / 180.0); }
    cEllipsoide.prototype.P = function(pPhi,pLambda) { return new cXYZ(this.X(pPhi,pLambda),this.Y(pPhi,pLambda),this.Z(pPhi,pLambda)); }
    cEllipsoide.prototype.MaakParallellen = function(pPhiInterval, pLambdaInterval) {
        for     (var phi    =  -90; phi    <=  90; phi    += pPhiInterval) { this.Parallellen.push(new cPolygoon());
            for (var lambda = -180; lambda <= 180; lambda += pLambdaInterval) {
                this.Parallellen[this.Parallellen.length-1].Punt(this.P(phi,lambda));
            }
        }
    }
    cEllipsoide.prototype.MaakMeridianen = function(pPhiInterval, pLambdaInterval) {
        for     (var lambda = -180; lambda <= 180; lambda += pLambdaInterval) { this.Meridianen.push(new cPolygoon());
            for (var phi    =  -90; phi    <=  90; phi    += pPhiInterval) {
                this.Meridianen[this.Meridianen.length-1].Punt(this.P(phi,lambda));
            }
        }
        this.NulMeridiaan = new cPolygoon();
        for (var phi    =  -90; phi    <=  90; phi    += pPhiInterval) {
            this.NulMeridiaan.Punt(this.P(phi,0));
        }
    }
    cEllipsoide.prototype.MaakNederland = function() {
        var lBolPunten = [];
        lBolPunten.push(RDnaarWGS84(new cRDpunt(141000,629000)));
        lBolPunten.push(RDnaarWGS84(new cRDpunt(100000,600000)));
        lBolPunten.push(RDnaarWGS84(new cRDpunt( 80000,500000)));
        lBolPunten.push(RDnaarWGS84(new cRDpunt(     0,392000)));
        lBolPunten.push(RDnaarWGS84(new cRDpunt(     0,336000)));
        lBolPunten.push(RDnaarWGS84(new cRDpunt(101000,336000)));
        lBolPunten.push(RDnaarWGS84(new cRDpunt(161000,289000)));
        lBolPunten.push(RDnaarWGS84(new cRDpunt(219000,289000)));
        lBolPunten.push(RDnaarWGS84(new cRDpunt(300000,451000)));
        lBolPunten.push(RDnaarWGS84(new cRDpunt(300000,614000)));
        lBolPunten.push(RDnaarWGS84(new cRDpunt(259000,629000)));
        this.Nederland = new cPolygoon();
        for (var i = 0; i < lBolPunten.length; i++) this.Nederland.Punt(this.P(lBolPunten[i].Phi,lBolPunten[i].Lambda));
    }
    cEllipsoide.prototype.TekenParallellen = function(ef,el) { for (var i = 0; i < this.Parallellen.length; i++) this.Parallellen[i].TekenGeroteerdePolygoon(ef,el); }
    cEllipsoide.prototype.TekenMeridianen  = function(ef,el) { for (var i = 0; i < this.Meridianen.length ; i++) this.Meridianen[i].TekenGeroteerdePolygoon(ef,el);
                                                               gEllipsCanvas.strokeStyle = 'rgb(255,63,63)';     this.NulMeridiaan.TekenGeroteerdePolygoon(ef,el);   }
    cEllipsoide.prototype.TekenNederland   = function(ef,el) { gEllipsCanvas.strokeStyle = 'rgb(0,127,0)';       this.Nederland.TekenGeroteerdePolygoon(ef,el);      }
}
function RDnaarWGS84(pRDpunt) {
    var X0 = 155000; // Amersfoort
    var Y0 = 463000;
    //
    var Kpq =
        [[  0      ,3235.65389,-0.2475 ,-0.0655 ,0]
        ,[ -0.00738,  -0.00012, 0      , 0      ,0]
        ,[-32.58297, -0.84978 ,-0.01709,-0.00039,0]
        ,[  0      ,0         , 0      , 0      ,0]
        ,[  0.0053 ,0.00033   , 0      , 0      ,0]
        ];
    var Lpq =
        [[   0      ,  0.01199, 0.00022,0      ,0      ,0]
        ,[5260.52916,105.94684, 2.45656,0.05594,0.00128,0]
        ,[  -0.00022,  0      , 0      ,0      ,0      ,0]
        ,[  -0.81885, -0.05607,-0.00256,0      ,0      ,0]
        ,[   0      ,  0      , 0      ,0      ,0      ,0]
        ,[   0.00026,  0      , 0      ,0      ,0      ,0]
        ];
    //
    var dX = (pRDpunt.xRD - X0) * 0.00001;
    var dY = (pRDpunt.yRD - Y0) * 0.00001;
    lBolPunt = new cBolPunt(52.15517440,5.38720621);
    // phi = 52.15517440;
    for (var p = 0; p < 5; p++) {
        for (var q = 0; q < 5; q++) {
            lBolPunt.Phi += Kpq[p][q] * Math.pow(dX,p) * Math.pow(dY,q) / 3600;
            // phi += Kpq[p][q] * Math.pow(dX,p) * Math.pow(dY,q) / 3600;
    }}
    // lam =  5.38720621;
    for (var p = 0; p < 6; p++) {
        for (var q = 0; q < 6; q++) {
            lBolPunt.Lambda += Lpq[p][q] * Math.pow(dX,p) * Math.pow(dY,q) / 3600;
            // lam += Lpq[p][q] * Math.pow(dX,p) * Math.pow(dY,q) / 3600;
    }}
    return lBolPunt;
}
function TekenEllipsen() {
    initEllipsCanvas();
    lEllipsoide = new cEllipsoide(320,240);
    lEllipsoide.MaakMeridianen ( 5,15);
    lEllipsoide.MaakParallellen(15, 5);
    lEllipsoide.MaakNederland();
    lEllipsoide.TekenParallellen(0,90);
    lEllipsoide.TekenMeridianen(0,90);
    lEllipsoide.TekenNederland(0,90);
}

