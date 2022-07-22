<template>
  <div class="modal is-active">
    <div class="modal-background" @click="$emit('onClose')"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Create a new channel token</p>
        <button class="delete" aria-label="close" @click="$emit('onClose')"></button>
      </header>
      <section class="modal-card-body">
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
  emits: ["onCreate", "onClose"],
};
</script>
