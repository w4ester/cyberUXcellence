const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  componentsDir: './components',
  coreStylesDir: './core/styles',
  coreScriptsDir: './core/scripts',
  buildDir: './build',
  templateFile: './index-template.html'
};

// Create build directory if it doesn't exist
if (!fs.existsSync(config.buildDir)) {
  fs.mkdirSync(config.buildDir, { recursive: true });
}

// Read component HTML files
function buildHTML() {
  console.log('Building HTML...');
  
  // Read template
  let template = fs.readFileSync(config.templateFile, 'utf8');
  
  // Get all component directories
  const componentDirs = fs.readdirSync(config.componentsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  // Process each component
  componentDirs.forEach(componentName => {
    const htmlFile = path.join(config.componentsDir, componentName, `${componentName.toLowerCase()}.html`);
    
    if (fs.existsSync(htmlFile)) {
      const componentHtml = fs.readFileSync(htmlFile, 'utf8');
      const placeholder = `<!-- ${componentName.toUpperCase()} -->`;
      
      template = template.replace(placeholder, componentHtml);
    }
  });
  
  // Write final HTML
  fs.writeFileSync(path.join(config.buildDir, 'index.html'), template);
  console.log('HTML build complete.');
}

// Concatenate CSS files
function buildCSS() {
  console.log('Building CSS...');
  
  let combinedCSS = '';
  
  // Core styles
  const coreStyles = [
    'variables.css',
    'reset.css',
    'typography.css',
    'layout.css',
    'utilities.css'
  ];
  
  // Add core styles first
  coreStyles.forEach(file => {
    const filePath = path.join(config.coreStylesDir, file);
    if (fs.existsSync(filePath)) {
      combinedCSS += fs.readFileSync(filePath, 'utf8') + '\n';
    }
  });
  
  // Get all component directories
  const componentDirs = fs.readdirSync(config.componentsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  // Add component styles
  componentDirs.forEach(componentName => {
    const cssFile = path.join(config.componentsDir, componentName, `${componentName.toLowerCase()}.css`);
    
    if (fs.existsSync(cssFile)) {
      combinedCSS += `/* ${componentName} Component Styles */\n`;
      combinedCSS += fs.readFileSync(cssFile, 'utf8') + '\n';
    }
  });
  
  // Write combined CSS
  fs.writeFileSync(path.join(config.buildDir, 'styles.css'), combinedCSS);
  console.log('CSS build complete.');
}

// Concatenate JavaScript files
function buildJS() {
  console.log('Building JavaScript...');
  
  let combinedJS = '';
  
  // Core scripts
  const coreScripts = [
    'utils.js',
    'main.js'
  ];
  
  // Add core scripts first
  coreScripts.forEach(file => {
    const filePath = path.join(config.coreScriptsDir, file);
    if (fs.existsSync(filePath)) {
      combinedJS += fs.readFileSync(filePath, 'utf8') + '\n';
    }
  });
  
  // Get all component directories
  const componentDirs = fs.readdirSync(config.componentsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  // Add component scripts
  componentDirs.forEach(componentName => {
    const jsFile = path.join(config.componentsDir, componentName, `${componentName.toLowerCase()}.js`);
    
    if (fs.existsSync(jsFile)) {
      combinedJS += `/* ${componentName} Component Script */\n`;
      combinedJS += fs.readFileSync(jsFile, 'utf8') + '\n';
    }
  });
  
  // Write combined JS
  fs.writeFileSync(path.join(config.buildDir, 'scripts.js'), combinedJS);
  console.log('JavaScript build complete.');
}

// Copy static assets
function copyAssets() {
  console.log('Copying assets...');
  
  // Create assets directory if it doesn't exist
  const buildAssetsDir = path.join(config.buildDir, 'assets');
  if (!fs.existsSync(buildAssetsDir)) {
    fs.mkdirSync(buildAssetsDir, { recursive: true });
  }
  
  // Copy images
  const imagesDir = './core/assets/images';
  if (fs.existsSync(imagesDir)) {
    const buildImagesDir = path.join(buildAssetsDir, 'images');
    if (!fs.existsSync(buildImagesDir)) {
      fs.mkdirSync(buildImagesDir, { recursive: true });
    }
    
    const images = fs.readdirSync(imagesDir);
    images.forEach(image => {
      fs.copyFileSync(
        path.join(imagesDir, image), 
        path.join(buildImagesDir, image)
      );
    });
  }
  
  // Copy fonts
  const fontsDir = './core/assets/fonts';
  if (fs.existsSync(fontsDir)) {
    const buildFontsDir = path.join(buildAssetsDir, 'fonts');
    if (!fs.existsSync(buildFontsDir)) {
      fs.mkdirSync(buildFontsDir, { recursive: true });
    }
    
    const fonts = fs.readdirSync(fontsDir);
    fonts.forEach(font => {
      fs.copyFileSync(
        path.join(fontsDir, font), 
        path.join(buildFontsDir, font)
      );
    });
  }
  
  console.log('Assets copied.');
}

// Update image paths in HTML and CSS
function updateAssetPaths() {
  console.log('Updating asset paths...');
  
  // Update HTML
  const htmlFile = path.join(config.buildDir, 'index.html');
  if (fs.existsSync(htmlFile)) {
    let htmlContent = fs.readFileSync(htmlFile, 'utf8');
    
    // Update paths in HTML
    htmlContent = htmlContent.replace(/src="core\/assets\/images\//g, 'src="build/assets/images/');
    htmlContent = htmlContent.replace(/href="core\/assets\/images\//g, 'href="build/assets/images/');
    
    fs.writeFileSync(htmlFile, htmlContent);
  }
  
  // Update CSS
  const cssFile = path.join(config.buildDir, 'styles.css');
  if (fs.existsSync(cssFile)) {
    let cssContent = fs.readFileSync(cssFile, 'utf8');
    
    // Update paths in CSS
    cssContent = cssContent.replace(/url\(['"]?core\/assets\/images\//g, 'url(\'build/assets/images/');
    cssContent = cssContent.replace(/url\(['"]?core\/assets\/fonts\//g, 'url(\'build/assets/fonts/');
    
    fs.writeFileSync(cssFile, cssContent);
  }
  
  console.log('Asset paths updated.');
}

// Run the build process
function runBuild() {
  console.log('Starting build process...');
  
  buildHTML();
  buildCSS();
  buildJS();
  copyAssets();
  updateAssetPaths();
  
  console.log('Build completed successfully!');
}

// Execute the build
runBuild();