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
        from: msg.from,
        msg: msg.msg
    }
    if(msg.command === "send") {
        state.msgs[msg.to] = newMsg
    }

    if(msg.command === "delete") {
        console.log("delete command")
    }

})


app.start().then(function(appInfo) {
    console.log(`app started. gci: ${appInfo.GCI}`)
})