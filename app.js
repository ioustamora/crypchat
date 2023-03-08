let lotion = require('lotion')

let app = lotion({
    initialState: {
        msgs: {}
    },
    logTendermint: false,
})

app.use(function(state, tx) {
    let msg = JSON.parse(tx.nonce)
    let newMsg = {}
    newMsg[Date.now()] = {
        privKeyHex: msg.privKeyHex,
        encryptedMsg: msg.encryptedMsg,
        decryptedMsg: msg.decryptedMsg
    }
    if(msg.command === "add") {
        state.msgs[msg.pubKeyHex] = newMsg
    }

    if(msg.command === "delete") {
        console.log("delete command")
    }

})


app.start().then(function(appInfo) {
    console.log(`app started. gci: ${appInfo.GCI}`)
})