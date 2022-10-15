import forge from "node-forge";

const NUM_ITERATIONS = 100;
const BYTES_KEY = 16;
const BYTES_SALT = 128;
const BYTES_IV = 16;
const PREFIX_SALT = 'Salted__'; // (add to match openssl tool output)
const PREFIX_IV = '__IV__'; // not sure about the convention

const ALPHA = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*_-+=";
const CHARACTERS = ALPHA + NUMBERS + SYMBOLS;
const PASSWORD_LENGTH = 32;

function generateRandomPassword() {
  let password = "";
  for (let i = 0; i < PASSWORD_LENGTH; i++) {
    password += CHARACTERS.charAt(
      Math.floor(Math.random() * CHARACTERS.length)
    );
  }
  return password;
}

function encrypt(text, password) {
  let salt = forge.random.getBytesSync(BYTES_SALT);
  let iv = forge.random.getBytesSync(BYTES_IV);
  let key = forge.pkcs5.pbkdf2(password, salt, NUM_ITERATIONS, BYTES_KEY);
  let cipher = forge.cipher.createCipher("AES-CBC", key);
  cipher.start({ iv: iv });
  cipher.update(forge.util.createBuffer(text));
  cipher.finish();
  var output = forge.util.createBuffer();
  output.putBytes(PREFIX_SALT);
  output.putBytes(salt);
  output.putBytes(PREFIX_IV);
  output.putBytes(iv);
  output.putBuffer(cipher.output);
  return output.getBytes();
}

function decrypt(bytes, password) {
  let input = forge.util.createBuffer(bytes, 'binary');
  input.getBytes(PREFIX_SALT.length);
  let salt = input.getBytes(BYTES_SALT);
  input.getBytes(PREFIX_IV.length);
  let iv = input.getBytes(BYTES_IV);
  let key = forge.pkcs5.pbkdf2(password, salt, NUM_ITERATIONS, BYTES_KEY);
  let decipher = forge.cipher.createDecipher("AES-CBC", key);
  decipher.start({ iv: iv });
  decipher.update(input);
  let success = decipher.finish();
  if (success) {
    return decipher.output.data;
  } else {
    return null;
  }
}

const utilCrypto = {
  encrypt,
  decrypt,
  generateRandomPassword,
};

export default utilCrypto;
