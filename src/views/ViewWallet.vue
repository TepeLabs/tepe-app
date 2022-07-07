<template>
  <div class="columns is-centered">
    <div class="column is-three-quarters" v-if="hasKeyPairs">
      <table class="table is-fullwidth is-striped is-hoverable is-striped">
        <thead>
          <tr>
            <th></th>
            <th>Address</th>
            <th >
              <button class="button is-small" @click="displayNewKey">+</button>
            </th>
          </tr>
        </thead>
        <tbody v-for="(keyPair, index) in keyPairs" :key="keyPair.address">
          <tr :class="{ 'is-selected': false }">
            <td>{{ index + 1 }}</td>
            <td>{{ keyPair.address }}</td>
            <td>
              <button class="button is-small">···</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="columns is-centered" v-if="!hasKeyPairs">
    <div class="column is-three-quarters has-text-centered">
      <button class="button" @click="displayNewKey">Create new wallet</button>
    </div>
  </div>
  <AddressCreate
    :is-open="modalIsOpen"
    :address="address"
    :mnemonic="mnemonic"
    @on-close="modalIsOpen = false"
    @on-keep="keepNewKey"
  />
</template>
<script>
import AddressCreate from "@/components/AddressCreate.vue";
import { Wallet } from "secretjs";
export default {
  components: { AddressCreate },
  data() {
    return {
      modalIsOpen: false,
      keyPairs: null,
      address: "",
      mnemonic: "",
    };
  },
  computed: {
    hasKeyPairs() {
      return this.keyPairs && this.keyPairs.length>0
    }
  },
  methods: {
    displayNewKey() {
      const wallet = new Wallet()
      this.address = wallet.address
      this.mnemonic = wallet.mnemonic
      this.modalIsOpen = true;
    },
    keepNewKey() {
      console.log(`${this.address}`);
      window.settings.saveKey(this.address, this.mnemonic)
      this.loadKeyPairs()
      this.modalIsOpen = false;
    },
    loadKeyPairs() {
      window.settings.getStoreValue('keyPairs').then((result) => {
        this.keyPairs = result
        console.dir(result)
      }).catch((err) => {
        console.log(`Error loading key pairs <${err}>.`)
      });
    }
  },
  mounted() {
    console.log("ViewWallet: Mounted.")
    this.loadKeyPairs()
  },
};
</script>
