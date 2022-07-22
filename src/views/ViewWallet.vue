<template>
  <div class="columns">
    <div class="column" v-if="hasKeyPairs">
      <table class="table is-fullwidth is-striped is-hoverable is-striped mt-1">
        <colgroup>
          <col style="width: 8%" />
          <col style="width: 82%" />
          <col style="width: 10%" />
        </colgroup>
        <thead>
          <tr>
            <th></th>
            <th>Addresses</th>
            <th>
              <button class="button is-small" @click="addressCreateOpen = true">+</button>
            </th>
          </tr>
        </thead>
        <tbody
          v-for="(keyPair, index) in keyPairs"
          :key="keyPair.address"
          @click="displayAddressEdit(index)"
        >
          <tr>
            <td class="is-vcentered">
              <font-awesome-icon :icon="faCheck" v-if="keyPair.selected" />
            </td>
            <td>
              <p>
                <strong>Lorem {{ index }}</strong>
              </p>
              <span class="is-family-monospace">{{
                keyPair.address.slice(0, 10) + "..." + keyPair.address.slice(-10)
              }}</span>
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="columns is-centered" v-if="!hasKeyPairs">
    <div class="column is-three-quarters has-text-centered">
      <button class="button" @click="addressCreateOpen = true">Create new wallet</button>
    </div>
  </div>
  <AddressAdd
    v-if="addressCreateOpen"
    :address="addressNew"
    :mnemonic="mnemonicNew"
    @on-create="onAddressCreate"
    @on-close="addressCreateOpen = false"
    @on-confirm="saveNewAddress"
    @on-import="importMnemonic"
  />
  <AddressEdit
    v-if="addressEditOpen"
    :address="addressEdit"
    :is-selected="addressEditIsSelected"
    @on-close="addressEditOpen = false"
    @on-select="selectAddress"
    @on-delete="deleteAddress"
  />
</template>
<script>
import AddressAdd from "@/components/AddressAdd.vue";
import AddressEdit from "@/components/AddressEdit.vue";
import { Wallet } from "secretjs";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faCheck, faPlus } from "@fortawesome/free-solid-svg-icons";
export default {
  components: { AddressAdd, AddressEdit, FontAwesomeIcon },
  data() {
    return {
      addressCreateOpen: false,
      addressEditOpen: false,
      keyPairs: null,
      mnemonicNew: "",
      addressNew: "",
      addressEdit: "",
      faCheck: faCheck,
      faPlus: faPlus,
    };
  },
  computed: {
    hasKeyPairs() {
      return this.keyPairs && this.keyPairs.length > 0;
    },
    addressEditIsSelected() {
      return this.addressEdit === this.addressSelected;
    },
    addressSelected() {
      return this.keyPairs ? this.keyPairs.find((pair) => pair.selected).address : "";
    },
  },
  methods: {
    onAddressCreate() {
      const wallet = new Wallet();
      this.addressNew = wallet.address;
      this.mnemonicNew = wallet.mnemonic;
    },
    displayAddressEdit(index) {
      this.addressEdit = this.keyPairs[index].address;
      this.addressEditOpen = true;
    },
    selectAddress() {
      window.settings.selectAddress(this.addressEdit);
      this.keyPairs = this.keyPairs.map((pair) => {
        pair.selected = pair.address === this.addressEdit;
        return pair;
      });
      this.addressEditOpen = false;
    },
    deleteAddress() {
      window.settings.deleteAddress(this.addressEdit);
      let toDelete = this.keyPairs.filter((x) => x.address === this.addressEdit)[0];
      this.keyPairs = this.keyPairs.filter((x) => x.address != this.addressEdit);
      if (toDelete.selected) {
        this.keyPairs[0].selected = true;
      }
      this.addressEditOpen = false;
    },
    saveNewAddress() {
      console.log(`${this.addressNew}`);
      window.settings.saveKey(this.addressNew, this.mnemonicNew);
      this.loadKeyPairs();
      this.addressCreateOpen = false;
    },
    importMnemonic(mnemonic) {
      const wallet = new Wallet(mnemonic);
      window.settings.saveKey(wallet.address, mnemonic);
      this.loadKeyPairs();
      this.addressCreateOpen = false;
    },
    loadKeyPairs() {
      window.settings
        .getStoreValue("keyPairs")
        .then((result) => {
          this.keyPairs = result;
        })
        .catch((err) => {
          console.log(`Error loading key pairs <${err}>.`);
        });
    },
  },
  mounted() {
    console.log("ViewWallet: Mounted.");
    this.loadKeyPairs();
  },
};
</script>
