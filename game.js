// save refences to HTML elements
const h3 = $('h3');
const arrowUp = $('#btn-up');
const arrowLeft = $('#btn-left');
const arrowDown = $('#btn-down');
const arrowRight = $('#btn-right');
const repeatPatternBtn = $('#repeat-pattern-btn');

// initialize sounds
const audioUp = new Audio(`/sounds/arrow-up.mp3`);
const audioLeft = new Audio(`/sounds/arrow-left.mp3`);
const audioDown = new Audio(`/sounds/arrow-down.mp3`);
const audioRight = new Audio(`/sounds/arrow-right.mp3`);
const audioError = new Audio(`/sounds/wrong.mp3`);

// game settings
let pattern = [];
let userPositionInPattern = 0;

// function to determine which key was pressed OR clicked
// take in data, return up, left, down, right, undefined
// this uses the "fall-through" technique
function getDirectionFromInput(data) {
  let direction = undefined;
  switch (data) {
    case 38: // 1st "fall through"
    case 'btn-up': {
      direction = 'up';
      break;
    }
    case 37:
    case 'btn-left': {
      direction = 'left';
      break;
    }
    case 40:
    case 'btn-down': {
      direction = 'down';
      break;
    }
    case 39:
    case 'btn-right': {
      direction = 'right';
      break;
    }
    default: {
      console.error(`Idk what this is: ${data}`);
    }
  }
  return direction;
}

// randomly return up, left, down, right
function generateRandomDirection() {
  const number = Math.random();
  let key = 'left';
  if (number <= 0.25) {
    key = 'up';
  }
  if (number > 0.25 && number <= 0.5) {
    key = 'left';
  }
  if (number > 0.5 && number <= 0.75) {
    key = 'down';
  }
  if (number > 0.75) {
    key = 'right';
  }
  return key;
}

function emphasizeKeyPress(direction) {
  switch (direction) {
    case 'up': {
      arrowUp.addClass('pressed');
      audioUp.currentTime = 0;
      audioUp.play();
      setTimeout(() => {
        arrowUp.removeClass('pressed');
      }, 150);
      break;
    }
    case 'left': {
      arrowLeft.addClass('pressed');
      audioLeft.currentTime = 0;
      audioLeft.play();
      setTimeout(() => {
        arrowLeft.removeClass('pressed');
      }, 100);
      break;
    }
    case 'down': {
      arrowDown.addClass('pressed');
      audioDown.currentTime = 0;
      audioDown.play();
      setTimeout(() => {
        arrowDown.removeClass('pressed');
      }, 100);
      break;
    }
    case 'right': {
      arrowRight.addClass('pressed');
      audioRight.currentTime = 0;
      audioRight.play();
      setTimeout(() => {
        arrowRight.removeClass('pressed');
      }, 100);
      break;
    }
  }
}

// accept an array as a paramter
// loop over array, click button depending on array value
// don't register clicks as user input, we're just playing the pattern
function playPattern(array) {
  const interval = 333; // 0.5s
  for (let i = 0; i < array.length; ++i) {
    setTimeout(() => {
      emphasizeKeyPress(array[i]);
    }, (i + 1) * interval);
  }
}

// add random direction to pattern
// reset userInput
function incrementLevel() {
  h3.text(`Level ${pattern.length}`);
  const direction = generateRandomDirection();
  pattern.push(direction);
  patternIndex = 0;
  setTimeout(() => {
    playPattern(pattern);
  }, 500);
}

// compare items from arrays
function isInputCorrect(direction) {
  return direction === pattern[patternIndex];
}

// show game is over, reset patterns to be empty
function showGameOver() {
  audioError.currentTime = 0;
  audioError.play();
  $(document.body).addClass('game-over');
  h3.html(`Game over at level ${pattern.length}!<br/>Select any direction to start over.`);
  pattern = [];
}

function showLevelCompleted() {
  $(document.body).addClass('level-completed');
  setTimeout(() => {
    $(document.body).removeClass('level-completed');
  }, 250);
}

// Main logic of game!!
function registerSelection(direction) {
  // when direction is selected, show btn press on screen
  emphasizeKeyPress(direction);

  // if game not started, start it using this direction as first direction
  // increment level, then return
  if (pattern.length === 0) {
    $(document.body).removeClass('game-over');
    showLevelCompleted();
    pattern = [direction];
    incrementLevel();
    return;
  }

  // if error, end game
  const correct = isInputCorrect(direction);
  if (!correct) {
    showGameOver();
    return;
  }

  // if input is end of pattern, increment level
  if (pattern.length - 1 === patternIndex) {
    showLevelCompleted();
    incrementLevel();
    return;
  }

  // increment patternIndex
  // this keeps track of where in the pattern the user should be
  patternIndex += 1;
}

// listen for clicks on .btn elements
// convert clicked key to up, down, left, right
// register direction input
$('.btn').click(function (e) {
  const htmlId = $(this).attr('id');
  const direction = getDirectionFromInput(htmlId);
  if (direction) {
    registerSelection(direction);
  }
});

// listen for keydown event
// convert keydown key to up, down, left, right
// register direction input
$(document).on('keydown', function (e) {
  const keyId = e.which;
  const direction = getDirectionFromInput(keyId);
  if (direction) {
    registerSelection(direction);
  }
});

// on btn click, replay the pattern
repeatPatternBtn.click(function () {
  playPattern(pattern);
});

// CHALLENGES:
// - open "no-comments.js" and add in your own comments to explain the purpose of function
// - limit "Replay Pattern" button to only 2 uses per game
// - increase pattern playback speed by small amount for each additional level
//    - pattern playback at start of each level gets faster and faster
// - use a cookie, or localStorage to store high-score that persists even when a user refreshes the page
