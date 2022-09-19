<template>
  <div class="columns">
    <div class="column">
      <div class="table-container">
        <table class="table is-striped is-hoverable is-fullwidth mt-1">
          <colgroup>
            <col style="width: 10%" />
            <col style="width: 90%" />
            <col style="width: 10%" />
          </colgroup>
          <thead>
            <tr>
              <th></th>
              <th>Channels</th>
              <th>
                <button class="button is-small" @click="channelCreateOpen = true">
                  +
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in channelList" :key="item.name" @click="openChannel(index)">
              <td class="is-vcentered">
                <font-awesome-icon :icon="faCircleDot" size="2x" class="ml-3" />
              </td>
              <td>
                <p>
                  <strong> {{ item.name }}</strong>
                </p>
                <p>{{ item.address }}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <ChannelCreate v-if="channelCreateOpen" @on-close="channelCreateOpen = false" @on-create="createChannel"
    @on-import="importChannel" />
  <MessageError v-if="messageError.length > 0" :message="messageError" @on-close="messageError = ''" />
  <MessageInfo v-if="messageInfo.length > 0" :message="messageInfo" @on-close="messageInfo = ''" />
  <WalletUnlock v-if="walletUnlockOpen" @on-unlock="unlockWallet" />
</template>
<script>
import ChannelCreate from "@/components/ChannelCreate.vue";
import MessageError from "@/components/MessageError.vue";
import MessageInfo from "@/components/MessageInfo.vue";
import secret from "@/utils/UtilSecret";
import { Wallet } from "secretjs";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faPlus, faCircleDot } from "@fortawesome/free-solid-svg-icons";
// import sourceData from "@/assets/data.json";
import WalletUnlock from "../components/WalletUnlock.vue";
export default {
  components: { ChannelCreate, MessageError, MessageInfo, FontAwesomeIcon, WalletUnlock },
  data() {
    return {
      messageError: "",
      messageInfo: "",
      channelList: "",
      channelCreateOpen: false,
      walletUnlockOpen: false,
      faPlus: faPlus,
      faCircleDot: faCircleDot,
    };
  },
  methods: {
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
              // query channels for account - update
            })
        })
        .catch((error) => {
          console.error(`Contract instantiation failed with error "${error}."`);
          this.messageError = error.message;
        });
      // .then((result) => {
      //   console.log(`contract address ${result}`);
      //   // save address to cache
      //   window.settings.saveChannel(result, name);
      //   this.loadChannelList();
      //   // query channels for account - update
      //   this.messageInfo = `Channel created with address ${result}!`;
      // })
      // .catch((error) => {
      //   console.error(`Contract instantiation failed with error "${error}."`);
      //   this.messageError = error.message;
      // });
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
      this.$router.push(`/channel/${this.channelList[index].address}`);
    },
    loadChannelList() {
      window.settings.getCurrentKey()
        .then((wallet) => window.settings.getChannels(wallet.public))
        .then((result) => {
          this.channelList = result;
        })
        .catch((err) => {
          console.log(`Error loading channels <${err}>.`);
        });
    },
    unlockWallet() {
      this.walletUnlockOpen = false;
      // this.loadChannelList();
    }
  },
  mounted() {
    console.log("ViewCollection: Mounted.");
    // window.settings.initializeWalletList(sourceData.wallets);
    // window.settings.initializeChannelList(sourceData.channels);
    this.walletUnlockOpen = true;
  },
};
</script>
