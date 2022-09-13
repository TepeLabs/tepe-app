<template>
  <div class="modal is-active">
    <div class="modal-background" @click="$emit('onClose')"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Add a channel</p>
        <button class="delete" aria-label="close" @click="$emit('onClose')"></button>
      </header>
      <section class="modal-card-body">
        <strong class="is-size-5">Create a new channel</strong>
        <div class="field">
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="Name"
              v-model="name"
              @keyup.enter="$emit('onCreate', name)"
            />
          </div>
        </div>
      </section>
      <footer class="modal-card-foot is-centered">
        <button class="button is-success" @click="$emit('onCreate', name)">Create</button>
        <button class="button" @click="$emit('onClose')">Cancel</button>
      </footer>
      <section class="modal-card-body">
        <strong class="is-size-5">Import an existing channel by address</strong>
        <div class="field">
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="Address"
              v-model="channelAddress"
              @keyup.enter="$emit('onImport', importName, channelAddress)"
            />
          </div>
        </div>
        <div class="control">
            <input
              class="input"
              type="text"
              placeholder="Name"
              v-model="importName"
              @keyup.enter="$emit('onImport', importName, channelAddress)"
            />
          </div>
      </section>
      <footer class="modal-card-foot is-centered">
        <button class="button is-success" @click="$emit('onImport', importName, channelAddress)">Import</button>
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
    };
  },
  emits: ["onCreate", "onImport", "onClose"],
};
</script>
