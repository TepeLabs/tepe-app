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
  <div class="columns is-centered">
    <div class="column is-three-quarters">
      <li v-for="(item, index) in items" :key="item.url" style="list-style-type: none">
        [{{ item.url }}]
        <font-awesome-icon
          v-if="showSpinner[index]"
          :icon="faSpinner"
          class="spinner ml-1"
        />
        <a class="ml-1" v-if="!showSpinner[index]">
          <font-awesome-icon
            v-if="!item.downloaded"
            :icon="faCloud"
            @click="download(item, index)"
          />
          <font-awesome-icon
            v-else-if="!item.unlocked"
            :icon="faLock"
            @click="unlock(item, index)"
          />
          <font-awesome-icon
            v-else-if="item.unlocked"
            :icon="faFile"
            @click="open(item, index)"
          />
        </a>
      </li>
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
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faPlus,
  faUser,
  faCopy,
  faLock,
  faFile,
  faSpinner,
  faCloudArrowDown,
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
      faFile: faFile,
      faSpinner: faSpinner,
      faCloud: faCloudArrowDown,
      messageError: "",
      messageInfo: "",
      nftMintOpen: false,
      viewFile: false,
      showSpinner: [],
      items: [
        {
          url: "https://harangju.com",
          downloaded: false,
          unlocked: false,
        },
      ],
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
      this.showSpinner[index] = true;
      setTimeout(() => {
        item.downloaded = true;
        this.messageInfo = "Downloaded file.";
        this.showSpinner[index] = false;
      }, 3000);
    },
    unlock(item, index) {
      this.showSpinner[index] = true;
      setTimeout(() => {
        item.unlocked = true;
        this.messageInfo = `Item unlocked at ${item.url}.`;
        this.showSpinner[index] = false;
      }, 500);
    },
    open(item, index) {
      console.log(`Opening item at ${item.url} at index ${index}.`);
      this.viewFile = true;
    },
  },
  mounted() {
    this.showSpinner = new Array(this.items.length).fill(false);
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
