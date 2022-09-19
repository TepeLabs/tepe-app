<template>
  <div class="columns">
    <div class="column" v-if="hasWalletList">
      <table class="table is-fullwidth is-striped is-hoverable is-striped mt-1">
        <colgroup>
          <col style="width: 8%" />
          <col style="width: 82%" />
          <col style="width: 10%" />
        </colgroup>
        <thead>
          <tr>
            <th></th>
            <th>Wallets</th>
            <th>
              <button class="button is-small" @click="walletCreateOpen = true">+</button>
            </th>
          </tr>
        </thead>
        <tbody v-for="(wallet, index) in walletList" :key="wallet.public" @click="displayWalletEdit(index)">
          <tr>
            <td class="is-vcentered has-text-centered">
              <font-awesome-icon :icon="faCheck" v-if="wallet.selected" />
            </td>
            <td>
              <p>
                <strong>Lorem {{ index }}</strong>
              </p>
              <span class="is-family-monospace">{{ wallet.public }}</span>
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="columns is-centered mt-4" v-if="!hasWalletList">
    <div class="column is-three-quarters has-text-centered">
      <button class="button" @click="walletCreateOpen = true">Create new wallet</button>
    </div>
  </div>
  <WalletAdd v-if="walletCreateOpen" :address="walletAddressNew" :mnemonic="mnemonicNew" @on-create="onWalletCreate"
    @on-close="walletCreateOpen = false" @on-confirm="saveNewWallet" @on-import="importMnemonic" />
  <WalletEdit v-if="walletEditOpen" :address="walletEdit" :is-selected="walletEditIsSelected"
    @on-close="walletEditOpen = false" @on-select="selectKey" @on-delete="deleteKey" />
</template>
<script>
import WalletAdd from "@/components/WalletAdd.vue";
import WalletEdit from "@/components/WalletEdit.vue";
import { Wallet } from "secretjs";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faCheck, faPlus } from "@fortawesome/free-solid-svg-icons";
export default {
  components: { WalletAdd, WalletEdit, FontAwesomeIcon },
  data() {
    return {
      walletCreateOpen: false,
      walletEditOpen: false,
      walletList: null,
      mnemonicNew: "",
      walletAddressNew: "",
      walletEdit: "",
      faCheck: faCheck,
      faPlus: faPlus,
    };
  },
  computed: {
    hasWalletList() {
      return this.walletList && this.walletList.length > 0;
    },
    walletEditIsSelected() {
      return this.walletEdit === this.walletSelected;
    },
    walletSelected() {
      return this.walletList ? this.walletList.find((pair) => pair.selected).public : "";
    },
  },
  methods: {
    onWalletCreate() {
      const wallet = new Wallet();
      this.walletAddressNew = wallet.address;
      this.mnemonicNew = wallet.mnemonic;
    },
    displayWalletEdit(index) {
      this.walletEdit = this.walletList[index].public;
      this.walletEditOpen = true;
    },
    selectKey() {
      window.settings.selectKey(this.walletEdit)
        .then(() => window.settings.saveWallet());
      this.walletList = this.walletList.map((wallet) => {
        wallet.selected = wallet.public === this.walletEdit;
        return wallet;
      });
      this.walletEditOpen = false;
    },
    deleteKey() {
      window.settings.deleteKey(this.walletEdit)
        .then(() => window.settings.saveWallet());
      let toDelete = this.walletList.filter((x) => x.public === this.walletEdit)[0];
      this.walletList = this.walletList.filter((x) => x.public != this.walletEdit);
      if (toDelete.selected) {
        this.walletList[0].selected = true;
      }
      this.walletEditOpen = false;
    },
    saveNewWallet() {
      console.log(`${this.walletAddressNew}`);
      window.settings.addKey(this.walletAddressNew, '', this.mnemonicNew)
        .then(() => window.settings.saveWallet())
        .then(() => {
          this.loadWalletList();
          this.walletCreateOpen = false;
        });
    },
    importMnemonic(mnemonic) {
      const wallet = new Wallet(mnemonic);
      window.settings.addKey(wallet.address, '', mnemonic)
        .then(() => window.settings.saveWallet())
        .then(() => {
          this.loadWalletList();
          this.walletCreateOpen = false;
        });
    },
    loadWalletList() {
      window.settings.getAllKeys()
        .then((result) => {
          this.walletList = result;
        })
        .catch((err) => {
          console.log(`Error loading wallets <${err}>.`);
        });
    },
  },
  mounted() {
    console.log("ViewWallet: Mounted.");
    this.loadWalletList();
  },
};
</script>
