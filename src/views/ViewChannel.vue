<template>
  <div class="columns is-centered mt-2">
    <div class="column is-three-quarters">
      <nav class="level">
        <div class="level-left">
          <div class="level-item" v-if="this.channel">
            <h2 class="is-size-3">{{ this.channel.name }}</h2>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <button class="button" @click="refresh()" title="Refresh channel data">
              <font-awesome-icon :icon="faArrowsRotate" />
            </button>
          </div>
          <div class="level-item" v-if="this.isOwner">
            <button class="button" @click="nftMintOpen = true" title="Mint NFT">
              <font-awesome-icon :icon="faPlus" />
            </button>
          </div>
          <div class="level-item" v-if="this.isOwner && this.transferable">
            <button class="button" @click="nftTransferOpen = true" title="Transfer NFT">
              <font-awesome-icon :icon="faPaperPlane" />
            </button>
          </div>
          <div class="level-item" v-if="this.isOwner">
            <button class="button" @click="upload()" title="Encrypt and upload file">
              <font-awesome-icon :icon="faCloudUp" />
            </button>
          </div>
          <div class="level-item" v-if="filePath.length > 0">
            <button class="button" @click="download()" title="Download file">
              <font-awesome-icon :icon="faCloudDown" />
            </button>
          </div>
          <div class="level-item">
            <button class="button" @click="channelDelete = true" title="Delete channel">
              <font-awesome-icon :icon="faTrash" />
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
            <p> {{ this.adminRender }} </p>
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
            <p> {{ this.owners.length }} </p>
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
            <p>{{ this.numTokens }}</p>
          </div>
        </div>
      </article>
    </div>
  </div>

  <div class="columns is-centered" v-if="publicMetadata">
    <div class="column is-three-quarters">
      <hr />
      <p>IPFS CID: <a @click="openWebsite" title="Open in browser">{{ this.publicMetadata }}</a></p>
      <p class="is-size-8 mt-4">The file is encrypted and stored on IPFS. You can download the encrypted file 
      from the link above, but you can only decrypt it if you own the NFT.</p>
    </div>
  </div>

  <div class="columns is-centered" v-if="publicMetadata && (filePath.length == 0)">
    <div class="column is-three-quarters">
      <hr />
      <h3 class="subtitle is-5 has-text-centered">
        Download item
        <a @click="download()" title="Download and decrypt">
          <font-awesome-icon :icon="faCloudDown" v-if="!showSpinnerDownload" />
          <font-awesome-icon :icon="faSpinner" v-if="showSpinnerDownload" class="spinner" />
        </a>
      </h3>
    </div>
  </div>

  <div class="columns is-centered mt-6" v-if="this.isOwner && !publicMetadata">
    <div class="column is-three-quarters">
      <h3 class="subtitle is-5 has-text-centered">
        Upload item
        <a @click="upload()" title="Encrypt and upload">
          <font-awesome-icon :icon="faCloudUp" v-if="!showSpinnerUpload" />
          <font-awesome-icon :icon="faSpinner" v-if="showSpinnerUpload" class="spinner" />
        </a>
      </h3>
    </div>
  </div>

  <div class="columns is-centered" v-if="content">
    <div class="column is-three-quarters">
      <hr />
      <h3 class="title is-3">Content</h3>
      <p style="overflow: auto; height: 10vh">{{ this.content }}</p>
    </div>
  </div>

  <div class="columns is-centered" v-if="(filePath.length > 0)">
    <div class="column is-three-quarters">
      <hr />
      <h3 class="title is-3">File Status</h3>
      <p style="overflow: auto; height: 10vh">Saved in {{ this.filePath }}</p>
    </div>
  </div>

  <NFTMint v-if="nftMintOpen" @on-close="nftMintOpen = false" @on-mint="mintNFT" v-bind:addressBook="addressBook" />
  <NFTTransfer v-if="nftTransferOpen" @on-close="nftTransferOpen = false" @on-transfer="transferNFT"
    v-bind:addressBook="addressBook" />
  <SetMetadata v-if="setMetadataOpen" @on-close="setMetadataOpen = false" @on-set-metadata="setMetadata" />
  <MessageError v-if="messageError.length > 0" :message="messageError" @on-close="messageError = ''" />
  <MessageInfo v-if="messageInfo.length > 0" :message="messageInfo" @on-close="messageInfo = ''" />
  <ChannelDelete v-if="channelDelete" @on-close="channelDelete = false" @on-confirm="deleteChannel" />
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
import ChannelDelete from "@/components/ChannelDelete.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faPlus,
  faUser,
  faCopy,
  faLock,
  faTrash,
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

  components: { FontAwesomeIcon, NFTMint, NFTTransfer, SetMetadata, MessageError, MessageInfo, ChannelDelete },
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
      faTrash: faTrash,
      channel: null,
      messageError: "",
      messageInfo: "",
      publicMetadata: "",
      privateMetadata: "",
      decryptedFilename: "",
      nftMintOpen: false,
      nftTransferOpen: false,
      setMetadataOpen: false,
      admin: "",
      adminRender: "",
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
      channelDelete: false,
      addressBook: [],
      filePath: "",
      content: "",
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
          }
          this.messageInfo = "Transferring NFTs...";
          console.log(`Tranferring ${number} NFT(s) to address ${recipientAddress}.`)
          let contractAddress = this.$route.params.address;
          secret.transferNFT(wallet, contractAddress, recipientAddress, number).then((transferResult) => {
            this.messageInfo = `Transfer successful!`;
            console.log(`Transfered NFT with result`, transferResult);
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
    async download() {
      this.showSpinnerDownload = true;
      let filePathDec = await window.fileio.selectPath();
      let key = await window.settings.getCurrentKey();
      this.messageInfo = "Retrieving metadata...";
      let wallet = new Wallet(key.mnemonic);
      let contractAddress = this.$route.params.address;
      secret.retrieveMetadata(wallet, contractAddress)
        .then((metadata) => {
          this.messageInfo = 'Retrieve metadata was successful!';
          console.log('metadata', metadata);
          this.publicMetadata = metadata.public_metadata.text;
          this.privateMetadata = metadata.private_metadata.text;
          if (metadata.private_metadata.filename != null) {
            this.decryptedFilename = metadata.private_metadata.filename;
          }
          let cid = metadata.public_metadata.text;
          ipfs.downloadFile(cid)
            .then((content) => {
              this.showSpinnerDownload = false;
              let decrypted_content = crypto.decrypt(content, this.privateMetadata);
              // save the decrypted content to a file locally
              if (this.decryptedFilename != "") {
                let fileExtension = this.decryptedFilename.substring(
                  this.decryptedFilename.length - 3, this.decryptedFilename.length);
                if (fileExtension === 'txt') {
                  this.content = decrypted_content;
                } else {
                  this.content = '';
                }
                window.fileio.join(filePathDec.filePaths[0], this.decryptedFilename)
                  .then((result) => {
                    filePathDec = result;
                    this.filePath = filePathDec;
                    window.fileio.saveFile(decrypted_content, filePathDec);
                  })
                  .then(() => {
                    window.settings.updateChannelInfo(wallet.address, this.$route.params.address, filePathDec, cid);
                  });
              } else {
                window.fileio.join(filePathDec.filePaths[0], 'olive_file.dec')
                  .then((result) => {
                    filePathDec = result;
                    this.filePath = filePathDec;
                    window.fileio.saveFile(decrypted_content, filePathDec);
                  })
                  .then(() => {
                    window.settings.updateChannelInfo(wallet.address, this.$route.params.address, filePathDec, cid);
                  });
              }
            });
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
      let bareFileName = await window.fileio.basename(filePath);
      let fileContents = await window.fileio.openFile(filePath);
      let password = crypto.generateRandomPassword();
      let encrypted = crypto.encrypt(fileContents, password);
      let filePathEnc = filePath + ".enc";
      await window.fileio.saveFile(encrypted, filePathEnc);
      ipfs.uploadFile(filePathEnc)
        .then((ipfsUpload) => {
          console.log(`uploaded to IPFS ${ipfsUpload} with cid ${ipfsUpload['Hash']}`);
          return ipfsUpload.Hash;
        })
        .then((cid) => secret.setMetadata(wallet, contractAddress, cid, password, bareFileName))
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
    async openWebsite() {
      let url = await ipfs.linkForCID(this.publicMetadata);
      console.log(url);
      window.externalaccess.openLink(url);
    },
    async deleteChannel() {
      console.log('deleting channel');
      let key = await window.settings.getCurrentKey();
      window.settings.deleteChannel(key.public, this.$route.params.address);
      this.$router.go(-1);
    },
    loadAddressBook() {
      window.settings.getCurrentKey().then((result) => {
        let wallet = new Wallet(result.mnemonic);
        window.settings.getAddressBook(wallet.address).then((res) => {
          this.addressBook = res;
          this.adminRender = this.admin.substring(0, 6) + "..." + this.admin.substring(this.admin.length - 5);
          for (let index in this.addressBook) {

            if (this.addressBook[index].address == this.admin) {
              this.adminRender = this.addressBook[index].name + " (" + this.adminRender + ")";
            }
          }
          console.log(this.adminRender);
        });
      });
    }
  },

  async mounted() {
    this.showSpinnerFiles = new Array(this.items.length).fill(false);
    this.showSpinnerUploads = new Array(this.items.length).fill(false);
    let key = await window.settings.getCurrentKey();
    let wallet = new Wallet(key.mnemonic);
    let contractAddress = this.$route.params.address;

    secret.queryNumTokens(wallet, contractAddress)
      .then((queryResult) => {
        this.numTokens = queryResult.num_tokens.count;
      });
    secret.queryNFTDossier(wallet, contractAddress)
      .then((dossierResult) => {
        this.admin = dossierResult.nft_dossier.owner;
        if (dossierResult.nft_dossier.public_metadata !== null) {
          this.publicMetadata = dossierResult.nft_dossier.public_metadata.text;
          console.log('got public metadata', this.publicMetadata);
        }
        this.transferable = dossierResult.nft_dossier.transferable;
        if (this.admin == key.public) {
          this.isOwner = true;
        } else {
          this.isOwner = false;
        }
        this.loadAddressBook();
      });
    window.settings.getChannel(key.public, this.$route.params.address)
      .then((channel) => {
        this.channel = channel;
        let fileExtension = channel.path.substring(channel.path.length - 3, channel.path.length);
        if (fileExtension === 'txt') {
          window.fileio.openFile(channel.path)
            .then((result) => {
              this.content = result;
            })
            .catch((error) => {
              console.log('error loading file', error);
            });
        }
        console.log('channel path', channel.path.length > 0, this.filePath);
        this.filePath = channel.path;
        console.log('filePath', this.filePath)
        console.log('Mounted: channel is ', channel);
      })
      .catch((error) => console.log('error getting channel', error));
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
