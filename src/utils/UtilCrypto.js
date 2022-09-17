import forge from "node-forge";

const NUM_ITERATIONS = 100;
const BYTES_KEY = 16;
const BYTES_SALT = 64;
const PREFIX_SALT = 'Salted__'; // (add to match openssl tool output)
let iv = '\x87{\x89Þ\fª¹Õ²­&Wxv\x10õ';

function encrypt(text, password) {
  let salt = forge.random.getBytesSync(BYTES_SALT);
  console.log('salt', salt);
  let key = forge.pkcs5.pbkdf2(password, salt, NUM_ITERATIONS, BYTES_KEY);
  let cipher = forge.cipher.createCipher("AES-CBC", key);
  cipher.start({ iv: iv });
  cipher.update(forge.util.createBuffer(text));
  cipher.finish();
  console.log('encrypted: ', cipher.output.data);
  var output = forge.util.createBuffer();
  output.putBytes(PREFIX_SALT);
  output.putBytes(salt);
  output.putBuffer(cipher.output);
  return output.getBytes();
}

function decrypt(bytes, password) {
  let input = forge.util.createBuffer(bytes, 'binary');
  input.getBytes(PREFIX_SALT.length);
  let salt = input.getBytes(BYTES_SALT);
  console.log('salt: ', salt);
  let key = forge.pkcs5.pbkdf2(password, salt, NUM_ITERATIONS, BYTES_KEY);
  let decipher = forge.cipher.createDecipher("AES-CBC", key);
  decipher.start({ iv: iv });
  decipher.update(input);
  // decipher.update(forge.util.createBuffer(input));
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
};

export default utilCrypto;
