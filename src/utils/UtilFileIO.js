import { dialog } from "electron";
import fs from "fs";

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

const utilFileIO = {
  selectFile,
  openFile,
  saveFile,
};

export default utilFileIO;
