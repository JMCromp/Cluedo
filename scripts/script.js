// import ciphers
import { caesar, pigpen } from "./encode.js"
// fetch data from json, store as 'data'
let data;
fetch("../data.json")
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

let pigpentest = document.getElementById("pigpentest");

// initially roll a random between 0-8, number represents starting room - 0 to account for zero-indexing
let startingRandom = Math.floor(Math.random() * 9);
let roomArray = [study, hall, lounge, library, billiardroom, diningroom, conservatory, ballroom, kitchen]
let startingRoom = roomArray[startingRandom];
let currentRoom = startingRoom;
let currentGame;
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
    playerIcon.src = '../images/piece.png';
    playerIcon.style.width = '3vw';
    currentRoom.appendChild(playerIcon);
}

drawPlayer();

function showClue() {
    if (!currentGame) {
        // roll and select which game to play - calc from total listed games in data.json
        currentGame = Math.floor(Math.random() * data.games.length);
    }
    // get current roomID from parent ID attribute of player icon
    let roomID = document.getElementsByClassName('playerIcon')[0].parentElement.id;

    // check for required cipher
    if (data.games[currentGame].game[0][roomID][0] == "caesar") {
        cipertext.textContent = caesar(data.games[currentGame].game[0][roomID][1], 13);
    }
    
    // show clue box and add close
    overlay.style.display = "flex";
    overlay.addEventListener("click", () => {
        overlay.style.display = "none";
    });

    // add new element to visitedrooms list and display list
    let newRoom = document.createElement('li');
    newRoom.innerText = currentRoom.id;
    roomlist.appendChild(newRoom);
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











console.log(caesar("testing", 11))
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
