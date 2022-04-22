console.log("js runs");

var canvas = document.getElementById("canvas");
canvas.setAttribute("height", window.innerHeight);
canvas.setAttribute("width", window.innerWidth);
var c = canvas.getContext("2d");
var centerY = canvas.getAttribute("height") / 2;
var centerX = canvas.getAttribute("width") / 2;


class Ripple {
    constructor(x, y, rad) {
        this.x = x;
        this.y = y;
        this.rad = rad;

        // color values
        this.r = 153;
        this.g = 221;
        this.b = 255;
        this.a = 1;
    }

    update() {
        //create gradient
        this.gradient = c.createRadialGradient(this.x, this.y, this.rad, this.x, this.y, this.rad-this.rad/8);

        this.gradient.addColorStop(0, `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`); //edge
        this.gradient.addColorStop(0.9, `rgba(102, 204, 255, 0)`); //center

        //set style
        c.fillStyle = this.gradient;
        c.lineWidth = 1;

        //draw
        c.beginPath();
        c.arc(this.x, this.y, this.rad, 0, Math.PI*2);
        c.fill();

        //update values

        this.rad += 10;

        this.a = this.a > 0 ? this.a - 0.03 : 0;
        
    }
}


// list where ripple objects get pushed. update() method gets called on each index during animation loop
var updateList = [];

// random ripples
var interval = setInterval(() => {
    let randomPosition = (max) => {
        return Math.floor(Math.random() * (max + 1) );
    }
    updateList.push(new Ripple(randomPosition(window.innerWidth), randomPosition(window.innerHeight), 1));
}, 200);



// add listener while mouse1 is held
document.addEventListener("mousedown", (e) => {
    updateList.push(new Ripple(e.pageX, e.pageY, 1));
    document.addEventListener("mousemove", listenMove)
})

// add ripples when mouse moves
// needs named function to be removable
var lastRipple = 0; // initial value
function listenMove(e) {
    // delay to make indivitual waves more visible + lag reduction
    if (Date.now() - lastRipple > 40) { 
        updateList.push(new Ripple(e.pageX, e.pageY, 1));
        lastRipple = Date.now();
    }
}

// stop making ripples by removing listener
document.addEventListener("mouseup", (e) => {
    document.removeEventListener("mousemove", listenMove);
})


function draw() {

    //start drawing
    c.beginPath();

    //clear previous frame
    c.clearRect(0, 0, window.innerWidth, window.innerHeight);

    //background
    c.fillStyle = "rgb(102, 204, 255)";
    c.fillRect(0, 0, window.innerWidth, window.innerHeight);

    //make changes visible
    c.stroke();

    //update objects
    updateList.forEach(element => {
        element.update();
    });

    // remove when not visible
    if (updateList.length > 0 && updateList[0].a <= 0) {
        updateList.shift();
    }

    window.requestAnimationFrame(draw);
}

window.requestAnimationFrame(draw);
