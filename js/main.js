/*Javascript*/
/* The game object which controls the game*/
var canvas = document.getElementById("container");
var context = canvas.getContext("2d");
console.log(canvas.height+" "+canvas.width);
var score_canvas = document.getElementById("score");
var score_context = score_canvas.getContext("2d");
var started = false;
//the game object which stores certain values and defines 
game = {
  
  score: 0, //score
  fps: 40, //speed
  over: false, //game over
  message: null, //message
/* start game function*/
  start: function() {
    game.over = false;
    game.message = null;
    started = true;
    game.score = 0;
    game.fps = 8;
    snake.init();
    food.set();
  },
/* stop game function*/  
  stop: function() {
    game.over = true;
    if(started)
    {
    game.message = "Gameover";
    alert(game.message);
    }
},
 /* a function which draws a square of length size centered at x, y*/
  drawBox: function(x, y, size, color) {
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(x - (size/2), y - (size/2));
    context.lineTo(x + (size/ 2), y - (size / 2));
    context.lineTo(x + (size/ 2), y + (size / 2));
    context.lineTo(x - (size/ 2), y + (size / 2));
    context.closePath();
    context.fill();
  },
  /* The draw score function deals with rendering score*/
  drawScore: function() {
    score_context.fillStyle = 'blue';
    score_context.font = '20px Impact, sans-serif';
    score_context.textAlign = 'center';
    score_context.clearRect(0,0,  score_canvas.width, score_canvas.height) 
    score_context.fillText("Score: "+game.score, score_canvas.width/2, score_canvas.height*.9); 
},
/* A function which resets the canvas*/
  resetCanvas: function() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
  
};
/* snake object */
snake = { 
  size: canvas.height/32,
  x: null,
  y: null,
  color: '#1E90FF',
  direction: 'left',
  positions: [],
  /*the snake object constructor which creates a snake of given size*/
  init: function() {
    snake.positions = [];
    snake.direction = 'left';
    snake.x = canvas.width / 2 + snake.size / 2;
    snake.y = canvas.height /2 + snake.size / 2;
    /*inserting 4 values into coordinates into the snake*/
    for (i = snake.x + (4 * snake.size); i >= snake.x; i-=snake.size) {
      snake.positions.push(i + ',' + snake.y); 
    }
    console.log(snake.size);
  },
  //the move function which moves depending on the snake's present direction*/
  move: function() {
// move depending on the cirrent direction 
    switch(snake.direction) {
      case 'up':
        snake.y-=snake.size;
        break;
      case 'down':
        snake.y+=snake.size;
        break;
      case 'left':
        snake.x-=snake.size;
        break;
      case 'right':
        snake.x+=snake.size;
        break;
    }
// check for collision
    snake.checkCollision();
// check for collision
    snake.grow();
    snake.positions.push(snake.x + ',' + snake.y);
  },
  //draw the snake
  draw: function() {
    for (i = 0; i < snake.positions.length; i++) {
	if(i==snake.positions.length-1)
	      snake.drawSection(snake.positions[i].split(','), "blue");
	else
	      snake.drawSection(snake.positions[i].split(','), snake.color);
   }    
  },
  // draws each section of snake 
  drawSection: function(section, color) {
    context.fillStyle = color;
    context.beginPath();
    var x = section[0];
    var y = section[1];
    var size = snake.size;
    context.rect(x- size/2,y -size/2,size,size);
    context.fill();
    context.strokeStyle = 'black';
    context.stroke();
//    game.drawBox(parseInt(section[0]), parseInt(section[1]), snake.size, snake.color);
  },
  
  checkCollision: function() {
    if (snake.isCollision(snake.x, snake.y) === true) {
      game.stop();
    }
  },
  
  isCollision: function(x, y) {
    if (x < snake.size/2 ||
        x > canvas.width ||
        y < snake.size/2 ||
        y > canvas.height ||
        snake.positions.indexOf(x+','+y) >= 0) {
      return true;
    }
  },
  
  grow: function() {
    if (Math.abs(snake.x -food.x)<= snake.size/2 && Math.abs(snake.y-food.y)<=snake.size/2) {
	     game.score++;
      if (game.score % 5 == 0) {
        game.fps+=2;
      }
      food.set();
    } else {
      snake.positions.shift();
    }
  }
  
};
// food object
food = {
  
  size: null,
  x: null,
  y: null,
  color: "#87CEFA",
  
  set: function() {
    food.size = snake.size;
    food.x = Math.floor(Math.random() * (401));
    food.y = Math.floor(Math.random() * (401));
    console.log(food.x+" "+food.y);
  },
  draw: function() {
    game.drawBox(food.x, food.y, food.size, food.color);
  }
};
inverseDirection = {
  'up':'down',
  'left':'right',
  'right':'left',
  'down':'up'
};

keys = {
  up: [87],
  down: [83],
  left: [65],
  right: [68],
  start_game: [13, 32]
};
Object.prototype.getKey = function(value){
  for(var key in this){
    if(this[key] instanceof Array && this[key].indexOf(value) >= 0){
      return key;
    }
  }
  return null;
};

addEventListener("keydown", function (e) {
    lastKey = keys.getKey(e.keyCode);
    if (['up', 'down', 'left', 'right'].indexOf(lastKey) >=0  && lastKey != inverseDirection[snake.direction])
      snake.direction = lastKey;
    else if (['start_game'].indexOf(lastKey) >= 0 && game.over)
      game.start();
    console.log(e.keyCode);
}, false);

/* Game Loop*/
var requestAnimationFrame =  window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame;

function loop() {
  if (game.over == false) {
    game.resetCanvas();
    game.drawScore();
    snake.move();
    food.draw();
    snake.draw();
  }
  setTimeout(function() {
    requestAnimationFrame(loop);
  }, 1000 / game.fps);
};

requestAnimationFrame(loop);
