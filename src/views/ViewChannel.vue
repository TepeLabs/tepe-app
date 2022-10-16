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

  <div class="columns is-centered" v-if="publicMetadata">
    <div class="column is-three-quarters">
      <hr />
      <p>IPFS CID: <a @click="openWebsite">{{this.publicMetadata}}</a></p>
      <p class="is-size-7 mt-4">The file is encrypted and stored on IPFS. But you can only access it if you have the
        NFT.</p>
    </div>
  </div>

  <div class="columns is-centered" v-if="content">
    <div class="column is-three-quarters">
      <hr />
      <h3 class="title is-3">Content</h3>
      <p style="overflow: auto; height: 30vh">{{this.content}}</p>
    </div>
  </div>

  <div class="columns is-centered" v-if="publicMetadata && !content">
    <div class="column is-three-quarters">
      <hr />
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
  <FileView v-if="viewFile" :content="content" @on-close="viewFile = false" />
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
      content: null,
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
            console.log('no recipient, using current wallet', recipientAddress);
          }
          this.messageInfo = "Minting NFTs...";
          console.log(`Minting ${number} NFT(s) to address "${recipientAddress}".`)
          let contractAddress = this.$route.params.address;

          secret.mintNFT(wallet, contractAddress, recipientAddress, number).then((mintResult) => {
            this.messageInfo = `Minting successful! Status: "${mintResult}"`;
            console.log(`Minted NFT with result "${mintResult[0]}"`);
            this.refresh();
          }).catch((error) => {
            this.messageError = error.message;
            console.error(`Minting failed with error ${error}.`);
          });
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
          });
          secret.queryNFTDossier(wallet, contractAddress).then((dossierResult) => {
            this.admin = dossierResult.nft_dossier.owner;
            if (dossierResult.nft_dossier.public_metadata) {
              this.publicMetadata = dossierResult.nft_dossier.public_metadata.text;
            }
            this.transferable = dossierResult.nft_dossier.transferable;
            this.isOwner = this.admin == result.public;
          });
        });
    },
    download() {
      this.showSpinnerDownload = true;
      window.settings
        .getCurrentKey()
        .then((result) => {
          this.messageInfo = "Retrieving metadata...";
          let wallet = new Wallet(result.mnemonic);
          let contractAddress = this.$route.params.address;
          return secret.retrieveMetadata(wallet, contractAddress);
        })
        .then((metadata) => {
          this.messageInfo = 'Retrieve metadata was successful!"';
          console.log('metadata', metadata);
          this.publicMetadata = metadata.public_metadata.text;
          this.privateMetadata = metadata.private_metadata.text;
          return metadata.public_metadata.text;
        })
        .then((cid) => ipfs.downloadFile(cid))
        .then((content) => {
          this.showSpinnerDownload = false;
          let decrypted_content = crypto.decrypt(content, this.privateMetadata);
          this.content = decrypted_content;
          // save the decrypted content to a file locally
          let filePathDec = '/decrypted_content'
          window.fileio.saveFile(decrypted_content, filePathDec);
        })
        .catch((error) => {
          this.messageError = error.message;
          this.showSpinnerDownload = false;
          console.error(`retrieving metadata failed with error ${error}.`);
        });
    },
    async upload() {
      this.showSpinnerUpload = true;
      let key = await window.settings.getCurrentKey();
      let contractAddress = this.$route.params.address;
      let wallet = new Wallet(key.mnemonic);
      let fileSelection = await window.fileio.selectFile();
      if (fileSelection.canceled) {
        this.showSpinnerUpload = false;
        return;
      }
      this.messageInfo = "Uploading...";
      let filePath = fileSelection.filePaths[0];
      let fileContents = await window.fileio.openFile(filePath);
      console.log(fileContents);
      let password = crypto.generateRandomPassword();
      let encrypted = crypto.encrypt(fileContents, password);
      let filePathEnc = filePath + ".enc";
      await window.fileio.saveFile(encrypted, filePathEnc);
      ipfs.uploadFile(filePathEnc)
        .then((ipfsUpload) => {
          console.log(`uploaded to IPFS ${ipfsUpload} with cid ${ipfsUpload['Hash']}`);
          return ipfsUpload.Hash;
        })
        .then((cid) => secret.setMetadata(wallet, contractAddress, cid, password))
        .then((setMetadataResult) => {
          this.showSpinnerUpload = false;
          console.log('set metadata with result ', setMetadataResult);
          if (setMetadataResult) {
            this.messageInfo = 'Set metadata was successful!';
            this.refresh();
          }
        })
        .catch((error) => {
          this.messageError = `Error: <${error}>.`;
          this.showSpinnerUpload = false;
          console.log('Error uploading', error);
        });
    },
    openWebsite() {
      window.external.openLink(ipfs.linkForCID(this.publicMetadata));
    },
  },
  async mounted() {
    // await this.refresh();
    this.showSpinnerFiles = new Array(this.items.length).fill(false);
    this.showSpinnerUploads = new Array(this.items.length).fill(false);
    window.settings
      .getCurrentKey()
      .then((result) => {
        let wallet = new Wallet(result.mnemonic);
        let contractAddress = this.$route.params.address;
        secret.queryNumTokens(wallet, contractAddress).then((queryResult) => {
          this.numTokens = queryResult.num_tokens.count;
        });

        secret.queryNFTDossier(wallet, contractAddress).then((dossierResult) => {
          this.admin = dossierResult.nft_dossier.owner;
          if (dossierResult.nft_dossier.public_metadata !== null) {
            this.publicMetadata = dossierResult.nft_dossier.public_metadata.text;
          }
          this.transferable = dossierResult.nft_dossier.transferable;
          if (this.admin == result.public) {
            this.isOwner = true;
          } else {
            this.isOwner = false;
          }

        });
        window.settings.getChannel(result.public, this.$route.params.address).then((channel) => {
          this.channel = channel;
          console.log('Mounted: channel is ', channel);
        });
        console.log(this.admin);
        console.log(result.public);

      });
    // this.items = [
    //   {
    //     cid: "QmdGT7km3oYaRuqR15rde1FjeN4fmPSQRhFFaPTuvGykZF",
    //     encrypted: true,
    //     downloaded: false,
    //     uploaded: true,
    //     encryption: "",
    //   },
    // ];
  },

}


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
