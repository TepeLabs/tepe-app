// Our Dedicated Gateway Subdomain
// https://olive.infura-ipfs.io/ipfs/QmdGT7km3oYaRuqR15rde1FjeN4fmPSQRhFFaPTuvGykZF
// API Methods
// https://docs.infura.io/infura/networks/ipfs/http-api-methods

const URL_API = "https://ipfs.infura.io:5001/api/v0/";
const DEFAULT_OPTIONS = {
  method: "POST",
  headers: {
    Authorization: "Basic " + btoa(window.env.PROJECT_ID + ":" + window.env.PROJECT_SECRET),
  },
};

async function downloadFile(cid) {
  return request("cat", DEFAULT_OPTIONS, cid);
}

async function uploadFile() {
  // window.settings.openFile(filePath)
  //   .then((response) => console.log(response));
  let file = new File(["file string array"], "filename.txt", { type: "text/plain" });
  let formData = new FormData();
  formData.append('file', file, file.name);
  let options = Object.assign({}, DEFAULT_OPTIONS);
  options.body = formData;
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
