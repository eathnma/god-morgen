paper.install(window);
paper.setup('myCanvas');

var person = prompt("Please enter your name", "Harry Potter");

var context;
var canvas;
var myWidth;
var myHeight;

var numBalls = 12;
var spring = 0.05;
var gravity = 0.98;
var friction = -0.4;
const balls = [];
const maxSize = 100;
var index = 0;
var cursorSize = 30;

window.onload = function(){
    init();
    window.addEventListener('resize', init, false);
}

function Color(red,green,blue) {
    this.red = red;
    this.green = green;
    this.blue = blue;
}

var blue = 'rgb(88, 168, 253)';
var green = 'rgb(32, 190, 114)';
var indigo = 'rgb(90, 96, 254)';
var mustard = 'rgb(248, 188, 72)';
var orange = 'rgb(248, 84, 48)';
var plum = 'rgb(143, 23, 97)';

var colors = [blue, green, indigo, mustard, orange, plum];

const cursor = document.querySelector(".cursor");


//const inactive = 0;
//const recording = 1;
//const listening = 2;
//var state = inactive;
//
//switch(state) {
//    case recording:
//        document.getElementByID("message").innerHTML = "Recording...";
//        break;
//    case listening:
//        document.getElementByID("message").innerHTML = "Listening to";
//        break;
//    case inactive:
//        if (person != null) document.getElementById("message").innerHTML = "Good morning, " + person;
//}
//
//console.log("state:" + state);

//if (state == recording) {
//    document.getElementByID("message").innerHTML = "Recording..."; 
//} else if (state == listening) {
//    document.getElementByID("message").innerHTML = "Listening to";
//} else if (state == inactive) {
//    if (person != null) document.getElementById("message").innerHTML = "Good morning, " + person;
//}


function mouseMove(event) {
//    console.log("mouse:" + event.point);
    mouseX = event.x;
    mouseY = event.y;
//    console.log("mouseX:" + event.point.x);
    for (let i = 0; i < balls.length; i++){
//        let currBall = balls[i];
        if (balls[i].checkHover() == true){
            console.log("HIT");
            document.querySelector("canvas").style.background = "blue";
        } else if (balls[i].checkHover() == false) {
            document.querySelector("canvas").style.background = "white";
        }
    }
    
    
    cursor.style.top = (event.pageY - cursorSize) + "px";
    cursor.style.left = (event.pageX - cursorSize)+ "px";
    cursor.style.width = cursorSize;
    cursor.style.height = cursorSize;

}


function init(){
    canvas = document.getElementById("myCanvas");
    context = canvas.getContext("2d");
    myWidth = window.innerWidth;
    myHeight = window.innerHeight;
    context.canvas.width = myWidth;
    context.canvas.height = myHeight;
        
    while(balls.length < numBalls) {
        let ball = new Ball(getRandomInt(0, myWidth), getRandomInt(0, myHeight), getRandomInt(30, 70), balls);
        balls.push(ball);
    }
    
    console.log(balls.length);
    
//    window.requestAnimationFrame(gameLoop);
}

//if (person != null) document.getElementById("message").innerHTML = "Good morning, " + person;


var mousedownID = 0;
var newBall;
var mouseX;
var mouseY;

var hoverID = 0;

function mousedown(event) {
//        state = recording;
    newBall = new Ball(event.x, event.y, cursorSize, balls);
    balls.push(newBall);

    if (mousedownID == 0) {
        mousedownID = setInterval(createBall, 30);
    }
}

function mouseup(event) {
    if (mousedownID != 0) {
        clearInterval(mousedownID);
//        state = inactive;
        mousedownID = 0;
        newBall.setDrag(false);
    }
    
    counter = 0;
}

var counter = 0;

function createBall(){
    newBall.setSize(1);
    newBall.setPos(mouseX, mouseY); 
    newBall.setDrag(true);
    counter++;
    console.log("counter: " + counter);
}

document.addEventListener("mousedown", mousedown);
document.addEventListener("mouseup", mouseup);
document.addEventListener("mouseout", mouseup);
document.addEventListener("mousemove", mouseMove);

class Ball {
    x;
    y;
    diameter;
    others;
    vx;
    vy;
    randomColor;
    drag;
//    path = new Path.Circle(new Point(this.x, this.y), this.diameter);
    
    constructor(xin, yin, din, oin){
        this.x = xin;
        this.y = yin;
        this.diameter = din;
        this.others = oin;
        console.log("x:  " + this.x);
        this.vx = 0;
        this.vy = 0;
        this.randomColor = colors[Math.floor(Math.random() * colors.length)];
//        this.path.fillColor = this.randomColor;
        this.drag = false;
    }
        
    collide(){
        if (this.drag == false) {
            for (let i = 0; i < balls.length; i++){
                let dx = this.others[i].x - this.x;
                let dy = this.others[i].y - this.y;
                let distance = Math.sqrt(dx*dx + dy*dy);
                let minDist = this.others[i].diameter + this.diameter;
                if (distance < minDist) {
                    let angle = Math.atan2(dy,dx);
                    let targetX = this.x + Math.cos(angle) * minDist;
                    let targetY = this.y + Math.sin(angle) * minDist;
                    let ax = (targetX - this.others[i].x);
                    let ay = (targetY - this.others[i].y);
                    this.vx -= ax;
                    this.vy -= ay;
                    this.others[i].vx += ax;
                    this.others[i].vy += ay;
                }
            }
        }
    }
        
    move(){
        if (this.drag == false) {
            this.vy += gravity;
            this.x += this.vx;
            this.y += this.vy;
            if (this.x + this.diameter/2 > myWidth) {
                this.x = myWidth - this.diameter/2;
                this.vx *= friction;
            } else if (this.x - this.diameter/2 < 0) {
                this.x = this.diameter/2;
                this.vx *= friction;
            }

            if (this.y + this.diameter/2 > myHeight) {
                this.y = myHeight - this.diameter/2;
                this.vy *= friction;
            } else if (this.y - this.diameter/2 < 0) {
                this.y = this.diameter/2;
                this.vy *= friction;
            }
        }
    }
        
    display(){
        context.beginPath();
        context.arc(this.x, this.y, this.diameter, 0, Math.PI*2);
        context.fillStyle = this.randomColor;
        context.fill();
        context.closePath();
    }
    
    checkHover(){
        if (mouseX > this.x - this.diameter && mouseX < this.x + this.diameter && mouseY > this.y - this.diameter && mouseY < this.y + this.diameter) {
            document.querySelector("canvas").style.background = "blue";
//            return true;
        } else {
             document.querySelector("canvas").style.background = "white";
//            return false;
        }
    }
        
    
    setDrag(bool){
        this.drag = bool;
    }
    
    setPos(xin, yin){
        this.x = xin;
        this.y = yin;
    }
        
    setSize(num){
        if (this.diameter < maxSize) this.diameter += num;
    }
    
    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }
}
    
function getRandomInt(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
}

function tick() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < balls.length; i++){
        let ball = balls[i];
        ball.collide();
        ball.move();
        ball.display();
        
        if (mouseX > ball.x - ball.diameter && mouseX < ball.x + ball.diameter && mouseY > ball.y - ball.diameter && mouseY < ball.y + ball.diameter) {
            document.querySelector("canvas").style.background = "blue"; 
        } else {
             document.querySelector("canvas").style.background = "white";
        }
        
    if (person != null)     document.getElementById("message").innerHTML = "Good morning, " + person;
    }
}



 
function addBall(xin, yin){
    let ball = new Ball(xin, yin, getRandomInt(30, 70), index, balls);
    balls.push(ball);
}

view.onFrame = function(event){
    tick();
    console.log("onFrame");
}