class GateOutput extends Node {
    static radius = 15;

    constructor({ position, radius, powered, powerSource = true }) {
        super({ position, radius, powered, powerSource })
    }

    update() {
        this.show();
    }
    
    show() {
        if(this.powered) c.fillStyle = '#EF382A';
        else {c.fillStyle = 'white';} 
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        c.fill();
    }
}