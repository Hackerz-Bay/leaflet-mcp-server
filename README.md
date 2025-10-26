# Leaflet MCP Server

A [Model Context Protocol](https://modelcontextprotocol.io) (MCP) server that provides comprehensive documentation, code generation, and interactive tools for [Leaflet.js](https://leafletjs.com/) - the leading open-source JavaScript library for mobile-friendly interactive maps.

## Overview

This MCP server enables AI assistants like Claude to help developers work with Leaflet.js by providing:

- **📚 Complete API Documentation** - Full Leaflet API reference and quick start guides
- **🛠️ Code Generation Tools** - Generate ready-to-use Leaflet code for common patterns
- **🔍 Smart Search** - Find relevant examples and documentation quickly
- **🎨 Plugin Recommendations** - Discover and integrate Leaflet plugins
- **🐛 Debugging Help** - Solutions for common Leaflet issues
- **🗺️ Interactive Examples** - Access to official Leaflet examples with code

## Features

### Resources

The server exposes four main documentation resources:

1. **Leaflet API Reference** (`leaflet://docs/api-reference`)
   - Complete API documentation for all Leaflet classes
   - Methods, options, and events for Map, Marker, TileLayer, Popup, etc.
   - Vector layers (Polyline, Polygon, Circle, Rectangle)
   - GeoJSON, LayerGroup, Controls, Events, and utility functions

2. **Quick Start Guide** (`leaflet://docs/quick-start`)
   - Getting started with Leaflet
   - Installation via CDN or npm
   - Basic map setup and initialization
   - Common patterns and troubleshooting

3. **All Leaflet Examples** (`leaflet://examples/all`)
   - Collection of official Leaflet examples
   - Mobile-friendly maps, custom icons, GeoJSON
   - Choropleth maps, layer controls, accessibility
   - Performance tips and best practices

4. **Plugins Directory** (`leaflet://plugins/directory`)
   - Curated list of 40+ popular Leaflet plugins
   - Organized by category (markers, drawing, visualization, controls, etc.)
   - Installation instructions and code examples
   - Links to GitHub repositories

### Tools

The server provides 10 powerful tools for working with Leaflet:

#### 1. **create_map**
Generate complete Leaflet map initialization code with HTML boilerplate.

**Parameters:**
- `center` (required): `{lat: number, lng: number}` - Map center coordinates
- `zoom`: Initial zoom level (0-19, default: 13)
- `tileProvider`: Tile provider - "openstreetmap", "cartodb", or "stamen"
- `containerId`: HTML element ID (default: "map")
- `includeHTML`: Include full HTML page (default: true)

**Example Use Case:**
```
"Create a map centered on San Francisco at zoom level 12"
```

#### 2. **add_marker**
Generate code for adding markers with popups, tooltips, and custom icons.

**Parameters:**
- `position` (required): `{lat: number, lng: number}` - Marker position
- `popup`: Popup content (HTML supported)
- `tooltip`: Tooltip text
- `draggable`: Make marker draggable (default: false)
- `customIcon`: Include custom icon setup code (default: false)

**Example Use Case:**
```
"Add a draggable marker at Golden Gate Bridge with a popup"
```

#### 3. **create_layer**
Generate code for creating vector layers (polylines, polygons, circles, rectangles).

**Parameters:**
- `layerType` (required): "polyline", "polygon", "circle", "rectangle", or "circleMarker"
- `coordinates`: Array of `{lat, lng}` objects (for polylines/polygons)
- `center`: `{lat, lng}` for circles/circle markers
- `radius`: Radius in meters (for circles) or pixels (for circle markers)
- `style`: Styling options (color, weight, opacity, fillColor, fillOpacity)
- `popup`: Popup content for the layer

**Example Use Case:**
```
"Draw a red polygon around downtown Seattle"
```

#### 4. **add_popup**
Generate code for creating and customizing popups.

**Parameters:**
- `content` (required): Popup content (HTML supported)
- `position`: `{lat, lng}` for standalone popups
- `maxWidth`: Maximum width in pixels (default: 300)
- `attachTo`: "marker", "layer", or "latlng" (default: "marker")

**Example Use Case:**
```
"Create a popup with an image and button"
```

#### 5. **create_geojson_layer**
Generate code for loading and displaying GeoJSON data with custom styling.

**Parameters:**
- `dataSource`: "inline", "url", or "variable" (default: "inline")
- `includeExample`: Include example GeoJSON data (default: true)
- `style`: Default style object for features
- `onEachFeature`: Include onEachFeature handler example (default: true)
- `filter`: Include filter function example (default: false)

**Example Use Case:**
```
"Load GeoJSON from a URL and style features by property"
```

#### 6. **create_choropleth**
Generate code for creating interactive choropleth (data visualization) maps.

**Parameters:**
- `dataProperty`: Property name to visualize from GeoJSON (default: "density")
- `colorScheme`: "sequential", "diverging", or "qualitative" (default: "sequential")
- `steps`: Number of color steps (default: 5)
- `includeLegend`: Include legend control (default: true)
- `includeInteraction`: Include hover effects and info box (default: true)

**Example Use Case:**
```
"Create a population density choropleth map with legend"
```

#### 7. **convert_coordinates**
Convert between different coordinate formats and validate coordinates.

**Parameters:**
- `input` (required): Coordinates in any common format
- `outputFormat`: "decimal", "dms", "leaflet", or "geojson" (default: "leaflet")

**Supported Input Formats:**
- Decimal degrees: `51.505, -0.09`
- Array format: `[51.505, -0.09]`
- DMS: `51°30'18"N 0°5'24"W`

**Example Use Case:**
```
"Convert 40.7128° N, 74.0060° W to Leaflet format"
```

#### 8. **suggest_plugin**
Get recommendations for Leaflet plugins based on functionality or category.

**Parameters:**
- `functionality`: What you're looking for (e.g., "heatmap", "clustering", "routing")
- `category`: "markers", "overlays", "vector", "data", "controls", "interaction", "animation", or "tile"

**Example Use Case:**
```
"Find a plugin for marker clustering"
"Suggest plugins for drawing shapes"
```

#### 9. **search_examples**
Search through official Leaflet examples for specific functionality.

**Parameters:**
- `query` (required): Search term (e.g., "mobile", "geojson", "choropleth")
- `includeCode`: Include code snippets in results (default: true)

**Example Use Case:**
```
"Show me examples of custom marker icons"
"Find examples for mobile geolocation"
```

#### 10. **debug_common_issues**
Get help debugging common Leaflet problems.

**Parameters:**
- `issue` (required): Issue type
  - "map-not-showing"
  - "tiles-not-loading"
  - "markers-not-appearing"
  - "icons-broken"
  - "popup-not-working"
  - "controls-missing"
  - "other"
- `description`: Detailed description of the problem

**Example Use Case:**
```
"Why is my map not showing?"
"Help fix broken marker icons in webpack"
```

## Installation

### As an MCP Server

1. **Clone or download this repository:**
   ```bash
   git clone <repository-url>
   cd leaflet-mcp-server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the server:**
   ```bash
   npm run build
   ```

4. **Configure your MCP client** (e.g., Claude Desktop):

   Add to your MCP settings file:

   **macOS/Linux:** `~/Library/Application Support/Claude/claude_desktop_config.json`
   **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

   ```json
   {
     "mcpServers": {
       "leaflet": {
         "command": "node",
         "args": ["/absolute/path/to/leaflet-mcp-server/build/index.js"]
       }
     }
   }
   ```

5. **Restart your MCP client** to load the server.

### Development Mode

Watch for changes during development:
```bash
npm run watch
```

## Usage Examples

Once configured, you can ask your AI assistant questions like:

### Getting Started
- "Create a basic Leaflet map centered on Tokyo"
- "Show me how to add a marker with a popup"
- "How do I initialize a Leaflet map?"

### Working with Data
- "Load GeoJSON data from a URL and display it on the map"
- "Create a choropleth map showing population density"
- "How do I style GeoJSON features based on properties?"

### Customization
- "Add a draggable marker with a custom icon"
- "Draw a circle with a 500-meter radius around a point"
- "Create a polygon and add a popup to it"

### Finding Solutions
- "Why aren't my map tiles loading?"
- "Find a plugin for clustering markers"
- "Show me examples of custom marker icons"
- "Convert these GPS coordinates to Leaflet format"

### Advanced Features
- "How do I create a heatmap in Leaflet?"
- "Find plugins for drawing and editing shapes"
- "Show me how to use layer controls"

## Architecture

### Project Structure

```
leaflet-mcp-server/
├── src/
│   ├── index.ts        # Main MCP server implementation
│   ├── tools.ts        # Code generation tool implementations
│   ├── docs.ts         # API reference and quick start documentation
│   ├── examples.ts     # Official Leaflet examples collection
│   └── plugins.ts      # Curated plugins directory
├── build/              # Compiled JavaScript (generated)
├── package.json        # Project metadata and dependencies
├── tsconfig.json       # TypeScript configuration
└── README.md          # This file
```

### Technical Details

- **Language:** TypeScript compiled to ES2022
- **Module System:** ES Modules (Node16)
- **MCP SDK:** `@modelcontextprotocol/sdk` v1.0.4+
- **Runtime:** Node.js (requires ES2022 support)
- **Transport:** stdio (standard input/output)

### How It Works

1. **Server Initialization:**
   - The server starts and listens on stdio
   - Registers resources (documentation) and tools (code generators)
   - Waits for requests from MCP clients

2. **Resource Access:**
   - Clients can read documentation resources via URI scheme (`leaflet://`)
   - Resources return formatted markdown content
   - Content includes code examples and API references

3. **Tool Execution:**
   - Clients invoke tools with structured parameters
   - Tools generate appropriate Leaflet code based on parameters
   - Results include code snippets with explanations and next steps

4. **Communication:**
   - All communication uses the Model Context Protocol
   - Requests and responses are JSON-RPC formatted
   - Server is stateless - each request is independent

## API Documentation

### Resource URIs

| URI | Description | Content |
|-----|-------------|---------|
| `leaflet://docs/api-reference` | Complete Leaflet API | Classes, methods, options, events |
| `leaflet://docs/quick-start` | Getting started guide | Installation, setup, common patterns |
| `leaflet://examples/all` | Official examples | 15+ example tutorials with code |
| `leaflet://plugins/directory` | Plugins catalog | 40+ plugins organized by category |

### Tool Schemas

All tools follow the MCP tool schema format with:
- **name:** Tool identifier
- **description:** What the tool does
- **inputSchema:** JSON Schema for parameters

See the [Tool Details](#tools) section above for complete parameter documentation.

## Development

### Prerequisites

- Node.js 16+ (with ES2022 support)
- npm or yarn
- TypeScript knowledge (optional, for modifications)

### Building from Source

```bash
# Install dependencies
npm install

# Build once
npm run build

# Watch mode (auto-rebuild on changes)
npm run watch

# Prepare for distribution
npm run prepare
```

### Adding New Tools

1. **Add tool implementation in `src/tools.ts`:**
   ```typescript
   export function myNewTool(args: any): string {
     // Implementation
     return formattedResult;
   }
   ```

2. **Register tool in `src/index.ts`:**
   ```typescript
   // In ListToolsRequestSchema handler
   {
     name: "my_new_tool",
     description: "What this tool does",
     inputSchema: { /* JSON Schema */ }
   }

   // In CallToolRequestSchema handler
   case "my_new_tool": {
     const result = myNewTool(args);
     return { content: [{ type: "text", text: result }] };
   }
   ```

3. **Rebuild and test:**
   ```bash
   npm run build
   ```

### Adding New Resources

1. **Add content in appropriate file** (`src/docs.ts`, `src/examples.ts`, etc.)

2. **Register in `src/index.ts`:**
   ```typescript
   // In ListResourcesRequestSchema handler
   {
     uri: "leaflet://my/resource",
     mimeType: "text/plain",
     name: "Resource Name",
     description: "Resource description"
   }

   // In ReadResourceRequestSchema handler
   if (uri === "leaflet://my/resource") {
     return {
       contents: [{
         uri,
         mimeType: "text/plain",
         text: MY_RESOURCE_CONTENT
       }]
     };
   }
   ```

## Common Use Cases

### Web Development
- Quickly scaffold new map applications
- Add interactive mapping features to existing sites
- Prototype location-based features
- Learn Leaflet API through examples

### Data Visualization
- Create choropleth maps for data analysis
- Display geographic datasets
- Build dashboards with embedded maps
- Visualize spatial data from GeoJSON

### Mobile Development
- Implement mobile-friendly maps
- Add geolocation features
- Optimize for touch interactions
- Build responsive map interfaces

### Education & Learning
- Learn Leaflet.js through guided examples
- Understand mapping concepts
- Explore plugin ecosystem
- Debug common issues

## Troubleshooting

### Server Not Connecting

**Problem:** MCP client can't connect to the server

**Solutions:**
1. Verify the path in your MCP config is absolute and correct
2. Ensure the build directory exists: `npm run build`
3. Check that Node.js is in your PATH
4. Look for errors in your MCP client logs
5. Restart your MCP client after configuration changes

### Build Errors

**Problem:** `npm run build` fails

**Solutions:**
1. Delete `node_modules` and `build` directories
2. Run `npm install` again
3. Check Node.js version: `node --version` (need 16+)
4. Ensure TypeScript is installed correctly

### Tool Not Working

**Problem:** Tool returns unexpected results

**Solutions:**
1. Check parameter types match the schema
2. Verify required parameters are provided
3. Look for error messages in tool output
4. Try with minimal parameters first

### Documentation Not Loading

**Problem:** Resource content is empty or incorrect

**Solutions:**
1. Rebuild the server: `npm run build`
2. Check that source files in `src/` are unchanged
3. Verify URI syntax in requests

## Resources

### Leaflet Documentation
- **Official Site:** https://leafletjs.com/
- **API Reference:** https://leafletjs.com/reference.html
- **Examples:** https://leafletjs.com/examples.html
- **Plugins:** https://leafletjs.com/plugins.html

### Model Context Protocol
- **Documentation:** https://modelcontextprotocol.io/
- **Specification:** https://spec.modelcontextprotocol.io/
- **SDK Reference:** https://github.com/modelcontextprotocol/sdk

### Community
- **Leaflet GitHub:** https://github.com/Leaflet/Leaflet
- **Stack Overflow:** [leaflet tag](https://stackoverflow.com/questions/tagged/leaflet)
- **GIS Stack Exchange:** [leaflet tag](https://gis.stackexchange.com/questions/tagged/leaflet)
- **Awesome Leaflet:** https://github.com/tomik23/awesome-leaflet

## Contributing

Contributions are welcome! Here are ways to help:

1. **Report Issues:** Found a bug or have a suggestion? Open an issue
2. **Add Tools:** Implement new code generation tools
3. **Improve Documentation:** Enhance inline docs and examples
4. **Add Plugin Info:** Suggest additional plugins for the directory
5. **Share Use Cases:** Tell us how you're using this server

## License

MIT License - see LICENSE file for details

## Acknowledgments

- **Leaflet.js** - Created by [Vladimir Agafonkin](https://agafonkin.com/) and maintained by the open-source community
- **Model Context Protocol** - Developed by [Anthropic](https://www.anthropic.com/)
- **Plugin Authors** - Thanks to all Leaflet plugin maintainers
- **OpenStreetMap** - For providing free map data

## Version History

### 1.0.0 (Current)
- Initial release
- 10 code generation tools
- 4 documentation resources
- Complete API reference
- 40+ plugin recommendations
- Official examples collection
- Common issue debugger

---

**Built with ❤️ for the Leaflet and MCP communities**

For questions, issues, or feedback, please open an issue on GitHub.
