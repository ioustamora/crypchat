let lotion = require('lotion')

let app = lotion({
    initialState: {
        msgs: {}
    },
    logTendermint: false,
})

app.use(function(state, tx) {
    let msg = JSON.parse(tx.nonce)
    state.msgs[msg.pubKeyHex] = {}
    state.msgs[msg.pubKeyHex][Date.now()] = {
        privKeyHex: msg.privKeyHex,
        encryptedMsg: msg.encryptedMsg,
        decryptedMsg: msg.decryptedMsg
    }
})

app.useBlock(function(state) {
    console.log(state.msgs)
})

app.start().then(function(appInfo) {
    console.log(`app started. gci: ${appInfo.GCI}`)
})