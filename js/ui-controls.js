class UIControls {
    constructor(renderer, onRender) {
        this.renderer = renderer;
        this.onRender = onRender;
        this.selectedLayerId = null;
        this.renderTimeout = null;
    }
    
    throttledRender() {
        // Cancel existing timeout
        if (this.renderTimeout) {
            clearTimeout(this.renderTimeout);
        }
        // Render immediately, then schedule cleanup
        this.renderTimeout = setTimeout(() => {
            // Render will be called continuously by event handlers
        }, 16); // ~60fps
    }
    
    setSelectedLayer(layerId) {
        this.selectedLayerId = layerId;
        this.renderSelectedLayerPanel();
        this.highlightSelectedInZOrder();
        this.onRender();
    }
    
    createLayerPanel(layer) {
        const panel = document.createElement('div');
        panel.className = 'layer-panel';
        panel.id = `layer-panel-${layer.id}`;
        
        panel.innerHTML = `
            <div class="layer-panel-header">
                <h3>Layer ${layer.id + 1}</h3>
                <button class="collapse-btn" data-layer-id="${layer.id}">▼</button>
            </div>
            
            <div class="layer-panel-content">
                <!-- Input Source -->
                <div class="control-group">
                    <label>Input Source</label>
                    <div class="radio-group">
                        <label class="radio-label">
                            <input type="radio" name="input-type-${layer.id}" value="color" 
                                ${layer.inputType === 'color' ? 'checked' : ''} 
                                class="input-type-radio" data-layer-id="${layer.id}">
                            Color
                        </label>
                        <label class="radio-label">
                            <input type="radio" name="input-type-${layer.id}" value="gradient" 
                                ${layer.inputType === 'gradient' ? 'checked' : ''} 
                                class="input-type-radio" data-layer-id="${layer.id}">
                            Gradient
                        </label>
                        <label class="radio-label">
                            <input type="radio" name="input-type-${layer.id}" value="image" 
                                ${layer.inputType === 'image' ? 'checked' : ''} 
                                class="input-type-radio" data-layer-id="${layer.id}">
                            Image
                        </label>
                    </div>
                </div>
                
                <!-- Color Picker (shown for color input) -->
                <div class="control-group color-control-group" style="display: ${layer.inputType === 'color' ? 'block' : 'none'}">
                    <label>Color</label>
                    <input type="color" class="color-input" value="${layer.color}" 
                        data-layer-id="${layer.id}">
                </div>
                
                <!-- Gradient Colors (shown for gradient input) -->
                <div class="control-group gradient-control-group" style="display: ${layer.inputType === 'gradient' ? 'block' : 'none'}">
                    <label>Gradient Start</label>
                    <input type="color" class="gradient-start-input" value="${layer.color}" 
                        data-layer-id="${layer.id}">
                    <label>Gradient End</label>
                    <input type="color" class="gradient-end-input" value="${layer.gradientColor}" 
                        data-layer-id="${layer.id}">
                </div>
                
                <!-- Image Upload (shown for image input) -->
                <div class="control-group image-control-group" style="display: ${layer.inputType === 'image' ? 'block' : 'none'}">
                    <label>Image Upload</label>
                    <input type="file" class="image-input" accept="image/*" 
                        data-layer-id="${layer.id}">
                    <div class="image-preview" id="preview-${layer.id}"></div>
                </div>
                
                <!-- Mandala Parameters -->
                <div class="control-group">
                    <label>Radial Offset: <span class="value">${layer.radialOffset}</span>px</label>
                    <input type="range" class="radial-offset" min="0" max="300" step="1" 
                        value="${layer.radialOffset}" data-layer-id="${layer.id}">
                </div>
                
                <div class="control-group">
                    <label>Petal Height: <span class="value">${layer.petalHeight.toFixed(2)}</span></label>
                    <input type="range" class="petal-height" min="0.1" max="2" step="0.1"
                        value="${layer.petalHeight}" data-layer-id="${layer.id}">
                </div>
                
                <div class="control-group">
                    <label>Concaveness: <span class="value">${layer.concaveness.toFixed(2)}</span></label>
                    <input type="range" class="concaveness" min="-2" max="2" step="0.05"
                        value="${layer.concaveness}" data-layer-id="${layer.id}">
                </div>
                
                <div class="control-group">
                    <label>Quantity: <span class="value">${layer.quantity}</span></label>
                    <input type="range" class="quantity" min="2" max="24" step="1" 
                        value="${layer.quantity}" data-layer-id="${layer.id}">
                </div>
                
                <div class="control-group">
                    <label>Zoom: <span class="value">${layer.zoom.toFixed(2)}</span></label>
                    <input type="range" class="zoom" min="0.1" max="2" step="0.1" 
                        value="${layer.zoom}" data-layer-id="${layer.id}">
                </div>
                
                <div class="control-group">
                    <label>Shadow Strength: <span class="value">${layer.shadowStrength}</span></label>
                    <input type="range" class="shadow-strength" min="0" max="100" step="1" 
                        value="${layer.shadowStrength}" data-layer-id="${layer.id}">
                </div>
                
                <button class="delete-layer-btn" data-layer-id="${layer.id}">Delete Layer</button>
            </div>
        `;
        
        this.attachLayerPanelEvents(layer, panel);
        return panel;
    }
    
    attachLayerPanelEvents(layer, panel) {
        // Input type radio buttons
        panel.querySelectorAll('.input-type-radio').forEach(radio => {
            radio.addEventListener('change', (e) => {
                layer.inputType = e.target.value;
                
                // Show/hide appropriate controls
                const colorGroup = panel.querySelector('.color-control-group');
                const gradientGroup = panel.querySelector('.gradient-control-group');
                const imageGroup = panel.querySelector('.image-control-group');
                
                colorGroup.style.display = 'none';
                gradientGroup.style.display = 'none';
                imageGroup.style.display = 'none';
                
                if (e.target.value === 'color') {
                    colorGroup.style.display = 'block';
                } else if (e.target.value === 'gradient') {
                    gradientGroup.style.display = 'block';
                } else if (e.target.value === 'image') {
                    imageGroup.style.display = 'block';
                }
                
                this.onRender();
            });
        });
        
        // Color input - fires during drag and on release
        const updateColor = (e) => {
            e.stopPropagation();
            layer.color = e.target.value;
            const zItem = document.getElementById(`z-order-item-${layer.id}`);
            if (zItem) this.updateLayerThumbnail(layer, zItem);
            this.onRender();
        };
        panel.querySelector('.color-input')?.addEventListener('input', updateColor);
        panel.querySelector('.color-input')?.addEventListener('change', updateColor);
        
        // Gradient start color - fires during drag and on release
        const updateGradientStart = (e) => {
            e.stopPropagation();
            layer.color = e.target.value;
            const zItem = document.getElementById(`z-order-item-${layer.id}`);
            if (zItem) this.updateLayerThumbnail(layer, zItem);
            this.onRender();
        };
        panel.querySelector('.gradient-start-input')?.addEventListener('input', updateGradientStart);
        panel.querySelector('.gradient-start-input')?.addEventListener('change', updateGradientStart);
        
        // Gradient end color - fires during drag and on release
        const updateGradientEnd = (e) => {
            e.stopPropagation();
            layer.gradientColor = e.target.value;
            const zItem = document.getElementById(`z-order-item-${layer.id}`);
            if (zItem) this.updateLayerThumbnail(layer, zItem);
            this.onRender();
        };
        panel.querySelector('.gradient-end-input')?.addEventListener('input', updateGradientEnd);
        panel.querySelector('.gradient-end-input')?.addEventListener('change', updateGradientEnd);
        
        // Image input
        panel.querySelector('.image-input')?.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.renderer.loadImage(layer, e.target.files[0])
                    .then(() => {
                        this.updateImagePreview(layer, panel);
                        const zItem = document.getElementById(`z-order-item-${layer.id}`);
                        if (zItem) this.updateLayerThumbnail(layer, zItem);
                        this.onRender();
                    })
                    .catch(err => console.error('Failed to load image:', err));
            }
        });
        
        // Radial offset
        panel.querySelector('.radial-offset')?.addEventListener('input', (e) => {
            layer.radialOffset = parseInt(e.target.value);
            panel.querySelector('.radial-offset').parentElement.querySelector('.value').textContent = layer.radialOffset;
            this.onRender();
        });
        
        // Petal height
        panel.querySelector('.petal-height')?.addEventListener('input', (e) => {
            layer.petalHeight = parseFloat(e.target.value);
            panel.querySelector('.petal-height').parentElement.querySelector('.value').textContent = layer.petalHeight.toFixed(2);
            this.onRender();
        });
        
        // Concaveness
        panel.querySelector('.concaveness')?.addEventListener('input', (e) => {
            layer.concaveness = parseFloat(e.target.value);
            panel.querySelector('.concaveness').parentElement.querySelector('.value').textContent = layer.concaveness.toFixed(2);
            this.onRender();
        });
        
        // Quantity
        panel.querySelector('.quantity')?.addEventListener('input', (e) => {
            layer.quantity = parseInt(e.target.value);
            panel.querySelector('.quantity').parentElement.querySelector('.value').textContent = layer.quantity;
            this.onRender();
        });
        
        // Zoom
        panel.querySelector('.zoom')?.addEventListener('input', (e) => {
            layer.zoom = parseFloat(e.target.value);
            panel.querySelector('.zoom').parentElement.querySelector('.value').textContent = layer.zoom.toFixed(2);
            this.onRender();
        });
        
        // Shadow strength
        panel.querySelector('.shadow-strength')?.addEventListener('input', (e) => {
            layer.shadowStrength = parseInt(e.target.value);
            panel.querySelector('.shadow-strength').parentElement.querySelector('.value').textContent = layer.shadowStrength;
            this.onRender();
        });
        
        // Delete button
        panel.querySelector('.delete-layer-btn')?.addEventListener('click', (e) => {
            this.deleteLayer(layer.id);
        });
        
        // Collapse button
        panel.querySelector('.collapse-btn')?.addEventListener('click', (e) => {
            const content = panel.querySelector('.layer-panel-content');
            const btn = e.target;
            content.classList.toggle('collapsed');
            btn.textContent = content.classList.contains('collapsed') ? '▶' : '▼';
        });
    }
    
    updateImagePreview(layer, panel) {
        if (layer.image) {
            const preview = panel.querySelector('.image-preview');
            const canvas = document.createElement('canvas');
            canvas.width = 60;
            canvas.height = 60;
            const ctx = canvas.getContext('2d');
            
            const scale = Math.min(canvas.width / layer.image.width, canvas.height / layer.image.height);
            const x = (canvas.width - layer.image.width * scale) / 2;
            const y = (canvas.height - layer.image.height * scale) / 2;
            
            ctx.drawImage(layer.image, x, y, layer.image.width * scale, layer.image.height * scale);
            preview.style.backgroundImage = `url(${canvas.toDataURL()})`;
        }
    }
    
    createZOrderItem(layer) {
        const item = document.createElement('div');
        item.className = 'z-order-item';
        item.id = `z-order-item-${layer.id}`;
        
        item.innerHTML = `
            <div class="z-order-preview" id="z-preview-${layer.id}"></div>
            <div class="z-order-info">
                <span class="z-order-name">Layer ${layer.id + 1}</span>
            </div>
            <button class="z-order-up-btn" data-layer-id="${layer.id}" title="Move up (higher z-order)">▲</button>
            <button class="z-order-down-btn" data-layer-id="${layer.id}" title="Move down (lower z-order)">▼</button>
            <button class="z-order-visibility" data-layer-id="${layer.id}" title="Toggle visibility">
                ${layer.visible ? '👁' : '✕'}
            </button>
        `;
        
        this.attachZOrderEvents(layer, item);
        this.updateLayerThumbnail(layer, item);
        return item;
    }
    
    updateLayerThumbnail(layer, item) {
        const preview = item.querySelector('.z-order-preview');
        if (!preview) return;
        
        if (layer.inputType === 'color') {
            // Show color fill
            preview.style.background = layer.color;
            preview.style.backgroundImage = 'none';
        } else if (layer.inputType === 'gradient') {
            // Show gradient thumbnail
            const canvas = document.createElement('canvas');
            canvas.width = 50;
            canvas.height = 50;
            const ctx = canvas.getContext('2d');
            const gradient = ctx.createRadialGradient(25, 25, 0, 25, 25, 35);
            gradient.addColorStop(0, layer.color);
            gradient.addColorStop(1, layer.gradientColor);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 50, 50);
            preview.style.backgroundImage = `url(${canvas.toDataURL()})`;
            preview.style.backgroundSize = 'cover';
            preview.style.background = `url(${canvas.toDataURL()}) center / cover`;
        } else if (layer.inputType === 'image' && layer.image) {
            // Show image thumbnail
            const canvas = document.createElement('canvas');
            canvas.width = 50;
            canvas.height = 50;
            const ctx = canvas.getContext('2d');
            
            // Fill with semi-transparent version of the image
            const scale = Math.min(canvas.width / layer.image.width, canvas.height / layer.image.height);
            const x = (canvas.width - layer.image.width * scale) / 2;
            const y = (canvas.height - layer.image.height * scale) / 2;
            
            ctx.drawImage(layer.image, x, y, layer.image.width * scale, layer.image.height * scale);
            preview.style.backgroundImage = `url(${canvas.toDataURL()})`;
            preview.style.backgroundSize = 'cover';
            preview.style.backgroundPosition = 'center';
            preview.style.background = `url(${canvas.toDataURL()}) center / cover`;
        }
    }
    
    attachZOrderEvents(layer, item) {
        // Select on click
        item.addEventListener('click', (e) => {
            // Ignore clicks on buttons
            if (e.target.classList.contains('z-order-visibility') || 
                e.target.classList.contains('z-order-up-btn') ||
                e.target.classList.contains('z-order-down-btn')) return;
            this.setSelectedLayer(layer.id);
        });
        
        // Visibility toggle
        item.querySelector('.z-order-visibility')?.addEventListener('click', (e) => {
            layer.visible = !layer.visible;
            e.target.textContent = layer.visible ? '👁' : '✕';
            this.onRender();
        });
        
        // Move up button
        item.querySelector('.z-order-up-btn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.moveLayerUp(layer.id);
        });
        
        // Move down button
        item.querySelector('.z-order-down-btn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.moveLayerDown(layer.id);
        });
    }
    
    moveLayerUp(layerId) {
        const layer = this.renderer.layers.find(l => l.id === layerId);
        if (!layer) return;
        
        const currentIndex = this.renderer.layers.indexOf(layer);
        if (currentIndex < this.renderer.layers.length - 1) {
            // Swap with next layer
            [this.renderer.layers[currentIndex], this.renderer.layers[currentIndex + 1]] = 
            [this.renderer.layers[currentIndex + 1], this.renderer.layers[currentIndex]];
            
            // Update z-indices
            this.renderer.layers.forEach((l, index) => {
                l.zIndex = index;
            });
            
            this.renderZOrder();
            this.onRender();
        }
    }
    
    moveLayerDown(layerId) {
        const layer = this.renderer.layers.find(l => l.id === layerId);
        if (!layer) return;
        
        const currentIndex = this.renderer.layers.indexOf(layer);
        if (currentIndex > 0) {
            // Swap with previous layer
            [this.renderer.layers[currentIndex], this.renderer.layers[currentIndex - 1]] = 
            [this.renderer.layers[currentIndex - 1], this.renderer.layers[currentIndex]];
            
            // Update z-indices
            this.renderer.layers.forEach((l, index) => {
                l.zIndex = index;
            });
            
            this.renderZOrder();
            this.onRender();
        }
    }
    
    highlightSelectedInZOrder() {
        const zOrderList = document.getElementById('zOrderList');
        Array.from(zOrderList.children).forEach(child => child.classList.remove('selected'));
        if (this.selectedLayerId !== null) {
            const el = document.getElementById(`z-order-item-${this.selectedLayerId}`);
            if (el) el.classList.add('selected');
        }
    }
    
    deleteLayer(layerId) {
        if (this.renderer.layers.length <= 1) {
            alert('You must have at least one layer');
            return;
        }
        
        this.renderer.removeLayer(layerId);
        
        // Update selection
        const remaining = this.renderer.layers;
        this.selectedLayerId = remaining.length ? remaining[remaining.length - 1].id : null;
        
        // Re-render UI
        this.renderZOrder();
        this.renderSelectedLayerPanel();
        this.onRender();
    }
    
    renderSelectedLayerPanel() {
        const container = document.getElementById('layerControlsContainer');
        container.innerHTML = '';
        const layer = this.renderer.layers.find(l => l.id === this.selectedLayerId);
        if (!layer) return;
        const panel = this.createLayerPanel(layer);
        container.appendChild(panel);
    }
    
    renderZOrder() {
        const zOrderList = document.getElementById('zOrderList');
        zOrderList.innerHTML = '';
        
        // Reverse order so highest z-index (topmost) appears at top of list
        const reversedLayers = [...this.renderer.layers].reverse();
        reversedLayers.forEach(layer => {
            const item = this.createZOrderItem(layer);
            zOrderList.appendChild(item);
        });
        
        this.highlightSelectedInZOrder();
    }
}
