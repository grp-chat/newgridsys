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
const { allMatrixes } = require('./maps');
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
    constructor(allMatrixes) {
        this.allMatrixes = allMatrixes;
        this.matrix = allMatrixes.area2;
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

        if (this.matrix[plyrSlot.y + y][plyrSlot.x + x] === 0) {
            return true;
        }
        return false;
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
        const areaObject = allMatrixes[plyrSlot.area].doors;
        const match = Object.values(areaObject).find(object => {
            return `${object.x},${object.y}` === `${plyrSlot.x},${plyrSlot.y}`;
        });

        // console.log({ match });
        if (match) {
            this.matrix[plyrSlot.y][plyrSlot.x] = 0;
            plyrSlot.area = match.toArea;
            plyrSlot.x = match.appearingCoords.x;
            plyrSlot.y = match.appearingCoords.y;
            this.matrix = allMatrixes[match.toArea].gridMatrix;
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
    emitToUsers(eventName) {
        const allMatrixes = this.allMatrixes;
        const playersArr = this.playersArr;
        const extraArr = this.extraArr;

        io.emit(eventName, { allMatrixes, playersArr, extraArr });
    }
}

//##############################################################################################################
const gridSystem = new GridSystem(allMatrixes);

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


});
