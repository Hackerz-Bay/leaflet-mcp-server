#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  ErrorCode,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";

// Leaflet documentation and examples data
import { LEAFLET_DOCS } from "./docs.js";
import { LEAFLET_EXAMPLES } from "./examples.js";
import { LEAFLET_PLUGINS } from "./plugins.js";
import {
  generateMapCode,
  generateMarkerCode,
  generateLayerCode,
  generatePopupCode,
  generateGeoJSONCode,
  generateChoroplethCode,
  convertCoordinates,
  suggestPlugin,
  searchExamples,
} from "./tools.js";

const server = new Server(
  {
    name: "leaflet-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "leaflet://docs/api-reference",
        mimeType: "text/plain",
        name: "Leaflet API Reference",
        description: "Complete Leaflet API documentation with all classes, methods, and options",
      },
      {
        uri: "leaflet://docs/quick-start",
        mimeType: "text/plain",
        name: "Leaflet Quick Start Guide",
        description: "Getting started with Leaflet - basic setup and initialization",
      },
      {
        uri: "leaflet://examples/all",
        mimeType: "text/plain",
        name: "All Leaflet Examples",
        description: "Collection of all official Leaflet examples and tutorials",
      },
      {
        uri: "leaflet://plugins/directory",
        mimeType: "text/plain",
        name: "Leaflet Plugins Directory",
        description: "Curated list of popular Leaflet plugins by category",
      },
    ],
  };
});

// Read resource content
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri.toString();

  if (uri === "leaflet://docs/api-reference") {
    return {
      contents: [
        {
          uri,
          mimeType: "text/plain",
          text: LEAFLET_DOCS.apiReference,
        },
      ],
    };
  }

  if (uri === "leaflet://docs/quick-start") {
    return {
      contents: [
        {
          uri,
          mimeType: "text/plain",
          text: LEAFLET_DOCS.quickStart,
        },
      ],
    };
  }

  if (uri === "leaflet://examples/all") {
    return {
      contents: [
        {
          uri,
          mimeType: "text/plain",
          text: LEAFLET_EXAMPLES,
        },
      ],
    };
  }

  if (uri === "leaflet://plugins/directory") {
    return {
      contents: [
        {
          uri,
          mimeType: "text/plain",
          text: LEAFLET_PLUGINS,
        },
      ],
    };
  }

  throw new McpError(ErrorCode.InvalidRequest, `Unknown resource: ${uri}`);
});

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "create_map",
        description:
          "Generate complete Leaflet map initialization code with HTML, CSS, and JavaScript. Includes tile layer setup and basic configuration.",
        inputSchema: {
          type: "object",
          properties: {
            center: {
              type: "object",
              properties: {
                lat: { type: "number", description: "Latitude coordinate" },
                lng: { type: "number", description: "Longitude coordinate" },
              },
              required: ["lat", "lng"],
              description: "Map center coordinates",
            },
            zoom: {
              type: "number",
              description: "Initial zoom level (0-19)",
              default: 13,
            },
            tileProvider: {
              type: "string",
              enum: ["openstreetmap", "cartodb", "stamen"],
              description: "Tile provider to use",
              default: "openstreetmap",
            },
            containerId: {
              type: "string",
              description: "HTML element ID for map container",
              default: "map",
            },
            includeHTML: {
              type: "boolean",
              description: "Include HTML boilerplate",
              default: true,
            },
          },
          required: ["center"],
        },
      },
      {
        name: "add_marker",
        description:
          "Generate code for adding markers to a Leaflet map with optional popups, tooltips, and custom icons.",
        inputSchema: {
          type: "object",
          properties: {
            position: {
              type: "object",
              properties: {
                lat: { type: "number", description: "Latitude coordinate" },
                lng: { type: "number", description: "Longitude coordinate" },
              },
              required: ["lat", "lng"],
              description: "Marker position",
            },
            popup: {
              type: "string",
              description: "Popup content (HTML supported)",
            },
            tooltip: {
              type: "string",
              description: "Tooltip text",
            },
            draggable: {
              type: "boolean",
              description: "Make marker draggable",
              default: false,
            },
            customIcon: {
              type: "boolean",
              description: "Include custom icon setup code",
              default: false,
            },
          },
          required: ["position"],
        },
      },
      {
        name: "create_layer",
        description:
          "Generate code for creating various Leaflet layers: polylines, polygons, circles, rectangles, and other vector layers.",
        inputSchema: {
          type: "object",
          properties: {
            layerType: {
              type: "string",
              enum: ["polyline", "polygon", "circle", "rectangle", "circleMarker"],
              description: "Type of layer to create",
            },
            coordinates: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  lat: { type: "number" },
                  lng: { type: "number" },
                },
              },
              description: "Array of coordinates for the layer",
            },
            center: {
              type: "object",
              properties: {
                lat: { type: "number" },
                lng: { type: "number" },
              },
              description: "Center coordinate (for circles)",
            },
            radius: {
              type: "number",
              description: "Radius in meters (for circles)",
            },
            style: {
              type: "object",
              properties: {
                color: { type: "string", description: "Stroke color" },
                weight: { type: "number", description: "Stroke width" },
                opacity: { type: "number", description: "Stroke opacity" },
                fillColor: { type: "string", description: "Fill color" },
                fillOpacity: { type: "number", description: "Fill opacity" },
              },
              description: "Layer styling options",
            },
            popup: {
              type: "string",
              description: "Popup content for the layer",
            },
          },
          required: ["layerType"],
        },
      },
      {
        name: "add_popup",
        description:
          "Generate code for creating and customizing Leaflet popups with various options and content.",
        inputSchema: {
          type: "object",
          properties: {
            content: {
              type: "string",
              description: "Popup content (HTML supported)",
            },
            position: {
              type: "object",
              properties: {
                lat: { type: "number" },
                lng: { type: "number" },
              },
              description: "Popup position (if standalone)",
            },
            maxWidth: {
              type: "number",
              description: "Maximum popup width in pixels",
              default: 300,
            },
            attachTo: {
              type: "string",
              enum: ["marker", "layer", "latlng"],
              description: "What to attach popup to",
              default: "marker",
            },
          },
          required: ["content"],
        },
      },
      {
        name: "create_geojson_layer",
        description:
          "Generate code for loading and displaying GeoJSON data on a Leaflet map with custom styling and interactions.",
        inputSchema: {
          type: "object",
          properties: {
            dataSource: {
              type: "string",
              enum: ["inline", "url", "variable"],
              description: "Source of GeoJSON data",
            },
            includeExample: {
              type: "boolean",
              description: "Include example GeoJSON data",
              default: true,
            },
            style: {
              type: "object",
              properties: {
                color: { type: "string" },
                weight: { type: "number" },
                opacity: { type: "number" },
              },
              description: "Default style for GeoJSON features",
            },
            onEachFeature: {
              type: "boolean",
              description: "Include onEachFeature handler example",
              default: true,
            },
            filter: {
              type: "boolean",
              description: "Include filter function example",
              default: false,
            },
          },
        },
      },
      {
        name: "create_choropleth",
        description:
          "Generate code for creating an interactive choropleth (data visualization) map with color scales and legends.",
        inputSchema: {
          type: "object",
          properties: {
            dataProperty: {
              type: "string",
              description: "Property name to visualize from GeoJSON",
              default: "density",
            },
            colorScheme: {
              type: "string",
              enum: ["sequential", "diverging", "qualitative"],
              description: "Type of color scheme",
              default: "sequential",
            },
            steps: {
              type: "number",
              description: "Number of color steps",
              default: 5,
            },
            includeLegend: {
              type: "boolean",
              description: "Include legend control",
              default: true,
            },
            includeInteraction: {
              type: "boolean",
              description: "Include hover effects and info box",
              default: true,
            },
          },
        },
      },
      {
        name: "convert_coordinates",
        description:
          "Convert between different coordinate formats (decimal degrees, DMS, various notations) and validate coordinates.",
        inputSchema: {
          type: "object",
          properties: {
            input: {
              type: "string",
              description: "Input coordinates in any common format",
            },
            outputFormat: {
              type: "string",
              enum: ["decimal", "dms", "leaflet", "geojson"],
              description: "Desired output format",
              default: "leaflet",
            },
          },
          required: ["input"],
        },
      },
      {
        name: "suggest_plugin",
        description:
          "Get recommendations for Leaflet plugins based on desired functionality or use case.",
        inputSchema: {
          type: "object",
          properties: {
            functionality: {
              type: "string",
              description:
                "What functionality are you looking for? (e.g., 'heatmap', 'clustering', 'routing', 'drawing')",
            },
            category: {
              type: "string",
              enum: [
                "markers",
                "overlays",
                "vector",
                "data",
                "controls",
                "interaction",
                "animation",
                "tile",
              ],
              description: "Plugin category",
            },
          },
        },
      },
      {
        name: "search_examples",
        description:
          "Search through official Leaflet examples and documentation for specific functionality or patterns.",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Search query (e.g., 'mobile', 'custom icon', 'geojson')",
            },
            includeCode: {
              type: "boolean",
              description: "Include code snippets in results",
              default: true,
            },
          },
          required: ["query"],
        },
      },
      {
        name: "debug_common_issues",
        description:
          "Get help debugging common Leaflet issues like map not displaying, tiles not loading, or marker icons missing.",
        inputSchema: {
          type: "object",
          properties: {
            issue: {
              type: "string",
              enum: [
                "map-not-showing",
                "tiles-not-loading",
                "markers-not-appearing",
                "icons-broken",
                "popup-not-working",
                "controls-missing",
                "other",
              ],
              description: "Type of issue you're experiencing",
            },
            description: {
              type: "string",
              description: "Detailed description of the problem",
            },
          },
          required: ["issue"],
        },
      },
    ],
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "create_map": {
        const result = generateMapCode(args);
        return {
          content: [{ type: "text", text: result }],
        };
      }

      case "add_marker": {
        const result = generateMarkerCode(args);
        return {
          content: [{ type: "text", text: result }],
        };
      }

      case "create_layer": {
        const result = generateLayerCode(args);
        return {
          content: [{ type: "text", text: result }],
        };
      }

      case "add_popup": {
        const result = generatePopupCode(args);
        return {
          content: [{ type: "text", text: result }],
        };
      }

      case "create_geojson_layer": {
        const result = generateGeoJSONCode(args);
        return {
          content: [{ type: "text", text: result }],
        };
      }

      case "create_choropleth": {
        const result = generateChoroplethCode(args);
        return {
          content: [{ type: "text", text: result }],
        };
      }

      case "convert_coordinates": {
        const result = convertCoordinates(args);
        return {
          content: [{ type: "text", text: result }],
        };
      }

      case "suggest_plugin": {
        const result = suggestPlugin(args);
        return {
          content: [{ type: "text", text: result }],
        };
      }

      case "search_examples": {
        const result = searchExamples(args);
        return {
          content: [{ type: "text", text: result }],
        };
      }

      case "debug_common_issues": {
        const result = debugCommonIssues(args);
        return {
          content: [{ type: "text", text: result }],
        };
      }

      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new McpError(ErrorCode.InternalError, `Tool execution failed: ${errorMessage}`);
  }
});

// Debug common issues helper
function debugCommonIssues(args: any): string {
  const { issue, description } = args;

  const solutions: Record<string, string> = {
    "map-not-showing": `# Map Not Showing - Common Fixes

**1. Check Container Height**
The map container MUST have a defined height in CSS:
\`\`\`css
#map {
  height: 400px;  /* or any specific height */
  /* height: 100vh; for fullscreen */
}
\`\`\`

**2. Verify Map Initialization**
\`\`\`javascript
var map = L.map('map').setView([51.505, -0.09], 13);
\`\`\`

**3. Check CSS/JS Loading**
- Leaflet CSS must be loaded BEFORE Leaflet JS
- Check browser console for errors

**4. Container Must Exist**
Initialize the map AFTER the DOM is ready:
\`\`\`javascript
document.addEventListener('DOMContentLoaded', function() {
  var map = L.map('map').setView([51.505, -0.09], 13);
  // ... rest of code
});
\`\`\``,

    "tiles-not-loading": `# Tiles Not Loading - Solutions

**1. Check Tile URL Format**
\`\`\`javascript
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap'
}).addTo(map);
\`\`\`
Note: Use \`{s}\`, \`{z}\`, \`{x}\`, \`{y}\` placeholders

**2. Network/CORS Issues**
- Check browser network tab
- Some tile providers require API keys
- Check if HTTPS is required

**3. Attribution Required**
Many tile providers require attribution:
\`\`\`javascript
attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
\`\`\`

**4. Try Alternative Provider**
\`\`\`javascript
// CartoDB as fallback
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  maxZoom: 19
}).addTo(map);
\`\`\``,

    "markers-not-appearing": `# Markers Not Appearing - Fixes

**1. Verify Coordinates**
\`\`\`javascript
// Correct order: [latitude, longitude]
L.marker([51.5, -0.09]).addTo(map);
\`\`\`

**2. Check Map Bounds**
Ensure marker is within visible map area:
\`\`\`javascript
map.setView([51.5, -0.09], 13);  // Center on marker location
\`\`\`

**3. Verify .addTo(map) Called**
\`\`\`javascript
var marker = L.marker([51.5, -0.09]);
marker.addTo(map);  // Don't forget this!
\`\`\`

**4. Check Z-Index**
Markers might be behind other elements.`,

    "icons-broken": `# Broken Marker Icons - Solutions

**1. Icon Path Issue (Most Common)**
Leaflet looks for images in wrong location. Fix:
\`\`\`javascript
// Option 1: Set icon path
L.Icon.Default.imagePath = 'https://unpkg.com/leaflet@1.9.4/dist/images/';

// Option 2: Use CDN icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});
\`\`\`

**2. Webpack/Bundler Issues**
Import images explicitly:
\`\`\`javascript
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

var defaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

L.Marker.prototype.options.icon = defaultIcon;
\`\`\``,

    "popup-not-working": `# Popup Issues - Solutions

**1. Bind Popup Correctly**
\`\`\`javascript
// Method 1: Chain
L.marker([51.5, -0.09])
  .addTo(map)
  .bindPopup('Content');

// Method 2: Separate
var marker = L.marker([51.5, -0.09]).addTo(map);
marker.bindPopup('Content');
\`\`\`

**2. Open Popup Programmatically**
\`\`\`javascript
marker.openPopup();  // After binding
\`\`\`

**3. Standalone Popup**
\`\`\`javascript
L.popup()
  .setLatLng([51.5, -0.09])
  .setContent('Content')
  .openOn(map);
\`\`\`

**4. Check Event Handling**
Click events might be blocked by other layers.`,

    "controls-missing": `# Controls Not Showing - Fixes

**1. Disable Default Controls**
Check if controls were disabled:
\`\`\`javascript
var map = L.map('map', {
  zoomControl: true,  // Make sure this is true
  attributionControl: true
}).setView([51.5, -0.09], 13);
\`\`\`

**2. Add Custom Control Position**
\`\`\`javascript
L.control.zoom({
  position: 'topright'
}).addTo(map);
\`\`\`

**3. CSS Conflict**
Check if CSS is overriding control styles:
\`\`\`css
.leaflet-control {
  z-index: 1000 !important;
}
\`\`\``,

    other: `# General Debugging Tips

**1. Check Browser Console**
Look for JavaScript errors or warnings

**2. Verify Leaflet Version**
\`\`\`javascript
console.log(L.version);
\`\`\`

**3. Test with Minimal Example**
\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>#map { height: 400px; }</style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    var map = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
  </script>
</body>
</html>
\`\`\`

**4. Common Issues Checklist**
- [ ] Container has height
- [ ] CSS loaded before JS
- [ ] Correct coordinate order [lat, lng]
- [ ] .addTo(map) called
- [ ] No JavaScript errors in console
- [ ] Attribution included for tile provider

**Additional Issue:** ${description || "No description provided"}`,
  };

  return solutions[issue] || solutions.other;
}

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Leaflet MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
