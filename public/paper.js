paper.install(window);
paper.setup('myCanvas');

var person = prompt("Please enter your name", "Harry Potter");

var spring = 0.05;
var gravity = 0.98;
var friction = -0.4;
const maxSize = 100;
var index = 0;
var cursorSize = 30;

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

view.onMouseMove = function(event) {
    mouseX = event.x;
    mouseY = event.y;
//    
//    cursor.style.top = (event.pageY - cursorSize) + "px";
//    cursor.style.left = (event.pageX - cursorSize)+ "px";
        
    cursor.style.top = event.x;
    cursor.style.left = event.y;
    cursor.style.width = cursorSize;
    cursor.style.height = cursorSize;
    console.log("hello");
}

var mousedownID = 0;
var newBall;
var mouseX;
var mouseY;

var hoverID = 0;

view.onMouseDown = function(event) {
    newBall = new Ball(event.x, event.y, cursorSize, balls);
    balls.push(newBall);

    if (mousedownID == 0) {
        mousedownID = setInterval(createBall, 30);
    }
}

view.onMouseUp = function(event) {
    if (mousedownID != 0) {
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

//var circle = new Path.Circle(new Point(0, 0), 100);
//circle.fillColor = 'black';

function Ball(r, p, v){
    this.radius = r;
    this.point = p;
    this.vector = v;
    this.path = new paper.Path.Circle(this.point, this.radius);
    this.path.fillColor = 'black';

//    this.path.fillColor = colors[Math.floor(Math.random() * colors.length)];
}

Ball.prototype = {
    
    iterate: function() {
        this.checkBorders();
        this.point += this.vector;
//        console.log("point:" + this.point);
    },
    
    checkBorders: function() {
        var size = view.size;
        if (this.point.x < -this.radius)
            this.vector.x *= -1;
        if (this.point.x > size.width + this.radius)
            this.vector.x *= -1;
        if (this.point.y < -this.radius)
            this.vector.y *= -1;
        if (this.point.y > size.height + this.radius)
            this.vector.y *= -1;
    },
    
    react: function(b) {
//        var dist = this.point.getDistance(b.point);
//        if (dist < this.radius + b.radius && dist != 0)
//            var overlap = this.radius + b.radius - dist;
//            var direc = (this.point - b.point).normalize(overlap * 0.015);
//            this.vector += direc;
//            b.vector -= direc;
    }

}

var balls = [];
var numBalls = 12;

for (var i = 0; i < numBalls; i++) {
	var position = new Point(view.size.width, view.size.height) * Point.random();
    console.log("position: " + position);
//	var vector = new Point({
//		angle: 360 * Math.random(),
//		length: Math.random() * 10
//	});
    
    var vector = new Point(5, 5);
	var radius = Math.random() * 60 + 60;
	balls.push(new Ball(radius, position, vector));
}

console.log("width" + view.size.width);
console.log("height" + view.size.height);

view.onFrame = function(event) {
    console.log(event.count);
	for (var i = 0; i < balls.length - 1; i++) {
		for (var j = i + 1; j < balls.length; j++) {
			balls[i].react(balls[j]);
		}
	}
    
	for (var i = 0, l = balls.length; i < l; i++) {
		balls[i].iterate();
//        console.log("test" + i);
	}
}

paper.view.draw()