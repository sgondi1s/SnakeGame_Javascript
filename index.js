const board_border = 'black';
const board_background = "white";
let snake_col = 'lightblue';
const snake_border = 'darkblue';

let snake = [
  {x: 200, y: 200},
  {x: 190, y: 200},
  {x: 180, y: 200},
  {x: 170, y: 200},
  {x: 160, y: 200}
]

let score = 0;
// True if changing direction
let changing_direction = false;
// Horizontal velocity
let food_x;
let food_y;
let dx = 10;
// Vertical velocity
let dy = 0;

let number=1;
// Get the canvas element
const snakeboard = document.getElementById("snakeboard");
// Return a two dimensional drawing context
const snakeboard_ctx = snakeboard.getContext("2d");
// Start game
main();

gen_food();

document.addEventListener("keydown", change_direction);

// main function called repeatedly to keep the game running
function main() {

    if (has_game_ended()) {
        alert("Game Over. click play again to re play");
        setHighScore();
        getHighScore();
        myreplay();
        return;
    }

    changing_direction = false;
    setTimeout(function onTick() {
    clear_board();
    drawFood();
    drawFood();
    move_snake();
    drawSnake();
    // Repeat
    main();
  }, 100)
}

// draw a border around the canvas
function clear_board() {
  //  Select the colour to fill the drawing
  snakeboard_ctx.fillStyle = board_background;
  //  Select the colour for the border of the canvas
  snakeboard_ctx.strokestyle = board_border;
  // Draw a "filled" rectangle to cover the entire canvas
  snakeboard_ctx.fillRect(0, 0, snakeboard.width, snakeboard.height);
  // Draw a "border" around the entire canvas
  snakeboard_ctx.strokeRect(0, 0, snakeboard.width, snakeboard.height);
}

// Draw the snake on the canvas
function drawSnake() {
  // Draw each part
  snake.forEach(drawSnakePart)
}

function drawFood() {
  snakeboard_ctx.fillStyle = 'lightgreen';
  snakeboard_ctx.strokestyle = 'darkgreen';
  snakeboard_ctx.fillRect(food_x, food_y, 10, 10);
  snakeboard_ctx.strokeRect(food_x, food_y, 10, 10);
}

// Draw one snake part
function drawSnakePart(snakePart) {

  // Set the colour of the snake part
  snakeboard_ctx.fillStyle = getSnakeColor();
  // Set the border colour of the snake part
  snakeboard_ctx.strokestyle = snake_border;
  // Draw a "filled" rectangle to represent the snake part at the coordinates
  // the part is located
  snakeboard_ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
  // Draw a border around the snake part
  snakeboard_ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function has_game_ended() {
  for (let i = 4; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true
  }
  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x > snakeboard.width - 10;
  const hitToptWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > snakeboard.height - 10;
  return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall
}

function random_food(min, max) {
  return Math.round((Math.random() * (max-min) + min) / 10) * 10;
}

function gen_food() {
  // Generate a random number the food x-coordinate
  food_x = random_food(0, snakeboard.width - 10);
  // Generate a random number for the food y-coordinate
  food_y = random_food(0, snakeboard.height - 10);
  // if the new food location is where the snake currently is, generate a new food location
  snake.forEach(function has_snake_eaten_food(part) {
    const has_eaten = part.x == food_x && part.y == food_y;
    if (has_eaten) gen_food();
  });
}

function change_direction(event) {
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;
  
// Prevent the snake from reversing

  if (changing_direction) return;
  changing_direction = true;
  const keyPressed = event.keyCode;
  const goingUp = dy === -10;
  const goingDown = dy === 10;
  const goingRight = dx === 10;
  const goingLeft = dx === -10;
  if (keyPressed === LEFT_KEY && !goingRight) {
    dx = -10;
    dy = 0;
  }
  if (keyPressed === UP_KEY && !goingDown) {
    dx = 0;
    dy = -10;
  }
  if (keyPressed === RIGHT_KEY && !goingLeft) {
    dx = 10;
    dy = 0;
  }
  if (keyPressed === DOWN_KEY && !goingUp) {
    dx = 0;
    dy = 10;
  }
}

function move_snake() {
  // Create the new Snake's head
  const head = {x: snake[0].x + dx, y: snake[0].y + dy};
  // Add the new head to the beginning of snake body
  snake.unshift(head);
  const has_eaten_food = snake[0].x === food_x && snake[0].y === food_y;
  if (has_eaten_food) {
    // Increase score
    score += 10;
    // Display score on screen
    document.getElementById('score').innerHTML = score;
    // Generate new food location
    gen_food();
  } else {
    // Remove the last part of snake body
    snake.pop();
  }
}



function setHighScore(){

    var data = JSON.parse(window.localStorage.getItem('albert'));
    let inputVal = document.getElementById("namePlayer").value;
   
    if(data==null){
     var _json = {};
     
     _json["score"] = [{"name":"Amal","score": 0}];
     _json["score"][0]["name"] = inputVal;
     _json["score"][0]["score"] = score;
     window.localStorage.setItem('albert', JSON.stringify(_json));
     console.log(_json);
     console.log('First time');
    }else{
     
     var _newObj = {"name": "Amal", "score" : 0};
     _newObj["score"] = score;
     _newObj["name"] = inputVal;
     data["score"].push(_newObj);
    
     window.localStorage.setItem('albert', JSON.stringify(data));
   
    }
   
   }
   
   function getHighScore(){
     var data = JSON.parse(window.localStorage.getItem('albert'));
     
     console.log(data);
   
    
     
     var tab=`<tr bgcolor="#5D6D7E">
     <td style="padding:2px";> <h3> name <h3/> </td>
     <td style="padding:2px";><h3> score <h3/> </td>
   </tr>`;
     
     if(data!=null){
       console.log(data);
   
       var sc= data.score;
   
       sc.sort(function(a, b){
         return b.score - a.score;
       });
     
     for (let r of data.score) {
   
       
       
          tab += `<tr>
             <td>${r.name} </td>
             <td>${r.score}</td>
   
               </tr>`;
     
     }
             }
     document.getElementById("sam").innerHTML = tab;
   
   
   }
   getHighScore();

   function myreplay() {
    var x = document.getElementById("replay");
    if (x.style.display === "none") {
      x.style.display = "block";
    }
  }
  
  function getSnakeColor()
{
    number +=1;
    //going to make it a correl snake
    //head is black, yellow, black, red, yellow, red
    //take care of the head which is always black
    if (number%2 === 0)
    return "blue";
    //we also know that every odd number is always yellow
    if (number%3 != 0)
    return "yellow";
    //we know every even one is going to be either red or black but it depends on 
    //whether it's a multiple of 4 or 2
    if(number%4 === 0)
    return "violet";

    if (number%5 ===0)
    return "red";


}