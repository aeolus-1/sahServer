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



var gsocket;

io.on('connection', async(socket) => {
    gsocket = socket
    socket.on('requestPing', () => {
        socket.emit("returnPing", {yes:true})
       


    });
    socket.on('submitArmy', (data) => {

        var armyOb = JSON.parse(data.army)

        if (avalibleArmys[data.turn] == undefined) avalibleArmys[data.turn] = {}
        
        avalibleArmys[data.turn][data.id] = {
           string:armyOb,
           timeStamp:(new Date().getTime())
        }


    }); 
    socket.on('getList', (army) => {
        console.log(avalibleArmys)
        socket.emit("returningList", {a:avalibleArmys})
 
 
    });
    

    
    
    
    
})

function testForOld() {
    var turns = Object.keys(avalibleArmys)
    for (let i = 0; i < turns.length; i++) {
        const turn = avalibleArmys[turns[i]];
        var currentArmys = Object.keys(turn)
        for (let j = 0; j < currentArmys.length; j+=1) {
            var ob = avalibleArmys[turns[i]][currentArmys[j]]
            console.log(Math.abs((new Date().getTime())-ob.timeStamp))
            if (Math.abs((new Date().getTime())-ob.timeStamp)>(60/1000)) {
                delete avalibleArmys[turns[i]][currentArmys[j]]
            }
            
        }

    }
}

setInterval(() => {
    testForOld()
}, 100);


server.listen(process.env.PORT || 3000, () => {
    console.log('listening on *:3000');
})