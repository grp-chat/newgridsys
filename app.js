const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { join } = require('path');
const { json } = require('express');
const PORT = process.env.PORT || 3000;

const app = express();

const clientPath = `${__dirname}/client`;
console.log(`Serving static files from path ${clientPath}`);

app.use(express.static(clientPath));
const server = http.createServer(app);
const io = socketio(server);

server.listen(PORT);
console.log("Server listening at " + PORT);

//------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------
const { Player } = require('./player');
const { Item } = require('./item');
const { AllMatrixes } = require('./maps');
//------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------


const getPlayerObject = playerId => {
    return Object.values(gridSystem).find(obj => obj.id === playerId);
}
const getPlayerObjectKey = playerId => {
    const findThis = Object.values(gridSystem).find(obj => obj.id === playerId);
    return Object.keys(gridSystem).find(key => gridSystem[key] === findThis);
}
const getLockIdFromPassword = password => {
    const findThis = Object.values(gridSystem.lockIds).find(obj => obj.password === password);
    return Object.keys(gridSystem.lockIds).find(key => gridSystem.lockIds[key] === findThis);

    // const findThisObject = Object.values(gridSystem.lockIds).find(obj => obj.password === data);
    //     const lockId = Object.keys(gridSystem.lockIds).find(key => gridSystem.lockIds[key] === findThisObject);
}

class GridSystem {
    constructor() {
        this.allMatrixes = new AllMatrixes();
        this.allMatrixesBackup = JSON.parse(JSON.stringify(new AllMatrixes()));
        this.matrix = this.allMatrixes.area2;
        this.startingSteps = 500;
        this.maxSteps = 150;
        this.keyCodes = {
            37: {x: -1, y: 0},
            39: {x: 1, y: 0},
            38: {x: 0, y: -1},
            40: {x: 0, y: 1}
        }

        //this.extraArr = ["TCR", "LXR", "LK", "JHA", "JV", "JL", "SZF", "H", "TJY", "KX"];
        //this.extraArr = ["TCR", "JX", "JZ", "TWN", "LJY", "LSH", "ELI", "CUR", "RYD", "CT"];
        this.extraArr = ["TCR", "LOK", "KSY", "KN", "JT", "CJH", "CED", "KX", "TJY", "LSH"];

        //this.p1 = { x: 1, y: 1, lable: 2, id: this.extraArr[0], steps: this.startingSteps, area: "mainArea", wallet: 0, total: 0, storeSteps: 1000 };
        // this.playersArr = [this.p1, this.p2, this.p3, this.p4, this.p5, this.p6, this.p7, this.p8, this.p9, this.p10];
        this.playersArr = [
            this.p1 = new Player({x: 1, y: 1, lable: 2, id: this.extraArr[0], area: "area1", color: "orange"}),
            this.p2 = new Player({x: 2, y: 2, lable: 3, id: this.extraArr[1], area: "area1", color: "pink"})
        ];

        this.itemsArr = [
            this.item1 = new Item({itemLable: 1, itemId: "", color: "#4488FF", returnValue: false}),
            this.item2 = new Item({itemLable: 20, itemId: "💰"}),
            this.item3 = new Item({itemLable: 21, itemId: "🍍"}),
            this.item4 = new Item({itemLable: 22, itemId: "🍇"}),
            this.item5 = new Item({itemLable: 23, itemId: "🍎"}),
            this.item6 = new Item({itemLable: 24, itemId: "🍓"}),
            this.item7 = new Item({itemLable: 25, itemId: "🍒"}),
            this.item8 = new Item({itemLable: 26, itemId: "📚"}),
            this.item9 = new Item({itemLable: 27, itemId: "🧬"}),
            this.item10 = new Item({itemLable: 28, itemId: "🎹"}),
            this.item11 = new Item({itemLable: 29, itemId: "🍖"}),
            this.item12 = new Item({itemLable: 30, itemId: "🔒", returnValue: false}),
        ];

        this.playersArr.forEach((player) => {
            player.maxSteps = this.maxSteps;
            this.startingPoint(player);
            
        });
    }

    startingPoint(plyrSlot) {
        this.allMatrixes[plyrSlot.area].gridMatrix[plyrSlot.y][plyrSlot.x] = plyrSlot.lable;
    }
    isValidMove(plyrSlot, x, y) {
        this.matrix = this.allMatrixes[plyrSlot.area].gridMatrix;

        const cellVal = this.matrix[plyrSlot.y + y][plyrSlot.x + x];

        if (cellVal  === 0) return true;

        return this.isThereAnItem(cellVal, plyrSlot);
        //return false;
    }
    isThereAnItem(cellVal, plyrSlot) {
        const getItemObject = this.itemsArr.find(object => object.itemLable === cellVal);
        if (getItemObject === undefined) return false;

        if(getItemObject.itemId === "🔒") io.emit('chat-to-clients', `${plyrSlot.id} touched a lock`);;

        if (getItemObject.returnValue === false) return false;
        if (plyrSlot.inventory.length >= plyrSlot.maxInventory) return false;

        plyrSlot.inventory += getItemObject.itemId 
        return getItemObject.returnValue;
    }
    
    updPosition(keyCode, plyrSlot) {

        if (this.keyCodes[keyCode] === undefined) return;
        const value = this.keyCodes[keyCode];
        this.matrix = this.allMatrixes[plyrSlot.area].gridMatrix;
        
        this.matrix[plyrSlot.y][plyrSlot.x] = 0;
        
        this.updMatrixForPlayerAtThisSpot(plyrSlot)
        
        this.matrix[plyrSlot.y + value.y][plyrSlot.x + value.x] = plyrSlot.lable;
        plyrSlot.x  = plyrSlot.x + value.x;
        plyrSlot.y = plyrSlot.y + value.y;
        
        this.enterDoorCheck(plyrSlot);
    }
    updMatrixForPlayerAtThisSpot(plyrSlot) {
        const plyrSlotCoords = `${plyrSlot.x},${plyrSlot.y}`;
        
        this.playersArr.forEach(player => {
            if(player.id === plyrSlot.id) return;

            const playerCoords = `${player.x},${player.y}`;
            if (playerCoords === plyrSlotCoords && player.area === plyrSlot.area) {
                this.matrix[plyrSlot.y][plyrSlot.x] = player.lable;
            }
        });
    }
    enterDoorCheck(plyrSlot) {
        this.matrix = this.allMatrixes[plyrSlot.area].gridMatrix;
        const areaObject = this.allMatrixes[plyrSlot.area].doors;
        const match = Object.values(areaObject).find(object => {
            return `${object.x},${object.y}` === `${plyrSlot.x},${plyrSlot.y}`;
        });

        // console.log({ match });
        if (match) {
            this.matrix[plyrSlot.y][plyrSlot.x] = 0;
            plyrSlot.area = match.toArea;
            plyrSlot.x = match.appearingCoords.x;
            plyrSlot.y = match.appearingCoords.y;
            this.matrix = this.allMatrixes[match.toArea].gridMatrix;
            this.matrix[match.appearingCoords.y][match.appearingCoords.x] = plyrSlot.lable;
        }
    }

    movePlayer(keyCode, plyrSlot) {
        
        if (this.keyCodes[keyCode] === undefined) return;
        if (this.isValidMove(plyrSlot, this.keyCodes[keyCode].x, this.keyCodes[keyCode].y)) {
            this.updPosition(keyCode, plyrSlot);
            plyrSlot.steps--;
        }
    }

    resetMap() {
        this.allMatrixes = new AllMatrixes();
        // this.allMatrixes = JSON.parse(JSON.stringify(this.allMatrixesBackup));
         //this.duplicateMatrix(matrix);
         this.playersArr.forEach((player) => {
            player.x = player.originX;
            player.y = player.originY;
            player.area = player.originArea;
            player.inventory = "";  
            this.startingPoint(player);
         });
         this.emitToUsers('sendMatrix');
    }
    emitToUsers(eventName) {
        const allMatrixes = this.allMatrixes;
        const playersArr = this.playersArr;
        const extraArr = this.extraArr;
        const itemsArr = this.itemsArr;

        io.emit(eventName, { allMatrixes, playersArr, extraArr, itemsArr });
    }
}

//##############################################################################################################
const gridSystem = new GridSystem();

io.sockets.on('connection', function (sock) {

    sock.on('newuser', (data) => {

        sock.id = data; //"TCR"
        io.emit('chat-to-clients', data + " connected");
        gridSystem.emitToUsers('loadMatrix');
        //sock.emit('loadMatrix', { allMatrixes, playersArr, extraArr });

        const gridSysKey = getPlayerObjectKey(sock.id);
        sock.on('keyPress', function (data) {
            if (gridSystem[gridSysKey].steps <= 0) { return }
            gridSystem.movePlayer(data, gridSystem[gridSysKey]);
            gridSystem.emitToUsers('sendMatrix');
        });
    });

    sock.on('disconnect', () => {
        io.emit('chat-to-clients', sock.id + " disconnected");
    });

    sock.on('chat-to-server', (data) => {
        io.emit('chat-to-clients', data);
    });
    sock.on('createChatObject', data => {
        const getPlayerObject = gridSystem.playersArr.find(object => object.id === data.nickname);
        const message = data.message2;
        // console.log(getPlayerObject)
        const { x, y, area, id } = getPlayerObject;
        io.emit('createChatObject', { x, y, area, message, id })
        
    });

    sock.on('useItem', (data) => {
        
        const emoji = (data.getNum - 1) * 2;
        const playerId = data.studentId;
        const gridSysPlyrKey = getPlayerObjectKey(playerId);
        const itemLength = gridSystem[gridSysPlyrKey].inventory.length
        if (emoji + 1 > itemLength || itemLength === 0) {
            io.emit('chat-to-clients', `Wrong item slot selection`);
            return
        }
        const remainingItem = gridSystem[gridSysPlyrKey].inventory.slice(0, emoji) + gridSystem[gridSysPlyrKey].inventory.slice(emoji+2, itemLength)
        gridSystem[gridSysPlyrKey].inventory = remainingItem;
        io.emit('chat-to-clients', `${playerId}'s item ${data.getNum} used`);
        gridSystem.emitToUsers('sendMatrix');

    });
    sock.on('restartLevel', () => {

        gridSystem.resetMap();

        gridSystem.emitToUsers('sendMatrix');
        
    });


});
