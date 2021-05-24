/*
    Data and machine learning for artistic practice

    07/05/21

    Final Project

    For the final project of this module, I created an interactive web app using the handpose library. My initial inspiration came from the Theremin; I calculated the distance from the user’s fingertips to their palm, using this data to trigger sound files that correspond with each finger movement. The samples are taken from the Brian Eno album ‘Music for Airports’. 

    I also created a reactive visual element to the piece, inspired by the Spanish artist Felipe Pantone. The textures applied to the shapes were created using the Hydra Synth shader library. 
    
    
    Instructions

    Ensure that your hand is facing directly at the webcam

    The sound files play all at once when the users hand is outstretched. To play one note at a time, make a fist and then slowly raise each finger.

    
    References

    https://github.com/danbz/art-and-code/tree/master/openFrameworks/music-for-homemade-airports
    https://teddavis.org/p5live/
    https://www.felipepantone.com/
    https://www.youtube.com/watch?v=H81Tdrmz2LA&t=1511s&ab_channel=TheCodingTrain
    https://learn.ml5js.org/#/reference/handpose
*/
  


//load hydra synth library
let libs = ['https://unpkg.com/hydra-synth', 'includes/libs/hydra-synth.js'];


//initialise first hydra texture
const c = document.createElement('canvas');
c.width = window.innerWidth;
c.height = window.innerHeight;

let hydra0 = new Hydra({
    detectAudio: false,
    canvas: c
})

let pg; //store hydra texture

//create hydra synth effects
osc(4, 0.4, 1).rotate(0.8).out()


//initialise second hydra texture
const d = document.createElement('canvas');
d.width = window.innerWidth;
d.height = window.innerHeight;

let hydra1 = new Hydra({
    detectAudio: false,
    canvas: d
})

let dg; // store hydra texture

//create hydra synth effects
osc(50, .1, .1).rotate(400).pixelate(100, 100).out()


//create array for sound files
let eno = [];


//create variable for drawing webcam feed
let video;


//create variable for handpose
let handpose;


//initialise handpose array
let predictions = [];


//define variables for drawing shape
let w = 10;
let maxD;
let iter;
let angle = 0;


//create variables for the tips of each finger
let base, thumb, index, middle, ring, pinky;


//create distance functions
let thumbDist, indexDist, middleDist, ringDist, pinkyDist;


//create deque arrays for smoothing data
let thumbDeque = [];
let indexDeque = [];
let middleDeque = [];
let ringDeque = [];
let pinkyDeque = [];


//define sample amount for smoothing
let AVERAGE_SAMPLES = 80;


function preload(){
    
    for(let i = 0; i < 5; i++){
        eno[i] = loadSound('Choir/Eno-Choir-' + i + '.mp3');
        
        //dont play sound file until the current state has finished playing      
        eno[i].playMode('untilDone');    
    }
}


function setup() {
    
    //initialise canvas at width of screen
    createCanvas(windowWidth, windowHeight, WEBGL);
    
    
    //initialise hydra textures
    pg = createGraphics(300, 300);
    dg = createGraphics(300, 300);
    
    
    //hide mouse cursor
    noCursor();
    
    //define video element
    video = createCapture(VIDEO);
    video.size(width, height);

    
    //hide the video element, and just show the canvas
    video.hide();

    
    //load handpose library
    handpose = ml5.handpose(video, modelReady);

    
    //this sets up an event that fills the global variable "predictions"
    //with an array every time new hand poses are detected
    handpose.on("predict", results => {
        predictions = results;
    });
}

function modelReady() {
    
    //print to console when handpose is ready
    console.log("Model ready!");
}

function draw() {
    
    //call functions for calculating handpose & playing sound files
    calculate();
    sound();

    
    //grab + apply hydra texture
    pg.clear();
    pg.drawingContext.drawImage(c, 0, 0, pg.width, pg.height);

    
    //grab + apply hydra texture
    dg.clear();
    dg.drawingContext.drawImage(d, 0, 0, dg.width, dg.height);

    
    //apply first hydra texture
    texture(dg);
    noStroke();
    
    
    //draw sphere at height of screen
    sphere(height);

    
    //define rotation of shape
    //rotateY(radians(frameCount / 1.5));
    rotateX(-QUARTER_PI);

    
    //apply second hydra texture
    texture(pg);

    
    //combine distance measurements to iterate shape
    iter = (thumbDist+indexDist+middleDist+ringDist+pinkyDist);
    
    
    //map iter variable to determine amount of displacement
    maxD = map(iter, 0, 5, 0, 200);

    
    //create for loops to draw grid of cubes
    for (let z = 0; z < width/4; z += w){
        for (let x = 0; x < height/2; x += w){
            push();
            let d = dist(x, z, width/4, height/4);
            
            //map distance and displacement variables between -2 and 2
            let offset = map(d, 0, maxD, -2, 2);
            
            //add offset to angle variable to displace sin 
            let a = angle + offset;
            
            //map sin to affect height of cubes
            let h = map(sin(a), -1, 1, 10, 300);
            
            //translate to center of screen
            translate(x - width/8, 0, z - height/4);
            
            //minus 5 to add space in between each cube
            box(w-3, h, w-3);
            pop();
        }
    }
    
    //update angle every frame
    angle += 0.02;
}







