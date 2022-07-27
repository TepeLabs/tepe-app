import { dialog } from "electron";

async function openFile() {
  return dialog.showOpenDialog({ properties: ["openFile"] });
}
const utilFileIO = {
  openFile,
};

export default utilFileIO;
