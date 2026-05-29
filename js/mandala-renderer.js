class MandalaRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.layers = [];
        
        // Set canvas size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        // Canvas takes up remaining space (56% of viewport width)
        this.canvas.width = window.innerWidth * 0.56;
        this.canvas.height = window.innerHeight;
    }
    
    addLayer(layer) {
        this.layers.push(layer);
        this.layers.sort((a, b) => a.zIndex - b.zIndex);
    }
    
    removeLayer(layerId) {
        this.layers = this.layers.filter(l => l.id !== layerId);
    }
    
    updateLayerOrder(newOrder) {
        // newOrder is an array of layer IDs in desired z-order
        const layerMap = {};
        this.layers.forEach(layer => {
            layerMap[layer.id] = layer;
        });
        
        this.layers = newOrder.map(id => layerMap[id]).filter(Boolean);
        this.layers.forEach((layer, index) => {
            layer.zIndex = index;
        });
    }
    
    render() {
        // Clear canvas with transparent background
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Render each layer in z-order (bottom to top)
        this.layers.forEach((layer, layerIndex) => {
            if (!layer.visible) return;
            this.renderLayer(layer, centerX, centerY, layerIndex);
        });
    }
    
    renderLayer(layer, centerX, centerY, layerIndex) {
        const angleStep = (Math.PI * 2) / layer.quantity;
        const radius = Math.min(this.canvas.width, this.canvas.height) / 3;
        
        // Draw the whole layer to an offscreen canvas first (no shadow per leaf)
        const off = document.createElement('canvas');
        off.width = this.canvas.width;
        off.height = this.canvas.height;
        const octx = off.getContext('2d');
        
        for (let i = 0; i < layer.quantity; i++) {
            octx.save();
            const angle = angleStep * i;
            // Calculate radial offset
            const offsetX = Math.cos(angle) * layer.radialOffset;
            const offsetY = Math.sin(angle) * layer.radialOffset;
            
            octx.translate(centerX + offsetX, centerY + offsetY);
            octx.rotate(angle);
            // Draw the leaf shape into offscreen
            this.drawLeaf(octx, layer, radius);
            octx.restore();
        }
        
        // Apply shadow if strength > 0
        if (layer.shadowStrength > 0) {
            this.ctx.save();
            this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            this.ctx.shadowBlur = layer.shadowStrength;
            this.ctx.shadowOffsetX = 2;
            this.ctx.shadowOffsetY = 2;
            this.ctx.drawImage(off, 0, 0);
            this.ctx.restore();
        }
        
        // Normal pass (draw without shadow)
        this.ctx.drawImage(off, 0, 0);
    }
    
    drawLeaf(ctx, layer, radius) {
        const width = radius * 0.4;
        const height = radius * layer.petalHeight;
        
        // Create leaf path with concaveness
        ctx.beginPath();
        ctx.moveTo(0, 0);
        
        // Left edge - use concaveness to control curvature
        // Negative concaveness = curves inward (concave)
        // Positive concaveness = curves outward (convex)
        const leftCurve = width * (0.5 + layer.concaveness * 0.5);
        
        ctx.bezierCurveTo(
            -leftCurve, height * 0.25,
            -leftCurve, height * 0.75,
            0, height
        );
        
        // Right edge (mirror of left)
        const rightCurve = width * (0.5 + layer.concaveness * 0.5);
        
        ctx.bezierCurveTo(
            rightCurve, height * 0.75,
            rightCurve, height * 0.25,
            0, 0
        );
        
        ctx.closePath();
        
        // Fill with color, gradient, or image
        if (layer.inputType === 'color') {
            ctx.fillStyle = layer.color;
            ctx.fill();
        } else if (layer.inputType === 'gradient') {
            // Create radial gradient from center (0,0) outward
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, height * 0.8);
            gradient.addColorStop(0, layer.color);
            gradient.addColorStop(1, layer.gradientColor);
            ctx.fillStyle = gradient;
            ctx.fill();
        } else if (layer.inputType === 'image' && layer.image) {
            ctx.save();
            ctx.clip();
            const imgWidth = layer.image.width * layer.zoom;
            const imgHeight = layer.image.height * layer.zoom;
            const xOffset = -imgWidth / 2;
            const yOffset = 0;
            ctx.drawImage(layer.image, xOffset, yOffset, imgWidth, imgHeight);
            ctx.restore();
        }
    }
    
    loadImage(layer, file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    layer.image = img;
                    layer.imageUrl = e.target.result;
                    resolve(img);
                };
                img.onerror = () => reject(new Error('Failed to load image'));
                img.src = e.target.result;
            };
            
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    }
    
    exportPNG(scale = 16) {
        // Render to a high-DPI offscreen canvas for crisp export
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = this.canvas.width * scale;
        exportCanvas.height = this.canvas.height * scale;
        const exportCtx = exportCanvas.getContext('2d', { antialias: true });

        // Enable high-quality rendering
        exportCtx.imageSmoothingEnabled = true;
        exportCtx.imageSmoothingQuality = 'high';

        const centerX = (this.canvas.width / 2) * scale;
        const centerY = (this.canvas.height / 2) * scale;

        // Draw each layer into the export context
        this.layers.forEach((layer, layerIndex) => {
            if (!layer.visible) return;
            this.renderLayerToContextHQ(exportCtx, layer, centerX, centerY, layerIndex, this.canvas.width * scale, this.canvas.height * scale, scale);
        });

        const link = document.createElement('a');
        const timestamp = new Date().getTime();
        link.download = `mandala-${timestamp}.png`;
        link.href = exportCanvas.toDataURL('image/png', 0.95);
        link.click();
    }

    renderLayerToContextHQ(ctx, layer, centerX, centerY, layerIndex, canvasWidth, canvasHeight, scale) {
        const angleStep = (Math.PI * 2) / layer.quantity;
        const radius = Math.min(canvasWidth, canvasHeight) / 3;

        // Set shadow properties if needed
        if (layer.shadowStrength > 0) {
            ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
            ctx.shadowBlur = layer.shadowStrength * scale * 0.3;
            ctx.shadowOffsetX = 2 * scale;
            ctx.shadowOffsetY = 2 * scale;
        } else {
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
        }

        // Draw layer petals once with shadow properties applied
        for (let i = 0; i < layer.quantity; i++) {
            ctx.save();
            const angle = angleStep * i;
            const offsetX = Math.cos(angle) * layer.radialOffset * scale;
            const offsetY = Math.sin(angle) * layer.radialOffset * scale;

            ctx.translate(centerX + offsetX, centerY + offsetY);
            ctx.rotate(angle);
            this.drawLeafHQ(ctx, layer, radius);
            ctx.restore();
        }
        
        // Clear shadow for next layer
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
    }

    drawLeafHQ(ctx, layer, radius) {
        const width = radius * 0.4;
        const height = radius * layer.petalHeight;
        const leftCurve = width * (0.5 + layer.concaveness * 0.5);
        const rightCurve = width * (0.5 + layer.concaveness * 0.5);
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        
        // High-resolution left edge with multiple segments
        ctx.bezierCurveTo(-leftCurve * 0.7, height * 0.15, -leftCurve, height * 0.35, -leftCurve, height * 0.5);
        ctx.bezierCurveTo(-leftCurve, height * 0.65, -leftCurve * 0.7, height * 0.85, 0, height);
        
        // High-resolution right edge with multiple segments
        ctx.bezierCurveTo(rightCurve * 0.7, height * 0.85, rightCurve, height * 0.65, rightCurve, height * 0.5);
        ctx.bezierCurveTo(rightCurve, height * 0.35, rightCurve * 0.7, height * 0.15, 0, 0);
        
        ctx.closePath();
        
        // Fill with color, gradient, or image
        if (layer.inputType === 'color') {
            ctx.fillStyle = layer.color;
            ctx.fill();
        } else if (layer.inputType === 'gradient') {
            // Create radial gradient from center (0,0) outward
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, height * 0.8);
            gradient.addColorStop(0, layer.color);
            gradient.addColorStop(1, layer.gradientColor);
            ctx.fillStyle = gradient;
            ctx.fill();
        } else if (layer.inputType === 'image' && layer.image) {
            ctx.save();
            ctx.clip();
            const imgWidth = layer.image.width * layer.zoom;
            const imgHeight = layer.image.height * layer.zoom;
            const xOffset = -imgWidth / 2;
            const yOffset = 0;
            ctx.drawImage(layer.image, xOffset, yOffset, imgWidth, imgHeight);
            ctx.restore();
        }
    }
    
    exportSVG() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const width = this.canvas.width;
        const height = this.canvas.height;
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        
        // Create defs for gradients
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        svg.appendChild(defs);
        
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Render each layer to SVG
        this.layers.forEach((layer, layerIndex) => {
            if (!layer.visible) return;
            this.renderLayerToSVGHQ(svg, defs, layer, centerX, centerY, layerIndex, width, height);
        });
        
        // Export SVG with proper formatting
        let svgString = new XMLSerializer().serializeToString(svg);
        svgString = '<?xml version="1.0" encoding="UTF-8"?>\n' + svgString;
        
        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const timestamp = new Date().getTime();
        link.download = `mandala-${timestamp}.svg`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    }

    renderLayerToSVGHQ(svg, defs, layer, centerX, centerY, layerIndex, width, height) {
        const angleStep = (Math.PI * 2) / layer.quantity;
        const radius = Math.min(width, height) / 3;
        
        // Create shadow group - single group for entire layer shadow
        let shadowGroup = null;
        if (layer.shadowStrength > 0) {
            shadowGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            shadowGroup.setAttribute('id', `shadow-layer-${layer.id}`);
            shadowGroup.setAttribute('opacity', '0.4');
            shadowGroup.setAttribute('transform', `translate(2, 2)`);
        }
        
        // Create main layer group (renders on top)
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('id', `layer-${layer.id}`);
        
        // Draw each petal
        for (let i = 0; i < layer.quantity; i++) {
            const angle = angleStep * i;
            const offsetX = Math.cos(angle) * layer.radialOffset;
            const offsetY = Math.sin(angle) * layer.radialOffset;
            
            const petalTransform = `translate(${centerX + offsetX}, ${centerY + offsetY}) rotate(${angle * 180 / Math.PI})`;
            
            // Create shadow petal if needed
            if (shadowGroup) {
                const shadowPetal = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                shadowPetal.setAttribute('transform', petalTransform);
                
                const shadowPath = this.createPetalPathSVG(layer, radius);
                shadowPath.setAttribute('fill', '#000000');
                shadowPath.setAttribute('stroke', 'none');
                shadowPetal.appendChild(shadowPath);
                shadowGroup.appendChild(shadowPetal);
            }
            
            // Create normal petal
            const petal = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            petal.setAttribute('transform', petalTransform);
            
            const path = this.createPetalPathSVG(layer, radius);
            
            // Set fill
            if (layer.inputType === 'color') {
                path.setAttribute('fill', layer.color);
            } else if (layer.inputType === 'gradient') {
                const gradId = `grad-${layer.id}-${i}`;
                const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
                gradient.setAttribute('id', gradId);
                gradient.setAttribute('cx', '0');
                gradient.setAttribute('cy', '0');
                
                const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
                stop1.setAttribute('offset', '0%');
                stop1.setAttribute('stop-color', layer.color);
                gradient.appendChild(stop1);
                
                const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
                stop2.setAttribute('offset', '100%');
                stop2.setAttribute('stop-color', layer.gradientColor);
                gradient.appendChild(stop2);
                
                defs.appendChild(gradient);
                path.setAttribute('fill', `url(#${gradId})`);
            }
            
            path.setAttribute('stroke', 'none');
            petal.appendChild(path);
            group.appendChild(petal);
        }
        
        // Add shadow first (renders behind entire layer)
        if (shadowGroup) {
            svg.appendChild(shadowGroup);
        }
        // Add layer on top
        svg.appendChild(group);
    }

    createPetalPathSVG(layer, radius) {
        const width = radius * 0.4;
        const height = radius * layer.petalHeight;
        const leftCurve = width * (0.5 + layer.concaveness * 0.5);
        const rightCurve = width * (0.5 + layer.concaveness * 0.5);
        
        // Create smooth, high-resolution path
        const pathData = [
            `M 0 0`,
            `C ${-leftCurve * 0.7} ${height * 0.15}, ${-leftCurve} ${height * 0.35}, ${-leftCurve} ${height * 0.5}`,
            `C ${-leftCurve} ${height * 0.65}, ${-leftCurve * 0.7} ${height * 0.85}, 0 ${height}`,
            `C ${rightCurve * 0.7} ${height * 0.85}, ${rightCurve} ${height * 0.65}, ${rightCurve} ${height * 0.5}`,
            `C ${rightCurve} ${height * 0.35}, ${rightCurve * 0.7} ${height * 0.15}, 0 0`,
            `Z`
        ].join(' ');
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathData);
        return path;
    }
    
    renderLayerToSVG(svg, layer, centerX, centerY, layerIndex, width, height) {
        const angleStep = (Math.PI * 2) / layer.quantity;
        const radius = Math.min(width, height) / 3;
        
        // Ensure defs exist
        let defs = svg.querySelector('defs');
        if (!defs) {
            defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            svg.insertBefore(defs, svg.firstChild);
        }
        
        // Create shadow filter if needed
        if (layer.shadowStrength > 0) {
            const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
            filter.setAttribute('id', `shadow-${layer.id}`);
            filter.setAttribute('x', '-100%');
            filter.setAttribute('y', '-100%');
            filter.setAttribute('width', '300%');
            filter.setAttribute('height', '300%');
            
            const feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
            feGaussianBlur.setAttribute('in', 'SourceGraphic');
            feGaussianBlur.setAttribute('stdDeviation', layer.shadowStrength / 4);
            
            const feOffset = document.createElementNS('http://www.w3.org/2000/svg', 'feOffset');
            feOffset.setAttribute('dx', '2');
            feOffset.setAttribute('dy', '2');
            feOffset.setAttribute('in', 'SourceGraphic');
            
            const feFlood = document.createElementNS('http://www.w3.org/2000/svg', 'feFlood');
            feFlood.setAttribute('flood-color', '#000000');
            feFlood.setAttribute('flood-opacity', '0.5');
            
            const feComposite = document.createElementNS('http://www.w3.org/2000/svg', 'feComposite');
            feComposite.setAttribute('in', 'feFlood');
            feComposite.setAttribute('in2', 'feOffset');
            feComposite.setAttribute('operator', 'in');
            
            const feMerge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
            const feMergeNode1 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
            const feMergeNode2 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
            feMergeNode2.setAttribute('in', 'SourceGraphic');
            feMerge.appendChild(feMergeNode1);
            feMerge.appendChild(feMergeNode2);
            
            filter.appendChild(feGaussianBlur);
            filter.appendChild(feOffset);
            filter.appendChild(feFlood);
            filter.appendChild(feComposite);
            filter.appendChild(feMerge);
            defs.appendChild(filter);
        }
        
        // Create group for this layer
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('id', `layer-${layer.id}`);
        if (layer.shadowStrength > 0) {
            group.setAttribute('filter', `url(#shadow-${layer.id})`);
        }
        
        // Draw each petal
        for (let i = 0; i < layer.quantity; i++) {
            const angle = angleStep * i;
            const offsetX = Math.cos(angle) * layer.radialOffset;
            const offsetY = Math.sin(angle) * layer.radialOffset;
            
            const petal = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            petal.setAttribute('transform', `translate(${centerX + offsetX}, ${centerY + offsetY}) rotate(${angle * 180 / Math.PI})`);
            
            // Create petal path
            const path = this.createPetalPath(layer, radius);
            
            // Set fill
            if (layer.inputType === 'color') {
                path.setAttribute('fill', layer.color);
            } else if (layer.inputType === 'gradient') {
                const gradId = `grad-${layer.id}-${i}`;
                const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
                gradient.setAttribute('id', gradId);
                gradient.setAttribute('cx', '0');
                gradient.setAttribute('cy', '0');
                
                const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
                stop1.setAttribute('offset', '0%');
                stop1.setAttribute('stop-color', layer.color);
                gradient.appendChild(stop1);
                
                const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
                stop2.setAttribute('offset', '100%');
                stop2.setAttribute('stop-color', layer.gradientColor);
                gradient.appendChild(stop2);
                
                defs.appendChild(gradient);
                path.setAttribute('fill', `url(#${gradId})`);
            }
            
            path.setAttribute('stroke', 'none');
            petal.appendChild(path);
            group.appendChild(petal);
        }
        
        // Append layer group to SVG
        svg.appendChild(group);
    }
    
    createPetalPath(layer, radius) {
        const width = radius * 0.4;
        const height = radius * layer.petalHeight;
        const leftCurve = width * (0.5 + layer.concaveness * 0.5);
        const rightCurve = width * (0.5 + layer.concaveness * 0.5);
        
        // Create high-resolution bezier curve with more segments for smooth petals
        const pathSegments = [
            `M 0 0`
        ];
        
        // Left edge with multiple control points for smoother curve
        pathSegments.push(
            `C ${-leftCurve * 0.7} ${height * 0.15}, ${-leftCurve} ${height * 0.35}, ${-leftCurve} ${height * 0.5}`,
            `C ${-leftCurve} ${height * 0.65}, ${-leftCurve * 0.7} ${height * 0.85}, 0 ${height}`
        );
        
        // Right edge with multiple control points for smoother curve
        pathSegments.push(
            `C ${rightCurve * 0.7} ${height * 0.85}, ${rightCurve} ${height * 0.65}, ${rightCurve} ${height * 0.5}`,
            `C ${rightCurve} ${height * 0.35}, ${rightCurve * 0.7} ${height * 0.15}, 0 0`
        );
        
        pathSegments.push('Z');
        const pathData = pathSegments.join(' ');
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathData);
        return path;
    }

    debugExportAndAnalyze() {
        return {
            png: this.analyzeExport('PNG'),
            svg: this.analyzeExport('SVG'),
            timestamp: new Date().toISOString()
        };
    }

    analyzeExport(type) {
        const results = {};
        if (type === 'PNG') {
            const exportCanvas = document.createElement('canvas');
            const scale = 8;
            exportCanvas.width = this.canvas.width * scale;
            exportCanvas.height = this.canvas.height * scale;
            const exportCtx = exportCanvas.getContext('2d', { antialias: true });
            exportCtx.imageSmoothingEnabled = true;
            exportCtx.imageSmoothingQuality = 'high';
            const centerX = (this.canvas.width / 2) * scale;
            const centerY = (this.canvas.height / 2) * scale;
            this.layers.forEach((layer, layerIndex) => {
                if (!layer.visible) return;
                this.renderLayerToContextHQ(exportCtx, layer, centerX, centerY, layerIndex, this.canvas.width * scale, this.canvas.height * scale, scale);
            });
            results.resolution = `${exportCanvas.width}x${exportCanvas.height}px`;
            results.scale = `${scale}x`;
            results.layerCount = this.layers.filter(l => l.visible).length;
        } else if (type === 'SVG') {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            const width = this.canvas.width;
            const height = this.canvas.height;
            svg.setAttribute('width', width);
            svg.setAttribute('height', height);
            svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
            svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            svg.appendChild(defs);
            const centerX = width / 2;
            const centerY = height / 2;
            this.layers.forEach((layer, layerIndex) => {
                if (!layer.visible) return;
                this.renderLayerToSVGHQ(svg, defs, layer, centerX, centerY, layerIndex, width, height);
            });
            const svgString = new XMLSerializer().serializeToString(svg);
            results.sizeKB = (svgString.length / 1024).toFixed(2);
            results.viewBox = `0 0 ${width} ${height}`;
            results.layerGroups = svg.querySelectorAll('[id^="layer-"]').length;
            results.shadowGroups = svg.querySelectorAll('[id^="shadow-layer-"]').length;
            results.gradients = svg.querySelectorAll('radialGradient').length;
        }
        results.type = type;
        return results;
    }
}
