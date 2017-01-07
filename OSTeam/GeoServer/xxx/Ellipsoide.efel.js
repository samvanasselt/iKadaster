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
    cBolPunt.prototype.roteer = function(ef,el) {
        this.Phi    += ef;
        this.Lambda += el;
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
}
{//"class" cPolygoon
    function cPolygoon() {
        var Coordinaten;
        this.Coordinaten = [];
    }
    cPolygoon.prototype.Punt   = function(pBolPunt)   { this.Coordinaten.push(pBolPunt); }
    cPolygoon.prototype.PuntPL = function(phi,lambda) { this.Coordinaten.push(new cBolPunt(phi,lambda)); }
    cPolygoon.prototype.roteer = function(ef,el)      { for (var i = 0; i < this.Coordinaten.length; i++) this.Coordinaten[i].roteer(ef,el); }
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
                this.Parallellen[this.Parallellen.length-1].PuntPL(phi,lambda);
            }
        }
    }
    cEllipsoide.prototype.MaakMeridianen = function(pPhiInterval, pLambdaInterval) {
        for     (var lambda =   30; lambda <=  30; lambda += pLambdaInterval) { this.Meridianen.push(new cPolygoon());
            for (var phi    =  -90; phi    <=  90; phi    += pPhiInterval) {
                this.Meridianen[this.Meridianen.length-1].PuntPL(phi,lambda);
            }
        }
        this.NulMeridiaan = new cPolygoon();
        for (var phi    =  -90; phi    <= 90 ; phi    += pPhiInterval) {
            this.NulMeridiaan.PuntPL(phi,0);
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
        for (var i = 0; i < lBolPunten.length; i++) this.Nederland.Punt(lBolPunten[i]);
    }
    cEllipsoide.prototype.TekenPolygoon = function(pPolygoon) {
        var lPunt;
        var lBeginPunt = this.P(pPolygoon.Coordinaten[0].Phi,pPolygoon.Coordinaten[0].Lambda);
        gEllipsCanvas.beginPath();
        gEllipsCanvas.moveTo(Um + lBeginPunt.X,Vm - lBeginPunt.Z);
        for (var i = 0; i < pPolygoon.Coordinaten.length; i++) {
            lPunt = this.P(pPolygoon.Coordinaten[i].Phi,pPolygoon.Coordinaten[i].Lambda);
            gEllipsCanvas.lineTo(Um + lPunt.X,Vm - lPunt.Z);
        }
        gEllipsCanvas.lineTo(Um + lBeginPunt.X,Vm - lBeginPunt.Z);
        gEllipsCanvas.stroke();

    }
    cEllipsoide.prototype.roteer = function(ef,el) {
        for (var i = 0; i < this.Parallellen.length; i++) this.Parallellen[i].roteer(ef,el);
        for (var i = 0; i < this.Meridianen.length ; i++) this.Meridianen[i].roteer(ef,el);
        this.NulMeridiaan.roteer(ef,el);
        this.Nederland.roteer(ef,el);
    }
    cEllipsoide.prototype.TekenParallellen = function() { for (var i = 0; i < this.Parallellen.length; i++) this.TekenPolygoon(this.Parallellen[i]); }
    cEllipsoide.prototype.TekenMeridianen  = function() { for (var i = 0; i < this.Meridianen.length ; i++) this.TekenPolygoon(this.Meridianen[i] );
                                                          gEllipsCanvas.strokeStyle = 'rgb(255,63,63)';     this.TekenPolygoon(this.NulMeridiaan  ); }
    cEllipsoide.prototype.TekenNederland   = function() { gEllipsCanvas.strokeStyle = 'rgb(0,127,0)';       this.TekenPolygoon(this.Nederland     ); }
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
    lEllipsoide.MaakMeridianen ( 45,15);
    // lEllipsoide.MaakParallellen(15, 5);
    lEllipsoide.MaakNederland();
    lEllipsoide.roteer(-30,90);
    // lEllipsoide.TekenParallellen();
    lEllipsoide.TekenMeridianen();
    lEllipsoide.TekenNederland();
}
