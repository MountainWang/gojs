// initialize the map on the "map" div with a given center and zoom
var map = new L.Map('map', {
  zoom: 6,
  minZoom: 3,
});

// create a new tile layer
var tileUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
layer = new L.TileLayer(tileUrl,
{
    attribution: 'Maps © <a href=\"www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors',
    maxZoom: 18
});

// add the layer to the map
map.addLayer(layer);

var parisKievLL = [[48.8567, 2.3508], [50.45, 30.523333]];
var londonParisRomeBerlinBucarest = [[51.507222, -0.1275], [48.8567, 2.3508],
[41.9, 12.5], [52.516667, 13.383333], [44.4166,26.1]];




map.fitBounds(londonParisRomeBerlinBucarest);

//========================================================================
var marker1 = L.Marker.movingMarker(parisKievLL, [10000]).addTo(map);
L.polyline(parisKievLL).addTo(map);
marker1.once('click', function () {
    marker1.start();
    marker1.closePopup();
    marker1.unbindPopup();
    marker1.on('click', function() {
        if (marker1.isRunning()) {
            marker1.pause();
        } else {
            marker1.start();
        }
    });
    setTimeout(function() {
        marker1.bindPopup('<b>Click me to pause !</b>').openPopup();
    }, 2000);
});

marker1.bindPopup('<b>Click me to start !</b>', {closeOnClick: false});
marker1.openPopup();
