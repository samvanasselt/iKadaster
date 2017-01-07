//  https://openlayersbook.github.io/index.html
//  http://openlayers.org/en/master/apidoc/ol.Map.html
//  http://gis.stackexchange.com/questions/58201/openlayers-multiple-layers-with-different-projection
function ToonOSM() {
    // EPSG:3857 ipv EPSG:900913
    proj4.defs("EPSG:28992", "+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +no_defs");
    var projectionExtent = [-285401.92,22598.08,595400,903400];
    // var RDnieuw = new ol.proj.Projection({code:'EPSG:28992', units:'m', extent: projectionExtent});
    // ol.proj.addProjection(RDnieuw);
    var lMiddenRD  = ol.extent.getCenter(projectionExtent);
    // var lMiddenOSM = ol.proj.transform(lMiddenRD,'EPSG:28992','EPSG:900913');   //  Reken RD om naar OSM    
    var lMiddenOSM = ol.proj.transform(lMiddenRD,'EPSG:28992','EPSG:3857');   //  Reken RD om naar OSM    
    console.log(lMiddenRD);
    console.log(lMiddenOSM);
    var lLagen = [];
        lLagen.push( new ol.layer.Tile({ source: new ol.source.OSM(), opacity: 1.0 }) );
    var lView =      new ol.View({ center: lMiddenOSM, zoom: 14 });
    var lMap = new ol.Map({target:'OSM'});
    lMap.addLayer(lLagen[0]);
    lMap.setView(lView);
}
function ToonBRT() {
    // proj4.defs("EPSG:28992", "+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +no_defs");
    var projectionExtent = [-285401.92,22598.08,595400,903400];
    var RDnieuw = new ol.proj.Projection({code:'EPSG:28992', units:'m', extent: projectionExtent});
    ol.proj.addProjection(RDnieuw);
    var lMiddenRD  = ol.extent.getCenter(projectionExtent);
    var size = ol.extent.getWidth(projectionExtent) / 256;
    var resolutions = [3440.64, 1720.32, 860.16, 430.08, 215.04, 107.52, 53.76, 26.88, 13.44, 6.72, 3.36, 1.68, 0.84, 0.42]
    var matrixIds = new Array(14);
    for (var z = 0; z < 15; ++z) {
        // generate resolutions and matrixIds arrays for this WMTS
        matrixIds[z] = 'EPSG:28992:' + z;
    }
    console.log(resolutions);
    console.log(matrixIds);
    
    var lTileGrid = new ol.tilegrid.WMTS({
              origin: ol.extent.getTopLeft(projectionExtent),
              resolutions: resolutions,
              matrixIds: matrixIds
            });
    var lWMTS = new ol.source.WMTS({
            url: 'http://geodata.nationaalgeoregister.nl/tiles/service/wmts/brtachtergrondkaart',
            layer: 'brtachtergrondkaart',
            matrixSet: 'EPSG:28992',
            format: 'image/png',
            projection: RDnieuw,
            tileGrid: lTileGrid
          });                
    
    var lLagen = [];
        lLagen.push( new ol.layer.Tile({ source: lWMTS, extent: projectionExtent, opacity:1.0 }));
    var lView = new ol.View({ center: lMiddenRD, zoom: 15 });
    
    var map = new ol.Map({
        maxExtent: projectionExtent,
        layers: lLagen,
        target: 'BRT',
        theme: null,
        maxResolution: 860.16,
        numZoomLevels: 12,
        units: 'm',
        displayProjection: RDnieuw,
        view: lView
    });
}
function ToonOSMBRT() {}



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


