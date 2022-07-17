<template>
  <div class="columns is-centered">
    <div class="column is-three-quarters">
      <nav class="level">
        <div class="level-left">
          <div class="level-item">
            <h2 class="is-size-3">Channels</h2>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <button>
              <font-awesome-icon
                :icon="faPlus"
                size="2x"
                @click="channelCreateOpen = true"
              />
            </button>
          </div>
        </div>
      </nav>
    </div>
  </div>
  <div class="columns is-centered">
    <div class="column is-three-quarters">
      <table class="table is-striped is-hoverable is-fullwidth">
        <colgroup>
          <col style="width: 5%" />
          <col style="width: 95%" />
        </colgroup>
        <tbody>
          <tr
            v-for="(item, index) in collection"
            :key="item.name"
            @click="openChannel(index)"
          >
            <td class="is-vcentered">
              <font-awesome-icon :icon="faCircleDot" size="2x" />
            </td>
            <td>
              <p>
                <strong>Lorem {{ index }}</strong>
              </p>
              <p>{{ item.name }}</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <ChannelCreate
    v-if="channelCreateOpen"
    @on-close="channelCreateOpen = false"
    @on-create="createChannel"
  />
</template>
<script>
import ChannelCreate from "@/components/ChannelCreate.vue";
import secret from "@/utils/UtilSecret";
import { Wallet } from "secretjs";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faPlus, faCircleDot } from "@fortawesome/free-solid-svg-icons";
import sourceData from "@/assets/data.json";
export default {
  components: { ChannelCreate, FontAwesomeIcon },
  data() {
    return {
      collection: sourceData.collection,
      channelCreateOpen: false,
      faPlus: faPlus,
      faCircleDot: faCircleDot,
    };
  },
  methods: {
    createChannel(name) {
      window.settings
        .getCurrentWallet()
        .then((result) => {
          let wallet = new Wallet(result.mnemonic);
          let label = `${wallet.address}_${Date.now()}_${name}`;
          return secret.instantiateContract(wallet, label);
        })
        .then((result) => {
          console.log(`contract address ${result}`);
        })
        .catch((error) => {
          // notify user
          console.error(`Contract instatiation failed with error ${error}.`);
        });
      this.channelCreateOpen = false;
    },
    openChannel(index) {
      this.$router.push(`/channel/${this.collection[index].address}`);
    },
  },
  mounted() {},
};
</script>
