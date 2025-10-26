// Leaflet plugins directory

export const LEAFLET_PLUGINS = `# Leaflet Plugins Directory

A curated list of popular and useful Leaflet plugins organized by category.

---

## Marker Plugins

### Leaflet.markercluster
**Beautiful, performant marker clustering**
- GitHub: https://github.com/Leaflet/Leaflet.markercluster
- CDN: https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js
- Perfect for displaying thousands of markers

\`\`\`javascript
var markers = L.markerClusterGroup();
markers.addLayer(L.marker([51.5, -0.09]));
map.addLayer(markers);
\`\`\`

### Leaflet.awesome-markers
**Colorful, iconic markers with Font Awesome**
- GitHub: https://github.com/lennardv2/Leaflet.awesome-markers
- Supports Font Awesome icons and custom colors

\`\`\`javascript
var redMarker = L.AwesomeMarkers.icon({
  icon: 'coffee',
  markerColor: 'red'
});
L.marker([51.5, -0.09], {icon: redMarker}).addTo(map);
\`\`\`

### Leaflet.ExtraMarkers
**Custom colored markers with icons**
- GitHub: https://github.com/coryasilva/Leaflet.ExtraMarkers
- Alternative to awesome-markers with more shapes

### Leaflet.BeautifyIcon
**Lightweight, customizable markers**
- GitHub: https://github.com/marslan390/BeautifyMarker
- Simple HTML/CSS based markers

### Leaflet.Photo
**Image markers for photo galleries**
- GitHub: https://github.com/turban/Leaflet.Photo
- Display photos as markers with popups

---

## Drawing & Editing

### Leaflet.draw
**Vector drawing and editing tools**
- GitHub: https://github.com/Leaflet/Leaflet.draw
- Official drawing plugin
- Draw markers, polylines, polygons, rectangles, circles

\`\`\`javascript
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

var drawControl = new L.Control.Draw({
  edit: {
    featureGroup: drawnItems
  }
});
map.addControl(drawControl);
\`\`\`

### Leaflet.Editable
**Lightweight geometry editing**
- GitHub: https://github.com/Leaflet/Leaflet.Editable
- Make any path editable

### Leaflet.Path.Drag
**Drag vector layers**
- GitHub: https://github.com/w8r/Leaflet.Path.Drag
- Drag polylines and polygons

### Leaflet.FreeDraw
**Freehand drawing plugin**
- GitHub: https://github.com/Wildhoney/Leaflet.FreeDraw
- Draw freehand polygons

---

## Data Visualization

### Leaflet.heat
**Simple, fast heatmap visualization**
- GitHub: https://github.com/Leaflet/Leaflet.heat
- Official heatmap plugin

\`\`\`javascript
var heat = L.heatLayer([
  [50.5, 30.5, 0.2],
  [50.6, 30.4, 0.5]
], {radius: 25}).addTo(map);
\`\`\`

### Leaflet.WebGLHeatmap
**High-performance WebGL heatmaps**
- GitHub: https://github.com/ursudio/leaflet-webgl-heatmap
- Better for large datasets

### Leaflet.Hexbin
**Hexagonal binning for point data**
- GitHub: https://github.com/bluehalo/leaflet-d3
- D3-powered hexbin visualization

### Leaflet.TimeDimension
**Temporal data visualization**
- GitHub: https://github.com/socib/Leaflet.TimeDimension
- Animate temporal data with time controls

---

## Routing & Navigation

### Leaflet Routing Machine
**Turn-by-turn routing**
- Website: https://www.liedman.net/leaflet-routing-machine/
- GitHub: https://github.com/perliedman/leaflet-routing-machine
- Multiple routing providers (OSRM, Mapbox, etc.)

\`\`\`javascript
L.Routing.control({
  waypoints: [
    L.latLng(57.74, 11.94),
    L.latLng(57.6792, 11.949)
  ]
}).addTo(map);
\`\`\`

### Leaflet.Polyline.SnakeAnim
**Animated polylines**
- GitHub: https://github.com/IvanSanchez/Leaflet.Polyline.SnakeAnim
- Snake animation for routes

### Leaflet.AnimatedMarker
**Animate marker movement**
- GitHub: https://github.com/openplans/Leaflet.AnimatedMarker
- Move markers along paths

---

## Controls

### Leaflet.fullscreen
**Fullscreen map control**
- GitHub: https://github.com/brunob/leaflet.fullscreen
- Simple fullscreen toggle

\`\`\`javascript
L.control.fullscreen().addTo(map);
\`\`\`

### Leaflet.EasyButton
**Simple button controls**
- GitHub: https://github.com/CliffCloud/Leaflet.EasyButton
- Easy custom buttons with Font Awesome

\`\`\`javascript
L.easyButton('fa-globe', function(){
  alert('You clicked the globe!');
}).addTo(map);
\`\`\`

### Leaflet.MiniMap
**Overview minimap**
- GitHub: https://github.com/Norkart/Leaflet-MiniMap
- Picture-in-picture minimap

\`\`\`javascript
var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var miniMap = new L.Control.MiniMap(L.tileLayer(osmUrl)).addTo(map);
\`\`\`

### Leaflet.Zoomslider
**Zoom slider control**
- GitHub: https://github.com/mattiasbengtsson/Leaflet.Zoomslider
- Replace zoom buttons with slider

### Leaflet.Locate
**Geolocate user control**
- GitHub: https://github.com/domoritz/leaflet-locatecontrol
- Advanced geolocation control

### Leaflet.Coordinates
**Display mouse coordinates**
- GitHub: https://github.com/zimmicz/Leaflet-Coordinates-Control
- Show coordinates on hover

---

## Search & Geocoding

### Leaflet.Search
**Search for markers and features**
- GitHub: https://github.com/stefanocudini/leaflet-search
- Search within map layers

### Leaflet Control Geocoder
**Address search and geocoding**
- GitHub: https://github.com/perliedman/leaflet-control-geocoder
- Multiple geocoding providers

\`\`\`javascript
L.Control.geocoder().addTo(map);
\`\`\`

### Leaflet.GeoSearch
**Geocoding search control**
- GitHub: https://github.com/smeijer/leaflet-geosearch
- Modern geocoding with multiple providers

---

## Layer Management

### Leaflet.GroupedLayerControl
**Grouped layers control**
- GitHub: https://github.com/ismyrnow/leaflet-groupedlayercontrol
- Organize layers in groups

### Leaflet.StyledLayerControl
**Styleable layer control**
- GitHub: https://github.com/davicustodio/Leaflet.StyledLayerControl
- Customizable layer switcher

### Leaflet.Panel.Layers
**Panel-style layer control**
- GitHub: https://github.com/stefanocudini/leaflet-panel-layers
- Modern panel interface

---

## Vector & Shape Plugins

### Leaflet.TextPath
**Text along paths**
- GitHub: https://github.com/makinacorpus/Leaflet.TextPath
- Draw text along polylines

### Leaflet.Curve
**Bezier curves**
- GitHub: https://github.com/elfalem/Leaflet.curve
- Draw curved lines

### Leaflet.Arc
**Great circle arcs**
- GitHub: https://github.com/MAD-GooZe/Leaflet.Arc
- Draw geodesic arcs

### Leaflet.Geodesic
**Geodesic lines and polygons**
- GitHub: https://github.com/henrythasler/Leaflet.Geodesic
- True geodesic shapes

### Leaflet.GeometryUtil
**Geometry utilities**
- GitHub: https://github.com/makinacorpus/Leaflet.GeometryUtil
- Geometric calculations

---

## Tile Providers

### Leaflet-providers
**Pre-configured tile providers**
- GitHub: https://github.com/leaflet-extras/leaflet-providers
- Easy access to 100+ tile providers

\`\`\`javascript
L.tileLayer.provider('OpenStreetMap.Mapnik').addTo(map);
L.tileLayer.provider('CartoDB.Positron').addTo(map);
\`\`\`

### Leaflet.TileLayer.Grayscale
**Grayscale tiles**
- GitHub: https://github.com/Zverik/leaflet-grayscale
- Convert any tiles to grayscale

---

## Measurement

### Leaflet.Measure
**Distance and area measurement**
- GitHub: https://github.com/ljagis/leaflet-measure
- Measure distances and areas

### Leaflet.MeasureControl
**Simple measurement tool**
- GitHub: https://github.com/perliedman/leaflet-measure-control
- Lightweight measurement

### Leaflet.Ruler
**Ruler for measuring distances**
- GitHub: https://github.com/gokertanrisever/leaflet-ruler
- Simple distance ruler

---

## Animation

### Leaflet.MovingMarker
**Smooth marker movement**
- GitHub: https://github.com/ewoken/Leaflet.MovingMarker
- Animate markers with speed control

### Leaflet.Spin
**Loading spinner**
- GitHub: https://github.com/makinacorpus/Leaflet.Spin
- Show spinner during loading

### Leaflet.SmoothMarkerBouncing
**Bouncing marker animation**
- GitHub: https://github.com/hosuaby/Leaflet.SmoothMarkerBouncing
- Smooth bouncing effect

---

## Mobile & Touch

### Leaflet.GestureHandling
**Improved mobile gestures**
- GitHub: https://github.com/elmarquis/Leaflet.GestureHandling
- Prevent accidental map interaction

### Leaflet.TouchHelper
**Better touch support**
- GitHub: https://github.com/Leaflet/Leaflet.TouchHelper
- Improved touch interaction

---

## 3D & Advanced

### Leaflet.MapboxGL
**Mapbox GL rendering**
- GitHub: https://github.com/mapbox/mapbox-gl-leaflet
- Use Mapbox GL as Leaflet layer

### Leaflet.D3SvgOverlay
**D3 visualizations**
- GitHub: https://github.com/teralytics/Leaflet.D3SvgOverlay
- Integrate D3.js with Leaflet

### Leaflet.Canvas-Markers
**High-performance canvas markers**
- GitHub: https://github.com/eJuke/Leaflet.Canvas-Markers
- Render thousands of markers

---

## Utility Plugins

### Leaflet.Export
**Export map to image**
- GitHub: https://github.com/rowanwins/leaflet-easyPrint
- Print and export functionality

### Leaflet.PM
**Modern drawing and editing**
- GitHub: https://github.com/geoman-io/leaflet-geoman
- Alternative to Leaflet.draw with more features

### Leaflet.Basemaps
**Basemap gallery**
- GitHub: https://github.com/consbio/Leaflet.Basemaps
- Switch between basemaps with previews

### Leaflet.Sleep
**Prevent scroll zoom interference**
- GitHub: https://github.com/CliffCloud/Leaflet.Sleep
- Disable map on scroll until clicked

---

## Data Formats

### Leaflet-KML
**KML file support**
- GitHub: https://github.com/windycom/Leaflet-KML
- Load and display KML

### Leaflet.Omnivore
**Multiple format parser**
- GitHub: https://github.com/mapbox/leaflet-omnivore
- Parse KML, GPX, TopoJSON, CSV, WKT

### Leaflet-GPX
**GPX track display**
- GitHub: https://github.com/mpetazzoni/leaflet-gpx
- Display GPS tracks

---

## Installation Tips

### Via CDN
\`\`\`html
<link rel="stylesheet" href="plugin.css" />
<script src="plugin.js"></script>
\`\`\`

### Via npm
\`\`\`bash
npm install plugin-name
\`\`\`

\`\`\`javascript
import 'plugin-name';
import 'plugin-name/dist/plugin.css';
\`\`\`

### Load Order
Always load plugins AFTER Leaflet:
\`\`\`html
<script src="leaflet.js"></script>
<script src="plugin.js"></script>
\`\`\`

---

## More Resources

- **Official Plugin List**: https://leafletjs.com/plugins.html
- **Awesome Leaflet**: https://github.com/tomik23/awesome-leaflet
- **NPM Search**: https://www.npmjs.com/search?q=leaflet

## Plugin Development

Create your own plugin:
\`\`\`javascript
L.MyPlugin = L.Class.extend({
  initialize: function(options) {
    L.setOptions(this, options);
  },

  addTo: function(map) {
    this._map = map;
    // Plugin logic
    return this;
  }
});

L.myPlugin = function(options) {
  return new L.MyPlugin(options);
};
\`\`\`

See: https://leafletjs.com/examples/extending/extending-1-classes.html
`;
