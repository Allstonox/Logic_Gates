const canvas = document.querySelector('#myCanvas');
canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 100;

const c = canvas.getContext("2d");

const gatesData = [
    {
        name: 'AND',
        position: {
            x: canvas.width / 2,
            y: canvas.height / 2
        },
        inputNumber: 2,
        outputNumber: 1,
        truthTable: [{ inputs: [false, false], outputs: [false] }, { inputs: [true, false], outputs: [false] }, { inputs: [false, true], outputs: [false] }, { inputs: [true, true], outputs: [true] }]
    },
    {
        name: 'NOT',
        position: {
            x: (canvas.width / 2),
            y: canvas.height / 2
        },
        inputNumber: 1,
        outputNumber: 1,
        truthTable: [{ inputs: [false], outputs: [true] }, { inputs: [true], outputs: [false] }]
    }
]

const gatesGrid = document.querySelector('.gates-grid');
function populateGatesGrid() {
    gatesGrid.innerHTML = null;
    for (let i = 0; i < gatesData.length; i++) {
        let newChip = document.createElement('button');
        newChip.id = gatesData[i].name;
        newChip.innerText = gatesData[i].name;
        newChip.classList.add('gate');
        newChip.addEventListener('click', (event) => {
            addGateToCanvas(event.target.id);
        })
        gatesGrid.appendChild(newChip);
    }
}

function addGateToCanvas(gateToAdd) {
    let gateDataToAdd;
    for (let i = 0; i < gatesData.length; i++) {
        if (gatesData[i].name === gateToAdd) {
            gateDataToAdd = gatesData[i];
        }
    }
    gates.push(new Gate({
        name: gateDataToAdd.name,
        position: {
            x: gateDataToAdd.position.x,
            y: gateDataToAdd.position.y
        },
        outputNumber: gateDataToAdd.outputNumber,
        inputNumber: gateDataToAdd.inputNumber,
        truthTable: gateDataToAdd.truthTable,
    }));
}

let inputNodeCount = 1;
let outputNodeCount = 1;
let inputNodes = [];
let outputNodes = [];
let wires = [];
let nodes = [];
let gates = [];
function createInputNodes() {
    for (let i = 0; i < inputNodeCount; i++) {
        inputNodes[i] = new InputNode({
            position: {
                x: InputNode.radius + 5,
                y: (i * (canvas.height / inputNodeCount)) + (InputNode.radius) + (0.5 * (canvas.height / inputNodeCount) - InputNode.radius),
            },
            radius: InputNode.radius,
            powered: false
        })
    }
}

function changeInputNumber(sliderValue, nodeType) {
    if(nodeType === 'input') {
        inputNodeCount = sliderValue;
        createInputNodes();
    }
    else if(nodeType === 'output') {
        outputNodeCount = sliderValue;
        createOutputNodes();
    }
}

function createOutputNodes() {
    for (let i = 0; i < outputNodeCount; i++) {
        outputNodes[i] = new Node({
            position: {
                x: canvas.width - (InputNode.radius + 5),
                y: (i * (canvas.height / outputNodeCount)) + (InputNode.radius) + (0.5 * (canvas.height / outputNodeCount) - InputNode.radius)
            },
            radius: InputNode.radius,
            powered: false,
            color: '#49535C'
        })
    }
}

function createGate() {
    gates.push(new Gate({
        name: 'AND',
        position: {
            x: canvas.width / 2,
            y: canvas.height / 2
        },
        inputNumber: 2,
        truthTable: [{ A: false, B: false, output: false }, { A: false, B: true, output: false }, { A: true, B: false, output: false }, { A: true, B: true, output: true }]
    }))

    gates.push(new Gate({
        name: 'NOT',
        position: {
            x: (canvas.width / 2) + 400,
            y: canvas.height / 2
        },
        inputNumber: 1,
        truthTable: [{ A: false, output: true }, { A: true, output: false }]
    }))
}

function initialize() {
    //HTML Stuff
    populateGatesGrid();
    //Canvas stuff
    createInputNodes();
    createOutputNodes();
}

let lastClickedItem = null;
let wirePath = {
    position: {
        startingX: null,
        startingY: null,
        endingX: null,
        endingY: null,
    },
    drawingWirePath: false,
    showPath: false
}
let draggingGate = {
    boolVal: false,
    gateToDrag: null
};
canvas.addEventListener('mousedown', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    let clickableItems = [...outputNodes, ...nodes, ...gates.toReversed(), ...wires.toReversed()];
    for (let i = 0; i < clickableItems.length; i++) {
        if (clickableItems[i] instanceof Node) {
            if (checkClicked(clickableItems[i], event)) {
                lastClickedItem = clickableItems[i];
                wirePath.position.startingX = clickableItems[i].position.x;
                wirePath.position.startingY = clickableItems[i].position.y;
                wirePath.position.endingX = x;
                wirePath.position.endingY = y;
                wirePath.drawingWirePath = true;
                return;
            }
        }
        else if (clickableItems[i] instanceof Gate) {
            if (checkClicked(clickableItems[i], event, 'rectangle')) {
                draggingGate.boolVal = true;
                draggingGate.gateToDrag = clickableItems[i];
                return;
            }
        }
        else if (clickableItems[i] instanceof Wire) {
            if (checkClicked(clickableItems[i], event, 'line')) {
                for (let j = 0; j < clickableItems[i].connections.length; j++) {
                    clickableItems[i].connections[j].connections.splice(clickableItems[i].connections[j].connections.indexOf(clickableItems[i]), 1);
                }
                wires.splice(wires.indexOf(clickableItems[i]), 1);
                return;
            }
        }
    }
});

canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (wirePath.drawingWirePath) {
        wirePath.position.endingX = x;
        wirePath.position.endingY = y;
        wirePath.showPath = true;
    }
    if (draggingGate.boolVal) {
        draggingGate.gateToDrag.position.x = x - (draggingGate.gateToDrag.width / 2);
        draggingGate.gateToDrag.position.y = y - (draggingGate.gateToDrag.height / 2);
        for (let i = 0; i < draggingGate.gateToDrag.inputNodes.length; i++) {
            let originalNodePositionX = draggingGate.gateToDrag.inputNodes[i].position.x;
            let originalNodePositionY = draggingGate.gateToDrag.inputNodes[i].position.y;
            draggingGate.gateToDrag.inputNodes[i].position.x = draggingGate.gateToDrag.position.x;
            draggingGate.gateToDrag.inputNodes[i].position.y = draggingGate.gateToDrag.position.y + (i * (draggingGate.gateToDrag.height / draggingGate.gateToDrag.inputNumber)) + (Node.radius) + (0.5 * (draggingGate.gateToDrag.height / draggingGate.gateToDrag.inputNumber) - Node.radius)
            for (let j = 0; j < draggingGate.gateToDrag.inputNodes[i].connections.length; j++) {
                let connectionType;
                if (originalNodePositionX === draggingGate.gateToDrag.inputNodes[i].connections[j].position.startingX && originalNodePositionY === draggingGate.gateToDrag.inputNodes[i].connections[j].position.startingY) {
                    connectionType = 'starting';
                }
                else if (originalNodePositionX === draggingGate.gateToDrag.inputNodes[i].connections[j].position.endingX && originalNodePositionY === draggingGate.gateToDrag.inputNodes[i].connections[j].position.endingY) {
                    connectionType = 'ending';
                }
                if (connectionType === 'starting') {
                    draggingGate.gateToDrag.inputNodes[i].connections[j].position.startingX = draggingGate.gateToDrag.inputNodes[i].position.x
                    draggingGate.gateToDrag.inputNodes[i].connections[j].position.startingY = draggingGate.gateToDrag.inputNodes[i].position.y
                }
                else if (connectionType === 'ending') {
                    draggingGate.gateToDrag.inputNodes[i].connections[j].position.endingX = draggingGate.gateToDrag.inputNodes[i].position.x
                    draggingGate.gateToDrag.inputNodes[i].connections[j].position.endingY = draggingGate.gateToDrag.inputNodes[i].position.y
                }
            }
        }
        for (let i = 0; i < draggingGate.gateToDrag.outputNodes.length; i++) {
            let originalNodePositionX = draggingGate.gateToDrag.outputNodes[i].position.x;
            let originalNodePositionY = draggingGate.gateToDrag.outputNodes[i].position.y;
            draggingGate.gateToDrag.outputNodes[i].position.x = draggingGate.gateToDrag.position.x + draggingGate.gateToDrag.width;
            draggingGate.gateToDrag.outputNodes[i].position.y = draggingGate.gateToDrag.position.y + (i * (draggingGate.gateToDrag.height / draggingGate.gateToDrag.outputNumber)) + (Node.radius) + (0.5 * (draggingGate.gateToDrag.height / draggingGate.gateToDrag.outputNumber) - Node.radius)
            for (let j = 0; j < draggingGate.gateToDrag.outputNodes[i].connections.length; j++) {
                let connectionType;
                if (originalNodePositionX === draggingGate.gateToDrag.outputNodes[i].connections[j].position.startingX && originalNodePositionY === draggingGate.gateToDrag.outputNodes[i].connections[j].position.startingY) {
                    connectionType = 'starting';
                }
                else if (originalNodePositionX === draggingGate.gateToDrag.outputNodes[i].connections[j].position.endingX && originalNodePositionY === draggingGate.gateToDrag.outputNodes[i].connections[j].position.endingY) {
                    connectionType = 'ending';
                }
                if (connectionType === 'starting') {
                    draggingGate.gateToDrag.outputNodes[i].connections[j].position.startingX = draggingGate.gateToDrag.outputNodes[i].position.x
                    draggingGate.gateToDrag.outputNodes[i].connections[j].position.startingY = draggingGate.gateToDrag.outputNodes[i].position.y
                }
                else if (connectionType === 'ending') {
                    draggingGate.gateToDrag.outputNodes[i].connections[j].position.endingX = draggingGate.gateToDrag.outputNodes[i].position.x
                    draggingGate.gateToDrag.outputNodes[i].connections[j].position.endingY = draggingGate.gateToDrag.outputNodes[i].position.y
                }
            }
        }
    }
});

canvas.addEventListener('mouseup', (event) => {
    if (draggingGate.boolVal) draggingGate.boolVal = false;
});

canvas.addEventListener('click', (event) => {
    if (lastClickedItem) {
        let clickableItems = [...outputNodes, ...nodes];
        for (let i = 0; i < clickableItems.length; i++) {
            if (checkClicked(clickableItems[i], event) && clickableItems[i] != lastClickedItem) {
                for (let j = 0; j < wires.length; j++) {
                    if (lastClickedItem.position.x === wires[j].position.startingX
                        && lastClickedItem.position.y === wires[j].position.startingY
                        && clickableItems[i].position.x === wires[j].position.endingX
                        && clickableItems[i].position.y === wires[j].position.endingY ||
                        lastClickedItem.position.x === wires[j].position.endingX
                        && lastClickedItem.position.y === wires[j].position.endingY
                        && clickableItems[i].position.x === wires[j].position.startingX
                        && clickableItems[i].position.y === wires[j].position.startingY) {
                        wirePath = {
                            position: {
                                startingX: null,
                                startingY: null,
                                endingX: null,
                                endingY: null,
                            },
                            drawingWirePath: false,
                            showPath: false
                        }
                        lastClickedItem = null;
                        return;
                    }
                }
                wires.push(new Wire({
                    position: {
                        startingX: lastClickedItem.position.x,
                        startingY: lastClickedItem.position.y,
                        endingX: clickableItems[i].position.x,
                        endingY: clickableItems[i].position.y,
                    },
                    connections: [lastClickedItem, clickableItems[i]]
                }))
                lastClickedItem.connections.push(wires[wires.length - 1]);
                clickableItems[i].connections.push(wires[wires.length - 1]);
            }
        }
    }
    else {
        for (let i = 0; i < inputNodes.length; i++) {
            if (checkClicked(inputNodes[i], event)) {
                inputNodes[i].togglePower();
            }
        }
    }
    wirePath = {
        position: {
            startingX: null,
            startingY: null,
            endingX: null,
            endingY: null,
        },
        drawingWirePath: false,
        showPath: false
    }
    lastClickedItem = null;
});

function checkClicked(clickableItem, event, shape = 'circle') {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (shape === 'circle') {
        if (x >= clickableItem.position.x - clickableItem.radius && x <= clickableItem.position.x + clickableItem.radius &&
            y >= clickableItem.position.y - clickableItem.radius && y <= clickableItem.position.y + clickableItem.radius) {
            return true
        }
        return false;
    }
    else if (shape === 'rectangle') {
        if (x >= clickableItem.position.x && x <= clickableItem.position.x + clickableItem.width &&
            y >= clickableItem.position.y && y <= clickableItem.position.y + clickableItem.height) {
            return true
        }
        return false;
    }
    else if (shape === 'line') {
        let startingX = clickableItem.position.startingX;
        let startingY = clickableItem.position.startingY;
        let endingX = clickableItem.position.endingX;
        let endingY = clickableItem.position.endingY;
        let slope = (endingY - startingY) / (endingX - startingX);
        let yInt = startingY - (slope * startingX);
        let allLinePoints = [];
        if (!(Number.isFinite(slope))) {
            if (startingY < endingY) {
                for (let i = startingY; i < endingY; i++) {
                    allLinePoints.push({
                        x: startingX,
                        y: i,
                    })
                }
                for (let i = 0; i < allLinePoints.length; i++) {
                    if (x > allLinePoints[i].x - 5 && x < allLinePoints[i].x + 5 && y > allLinePoints[i].y - 5 && y < allLinePoints[i].y + 5) return true;
                }
                return false;
            }
            else if (startingY > endingY) {
                for (let i = endingY; i < startingY; i++) {
                    allLinePoints.push({
                        x: startingX,
                        y: i,
                    })
                }
                for (let i = 0; i < allLinePoints.length; i++) {
                    if (x > allLinePoints[i].x - 5 && x < allLinePoints[i].x + 5 && y > allLinePoints[i].y - 5 && y < allLinePoints[i].y + 5) return true;
                }
                return false;
            }
        }
        else {
            if (startingX < endingX) {
                for (let i = startingX; i < endingX; i++) {
                    let computedY = slope * i + yInt;
                    allLinePoints.push({
                        x: i,
                        y: computedY,
                    })
                }
                for (let i = 0; i < allLinePoints.length; i++) {
                    if (x > allLinePoints[i].x - 5 && x < allLinePoints[i].x + 5 && y > allLinePoints[i].y - 5 && y < allLinePoints[i].y + 5) return true;
                }
                return false;
            }
            else if (startingX > endingX) {
                for (let i = endingX; i < startingX; i++) {
                    let computedY = slope * i + yInt;
                    allLinePoints.push({
                        x: i,
                        y: computedY,
                    })
                }
                for (let i = 0; i < allLinePoints.length; i++) {
                    if (x > allLinePoints[i].x - 5 && x < allLinePoints[i].x + 5 && y > allLinePoints[i].y - 5 && y < allLinePoints[i].y + 5) return true;
                }
                return false;
            }
        }
    }
}

let textInput = document.querySelector('#textInput');
function packageGate() {
    let newGate = {
        name: textInput.value,
        position: {
            x: canvas.width / 2,
            y: canvas.height / 2
        },
        inputNumber: inputNodeCount,
        outputNumber: outputNodeCount,
        truthTable: computeTruthTable(inputNodeCount)
    }
    gatesData.push(newGate);
    populateGatesGrid();
    console.log(newGate);
}

function computeTruthTable(numberOfInputs) {
    let longestChain = 1;
    for (let j = 0; j < wires.length; j++) {
        if (wires[j].allConnections.length > longestChain) longestChain = wires[j].allConnections;
    }
    console.log(longestChain, longestChain.length);
    let tableInputs = computeTruthTableInputs(numberOfInputs);
    let tableOutputs = [];
    for (let i = 0; i < tableInputs.length; i++) {
        tableOutputs[i] = [];
        for (let j = 0; j < inputNodeCount; j++) {
            inputNodes[j].powered = tableInputs[i][j];
        }
        for (let j = 0; j < longestChain.length; j++) {
            updateAllAssets();
        }
        for (let k = 0; k < outputNodeCount; k++) {
            tableOutputs[i].push(outputNodes[k].powered);
        }
    }
    //Convert from 0/1 to true/false
    for (let i = 0; i < tableInputs.length; i++) {
        for (let j = 0; j < inputNodeCount; j++) {
            if (tableInputs[i][j] === 0) tableInputs[i][j] = false;
            else if (tableInputs[i][j] === 1) tableInputs[i][j] = true;
        }
    }
    for (let i = 0; i < tableOutputs.length; i++) {
        for (let j = 0; j < outputNodeCount; j++) {
            if (tableOutputs[i][j] === 0) tableOutputs[i][j] = false;
            else if (tableOutputs[i][j] === 1) tableOutputs[i][j] = true;
        }
    }
    // console.log("Inputs:", tableInputs);
    // console.log("Outputs:", tableOutputs);
    let truthTable = [];
    for (let i = 0; i < tableInputs.length; i++) {
        truthTable[i] = {
            inputs: tableInputs[i],
            outputs: tableOutputs[i],
        }
    }
    return truthTable;
}

function computeTruthTableInputs(numberOfInputs) {
    if (numberOfInputs === 0) return [[]];
    let restCombinations = computeTruthTableInputs(numberOfInputs - 1);
    let combinations = [];
    for (let i = 0; i < restCombinations.length; i++) {
        combinations.push([0, ...restCombinations[i]]);
        combinations.push([1, ...restCombinations[i]]);
    }
    return combinations;
}

function updateAllAssets() {
    for (let i = 0; i < inputNodeCount; i++) {
        inputNodes[i].update();
    }
    for (let i = 0; i < wires.length; i++) {
        wires[i].update();
    }
    for (let i = 0; i < gates.length; i++) {
        gates[i].update();
    }
    for (let i = 0; i < outputNodeCount; i++) {
        outputNodes[i].update();
    }
    if (wirePath.showPath) {
        c.strokeStyle = '#343a40';
        c.lineWidth = 8;
        c.beginPath();
        c.moveTo(wirePath.position.startingX, wirePath.position.startingY);
        c.lineTo(wirePath.position.endingX, wirePath.position.endingY);
        c.stroke();
    }
}

function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = "#212529";
    c.fillRect(0, 0, canvas.width, canvas.height);
    updateAllAssets();
}

initialize();
animate();