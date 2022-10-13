class GridSystemClient {
    constructor(config) {
        this.matrix = config.playerMatrix;
        this.redDoorCoords = config.redDoorCoords;
        this.areaTitle = config.playerAreaTitle;
        this.itemsArr = config.itemsArr;

        this.uiContext = this.getContext(0, 0, "transparent", false);
        this.outlineContext = this.getContext(0, 0, "transparent");
        this.topContext = this.getContext(0, 0, "transparent", false);
        this.chatContext = this.getContext(1000, 580, "transparent", false);

        this.cellSize = 27;
        this.padding = 2;
        //this.students = ["TCR", "LXR", "LK", "JHA", "JV", "JL", "SZF", "H", "TJY", "KX"];
        //this.students = ["TCR", "JX", "JZ", "TWN", "LJY", "LSH", "ELI", "CUR", "RYD", "CT"];
        //this.students = ["TCR", "LOK", "KSY", "KN", "JT", "CJH", "CED", "KX", "TJY", "LSH"];
        this.students = config.extraArr;

        // this.p1 = {color: "orange", lable: 2, id: this.students[0]};
        // this.p2 = {color: "pink", lable: 3, id: this.students[1]};
        this.playersArr = config.playersArr;

        //document.addEventListener("keydown", this.movePlayer);
        this.text = "Player here says hello world";
        this.i = 1;
        this.char = "";
        this.fps = 20;
        
    }

    getCenter(w, h) {
        return {
            x: window.innerWidth / 2 - w / 2 + "px",
            y: window.innerHeight / 2 - h / 2 + "px"
        };
    }
    getTopLeftFromUIContext() {
        return {
            x: window.innerWidth / 2 - this.uiContextWidth / 2.1 + "px",
            y: window.innerHeight / 2 - this.uiContextHeight / 2.5 + "px"
        };
    }
    getContext(w, h, color = "#111", isTransparent = false) {
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        this.width = this.canvas.width = w;
        this.height = this.canvas.height = h;
        this.canvas.style.position = "absolute";
        this.canvas.style.background = color;
        if (isTransparent) {
            this.canvas.style.backgroundColor = "transparent";
        }
        const center = this.getCenter(w, h);
        this.canvas.style.marginLeft = center.x;
        this.canvas.style.marginTop = center.y;
        document.body.appendChild(this.canvas);

        return this.context;
    }

    uiContextSettings() {
        this.uiContext.canvas.width = 1000;
        this.uiContext.canvas.height = 580;
        this.uiContext.canvas.style.background = "#111";
        const center = this.getCenter(this.uiContext.canvas.width, this.uiContext.canvas.height);
        this.uiContext.canvas.style.marginLeft = center.x;
        this.uiContext.canvas.style.marginTop = center.y;
    }
    chatContextSettings() {
        const w = (this.cellSize + this.padding) * this.matrix[0].length - (this.padding);
        const h = (this.cellSize + this.padding) * this.matrix.length - (this.padding);

        this.chatContext.canvas.width = w;
        this.chatContext.canvas.height = h;
        const center = this.getCenter(w, h);
        //const center = this.getTopLeftFromUIContext();
        this.chatContext.canvas.style.marginLeft = center.x;
        this.chatContext.canvas.style.marginTop = center.y;
        this.chatContext.canvas.style.background = "transparent";
    }
    outlineContextSettings() {
        const w = (this.cellSize + this.padding) * this.matrix[0].length - (this.padding);
        const h = (this.cellSize + this.padding) * this.matrix.length - (this.padding);

        this.outlineContext.canvas.width = w;
        this.outlineContext.canvas.height = h;
        const center = this.getCenter(w, h);
        //const center = this.getTopLeftFromUIContext();
        this.outlineContext.canvas.style.marginLeft = center.x;
        this.outlineContext.canvas.style.marginTop = center.y;
        this.outlineContext.canvas.style.background = "#333";
    }
    topContextSettings() {
        this.topContext.canvas.width = 270;
        this.topContext.canvas.height = 260;
        this.topContext.canvas.style.background = "#222";
        this.topContext.canvas.style.marginLeft = "995px";
        this.topContext.canvas.style.marginTop = "5px";
        this.topContext.canvas.style.border = "solid 1px black";
        this.topContext.font = "12px Courier";
        this.topContext.fillStyle = "white";

        var nextLine = 10

        this.playersArr.forEach(player => {
            //this.topContext.scale(1, 1);
            let printPlayerInfo = `${player.id}`;
            this.topContext.fillText(printPlayerInfo, 0, nextLine);
            printPlayerInfo = `🏃`;
            this.topContext.scale(-1, 1);
            // this.topContext.scale(1.2, 1.2);
            this.topContext.fillText(printPlayerInfo, -39, nextLine);

            // this.topContext.scale(0.8, 0.8);
            this.topContext.scale(-1, 1);
            printPlayerInfo = `:${player.steps}/${player.maxSteps} 🎒:${player.inventory}`;
            this.topContext.fillText(printPlayerInfo, 39, nextLine);

            nextLine = nextLine + 15;
        });
        nextLine = nextLine - 5;



        this.topContext.beginPath();
        this.topContext.moveTo(0, nextLine);
        this.topContext.lineTo(270, nextLine);
        this.topContext.strokeStyle = "white";
        this.topContext.stroke();
    }
    setAllCanvasSettings() {
        this.uiContextSettings();
        this.outlineContextSettings();
        this.chatContextSettings();
        this.topContextSettings();
    }


    setColorAndId(cellVal) {
        let color = "#111";
        let playerId = null;
        let itemId = null;

        const getPlayerObject = this.playersArr.find(object => object.lable === cellVal);
        if (getPlayerObject) {
            color = getPlayerObject.color;
            playerId = getPlayerObject.id;
        }

        const getItemObject = this.itemsArr.find(object => object.itemLable === cellVal);
        if (getItemObject === undefined) return { color, playerId, itemId };
        itemId = getItemObject.itemId;
        color = getItemObject.color;

        return { color, playerId, itemId };
    }
    renderBlankCell(cellDetail, row, col) {
        this.outlineContext.fillStyle = cellDetail.color;
        this.outlineContext.fillRect(col * (this.cellSize + this.padding),
            row * (this.cellSize + this.padding),
            this.cellSize, this.cellSize);
    }
    renderPlayers(cellDetail, row, col) {

        if (cellDetail.playerId === null) { return }

        if (this.students.includes(cellDetail.playerId)) {
            this.outlineContext.font = "13px Times New Roman";
            this.outlineContext.fillStyle = "black";
            this.outlineContext.fillText(cellDetail.playerId, col * (this.cellSize + this.padding) + 1,
                row * (this.cellSize + this.padding) + 18);
        }
    }
    renderItems(cellDetail, row, col) {
        const getItemObject = this.itemsArr.find(object => object.itemId === cellDetail.itemId);
        if (getItemObject === undefined) return;

        this.outlineContext.font = getItemObject.font;

        this.outlineContext.fillText(getItemObject.itemId, col * (this.cellSize + this.padding) + 3,
            row * (this.cellSize + this.padding) + getItemObject.rowValue);
    }



    renderRedDoors() {
        const redDoorCoords = this.redDoorCoords;
        redDoorCoords.forEach(door => {
            this.outlineContext.fillStyle = "red";
            this.outlineContext.fillRect(door.x * (this.cellSize + this.padding),
                door.y * (this.cellSize + this.padding), this.cellSize, this.cellSize);

        });
    }
    setTopTitle() {
        this.uiContext.font = "20px Courier";
        this.uiContext.fillStyle = "white";

        // const getPlayerArea = playersArr.find(player => player.id === nickname);

        // console.log(this.matrix)
        this.uiContext.fillText(this.areaTitle, 20, 30);
        // this.uiContext.fillText(this.areaTitle, 20, 30);
    }

    typeWriter(){
        
        const { x, y } = this.playersArr[0];
        
        this.char = this.text.substr(0, this.i);  
        // Clear the canvas
        this.chatContext.clearRect(0,0,this.chatContext.canvas.width, this.chatContext.canvas.height)
        this.chatContext.font = '11px Courier';
        this.chatContext.fillStyle = 'white';
        this.chatContext.fillText(this.char, x * (this.cellSize + this.padding), y * (this.cellSize));  
        if (this.i<=this.text.length){
          setTimeout(this.typeWriter.bind(this), this.fps)
          this.i++
        }
      }

    render() {

        this.setAllCanvasSettings();

        for (let row = 0; row < this.matrix.length; row++) {
            for (let col = 0; col < this.matrix[row].length; col++) {

                const cellVal = this.matrix[row][col];
                const cellDetail = this.setColorAndId(cellVal);
                // const itemDetail = this.setItemColorAndId(cellVal);

                //when cellVal === 0 (cellDetail.color === black)
                this.renderBlankCell(cellDetail, row, col);
                //when Player or Item present
                this.renderPlayers(cellDetail, row, col);
                this.renderItems(cellDetail, row, col);
            }
        }
        this.renderRedDoors();
        this.setTopTitle(this.matrix);
        
    }

}