class Gate {
    constructor({ name, position, inputNumber, outputNumber, truthTable, color = '#3193F5' }) {
        this.name = name;
        this.position = position;
        this.inputNumber = inputNumber;
        this.outputNumber = outputNumber;
        this.truthTable = truthTable;
        this.color = color;
        this.width = 200;
        if(this.inputNumber >= this.outputNumber) this.height = 2 * ((Node.radius * 2) * this.inputNumber);
        else this.height = 2 * ((Node.radius * 2) * this.outputNumber);
        this.position.x -= (this.width / 2);
        this.position.y -= (this.height / 2);
        this.inputNodes = [];
        this.outputNodes = [];
        for (let i = 0; i < this.inputNumber; i++) {
            this.inputNodes[i] = new Node({
                position: {
                    x: this.position.x,
                    y: this.position.y + (i * (this.height / this.inputNumber)) + (Node.radius) + (0.5 * (this.height / this.inputNumber) - Node.radius)
                },
                radius: Node.radius,
                powered: false
            })
            nodes.push(this.inputNodes[i]);
        }
        for (let i = 0; i < this.outputNumber; i++) {
            this.outputNodes[i] = new GateOutput({
                position: {
                    x: this.position.x + this.width,
                    y: this.position.y + (i * (this.height / this.outputNumber)) + (Node.radius) + (0.5 * (this.height / this.outputNumber) - Node.radius)
                },
                radius: Node.radius,
                powered: false
            })
            nodes.push(this.outputNodes[i]);
        }
    }

    update() {
        this.show();
        for(let i = 0; i < this.inputNodes.length; i++) {
            this.inputNodes[i].update();
        }
        for(let i = 0; i < this.outputNodes.length; i++) {        
            this.outputNodes[i].powered = this.computeOutput(this.truthTable, 0, i);
        }
        for(let i = 0; i < this.outputNodes.length; i++) {
            this.outputNodes[i].update();        
        }
    }

    show() {
        c.strokeStyle = 'white';
        c.fillStyle = this.color;
        c.beginPath();
        c.roundRect(this.position.x, this.position.y, this.width, this.height, 20);
        c.stroke();
        c.fill();

        c.font = "30px Arial";
        c.fillStyle = 'black';
        c.textAlign = "center";
        c.textBaseline = 'middle';
        c.fillText(this.name, this.position.x + (this.width / 2), this.position.y + (this.height / 2));
    }

    computeOutput(solutionsArray, iteration, outputIndex) {
        let newSolutionsArray = [];
            for (let i = 0; i < solutionsArray.length; i++) {
                let values = solutionsArray[i].inputs
                if(this.inputNodes[iteration].powered === values[iteration]) newSolutionsArray.push(solutionsArray[i])
            }
            if(iteration < this.inputNodes.length - 1) {
                return this.computeOutput(newSolutionsArray, iteration + 1, outputIndex)
            }
            else {
                return newSolutionsArray[0].outputs[outputIndex];
            }
    }
}