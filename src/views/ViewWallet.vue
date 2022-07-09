<!-- eslint-disable vue/valid-v-on -->
<template>
  <div class="columns is-centered">
    <div class="column is-three-quarters" v-if="hasKeyPairs">
      <table class="table is-fullwidth is-striped is-hoverable is-striped">
        <thead>
          <tr>
            <th></th>
            <th>Address</th>
            <th>
              <button class="button is-small" @click="displayAddressCreate">+</button>
            </th>
          </tr>
        </thead>
        <tbody v-for="(keyPair, index) in keyPairs" :key="keyPair.address">
          <tr :class="{ 'is-selected': keyPair.selected }">
            <td>{{ index + 1 }}</td>
            <td>{{ keyPair.address }}</td>
            <td>
              <button class="button is-small" @click="displayAddressEdit(index)">
                ···
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="columns is-centered" v-if="!hasKeyPairs">
    <div class="column is-three-quarters has-text-centered">
      <button class="button" @click="displayAddressCreate">Create new wallet</button>
    </div>
  </div>
  <AddressCreate
    :is-open="addressCreateOpen"
    :address="addressNew"
    :mnemonic="mnemonicNew"
    @on-close="addressCreateOpen = false"
    @on-keep="saveNewKey"
  />
  <AddressEdit
    :is-open="addressEditOpen"
    :address="addressEdit"
    :is-selected="addressEditIsSelected"
    @on-close="addressEditOpen = false"
    @on-select="selectAddress"
    @on-delete="deleteAddress"
  />
</template>
<script>
import AddressCreate from "@/components/AddressCreate.vue";
import AddressEdit from "@/components/AddressEdit.vue";
import { Wallet } from "secretjs";
export default {
  components: { AddressCreate, AddressEdit },
  data() {
    return {
      addressCreateOpen: false,
      addressEditOpen: false,
      keyPairs: null,
      mnemonicNew: "",
      addressNew: "",
      addressEdit: "",
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
    displayAddressCreate() {
      const wallet = new Wallet();
      this.addressNew = wallet.address;
      this.mnemonicNew = wallet.mnemonic;
      this.addressCreateOpen = true;
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
      // not yet implemented
      this.addressEditOpen = false;
    },
    saveNewKey() {
      console.log(`${this.addressNew}`);
      window.settings.saveKey(this.addressNew, this.mnemonicNew);
      this.loadKeyPairs();
      this.addressCreateOpen = false;
    },
    loadKeyPairs() {
      window.settings
        .getStoreValue("keyPairs")
        .then((result) => {
          this.keyPairs = result;
          console.dir(result);
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
