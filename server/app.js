import express from "express";
import { Server } from "socket.io";
import { createServer } from 'http';
import cors from 'cors';


const port = 3000;

const app = express();

const server = createServer(app);


const io = new Server(server, {                               // io is a circuit
    cors: {
        // origin:"*"                      // passing all origin
        origin: "http://localhost:5173",                      // passing all origin
        methods: ["GET", "POST"],
        credentials: true,
    }

});


// it is work as middleware  // used for api
app.use(cors({

    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
})
);

app.get('/', (req, res) => {
    res.send("hello")
})


//we can use io as middleware 
// const user = false   // if usr is not loged in connection will not establish
// io.use((socket,next)=>{                   // we have to arg socket(user), next-> to execute next command or not
//    if (user) next();
// })



io.on("connection", (socket) => {
    console.log("User Connected");
    console.log("Id ", socket.id);
    //to msg itself
    socket.emit("welcome", `welcome to the server , ${socket.id}`);  // here welcome is event name and welcome tp the server is message

    // send corresponding msg
    // socket.broadcast.emit("welcome",`welcome to the server , ${socket.id}`);  // here welcome is event name and welcome tp the server is message



    //message event
    socket.on("message", ({ message, room }) => {    // yha se hm handle krenge ki data kese show krna h
        console.log({ message, room });
        // io.emit("receive-message",data);        // this will send data to whole circuit
        // socket.broadcast.emit("receive-message",data);        // this will send data to whole except itself

        socket.to(room).emit("receive-message", message);        // this will send data to room members 

    })


    socket.on("join-room", (roomname) => {

        socket.join(roomname);
        console.log(`user joined ${roomname}`)
    })

    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);           //trigger when window is closed or 
    })
})

server.listen(port, () => {
    console.log(`server is running on port ${port}`);
})