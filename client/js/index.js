const sock = io();

//LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL
var nickname;
const promptMsg = () => {

    //const sat2PMStudents = [LK, LXR, SZF, JHA, JL, JV, H, TCR];
    const sun230pmStudents = ["LOK", "KSY", "KN", "JT", "CJH", "LSH", "KX", "TJY"];
    const sat4pmStudents = ["JX", "JZ", "TWN", "LJY", "LSH", "ELI", "CUR", "CT", "RYD"];

    const studentLogins = {
        teacher: { pinNumber: '8', nickname: 'TCR' },
        len: { pinNumber: '1502', nickname: 'LEN' },

        sat2pmStudent1: { pinNumber: '9852', nickname: 'LK' },
        sat2pmStudent2: { pinNumber: '9035', nickname: 'LXR' },
        sat2pmStudent3: { pinNumber: '3839', nickname: 'SZF' },
        sat2pmStudent4: { pinNumber: '3583', nickname: 'JHA' },
        sat2pmStudent5: { pinNumber: '1072', nickname: 'JL' },
        sat2pmStudent6: { pinNumber: '5691', nickname: 'JV' },
        sat2pmStudent7: { pinNumber: '4048', nickname: 'H' },

        sat4pmStudent1: { pinNumber: '1289', nickname: "JX" },
        sat4pmStudent2: { pinNumber: '3825', nickname: "JZ" },
        sat4pmStudent3: { pinNumber: '8579', nickname: "TWN" },
        sat4pmStudent4: { pinNumber: '8828', nickname: "LJY" },
        sat4pmStudent5: { pinNumber: '1529', nickname: "LSH" },
        sat4pmStudent6: { pinNumber: '3191', nickname: "ELI" },
        sat4pmStudent7: { pinNumber: '3307', nickname: "CUR" },
        sat4pmStudent8: { pinNumber: '2318', nickname: "CT" },
        sat4pmStudent9: { pinNumber: '7385', nickname: "RYD" },

        sun230pmStudent1: { pinNumber: '1198', nickname: "LOK" },
        sun230pmStudent2: { pinNumber: '6139', nickname: "KSY" },
        sun230pmStudent3: { pinNumber: '7051', nickname: "KN" },
        sun230pmStudent4: { pinNumber: '4162', nickname: "JT" },
        sun230pmStudent5: { pinNumber: '2105', nickname: "CJH" },
        sun230pmStudent6: { pinNumber: '5086', nickname: "CED" },
        sun230pmStudent7: { pinNumber: '2167', nickname: "KX" },
        sun230pmStudent8: { pinNumber: '6588', nickname: "TJY" }
    }

    const getNickname = pinNumber => {
        return Object.values(studentLogins).find(obj => obj.pinNumber === pinNumber)?.nickname;
    }

    var nick = prompt("Please enter your pin number:");
    while (nick.length == 0) {
        alert("Please enter your pin number!");
        nick = prompt("Please enter your pin number:");
    }

    nickname = getNickname(nick);

    if (typeof (nickname) === 'undefined') {
        alert("Wrong pin number!");
        promptMsg();
    }
    
};

promptMsg();
sock.emit('newuser', nickname);

//LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL

var studentsArr;
var triggerList = [];
const modal = document.getElementById('modal');
const closeModalButton = document.getElementById('close-modal-button');
const overlay = document.getElementById('overlay');
const modalHeader = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');

let matrixAreaRenderingHere = "";
let typeWriterArr = [];
// let text = "Text here Text here Text here Text here Text here Text here Text here Text here";
// let i = 1;
// let char;
// const fps = 50;

// const studentsArr = ["TCR", "LOK", "KSY", "KN", "JT", "CJH", "CED", "KX", "TJY", "LSH"];

//GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG

function createChatDivs() {
    const chatSec = document.getElementById("chat");
    var chatDiv = document.createElement("div");
    //var chatDiv = document.getElementById("chatdiv");
    //chatDiv.setAttribute("id", "chatdiv");
    chatDiv.style.width = "272px";
    chatDiv.style.height = "320px";
    //chatDiv.style = "background:rgba(255, 255, 255, 0.5); color:black; overflow: auto;"
    chatDiv.style.background = "rgba(255, 255, 255, 0.5)";
    chatDiv.style.color = "black";
    chatDiv.style.overflow = "auto";
    chatDiv.style.overflowX = "hidden";
    //chatDiv.style.float = "right";
    //chatDiv.style.marginLeft = "2%";
    //chatDiv.style.position = "fixed";
    chatDiv.style.top = "30px";
    //chatDiv.style.right = "30px";

    chatSec.appendChild(chatDiv);

    var chatInput = document.createElement('input');
    //chatInput.className = "form-control";
    chatInput.style.width = "205px";
    chatInput.style.height = "45px";
    chatInput.setAttribute("id", "chatinput");
    chatInput.setAttribute("type", "text");
    chatInput.style.display = "inline";
    chatInput.style.fontSize = "1.2em";
    chatDiv.appendChild(chatInput);

    var chatBtn = document.createElement('button');

    chatBtn.className = "btn";
    chatBtn.setAttribute("id", "chatBtn");
    chatBtn.innerHTML = "Send";
    chatBtn.style.height = "50px";
    chatBtn.style.width = "55px";


    chatDiv.appendChild(chatBtn);

    var div3 = document.createElement('div');
    div3.setAttribute("id", "div3");
    div3.style.width = '350px';
    div3.style.height = '260px'
    div3.style.color = 'black';
    div3.style.background = 'rgba(236, 236, 236, 0.5)';
    div3.style.overflowY = "auto";
    chatDiv.appendChild(div3);

    chatBtn.addEventListener('click', function () {
        const message = `${nickname}: ${chatInput.value}`;
        const message2 = chatInput.value;
        sock.emit('chat-to-server', message);
        sock.emit('print-chat-on-canvas', { message2, nickname });
        chatInput.value = '';
    });

    chatInput.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("chatBtn").click();
        }

    });

    return chatSec;
}
createChatDivs();

function appendMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.innerText = message;
    var div3 = document.getElementById("div3");
    div3.append(messageDiv);
    div3.scrollTop = div3.scrollHeight;


    allCommands.forEach((command) => {
        command.executeCommand(message);
    });
}

function openModal() {
    if (modal === null) return
    modal.classList.add('active');
    overlay.classList.add('active');
}
function loadListToModal() {
    modalHeader.innerHTML = "Trigger list";
    modalBody.innerHTML = "";
    triggerList.forEach((item) => {
        modalBody.innerHTML += item + " <br>";
    });

}
function closeModal() {
    if (modal === null) return
    modal.classList.remove('active');
    overlay.classList.remove('active');
}
function updateModal(data) {
    modalHeader.innerHTML = data.head;
    modalBody.innerHTML = data.body;
}

function clientRender(data) {
    const getPlayerObject = data.playersArr.find(object => object.id === nickname);
    matrixAreaRenderingHere = getPlayerObject.area;
    const {
        gridMatrix: playerMatrix, 
        title: playerAreaTitle, 
        doors: redDoorCoords
        } = data.allMatrixes[getPlayerObject.area];
    
    const {playersArr, extraArr, itemsArr} = data;


    const config = { playersArr, extraArr, itemsArr, playerMatrix, playerAreaTitle, redDoorCoords };
    const clientRender = new GridSystemClient(config);
    clientRender.render();
     
    // data.playersArr.forEach(player => {
    //     if (player.id === nickname) {
    //         const config = {
    //             playersArr: data.playersArr,
    //             extraArr: data.extraArr,
    //             itemsArr: data.itemsArr,
    //             playerMatrix: data.allMatrixes[player.area].gridMatrix,
    //             playerAreaTitle: data.allMatrixes[player.area].title,
    //             redDoorCoords: data.allMatrixes[player.area].doors
    //         }
    //         const clientRender = new GridSystemClient(config);
    //         clientRender.render();
    //     }
    // });
}
function typeWriterRender(x, y, playerId) {
    //const test = new TypeWriter({x: 1, y: 3, cellSize: 27, padding: 2})
    //test.typeWriter();
    
    typeWriterArr.forEach(typeWriter => {
        typeWriter.justPrint();
        console.log(typeWriter)
    });
}

//FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF


closeModalButton.addEventListener('click', () => {
    closeModal();
});

document.addEventListener("keydown", (e) => {
    if ([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.view.event.preventDefault();
    }
    //e.view.event.preventDefault();
    sock.emit('keyPress', e.keyCode);
});

//============================================================================================================

//============COMMAND BUILDER======================COMMAND BUILDER===================COMMAND BUILDER==========

// class fixedCommand {
//     constructor(prefix, sockEmitFlag) {
//         this.prefix = prefix;
//         this.sockEmitFlag = sockEmitFlag;
//     }

//     executeCommand(message) {
//         //var extractNickname = message.slice(4).replace(/[^A-Z]+/g, "");
//         if (nickname != "TCR") { return }
//         if (message.slice(0, this.prefix.length) != this.prefix) { return }
//         //if (studentsArr.includes(extractNickname) === false) {return}

//         sock.emit(this.sockEmitFlag);

//         if (this.sockEmitFlag === 'mindControlOff') {
//             sock.emit('chat-to-server', "Mind control mode deactivated");
//         }

//         //let text = "[" + connectedArr.toString() + "]";
//         //sock.emit('chat-to-server', numberOfPlayers);

//         if (this.prefix === "TCR: reset server") {
//             if (nickname != "TCR") {
//                 window.location.reload();
//             } else {
//                 sock.emit('resetserverval');
//             }
//         }


//     }
// }
// class localFixedCommand {
//     constructor(prefix, localFunc) {
//         this.prefix = prefix;
//         //this.localFunc = localFunc;
//     }

//     executeCommand(message) {
//         if (nickname != "TCR") { return }
//         if (message.slice(0, this.prefix.length) != this.prefix) { return }
//         loadListToModal();
//         openModal();
//         //this.localFunc();
//     }
// }

// class forceClientRefreshCommand {
//     constructor(prefix, sockEmitFlag) {
//         this.prefix = prefix;
//         this.sockEmitFlag = sockEmitFlag;
//     }

//     executeCommand(message) {
//         //var extractNickname = message.slice(4).replace(/[^A-Z]+/g, "");
//         //if (nickname != "TCR") {return}
//         if (message.slice(0, this.prefix.length) != this.prefix) { return }
//         //if (studentsArr.includes(extractNickname) === false) {return}

//         sock.emit(this.sockEmitFlag);

//         if (this.prefix === "TCR: reset server") {
//             if (nickname != "TCR") {
//                 window.location.reload();
//             } else {
//                 sock.emit('resetserverval');
//             }
//         }


//     }
// }
// class idCommand {
//     constructor(prefix, sockEmitFlag) {
//         this.prefix = prefix;
//         this.sockEmitFlag = sockEmitFlag;
//     }

//     executeCommand(message) {
//         var extractNickname = message.slice(4).replace(/[^A-Z]+/g, "");
//         if (nickname != "TCR") { return }
//         if (message.slice(0, this.prefix.length) != this.prefix) { return }
//         if (studentsArr.includes(extractNickname) === false) { return }

//         sock.emit(this.sockEmitFlag, extractNickname);

//         if (this.sockEmitFlag === 'mindControl') {
//             sock.emit('chat-to-server', "Mind control mode active = " + extractNickname);
//         }

//     }
// }
// class freeNumCommand {
//     constructor(prefix, sockEmitFlag) {
//         this.prefix = prefix;
//         this.sockEmitFlag = sockEmitFlag;
//     }

//     executeCommand(message) {
//         //var extractCaps = message.slice(5).replace(/[^A-Z]+/g, "");
//         var extractNum = message.replace(/\D/g, '');
//         if (message.slice(0, this.prefix.length) != this.prefix) { return }
//         const playerId = nickname

//         sock.emit(this.sockEmitFlag, { extractNum, playerId });

//     }
// }

// class numCommand {
//     constructor(prefix, sockEmitFlag) {
//         this.prefix = prefix;
//         this.sockEmitFlag = sockEmitFlag;
//     }

//     executeCommand(message) {
//         var extractedNum = message.replace(/\D/g, '');
//         if (nickname != "TCR") { return }
//         if (message.slice(0, this.prefix.length) != this.prefix) { return }

//         var getNum = extractedNum;
//         sock.emit(this.sockEmitFlag, getNum);
//     }
// }
// class numAndIdCommand {
//     constructor(prefix, sockEmitFlag) {
//         this.prefix = prefix;
//         this.sockEmitFlag = sockEmitFlag;
//     }

//     executeCommand(message) {
//         const extractedNum = message.replace(/\D/g, '');
//         const extractNickname = message.slice(4).replace(/[^A-Z]+/g, "");
//         if (nickname != "TCR") { return }
//         if (message.slice(0, this.prefix.length) != this.prefix) { return }
//         if (studentsArr.includes(extractNickname) === false) { return }

//         const studentId = extractNickname;
//         const getNum = extractedNum;
//         sock.emit(this.sockEmitFlag, { getNum, studentId });
//     }
// }

// const allCommands = [
//     new idCommand("TCR: winner ", 'winner'),
//     new freeNumCommand(nickname + ": pw ", 'unlockUsingPassword'),
//     new idCommand("TCR: mind control ", 'mindControl'),
//     new numAndIdCommand("TCR: +", 'addSteps'),
//     new numAndIdCommand("TCR: good ", 'sendPW'),
//     new numAndIdCommand("TCR: nope ", 'failed'),
//     new fixedCommand("TCR: mind control off", 'mindControlOff'),
//     new fixedCommand("TCR: go next level", 'goToNextMap'),
//     new fixedCommand("TCR: restart level", 'restartLevel'),
//     new numCommand("TCR: open lock ", 'openLock'),
//     new numCommand("TCR: all +", 'addStepsAll'),
//     new numAndIdCommand("TCR: use ", 'useItem'),
//     new localFixedCommand("TCR: list", openModal),
//     new idCommand("TCR: go a2 ", 'teleportPlayerArea2'),
//     new idCommand("TCR: go a1 ", 'teleportPlayerMainArea'),
//     new idCommand("TCR: go a3 ", 'teleportPlayerArea3'),
//     new idCommand("TCR: go a4 ", 'teleportPlayerArea4')
//     //new fixedCommand("TCR: teleport me out", 'teleportMeOut'),
//     //new fixedCommand("TCR: teleport me in", 'teleportMeIn'),
//     //new fixedCommand("TCR: number of players", '???'),
//     //new forceClientRefreshCommand("TCR: reset server", 'resetserverval')
// ];

//============COMMAND BUILDER======================COMMAND BUILDER===================COMMAND BUILDER==========


sock.on('chat-to-clients', data => {
    var message = data;
    // var extractNicknameAtPrefix = message.slice(0, 4).replace(/[^A-Z]+/g, "");
    // const sliceAfter = extractNicknameAtPrefix.length
    // if (message.slice(sliceAfter + 2, sliceAfter + 4) === "pw") {
    // message = extractNicknameAtPrefix + ": pw *****"
    // }
    appendMessage(message);
});
sock.on('print-chat-on-canvas', data => {
    if (matrixAreaRenderingHere === data.area) {
        // console.log(data);
        const printChatOnCanvas = new TypeWriter({ x: data.x, y: data.y, area: data.area, message: data.message, id: data.id});
        printChatOnCanvas.typeWriter();
        typeWriterArr.push(printChatOnCanvas);
    }
});

sock.on('loadMatrix', (data) => {

    const { extraArr } = data
    studentsArr = extraArr;

    clientRender(data);
    typeWriterRender();
    
});

sock.on('sendMatrix', (data) => {

    canvasElements = document.querySelectorAll("canvas");
    canvasElements.forEach((canvas) => {
        canvas.remove();
    });

    clientRender(data);
    
    typeWriterArr.forEach(typeWriter => {
        const getPlayerObject = data.playersArr.find(object => object.id === typeWriter.id);
        typeWriter.x = getPlayerObject.x;
        typeWriter.y = getPlayerObject.y;
        typeWriter.area = getPlayerObject.area;
        if (matrixAreaRenderingHere === typeWriter.area) {
            typeWriter.justPrint();
        }
    });
    
    // typeWriterRender();
});
