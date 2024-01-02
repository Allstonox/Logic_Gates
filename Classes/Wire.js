class Wire {

    static color = '#49535C';

    constructor({ position, connections, powered = false, powerSource = false }) {
        this.powerSource = powerSource;
        this.position = position;
        this.powered = powered;
        this.connections = connections;
        this.allConnections = [];
        this.checkPowerState();
    }

    update() {
        this.checkPowerState();
        this.show();
    }

    show() {
        if (this.powered) c.strokeStyle = '#EF382A';
        else { c.strokeStyle = '#49535C'; }
        c.lineWidth = 8;
        c.beginPath();
        c.moveTo(this.position.startingX, this.position.startingY);
        c.lineTo(this.position.endingX, this.position.endingY);
        c.stroke();

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