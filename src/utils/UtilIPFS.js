// Our Dedicated Gateway Subdomain
// https://olive.infura-ipfs.io/ipfs/QmdGT7km3oYaRuqR15rde1FjeN4fmPSQRhFFaPTuvGykZF
// API Methods
// https://docs.infura.io/infura/networks/ipfs/http-api-methods
// https://github.com/ipfs/js-ipfs/blob/master/docs/core-api/FILES.md#ipfscatipfspath-options

const URL_API = "https://ipfs.infura.io:5001/api/v0/";
const DEFAULT_OPTIONS = {
  method: "POST",
  headers: {
    Authorization: "Basic " + btoa(window.env.PROJECT_ID + ":" + window.env.PROJECT_SECRET),
  },
};

async function downloadFile(cid) {
  return new Promise((resolve, reject) => {
    request("cat", DEFAULT_OPTIONS, cid)
      .then((response) => {
        window.fileio.saveIPFSFile(response, cid);
        resolve(response);
      })
      .catch((error) => reject(error));
  });
}

async function uploadFile(filepath) {
  let text = await window.fileio.openFile(filepath);
  let filename = filepath.replace(/^.*[\\/]/, '')
  let file = new File([text], filename, { type: "text/plain" });
  let formdata = new FormData();
  formdata.append('file', file, file.name);
  let options = Object.assign({}, DEFAULT_OPTIONS);
  options.body = formdata;
  return request("add", options);
}

async function request(method, options, cid) {
  let url = URL_API + method;
  if (cid) {
    url += "?arg=" + cid;
  }
  return new Promise((resolve, reject) => {
    fetch(url, options)
      .then((response) => response.text())
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

const utilIPFS = {
  uploadFile,
  downloadFile,
};

export default utilIPFS;
