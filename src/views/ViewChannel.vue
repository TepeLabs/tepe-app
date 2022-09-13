<template>
  <div class="columns is-centered mt-2">
    <div class="column is-three-quarters">
      <nav class="level">
        <div class="level-left">
          <div class="level-item">
            <h2 class="is-size-3" v-if="this.channel">{{ this.channel.name }}</h2>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <button class="button" @click="nftSetOpen = true">Set data</button>
          </div>
          <div class="level-item">
            <button class="button" @click="refresh()">Refresh</button>
          </div>
          <div class="level-item">
            <button class="button" @click="nftMintOpen = true">Mint</button>
          </div>
          <div class="level-item">
            <button class="button" @click="setMetadataOpen = true">Set metadata</button>
          </div>
          <div class="level-item">
            <button class="button" @click="retrieveMetadata()">Read metadata</button>
          </div>
        </div>
      </nav>
    </div>
  </div>
  <div class="columns is-centered mt-2">
    <div class="column is-one-quarter">
      <article class="media">
        <figure class="media-left mt-1">
          <img src="@/assets/pfp.png" alt="" style="width: 40px; height: 40px; border-radius: 20px" />
        </figure>
        <div class="media-content">
          <div class="content">
            <strong>Creator</strong>
            <p>Harang</p>
          </div>
        </div>
      </article>
    </div>
    <div class="column is-one-quarter">
      <article class="media">
        <figure class="media-left mt-3">
          <font-awesome-icon :icon="faUser" size="xl" />
        </figure>
        <div class="media-content">
          <div class="content">
            <strong>Owners</strong>
            <p>10</p>
          </div>
        </div>
      </article>
    </div>
    <div class="column is-one-quarter">
      <article class="media">
        <figure class="media-left mt-3">
          <font-awesome-icon :icon="faCopy" size="xl" />
        </figure>
        <div class="media-content">
          <div class="content">
            <strong>Copies</strong>
            <p>100</p>
          </div>
        </div>
      </article>
    </div>
  </div>
  <div class="columns is-centered" v-if="items.length > 0">
    <div class="column is-three-quarters">
      <p>Public metadata: {{this.publicMetadata}}</p>
      <p>Private metadata: {{this.privateMetadata}}</p>
    </div>
  </div>

  <div class="columns is-centered" v-if="items.length > 0">
    <div class="column is-three-quarters">
      <strong class="is-size-5">Files</strong>
      <li v-for="(item, index) in items" :key="item.cid" style="list-style-type: none">
        [{{ item.cid }}]
        <font-awesome-icon v-if="showSpinnerFiles[index]" :icon="faSpinner" class="spinner ml-1" />
        <a class="ml-1" v-if="!showSpinnerFiles[index]">
          <font-awesome-icon v-if="!item.downloaded" :icon="faCloudDown" @click="download(item, index)" />
          <font-awesome-icon v-else-if="item.encrypted" :icon="faLock" @click="decrypt(item, index)" />
          <font-awesome-icon v-else :icon="faFile" @click="open(item, index)" />
        </a>
      </li>
    </div>
  </div>
  <div class="columns is-centered" v-if="isOwner && newFiles.length > 0">
    <div class="column is-three-quarters">
      <hr />
      <strong class="is-size-5">Uploading</strong>
      <li v-for="(item, index) in newFiles" :key="item.url" style="list-style-type: none">
        [{{ item.url }}]
        <font-awesome-icon v-if="showSpinnerUploads[index]" :icon="faSpinner" class="spinner ml-1" />
        <a class="ml-1" v-if="!showSpinnerUploads[index]">
          <font-awesome-icon v-if="!item.encrypted" :icon="faLockOpen" @click="encrypt(item, index)" />
          <font-awesome-icon v-else-if="!item.uploaded" :icon="faCloudUp" @click="upload(item, index)" />
        </a>
      </li>
    </div>
  </div>
  <div class="columns is-centered" v-if="isOwner">
    <div class="column is-three-quarters">
      <hr />
      Upload new file
      <a class="ml-1" @click="selectFile">
        <font-awesome-icon :icon="faFileUp" />
      </a>
    </div>
  </div>
  <NFTMint v-if="nftMintOpen" @on-close="nftMintOpen = false" @on-mint="mintNFT" />

  <SetMetadata v-if="setMetadataOpen" @on-close="setMetadataOpen = false" @on-set-metadata="setMetadata" />
  <MessageError v-if="messageError.length > 0" :message="messageError" @on-close="messageError = ''" />
  <MessageInfo v-if="messageInfo.length > 0" :message="messageInfo" @on-close="messageInfo = ''" />
  <FileView v-if="viewFile" :content="contentView" @on-close="viewFile = false" />
</template>
<script>
import secret from "@/utils/UtilSecret";
import ipfs from "@/utils/UtilIPFS";
import crypto from "@/utils/UtilCrypto";
import { Wallet } from "secretjs";
import NFTMint from "@/components/NFTMint.vue";

import SetMetadata from "@/components/SetMetadata.vue";
import MessageError from "@/components/MessageError.vue";
import MessageInfo from "@/components/MessageInfo.vue";
import FileView from "@/components/FileView.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faPlus,
  faUser,
  faCopy,
  faLock,
  faLockOpen,
  faFile,
  faSpinner,
  faFileArrowUp,
  faCloudArrowDown,
  faCloudArrowUp,
} from "@fortawesome/free-solid-svg-icons";
export default {

  components: { FontAwesomeIcon, NFTMint, SetMetadata, MessageError, MessageInfo, FileView },
  data() {
    return {
      faPlus: faPlus,
      faUser: faUser,
      faCopy: faCopy,
      faLock: faLock,
      faLockOpen: faLockOpen,
      faFile: faFile,
      faSpinner: faSpinner,
      faFileUp: faFileArrowUp,
      faCloudDown: faCloudArrowDown,
      faCloudUp: faCloudArrowUp,
      channel: null,
      messageError: "",
      messageInfo: "",
      publicMetadata: "",
      privateMetadata: "",
      nftMintOpen: false,
      setMetadataOpen: false,
      viewFile: false,
      showSpinnerFiles: [],
      showSpinnerUploads: [],
      isOwner: true,
      items: [],
      newFiles: [],
      contentView: "",
    };
  },
  methods: {
    mintNFT(recipientAddress, number) {
      this.nftMintOpen = false;
      window.settings
        .getCurrentWallet()
        .then((result) => {
          let wallet = new Wallet(result.mnemonic);
          if (recipientAddress === "") {
            recipientAddress = wallet.public;
            console.log('no recipient');
          }
          this.messageInfo = "Minting NFTs...";
          console.log(`Minting ${number} NFT(s) to address ${recipientAddress}.`)
          let contractAddress = this.$route.params.address;

          secret.mintNFT(wallet, contractAddress, recipientAddress, number).then((mintResult) => {
            this.messageInfo = `Minting successful! Status: "${mintResult}"`;
            console.log(`Minted NFT with result "${mintResult[0]}"`);
          }).catch((error) => {
          this.messageError = error.message;
          console.error(`Minting failed with error ${error}.`);
        })});
      this.nftMintOpen = false;
    },
    download(item, index) {
      this.messageInfo = `Downloading file from ${item.cid}`;
      this.showSpinnerFiles[index] = true;
      ipfs.downloadFile(item.cid)
        .then((response) => {
          console.log(response);
          item.downloaded = true;
          this.messageInfo = "Downloaded file " + item.cid + ".";
          this.showSpinnerFiles[index] = false;
        })
        .catch((error) => {
          console.log(error);
          this.messageError = "Download failed with error " + error;
          this.showSpinnerFiles[index] = false;
        });
    },
    decrypt(item, index) {
      this.showSpinnerFiles[index] = true;
      window.fileio.openIPFSFile(item.cid)
        .then((content) => {
          console.log("Decrypting " + content);
          return crypto.decrypt(content);
        })
        .then((decrypted) => {
          console.log(decrypted);
          window.fileio.saveIPFSFile(decrypted, item.cid + ".txt");
        })
        .then(() => {
          item.encrypted = false;
          this.messageInfo = `Item decrypted at ${item.cid}.`;
          this.showSpinnerFiles[index] = false;
        })
        .catch((error) => {
          console.log(error);
          this.messageError = "Item failed to decript.";
          this.showSpinnerFiles[index] = false;
        });
    },
    open(item, index) {
      console.log(`Opening item at ${item.url} at index ${index}.`);
      window.fileio.openIPFSFile(item.cid + ".txt")
        .then((content) => {
          this.viewFile = true;
          this.contentView = content;
        })
        .catch((error) => {
          this.messageError = error;
        });
    },
    selectFile() {
      window.fileio.selectFile().then((result) => {
        if (!result.canceled) {
          // open file
          this.newFiles.push({
            url: result.filePaths[0],
            encrypted: false,
            uploaded: false,
            downloaded: true,
            encryption: null,
          });
        }
      });
    },
    encrypt(item, index) {
      this.showSpinnerUploads[index] = true;
      let newURL = item.url + ".enc";
      window.fileio
        .openFile(item.url)
        .then((result) => crypto.encrypt(result))
        .then((encrypted) => window.fileio.saveFile(encrypted, newURL))
        .then(() => {
          item.encrypted = true;
          this.newFiles[index].encryption = newURL;
          this.messageInfo = `File "${item.url}" encrypted.`;
          this.showSpinnerUploads[index] = false;
        })
        .catch((error) => {
          console.log(error);
          this.messageError = `Error: <${error}>.`;
          this.showSpinnerUploads[index] = false;
        });
    },
    upload(item, index) {
      this.showSpinnerUploads[index] = true;
      let urlEncrypted = item.url + ".enc";
      console.log(`Uploading item at ${urlEncrypted}.`);
      ipfs.uploadFile(urlEncrypted)
        .then((result) => {
          console.log(result);
          item.uploaded = true;
          item.cid = result.Hash;
        })
        .then(() => {
          console.log("Opening file.")
          return window.fileio.openFile(urlEncrypted);
        })
        .then((content) => {
          console.log("Saving file.");
          window.fileio.saveIPFSFile(content, item.cid);
        })
        .then(() => {
          console.log("Done.");
          this.messageInfo = `File "${urlEncrypted}" uploaded.`;
          this.items.push(item);
          this.newFiles.splice(index, 1);
          this.showSpinnerUploads[index] = false;
        })
        .catch((error) => {
          console.log(error);
          this.messageError = `Error: <${error}>.`;
          this.showSpinnerUploads[index] = false;
        });
    },
    refresh() {
      ipfs.downloadFile("QmdGT7km3oYaRuqR15rde1FjeN4fmPSQRhFFaPTuvGykZF")
        .then((response) => console.log("download response", response))
        .catch((error) => console.log(error));
      ipfs.uploadFile("/Users/harang-mbp-22/Downloads/hi.txt")
        .then((response) => console.log("upload response", response))
        .catch((error) => console.log(error));
    },
    retrieveMetadata() {
      window.settings
        .getCurrentWallet()
        .then((result) => {
          let wallet = new Wallet(result.mnemonic);
          this.messageInfo = "Retrieving metadata...";
          let contractAddress = this.$route.params.address;
          secret.retrieveMetadata(wallet, contractAddress).then((retrieveMetadataResult) => {
            this.messageInfo = `Retrieve metadata was successful! Status: "${retrieveMetadataResult}"`;
            console.log(`retrieve metadata with result "${retrieveMetadataResult}"`);
            this.publicMetadata = retrieveMetadataResult.public_metadata.text;
            this.privateMetadata = retrieveMetadataResult.private_metadata.text;
          }).catch((error) => {
          this.messageError = error.message;
          console.error(`retrieving metadata failed with error ${error}.`);
        })});
    },
    setMetadata(public_metadata, private_metadata) {
      this.setMetadataOpen = false;
      window.settings
        .getCurrentWallet()
        .then((result) => {
          let wallet = new Wallet(result.mnemonic);
          this.messageInfo = "Setting metadata...";
          let contractAddress = this.$route.params.address;
          secret.setMetadata(wallet, contractAddress, public_metadata, private_metadata).then((setMetadataResult) => {
            this.messageInfo = `Set metadata was successful! Status: "${setMetadataResult}"`;
            console.log(`set metadata with result "${setMetadataResult}"`);
          }).catch((error) => {
          this.messageError = error.message;
          console.error(`Setting metadata failed with error ${error}.`);
        })});
      this.setMetadataOpen = false;

    },
  },
  async mounted() {
    this.showSpinnerFiles = new Array(this.items.length).fill(false);
    this.showSpinnerUploads = new Array(this.items.length).fill(false);
    window.settings.getCurrentWallet()
      .then((wallet) => window.settings.getChannel(wallet.public, this.$route.params.address))
      .then((channel) => {
        this.channel = channel;
        console.log('channel', channel);
      });
    this.items = [
      {
        cid: "QmdGT7km3oYaRuqR15rde1FjeN4fmPSQRhFFaPTuvGykZF",
        encrypted: true,
        downloaded: false,
        uploaded: true,
        encryption: "",
      },
    ]
  },
};
</script>
<style>
.spinner {
  animation-name: spin;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
