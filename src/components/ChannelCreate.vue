<template>
  <div class="modal is-active">
    <div class="modal-background" @click="$emit('onClose')"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Add a channel</p>
        <button class="delete" aria-label="close" @click="$emit('onClose')"></button>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <div class="control">
            <input type="radio" id="create" value="create" v-model="add">
            <label for="create"> Create </label>
            <input type="radio" id="import" value="import" v-model="add">
            <label for="import"> Import</label>
          </div>
        </div>
        <div class="field" v-if="add == 'create'">
          <div class="control">
            <input class="input" type="text" placeholder="Name" v-model="name" @keyup.enter="$emit('onCreate', name)" />
          </div>
        </div>
        <div class="field" v-if="add == 'import'">
          <div class="control">
            <input class="input" type="text" placeholder="Name" v-model="name"
              @keyup.enter="$emit('onImport', name, channelAddress)" />
          </div>
        </div>
        <div class="field" v-if="add == 'import'">
          <div class="control">
            <input class="input" type="text" placeholder="Address" v-model="channelAddress"
              @keyup.enter="$emit('onImport', name, channelAddress)" />
          </div>
        </div>
      </section>
      <footer class="modal-card-foot is-centered">
        <button class="button is-success" @click="$emit('onCreate', name)" v-if="add == 'create'">Create</button>
        <button class="button is-success" @click="$emit('onImport', name, channelAddress)"
          v-if="add == 'import'">Import</button>
        <button class="button" @click="$emit('onClose')">Cancel</button>
      </footer>
    </div>
  </div>

</template>
<script>
export default {
  data() {
    return {
      name: "",
      channelAddress: "",
      add: "create",
    };
  },
  emits: ["onCreate", "onImport", "onClose"],
};
</script>
