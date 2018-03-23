const { SHA256 } = require("crypto-js");

const jwt = require('jsonwebtoken');

const data = { text: 'my personla text' };
const token = jwt.sign(data, 'secret');
console.log(token);

const decoded = jwt.verify(token, 'secret');
console.log(decoded);

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
