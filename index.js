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

    function findAndMatchingEnemys() {
        var turns = Object.keys(avalibleArmys)
        for (let i = 0; i < turns.length; i++) {
            const turn = avalibleArmys[turns[i]];
            var currentArmys = Object.keys(turn)
            for (let i = 0; i < currentArmys.length; i+=2) {
                if (currentArmys[i]!=undefined&&currentArmys[i+1]!=undefined) {
                    console.log(currentArmys[i], currentArmys[i+1])
                    socket.emit("returnArmy", {
                        for:currentArmys[i],
                        army:avalibleArmys[currentArmys[i+1]],
                    })
                    socket.emit("returnArmy", {
                        for:currentArmys[i+1],
                        army:avalibleArmys[currentArmys[i]],
                    })
                    delete avalibleArmys[currentArmys[i]]
                    delete avalibleArmys[currentArmys[i+1]]
                    break
                }
                
            }
    
        }
    }
    setInterval(() => {
        findAndMatchingEnemys()
    }, 100);
    
})




server.listen(process.env.PORT || 3000, () => {
    console.log('listening on *:3000');
})