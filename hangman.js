
//global variable
let tryLeft = 6;
let secretWord;
const charGuessWord = [];
const memKeyPressed = [];

//startup event
function onloadFunc() {
   generateKeypad();
}

//Print message function
function printMsgTop(msg) {
   msgTop.innerHTML = msg;
}

//Display try left
 function dsplyTryLeft(idTry) {
   if (idTry >= 0)
      tryLeft = idTry;
   if (idTry == -1)
      if (tryLeft > 0)
         --tryLeft;        
   tryNb.innerHTML = tryLeft;
 }
//Activate buttons
function activateButtons(enWordInp, enEdit, enStop, enCont, enRst, enNew, enShow) {
   document.getElementById("wordSecret").style.display = enWordInp; 
   document.getElementById("btnEdit").style.display = enEdit;
   document.getElementById("btnStop").style.display = enStop;
   document.getElementById("btnCont").style.display = enCont;  
   document.getElementById("btnReset").style.display = enRst;   
   document.getElementById("btnShow").style.display = enShow;
   document.getElementById("btnNew").style.display = enNew;    
}

//Edit secret Word
function evBtnSecretWord() {  
   let inputWord = document.getElementById('wordSecret').value.trim();
   secretWord = inputWord.toUpperCase().trim();
   let lenWord = secretWord.length
   if (lenWord == 0) 
      printMsgTop("Enter a word please!");
    else if (lenWord < 3) 
      printMsgTop( "Enter a word of at least 3 letters!");
   if (lenWord > 20) 
      printMsgTop("Enter a word of maxim 20 letters !");
   onlyLetters=true;
   lenWord=secretWord.length;
   //Check if all the characters of a string are letters 
   for (let i = 0; i < lenWord; i++)
      if (secretWord[i] < 'A' || secretWord[i] > 'Z') {
         onlyLetters=false;
         break;
      }
   if (!onlyLetters && lenWord  >0)
      printMsgTop(  "Only letters are allowed!");
   if (lenWord >= 3 && lenWord <= 20 && onlyLetters) { 
      activateButtons("none", "none", "inline", "none", "none", "none", "none");   
      printMsgTop(" Game in progress..");
      keypadDisable(false, 0);
      fillCharWithBlanc();
      addCharToGuessWord(secretWord[0]);
      addCharToGuessWord(secretWord[secretWord.length - 1]);
   }
}

//Button to stop game 
function evBtnStopGame() {
   activateButtons("none", "none", "none", "inline", "inline", "inline", "inline");     
   keypadDisable(true, -1); //keep mem pressed
   printMsgTop(" Game stopped , choose an option :- Continue / Restart from begin / New game / Show the word and leave game ");
}

//Button to continue game with the same secret word
function evBtnContinueGame() {
   keypadDisable(false, -1); //restore mem pressed
   activateButtons("none", "none", "inline", "none", "none", "none", "none");
   document.getElementById("msgTop").innerHTML=" Game in progress..";
}

//Button to show secret word and escape game 
function evBtnShowSecretWord() {
   fillCharToGuessWord();
   FillDraw(true);
   dsplyTryLeft(0);
   activateButtons("none", "none", "none", "none", "none", "inline", "none");   
   printMsgTop(" Game escaped !");  
   keypadDisable(true, 0);
}

//New secret word ,new game
function evBtnNewGame() {
   activateButtons("inline", "inline", "none", "none", "none", "none", "none"); 
   printMsgTop( " Enter the secret word !");  
   document.getElementById('wordSecret').value = "";
   secretWord = "_";
   charGuessWord.length = 0;
   addCharToGuessWord();
   dsplyTryLeft(6);
   FillDraw(false);
   keypadDisable(true, 0);   
   document.getElementById("msgFin").innerHTML=""; 
}

//Restart the game with the same word
function evBtnRestartGame() {
   dsplyTryLeft(6);
   FillDraw(false);
   fillCharWithBlanc();
   addCharToGuessWord(secretWord[0]);
   addCharToGuessWord(secretWord[secretWord.length - 1]);
   keypadDisable(false, 0);
   printMsgTop(" Game in progress..");
   activateButtons("none", "none", "inline", "none", "none", "none", "none") ; 
}

//Add a char to guess word if it match the secret word
function addCharToGuessWord(ch) {
   let lengthSecretWord = secretWord.length;
   for (let i = 0; i < lengthSecretWord; ++i) {
      if (secretWord[i] === ch) {
         charGuessWord[i] = ch;   
      }
   }
   wordGuess.innerHTML = charGuessWord.join(' ');
}

//Fill the guess word with the secret word letters remained and escape game
function fillCharToGuessWord() {
   let lengthSecretWord = secretWord.length; 
   for (let i = 0; i < lengthSecretWord ; ++i) {
      if (secretWord[i] != charGuessWord[i]) {
         charGuessWord[i] = secretWord[i].toLowerCase();
      }
   }
   wordGuess.innerHTML = charGuessWord.join(' ');
}

//Fill the guess word with "_"
function fillCharWithBlanc() {
   let lengthSecretWord = secretWord.length; 
   for (let i = 0; i < lengthSecretWord ; ++i) {
         charGuessWord[i] = '_';
      }
}

//generate keypad letter buttons
function generateKeypad() {
  document.getElementById("keypadDiv").style.display ="block";
   for (let i = 0; i < 26; ++i) {
      let createButton = document.createElement("button");
      createButton.innerHTML = String.fromCharCode(65+i);// keyboard[i];
      createButton.setAttribute("id" ,String.fromCharCode(65 + i));// keyboard[i]);
      createButton.setAttribute("class", "keyStyle");
      keypadBtn.appendChild(createButton);
      memKeyPressed[0];
      createButton.onclick = function pushLetterCall() {
      pushLetterKey(i);
     } 
   }
   keypadDisable(true,0);
}

//Function to analyse a letter pushed on keypad
function pushLetterKey(i) {
   let keyboardChar=String.fromCharCode(65+i);
   document.getElementById(keyboardChar).disabled = true;
   document.getElementById(keyboardChar).style.backgroundColor="gray";
   let leng = charGuessWord.length - 1;
   let gameWon = false;
    let findLetter = false;
   for (let j = 1; j <= leng; ++j) {
      if (keyboardChar === secretWord[j]) {      
         findLetter = true;
      }
   }
   if (findLetter === true) {
      addCharToGuessWord(keyboardChar);
   }
   if (findLetter === false) {
      dsplyTryLeft(-1);
      const drawingPiece = document.getElementsByClassName('menParts');
      drawingPiece[6 - tryLeft -1].style.display = 'block';   
   } 
   gameEndAnalyse();   
}

//Final message Win/Lose
function printMsgFinal(msgId) { // 1: win  -1:lose  0:init
   if (msgId == -1) {
     document.getElementById("msgFin").innerHTML = "+++ Loser +++ ";
     document.getElementById("msgFin").style.backgroundColor = "red";
   }
   if (msgId == 1) {
    document.getElementById("msgFin").innerHTML = ">>>  Winner <<<";
    document.getElementById("msgFin").style.backgroundColor = "green";
   }
}
//Game over analyse
function gameEndAnalyse() {
  let gameOver = ! charGuessWord.includes("_");
   if (tryLeft == 0) { 
         printMsgTop("+++Loser+++ ");
         printMsgFinal(-1);
         activateButtons("none", "none", "none", "none" , "inline", "inline", "inline")
     
   } else if (gameOver) {
         printMsgTop(">>> Winner<<<");
         printMsgFinal(1);
         activateButtons("none", "none", "none", "none", "none", "inline", "none")      
   }
   if (gameOver || tryLeft == 0) {
         keypadDisable(true, 0);
   }
}

// Enable or disable the keypad. Initialize the key pressed memory 
function keypadDisable(disable,memKeyInit) { 
   for (let i = 0; i <= 25; ++i) {
      let keyboardChar=String.fromCharCode(65 + i);
      document.getElementById(keyboardChar).disabled = disable;
      if (memKeyInit >= 0)
         document.getElementById(keyboardChar).style.backgroundColor="green";
      if (memKeyInit == 0)
         memKeyPressed[i]=0;
   }
}

//Fill the drawing of hangman with the full or empty men components
function FillDraw(action) {
   const drawingPiece = document.getElementsByClassName('menParts');  
   for (let i = 0; i <= 5; ++i) {
      if (action == true)
         drawingPiece[i].style.display = 'block';
      else
         drawingPiece[i].style.display = 'none';
   }
}

function setFontGuessWord(lenWord) {
   if (lenWord <= 10)
      document.getElementById("wordGuessDiv").style.fontSize = "30px"; 
   else if (lenWord <= 15)
      document.getElementById("wordGuessDiv").style.fontSize = "25px";
   else     
      document.getElementById("wordGuessDiv").style.fontSize = "15px";
}
