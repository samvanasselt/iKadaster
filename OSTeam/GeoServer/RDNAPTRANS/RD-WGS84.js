// RD-WGS84.js
function cEllipsoide(pAslengte = 6377397.155, pAfplatting = 1/299.1528128) {
    var _a;  //  Langste as van de ellipsoide in meters
    var _f;  //  Afplatting van de ellipsoide
    this._a = pAslengte;
    this._f = pAfplatting;
}
cEllipsoide.prototype.a = function () { var a = this._a; var f = this._f; return            a               ; }
cEllipsoide.prototype.b = function () { var a = this._a; var f = this._f; return            a - a * f       ; }
cEllipsoide.prototype.e = function () { var a = this._a; var f = this._f; return  Math.sqrt(2 * f - f * f)  ; }
cEllipsoide.prototype.f = function () { var a = this._a; var f = this._f; return            f               ; }
function cXYZ(pX,pY,pZ) {
    var X;
    var Y;
    var Z;
    this.X = pX;
    this.Y = pY;
    this.Z = pZ;
}
function cRD(pX,pY,pNAP) {
    var X;
    var Y;
    var NAP;
    this.X   = pX;
    this.Y   = pY;
    this.NAP = pNAP;
}
function cGEO(pPhi = undefined, pLambda = undefined, pH = undefined) {
    var Phi;
    var Lambda;
    var H;
    this.Phi    = pPhi;
    this.Lambda = pLambda;
    this.H      = pH;
}
/*
**--------------------------------------------------------------
**    Function name: geographic2cartesian
**    Description:   from geographic coordinates to cartesian coordinates
**
**    Parameter      Type        In/Out Req/Opt Default
**    phi            double      in     req     none
**    lambda         double      in     req     none
**    h              double      in     req     none
**    a              double      in     req     none
**    inv_f          double      in     req     none
**    x              double      out    -       none
**    y              double      out    -       none
**    z              double      out    -       none
**
**    Additional explanation of the meaning of parameters
**    phi      latitude in degrees
**    lambda   longitude in degrees
**    h        ellipsoidal height
**    a        half major axis of the ellisoid
**    inv_f    inverse flattening of the ellipsoid
**    x, y, z  output of cartesian coordinates
**
**    Return value: (besides the standard return values)
**    none
**--------------------------------------------------------------
*/
function GEOnaarXYZ(pGEO) {
    var lRDellisoide = new cEllipsoide(pAslengte = 6377397.155, pAfplatting = 1/299.1528128);
    var a = lRDellisoide.a();  //  Langste as
    var b = lRDellisoide.b();  //  Kortste as
    var f = lRDellisoide.f();  //  Afplatting
    var e = lRDellisoide.e();  //  Eccentriciteit
    var sinPhi    = Math.sin(pGEO.Phi    * Math.pi / 180);
    var cosPhi    = Math.cos(pGEO.Phi    * Math.pi / 180);
    var sinLambda = Math.sin(pGEO.Lambda * Math.pi / 180);
    var cosLambda = Math.cos(pGEO.Lambda * Math.pi / 180);
    var h = pGEO.H;
    var n = a / Math.sqrt(1.0 - e*e * sinPhi*sinPhi); // n  second (East West) principal radius of curvature
    var x = (n + h) * cosPhi * cosLambda;
    var y = (n + h) * cosPhi * sinLambda;
    var z = (n * (1.0-e*e) + h) * sinPhi;
    return new cXYZ(x,y,z);
}
function RDnaarPseudoRD(pRD) {
    var lPseudoRD = new cRD(pRD.X, pRD.Y, pRD.NAP);
    return lPseudoRD;
}
function RDnaarGeoRD(pRD) {

void inv_rd_projection(double x_rd, double y_rd,
                       double& phi, double& lambda)
{
    /*
    **--------------------------------------------------------------
    **    Source: G. Bakker, J.C. de Munck and G.L. Strang van Hees, "Radio Positioning at Sea". Delft University of Technology, 1995.
    **            G. Strang van Hees, "Globale en lokale geodetische systemen". Delft: Nederlandse Commissie voor Geodesie (NCG), 1997.
    **--------------------------------------------------------------
    */
    /*
    **--------------------------------------------------------------
    **    Explanation of the meaning of constants:
    **        f                         flattening of the ellipsoid
    **        ee                        first eccentricity squared (e squared in some notations)
    **        e                         first eccentricity
    **        eea                       second eccentricity squared (e' squared in some notations)
    **
    **        phi_amersfoort_sphere     latitude of projection base point Amersfoort on sphere in degrees
    **
    **        r1                        first (North South) principal radius of curvature in Amersfoort (M in some notations)
    **        r2                        second (East West) principal radius of curvature in Amersfoort (N in some notations)
    **        r_sphere                  radius of sphere
    **
    **        n                         constant of Gaussian projection n = 1.000475...
    **        q_amersfoort              isometric latitude of Amersfoort on ellipsiod
    **        w_amersfoort              isometric latitude of Amersfoort on sphere
    **        m                         constant of Gaussian projection m = 0.003773... (also named c in some notations)
    **--------------------------------------------------------------
    */
    const double f = 1/INV_F_BESSEL;
    const double ee = f*(2-f);
    const double e = sqrt(ee);
    const double eea = ee/(1.0-ee);
    const double phi_amersfoort_sphere = deg_atan(deg_tan(PHI_AMERSFOORT_BESSEL)/sqrt(1+eea*pow(deg_cos(PHI_AMERSFOORT_BESSEL),2)));
    const double r1 = A_BESSEL*(1-ee)/pow(sqrt(1-ee*pow(deg_sin(PHI_AMERSFOORT_BESSEL),2)),3);
    const double r2 = A_BESSEL/sqrt(1.0-ee*pow(deg_sin(PHI_AMERSFOORT_BESSEL),2));
    const double r_sphere = sqrt(r1*r2);
    const double n = sqrt(1+eea*pow(deg_cos(PHI_AMERSFOORT_BESSEL),4));
    const double q_amersfoort = atanh(deg_sin(PHI_AMERSFOORT_BESSEL))-e*atanh(e*deg_sin(PHI_AMERSFOORT_BESSEL));
    const double w_amersfoort = log(deg_tan(45+0.5*phi_amersfoort_sphere));
    const double m = w_amersfoort-n*q_amersfoort;
    /*
    **--------------------------------------------------------------
    **    Explanation of the meaning of variables:
    **        r                    distance from Amersfoort in projection plane
    **        alpha                azimuth from Amersfoort
    **        psi                  distance angle from Amersfoort on sphere in degrees
    **        phi_sphere           latitide on sphere in degrees
    **        delta_lambda_sphere  difference in longitude on sphere with Amersfoort in degrees
    **        w                    isometric latitude on sphere
    **        q                    isometric latitude on ellipsiod
    **--------------------------------------------------------------
    */
    double r                   = sqrt(pow(x_rd-X_AMERSFOORT_RD,2)+pow(y_rd-Y_AMERSFOORT_RD,2));
    double sin_alpha           = (x_rd-X_AMERSFOORT_RD)/r;
    if (r<PRECISION) sin_alpha = 0;
    double cos_alpha           = (y_rd-Y_AMERSFOORT_RD)/r;
    if (r<PRECISION) cos_alpha = 1;
    double psi                 = 2*deg_atan(r/(2*SCALE_RD*r_sphere));
    double phi_sphere          = deg_asin(cos_alpha*deg_cos(phi_amersfoort_sphere)*deg_sin(psi)+deg_sin(phi_amersfoort_sphere)*deg_cos(psi));
    double delta_lambda_sphere = deg_asin((sin_alpha*deg_sin(psi))/deg_cos(phi_sphere));
    lambda = delta_lambda_sphere/n+LAMBDA_AMERSFOORT_BESSEL;
    double w = atanh(deg_sin(phi_sphere));
    double q = (w-m)/n;
    /*
    **--------------------------------------------------------------
    **    Iterative calculation of phi
    **--------------------------------------------------------------
    */
    phi=0;
    double previous;
    double diff=90;
    while (diff>DEG_PRECISION)
    {
        previous = phi;
        phi      = 2*deg_atan(exp(q+0.5*e*log((1+e*deg_sin(phi))/(1-e*deg_sin(phi)))))-90;
        diff     = fabs(phi-previous);
    }
}



}
/*
**--------------------------------------------------------------
**    Function name: rd2etrs
**    Description:   convert RD coordinates to ETRS89 coordinates
**
**    Parameter      Type        In/Out Req/Opt Default
**    x_rd           double      in     req     none
**    y_rd           double      in     req     none
**    nap            double      in     req     none
**    phi_etrs       double      out    -       none
**    lambda_etrs    double      out    -       none
**
**    Additional explanation of the meaning of parameters
**    x_rd, y_rd, nap        input RD and NAP coordinates
**    phi_etrs, lambda_etrs  output ETRS89 coordinates
**
**    Return value: (besides the standard return values)
**    none
**--------------------------------------------------------------
*/
function RDnaarETRS(pRD) {
    var lAmersfoortGEO = new cGEO(52.0+ 9.0/60.0+22.178/3600.0, 5.0+23.0/60.0+15.500/3600.0, 0.0);
    var lAmersfoortXYZ  = geographic2cartesian(lAmersfoortGEO);
    var lPseudoRD = RDnaarPseudoRD(pRD);  //  Pas het correctiegrid in omgekeerde richting toe
    var lGeoRD = RDnaarGeoRD(lPseudoRD);  //  Bepaal de hoeken obv RD X en Y.

    var lETRS = new cETRS();
    return lETRS;
}
int rd2etrs(double x_rd, double y_rd, double nap,
            double& phi_etrs, double& lambda_etrs, double& h_etrs)
{
    int error;
    double x_pseudo_rd, y_pseudo_rd;
    double phi_bessel, lambda_bessel, h_bessel;
    double x_bessel, y_bessel, z_bessel;
    double x_etrs, y_etrs, z_etrs;
    double x_amersfoort_bessel;
    double y_amersfoort_bessel;
    double z_amersfoort_bessel;
    //--------------------------------------------------------------
    h_bessel = nap + MEAN_GEOID_HEIGHT_BESSEL;
    //--------------------------------------------------------------
    inv_rd_projection(x_pseudo_rd, y_pseudo_rd,
                      phi_bessel, lambda_bessel);
    geographic2cartesian(phi_bessel, lambda_bessel, h_bessel,
                         A_BESSEL, INV_F_BESSEL,
                         x_bessel, y_bessel, z_bessel);
    sim_trans(x_bessel, y_bessel, z_bessel,
              TX_BESSEL_ETRS, TY_BESSEL_ETRS, TZ_BESSEL_ETRS,
              ALPHA_BESSEL_ETRS, BETA_BESSEL_ETRS, GAMMA_BESSEL_ETRS,
              DELTA_BESSEL_ETRS,
              x_amersfoort_bessel, y_amersfoort_bessel, z_amersfoort_bessel,
              x_etrs, y_etrs, z_etrs);
    cartesian2geographic(x_etrs, y_etrs, z_etrs,
                         A_ETRS, INV_F_ETRS,
                         phi_etrs, lambda_etrs, h_etrs);
    /*
    **--------------------------------------------------------------
    **    To convert to degrees, minutes and seconds use the function decimal2deg_min_sec() here
    **--------------------------------------------------------------
    */
    return error;
}





function Hoofdprogramma() {

    var lRDellisoide = new cEllipsoide(pAslengte = 6377397.155, pAfplatting = 1/299.1528128);
    console.log(lRDellisoide.a());
    console.log(lRDellisoide.b());
    console.log(lRDellisoide.e());
    console.log(lRDellisoide.f());
    console.log(1/lRDellisoide.f());
}
