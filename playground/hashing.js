const { SHA256 } = require("crypto-js");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const password = '123abc!';

// bcrypt.genSalt(10, (err, salt) => {
//     console.log(salt);
//     bcrypt.hash(password, salt, (err, hash) => {
//         console.log(hash)
//     })
// })
// const salt = "$2a$10$OLd3cNOl1Zc5G1JnId68Mu";
// //$2a$10$OLd3cNOl1Zc5G1JnId68Mu4sGJl43erpLloAUzwmgzrW6AUWV.Eem
// bcrypt.hash('123abc!', salt, (err, hash) => {
//     console.log(hash)
// })

let hashedPassword = '$2a$10$1ir6IUNZfej7BrLFNcFzfOCeIQnKavX2t.5jOvr1KXMbHm9gecGye';
//let hashedPassword = '$2a$10$gXL1ulyYn2CbZrfCTPT3R.IeeaZV5HfNxuY/F7rRb8QFlj9erbDQ6';
// let hashedPassword = '$2a$10$BpbaNnHhlCjVCXwgsO2c6.pVBbluxExDSbjoqkm7ZE9S7onN65r9G';

bcrypt.compare(password, hashedPassword, (err, result) => {
    console.log(result);
})


// const data = { text: 'my personla text' };
// const token = jwt.sign(data, 'secret');
// console.log(token);

// const decoded = jwt.verify(token, 'secret');
// console.log(decoded);

// const message = "Hi three";

// const hash = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`Hash : ${hash}`);

// // Server end
// const data = { text: 'my personla text' }
// const token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'secretkey').toString()
// }

// // Middle man attack
// // token.data.text = 'Change the personal text';
// // token.hash = SHA256(JSON.stringify(data)).toString();

// // Client end
// resultHash = SHA256(JSON.stringify(token.data) + 'secretkey').toString();
// if (token.hash === resultHash) {
//     console.log('Data was not change');
// } else {
//     console.log('Data changed !! ALERT !!');
// }
