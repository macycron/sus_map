var cleanweb_map = cleanweb_map || (function () {

    var init = function(){

        map = new OpenLayers.Map("mapdiv", {
            displayProjection: new OpenLayers.Projection("EPSG:4326")
            });
        map.addLayer(new OpenLayers.Layer.OSM({
            isBaseLayer: true,
            sphericalMercator:true
        }));

        var wms_projection = new OpenLayers.Projection("EPSG:4326");
        var google_projection = new OpenLayers.Projection("EPSG:900913");

        var lonLat = new OpenLayers.LonLat( -71.0603, 42.3583 )
            .transform(
            new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
            map.getProjectionObject() // to Spherical Mercator Projection
        );

        var zoom=14;

        var markers = new OpenLayers.Layer.Markers( "Markers" );
        map.addLayer(markers);
        markers.addMarker(new OpenLayers.Marker(lonLat));

//        var windTurbines =  new OpenLayers.Geometry.Point("KML", {
//            projection: map.displayProjection,
//            strategies: [new OpenLayers.Strategy.Fixed()],
//            protocol: new OpenLayers.Protocol.HTTP({
//                url: "kml_data/NREL_MA_50m_Wind_Resource.kml",
//                format: new OpenLayers.Format.KML({
//                    extractStyles: true,
//                    extractAttributes: true
//                })
//            })
//        });
//
//        map.addLayer(windTurbines);
/*
*/
        var bikeTrails =  new OpenLayers.Layer.Vector("KML", {
            projection: map.displayProjection,
            strategies: [new OpenLayers.Strategy.Fixed()],
            protocol: new OpenLayers.Protocol.HTTP({
                url: "kml_data/bikeTrails.kml",
                format: new OpenLayers.Format.KML({
                    extractStyles: true,
                    extractAttributes: true
                })
            })
        });

        map.addLayer(bikeTrails);

        //var select = new OpenLayers.Control.SelectFeature(bikeTrails);

        //bikeTrails.events.on({
        //    "featureselected": onFeatureSelect,
        //    "featureunselected": onFeatureUnselect
        //});

        //map.addControl(select);
        //select.activate();
/* 
*/
//Electric Charging Stations 
map.addControl(new OpenLayers.Control.LayerSwitcher());
var proj = new OpenLayers.Projection("EPSG:4326");
var pointLayer = new OpenLayers.Layer.Vector("Point Layer", {
    maxExtent: new OpenLayers.Bounds(-200,-200,200,200),
    style: {externalGraphic: 'elec.jpg', graphicWidth: 21, graphicHeight: 25}
});
map.addLayers([markers, pointLayer]);

var stationServiceUrl = 'http://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.json?api_key=b908359a2bbf6c31c4bb7ba24f5b5e502612c0e3&location=Boston+MA&fuel_type=ELEC';        
$.getJSON(stationServiceUrl,function(json){    
    fuel_stations = json.fuel_stations;
    $.each(fuel_stations, function(index, station) {
       //alert("lat:"+station.latitude+",long:"+station.longitude);
        var lonlat = new OpenLayers.LonLat(station.longitude, station.latitude);
        lonlat.transform(proj, map.getProjectionObject());
        map.setCenter(lonlat, zoom);

        var point = new OpenLayers.Geometry.Point(station.longitude, station.latitude);
        point = point.transform(proj, map.getProjectionObject());
        //alert(point);
        var pointFeature = new OpenLayers.Feature.Vector(point, null, null);
        pointLayer.addFeatures([pointFeature]);
    });
});     
            

/* 
*/
// make a kml for the data types that we don't have yet
// eg. chp plants


/* This is the last thing for the map to display centered
*/
        map.setCenter (lonLat, zoom);
    };
/* Functions to handle selecting different features 
*/

    //var onPopupClose = function(evt) {
    //    select.unselectAll();
    //};
    //
    //var onFeatureSelect = function(event){
    //    var feature = event.feature;
    //    var selectedFeature = feature;
    //    var popup = new OpenLayers.Popup.FramedCloud("chicken",
    //        feature.geometry.getBounds().getCenterLonLat(),
    //        new OpenLayers.Size(100,100),
    //        "<h2>"+feature.attributes.name + "</h2>" + feature.attributes.description,
    //        null, true, onPopupClose
    //    );
    //    feature.popup = popup;
    //    map.addPopup(popup);
    //};
    //
    //var onFeatureUnselect = function(event){
    //    var feature = event.feature;
    //    if(feature.popup) {
    //        map.removePopup(feature.popup);
    //        feature.popup.destroy();
    //        delete feature.popup;
    //    }
    //};

    return {
        init: init
    }

})();