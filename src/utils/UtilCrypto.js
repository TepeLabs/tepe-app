import forge from "node-forge";

// generate a random key and IV
// Note: a key size of 16 bytes will use AES-128, 24 => AES-192, 32 => AES-256
// let key = forge.random.getBytesSync(16);
// let iv = forge.random.getBytesSync(16);

// alternatively, generate a password-based 16-byte key
let salt = forge.random.getBytesSync(128);
let numIterations = 10;
let key = forge.pkcs5.pbkdf2('password', salt, numIterations, 16);

function encrypt(text) {
  let cipher = forge.cipher.createCipher("AES-CBC", key);
  cipher.start({ iv: iv });
  cipher.update(forge.util.createBuffer(text));
  cipher.finish();
  return cipher.output.data;
}

function decrypt(bytes) {
  let decipher = forge.cipher.createDecipher("AES-CBC", key);
  decipher.start({ iv: iv });
  decipher.update(bytes);
  let success = decipher.finish();
  if (success) {
    return decipher.output.data;
  } else {
    return decipher.output.data;
  }
}

const utilCrypto = {
  encrypt,
  decrypt,
};

export default utilCrypto;
