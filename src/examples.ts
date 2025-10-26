// Leaflet examples and tutorials

export const LEAFLET_EXAMPLES = `# Leaflet Examples Collection

## Quick Start
https://leafletjs.com/examples/quick-start/

Basic map setup with markers and popups.

\`\`\`javascript
var map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

var marker = L.marker([51.5, -0.09]).addTo(map)
  .bindPopup('A popup!').openPopup();
\`\`\`

---

## Mobile-Friendly Maps
https://leafletjs.com/examples/mobile/

Fullscreen map with geolocation for mobile devices.

\`\`\`javascript
var map = L.map('map', {
  center: [51.505, -0.09],
  zoom: 13,
  minZoom: 2,
  maxZoom: 18
});

// Get user location
map.locate({setView: true, maxZoom: 16});

map.on('locationfound', function(e) {
  var radius = e.accuracy / 2;
  L.marker(e.latlng).addTo(map)
    .bindPopup("You are within " + radius + " meters");
  L.circle(e.latlng, radius).addTo(map);
});

map.on('locationerror', function(e) {
  alert(e.message);
});
\`\`\`

---

## Custom Marker Icons
https://leafletjs.com/examples/custom-icons/

Create and use custom icons for markers.

\`\`\`javascript
var greenIcon = L.icon({
  iconUrl: 'leaf-green.png',
  shadowUrl: 'leaf-shadow.png',
  iconSize: [38, 95],
  shadowSize: [50, 64],
  iconAnchor: [22, 94],
  shadowAnchor: [4, 62],
  popupAnchor: [-3, -76]
});

L.marker([51.5, -0.09], {icon: greenIcon}).addTo(map);

// Icon with different states
var LeafIcon = L.Icon.extend({
  options: {
    shadowUrl: 'leaf-shadow.png',
    iconSize: [38, 95],
    shadowSize: [50, 64],
    iconAnchor: [22, 94],
    shadowAnchor: [4, 62],
    popupAnchor: [-3, -76]
  }
});

var greenIcon = new LeafIcon({iconUrl: 'leaf-green.png'});
var redIcon = new LeafIcon({iconUrl: 'leaf-red.png'});
var orangeIcon = new LeafIcon({iconUrl: 'leaf-orange.png'});
\`\`\`

---

## GeoJSON
https://leafletjs.com/examples/geojson/

Display and interact with GeoJSON data.

\`\`\`javascript
var geojsonFeature = {
  "type": "Feature",
  "properties": {
    "name": "Coors Field",
    "amenity": "Baseball Stadium",
    "popupContent": "Home of the Rockies!"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [-104.99404, 39.75621]
  }
};

L.geoJSON(geojsonFeature, {
  onEachFeature: function(feature, layer) {
    if (feature.properties && feature.properties.popupContent) {
      layer.bindPopup(feature.properties.popupContent);
    }
  }
}).addTo(map);

// Custom styling
L.geoJSON(geojsonData, {
  style: function(feature) {
    return {color: feature.properties.color};
  },
  pointToLayer: function(feature, latlng) {
    return L.circleMarker(latlng, {
      radius: 8,
      fillColor: "#ff7800",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    });
  }
}).addTo(map);
\`\`\`

---

## Interactive Choropleth Map
https://leafletjs.com/examples/choropleth/

Data visualization with color-coded regions.

\`\`\`javascript
// Define color scale
function getColor(d) {
  return d > 1000 ? '#800026' :
         d > 500  ? '#BD0026' :
         d > 200  ? '#E31A1C' :
         d > 100  ? '#FC4E2A' :
         d > 50   ? '#FD8D3C' :
         d > 20   ? '#FEB24C' :
         d > 10   ? '#FED976' :
                    '#FFEDA0';
}

// Style function
function style(feature) {
  return {
    fillColor: getColor(feature.properties.density),
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7
  };
}

// Interaction
function highlightFeature(e) {
  var layer = e.target;
  layer.setStyle({
    weight: 5,
    color: '#666',
    dashArray: '',
    fillOpacity: 0.7
  });
  info.update(layer.feature.properties);
}

function resetHighlight(e) {
  geojson.resetStyle(e.target);
  info.update();
}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature
  });
}

var geojson = L.geoJSON(statesData, {
  style: style,
  onEachFeature: onEachFeature
}).addTo(map);
\`\`\`

---

## Layer Groups and Layers Control
https://leafletjs.com/examples/layers-control/

Organize layers and add control to switch between them.

\`\`\`javascript
// Base layers
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
var satellite = L.tileLayer('https://server.arcgisonline.com/...');

// Overlay layers
var cities = L.layerGroup([
  L.marker([39.61, -105.02]).bindPopup('Denver'),
  L.marker([39.74, -104.99]).bindPopup('Boulder')
]);

var markers = L.layerGroup([
  L.marker([51.5, -0.09]),
  L.marker([51.495, -0.083])
]);

// Create map with default layers
var map = L.map('map', {
  center: [39.73, -104.99],
  zoom: 10,
  layers: [osm, cities]
});

// Add layers control
var baseMaps = {
  "OpenStreetMap": osm,
  "Satellite": satellite
};

var overlayMaps = {
  "Cities": cities,
  "Markers": markers
};

L.control.layers(baseMaps, overlayMaps).addTo(map);
\`\`\`

---

## Working with Popups
https://leafletjs.com/examples/custom-icons/

Different ways to use popups.

\`\`\`javascript
// Standalone popup
var popup = L.popup()
  .setLatLng([51.513, -0.09])
  .setContent("I am a standalone popup.")
  .openOn(map);

// Popup with custom options
marker.bindPopup("Popup content", {
  maxWidth: 250,
  className: 'custom-popup'
});

// Popup with HTML
var customPopup = \`
  <div class="custom-popup">
    <h3>Title</h3>
    <p>Description here</p>
    <button onclick="alert('Clicked!')">Click</button>
  </div>
\`;

marker.bindPopup(customPopup, {
  maxWidth: 300,
  closeButton: false
});
\`\`\`

---

## Using WMS and TMS Services
https://leafletjs.com/examples/wms/

Integrate with professional GIS services.

\`\`\`javascript
// WMS layer
var nexrad = L.tileLayer.wms("http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi", {
  layers: 'nexrad-n0r-900913',
  format: 'image/png',
  transparent: true,
  attribution: "Weather data © NOAA"
});

// Single tile WMS
var wmsLayer = L.tileLayer.wms('http://ows.mundialis.de/services/service?', {
  layers: 'TOPO-WMS'
});

map.addLayer(nexrad);
\`\`\`

---

## Non-geographical Maps
https://leafletjs.com/examples/crs-simple/

Use Leaflet for non-geographical images (game maps, floor plans).

\`\`\`javascript
// Simple CRS for pixel coordinates
var map = L.map('map', {
  crs: L.CRS.Simple,
  minZoom: -5,
  maxZoom: 4
});

// Image overlay
var bounds = [[0,0], [1000, 1000]];
var image = L.imageOverlay('uqm_map_full.png', bounds).addTo(map);

map.fitBounds(bounds);

// Add markers with pixel coordinates
var marker = L.marker([750, 500]).addTo(map)
  .bindPopup('Coordinates: 750, 500');
\`\`\`

---

## Map Panes
https://leafletjs.com/examples/map-panes/

Control layer ordering with custom panes.

\`\`\`javascript
// Create custom pane
map.createPane('labels');
map.getPane('labels').style.zIndex = 650;
map.getPane('labels').style.pointerEvents = 'none';

// Add layers to panes
var positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png').addTo(map);

var positronLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
  pane: 'labels'
}).addTo(map);
\`\`\`

---

## Video Overlay
https://leafletjs.com/examples/video-overlay/

Add video as a map overlay.

\`\`\`javascript
var videoUrls = [
  'https://example.com/video.webm',
  'https://example.com/video.mp4'
];

var videoBounds = [
  [32, -130],
  [13, -100]
];

var videoOverlay = L.videoOverlay(videoUrls, videoBounds, {
  opacity: 0.8,
  autoplay: true,
  loop: true
}).addTo(map);
\`\`\`

---

## Zoom Levels
https://leafletjs.com/examples/zoom-levels/

Understanding and controlling zoom levels.

\`\`\`javascript
// Zoom to bounds
var bounds = [
  [40.712, -74.227],
  [40.774, -74.125]
];
map.fitBounds(bounds);

// Smooth animated zoom
map.flyTo([51.505, -0.09], 13, {
  duration: 2
});

// Zoom with animation
map.setZoom(15, {
  animate: true,
  duration: 1
});

// Restrict zoom levels
var map = L.map('map', {
  minZoom: 10,
  maxZoom: 16,
  maxBounds: bounds,
  maxBoundsViscosity: 1.0
});
\`\`\`

---

## Extending Leaflet
https://leafletjs.com/examples/extending/

Create custom classes and controls.

\`\`\`javascript
// Custom control
L.Control.Watermark = L.Control.extend({
  onAdd: function(map) {
    var img = L.DomUtil.create('img');
    img.src = 'logo.png';
    img.style.width = '200px';
    return img;
  }
});

L.control.watermark = function(opts) {
  return new L.Control.Watermark(opts);
}

L.control.watermark({ position: 'bottomleft' }).addTo(map);

// Custom layer
L.GridLayer.DebugCoords = L.GridLayer.extend({
  createTile: function (coords) {
    var tile = document.createElement('div');
    tile.innerHTML = [coords.x, coords.y, coords.z].join(', ');
    tile.style.outline = '1px solid red';
    return tile;
  }
});

L.gridLayer.debugCoords = function(opts) {
  return new L.GridLayer.DebugCoords(opts);
};

map.addLayer(L.gridLayer.debugCoords());
\`\`\`

---

## Accessibility
https://leafletjs.com/examples/accessibility/

Make maps accessible.

\`\`\`javascript
// Keyboard navigation
var map = L.map('map', {
  keyboard: true,
  keyboardPanDelta: 80
});

// ARIA labels
var marker = L.marker([51.5, -0.09], {
  keyboard: true,
  title: 'London',
  alt: 'Marker showing London location'
}).addTo(map);

// Focus control
map.on('focus', function() {
  console.log('Map focused');
});
\`\`\`

---

## Performance Tips

### Marker Clustering
Use Leaflet.markercluster for many markers:
\`\`\`javascript
var markers = L.markerClusterGroup();
for (var i = 0; i < 1000; i++) {
  markers.addLayer(L.marker(getRandomLatLng()));
}
map.addLayer(markers);
\`\`\`

### Canvas Renderer
Use Canvas for better performance with many vectors:
\`\`\`javascript
var map = L.map('map', {
  renderer: L.canvas()
});
\`\`\`

### Simplify Geometries
Reduce points for better performance:
\`\`\`javascript
var polyline = L.polyline(coordinates, {
  smoothFactor: 3.0
}).addTo(map);
\`\`\`

---

For more examples, visit: https://leafletjs.com/examples.html
`;
