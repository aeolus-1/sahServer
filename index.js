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

var GameState = require("./Game.js").GameState

var lobbys = {}

function createLobby(id=`${Math.random()}`, clId) {
    var newId = id,
        newLobby = {
            id:newId,
            created:(new Date().getTime()),

            state:new GameState.gameState,

            p1:clId,
            p2:undefined,

            turn:0,
        }

    lobbys[newId] = newLobby
    console.log("created lobby", newId)

    return newLobby

}

function submitMove(lobby, clId, pos) {
    var lobby = lobbys[lobby]
    if (lobby != undefined) {
        if ([lobby.p1,lobby.p2][lobby.turn] == clId && pos != 0 && pos != 7) {
            lobby.turn = GameState.moveTokens(lobby.state, pos, lobby.turn).turn
        }
    }
}

function updateLobbys() {
    var lobbysId = Object.keys(lobbys)
    for (let i = 0; i < lobbysId.length; i++) {
        const id = lobbysId[i],
            lobby = lobbys[id]

        if (
            (new Date().getTime())-lobby.created > (3)*(60)*1000 ||

            (lobby.p1 == undefined && lobby.p2 == undefined)
        
        ) {
            delete lobbys[id]
            console.log("deleted lobby", id)
        }
        
    }
}

setInterval(updateLobbys, 500)


io.on('connection', async(socket) => {

    socket.on('createLobby', (data) => {
        createLobby(data.id, data.clientId)
       


    });
    socket.on('requestAllLobbys', () => {
        socket.emit("allLobbys", lobbys)
       


    });
    socket.on('deleteLobby', (data) => {
        if (lobbys[data.id] != undefined) {

            var lobby = lobbys[data.id]
            if (lobby.p1 == data.clientId) {
                delete lobbys[data.id]
            }
        }
       


    });
    socket.on('requestLobby', (data) => {
        if (lobbys[data.id] != undefined) {

            var lobby = lobbys[data.id]
            lobby.created = (new Date().getTime())
            if (lobby.p1 == data.clientId || lobby.p2 == data.clientId) {
                socket.emit("returnLobby", {state:lobbys[data.id], turn:[lobby.p1,lobby.p2][lobby.turn] == data.clientId, player:(lobby.p1 == data.clientId)?1:2})

            } else {
                if (lobby.p2 == undefined) {
                    lobby.p2 = data.clientId
                    socket.emit("returnLobby", {state:lobbys[data.id], turn:[lobby.p1,lobby.p2][lobby.turn] == data.clientId,  player:(lobby.p1 == data.clientId)?1:2})

                } else {
                    socket.emit("responseCode", {clientId:data.clientId, code:"lobbyFull"})
                }
            }

        } else {
            createLobby(data.id, data.clientId)
        }
       


    });
    socket.on('submitMove', (data) => {
        submitMove(data.lobby, data.clientId, data.pos)
       


    });

    socket.on('leaveLobby', (data) => {
        if (lobbys[data.lobby]) {
            console.log("left", data)
            var lobby = lobbys[data.lobby]
            if (lobby.p1 == data.clientId) {
                lobby.p1 = lobby.p2
                lobby.p2 = undefined
            } else if (lobby.p2 == data.clientId) {
                lobby.p2 = undefined
            }
        }
    })

    

    
    
})


server.listen(process.env.PORT || 3000, () => {
    console.log('listening on *:3000');
})
