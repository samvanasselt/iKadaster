var Um;  // X-coordinaat het middelpunt van het projectie vlak (canvas)
var Vm;  // Y-coordinaat
var PhiMin    =  0;  //  Kleinste breedtegraad
var PhiMax    = 90;  //  Grootste breedtegraad
var LambdaMin =  0;  //  Kleinste lengtegraad
var LambdaMax = 90;  //  Grootste lengtegraad
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
function WisCanvas() {
    gEllipsCanvas.clearRect(0, 0, 2*Um, 2*Vm);
}
function KijkHoek() {
    var phi    = document.getElementById('kijkhoek-phi').value;
    var lambda = document.getElementById('kijkhoek-lambda').value;
    return new cBolPunt(phi, lambda);
}
{// class cRDpunt = Punt in het RD stelsel
    function cRDpunt(pxRD,pyRD) {
        var xRD;
        var yRD;
        this.xRD = pxRD;
        this.yRD = pyRD;
    }
    cRDpunt.prototype.Schaal = function(pSchaal) {
        this.xRD *= pSchaal;
        this.yRD *= pSchaal;
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
    cXYZ.prototype.Kopie  = function() { return new cXYZ( this.X, this.Y, this.Z); }
    cXYZ.prototype.Roteer = function(pBolPunt) {
        var cf = Math.cos(pBolPunt.Phi    * Math.PI / 180.0);
        var sf = Math.sin(pBolPunt.Phi    * Math.PI / 180.0);
        var cl = Math.cos(pBolPunt.Lambda * Math.PI / 180.0);
        var sl = Math.sin(pBolPunt.Lambda * Math.PI / 180.0);
        var xr =    cl * this.X - sl * this.Y;
        var yr = cf*sl * this.X + cf*cl * this.Y - sf * this.Z;
        var zr = sf*sl * this.X + sf*cl * this.Y + cf * this.Z;
        this.X = xr;
        this.Y = yr;
        this.Z = zr;
    }
}
function IsoMetrisch(lPunt) {
        var c = Math.sqrt(3) / 2;
        var s = 1.0 / 2;
        var x =  c * lPunt.X - s * lPunt.Y;
        var y = -s * lPunt.X - c * lPunt.Y + lPunt.Z;
        return [x,y];
}
{// class cLijn
    function cLijn(pBeginpunt,pEindpunt) {
        var Beginpunt;
        var Eindpunt;
        this.Beginpunt = pBeginpunt;
        this.Eindpunt  = pEindpunt;
    }
    cLijn.prototype.TekenLijn = function(pBolPunt) {
        // gEllipsCanvas.strokeStyle = 'rgb(0,0,0)';
        var lBeginPunt = this.Beginpunt.Kopie();
        var lEindPunt  = this.Eindpunt.Kopie();
        var lp;
        lBeginPunt.Roteer(pBolPunt);
        lEindPunt.Roteer(pBolPunt);
        gEllipsCanvas.beginPath();
        lp = IsoMetrisch(lBeginPunt); gEllipsCanvas.moveTo(Um + lp[0], Vm - lp[1]);
        lp = IsoMetrisch(lEindPunt) ; gEllipsCanvas.lineTo(Um + lp[0], Vm - lp[1]);
        gEllipsCanvas.stroke();
    }
}
{// class cKromme
    function cKromme() {
        var Punten;
        this.Punten = [];
    }
    cKromme.prototype.Punt   = function(pBolPunt)   { this.Punten.push(pBolPunt); }
    cKromme.prototype.PuntPL = function(phi,lambda) { this.Punten.push(new cBolPunt(phi,lambda)); }
}
{// class cEllipsoide
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
        this.Nederland;
    }
    cEllipsoide.prototype.X = function(pPhi,pLambda) { return this.LangeAs * Math.cos(pPhi * Math.PI / 180.0) * Math.cos(pLambda * Math.PI / 180.0); }
    cEllipsoide.prototype.Y = function(pPhi,pLambda) { return this.LangeAs * Math.cos(pPhi * Math.PI / 180.0) * Math.sin(pLambda * Math.PI / 180.0); }
    cEllipsoide.prototype.Z = function(pPhi,pLambda) { return this.KorteAs * Math.sin(pPhi * Math.PI / 180.0); }
    cEllipsoide.prototype.P = function(pPhi,pLambda) { return new cXYZ(this.X(pPhi,pLambda),this.Y(pPhi,pLambda),this.Z(pPhi,pLambda)); }
    cEllipsoide.prototype.TekenKromme = function(pKromme, pKijkHoek) {
        // gEllipsCanvas.strokeStyle = 'rgb(0,0,0)';
        var lPunt;
        var lp;
        gEllipsCanvas.beginPath();
        for (var i = 0; i < pKromme.Punten.length; i++) {
            lPunt = this.P(pKromme.Punten[i].Phi,pKromme.Punten[i].Lambda);
            lPunt.Roteer(pKijkHoek);
            lp = IsoMetrisch(lPunt);
            if (i == 0) { gEllipsCanvas.moveTo(Um + lp[0], Vm - lp[1]); }
            else        { gEllipsCanvas.lineTo(Um + lp[0], Vm - lp[1]); }
            delete lPunt;
        }
        gEllipsCanvas.stroke();
    }
    cEllipsoide.prototype.MaakParallellen = function(pPhiInterval, pLambdaInterval) {
        for     (var phi    = PhiMin   ; phi    <= PhiMax   ; phi    += pPhiInterval) { this.Parallellen.push(new cKromme());
            for (var lambda = LambdaMin; lambda <= LambdaMax; lambda += pLambdaInterval) {
                this.Parallellen[this.Parallellen.length-1].PuntPL(phi,lambda);
            }
        }
    }
    cEllipsoide.prototype.MaakMeridianen = function(pPhiInterval, pLambdaInterval) {
        for     (var lambda = LambdaMin; lambda <= LambdaMax; lambda += pLambdaInterval) { this.Meridianen.push(new cKromme());
            for (var phi    = PhiMin   ; phi    <= PhiMax   ; phi    += pPhiInterval) {
                this.Meridianen[this.Meridianen.length-1].PuntPL(phi,lambda);
            }
        }
    }
    cEllipsoide.prototype.MaakNederland = function() {
        var lRDpunten = [];
        lRDpunten.push( new cRDpunt(112,522));  //  Den Helder
        lRDpunten.push( new cRDpunt(119,578));  //  De Cocksdorp
        lRDpunten.push( new cRDpunt(140,600));  //  West Terschelling
        lRDpunten.push( new cRDpunt(214,637));  //  Rottermeroog
        lRDpunten.push( new cRDpunt(251,608));  //  Eemshaven
        lRDpunten.push( new cRDpunt(276,585));  //  Nieuw Statenzijl
        lRDpunten.push( new cRDpunt(267,518));  //  Nieuw Schoonebeek
        lRDpunten.push( new cRDpunt(246,519));  //  Coevorden
        lRDpunten.push( new cRDpunt(246,498));  //  Langeveen
        lRDpunten.push( new cRDpunt(268,495));  //  Lattrop
        lRDpunten.push( new cRDpunt(252,440));  //  Kotten
        lRDpunten.push( new cRDpunt(195,428));  //  Leuth
        lRDpunten.push( new cRDpunt(213,375));  //  Venlo
        lRDpunten.push( new cRDpunt(200,309));  //  Vaals
        lRDpunten.push( new cRDpunt(177,309));  //  Eijsden
        lRDpunten.push( new cRDpunt(186,353));  //  Thorn
        lRDpunten.push( new cRDpunt( 82,379));  //  Ossendrecht
        lRDpunten.push( new cRDpunt( 56,361));  //  Koewacht
        lRDpunten.push( new cRDpunt( 14,371));  //  Sint Anna ter Muiden
        lRDpunten.push( new cRDpunt( 87,469));  //  Katwijk aan Zee
        lRDpunten.push( new cRDpunt(112,522));  //  Den Helder
        this.Nederland = new cKromme();
        for (var i = 0; i < lRDpunten.length; i++) {
            lRDpunten[i].Schaal(1000);
            this.Nederland.Punt(RDnaarWGS84(lRDpunten[i]));
        }
        // var lBolPunten = [];
        // lBolPunten.push(RDnaarWGS84(new cRDpunt(141000,629000)));
        // lBolPunten.push(RDnaarWGS84(new cRDpunt(100000,600000)));
        // lBolPunten.push(RDnaarWGS84(new cRDpunt( 80000,500000)));
        // lBolPunten.push(RDnaarWGS84(new cRDpunt(     0,392000)));
        // lBolPunten.push(RDnaarWGS84(new cRDpunt(     0,336000)));
        // lBolPunten.push(RDnaarWGS84(new cRDpunt(101000,336000)));
        // lBolPunten.push(RDnaarWGS84(new cRDpunt(161000,289000)));
        // lBolPunten.push(RDnaarWGS84(new cRDpunt(219000,289000)));
        // lBolPunten.push(RDnaarWGS84(new cRDpunt(300000,451000)));
        // lBolPunten.push(RDnaarWGS84(new cRDpunt(300000,614000)));
        // lBolPunten.push(RDnaarWGS84(new cRDpunt(259000,629000)));
    }
    cEllipsoide.prototype.TekenParallellen = function(pKijkHoek) {
        for (var i = 0; i < this.Parallellen.length; i++) {
            if (this.Parallellen[i].Phi == 0) gEllipsCanvas.strokeStyle = 'rgb(255,63,63)';   //  Evenaar rood
            else                              gEllipsCanvas.strokeStyle = 'rgb(0,0,0)';       //  Overige parallellen zwart
            this.TekenKromme(this.Parallellen[i], pKijkHoek);
        }
    }
    cEllipsoide.prototype.TekenMeridianen  = function(pKijkHoek) {
        for (var i = 0; i < this.Meridianen.length ; i++) {
            if (this.Meridianen[i].Lambda == 0) gEllipsCanvas.strokeStyle = 'rgb(255,63,63)';   //  Nul-meridiaan rood
            else                                gEllipsCanvas.strokeStyle = 'rgb(0,0,0)';       //  Overige meridianen zwart
            this.TekenKromme(this.Meridianen[i], pKijkHoek);
        }
    }
    cEllipsoide.prototype.TekenNederland   = function(pKijkHoek) {
        gEllipsCanvas.strokeStyle = 'rgb(0,127,0)';
        this.TekenKromme(this.Nederland, pKijkHoek);
    }
}
{// class cAssenStelsel
    function cAssenStelsel() {
        var XasP;
        var YasP;
        var ZasP;
        var XasM;
        var YasM;
        var ZasM;
        var r = 300;
        var lOorsprong = new cXYZ(0,0,0);
        this.XasP = new cLijn(lOorsprong, new cXYZ(r,0,0));
        this.YasP = new cLijn(lOorsprong, new cXYZ(0,r,0));
        this.ZasP = new cLijn(lOorsprong, new cXYZ(0,0,r));
        this.XasM = new cLijn(lOorsprong, new cXYZ(-r,0,0));
        this.YasM = new cLijn(lOorsprong, new cXYZ(0,-r,0));
        this.ZasM = new cLijn(lOorsprong, new cXYZ(0,0,-r));
    }
    cAssenStelsel.prototype.TekenAssen = function(pKijkHoek) {
        gEllipsCanvas.strokeStyle = 'rgb(255,0,0)';     this.XasP.TekenLijn(pKijkHoek);
        gEllipsCanvas.strokeStyle = 'rgb(0,255,0)';     this.YasP.TekenLijn(pKijkHoek);
        gEllipsCanvas.strokeStyle = 'rgb(0,0,255)';     this.ZasP.TekenLijn(pKijkHoek);
        gEllipsCanvas.strokeStyle = 'rgb(255,195,195)'; this.XasM.TekenLijn(pKijkHoek);
        gEllipsCanvas.strokeStyle = 'rgb(195,255,195)'; this.YasM.TekenLijn(pKijkHoek);
        gEllipsCanvas.strokeStyle = 'rgb(195,195,255)'; this.ZasM.TekenLijn(pKijkHoek);
        gEllipsCanvas.strokeStyle = 'rgb(0,0,0)';
    }
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
function TekenAarde() {
    var lHoek = KijkHoek();
    lAarde = new cEllipsoide(320,240);
    lAarde.MaakMeridianen ( 5,15);
    lAarde.MaakParallellen(15, 5);
    lAarde.MaakNederland();
    lAarde.TekenParallellen(lHoek);
    lAarde.TekenMeridianen(lHoek);
    lAarde.TekenNederland(lHoek);
}
function TekenAssen() {
    var r = 200;
    var lAssen = new cAssenStelsel();
    var lHoek = KijkHoek();
    lAssen.TekenAssen(lHoek);
}
function TekenKubus() {
    var r = 120;
    var lKubus = [];
    lKubus.push( new cLijn(new cXYZ(-r,-r,-r), new cXYZ( r,-r,-r))); // X-lijnen
    lKubus.push( new cLijn(new cXYZ(-r, r,-r), new cXYZ( r, r,-r)));
    lKubus.push( new cLijn(new cXYZ(-r, r, r), new cXYZ( r, r, r)));
    lKubus.push( new cLijn(new cXYZ(-r,-r, r), new cXYZ( r,-r, r)));
    lKubus.push( new cLijn(new cXYZ(-r,-r,-r), new cXYZ(-r, r,-r))); // Y-lijnen
    lKubus.push( new cLijn(new cXYZ( r,-r,-r), new cXYZ( r, r,-r)));
    lKubus.push( new cLijn(new cXYZ( r,-r, r), new cXYZ( r, r, r)));
    lKubus.push( new cLijn(new cXYZ(-r,-r, r), new cXYZ(-r, r, r)));
    lKubus.push( new cLijn(new cXYZ(-r,-r,-r), new cXYZ(-r,-r, r))); // Z-lijnen
    lKubus.push( new cLijn(new cXYZ( r,-r,-r), new cXYZ( r,-r, r)));
    lKubus.push( new cLijn(new cXYZ( r, r,-r), new cXYZ( r, r, r)));
    lKubus.push( new cLijn(new cXYZ(-r, r,-r), new cXYZ(-r, r, r)));
    var lHoek = KijkHoek();
    for (var i = 0; i < lKubus.length; i++) {
        if (i == 0) gEllipsCanvas.strokeStyle = 'rgb(255,0,0)';
        if (i == 4) gEllipsCanvas.strokeStyle = 'rgb(0,255,0)';
        if (i == 8) gEllipsCanvas.strokeStyle = 'rgb(0,0,255)';
        lKubus[i].TekenLijn(lHoek);
    }
}