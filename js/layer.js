class Layer {
    constructor(id = 0, zIndex = 0) {
        this.id = id;
        this.zIndex = zIndex;
        this.visible = true;
        
        // Input type: 'color', 'image', or 'gradient'
        this.inputType = 'color';
        
        // Color properties
        this.color = '#FFFFFF';
        this.gradientColor = '#000000'; // End color for gradient
        
        // Image properties
        this.image = null;
        this.imageUrl = null;
        
        // Mandala parameters
        this.radialOffset = 0; // Distance from center
        this.petalHeight = 1.0; // Height/length of petal (0.1 to 2.0)
        this.concaveness = 0; // -2.0 to 2.0, warps outer edge inward/outward
        this.quantity = 8; // Number of repeats
        this.zoom = 1.0; // 0.1 to 2.0
        this.shadowStrength = 0; // 0 to 100
    }
    
    update(properties) {
        Object.assign(this, properties);
        return this;
    }
    
    clone() {
        const cloned = new Layer(this.id, this.zIndex);
        cloned.visible = this.visible;
        cloned.inputType = this.inputType;
        cloned.color = this.color;
        cloned.gradientColor = this.gradientColor;
        cloned.image = this.image;
        cloned.imageUrl = this.imageUrl;
        cloned.radialOffset = this.radialOffset;
        cloned.petalHeight = this.petalHeight;
        cloned.concaveness = this.concaveness;
        cloned.quantity = this.quantity;
        cloned.zoom = this.zoom;
        cloned.shadowStrength = this.shadowStrength;
        return cloned;
    }
    
    toJSON() {
        return {
            id: this.id,
            zIndex: this.zIndex,
            visible: this.visible,
            inputType: this.inputType,
            color: this.color,
            gradientColor: this.gradientColor,
            imageUrl: this.imageUrl,
            radialOffset: this.radialOffset,
            petalHeight: this.petalHeight,
            concaveness: this.concaveness,
            quantity: this.quantity,
            zoom: this.zoom,
            shadowStrength: this.shadowStrength
        };
    }
}
