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
            <button class="button" @click="refresh()">
              <font-awesome-icon :icon="faArrowsRotate" />
            </button>
          </div>
          <div class="level-item">
            <button class="button" @click="nftMintOpen = true" v-if="this.isOwner">
              <font-awesome-icon :icon="faPlus" />
            </button>
          </div>
          <div class="level-item">
            <button class="button" @click="nftTransferOpen = true" v-if="this.isOwner && this.transferable">
              <font-awesome-icon :icon="faPaperPlane" />
            </button>
          </div>
          <div class="level-item">
            <button class="button" @click="setMetadataOpen = true" v-if="this.isOwner">
              <font-awesome-icon :icon="faCloudUp" />
            </button>
          </div>
          <div class="level-item">
            <button class="button" @click="retrieveMetadata()">
              <font-awesome-icon :icon="faCloudDown" />
            </button>
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
            <strong>Admin</strong>
            <p> {{ this.admin.substring(0, 6) }}...{{ this.admin.substring(this.admin.length - 5) }} </p>
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
            <p> {{this.owners.length}} </p>
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
            <p>{{this.numTokens}}</p>
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

  <NFTMint v-if="nftMintOpen" @on-close="nftMintOpen = false" @on-mint="mintNFT" />
  <NFTTransfer v-if="nftTransferOpen" @on-close="nftTransferOpen = false" @on-transfer="transferNFT" />
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
import NFTTransfer from "@/components/NFTTransfer.vue";
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
  faPaperPlane,
  faFileArrowUp,
  faArrowsRotate,
  faCloudArrowUp,
  faCloudArrowDown,
} from "@fortawesome/free-solid-svg-icons";
export default {

  components: { FontAwesomeIcon, NFTMint, NFTTransfer, SetMetadata, MessageError, MessageInfo, FileView },
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
      faCloudUp: faCloudArrowUp,
      faPaperPlane: faPaperPlane,
      faCloudDown: faCloudArrowDown,
      faArrowsRotate: faArrowsRotate,
      channel: null,
      messageError: "",
      messageInfo: "",
      publicMetadata: "",
      privateMetadata: "",
      nftMintOpen: false,
      nftTransferOpen: false,
      setMetadataOpen: false,
      admin: "",
      numTokens: 0,
      owners: [],
      transferable: true,
      viewFile: false,
      showSpinnerFiles: [],
      showSpinnerUploads: [],
      isOwner: false,
      items: [],
      newFiles: [],
      contentView: "",
    };
  },
  methods: {
    mintNFT(recipientAddress, number) {
      this.nftMintOpen = false;
      window.settings
        .getCurrentKey()
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
          })
        });
      this.nftMintOpen = false;
    },
    transferNFT(recipientAddress, number) {
      this.nftTransferOpen = false;
      window.settings
        .getCurrentKey()
        .then((result) => {
          let wallet = new Wallet(result.mnemonic);
          if (recipientAddress === "") {
            recipientAddress = wallet.public;
            console.log('no recipient');
          }
          this.messageInfo = "Transferring NFTs...";
          console.log(`Tranferring ${number} NFT(s) to address ${recipientAddress}.`)
          let contractAddress = this.$route.params.address;

          secret.transferNFT(wallet, contractAddress, recipientAddress, number).then((transferResult) => {
            this.messageInfo = `Transfer successful!`;
            console.log(`Transfered NFT with result`);
            console.log(transferResult);
          }).catch((error) => {
            this.messageError = error.message;
            console.error(`Transfer failed with error ${error}.`);
          })
        });
      this.nftTransferOpen = false;
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
      window.settings
        .getCurrentKey()
        .then((result) => {
          let wallet = new Wallet(result.mnemonic);
          let contractAddress = this.$route.params.address;
          secret.queryNumTokens(wallet, contractAddress).then((queryResult) => {
            this.numTokens = queryResult.num_tokens.count;
          });
          secret.retrieveOwners(wallet, contractAddress).then((owners) => {
            this.owners = owners;
            console.log('owners', owners);
          });
          secret.queryNFTDossier(wallet, contractAddress).then((dossierResult) => {
            this.admin = dossierResult.nft_dossier.owner;
            if (dossierResult.nft_dossier.public_metadata) {
              this.publicMetadata = dossierResult.nft_dossier.public_metadata.text;
            }
            this.transferable = dossierResult.nft_dossier.transferable;
            if (this.admin == result.public) {
              this.isOwner = true;
            } else {
              this.isOwner = false;
            }
          });
        });
    },
    retrieveMetadata() {
      window.settings
        .getCurrentKey()
        .then((result) => {
          let wallet = new Wallet(result.mnemonic);
          this.messageInfo = "Retrieving metadata...";
          let contractAddress = this.$route.params.address;
          secret.retrieveMetadata(wallet, contractAddress).then((retrieveMetadataResult) => {
            if (retrieveMetadataResult.display_private_metadata_error == null) {
              this.messageInfo = `Retrieve metadata was successful!"`;
              this.publicMetadata = retrieveMetadataResult.public_metadata.text;
              this.privateMetadata = retrieveMetadataResult.private_metadata.text;
            } else {
              this.messageInfo = `Public metadata retrieved!"`;
              this.privateMetadata = `NO ACCESS`;
              this.publicMetadata = retrieveMetadataResult.public_metadata.text;
            }
          }).catch((error) => {
            this.messageError = error.message;
            console.error(`retrieving metadata failed with error ${error}.`);
          })
        });
    },
    setMetadata(public_metadata, private_metadata) {
      this.setMetadataOpen = false;
      window.settings
        .getCurrentKey()
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
          })
        });
      this.setMetadataOpen = false;

    },
  },
  async mounted() {
    await this.refresh();
    let currentKey = await window.settings.getCurrentKey();
    this.channel = await window.settings.getChannel(currentKey.public, this.$route.params.address)
    console.log('Mounted: channel is ', this.channel);
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
