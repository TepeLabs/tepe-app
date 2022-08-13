import { app, dialog } from "electron";
import fs from "fs";
import path from "path";

async function selectFile() {
  return dialog.showOpenDialog({ properties: ["openFile"] });
}

async function openFile(event, filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (error, data) => {
      // fs.readFile(filePath, (error, data) => {
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
    // fs.writeFile(filePath, contents, (error) => {
    fs.writeFile(filePath, contents, 'utf8', (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

async function saveIPFSFile(event, contents, filename) {
  return new Promise((resolve, reject) => {
    let userDataPath = app.getPath("userData");
    let ipfsPath = path.join(userDataPath, "ipfs");
    if (!fs.existsSync(ipfsPath)) {
      fs.mkdirSync(ipfsPath);
    }
    return saveFile(event, contents, path.join(userDataPath, "ipfs", filename));
  });
}

async function openIPFSFile(event, filename) {
  let userDataPath = app.getPath("userData");
  let ipfsPath = path.join(userDataPath, "ipfs");
  if (!fs.existsSync(ipfsPath)) {
    fs.mkdirSync(ipfsPath);
  }
  return openFile(event, path.join(userDataPath, "ipfs", filename));
}

const utilFileIO = {
  selectFile,
  openFile,
  saveFile,
  saveIPFSFile,
  openIPFSFile,
};

export default utilFileIO;
