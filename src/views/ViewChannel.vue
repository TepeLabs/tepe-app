<template>
  <div class="columns is-centered mt-2">
    <div class="column is-three-quarters">
      <nav class="level">
        <div class="level-left">
          <div class="level-item">
            <h2 class="is-size-3">Name of channel</h2>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <button class="button" @click="nftMintOpen = true">Mint</button>
          </div>
        </div>
      </nav>
    </div>
  </div>
  <div class="columns is-centered mt-2">
    <div class="column is-one-quarter">
      <article class="media">
        <figure class="media-left mt-1">
          <img
            src="@/assets/pfp.png"
            alt=""
            style="width: 40px; height: 40px; border-radius: 20px"
          />
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
      <strong class="is-size-5">Files</strong>
      <li v-for="(item, index) in items" :key="item.url" style="list-style-type: none">
        [{{ item.url }}]
        <font-awesome-icon
          v-if="showSpinnerFiles[index]"
          :icon="faSpinner"
          class="spinner ml-1"
        />
        <a class="ml-1" v-if="!showSpinnerFiles[index]">
          <font-awesome-icon
            v-if="!item.downloaded"
            :icon="faCloudDown"
            @click="download(item, index)"
          />
          <font-awesome-icon
            v-else-if="item.encrypted"
            :icon="faLock"
            @click="decrypt(item, index)"
          />
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
        <font-awesome-icon
          v-if="showSpinnerUploads[index]"
          :icon="faSpinner"
          class="spinner ml-1"
        />
        <a class="ml-1" v-if="!showSpinnerUploads[index]">
          <font-awesome-icon
            v-if="!item.encrypted"
            :icon="faLockOpen"
            @click="encrypt(item, index)"
          />
          <font-awesome-icon
            v-else-if="!item.uploaded"
            :icon="faCloudUp"
            @click="upload(item, index)"
          />
        </a>
      </li>
    </div>
  </div>
  <div class="columns is-centered" v-if="isOwner">
    <div class="column is-three-quarters">
      <hr />
      Upload new file
      <a class="ml-1" @click="selectFile"><font-awesome-icon :icon="faFileUp" /></a>
    </div>
  </div>
  <NFTMint v-if="nftMintOpen" @on-close="nftMintOpen = false" @on-mint="mintNFT" />
  <MessageError
    v-if="messageError.length > 0"
    :message="messageError"
    @on-close="messageError = ''"
  />
  <MessageInfo
    v-if="messageInfo.length > 0"
    :message="messageInfo"
    @on-close="messageInfo = ''"
  />
  <FileView v-if="viewFile" @on-close="viewFile = false" />
</template>
<script>
import secret from "@/utils/UtilSecret";
import { Wallet } from "secretjs";
import crypto from "@/utils/UtilCrypto";
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
import NFTMint from "@/components/NFTMint.vue";
import MessageError from "@/components/MessageError.vue";
import MessageInfo from "@/components/MessageInfo.vue";
import FileView from "@/components/FileView.vue";
export default {
  components: { FontAwesomeIcon, NFTMint, MessageError, MessageInfo, FileView },
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
      messageError: "",
      messageInfo: "",
      nftMintOpen: false,
      viewFile: false,
      showSpinnerFiles: [],
      showSpinnerUploads: [],
      isOwner: true,
      items: [
        {
          url: "https://harangju.com",
          encrypted: true,
          downloaded: false,
          uploaded: true,
          encryption: "",
        },
      ],
      newFiles: [],
    };
  },
  methods: {
    mintNFT() {
      this.nftMintOpen = false;
      window.settings
        .getCurrentWallet()
        .then((result) => {
          let wallet = new Wallet(result.mnemonic);
          this.messageInfo = "Minting NFTs...";
          return secret.mintNFT(wallet, this.$route.params.address);
        })
        .then((result) => {
          this.messageInfo = `Minting successful! Status: "${result.response.status}"`;
          console.log(`Minted NFT with result "${result}"`);
        })
        .catch((error) => {
          this.messageError = error.message;
          console.error(`Contract instatiation failed with error ${error}.`);
        });
      this.nftMintOpen = false;
    },
    download(item, index) {
      this.messageInfo = `Downloading file at ${item.url}`;
      this.showSpinnerFiles[index] = true;
      setTimeout(() => {
        item.downloaded = true;
        this.messageInfo = "Downloaded file.";
        this.showSpinnerFiles[index] = false;
      }, 3000);
    },
    decrypt(item, index) {
      this.showSpinnerFiles[index] = true;
      setTimeout(() => {
        item.encrypted = false;
        this.messageInfo = `Item decrypted at ${item.url}.`;
        this.showSpinnerFiles[index] = false;
      }, 500);
    },
    open(item, index) {
      console.log(`Opening item at ${item.url} at index ${index}.`);
      this.viewFile = true;
    },
    selectFile() {
      window.settings.selectFile().then((result) => {
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
      window.settings
        .openFile(item.url)
        .then((result) => crypto.encrypt(result))
        .then((encrypted) => {
          console.dir(encrypted);
          window.settings.saveFile(encrypted, newURL);
        })
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
      setTimeout(() => {
        item.uploaded = true;
        this.messageInfo = `File "${item.url}" uploaded.`;
        this.items.push(item);
        this.newFiles.splice(index, 1);
        this.showSpinnerUploads[index] = false;
      }, 1000);
    },
  },
  mounted() {
    this.showSpinnerFiles = new Array(this.items.length).fill(false);
    this.showSpinnerUploads = new Array(this.items.length).fill(false);
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
