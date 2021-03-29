var person = prompt("Please enter your name", "Harry Potter");

//colors -------------------------------------------------

var blue = "rgb(88, 168, 253)";
var green = "rgb(32, 190, 114)";
var indigo = "rgb(90, 96, 254)";
var mustard = "rgb(248, 188, 72)";
var orange = "rgb(248, 84, 48)";
var plum = "rgb(143, 23, 97)";

var colors = [blue, green, indigo, mustard, orange, plum];

this.randomColor = colors[Math.floor(Math.random() * colors.length)];

//setting up matter.js  ---------------------------------

Matter.use("matter-wrap");

var Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Common = Matter.Common,
  Composite = Matter.Composite,
  Composites = Matter.Composites,
  MouseConstraint = Matter.MouseConstraint,
  Mouse = Matter.Mouse,
  Events = Matter.Events,
  World = Matter.World,
  Bodies = Matter.Bodies;

//create engine
var engine = Engine.create(),
  world = engine.world;

//create renderer
var render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
    wireframes: false,
    background: "white",
  },
});

Render.run(render);

//create runner
var runner = Runner.create();
Runner.run(runner, engine);

//add ground
var ground = Bodies.rectangle(
  window.innerWidth / 2,
  window.innerHeight + 15,
  window.innerWidth,
  30,
  {isStatic: true}
);

World.add(world, [ground]);

var allBodies = Matter.Composite.allBodies(world);

//add mouse control
var mouse = Mouse.create(render.canvas),
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false,
      },
    },
  });

World.add(world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;

var newBall;
var mouseDownID = 0;
var lastSize = 40; //size of most recently added ball
const maxSize = 300;
const minSize = 10;

Events.on(mouseConstraint, "mousedown", function (event) {
  mouseDownID = 1;

  //START AUDIO
  console.log("now recording");

  if (!foundBall)
    newBall = Bodies.circle(
      event.mouse.position.x,
      event.mouse.position.y,
      40,
      {
        render: {
          fillStyle: colors[Math.floor(Math.random() * colors.length)],
        },
      }
    );
  World.add(world, newBall);
  //    Matter.Composite.add(allBodies, newBall);
});

Events.on(mouseConstraint, "mouseup", function (event) {
  mouseDownID = 0;
  lastSize = 40;
});

//add ball on click  ---------------------------------

var counter = 0;
var inflateFactor = 1.01;
var deflateFactor = 0.999;

Events.on(engine, "beforeUpdate", function (event) {
  console.log("counter " + counter);
  lastSize *= inflateFactor;
  if (mouseDownID == 1 && lastSize < maxSize && !foundBall) {
    Matter.Body.scale(newBall, inflateFactor, inflateFactor);
    document.getElementById("message").innerHTML = "Recording...";
  } else if (listeningID == 1) {
    counter += 1;
    Matter.Body.scale(foundBall, deflateFactor, deflateFactor);

    document.getElementById("message").innerHTML = "Listening...";
  } else if (listeningID == 0) {
    counter = 0;

    if (person != null)
      document.getElementById("message").innerHTML = "Good morning, " + person;
  }

  console.log("listeningID" + listeningID);
});

//wrap bodies ---------------------------------------

for (var i = 0; i < allBodies.length; i += 1) {
  allBodies[i].plugin.wrap = {
    min: {x: render.bounds.min.x - 100, y: render.bounds.min.y},
    max: {x: render.bounds.max.x + 100, y: render.bounds.max.y},
  };
}

var foundBall;
var listeningID = 0;

//check hover ---------------------------------
Matter.Events.on(mouseConstraint, "mousemove", function (event) {
  var bodies = Matter.Composite.allBodies(world);
  //For Matter.Query.point pass "array of bodies" and "mouse position"
  var foundPhysics = Matter.Query.point(bodies, event.mouse.position);

  //Your custom code here
  console.log("found: " + foundPhysics[0]); //returns a shape corrisponding to the mouse position
  console.log(allBodies.length);

  foundBall = foundPhysics[0];

  if (foundBall && mouseDownID == 1) {
    listeningID = 1;
  } else {
    listeningID = 0;
  }
});

//run rengine
Engine.run(engine);
