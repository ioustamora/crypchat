let { connect } = require('lotion')
let { encrypt, decrypt, PrivateKey } = require('eciesjs')
const fs = require('fs');


function loadOrCreateMyKey() {
    try {
        let keyFile = fs.readFileSync("key.json", 'utf8', 'r')
        let keyObj = JSON.parse(keyFile)
        return keyObj
    } catch {
        console.log("error reading key from file... lets try to kreate one")
        let keyObj = {
            pubKeyHex: "03eed0fccc5cc378cf5ff85b507aa08eb0ac2d27748cc1d0c4a54c4517324b44f3",
            privKeyHex: "0x89175badda50ad5467983a4d62008df9d9ded1cddf8649650ea8ad08c07cef32"
        } 
        let keyData = JSON.stringify(keyObj)
        fs.writeFileSync("key.json", keyData)
        return keyObj
    }
}

function decryptMsg(encryptedMsgBase64, privKeyHex) {

    let newEncryptedMsgByte = new Buffer.from(encryptedMsgBase64, 'base64')
    let decryptedMsg = decrypt(privKeyHex, newEncryptedMsgByte).toString()

    return decryptedMsg
}


async function sendMsg(GCI, addMsg) {
    try {
        let addMsgStr = JSON.stringify(addMsg)

        let { state, send } = await connect(GCI)

        let tx = await send({ nonce: addMsgStr })
        console.log(tx)
        
    } catch (error) {
        console.log(error)
    }
}

async function deleteMsg(GCI, delMsg) {
    try {
        let delMsgStr = JSON.stringify(delMsg)

        let { state, send } = await connect(GCI)
        let tx = await send({ nonce: delMsgStr })
        console.log(tx)
        
    } catch (error) {
        console.log(error)
    }
}

async function getAddrMsgs(GCI, keyObj) {
    try {

        let { state } = await connect(GCI)
        let msgs = await state.msgs
        let msgList = msgs[keyObj.pubKeyHex]
        for (let index in msgList) {
            let msg = msgList[index]
            console.log(index, " : ", msg)
            let decriptefm = decryptMsg(msg.encryptedMsg, keyObj.privKeyHex)
            console.log(decriptefm)
        }
    } catch (error) {
        console.log(error)
    }
}



let keyObj = loadOrCreateMyKey()

// const privKey = new PrivateKey()
// const privKeyHex = privKey.toHex()
// const pubKey = privKey.publicKey
// const pubKeyHex = pubKey.toHex()

const pubKeyHex = keyObj.pubKeyHex
const privKeyHex = keyObj.privKeyHex


const data = Buffer.from('trois message message')

let encryptedMsgByte = encrypt(pubKeyHex, data)
let encryptedMsgBase64 = encryptedMsgByte.toString('base64');

let newEncryptedMsgByte = new Buffer.from(encryptedMsgBase64, 'base64');
let decryptedMsg = decrypt(privKeyHex, newEncryptedMsgByte).toString()

console.log(keyObj)

let GCI = 'dca64a4ba521d721d572654ec4e0e50721945549417fd07a8e605977213c15d5'

let addMsg = {
    command: "send",
    from: pubKeyHex,
    to: pubKeyHex,
    msg: encryptedMsgBase64
}

let delMsg = {
    command: "delete",
    pubKeyHex: pubKeyHex,
    date: "",
    signature: ""
}

getAddrMsgs(GCI, keyObj)

sendMsg(GCI, addMsg)
//deleteMsg(GCI, delMsg)