const crypto = require("crypto");
const config = require("../config");

const secret = config.CRYPTO_SECRET; //must be 32 char length
const encryptionMethod = "AES-256-CBC";
const iv = secret.substr(0, 16);

const encrypt = function (plain_text) {
    plain_text = plain_text.toString();
    const encryptor = crypto.createCipheriv(encryptionMethod, secret, iv);
    return (
        encryptor.update(plain_text, "utf8", "base64") +
        encryptor.final("base64")
    );
};

const decrypt = function (encryptedMessage) {
    const decryptor = crypto.createDecipheriv(encryptionMethod, secret, iv);
    return (
        decryptor.update(encryptedMessage, "base64", "utf8") +
        decryptor.final("utf8")
    );
};

module.exports = {
    encrypt: encrypt,
    decrypt: decrypt,
};
