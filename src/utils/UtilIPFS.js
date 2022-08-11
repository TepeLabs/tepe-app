// Our Dedicated Gateway Subdomain
// https://olive.infura-ipfs.io/ipfs/QmdGT7km3oYaRuqR15rde1FjeN4fmPSQRhFFaPTuvGykZF

// import file from "@/utils/UtilFileIO";

const URL_API = "https://ipfs.infura.io:5001/api/v0/";

const PROJECT_ID = "2CgYBLf56TZbQK9OdKuVfnqHwV3";
const PROJECT_SECRET = "67ce2b24bb1e886bdbe4f3b17377de1b";

async function test() {
  //   request("cat", "QmXpW7CttVkbD3oDSzn2skqtoncRSDu9AcB9WPJ5q2tdcz")
  //     .then((response) => console.log(response))
  //     .catch((error) => console.log(error));
  uploadFile("/Users/harang-mbp-22/Downloads/hi.txt")
    .then((response) => console.log(response))
    .catch((error) => console.log(error));
}

// async function request(method, cid) {
//   // https://docs.infura.io/infura/networks/ipfs/http-api-methods
//   let options = {
//     method: "POST",
//     headers: {
//       Authorization: "Basic " + btoa(PROJECT_ID + ":" + PROJECT_SECRET),
//     }
//   };
//   return new Promise((resolve, reject) => {
//     const url = "https://ipfs.infura.io:5001/api/v0/" + method + "?arg=" + cid;
//     fetch(url, options)
//       .then((response) => response.text())
//       .then((response) => resolve(response))
//       .catch((error) => reject(error));
//   });
// }

async function uploadFile() {
  // window.settings.openFile(filePath)
  //   .then((response) => console.log(response));
  let file = new File(["file string array"], "filename.txt", { type: "text/plain" });
  let formData = new FormData();
  formData.append('file', file, file.name);
  let options = {
    method: "POST",
    headers: {
      "Authorization": "Basic " + btoa(PROJECT_ID + ":" + PROJECT_SECRET),
    },
    body: formData,
  };
  return new Promise((resolve, reject) => {
    const url = URL_API + "add";
    fetch(url, options)
      .then((response) => response.text())
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

async function downloadFile(cid) {
  console.log(cid);
}

const utilIPFS = {
  uploadFile,
  downloadFile,
  test,
};

export default utilIPFS;
