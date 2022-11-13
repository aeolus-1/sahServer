const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const io = require("socket.io")(server, {
    cors: {
        origin: "*"
    }
});

app.get('/', (req, res) => {
    res.send('server');
});

var avalibleArmys = {}


io.on('connection', async(socket) => {
    socket.on('requestPing', () => {
        socket.emit("returnPing", {yes:true})
       


    });
    socket.on('submitArmy', (army) => {
        
       console.log(army)


    });
    socket.on('getArmy', (army) => {
        
 
 
     });

    
    
    
})


server.listen(process.env.PORT || 3000, () => {
    console.log('listening on *:3000');
})