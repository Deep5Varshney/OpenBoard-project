const express = require("express");
const cors = require("cors"); // Import cors
const http = require("http"); // Import http module
const socket = require("socket.io");

const app = express();
app.use(cors({ origin: 'http://192.168.1.104:5500' }));
app.use(express.static("public"));
let port = process.env.PORT || 5000;
let server = http.createServer(app); // Create an HTTP server
 server.listen(port, ()=>{
    console.log("listening on port" + port);
})

let io = socket(server)(server, {
    cors: {
        origin: "*",
    }
});
io.on("connection", (socket)=>{
    console.log("made socket connection");

    socket.on("beginPath",(data)=>{
        io.sockets.emit("beginPath",data);
    })

    socket.on("drawStroke", (data)=>{
        io.sockets.emit("drawStroke", data);
    })

    socket.on("redoUndo", (data)=>{
        io.sockets.emit("redoUndo", data);
    })
})