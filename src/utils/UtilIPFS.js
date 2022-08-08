import * as IPFS from "ipfs-core";

// const baseURL = "https://ipfs.infura.io:5001/api/v0/";

const node = IPFS.create();

async function uploadFile(filePath) {
  const upload = await node.add({
    path: filePath,
    content: "content here",
  });
  console.dir(upload);
  return new Promise((resolve) => {
    resolve(upload);
    // reject();
  });
}

async function downloadFile(cid) {
  return new Promise((resolve) => {
    const stream = node.cat(cid);
    const decoder = new TextDecoder()
    let data = '';
    // let chunks = [];
    for (const chunk of stream) {
      // chunks of data are returned as a Uint8Array, convert it back to a string
      data += decoder.decode(chunk, { stream: true });
      // chunks.push(chunk);
    }
    resolve(data);
    // resolve(uint8ArrayConcat(chunks).toString());
    // reject();
  });
}

const utilIPFS = {
  uploadFile,
  downloadFile,
};

export default utilIPFS;
