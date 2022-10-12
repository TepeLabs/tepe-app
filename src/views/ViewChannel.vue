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
            <button class="button" @click="upload()" v-if="this.isOwner">
              <font-awesome-icon :icon="faCloudUp" />
            </button>
          </div>
          <!-- <div class="level-item">
            <button class="button" @click="retrieveMetadata()">
              <font-awesome-icon :icon="faCloudDown" />
            </button>
          </div> -->
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

  <div class="columns is-centered mt-6" v-if="publicMetadata">
    <div class="column is-three-quarters">
      <h3 class="subtitle is-5 has-text-centered">
        Download item
        <a @click="download()">
          <font-awesome-icon :icon="faCloudDown" v-if="!showSpinnerDownload" />
          <font-awesome-icon :icon="faSpinner" v-if="showSpinnerDownload" class="spinner" />
        </a>
      </h3>
    </div>
  </div>

  <div class="columns is-centered mt-6" v-if="!publicMetadata">
    <div class="column is-three-quarters">
      <h3 class="subtitle is-5 has-text-centered">
        Upload item
        <a @click="upload()">
          <font-awesome-icon :icon="faCloudUp" v-if="!showSpinnerUpload" />
          <font-awesome-icon :icon="faSpinner" v-if="showSpinnerUpload" class="spinner" />
        </a>
      </h3>
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
      showSpinnerDownload: false,
      showSpinnerUpload: false,
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
          console.log(`Minting ${number} NFT(s) to address "${recipientAddress}".`)
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
    download() {
      this.showSpinnerDownload = true;
      window.settings
        .getCurrentKey()
        .then((result) => {
          let wallet = new Wallet(result.mnemonic);
          this.messageInfo = "Retrieving metadata...";
          let contractAddress = this.$route.params.address;
          return secret.retrieveMetadata(wallet, contractAddress)
        })
        .then((retrieveMetadataResult) => {
          if (retrieveMetadataResult.display_private_metadata_error) {
            this.messageInfo = `Public metadata retrieved!"`;
            this.privateMetadata = `NO ACCESS`;
            this.publicMetadata = retrieveMetadataResult.public_metadata.text;
          }
          this.messageInfo = `Retrieve metadata was successful!"`;
          this.publicMetadata = retrieveMetadataResult.public_metadata.text;
          this.privateMetadata = retrieveMetadataResult.private_metadata.text;
          return retrieveMetadataResult.public_metadata.text;
        })
        // .then((cid) => (ipfs.downloadFile(cid), cid))
        // .then((response, cid) => {
        //   console.log(response);
        //   item.downloaded = true;
        //   this.messageInfo = "Downloaded file " + cid + ".";
        //   this.showSpinnerDownload = false;
        // })
        // open file window.fileio.openIPFSFile(item.cid)
        // decrypt crypto.decrypt(content);
        // save
        // this.contentView = content;
        .catch((error) => {
          this.messageError = error.message;
          this.showSpinnerDownload = false;
          console.error(`retrieving metadata failed with error ${error}.`);
        });
    },
    async upload() {
      let key = await window.settings.getCurrentKey();
      let contractAddress = this.$route.params.address;
      let wallet = new Wallet(key.mnemonic);
      let fileSelection = await window.fileio.selectFile();
      if (fileSelection.canceled) {
        return;
      }
      this.messageInfo = "Uploading...";
      let filePath = fileSelection.filePaths[0];
      let fileContents = await window.fileio.openFile(filePath);
      let password = 'password :)';
      let encrypted = crypto.encrypt(fileContents, password);
      let filePathEnc = filePath + ".enc";
      await window.fileio.saveFile(encrypted, filePathEnc);
      ipfs.uploadFile(filePathEnc)
        .then((ipfsUpload) => ipfsUpload.Hash)
        .then((cid) => secret.setMetadata(wallet, contractAddress, cid, password))
        .then((setMetadataResult) => {
          this.messageInfo = `Set metadata was successful! Status: "${setMetadataResult}"`;
          console.log('set metadata with result ', setMetadataResult);
        })
        .catch((error) => {
          this.messageError = `Error: <${error}>.`;
          console.log('Error uploading', error);
        });
      this.refresh();
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
