<template>
  <div class="columns">
    <div class="column">
      <div class="table-container">
        <table class="table is-fullwidth mt-1">
          <colgroup>
            <col style="width: 10%" />
            <col style="width: 90%" />
            <col style="width: 10%" />
          </colgroup>
          <thead>
            <tr>
              <th></th>
              <th style="font-size: 28px">Channels</th>
              <th>
                <button class="button" @click="channelCreateOpen = true" title="Add channel">
                 <font-awesome-icon :icon="faCircleDot" /> &nbsp; Add channel
                </button>
              </th>
              <th>
                <button class="button" @click="addressBookOpen = true" title="Address book">
                  <font-awesome-icon :icon="faAddressBook" /> &nbsp; Address book
                </button>
              </th>
              <th>
                <button class="button" @click="manageWallet()" title="Manage wallet">
                  <font-awesome-icon :icon="faWallet" /> &nbsp; Manage wallet
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in channelList" :key="item.name">
              <td class="is-vcentered">
                <font-awesome-icon :icon="faCircleDot" size="2x" class="ml-3" />
              </td>
              <td>
                <p>
                  <strong> {{ item.name }}</strong>
                </p>
                <p>
                  {{ item.address }}
                  <a @click="copyToClipboard(index)" title="Copy address">
                    <font-awesome-icon :icon="faCopy" v-if="!copiedToClipboard[index]" />
                    <font-awesome-icon :icon="faCheck" v-if="copiedToClipboard[index]" />
                  </a>
                </p>
              </td>
              <td></td>
              <td>
                <button class="button" @click="openChannel(index)" title="Open channel">
                  <font-awesome-icon :icon="faMagnifyingGlass" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <ChannelCreate v-if="channelCreateOpen" @on-close="channelCreateOpen = false" @on-create="createChannel"
    @on-import="importChannel" />
  <AddressBookEdit v-if="addressBookOpen" @on-close="addressBookOpen = false" @on-save="addressBookSaveChanges"
    v-bind:addressBook="addressBook" />
  <MessageError v-if="messageError.length > 0" :message="messageError" @on-close="messageError = ''" />
  <MessageInfo v-if="messageInfo.length > 0" :message="messageInfo" @on-close="messageInfo = ''" />
  <WalletUnlock v-if="walletUnlockOpen" @on-unlock="unlockWallet" />
</template>
<script>
import ChannelCreate from "@/components/ChannelCreate.vue";
import AddressBookEdit from "@/components/AddressBookEdit.vue";
import MessageError from "@/components/MessageError.vue";
import MessageInfo from "@/components/MessageInfo.vue";
import secret from "@/utils/UtilSecret";
import { Wallet } from "secretjs";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faPlus, faCircleDot, faCopy, faCheck, faMagnifyingGlass, faWallet } from "@fortawesome/free-solid-svg-icons";
import { faAddressBook } from "@fortawesome/free-regular-svg-icons";
import WalletUnlock from "../components/WalletUnlock.vue";
export default {
  components: { ChannelCreate, AddressBookEdit, MessageError, MessageInfo, FontAwesomeIcon, WalletUnlock },
  data() {
    return {
      messageError: "",
      messageInfo: "",
      channelList: "",
      channelCreateOpen: false,
      addressBookOpen: false,
      walletUnlockOpen: false,
      copiedToClipboard: [],
      faPlus: faPlus,
      faCircleDot: faCircleDot,
      faCopy: faCopy,
      faCheck: faCheck,
      faWallet: faWallet,
      faMagnifyingGlass: faMagnifyingGlass,
      faAddressBook: faAddressBook,
      addressBook: [],
    };
  },
  methods: {
    addressBookSaveChanges(addressEntries) {
      let addressBookCopy = [];
      for (let index in addressEntries) {
        addressBookCopy = addressBookCopy.concat(JSON.parse(JSON.stringify(addressEntries[index])));
      }
      // this.addressBook = addressBookCopy;
      this.addressBookOpen = false;
      window.settings.getCurrentKey()
        .then((wallet) => {
          window.settings.saveAddressBook(wallet.public, addressBookCopy).then(() => {
            window.settings.getAddressBook(wallet.public).then((res) => {
              this.addressBook = res;
            });
          });
        });

    },
    createChannel(name) {
      window.settings.getCurrentKey()
        .then((wallet) => {
          let label = `${wallet.address}_${Date.now()}_${name}`;
          this.messageInfo = "Creating channel...";
          let secretjs_wallet_object = new Wallet(wallet.mnemonic);
          secret.instantiateContract(secretjs_wallet_object, label)
            .then((channelAddress) => {
              console.log(`contract address ${channelAddress}`);
              this.messageInfo = `Channel created with address ${channelAddress}!`;
              // save address to cache
              window.settings.saveChannel(wallet.public, channelAddress, name);
              this.loadChannelList();
              // mint a token for the admin to start
              secret.mintNFT(secretjs_wallet_object, channelAddress, wallet.public, 1).then((mintResult) => {
                console.log(`Minted NFT with result "${mintResult[0]}"`);
              }).catch((error) => {
                console.error(`Minting failed with error ${error}.`);
              });
            });
        })
        .catch((error) => {
          console.error(`Contract instantiation failed with error "${error}."`);
          this.messageError = error.message;
        });
      this.channelCreateOpen = false;
    },
    importChannel(importName, channelAddress) {
      window.settings.getCurrentKey().then((wallet) => {
        window.settings.saveChannel(wallet.public, channelAddress, importName);
        this.loadChannelList();
        // query channels for account - update
        this.messageInfo = `Channel import with address ${channelAddress}!`;
      })
      this.channelCreateOpen = false;
    },
    openChannel(index) {
      console.log('open channel ', index);
      this.$router.push(`/channel/${this.channelList[index].address}`);
    },
    manageWallet() {
      this.$router.push('/wallet');
    },
    loadAddresses() {
      window.settings.getCurrentKey()
        .then((wallet) => {
          window.settings.getAddressBook(wallet.public).then((res) => {
            this.addressBook = res;
          });
        });
    },
    loadChannelList() {
      window.settings.getCurrentKey()
        .then((wallet) => window.settings.getChannels(wallet.public))
        .then((result) => {
          this.channelList = result;
          this.copiedToClipboard = Array(result.length).fill(false);
        })
        .catch((err) => {
          console.log(`Error loading channels <${err}>.`);
        });
    },
    unlockWallet() {
      this.walletUnlockOpen = false;
      this.loadChannelList();
      this.loadAddresses();
    },
    copyToClipboard(index) {
      let address = this.channelList[index].address;
      navigator.clipboard.writeText(address);
      this.copiedToClipboard[index] = true;
      setTimeout(() => {
        this.copiedToClipboard[index] = false;
      }, 1200);
    },
  },
  mounted() {
    console.log("ViewCollection: Mounted.");
    window.settings.walletUnlocked()
      .then((unlocked) => {
        if (unlocked) {
          this.walletUnlockOpen = false;
          this.loadChannelList();
          this.loadAddresses();
        } else {
          this.walletUnlockOpen = true;
        }
      })
      .catch((error) => {
        console.log(`Error: ${error}`);
      });

  },
};
</script>
