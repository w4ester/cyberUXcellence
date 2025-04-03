# CyberUXcellence Awards Website

## Modular Website Architecture

This website uses a component-based architecture that separates functionality into modular pieces. The build system combines these components into a single deployable website.

## Key Components

1. **Build System (`build.js`)**
   - NodeJS script that assembles the final website
   - Combines component HTML into template
   - Concatenates CSS and JS files
   - Copies static assets
   - Updates asset paths

2. **Component Structure**
   - Each UI component lives in `/components/{ComponentName}/`
   - Components contain matching HTML/CSS/JS files:
     - `componentname.html` - Markup structure
     - `componentname.css` - Component-specific styles
     - `componentname.js` - Component functionality

3. **Core Assets**
   - `/core/styles/` - Base styles (variables, reset, typography, etc.)
   - `/core/scripts/` - Utility functions and main initialization
   - `/core/assets/` - Images, fonts, and other static resources

4. **Template System**
   - `index-template.html` defines the page structure
   - Components are inserted at placeholder comments (`<!-- HEADER -->`)

## Getting Started

### Prerequisites

- Node.js (for build script)
- Python (for local development server)

### Local Development

1. Build the site:
```
node build.js
```

2. Start a local server:
```
python -m http.server
```

3. Open your browser and go to http://localhost:8000

## Build Process

1. HTML components are inserted into template
2. CSS files are concatenated (core first, then components)
3. JS files are combined (core first, then components)
4. Static assets are copied to build directory
5. Asset paths are updated in compiled files

The build outputs a complete website in the `/build` directory that can be served by any static web server.
