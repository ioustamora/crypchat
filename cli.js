let { connect } = require('lotion')
let { encrypt, decrypt, PrivateKey } = require('eciesjs')

const privKey = new PrivateKey()
const privKeyHex = privKey.toHex()
const pubKey = privKey.publicKey
const pubKeyHex = pubKey.toHex()


const data = Buffer.from('trois message message')

let encryptedMsgByte = encrypt(pubKeyHex, data)
let encryptedMsgBase64 = encryptedMsgByte.toString('base64');

let newEncryptedMsgByte = new Buffer.from(encryptedMsgBase64, 'base64');
let decryptedMsg = decrypt(privKeyHex, newEncryptedMsgByte).toString()




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

async function getAddrMsgs(GCI, pubKeyHex) {
    try {

        let { state } = await connect(GCI)
        let msgs = await state.msgs
        let msg = msgs[pubKeyHex]
        console.log(msg["1678284496184"])
        let decriptefm = decryptMsg(msg["1678284496184"].encryptedMsg, msg["1678284496184"].privKeyHex)
        console.log(decriptefm)
    } catch (error) {
        console.log(error)
    }
}

let GCI = '1ec39df362c2727070b4f1a2a969ae4c79c85f807e4760ad39fea74cf17bfa5a'

let addMsg = {
    command: "add",
    pubKeyHex: pubKeyHex,
    privKeyHex: privKeyHex,
    encryptedMsg: encryptedMsgBase64,
    decryptedMsg: decryptedMsg
}

let delMsg = {
    command: "delete",
    pubKeyHex: pubKeyHex,
    signature: ""
}

sendMsg(GCI, addMsg)
//deleteMsg(GCI, delMsg)
getAddrMsgs(GCI, "026f49cb9f27bc1f82b35786796de9f3fdb3be6d4f008d43a1cfc3a2ac2186d063")