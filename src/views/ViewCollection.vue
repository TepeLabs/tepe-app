<template>
  <div class="columns is-centered">
    <div class="column is-three-quarters">
      <table class="table is-fullwidth is-striped is-hoverable is-striped">
        <colgroup>
          <col style="width: 10%" />
          <col style="width: 80%" />
          <col style="width: 10%" />
        </colgroup>
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>
              <button class="button is-small" @click="createChannel">+</button>
            </th>
          </tr>
        </thead>
        <tbody v-for="(item, index) in collection" :key="item.name">
          <tr>
            <td>{{ index + 1 }}</td>
            <td>{{ item.name }}</td>
            <td>
              <button class="button is-small" @click="editChannel">···</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import sourceData from "@/assets/data.json";
export default {
  data() {
    return {
      collection: sourceData.collection,
    };
  },
  methods: {
    createChannel() {},
    editChannel() {},
  },
  mounted() {},
};
</script>
