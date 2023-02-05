// code was written as quickly as possible and has undergone absolutely zero refactoring
// plenty of clean-up work to be done when time permits, functional for now
// this is intended as a learning tool for Code Nation learners, no other use is authorised

// import ciphers
import { caesar, pigpen, vigenere } from "./encode.js"
// fetch data from json, store as 'data'
let data;
fetch("data.json")
    .then(response => {
        return response.json();
    })
    .then(temp => data = temp);

// element references
let board = document.getElementById("board");
let study = document.getElementById("study");
let hall = document.getElementById("hall");
let lounge = document.getElementById("lounge");
let library = document.getElementById("library");
let cards = document.getElementById("cards");
let diningroom = document.getElementById("diningroom");
let billiardroom = document.getElementById("billiardroom");
let conservatory = document.getElementById("conservatory");
let ballroom = document.getElementById("ballroom");
let kitchen = document.getElementById("kitchen");
let movebtn = document.getElementsByClassName("anim-btn")[0];
let cipertext = document.getElementById("ciphertext");
let overlay = document.getElementById("overlay");
let visitedrooms = document.getElementById("visitedrooms");
let roomlist = document.getElementById("roomlist");
let ciphersolution = document.getElementById("ciphersolution");
let correct = document.getElementById("correct");
let incorrect = document.getElementById("incorrect");
let closebtn = document.getElementById("closebtn");
let outcome = document.getElementById("outcome");
let outcomesubmit = document.getElementById("outcomesubmit");
let whodoneit = document.getElementById("whodoneit");
let withwhat = document.getElementById("withwhat");
let wherewasit = document.getElementById("wherewasit");
let colouroptions = document.getElementById("colouroptions");
let optionssubmit = document.getElementById("optionssubmit");
let resizebtn = document.getElementById("resizebtn");
let controls = document.getElementById("controls");
let controlsright = document.getElementById("controlsright");
let boardback = document.getElementById("boardback");
let backclose = document.getElementById("backclose");

let pigpentest = document.getElementById("pigpentest");
overlay.style.display = "none";

// initially roll a random between 0-8, number represents starting room - 0 to account for zero-indexing
let startingRandom = Math.floor(Math.random() * 9);
let roomArray = [study, hall, lounge, library, billiardroom, diningroom, conservatory, ballroom, kitchen]
let startingRoom = roomArray[startingRandom];
let currentRoom = startingRoom;
let currentGame;
let solvedClues = [];
let activeRoom = "";
let clueCache = [];
let playerHue = "drop-shadow(8px 0px 0.85rem rgb(0, 0, 0)) hue-rotate(0deg)";
// remove used room
roomArray.splice(startingRandom, 1);

// create/re-draw player character
function drawPlayer() {
    // find previous icon(s) by class, remove if not null
    let previousIcon = document.getElementsByClassName('playerIcon')[0];
    if (previousIcon) {
        previousIcon.remove();
    }

    let playerIcon = document.createElement('img');
    playerIcon.className = 'playerIcon';
    playerIcon.src = './images/piece2.png';
    playerIcon.style.width = '4vw';
    playerIcon.style.filter = playerHue;
    currentRoom.appendChild(playerIcon);
}

drawPlayer();

// change player colour
// disabled because Steff is boring
optionssubmit.addEventListener("click", () => {
    let val = 0;
    if (colouroptions.value == "orange") {
        val = 0;
    } else if (colouroptions.value == "green") {
        val = 100;
    } else if (colouroptions.value == "blue") {
        val = 200;
    } else if (colouroptions.value == "pink") {
        val = 300;
    } else if (colouroptions.value == "purple") {
        val = 250;
    } else if (colouroptions.value == "red") {
        val = 334;
    }
    
    playerHue = "drop-shadow(8px 0px 0.85rem rgb(0, 0, 0)) hue-rotate(" + val + "deg)";
    document.getElementsByClassName('playerIcon')[0].style.filter = playerHue;
});

// on click check if cipher solution is correct
ciphersolution.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        correct.style.display = "none";
        incorrect.style.display = "none";
        // check if entered value matches original clue from data.json
        if(ciphersolution.value == data.games[currentGame].game[0][activeRoom][1]) {
            correct.style.display = "block";
            solvedClues.push(activeRoom);
        } else {
            incorrect.style.display = "block";
        }
    }

});

function resetElements() {
    ciphersolution.readOnly = false;
    correct.style.display = "none";
    incorrect.style.display = "none";
    ciphersolution.value = "";
}

function recallClue(element) {
        // recall clue from clueCache
        resetElements();
        activeRoom = element.srcElement.innerText;
        for (let i = 0; i < clueCache.length; i++) { 
            if (clueCache[i][0] == activeRoom) {
                cipertext.textContent = clueCache[i][1];
                for (let i = 0; i < solvedClues.length; i++) {
                    if (solvedClues[i] == element.srcElement.innerText) {
                        // show solved message
                        ciphersolution.value = data.games[currentGame].game[0][activeRoom][1];
                        ciphersolution.readOnly = true;
                        correct.style.display = "block";
                    }
                }
            }
        }
        // show clue box and add close
        overlay.style.display = "flex";
        closebtn.addEventListener("click", () => {
            overlay.style.display = "none";
            correct.style.display = "none";
            incorrect.style.display = "none";
        });
}

function showClue() {
    resetElements();
    if (!currentGame) {
        // roll and select which game to play - calc from total listed games in data.json
        currentGame = Math.floor(Math.random() * data.games.length);
    }
    // get current roomID from parent ID attribute of player icon
    let roomID = document.getElementsByClassName('playerIcon')[0].parentElement.id;
    activeRoom = roomID;

    // check for required cipher
    if (data.games[currentGame].game[0][roomID][0] == "caesar") {
        // syntax: caesar(string, rotation)
        cipertext.textContent = caesar(data.games[currentGame].game[0][roomID][1], 13);
    } else if (data.games[currentGame].game[0][roomID][0] == "vigenere") {
        // syntax: vigenere.doCrypt(isDecrypt, theKey, theClue)
        cipertext.textContent = vigenere.doCrypt(false, "codenation", data.games[currentGame].game[0][roomID][1]);
    } else if (data.games[currentGame].game[0][roomID][0] == "custom") {
        // accomodation for custom ciphers
        cipertext.textContent = data.games[currentGame].game[0][roomID][2];
    }

    // push clue to clueCache for later recall
    let temp = [currentRoom.id, cipertext.textContent];
    // let temp = {"room": currentRoom.id, "clue": cipertext.textContent};
    clueCache.push(temp);
    
    // show clue box and add close
    overlay.style.display = "flex";
    closebtn.addEventListener("click", () => {
        overlay.style.display = "none";
        correct.style.display = "none";
        incorrect.style.display = "none";
    });

    // add new element to visitedrooms list and display list
    let newRoom = document.createElement('li');
    newRoom.innerText = currentRoom.id;
    roomlist.appendChild(newRoom);

    // add event listener to each li when created, allows user to click each 'room' to revisit a clue
    newRoom.addEventListener("click", (element) => {
        recallClue(element);
    });

    visitedrooms.style.display = "block";
}



movebtn.addEventListener("click", () => {
    if (roomArray.length >= 1) {
        let random = Math.floor(Math.random() * roomArray.length);
        currentRoom = roomArray[random];
        roomArray.splice(random, 1);
        drawPlayer();
        showClue();
    } else {
        outcome.style.display = "flex";
        outcomesubmit.addEventListener("click", () => {
            if (whodoneit.value == data.games[currentGame].game[1].outcome[0].killer && withwhat.value == data.games[currentGame].game[1].outcome[0].weapon && wherewasit.value == data.games[currentGame].game[1].outcome[0].room) {
                overlay.style.display = "flex";
                cipertext.textContent = "You got 'um... Nice job, detective."
                ciphersolution.style.display = "none";
                closebtn.textContent = "Play again";
                closebtn.addEventListener("click", () => {
                    location.reload();
                });
            }
        });
    }
});

cards.addEventListener("click", () => {
    console.log("test");
    board.style.transform = "rotateY(180deg)";
    controls.className = "fade-out";
    controlsright.className = "fade-out";
    board.className = "fade-out";
    setTimeout(function () {
        board.style.display = "none";
        controls.style.display = "none";
        controlsright.style.display = "none";
      }, 800);
    setTimeout(function () {
        boardback.style.display = "block";
        boardback.className = "fade-in";
      }, 400);

});

backclose.addEventListener("click", () => {
    controls.className = "fade-in";
    controlsright.className = "fade-in";
    board.className = "fade-in";
    boardback.className = "fade-out";
    setTimeout(function () {
        board.style.display = "block";
        controls.style.display = "flex";
        controlsright.style.display = "flex";
        board.style.transform = "none";
      }, 300);
    setTimeout(function () {
        boardback.style.display = "none";
      }, 400);

});

// // future Jordan's problem - completely forgot that a window must be first opened with pre-defined dimensions in order for it to be later resized
// resizebtn.addEventListener("click", () => {
//     window.resizeTo(
//         window.screen.availWidth / 2,
//         window.screen.availHeight / 2
//       );
// });