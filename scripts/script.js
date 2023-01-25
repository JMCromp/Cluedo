// import ciphers
import { caesar, pigpen } from "./encode.js"
// fetch data from json, store as 'data'
let data;
fetch("data.json")
    .then(response => {
        return response.json();
    })
    .then(temp => data = temp);

// element references
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
    playerIcon.src = './images/piece.png';
    playerIcon.style.width = '3vw';
    currentRoom.appendChild(playerIcon);
}

drawPlayer();

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
    console.log(clueCache);
    console.log(solvedClues);
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
        cipertext.textContent = caesar(data.games[currentGame].game[0][roomID][1], 13);
        // push clue to clueCache for later recall
        let temp = [currentRoom.id, cipertext.textContent];
        // let temp = {"room": currentRoom.id, "clue": cipertext.textContent};
        clueCache.push(temp);
    }
    
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
        alert("no more moves");
    }
})











// console.log(caesar("testing", 11))
pigpentest.addEventListener("click", () => {
    pigpen();
})


// study.addEventListener("click", () => {
//     alert("i dont surf");
// })

// hall.addEventListener("click", () => {
//     alert("i dont surf");
// })

// lounge.addEventListener("click", () => {
//     alert("i dont surf");
// })

// library.addEventListener("click", () => {
//     alert("i dont surf");
// })

// cards.addEventListener("click", () => {
//     alert("i dont surf");
// })

// diningroom.addEventListener("click", () => {
//     alert("i dont surf");
// })

// billiardroom.addEventListener("click", () => {
//     alert("i dont surf");
// })

// conservatory.addEventListener("click", () => {
//     alert("i dont surf");
// })

// ballroom.addEventListener("click", () => {
//     alert("i dont surf");
// })

// kitchen.addEventListener("click", () => {
//     alert("i dont surf");
// })
