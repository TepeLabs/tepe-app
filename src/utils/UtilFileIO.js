import { app, dialog } from "electron";
import fs from "fs";
import path from "path";

async function selectFile() {
  return dialog.showOpenDialog({ properties: ["openFile"] });
}

async function openFile(event, filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}

async function saveFile(event, contents, filePath) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, contents, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

async function saveIPFSFile(event, contents, cid) {
  return new Promise((resolve, reject) => {
    let userDataPath = app.getPath("userData");
    let ipfsPath = path.join(userDataPath, "ipfs");
    if (!fs.existsSync(ipfsPath)) {
      fs.mkdirSync(ipfsPath);
    }
    return saveFile(event, contents, path.join(userDataPath, "ipfs", cid + ".txt"));
  });
}

async function openIPFSFile(event, cid) {
  return new Promise((resolve, reject) => {
    let userDataPath = app.getPath("userData");
    let ipfsPath = path.join(userDataPath, "ipfs");
    if (!fs.existsSync(ipfsPath)) {
      fs.mkdirSync(ipfsPath);
    }
    return openFile(event, path.join(userDataPath, "ipfs", cid + ".txt"));
  });
}

const utilFileIO = {
  selectFile,
  openFile,
  saveFile,
  saveIPFSFile,
  openIPFSFile,
};

export default utilFileIO;
