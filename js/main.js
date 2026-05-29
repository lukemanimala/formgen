// Application initialization
let renderer;
let ui;
let animationFrameId;
let debugMode = false;
let debugRAF = null;

function initializeApp() {
    // Create renderer
    const canvas = document.getElementById('mandalaCanvas');
    renderer = new MandalaRenderer(canvas);
    
    // Create UI controls
    ui = new UIControls(renderer, render);
    
    // Create default three layers with nice colors
    const layer1 = new Layer(0, 0);
    layer1.color = '#FF6B6B';
    layer1.quantity = 8;
    layer1.radialOffset = 0;
    layer1.petalHeight = 1.0;
    layer1.concaveness = 0;
    layer1.zoom = 1.0;
    layer1.shadowStrength = 0;
    
    const layer2 = new Layer(1, 1);
    layer2.color = '#4ECDC4';
    layer2.quantity = 6;
    layer2.radialOffset = 0;
    layer2.petalHeight = 1.0;
    layer2.concaveness = -0.3;
    layer2.zoom = 1.0;
    layer2.shadowStrength = 20;
    
    const layer3 = new Layer(2, 2);
    layer3.color = '#FFE66D';
    layer3.quantity = 12;
    layer3.radialOffset = 0;
    layer3.petalHeight = 1.2;
    layer3.concaveness = 0.5;
    layer3.zoom = 1.0;
    layer3.shadowStrength = 40;
    
    renderer.addLayer(layer1);
    renderer.addLayer(layer2);
    renderer.addLayer(layer3);
    
    // Render initial UI
    ui.renderZOrder();
    ui.setSelectedLayer(layer3.id);
    
    // Initial render
    render();
    
    // Set up export buttons
    document.getElementById('exportPngBtn').addEventListener('click', () => {
        renderer.exportPNG(8); // 8x resolution
    });
    
    document.getElementById('exportSvgBtn').addEventListener('click', () => {
        renderer.exportSVG();
    });
    
    // Set up add layer button
    document.getElementById('addLayerBtn').addEventListener('click', () => {
        addNewLayer();
    });

    // Debug mode toggle
    document.getElementById('debugModeBtn').addEventListener('click', toggleDebugMode);
}

function addNewLayer() {
    const layerId = Math.max(...renderer.layers.map(l => l.id), -1) + 1;
    const zIndex = 0; // Add to bottom (z-index 0)
    
    // Get the current bottom layer to increment petal height
    const bottomLayer = renderer.layers[0];
    const newPetalHeight = bottomLayer ? bottomLayer.petalHeight + 0.15 : 1.0;
    
    const newLayer = new Layer(layerId, zIndex);
    newLayer.color = '#' + Math.floor(Math.random()*16777215).toString(16);
    newLayer.quantity = 8;
    newLayer.radialOffset = 0;
    newLayer.petalHeight = newPetalHeight;
    newLayer.concaveness = 0;
    newLayer.zoom = 1.0;
    newLayer.shadowStrength = 0;
    
    renderer.addLayer(newLayer);
    // Re-index all layers to maintain proper z-order
    renderer.layers.forEach((layer, index) => {
        layer.zIndex = index;
    });
    ui.renderZOrder();
    ui.setSelectedLayer(newLayer.id);
    render();
}

function render() {
    // Cancel previous animation frame if still pending
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    
    // Schedule render on next frame
    animationFrameId = requestAnimationFrame(() => {
        renderer.render();
    });
}

// Debug helpers
function toggleDebugMode() {
    debugMode = !debugMode;
    const btn = document.getElementById('debugModeBtn');
    const panel = document.getElementById('debugPanel');
    if (debugMode) {
        btn.classList.add('active');
        if (panel) panel.style.display = 'block';
        startDebugLoop();
    } else {
        btn.classList.remove('active');
        if (panel) panel.style.display = 'none';
        stopDebugLoop();
    }
}

function startDebugLoop() {
    if (debugRAF) return;
    const outEl = document.querySelector('#debugPanel .debug-output');
    const loop = () => {
        render();
        if (renderer && typeof renderer.debugExportAndAnalyze === 'function') {
            const analysis = renderer.debugExportAndAnalyze();
            const ts = new Date().toLocaleTimeString();
            const line = `[${ts}] PNG ${analysis.png.resolution} (${analysis.png.scale}), layers=${analysis.png.layerCount}\n` +
                         `           SVG ${analysis.svg.viewBox}, groups=${analysis.svg.layerGroups}, shadows=${analysis.svg.shadowGroups}, grads=${analysis.svg.gradients}\n`;
            if (outEl) {
                outEl.textContent = line + outEl.textContent;
            }
        }
        debugRAF = requestAnimationFrame(loop);
    };
    debugRAF = requestAnimationFrame(loop);
}

function stopDebugLoop() {
    if (debugRAF) {
        cancelAnimationFrame(debugRAF);
        debugRAF = null;
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
