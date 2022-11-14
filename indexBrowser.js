var avalibleArmys = {}


function findAndMatchingEnemys() {
    var turns = Object.keys(avalibleArmys)
    for (let i = 0; i < turns.length; i++) {
        const turn = avalibleArmys[turns[i]];
        var currentArmys = Object.keys(turn)
        for (let j = 0; j < currentArmys.length; j+=2) {
            if (avalibleArmys[turns[i]][currentArmys[j]]!=undefined&&avalibleArmys[turns[i]][currentArmys[j+1]]!=undefined) {
                console.log(currentArmys[j], currentArmys[j+1])
                
                delete avalibleArmys[turns[i]][currentArmys[j]]
                delete avalibleArmys[turns[i]][currentArmys[j+1]]
                break
            }
            
        }

    }
}

for (let i = 0; i < 50; i++) {
    var turn = Math.floor(Math.random()*5),
        id = self.crypto.randomUUID()
    if (avalibleArmys[turn] == undefined) avalibleArmys[turn] = {}
        
    avalibleArmys[turn][id] = {
       string:"armyOb"+Math.random(),
       timeStamp:(new Date().getTime())
    }
}