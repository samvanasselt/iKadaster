//  https://openlayersbook.github.io/index.html
//  http://openlayers.org/en/master/apidoc/ol.Map.html
//  http://gis.stackexchange.com/questions/58201/openlayers-multiple-layers-with-different-projection
function KaartMidden() {
    proj4.defs("EPSG:28992", "+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +no_defs");
    var projectionExtent = [-285401.92,22598.08,595400,903400];
    var lMiddenRD  = ol.extent.getCenter(projectionExtent);
    var lMiddenOSM = ol.proj.transform(lMiddenRD,'EPSG:28992','EPSG:3857');   //  Reken RD om naar OSM
    console.log(lMiddenRD);
    console.log(lMiddenOSM);
    return lMiddenOSM;
}
function ToonOSM() {
    var lLagen = [];
        lLagen.push( new ol.layer.Tile({ source: new ol.source.OSM(), opacity: 1.0 }) );
    var lView =      new ol.View({ center: KaartMidden(), zoom: 7 });
    var lMap = new ol.Map({target:'OSM'});
    lMap.addLayer(lLagen[0]);
    lMap.setView(lView);
}
function ToonRD() {
    lParams = { 'VERSION': '1.3.0',
              'LAYERS': 'punten',
              'FORMAT': 'image/jpeg'
    };
    // var lBron = new ol.source.ImageWMS( {url:'https://geodata.nationaalgeoregister.nl/rdinfo/ows', params:lParams, serverType:'geoserver', projection:'EPSG:4326'} );
    var lBron = new ol.source.ImageWMS( {url:'https://geodata.nationaalgeoregister.nl/rdinfo/ows', params:lParams, serverType:'geoserver', projection:'EPSG:3857'} );
    // var lLaag = new ol.layer.Image( {extent:[-90,-90,90,90], source:lBron} );
    var lLaag = new ol.layer.Image( {source:lBron} );

    var lMap = new ol.Map({target:'RD'});
    // var lServer = new ol.source.WMSServerType({'geoserver'});
    // var lServer = ol.source.WMSServerType('geoserver');
    // var lLaag = new ol.source.ImageWMS( {url:'https://geodata.nationaalgeoregister.nl/rdinfo/ows', version:'1.3.0', layers:'punten'} );

    var lView =      new ol.View({ center: KaartMidden(), zoom:7 });
    lMap.addLayer(lLaag);
    lMap.setView(lView);
}
function ToonOSMRD() {
    var lMap  = new ol.Map({target:'OSM+RD'});
    // RDinfo
    lParams = { 'VERSION': '1.3.0',
              'LAYERS': 'punten',
              'FORMAT': 'image/jpeg'
    };
    var lBron = new ol.source.ImageWMS( {url:'https://geodata.nationaalgeoregister.nl/rdinfo/ows', params:lParams, serverType:'geoserver', projection:'EPSG:3857'} );
    var lLaag = new ol.layer.Image( {source:lBron, opacity: 0.5 } );
    var lView = new ol.View({ center: KaartMidden(), zoom:7 });
    var lLagen = [];
        lLagen.push( new ol.layer.Tile({ source: new ol.source.OSM(), opacity: 1.0 }) );
    lMap.addLayer(lLagen[0]);
    lMap.addLayer(lLaag);
    lMap.setView(lView);
}



// var map;
// function init() {
        // epsg4326 = new OpenLayers.Projection("EPSG:4326");
        // epsg900913 = new OpenLayers.Projection("EPSG:900913");
        // epsg2180 = new OpenLayers.Projection("EPSG:2180");
// var option = {
    // RDnieuw: new OpenLayers.Projection("EPSG:900913"),
    // displayProjection: new OpenLayers.Projection("EPSG:4326")
// };
       // map = new OpenLayers.Map('mapa', option);

// olmapnik = new OpenLayers.Layer.OSM("OpenStreetMap Mapnik",    "http://tile.openstreetmap.org/${z}/${x}/${y}.png");
// map.addLayer(olmapnik);
// map.setBaseLayer(olmapnik);


// var warstwa_wektor = new OpenLayers.Layer.MapServer("OpenLayers Mapserver", "http://localhost/cgi-bin/mapserv.exe", {map: 'C:/ms4w/map/map_test1.map', layers: 'kilometraz_popr', srs:'EPSG:4326', RDnieuw:epsg900913,
// isBaseLayer: false,
    // visibility: true, transparent: true, format:'image/png'}, {opacity: 1});
// map.addLayer(warstwa_wektor);

// map.addControl
// (new OpenLayers.Control.Scale());
// map.addControl(new OpenLayers.Control.Navigation());
// map.addControl(new OpenLayers.Control.MousePosition());
// map.addControl(new OpenLayers.Control.PanZoomBar());
// map.addControl(new OpenLayers.Control.SelectFeature());
// map.addControl(new OpenLayers.Control.LayerSwitcher());
// map.addControl(new OpenLayers.Control.Permalink());

// extent = new OpenLayers.Bounds(19.50,51.50,21.50,52.7).transform(new  OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
// map.zoomToExtent(extent,5);
// }


