window.onload = function(){
        init();
        window.addEventListener('resize', init, false);
    }
    
    var context;
    var canvas;
    var myWidth;
    var myHeight;
    
        
    var numBalls = 12;
    var spring = 0.05;
    var gravity = 0.03;
    var friction = -0.9;
    const balls = [];
    
    var index = 0;
    
    function init(){
        canvas = document.getElementById("myCanvas");
        context = canvas.getContext("2d");
        myWidth = window.innerWidth;
        myHeight = window.innerHeight;
        context.canvas.width = myWidth;
        context.canvas.height = myHeight;
        
        while(balls.length < numBalls) {
            let ball = new Ball(getRandomInt(0, myWidth), getRandomInt(0, myHeight), getRandomInt(30, 70), index, balls);
            balls.push(ball);
            index++;
        }
        
        console.log(balls.length);
//        for (let i = 0; i < numBalls; i++){
//            var randomX = getRandomInt(0, myWidth) + (i*10);
//            var randomY = getRandomInt(0, myHeight);
//            var randomSize = getRandomInt(30, 70);
//            
//            balls[i] = new Ball(randomX, randomY, randomSize, i, balls);
//            
//            console.log(balls[i]);
//            console.log("randomX: " + randomX);
//        }
    }
    
//    var x; 
//    var y;
//    var diameter;
//    var id;
//    var others;
    
    class Ball {
        x;
        y;
        diameter;
        id;
        others;
        vx;
        vy;
    
    
        constructor(xin, yin, din, idin, oin){
            this.x = xin;
            this.y = yin;
            this.diameter = din;
            this.id = idin;
            this.others = oin;
            console.log("x:  " + this.x);
            this.vx = 0;
            this.vy = 0;
        }
        
        collide(){
            for (let i = this.id + 1; i < numBalls; i++){
                let dx = this.others[i].x - this.x;
                let dy = this.others[i].y - this.y;
                let distance = Math.sqrt(dx*dx + dy*dy);
                let minDist = this.others[i].diameter/2 + this.diameter/2;
                
                if (distance < minDist) {
                    let angle = Math.atan2(dy,dx);
                    let targetX = this.x + Math.cos(angle) * minDist;
                    let targetY = this.y + Math.sin(angle) * minDist;
                    let ax = (targetX - this.others[i].x) * spring;
                    let ay = (targetY - this.others[i].y) * spring;
                    this.vx -= ax;
                    this.vy -= ay;
                    this.others[i].vx += ax;
                    this.others[i].vy += ay;
                }
            }
        }
        
        move(){
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
        
        display(){
            context.beginPath();
            context.arc(this.x, this.y, this.diameter, 0, Math.PI*2);
            context.fillStyle = "#0095DD";
            context.fill();
            context.closePath();
        }
        
        setPos(xin, yin){
            this.x = xin;
            this.y = yin;
        }
        
        setSize(num){
            this.diameter += num;
        }
    }
    
    function getRandomInt(min, max){
        return Math.floor(Math.random() * (max - min)) + min;
    }
    
    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < balls.length; i++){
            let ball = balls[i];
            ball.collide();
            ball.move();
            ball.display();
        }
        
//        balls.forEach(display());
    }
    
    function addBall(xin, yin){
        let ball = new Ball(xin, yin, getRandomInt(30, 70), index, balls);
        balls.push(ball);
    }
    
    setInterval(draw, 10);
