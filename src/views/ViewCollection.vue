<template>
  <div class="columns">
    <div class="column">
      <div class="table-container">
        <table class="table is-striped is-hoverable is-fullwidth mt-1">
          <colgroup>
            <col style="width: 8%" />
            <col style="width: 82%" />
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
            <tr v-for="(item, index) in collection" :key="item.name" @click="openChannel">
              <td class="has-text-centered">{{ index + 1 }}</td>
              <td>{{ item.name }}</td>
              <td>
                <button class="button is-small" @click="editChannel(index)">···</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <ChannelCreate
    :is-open="channelCreateOpen"
    @on-close="channelCreateOpen = false"
    @on-create="createChannel"
  />
</template>
<script>
import ChannelCreate from "@/components/ChannelCreate.vue";
import sourceData from "@/assets/data.json";
export default {
  components: { ChannelCreate },
  data() {
    return {
      collection: sourceData.collection,
      channelCreateOpen: false,
    };
  },
  methods: {
    createChannel() {},
    editChannel(index) {
      console.log(index);
    },
    openChannel() {
      this.$router.push("/channel");
    },
  },
  mounted() {},
};
</script>
