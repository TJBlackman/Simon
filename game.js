
const buttonColors = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var started = false;
var level = 1;

// starting the game

$(document).on("keydown", function(){
    if(started == false){
    nextSequence();
    };
    started = true;
});


// checking the answer

function checkAnswer(currentLevel){
    if(gamePattern[currentLevel] === userClickedPattern[currentLevel]){
        console.log("success!");
        if(userClickedPattern.length === gamePattern.length){
            setTimeout(nextSequence, 1000);
        }
    }else{
        playSound("wrong");
        $("body").addClass("game-over");
        setTimeout(function(){
            $("body").removeClass("game-over");
        }, 200);
        $("h1").text("Game Over! Press Any Key to Restart");
        startOver();
    }
}

function nextSequence(){
    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColor = buttonColors[randomNumber];
    userClickedPattern = [];
    gamePattern.push(randomChosenColor);
    $("#" + randomChosenColor).fadeOut(100).fadeIn(100);
    playSound(randomChosenColor);
    $("h1").text(`Level ${level++}`);
}

$(".btn").on("click", function(){
    var userChosenColor = (this.id);
    userClickedPattern.push(userChosenColor);
    playSound(userChosenColor);
    animatePress(userChosenColor);
    checkAnswer(userClickedPattern.length - 1);
})

function playSound(name){
    var audio = new Audio(`sounds/${name}.mp3`);
    audio.play();
}

function animatePress(currentColor){
    $("#" + currentColor).addClass("pressed");
    setTimeout(function(){
        $("#" + currentColor).removeClass("pressed");
    }, 100);
}

function startOver(){
    level = 1;
    gamePattern = [];
    started = false;
}