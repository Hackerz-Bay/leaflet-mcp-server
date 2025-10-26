// Leaflet documentation content

export const LEAFLET_DOCS = {
  apiReference: `# Leaflet API Reference

## Map

### Creation
\`\`\`javascript
L.map(id, options?)
\`\`\`

### Options
- **center**: LatLng - Initial geographical center
- **zoom**: Number - Initial zoom level
- **minZoom**: Number - Minimum zoom level
- **maxZoom**: Number - Maximum zoom level
- **layers**: Layer[] - Layers to add initially
- **maxBounds**: LatLngBounds - Restrict map to bounds
- **zoomControl**: Boolean - Whether to add zoom control (default: true)
- **attributionControl**: Boolean - Whether to add attribution control (default: true)

### Methods
- **setView(center, zoom, options?)** - Set map center and zoom
- **fitBounds(bounds, options?)** - Fit map to bounds
- **panTo(latlng, options?)** - Pan to location
- **flyTo(latlng, zoom?, options?)** - Animated pan/zoom
- **setZoom(zoom, options?)** - Set zoom level
- **zoomIn(delta?)** - Zoom in by delta (default: 1)
- **zoomOut(delta?)** - Zoom out by delta (default: 1)
- **addLayer(layer)** - Add layer to map
- **removeLayer(layer)** - Remove layer from map
- **locate(options?)** - Get user location

### Events
- **click** - Mouse click
- **dblclick** - Mouse double click
- **mousedown/mouseup** - Mouse button press/release
- **mouseover/mouseout** - Mouse enters/leaves map
- **mousemove** - Mouse moves over map
- **contextmenu** - Right click
- **zoom** - Zoom level changed
- **zoomstart/zoomend** - Zoom animation start/end
- **move** - Map center changed
- **movestart/moveend** - Map movement start/end

## Marker

### Creation
\`\`\`javascript
L.marker(latlng, options?)
\`\`\`

### Options
- **icon**: Icon - Custom marker icon
- **draggable**: Boolean - Allow dragging (default: false)
- **keyboard**: Boolean - Keyboard accessible (default: true)
- **title**: String - Browser tooltip
- **alt**: String - Alt text for icon image
- **zIndexOffset**: Number - Z-index offset
- **opacity**: Number - Marker opacity (0-1)
- **riseOnHover**: Boolean - Bring to front on hover
- **riseOffset**: Number - Z-index offset for hover

### Methods
- **getLatLng()** - Get marker position
- **setLatLng(latlng)** - Set marker position
- **setIcon(icon)** - Change marker icon
- **setOpacity(opacity)** - Set opacity
- **bindPopup(content, options?)** - Attach popup
- **openPopup()** - Open attached popup
- **closePopup()** - Close popup
- **bindTooltip(content, options?)** - Attach tooltip

### Events
- **click** - Marker clicked
- **dblclick** - Marker double clicked
- **mousedown/mouseup** - Mouse button press/release
- **mouseover/mouseout** - Mouse enters/leaves marker
- **contextmenu** - Right click
- **dragstart/drag/dragend** - Drag events (if draggable)

## TileLayer

### Creation
\`\`\`javascript
L.tileLayer(urlTemplate, options?)
\`\`\`

### URL Template
\`\`\`
https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
\`\`\`
- **{s}** - Subdomains (a, b, c)
- **{z}** - Zoom level
- **{x}/{y}** - Tile coordinates

### Options
- **minZoom**: Number - Minimum zoom (default: 0)
- **maxZoom**: Number - Maximum zoom (default: 18)
- **maxNativeZoom**: Number - Max zoom for tiles
- **subdomains**: String/Array - Subdomains (default: 'abc')
- **attribution**: String - Attribution text
- **tileSize**: Number - Tile size in pixels (default: 256)
- **opacity**: Number - Layer opacity (0-1)
- **zIndex**: Number - Z-index
- **detectRetina**: Boolean - Load retina tiles

## Icon

### Creation
\`\`\`javascript
L.icon(options)
\`\`\`

### Options
- **iconUrl**: String (required) - Icon image URL
- **iconRetinaUrl**: String - Retina version URL
- **iconSize**: Point - Icon size [width, height]
- **iconAnchor**: Point - Anchor point [x, y]
- **popupAnchor**: Point - Popup anchor relative to icon
- **tooltipAnchor**: Point - Tooltip anchor
- **shadowUrl**: String - Shadow image URL
- **shadowRetinaUrl**: String - Retina shadow URL
- **shadowSize**: Point - Shadow size
- **shadowAnchor**: Point - Shadow anchor
- **className**: String - Custom CSS class

### Default Icon
\`\`\`javascript
L.Icon.Default.imagePath = '/path/to/images/';
\`\`\`

## Popup

### Creation
\`\`\`javascript
L.popup(options?)
marker.bindPopup(content, options?)
\`\`\`

### Options
- **maxWidth**: Number - Maximum width (default: 300)
- **minWidth**: Number - Minimum width (default: 50)
- **maxHeight**: Number - Maximum height
- **autoPan**: Boolean - Pan to fit (default: true)
- **autoPanPadding**: Point - Padding from edges
- **closeButton**: Boolean - Show close button (default: true)
- **autoClose**: Boolean - Close when another opens (default: true)
- **closeOnClick**: Boolean - Close on map click (default: true)
- **className**: String - Custom CSS class

### Methods
- **setLatLng(latlng)** - Set popup position
- **setContent(content)** - Update content
- **openOn(map)** - Open popup on map
- **close()** - Close popup
- **update()** - Update size/position

## Polyline

### Creation
\`\`\`javascript
L.polyline(latlngs, options?)
\`\`\`

### Options
- **stroke**: Boolean - Draw stroke (default: true)
- **color**: String - Stroke color (default: '#3388ff')
- **weight**: Number - Stroke width pixels (default: 3)
- **opacity**: Number - Stroke opacity (default: 1.0)
- **lineCap**: String - Line cap style
- **lineJoin**: String - Line join style
- **dashArray**: String - Dash pattern
- **dashOffset**: String - Dash offset
- **smoothFactor**: Number - Simplification tolerance

### Methods
- **getBounds()** - Get bounding box
- **getLatLngs()** - Get coordinates array
- **setLatLngs(latlngs)** - Set coordinates
- **addLatLng(latlng)** - Add coordinate
- **setStyle(style)** - Update styling

## Polygon

### Creation
\`\`\`javascript
L.polygon(latlngs, options?)
\`\`\`

### Options (extends Polyline)
- **fill**: Boolean - Fill polygon (default: true)
- **fillColor**: String - Fill color
- **fillOpacity**: Number - Fill opacity (default: 0.2)
- **fillRule**: String - Fill rule ('evenodd' or 'nonzero')

## Circle

### Creation
\`\`\`javascript
L.circle(latlng, options?)
\`\`\`

### Options (extends Path)
- **radius**: Number (required) - Radius in meters

### Methods
- **getRadius()** - Get radius
- **setRadius(radius)** - Set radius

## GeoJSON

### Creation
\`\`\`javascript
L.geoJSON(geojson?, options?)
\`\`\`

### Options
- **pointToLayer**: Function - Create marker from point
- **style**: Function - Style features
- **onEachFeature**: Function - Called for each feature
- **filter**: Function - Filter features to show
- **coordsToLatLng**: Function - Convert coordinates

### Methods
- **addData(data)** - Add GeoJSON features
- **resetStyle(layer?)** - Reset to default style
- **setStyle(style)** - Set style for all features

### Example
\`\`\`javascript
L.geoJSON(data, {
  style: function(feature) {
    return {color: feature.properties.color};
  },
  onEachFeature: function(feature, layer) {
    layer.bindPopup(feature.properties.name);
  }
}).addTo(map);
\`\`\`

## LayerGroup

### Creation
\`\`\`javascript
L.layerGroup(layers?)
\`\`\`

### Methods
- **addLayer(layer)** - Add layer to group
- **removeLayer(layer)** - Remove layer
- **clearLayers()** - Remove all layers
- **hasLayer(layer)** - Check if contains layer
- **getLayers()** - Get all layers array

## Control

### Zoom Control
\`\`\`javascript
L.control.zoom(options?)
\`\`\`

### Layers Control
\`\`\`javascript
L.control.layers(baseLayers?, overlays?, options?)
\`\`\`

### Scale Control
\`\`\`javascript
L.control.scale(options?)
\`\`\`

### Attribution Control
\`\`\`javascript
L.control.attribution(options?)
\`\`\`

### Options
- **position**: String - 'topleft', 'topright', 'bottomleft', 'bottomright'

### Custom Control
\`\`\`javascript
var MyControl = L.Control.extend({
  onAdd: function(map) {
    var container = L.DomUtil.create('div', 'my-control');
    // Add content
    return container;
  },
  onRemove: function(map) {
    // Cleanup
  }
});

L.control.myControl = function(opts) {
  return new MyControl(opts);
}
\`\`\`

## LatLng

### Creation
\`\`\`javascript
L.latLng(latitude, longitude, altitude?)
L.latLng([latitude, longitude])
\`\`\`

### Methods
- **distanceTo(otherLatLng)** - Distance in meters
- **equals(otherLatLng)** - Check equality
- **toString()** - String representation
- **wrap()** - Wrap to [-180, 180] longitude

## LatLngBounds

### Creation
\`\`\`javascript
L.latLngBounds(southWest, northEast)
L.latLngBounds([southWest, northEast])
\`\`\`

### Methods
- **extend(latlng)** - Expand to include point
- **contains(latlng)** - Check if contains point
- **intersects(bounds)** - Check overlap
- **getCenter()** - Get center point
- **getNorthEast/getSouthWest()** - Get corners

## Events

### Adding Listeners
\`\`\`javascript
map.on('click', function(e) {
  console.log('Clicked at', e.latlng);
});

marker.on({
  click: onClick,
  dragend: onDragEnd
});
\`\`\`

### Removing Listeners
\`\`\`javascript
map.off('click', onClick);
marker.off(); // Remove all
\`\`\`

### Event Objects
- **latlng** - Geographic location
- **layerPoint** - Pixel coordinates
- **containerPoint** - Container relative coordinates
- **originalEvent** - Browser event
- **target** - Object that fired event
- **type** - Event type

## Utility Functions

### DOM
- **L.DomUtil.create(tagName, className?, container?)** - Create element
- **L.DomUtil.addClass/removeClass(element, name)** - Manage classes
- **L.DomUtil.setPosition(element, point)** - Set position

### Browser
- **L.Browser.mobile** - Is mobile device
- **L.Browser.retina** - Has retina display
- **L.Browser.touch** - Has touch support

### Geometry
- **L.GeometryUtil.length(latlngs)** - Polyline length
- **L.GeometryUtil.area(latlngs)** - Polygon area

For complete documentation, visit: https://leafletjs.com/reference.html
`,

  quickStart: `# Leaflet Quick Start Guide

## 1. Include Leaflet

### Via CDN
\`\`\`html
<!-- CSS -->
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
  integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
  crossorigin=""/>

<!-- JavaScript -->
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
  integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
  crossorigin=""></script>
\`\`\`

### Via npm
\`\`\`bash
npm install leaflet
\`\`\`

\`\`\`javascript
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
\`\`\`

## 2. Prepare Container

The map container **must** have a defined height:

\`\`\`html
<div id="map"></div>
\`\`\`

\`\`\`css
#map {
  height: 400px;
  /* or height: 100vh; for fullscreen */
}
\`\`\`

## 3. Initialize Map

\`\`\`javascript
// Create map and set view
var map = L.map('map').setView([51.505, -0.09], 13);

// Add tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap'
}).addTo(map);
\`\`\`

## 4. Add Markers

\`\`\`javascript
// Simple marker
var marker = L.marker([51.5, -0.09]).addTo(map);

// Marker with popup
L.marker([51.495, -0.09])
  .addTo(map)
  .bindPopup('A popup message!')
  .openPopup();
\`\`\`

## 5. Add Shapes

\`\`\`javascript
// Circle
var circle = L.circle([51.508, -0.11], {
  color: 'red',
  fillColor: '#f03',
  fillOpacity: 0.5,
  radius: 500
}).addTo(map);

// Polygon
var polygon = L.polygon([
  [51.509, -0.08],
  [51.503, -0.06],
  [51.51, -0.047]
]).addTo(map);
\`\`\`

## 6. Handle Events

\`\`\`javascript
// Map click
map.on('click', function(e) {
  alert('You clicked at ' + e.latlng);
});

// Marker events
marker.on('click', function(e) {
  console.log('Marker clicked!');
});
\`\`\`

## Complete Example

\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <title>Quick Start</title>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    #map { height: 400px; }
  </style>
</head>
<body>
  <div id="map"></div>

  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    // Initialize map
    var map = L.map('map').setView([51.505, -0.09], 13);

    // Add tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add marker with popup
    L.marker([51.5, -0.09])
      .addTo(map)
      .bindPopup('Hello Leaflet!');

    // Add circle
    L.circle([51.508, -0.11], {
      color: 'red',
      radius: 500
    }).addTo(map);

    // Handle clicks
    map.on('click', function(e) {
      L.popup()
        .setLatLng(e.latlng)
        .setContent('You clicked at ' + e.latlng.toString())
        .openOn(map);
    });
  </script>
</body>
</html>
\`\`\`

## Common Issues

### Map Not Showing
- Container must have defined height
- Load CSS before JS
- Check browser console for errors

### Tiles Not Loading
- Check URL template is correct
- Ensure internet connection
- Add proper attribution

### Marker Icons Broken
\`\`\`javascript
// Fix icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});
\`\`\`

## Next Steps

- Explore [examples](https://leafletjs.com/examples.html)
- Read [API documentation](https://leafletjs.com/reference.html)
- Try [plugins](https://leafletjs.com/plugins.html)

Visit: https://leafletjs.com/examples/quick-start/
`
};
