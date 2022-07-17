<template>
  <div class="columns is-centered">
    <div class="column is-three-quarters">
      <nav class="level">
        <div class="level-left">
          <div class="level-item">
            <h2 class="is-size-3">Hello</h2>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <button>
              <font-awesome-icon :icon="faPlus" size="2x" @click="mintNFT" />
            </button>
          </div>
        </div>
      </nav>
    </div>
  </div>
  <div class="columns is-centered">
    <div class="column is-three-quarters">
      <p>hello</p>
      <p>test {{ $route.params.address }}</p>
      <p>yoyo</p>
    </div>
  </div>
</template>
<script>
import secret from "@/utils/UtilSecret";
import { Wallet } from "secretjs";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
export default {
  components: { FontAwesomeIcon },
  data() {
    return {
      faPlus: faPlus,
    };
  },
  methods: {
    mintNFT() {
      console.log("mint");
      window.settings
        .getCurrentWallet()
        .then((result) => {
          let wallet = new Wallet(result.mnemonic);
          return secret.mintNFT(wallet, this.$route.params.address);
        })
        .then((result) => {
          console.log(`Minted NFT with result "${result}"`);
        })
        .catch((error) => {
          // notify user
          console.error(`Contract instatiation failed with error ${error}.`);
        });
    },
  },
  mounted() {},
};
</script>
