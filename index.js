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


function findAndMatchingEnemys() {

}

io.on('connection', async(socket) => {
    socket.on('requestPing', () => {
        socket.emit("returnPing", {yes:true})
       


    });
    socket.on('submitArmy', (data) => {

        var armyOb = JSON.parse(data.army)

        if (avalibleArmys[data.turn] == undefined) avalibleArmys[data.turn] = {}
        
        avalibleArmys[data.turn][army.id] = {
           string:armyOb,
           timeStamp:(new Date().getTime())
        }


    });
    
    socket.on('getList', (army) => {
        console.log(avalibleArmys)
        socket.emit("returningList", avalibleArmys)
 
 
    });

    
    
    
})


server.listen(process.env.PORT || 3000, () => {
    console.log('listening on *:3000');
})