//*framerate*//
var animate = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(callback) { window.setTimeout(callback, 1000/60) };
 
//*canvas*// 
var canvas = document.createElement('canvas');
var width = 300;
var height = 250;
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');


window.onload = function() {
  document.body.appendChild(canvas);
  animate(step);
};

//*game setup*// 
var step = function() {
  update();
  render();
  animate(step);
};

var update = function() {
};

var render = function() {
  context.fillStyle = "#a5bd7b";
  context.fillRect(0, 0, width, height);
};

//*player*// 
function Paddle(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.x_speed = 0;
  this.y_speed = 0;
}

Paddle.prototype.render = function() {
  context.fillStyle = "#666";
  context.fillRect(this.x, this.y, this.width, this.height);
};


function Player() {
   this.paddle = new Paddle(128, 180, 40, 20);
}


Player.prototype.render = function() {
  this.paddle.render();
};


//*goal*//

function Area(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.x_speed = 0;
  this.y_speed = 0;
}

Area.prototype.render = function() {
  context.fillStyle = "#000";
  context.strokeRect(50,210,200,40);
};

function Goal() {
  this.area = new Area(50, 210, 200, 40);
}

Goal.prototype.render = function() {
  this.area.render();
};


//*ball*// 
function Ball(x, y) {
  this.x = x;
  this.y = y;
  this.x_speed = 2;
  this.y_speed = 4;
  this.radius = 12;
}

Ball.prototype.render = function() {
  context.beginPath();
  context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
  context.fillStyle = "#FF0000";
  context.fill();
};

//*final render*// 
var player = new Player();
var goal = new Goal();
var ball = new Ball(145, 20);

var render = function() {
  context.fillStyle = "#a5bd7b";
  context.fillRect(0, 0, width, height);
  player.render();
  goal.render();
  ball.render();
};

//*animate ball*//
var update = function() {
  ball.update();
};

Ball.prototype.update = function() {
  this.x += this.x_speed;
  this.y += this.y_speed;
};

//* ball impact with player *//

var update = function() {
  ball.update(player.paddle, goal.area);
};

Ball.prototype.update = function(paddle) {
  this.x += this.x_speed;
  this.y += this.y_speed;
  var top_x = this.x - 5;
  var top_y = this.y - 5;
  var bottom_x = this.x + 5;
  var bottom_y = this.y + 5;


 if(this.x - 5 < 0) { // hitting the left wall
    this.x = 5;
    this.x_speed = -this.x_speed;
  } else if(this.x + 5 > 300) { // hitting the right wall
    this.x = 270;
    this.x_speed = -this.x_speed;
  }

  if(this.y < 0 || this.y > 250) { // a point was scored
    this.x_speed = Math.floor(Math.random()*11 - 5);
    this.y_speed = 3;
    this.x = 150;
    this.y = 50;
  }

  if(top_y > 50) {
    if(top_y < (paddle.y + paddle.height) && bottom_y > paddle.y && top_x < (paddle.x + paddle.width) && bottom_x > paddle.x) {
      // hit the player's paddle
      this.y_speed = -2;
      this.x_speed += (paddle.x_speed * 2);
      this.y += this.y_speed;
    }
  } 
};





//* controls: main *//

var keysDown = {};

window.addEventListener("keydown", function(event) {
  keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event) {
  delete keysDown[event.keyCode];
});

//* controls: left-right *//

var update = function() {
  player.update();
  ball.update(player.paddle);
};

Player.prototype.update = function() {
  for(var key in keysDown) {
    var value = Number(key);
    if(value == 37) { // left arrow
      this.paddle.move(-4, 0);
    } else if (value == 39) { // right arrow
      this.paddle.move(4, 0);
    } else {
      this.paddle.move(0, 0);
    }
  }
};

//* controls: speed *//

Paddle.prototype.move = function(x, y) {
  this.x += x;
  this.y += y;
  this.x_speed = x;
  this.y_speed = y;
  if(this.x < 0) { // left
    this.x = 0;
    this.x_speed = 0;
  } else if (this.x + this.width > 300) { // right
    this.x = 300 - this.width;
    this.x_speed = 0;
  }
}


