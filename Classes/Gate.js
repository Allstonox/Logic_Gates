class Gate {
    constructor({ name, position, inputNumber, truthTable, color = '#3193F5' }) {
        this.name = name;
        this.position = position;
        this.inputNumber = inputNumber;
        this.truthTable = truthTable;
        this.color = color;
        this.width = 200;
        this.height = 2 * ((Node.radius * 2) * this.inputNumber);
        this.position.x -= (this.width / 2);
        this.position.y -= (this.height / 2);
        this.inputNodes = [];
        for (let i = 0; i < this.inputNumber; i++) {
            this.inputNodes[i] = new Node({
                position: {
                    x: this.position.x,
                    y: this.position.y + (Node.radius * 2) + (i * (this.height / this.inputNumber))
                },
                radius: Node.radius,
                powered: false
            })
            nodes.push(this.inputNodes[i]);
        }
        this.outputNode = new GateOutput({
            position: {
                x: this.position.x + this.width,
                y: this.position.y + (this.height / 2)
            },
            radius: Node.radius,
            powered: false
        })
        nodes.push(this.outputNode);
    }

    update() {
        this.outputNode.powered = this.computeOutput(this.truthTable, 0);
        this.show();
        for(let i = 0; i < this.inputNodes.length; i++) {
            this.inputNodes[i].update();
        }
        this.outputNode.update();
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

    computeOutput(solutionsArray, iteration) {
        let newSolutionsArray = [];
            for (let i = 0; i < solutionsArray.length; i++) {
                let values = Object.values(solutionsArray[i]);
                if(this.inputNodes[iteration].powered === values[iteration]) newSolutionsArray.push(solutionsArray[i])
            }
            if(iteration < this.inputNodes.length - 1) {
                return this.computeOutput(newSolutionsArray, iteration+ 1)
            }
            else {
                return newSolutionsArray[0].output;
            }
    }
}