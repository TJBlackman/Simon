const h3 = $('h3');
const arrowUp = $('#btn-up');
const arrowLeft = $('#btn-left');
const arrowDown = $('#btn-down');
const arrowRight = $('#btn-right');
const repeatPatternBtn = $('#repeat-pattern-btn');

const audioUp = new Audio(`/sounds/arrow-up.mp3`);
const audioLeft = new Audio(`/sounds/arrow-left.mp3`);
const audioDown = new Audio(`/sounds/arrow-down.mp3`);
const audioRight = new Audio(`/sounds/arrow-right.mp3`);
const audioError = new Audio(`/sounds/wrong.mp3`);

let pattern = [];
let userPositionInPattern = 0;

function getDirectionFromInput(data) {
  let direction = undefined;
  switch (data) {
    case 38:
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

function playPattern(array) {
  const interval = 333;
  for (let i = 0; i < array.length; ++i) {
    setTimeout(() => {
      emphasizeKeyPress(array[i]);
    }, (i + 1) * interval);
  }
}

function incrementLevel() {
  h3.text(`Level ${pattern.length}`);
  const direction = generateRandomDirection();
  pattern.push(direction);
  patternIndex = 0;
  setTimeout(() => {
    playPattern(pattern);
  }, 500);
}

function isInputCorrect(direction) {
  return direction === pattern[patternIndex];
}

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

function registerSelection(direction) {
  emphasizeKeyPress(direction);

  if (pattern.length === 0) {
    $(document.body).removeClass('game-over');
    showLevelCompleted();
    pattern = [direction];
    incrementLevel();
    return;
  }

  const correct = isInputCorrect(direction);
  if (!correct) {
    showGameOver();
    return;
  }

  if (pattern.length - 1 === patternIndex) {
    showLevelCompleted();
    incrementLevel();
    return;
  }

  patternIndex += 1;
}

$('.btn').click(function (e) {
  const htmlId = $(this).attr('id');
  const direction = getDirectionFromInput(htmlId);
  if (direction) {
    registerSelection(direction);
  }
});

$(document).on('keydown', function (e) {
  const keyId = e.which;
  const direction = getDirectionFromInput(keyId);
  if (direction) {
    registerSelection(direction);
  }
});

repeatPatternBtn.click(function () {
  playPattern(pattern);
});
