class Node {
    static radius = 15;

    constructor({ position, radius, powered, powerSource = false, color = 'white' }) {
        this.powerSource = powerSource;
        this.position = position;
        this.radius = radius;
        this.powered = powered;
        this.color = color;
        this.allConnections = [];
        this.connections = [];
    }

    update() {
        if(!this.powerSource) this.checkPowerState();
        this.show();
    }
    
    show() {
        if(this.powered) c.fillStyle = '#EF382A';
        else {c.fillStyle = this.color;} 
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        c.fill();
    }

    checkPowerState() {
        for(let i = 0; i < this.connections.length; i++) {
            if(this.checkForPowerSource()) {
                this.powered = true;
                return;
            } 
        }
        this.powered = false;
    }

    checkForPowerSource() {
        this.allConnections = [];
        this.returnAllConnections(this);
        for(let i = 0; i < this.allConnections.length; i++) {
            if(this.allConnections[i].powerSource && this.allConnections[i].powered) return true;
        }
        return false;
    }

    returnAllConnections(askingNode) {
        for(let i = 0; i < this.connections.length; i++) {
            if(!(askingNode.allConnections.includes(this.connections[i]))) {
                askingNode.allConnections.push(this.connections[i]);
                this.connections[i].returnAllConnections(askingNode);
            } 
        }
    }
}