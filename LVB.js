function haalKeuze(pRadioName) {
    var radios = document.getElementsByName(pRadioName);
    for (var i = 0, length = radios.length; i < length; i++) {
    if (radios[i].checked) {
        return radios[i].value;
        break;
    }}
}
function sendLVBrequest() {
    var lURL;
    var lLVBserver;
    var lRequesttype;
    var lRequestversion;
    var lJaartal;
    var lLayerprefix;
    var lLayerpostfix;
    var liFrame;
    var lCoordsystem;
    var lExceptions;
    var lParameters;
    var lParamlist;
    document.getElementById("URLpreview").innerHTML = '&nbsp;';
    
lLVBserver      = haalKeuze("LVBserver"); // document.getElementById("LVBserver").value;
    lRequesttype    = haalKeuze("requesttype");
    lRequestversion = haalKeuze("requestversion");
    lJaartal = document.getElementById("Jaartal").value;
    if (lJaartal < 2012) { lLayerprefix = 'Kadaster_Beeldmateriaal_'; } 
    else                 { lLayerprefix = 'LV_Beeldmateriaal_'      ; }
    if (lJaartal < 2009) { lLayerpostfix = '_Ortho40'; } 
    else                 { lLayerpostfix = '_Ortho10'; }
    if (lRequesttype == 'wmts') {
        lParameters = 
        [ 'service=wmts'
        , 'request=GetTile'
        , 'version=1.0.0'
        , 'layer=' + lLayerprefix + lJaartal + lLayerpostfix
        , 'style=default'
        , 'format=image/png'
        , 'tileMatrixSet=epsg:28992'
        , 'tileMatrix=1'
        , 'tileRow=1'
        , 'tileCol=1'
        ];
    } else {
    lParameters = 
    [ 'request=GetMap'
    , 'version=' + lRequestversion
    , 'width=100&height=100&bbox=0,300000,300000,600000'
    , 'layers=' + lLayerprefix + lJaartal + lLayerpostfix
    , 'format=image%2Fjpeg'
    ];
    if (lRequestversion == '1.1.1') {
        lCoordsystem = 'srs=EPSG%3A28992'; 
        lExceptions  = 'EXCEPTIONS=application%2Fvnd.ogc.se_xml';
        lParameters.push(lCoordsystem);
        lParameters.push(lExceptions);
    } else {
        lCoordsystem = 'crs=EPSG%3A28992'; 
        lExceptions  = '';
        lParameters.push(lCoordsystem);
    } 
    lParameters.push('styles=');
    }
    // lParamlist = '';
    // lParameters.forEach(function(pValue, pIndex) { lParamlist = lParamlist + pValue; });
    lURL = "http://10.91.7." + 
lLVBserver + ":8080/erdas-iws/ogc/" + lRequesttype + "/" + lJaartal; 
    liFrame = '<iframe src="' + lURL + '?' + lParameters.join('&') + '"></iframe>';
    document.getElementById("URLpreview").innerHTML = lURL + '<br />' + liFrame  + '<br />' + lParameters.join('<br />'); 

}
