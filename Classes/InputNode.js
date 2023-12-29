class InputNode extends Node {
    static radius = 30;

    constructor({ position, radius, powered, powerSource = true }) {
        super({ position, radius, powered, powerSource })
        this.node = new Node({
            position: {
                x: this.position.x + (this.radius * 2),
                y: this.position.y
            },
            radius: Node.radius,
            powered: false
        });
        nodes.push(this.node);
        this.wire = new Wire({
            position: {
                startingX: this.position.x,
                startingY: this.position.y,
                endingX: this.node.position.x,
                endingY: this.node.position.y,
            },
            connections: [this, this.node]
        });
        this.connections.push(this.wire);
        this.node.connections.push(this.wire);
    }

    update() {
        this.wire.update();
        this.node.update();
        this.show();
    }

    show() {
        //Draw Input Node
        if (this.powered) c.fillStyle = '#EF382A';
        else { c.fillStyle = '#49535C'; }
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        c.fill();
    }

    togglePower() {
        if (this.powered) this.powered = false;
        else if (!this.powered) this.powered = true;
    }
}