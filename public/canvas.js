

let canvas= document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pencilColorCont = document.querySelectorAll(".pencil-color");
let pencilWidthCont = document.querySelector(".pencil-width");
let eraserWidthCont = document.querySelector(".eraser-width");
let download = document.querySelector(".download");

let redo = document.querySelector(".redo");
let undo = document.querySelector(".undo");

let pencilColor = "red";
let eraseColor ="white";
let pencilWidth = pencilWidthCont.value;
let eraserWidth = eraserWidthCont.value;

let undoRedoTracker = [];
let track=0;

let mouseDown = false;

let tool = canvas.getContext("2d"); // Tool through which graphics are going to be  used.

tool.strokeStyle=pencilColor; // to change the color
tool.lineWidth =pencilWidth;


/* tool.beginPath(); // defines new path;
tool.moveTo(10,10);//start point 
tool.lineTo(100,150);//end point 
tool.stroke();// to fill the color (by default = black)
 */

// mousedown -> start new path , movemove -> path fill

canvas.addEventListener("mousedown",(e) => {
        mouseDown = true;
       /*  beginPath({
            x: e.clientX,
            y: e.clientY
        }) */

        let data = {
            x: e.clientX,
            y: e.clientY 
        }
        socket.emit("beginPath", data);
})
canvas.addEventListener("mousemove",(e) => {
    if(mouseDown){
        let data ={
            x: e.clientX,
            y: e.clientY,
            color : eraserFlag? eraseColor : pencilColor,
            width : eraserFlag? eraserWidth : pencilWidth
        }
        socket.emit("drawStroke", data);
    }
    
})
canvas.addEventListener("mouseup",(e) => {
    mouseDown = false;

    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    track = undoRedoTracker.length-1;
})

undo.addEventListener("click",(e) => {
    if(track>0){
        track--;
    }

    let data ={
        trackValue : track,
        undoRedoTracker
    }
    //undoRedoCanvas(trackObj);
    socket.emit("redoUndo",data);
})

redo.addEventListener("click",(e) => {
    if(track< undoRedoTracker.length-1){
        track++;
    }
    let data ={
        trackValue : track,
        undoRedoTracker
    }
   // undoRedoCanvas(trackObj);
   socket.emit("redoUndo",data);
})

function undoRedoCanvas(trackObj){
    track = trackObj.trackValue;
    undoRedoTracker = trackObj.undoRedoTracker;

    let url = undoRedoTracker[track];
    let img = new Image();
    img.src = url;
    img.onload=(e)=>{
        tool.drawImage(img,0,0, canvas.width, canvas.height);
    }
}

function beginPath(strokeObj){
    tool.beginPath();
    tool.moveTo(strokeObj.x, strokeObj.y);
}
function drawStroke(strokeObj){
    tool.strokeStyle = strokeObj.color
    tool.lineWidth = strokeObj.width;
    tool.lineTo(strokeObj.x, strokeObj.y);
    tool.stroke();
}

pencilColorCont.forEach((colorElem)=>{
    //console.log(colorElem);
    colorElem.addEventListener("click",(e) => {
        let color = colorElem.classList[0];
       // console.log(color);
        pencilColor = color;
        tool.strokeStyle = pencilColor;
    })
})

pencilWidthCont.addEventListener("change",(e) => {
    pencilWidth = pencilWidthCont.value;
    tool.lineWidth = pencilWidth;
})

eraserWidthCont.addEventListener("change",(e) => {
    eraserWidth = eraserWidthCont.value;
    tool.lineWidth = eraserWidth;
})

eraser.addEventListener("click",(e) => {
    if(eraserFlag){
        tool.strokeStyle = eraseColor;
        tool.lineWidth = eraserWidth;
    }else{
        tool.strokeStyle = pencilColor;
        tool.lineWidth = pencilWidth;
    }
})

download.addEventListener("click",(e) => {
    let url = canvas.toDataURL();

    let a  = document.createElement("a");
    a.href = url;
    a.download = "board.jpg";
    a.click();
})

socket.on("beginPath",(data) => {
    beginPath(data);
})

socket.on("drawStroke",(data) => {
    drawStroke(data);
})