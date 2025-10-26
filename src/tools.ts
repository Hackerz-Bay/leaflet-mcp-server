// Tool implementations for Leaflet MCP Server

export function generateMapCode(args: any): string {
  const {
    center,
    zoom = 13,
    tileProvider = "openstreetmap",
    containerId = "map",
    includeHTML = true,
  } = args;

  const tileUrls: Record<string, { url: string; attribution: string }> = {
    openstreetmap: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
    cartodb: {
      url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    },
    stamen: {
      url: "https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png",
      attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  };

  const tile = tileUrls[tileProvider];

  let code = "";

  if (includeHTML) {
    code += `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Leaflet Map</title>

  <!-- Leaflet CSS -->
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
    crossorigin=""/>

  <!-- Custom CSS -->
  <style>
    body {
      margin: 0;
      padding: 0;
    }
    #${containerId} {
      height: 100vh;
      width: 100%;
    }
  </style>
</head>
<body>
  <div id="${containerId}"></div>

  <!-- Leaflet JavaScript -->
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
    crossorigin=""></script>

  <script>
`;
  }

  code += `    // Initialize the map
    var map = L.map('${containerId}').setView([${center.lat}, ${center.lng}], ${zoom});

    // Add tile layer
    L.tileLayer('${tile.url}', {
      maxZoom: 19,
      attribution: '${tile.attribution}'
    }).addTo(map);
`;

  if (includeHTML) {
    code += `  </script>
</body>
</html>`;
  }

  return `# Leaflet Map Code

${includeHTML ? "Complete HTML page" : "JavaScript only"} for map centered at [${center.lat}, ${center.lng}] with zoom level ${zoom}.

\`\`\`${includeHTML ? "html" : "javascript"}
${code}
\`\`\`

**Next Steps:**
- Add markers: Use the \`add_marker\` tool
- Add layers: Use the \`create_layer\` tool
- Add GeoJSON: Use the \`create_geojson_layer\` tool
- Customize further: See \`leaflet://docs/api-reference\` resource
`;
}

export function generateMarkerCode(args: any): string {
  const { position, popup, tooltip, draggable = false, customIcon = false } = args;

  let code = "";

  if (customIcon) {
    code += `// Define custom icon
var customIcon = L.icon({
  iconUrl: 'path/to/icon.png',
  shadowUrl: 'path/to/shadow.png',
  iconSize: [25, 41],      // size of the icon
  shadowSize: [41, 41],    // size of the shadow
  iconAnchor: [12, 41],    // point of the icon which will correspond to marker's location
  shadowAnchor: [12, 41],  // the same for the shadow
  popupAnchor: [1, -34]    // point from which the popup should open relative to the iconAnchor
});

`;
  }

  code += `// Create marker
var marker = L.marker([${position.lat}, ${position.lng}]`;

  if (draggable || customIcon) {
    code += `, {`;
    const options = [];
    if (draggable) options.push("\n  draggable: true");
    if (customIcon) options.push("\n  icon: customIcon");
    code += options.join(",");
    code += "\n}";
  }

  code += `).addTo(map);`;

  if (popup) {
    code += `\n\n// Add popup to marker
marker.bindPopup(\`${popup}\`);`;
  }

  if (tooltip) {
    code += `\n\n// Add tooltip to marker
marker.bindTooltip('${tooltip}');`;
  }

  if (draggable) {
    code += `\n\n// Handle drag events
marker.on('dragend', function(event) {
  var position = marker.getLatLng();
  console.log('New position:', position);
  // marker.setLatLng(new L.LatLng(position.lat, position.lng), {draggable: true});
});`;
  }

  let description = `# Leaflet Marker Code

Creates a ${draggable ? "draggable " : ""}marker at [${position.lat}, ${position.lng}]`;
  if (popup) description += " with popup";
  if (tooltip) description += " and tooltip";
  description += ".";

  return `${description}

\`\`\`javascript
${code}
\`\`\`

**Marker Methods:**
- \`marker.setLatLng([lat, lng])\` - Move marker
- \`marker.openPopup()\` - Open popup programmatically
- \`marker.setOpacity(0.5)\` - Change opacity
- \`marker.remove()\` - Remove from map

**Events:**
- \`click\`, \`dblclick\`, \`mousedown\`, \`mouseover\`, \`mouseout\`
- \`dragstart\`, \`drag\`, \`dragend\` (if draggable)
`;
}

export function generateLayerCode(args: any): string {
  const { layerType, coordinates, center, radius, style = {}, popup } = args;

  const defaultStyle = {
    color: style.color || "#3388ff",
    weight: style.weight || 3,
    opacity: style.opacity || 1.0,
    fillColor: style.fillColor || "#3388ff",
    fillOpacity: style.fillOpacity || 0.2,
  };

  let code = "";
  let description = "";

  switch (layerType) {
    case "polyline":
      if (!coordinates || coordinates.length < 2) {
        return "Error: Polyline requires at least 2 coordinates in the 'coordinates' array.";
      }
      code = `// Create polyline
var polyline = L.polyline([
  ${coordinates.map((c: any) => `[${c.lat}, ${c.lng}]`).join(",\n  ")}
], {
  color: '${defaultStyle.color}',
  weight: ${defaultStyle.weight},
  opacity: ${defaultStyle.opacity}
}).addTo(map);`;
      description = `Polyline with ${coordinates.length} points`;
      break;

    case "polygon":
      if (!coordinates || coordinates.length < 3) {
        return "Error: Polygon requires at least 3 coordinates in the 'coordinates' array.";
      }
      code = `// Create polygon
var polygon = L.polygon([
  ${coordinates.map((c: any) => `[${c.lat}, ${c.lng}]`).join(",\n  ")}
], {
  color: '${defaultStyle.color}',
  weight: ${defaultStyle.weight},
  fillColor: '${defaultStyle.fillColor}',
  fillOpacity: ${defaultStyle.fillOpacity}
}).addTo(map);`;
      description = `Polygon with ${coordinates.length} vertices`;
      break;

    case "circle":
      if (!center || !radius) {
        return "Error: Circle requires 'center' {lat, lng} and 'radius' (in meters).";
      }
      code = `// Create circle
var circle = L.circle([${center.lat}, ${center.lng}], {
  color: '${defaultStyle.color}',
  fillColor: '${defaultStyle.fillColor}',
  fillOpacity: ${defaultStyle.fillOpacity},
  radius: ${radius}  // radius in meters
}).addTo(map);`;
      description = `Circle centered at [${center.lat}, ${center.lng}] with ${radius}m radius`;
      break;

    case "rectangle":
      if (!coordinates || coordinates.length < 2) {
        return "Error: Rectangle requires 2 coordinates (opposite corners) in the 'coordinates' array.";
      }
      code = `// Create rectangle
var rectangle = L.rectangle([
  [${coordinates[0].lat}, ${coordinates[0].lng}],  // southwest corner
  [${coordinates[1].lat}, ${coordinates[1].lng}]   // northeast corner
], {
  color: '${defaultStyle.color}',
  weight: ${defaultStyle.weight},
  fillColor: '${defaultStyle.fillColor}',
  fillOpacity: ${defaultStyle.fillOpacity}
}).addTo(map);`;
      description = `Rectangle from [${coordinates[0].lat}, ${coordinates[0].lng}] to [${coordinates[1].lat}, ${coordinates[1].lng}]`;
      break;

    case "circleMarker":
      if (!center) {
        return "Error: CircleMarker requires 'center' {lat, lng}.";
      }
      code = `// Create circle marker (fixed pixel radius)
var circleMarker = L.circleMarker([${center.lat}, ${center.lng}], {
  color: '${defaultStyle.color}',
  fillColor: '${defaultStyle.fillColor}',
  fillOpacity: ${defaultStyle.fillOpacity},
  radius: ${radius || 10}  // radius in pixels
}).addTo(map);`;
      description = `Circle marker at [${center.lat}, ${center.lng}]`;
      break;

    default:
      return `Error: Unknown layer type '${layerType}'. Use: polyline, polygon, circle, rectangle, or circleMarker.`;
  }

  if (popup) {
    const varName = layerType === "circleMarker" ? "circleMarker" : layerType;
    code += `\n\n// Add popup
${varName}.bindPopup(\`${popup}\`);`;
  }

  return `# Leaflet ${layerType.charAt(0).toUpperCase() + layerType.slice(1)} Code

Creates a ${description}.

\`\`\`javascript
${code}
\`\`\`

**Vector Layer Methods:**
- \`.setStyle({color: 'red'})\` - Update styling
- \`.getBounds()\` - Get bounding box
- \`.bringToFront()\` / \`.bringToBack()\` - Change z-order
- \`.remove()\` - Remove from map

**Events:**
- \`click\`, \`dblclick\`, \`mousedown\`, \`mouseover\`, \`mouseout\`
- \`add\`, \`remove\`
`;
}

export function generatePopupCode(args: any): string {
  const { content, position, maxWidth = 300, attachTo = "marker" } = args;

  let code = "";

  if (attachTo === "latlng" && position) {
    code = `// Create standalone popup at specific location
var popup = L.popup()
  .setLatLng([${position.lat}, ${position.lng}])
  .setContent(\`${content}\`)
  .openOn(map);`;
  } else if (attachTo === "marker") {
    code = `// Bind popup to marker
marker.bindPopup(\`${content}\`, {
  maxWidth: ${maxWidth}
});

// Optionally open immediately
// marker.openPopup();`;
  } else if (attachTo === "layer") {
    code = `// Bind popup to layer (polygon, polyline, etc.)
layer.bindPopup(\`${content}\`, {
  maxWidth: ${maxWidth}
});`;
  }

  return `# Leaflet Popup Code

\`\`\`javascript
${code}
\`\`\`

**Popup Options:**
\`\`\`javascript
{
  maxWidth: 300,           // Maximum width in pixels
  minWidth: 50,            // Minimum width
  maxHeight: null,         // Maximum height (scrollable if exceeded)
  autoPan: true,           // Pan map to fit popup
  autoPanPadding: [5, 5],  // Padding from edges
  closeButton: true,       // Show close button
  autoClose: true,         // Close when another opens
  className: ''            // Custom CSS class
}
\`\`\`

**Popup Methods:**
- \`.setContent(html)\` - Update content
- \`.setLatLng([lat, lng])\` - Move popup
- \`.openOn(map)\` - Open popup
- \`.close()\` - Close popup
- \`.update()\` - Update size/position

**HTML Content:**
Popups support full HTML:
\`\`\`javascript
marker.bindPopup(\`
  <div style="text-align: center;">
    <h3>Location Name</h3>
    <p>Description here</p>
    <img src="image.jpg" width="200">
    <button onclick="alert('Clicked!')">Click Me</button>
  </div>
\`);
\`\`\`
`;
}

export function generateGeoJSONCode(args: any): string {
  const {
    dataSource = "inline",
    includeExample = true,
    style = {},
    onEachFeature = true,
    filter = false,
  } = args;

  let code = "";

  if (includeExample && dataSource === "inline") {
    code += `// Example GeoJSON data
var geojsonData = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "Location 1",
        "popupContent": "This is Location 1"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-0.09, 51.505]  // [lng, lat] - Note: GeoJSON uses [lng, lat]!
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Area 1",
        "popupContent": "This is Area 1"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-0.08, 51.51],
          [-0.06, 51.51],
          [-0.06, 51.50],
          [-0.08, 51.50],
          [-0.08, 51.51]
        ]]
      }
    }
  ]
};

`;
  }

  code += `// Add GeoJSON layer to map
`;

  if (dataSource === "url") {
    code += `fetch('data.geojson')
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data`;
  } else if (dataSource === "variable") {
    code += `// Assuming you have geojsonData variable
L.geoJSON(geojsonData`;
  } else {
    code += `L.geoJSON(geojsonData`;
  }

  const hasOptions = Object.keys(style).length > 0 || onEachFeature || filter;

  if (hasOptions) {
    code += `, {\n`;

    if (Object.keys(style).length > 0) {
      code += `  style: function(feature) {
    return {
      color: '${style.color || "#3388ff"}',
      weight: ${style.weight || 2},
      opacity: ${style.opacity || 1}
    };
  }`;
    }

    if (onEachFeature) {
      if (Object.keys(style).length > 0) code += `,\n`;
      code += `  onEachFeature: function(feature, layer) {
    // Bind popup with feature properties
    if (feature.properties && feature.properties.popupContent) {
      layer.bindPopup(feature.properties.popupContent);
    }

    // Add other interactions
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature
    });
  }`;
    }

    if (filter) {
      if (Object.keys(style).length > 0 || onEachFeature) code += `,\n`;
      code += `  filter: function(feature, layer) {
    // Only show features that meet criteria
    return feature.properties.show !== false;
  }`;
    }

    code += `\n}`;
  }

  code += `).addTo(map);`;

  if (dataSource === "url") {
    code += `\n  });`;
  }

  if (onEachFeature) {
    code += `\n\n// Interaction handlers
function highlightFeature(e) {
  var layer = e.target;
  layer.setStyle({
    weight: 5,
    color: '#666',
    fillOpacity: 0.7
  });
}

function resetHighlight(e) {
  geojsonLayer.resetStyle(e.target);
}

function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}`;
  }

  return `# Leaflet GeoJSON Layer Code

**IMPORTANT:** GeoJSON uses [longitude, latitude] order, opposite of Leaflet's [latitude, longitude]!

\`\`\`javascript
${code}
\`\`\`

**GeoJSON Options:**
- \`style\`: Function to style features
- \`onEachFeature\`: Function called for each feature (add popups, events)
- \`filter\`: Function to filter which features to show
- \`pointToLayer\`: Custom function to create marker layers

**Loading GeoJSON from URL:**
\`\`\`javascript
fetch('https://example.com/data.geojson')
  .then(response => response.json())
  .then(data => L.geoJSON(data).addTo(map));
\`\`\`

**Coordinate Order:**
- Leaflet: \`[lat, lng]\` or \`L.latLng(lat, lng)\`
- GeoJSON: \`[lng, lat]\` in coordinates array
`;
}

export function generateChoroplethCode(args: any): string {
  const {
    dataProperty = "density",
    colorScheme = "sequential",
    steps = 5,
    includeLegend = true,
    includeInteraction = true,
  } = args;

  let code = `// Choropleth Map - Interactive Data Visualization

// 1. Define color scale based on data values
function getColor(value) {
  return value > 1000 ? '#800026' :
         value > 500  ? '#BD0026' :
         value > 200  ? '#E31A1C' :
         value > 100  ? '#FC4E2A' :
         value > 50   ? '#FD8D3C' :
         value > 20   ? '#FEB24C' :
         value > 10   ? '#FED976' :
                        '#FFEDA0';
}

// 2. Style function for GeoJSON features
function style(feature) {
  return {
    fillColor: getColor(feature.properties.${dataProperty}),
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7
  };
}

`;

  if (includeInteraction) {
    code += `// 3. Interactive highlighting
function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 5,
    color: '#666',
    dashArray: '',
    fillOpacity: 0.7
  });

  layer.bringToFront();

  // Update info box
  info.update(layer.feature.properties);
}

function resetHighlight(e) {
  geojson.resetStyle(e.target);
  info.update();
}

function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

// 4. Add interactions to each feature
function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature
  });
}

`;
  }

  code += `// ${includeInteraction ? "5" : "3"}. Create GeoJSON layer with styling
var geojson = L.geoJSON(geojsonData, {
  style: style`;

  if (includeInteraction) {
    code += `,
  onEachFeature: onEachFeature`;
  }

  code += `
}).addTo(map);

`;

  if (includeInteraction) {
    code += `// 6. Custom info control
var info = L.control();

info.onAdd = function(map) {
  this._div = L.DomUtil.create('div', 'info');
  this.update();
  return this._div;
};

info.update = function(props) {
  this._div.innerHTML = '<h4>Population Density</h4>' +
    (props ? '<b>' + props.name + '</b><br />' +
     props.${dataProperty} + ' people / km<sup>2</sup>'
    : 'Hover over a region');
};

info.addTo(map);

`;
  }

  if (includeLegend) {
    code += `// ${includeInteraction ? "7" : "4"}. Add legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function(map) {
  var div = L.DomUtil.create('div', 'info legend');
  var grades = [0, 10, 20, 50, 100, 200, 500, 1000];
  var labels = [];

  // Loop through intervals and generate a label with colored square
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }

  return div;
};

legend.addTo(map);`;
  }

  const css = `
/* Add this CSS to style the info and legend controls */
<style>
.info {
  padding: 6px 8px;
  font: 14px/16px Arial, Helvetica, sans-serif;
  background: white;
  background: rgba(255,255,255,0.8);
  box-shadow: 0 0 15px rgba(0,0,0,0.2);
  border-radius: 5px;
}

.info h4 {
  margin: 0 0 5px;
  color: #777;
}

.legend {
  line-height: 18px;
  color: #555;
  background: white;
  background: rgba(255,255,255,0.8);
  padding: 6px 8px;
  border-radius: 5px;
}

.legend i {
  width: 18px;
  height: 18px;
  float: left;
  margin-right: 8px;
  opacity: 0.7;
}
</style>`;

  return `# Leaflet Choropleth Map Code

Interactive choropleth (data visualization) map with color-coded regions.

\`\`\`javascript
${code}
\`\`\`

**CSS Styling:**
\`\`\`css${css}
\`\`\`

**Customization:**
1. Adjust \`getColor()\` function for your data range
2. Modify \`${dataProperty}\` to match your GeoJSON property
3. Update color scheme to match your needs
4. Customize info box content in \`info.update()\`

**Complete Example:**
See the official Leaflet choropleth tutorial at:
https://leafletjs.com/examples/choropleth/

**Data Requirements:**
Your GeoJSON features should have properties like:
\`\`\`json
{
  "properties": {
    "name": "Region Name",
    "${dataProperty}": 123.45
  }
}
\`\`\`
`;
}

export function convertCoordinates(args: any): string {
  const { input, outputFormat = "leaflet" } = args;

  // Try to parse various coordinate formats
  let lat: number | null = null;
  let lng: number | null = null;

  // Decimal degrees: "51.505, -0.09" or "51.505,-0.09"
  const decimalPattern = /^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/;
  const decimalMatch = input.match(decimalPattern);

  if (decimalMatch) {
    lat = parseFloat(decimalMatch[1]);
    lng = parseFloat(decimalMatch[2]);
  }

  // Array format: "[51.505, -0.09]"
  const arrayPattern = /\[\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*\]/;
  const arrayMatch = input.match(arrayPattern);

  if (arrayMatch) {
    lat = parseFloat(arrayMatch[1]);
    lng = parseFloat(arrayMatch[2]);
  }

  // DMS format parsing (basic)
  const dmsPattern = /(\d+)°\s*(\d+)['′]\s*(\d+\.?\d*)["″]\s*([NSEW])/gi;
  const dmsMatches = Array.from(input.matchAll(dmsPattern));

  if (dmsMatches.length === 2) {
    const [latMatch, lngMatch] = dmsMatches as RegExpMatchArray[];

    const latDeg = parseInt(latMatch[1]);
    const latMin = parseInt(latMatch[2]);
    const latSec = parseFloat(latMatch[3]);
    const latDir = latMatch[4].toUpperCase();

    const lngDeg = parseInt(lngMatch[1]);
    const lngMin = parseInt(lngMatch[2]);
    const lngSec = parseFloat(lngMatch[3]);
    const lngDir = lngMatch[4].toUpperCase();

    lat = latDeg + latMin / 60 + latSec / 3600;
    if (latDir === "S") lat = -lat;

    lng = lngDeg + lngMin / 60 + lngSec / 3600;
    if (lngDir === "W") lng = -lng;
  }

  if (lat === null || lng === null) {
    return `# Coordinate Conversion Error

Unable to parse coordinates: "${input}"

**Supported Formats:**
1. Decimal degrees: \`51.505, -0.09\`
2. Array: \`[51.505, -0.09]\`
3. DMS: \`51°30'18"N 0°5'24"W\`

Please provide coordinates in one of these formats.`;
  }

  // Validate coordinates
  if (lat < -90 || lat > 90) {
    return `Error: Invalid latitude ${lat}. Must be between -90 and 90.`;
  }
  if (lng < -180 || lng > 180) {
    return `Error: Invalid longitude ${lng}. Must be between -180 and 180.`;
  }

  // Convert to DMS
  function toDMS(decimal: number, isLat: boolean): string {
    const absolute = Math.abs(decimal);
    const degrees = Math.floor(absolute);
    const minutesFloat = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesFloat);
    const seconds = ((minutesFloat - minutes) * 60).toFixed(2);

    let direction;
    if (isLat) {
      direction = decimal >= 0 ? "N" : "S";
    } else {
      direction = decimal >= 0 ? "E" : "W";
    }

    return `${degrees}°${minutes}'${seconds}"${direction}`;
  }

  const latDMS = toDMS(lat, true);
  const lngDMS = toDMS(lng, false);

  let output = `# Coordinate Conversion

**Input:** ${input}

**Decimal Degrees:**
- Latitude: ${lat}
- Longitude: ${lng}

**DMS (Degrees, Minutes, Seconds):**
- Latitude: ${latDMS}
- Longitude: ${lngDMS}
`;

  if (outputFormat === "leaflet" || outputFormat === "decimal") {
    output += `\n**Leaflet Format:**
\`\`\`javascript
L.marker([${lat}, ${lng}]).addTo(map);
map.setView([${lat}, ${lng}], 13);
\`\`\``;
  }

  if (outputFormat === "geojson") {
    output += `\n**GeoJSON Format** (note: longitude first!):
\`\`\`json
{
  "type": "Point",
  "coordinates": [${lng}, ${lat}]
}
\`\`\``;
  }

  output += `\n\n**Remember:**
- Leaflet uses: [latitude, longitude]
- GeoJSON uses: [longitude, latitude]
- Valid latitude: -90 to 90
- Valid longitude: -180 to 180
`;

  return output;
}

export function suggestPlugin(args: any): string {
  const { functionality, category } = args;

  const query = (functionality || "").toLowerCase();
  const cat = (category || "").toLowerCase();

  let suggestions: Array<{ name: string; description: string; url: string; category: string }> =
    [];

  // Popular Leaflet plugins database
  const plugins = [
    {
      name: "Leaflet.markercluster",
      description: "Beautiful, performant marker clustering",
      url: "https://github.com/Leaflet/Leaflet.markercluster",
      category: "markers",
      keywords: ["cluster", "markers", "performance", "many markers"],
    },
    {
      name: "Leaflet.heat",
      description: "Simple heatmap visualization",
      url: "https://github.com/Leaflet/Leaflet.heat",
      category: "data",
      keywords: ["heatmap", "heat", "density", "visualization"],
    },
    {
      name: "Leaflet.draw",
      description: "Vector drawing and editing plugin",
      url: "https://github.com/Leaflet/Leaflet.draw",
      category: "interaction",
      keywords: ["draw", "edit", "shapes", "polygon", "polyline", "circle"],
    },
    {
      name: "Leaflet Routing Machine",
      description: "Routing and directions with multiple providers",
      url: "https://www.liedman.net/leaflet-routing-machine/",
      category: "interaction",
      keywords: ["routing", "directions", "navigation", "path", "route"],
    },
    {
      name: "Leaflet.awesome-markers",
      description: "Colorful markers with Font Awesome icons",
      url: "https://github.com/lennardv2/Leaflet.awesome-markers",
      category: "markers",
      keywords: ["icons", "markers", "font awesome", "colorful"],
    },
    {
      name: "Leaflet.fullscreen",
      description: "Fullscreen control for maps",
      url: "https://github.com/brunob/leaflet.fullscreen",
      category: "controls",
      keywords: ["fullscreen", "control"],
    },
    {
      name: "Leaflet.EasyButton",
      description: "Easy-to-use button control",
      url: "https://github.com/CliffCloud/Leaflet.EasyButton",
      category: "controls",
      keywords: ["button", "control", "custom"],
    },
    {
      name: "Leaflet.MiniMap",
      description: "Overview minimap control",
      url: "https://github.com/Norkart/Leaflet-MiniMap",
      category: "controls",
      keywords: ["minimap", "overview", "navigation"],
    },
    {
      name: "Leaflet.AnimatedMarker",
      description: "Animate marker movement along a path",
      url: "https://github.com/openplans/Leaflet.AnimatedMarker",
      category: "animation",
      keywords: ["animation", "moving", "path", "marker"],
    },
    {
      name: "Leaflet.Editable",
      description: "Make geometries editable",
      url: "https://github.com/Leaflet/Leaflet.Editable",
      category: "interaction",
      keywords: ["edit", "editable", "geometry", "shapes"],
    },
    {
      name: "Leaflet.Search",
      description: "Search control for markers, layers, and features",
      url: "https://github.com/stefanocudini/leaflet-search",
      category: "controls",
      keywords: ["search", "find", "locate"],
    },
    {
      name: "Leaflet.GeometryUtil",
      description: "Utilities for geometric calculations",
      url: "https://github.com/makinacorpus/Leaflet.GeometryUtil",
      category: "vector",
      keywords: ["geometry", "calculation", "distance", "area"],
    },
  ];

  // Filter by category
  if (cat) {
    suggestions = plugins.filter((p) => p.category === cat);
  }

  // Filter by functionality/keywords
  if (query) {
    const filtered = plugins.filter((p) => {
      const nameMatch = p.name.toLowerCase().includes(query);
      const descMatch = p.description.toLowerCase().includes(query);
      const keywordMatch = p.keywords.some((k) => k.includes(query) || query.includes(k));
      return nameMatch || descMatch || keywordMatch;
    });

    suggestions = filtered.length > 0 ? filtered : suggestions;
  }

  // Default to popular plugins if no results
  if (suggestions.length === 0) {
    suggestions = plugins.slice(0, 5);
  }

  let output = `# Leaflet Plugin Recommendations\n\n`;

  if (functionality) {
    output += `**For:** ${functionality}\n\n`;
  }
  if (category) {
    output += `**Category:** ${category}\n\n`;
  }

  suggestions.forEach((plugin) => {
    output += `## ${plugin.name}
${plugin.description}
- **Category:** ${plugin.category}
- **URL:** ${plugin.url}

`;
  });

  output += `\n**More Plugins:**
- Official list: https://leafletjs.com/plugins.html
- Awesome Leaflet: https://github.com/tomik23/awesome-leaflet

**Installation (typical):**
\`\`\`html
<!-- CSS -->
<link rel="stylesheet" href="plugin.css" />

<!-- JavaScript (after Leaflet) -->
<script src="plugin.js"></script>
\`\`\`

Or via npm:
\`\`\`bash
npm install leaflet-plugin-name
\`\`\`
`;

  return output;
}

export function searchExamples(args: any): string {
  const { query, includeCode = true } = args;

  const examples = [
    {
      title: "Quick Start",
      url: "https://leafletjs.com/examples/quick-start/",
      description: "Basic map setup with markers, popups, and events",
      keywords: ["basic", "getting started", "marker", "popup", "setup", "initialize"],
      code: `var map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
L.marker([51.5, -0.09]).addTo(map).bindPopup('A popup!');`,
    },
    {
      title: "Mobile-Friendly Map",
      url: "https://leafletjs.com/examples/mobile/",
      description: "Fullscreen mobile map with geolocation",
      keywords: ["mobile", "fullscreen", "geolocation", "responsive"],
      code: `map.locate({setView: true, maxZoom: 16});
map.on('locationfound', onLocationFound);`,
    },
    {
      title: "Custom Marker Icons",
      url: "https://leafletjs.com/examples/custom-icons/",
      description: "Create and use custom marker icons",
      keywords: ["icon", "custom", "marker", "image"],
      code: `var greenIcon = L.icon({
  iconUrl: 'leaf-green.png',
  shadowUrl: 'leaf-shadow.png',
  iconSize: [38, 95],
  shadowSize: [50, 64]
});
L.marker([51.5, -0.09], {icon: greenIcon}).addTo(map);`,
    },
    {
      title: "GeoJSON",
      url: "https://leafletjs.com/examples/geojson/",
      description: "Display and interact with GeoJSON data",
      keywords: ["geojson", "data", "vector", "features"],
      code: `L.geoJSON(geojsonFeature, {
  onEachFeature: function(feature, layer) {
    layer.bindPopup(feature.properties.name);
  }
}).addTo(map);`,
    },
    {
      title: "Interactive Choropleth",
      url: "https://leafletjs.com/examples/choropleth/",
      description: "Color-coded data visualization map",
      keywords: ["choropleth", "data", "visualization", "color", "density", "style"],
      code: `function getColor(d) {
  return d > 1000 ? '#800026' : d > 500 ? '#BD0026' : '#FFEDA0';
}
L.geoJSON(data, {style: style}).addTo(map);`,
    },
    {
      title: "Layer Groups and Layers Control",
      url: "https://leafletjs.com/examples/layers-control/",
      description: "Organize and switch between map layers",
      keywords: ["layers", "control", "toggle", "switch", "overlay"],
      code: `var baseLayers = {"OSM": osm, "Satellite": satellite};
var overlays = {"Cities": cities, "Markers": markers};
L.control.layers(baseLayers, overlays).addTo(map);`,
    },
    {
      title: "Non-geographical Maps",
      url: "https://leafletjs.com/examples/crs-simple/",
      description: "Use Leaflet for non-map images (game maps, floor plans)",
      keywords: ["simple", "image", "non-geographical", "game", "floor plan"],
      code: `var map = L.map('map', {
  crs: L.CRS.Simple,
  minZoom: -5
});
var bounds = [[0,0], [1000,1000]];
L.imageOverlay('image.png', bounds).addTo(map);`,
    },
    {
      title: "WMS and TMS Layers",
      url: "https://leafletjs.com/examples/wms/",
      description: "Integrate with professional GIS services",
      keywords: ["wms", "tms", "gis", "tile", "server"],
      code: `L.tileLayer.wms("http://ows.mundialis.de/services/service?", {
  layers: 'TOPO-WMS'
}).addTo(map);`,
    },
  ];

  const searchQuery = query.toLowerCase();

  const results = examples.filter((ex) => {
    const titleMatch = ex.title.toLowerCase().includes(searchQuery);
    const descMatch = ex.description.toLowerCase().includes(searchQuery);
    const keywordMatch = ex.keywords.some((k) => k.includes(searchQuery) || searchQuery.includes(k));
    return titleMatch || descMatch || keywordMatch;
  });

  if (results.length === 0) {
    return `# No examples found for "${query}"

Try searching for:
- "mobile", "geolocation"
- "custom icon", "marker"
- "geojson", "data"
- "choropleth", "visualization"
- "layers", "control"
- "popup", "tooltip"

Or browse all examples at: https://leafletjs.com/examples.html`;
  }

  let output = `# Leaflet Examples: "${query}"\n\nFound ${results.length} matching example${results.length > 1 ? "s" : ""}:\n\n`;

  results.forEach((ex) => {
    output += `## ${ex.title}
${ex.description}
**URL:** ${ex.url}\n\n`;

    if (includeCode && ex.code) {
      output += `**Code Example:**
\`\`\`javascript
${ex.code}
\`\`\`\n\n`;
    }
  });

  output += `**Browse All Examples:** https://leafletjs.com/examples.html`;

  return output;
}
