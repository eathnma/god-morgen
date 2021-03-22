Matter.use('matter-wrap');
    
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

var engine = Engine.create(),
    world = engine.world;

var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false
    }
});

Render.run(render);

var runner = Runner.create();
Runner.run(runner, engine);

var ballA = Bodies.circle(380, 100, 40, 10);
var ballB = Bodies.circle(460, 10, 40, 10);
var ground = Bodies.rectangle(window.innerWidth/2, window.innerHeight+15, window.innerWidth, 30, { isStatic: true });

World.add(world, [ballA, ballB, ground]);

var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });

World.add(world, mouseConstraint);
render.mouse = mouse;

Events.on(mouseConstraint, 'mousedown', function(event) {
    var mousePosition = event.mouse.position; 
    console.log('mousedown at ' + mousePosition.x + ' ' + mousePosition.y);
    var newBall = Bodies.circle(event.mouse.position.x, event.mouse.position.y, 40, 10);
    World.add(world, newBall);
});

var allBodies = Composite.allBodies(world);

    for (var i = 0; i < allBodies.length; i += 1) {
        allBodies[i].plugin.wrap = {
            min: { x: render.bounds.min.x - 100, y: render.bounds.min.y },
            max: { x: render.bounds.max.x + 100, y: render.bounds.max.y }
        };
    }

Engine.run(engine);

    