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


var awaitingCollection = {}

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
        socket.emit("returningList", avalibleArmys)
 
 
    });
    socket.on('request', (id) => {
        socket.emit("returningArmyRequest", awaitingCollection[id.id])
 
 
    });

    
    
    setInterval(() => {
        findAndMatchingEnemys()
    }, 100);
    
})

function findAndMatchingEnemys() {
    var turns = Object.keys(avalibleArmys)
    for (let i = 0; i < turns.length; i++) {
        const turn = avalibleArmys[turns[i]];
        var currentArmys = Object.keys(turn)
        for (let j = 0; j < currentArmys.length; j+=2) {
            if (avalibleArmys[turns[i]][currentArmys[j]]!=undefined&&avalibleArmys[turns[i]][currentArmys[j+1]]!=undefined) {
                awaitingCollection[currentArmys[j]] = {
                    for:currentArmys[j],
                    army:avalibleArmys[turns[i]][currentArmys[j]],
                }
                awaitingCollection[currentArmys[j+1]] = {
                    for:currentArmys[j+1],
                    army:avalibleArmys[turns[i]][currentArmys[j+1]],
                }
                
                delete avalibleArmys[turns[i]][currentArmys[j]]
                delete avalibleArmys[turns[i]][currentArmys[j+1]]
                break
            }
            
        }

    }
}



server.listen(process.env.PORT || 3000, () => {
    console.log('listening on *:3000');
})