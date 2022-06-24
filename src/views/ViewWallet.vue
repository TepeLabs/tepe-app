<template>
  <div class="block">
    <table class="table is-striped is-hoverable is-striped">
      <thead>
        <tr>
          <th></th>
          <th>Address</th>
          <th>
            <button class="button is-small" @click="makeNewKey">+</button>
          </th>
        </tr>
      </thead>
      <tbody v-for="[index, key] in keys.entries()" :key="key.public">
        <tr :class="{ 'is-selected': key.default }">
          <td>{{ index + 1 }}</td>
          <td>{{ key.public }}</td>
          <td>
            <button class="button is-small">···</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <AddressCreate
    :is-open="modalIsOpen"
    :address="address"
    
    @on-close="modalIsOpen = false"
    @on-keep="keepPhrase"
  />
</template>
<script>
import AddressCreate from "@/components/AddressCreate.vue";
import sourceData from "@/assets/keys.json";
import { Wallet } from "secretjs";
// import Store from "electron-store";

export default {
  components: { AddressCreate },
  data() {
    return {
      modalIsOpen: false,
      keys: sourceData.keys,
      address: "",
      mnenomic: "",
    };
  },
  methods: {
    makeNewKey() {
      const wallet = new Wallet();
      this.address = wallet.address;
      this.mnemonic = wallet.mnemonic;
      this.modalIsOpen = true;
    },
    keepPhrase() {
      console.log(`{this.address}`);
      this.modalIsOpen = false;
    },
  },
  mounted() {
    console.log("mounted");
    console.log(Wallet);
    const wallet = new Wallet();
    console.log(wallet);
    // const store = new Store();
    // store.set("unicorn", "🦄");
    // console.log(store.get("unicorn"));
  },
};
</script>
