//file for implementation of hashing and making passwords secure

const argon2 = require('argon2');

async function hashPass(password) {
    try {
        const hashedPassword = await argon2.hash(password);
        return hashedPassword;
    } catch (err) {
        console.error('Hashing error', err);
        throw err;
    }
}

async function deHashPass(hash, password) {
    try {
        const matches = await argon2.verify(hash, password);
        return matches;
    } catch (err) {
        console.error('Verification error', err);
        throw err;
    }
}

module.exports = {hashPass, deHashPass};