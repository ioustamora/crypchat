let { connect } = require('lotion')
let { encrypt, decrypt, PrivateKey } = require('eciesjs')

const privKey = new PrivateKey()
const privKeyHex = privKey.toHex()
const pubKey = privKey.publicKey
const pubKeyHex = pubKey.toHex()


const data = Buffer.from('this is a test')

let encryptedMsgByte = encrypt(pubKeyHex, data)
let encryptedMsgBase64 = encryptedMsgByte.toString('base64');
let newEncryptedMsgByte = new Buffer.from(encryptedMsgBase64, 'base64');

let decryptedMsg = decrypt(privKeyHex, newEncryptedMsgByte).toString()

let msg = {
    pubKeyHex: pubKeyHex,
    privKeyHex: privKeyHex,
    encryptedMsg: encryptedMsgBase64,
    decryptedMsg: decryptedMsg
}

let msgStr = JSON.stringify(msg)

let GCI = '1620646a3e63cc56e4acf123c7afeb34c3bb7ca036b10dd365355a0a7896f6d5'

async function go() {
    let { state, send } = await connect(GCI)

    let tx = await send({ nonce: msgStr })
    console.log(tx)

    let msgs = await state.msgs
    console.log(msgs)
}

go()