<template>
  <div class="modal" :class="{ 'is-active': isOpen }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Create a new channel token</p>
        <button class="delete" aria-label="close" @click="$emit('onClose')"></button>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label for="label">Name</label>
          <div class="control">
            <input class="input" type="text" placeholder="Name">
          </div>
        </div>
      </section>
      <footer class="modal-card-foot is-centered">
        <button class="button is-success" @click="$emit('onCreate')">Create</button>
        <button class="button" @click="$emit('onClose')">Cancel</button>
      </footer>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  methods: {},
  mounted() {},
};
</script>
