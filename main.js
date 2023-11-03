const c = document.getElementById("canvas");
const ctx = c.getContext("2d");

const width = 1920;
const height = 1080;

var dt = 0;
var frameRate = 165;
var frameInterval = 1000/frameRate;
var now;
var elapsed;
var drawType = 1;
var then = Date.now();
var mouseX, mouseY;

class Vertex {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class Triangle {
    constructor(v1, v2, v3, color) {
        this.v1 = v1;
        this.v2 = v2;
        this.v3 = v3;
        this.color = color;
    }
}

class Matrix3 {
    constructor(values) {
        this.values = values;
    }

    multiply (other) {
        let result = [0,0,0,0,0,0,0,0,0];

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                for (let i = 0; i < 3; i++) {
                    // console.log(this.values);
                    // console.log(other.values);
                    //console.log("result["+(result[row * 3 + col])+"] += this.values["+(this.values[row * 3 + i])+"] * other.values["+(other.values[i * 3 + col])+"];")
                    result[row * 3 + col] += this.values[row * 3 + i] * other.values[i * 3 + col];
                }
            }
        }
        
        // console.log(result);
        return result;
    }

    transform(_in) {
        return new Vertex(
            _in.x * this.values[0] + _in.y * this.values[3] + _in.z * this.values[6],
            _in.x * this.values[1] + _in.y * this.values[4] + _in.z * this.values[7],
            _in.x * this.values[2] + _in.y * this.values[5] + _in.z * this.values[8]);
    }
}

class Scene {
    constructor() {
        this.tris = [];

        this.deez = {
            x: 0,
            y: 0,
        }
        this.generatedZbuffer = this.generateZbuffer();
        
        // this.tris.push(
        //     new Triangle(
        //         new Vertex(100, 100, 100),
        //         new Vertex(-100, -100, 100),
        //         new Vertex(-100, 100, -100),
        //         "white"));
        
        // this.tris.push(
        //     new Triangle(
        //         new Vertex(100, 100, 100),
        //         new Vertex(-100, -100, 100),
        //         new Vertex(100, -100, -100),
        //         "red"));
        
        // this.tris.push(
        //     new Triangle(
        //         new Vertex(-100, 100, -100),
        //         new Vertex(100, -100, -100),
        //         new Vertex(100, 100, 100),
        //         "lime"));
        
        // this.tris.push(
        //     new Triangle(
        //         new Vertex(-100, 100, -100),
        //         new Vertex(100, -100, -100),
        //         new Vertex(-100, -100, 100),
        //         "blue"));
        
        
        this.tris.push(
            new Triangle(
                new Vertex(-100, 100, 100),
                new Vertex(100, -100, 100),
                new Vertex(-100, -100, 100),
                "blue"));
        this.tris.push(
            new Triangle(
                new Vertex(-100, 100, 100),
                new Vertex(100, -100, 100),
                new Vertex(100, 100, 100),
                "blue"));
        
        this.tris.push(
            new Triangle(
                new Vertex(-100, 100, -100),
                new Vertex(100, -100, -100),
                new Vertex(-100, -100, -100),
                "red"));
        this.tris.push(
            new Triangle(
                new Vertex(-100, 100, -100),
                new Vertex(100, -100, -100),
                new Vertex(100, 100, -100),
                "red"));
        
        this.tris.push(
            new Triangle(
                new Vertex(100, 100, -100),
                new Vertex(100, 100, 100),
                new Vertex(100, -100, -100),
                "lime"));
        this.tris.push(
            new Triangle(
                new Vertex(100, -100, 100),
                new Vertex(100, 100, 100),
                new Vertex(100, -100, -100),
                "lime"));
        this.tris.push(
            new Triangle(
                new Vertex(-100, 100, -100),
                new Vertex(-100, 100, 100),
                new Vertex(-100, -100, -100),
                "yellow"));
        this.tris.push(
            new Triangle(
                new Vertex(-100, -100, 100),
                new Vertex(-100, 100, 100),
                new Vertex(-100, -100, -100),
                "yellow"));
        this.tris.push(
            new Triangle(
                new Vertex(100, 100, -100),
                new Vertex(100, 100, 100),
                new Vertex(-100, 100, -100),
                "magenta"));
        this.tris.push(
            new Triangle(
                new Vertex(-100, 100, 100),
                new Vertex(100, 100, 100),
                new Vertex(-100, 100, -100),
                "magenta"));
        
        this.tris.push(
            new Triangle(
                new Vertex(100, -100, -100),
                new Vertex(100, -100, 100),
                new Vertex(-100, -100, -100),
                "cyan"));
        this.tris.push(
            new Triangle(
                new Vertex(-100, -100, 100),
                new Vertex(100, -100, 100),
                new Vertex(-100, -100, -100),
                "cyan"));
        
    }

    generateZbuffer() {
        let buff =  [];
        for (let i = 0; i < (c.width*c.height); i++) {
            buff[i] = -Infinity;
        }
        return buff;
    }

    render() {

        this.deez.x += 0.05*dt;
        this.deez.y += 0.050*dt;
        // this.deez.y = 90;

        let heading = toRadians(this.deez.x);
        let headingTransform = new Matrix3([
            Math.cos(heading), 0, -Math.sin(heading),
            0, 1, 0,
            Math.sin(heading), 0, Math.cos(heading)
        ]);
        
        let pitch = toRadians(this.deez.y);
        let pitchTransform = new Matrix3([1, 0, 0,
            0, Math.cos(pitch), Math.sin(pitch),
            0, -Math.sin(pitch), Math.cos(pitch)
        ])

        let transform = new Matrix3(headingTransform.multiply(pitchTransform));
        // console.log(headingTransform.multiply(pitchTransform));
        

        // let zBuffer = this.generateZbuffer();
        // let zBuffer = this.generateZbuffer();
        
        let drawOrder = [];

        this.tris.forEach(t => {
            let v1 = transform.transform(t.v1);
            let v2 = transform.transform(t.v2);
            let v3 = transform.transform(t.v3);
            v1.x += c.width / 2;
            v1.y += c.height / 2;
            v2.x += c.width / 2;
            v2.y += c.height / 2;
            v3.x += c.width / 2;
            v3.y += c.height / 2;

            // let minX = Math.max(0, Math.ceil(Math.min(v1.x, Math.min(v2.x, v3.x))));
            // let maxX = Math.min(c.width - 1, Math.floor(Math.max(v1.x, Math.max(v2.x, v3.x))));
            // let minY = Math.max(0, Math.ceil(Math.min(v1.y, Math.min(v2.y, v3.y))));
            // let maxY = Math.min(c.height - 1, Math.floor(Math.max(v1.y, Math.max(v2.y, v3.y))));
            

            // for (let y = minY; y <= maxY; y++) {
            //     for (let x = minX; x <= maxX; x++) {
            //         let p = new Vertex(x,y,0);
            //         let V1 = sameSide(v1,v2,v3,p);
            //         let V2 = sameSide(v2,v3,v1,p);
            //         let V3 = sameSide(v3,v1,v2,p);

            //         if (V3 && V2 && V1) {
            //             let depth = v1.z + v2.z + v3.z;
            //             let zIndex = y * c.width + x;
            //             if (zBuffer[zIndex] < depth) {
            //                 ctx.fillStyle = t.color;
            //                 ctx.fillRect(x, y, 1, 1);
            //                 zBuffer[zIndex] = depth;
            //             }
            //         }
            //     }
            // }

            let depth = v1.z + v2.z + v3.z;
            drawOrder.push({d: depth, t: t});

        });

        drawOrder.sort(compare);

        drawOrder.forEach(o => {
            let t = o.t;
            let v1 = transform.transform(t.v1);
            let v2 = transform.transform(t.v2);
            let v3 = transform.transform(t.v3);
            v1.x += c.width / 2;
            v1.y += c.height / 2;
            v2.x += c.width / 2;
            v2.y += c.height / 2;
            v3.x += c.width / 2;
            v3.y += c.height / 2;
            
            switch (drawType) {
                case 2:
                    ctx.beginPath();
            ctx.moveTo(v1.x, v1.y);
            ctx.lineTo(v2.x, v2.y);
            ctx.lineTo(v3.x, v3.y);
            ctx.closePath();
                    ctx.strokeStyle = "white";
                    ctx.stroke();
                    break;
                case 1:
                    ctx.beginPath();
            ctx.moveTo(v1.x, v1.y);
            ctx.lineTo(v2.x, v2.y);
            ctx.lineTo(v3.x, v3.y);
            ctx.closePath();
                    ctx.strokeStyle = t.color;
                    ctx.fillStyle = t.color;
                    ctx.stroke();
                    ctx.fill();
                    break;
                case 3:
                    ctx.fillStyle = t.color;
                    ctx.beginPath();
                    ctx.ellipse(v1.x, v1.y, 5, 5, 0, 0, 2*Math.PI);
                    ctx.ellipse(v2.x, v2.y, 5, 5, 0, 0, 2*Math.PI);
                    ctx.fill();
                    
                    ctx.beginPath();
                    ctx.ellipse(v3.x, v3.y, 5, 5, 0, 0, 2*Math.PI);
                    ctx.fill();
                    break;
            }
        });
    }
}

function compare(a, b) {
    if (a.d < b.d) {
        return -1;
    }
    if (a.d > b.d) {
        return 1
    }
    return 0;
}

function sameSide(A, B, C, p){
    let V1V2 = new Vertex(B.x - A.x,B.y - A.y,B.z - A.z);
    let V1V3 = new Vertex(C.x - A.x,C.y - A.y,C.z - A.z);
    let V1P = new Vertex(p.x - A.x,p.y - A.y,p.z - A.z);

    let V1V2CrossV1V3 = V1V2.x * V1V3.y - V1V3.x * V1V2.y;
    let V1V2CrossP = V1V2.x * V1P.y - V1P.x * V1V2.y;

    return V1V2CrossV1V3 * V1V2CrossP >= 0;
}

function setup() {
    testScene = new Scene();

    ctx.imageSmoothingEnabled = false;
    resizeWindow();
    main();
}

function main() {
    frameInterval = 1000/frameRate;
    requestAnimationFrame(main);
    
    now = Date.now();
    elapsed = now - then;
    dt = elapsed;
    
    if (elapsed > frameInterval) {
        then = now - (elapsed % frameInterval);
        draw();
    }
}

function draw() {
    // clear canvas
    ctx.clearRect(0,0,c.width,c.height);

    //main background
    // ctx.fillStyle = "black";
    // ctx.fillRect(0,0,c.width,c.height);

    testScene.render();

    ctx.fillStyle = "white";
    ctx.font = "50px Arial";
    ctx.textAlign = "left";
    ctx.fillText("FPS: " + Math.floor(1000/dt), 50, 50);
}

function resizeWindow() {
    var offset = 0;
    c.style.left = 0;
    offset = (window.innerWidth - c.clientWidth) / 2;
    c.style.left = offset + "px";
}

//event listener for window resizing
window.onresize = resizeWindow; 

window.onmousemove = function(e) {
    e = e || window.event;
    
    var canvasRect = canvas.getBoundingClientRect()
    var scaleX = canvas.width / canvasRect.width;   
    var scaleY = canvas.height / canvasRect.height; 
    
    mouseX = Math.abs((e.clientX - canvasRect.left) * scaleX);
    mouseY = Math.abs((e.clientY - canvasRect.top) * scaleY);    

    let xi = 180/c.width;
    let yi = 180/c.height;

    mouseX = mouseX*xi;
    mouseY = mouseY*yi;
    // mouseX = -((c.width/2)-mouseX)*xi;
    // mouseY = ((c.height/2)-mouseY)*yi;

    // console.log(mouseX, mouseY);
}

window.onclick = function() {
    drawType++;
    if (drawType >=4) drawType = 1;
}

function toRadians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

setup();