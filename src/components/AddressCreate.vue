<template>
  <div class="modal" :class="{ 'is-active': isOpen }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">
          Recovery phrase for 
          <span class="is-family-monospace">{{ address.slice(0,6)+'...'+address.slice(-4) }}</span>
        </p>
        <button class="delete" aria-label="close" @click="$emit('onClose')"></button>
      </header>
      <section class="modal-card-body">
        <!-- Content ... -->
        <div class="block">
          <h6 class="title is-6">Write down in a secure place.</h6>
          <p>
            {{ mnemonic }}
          </p>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-success" @click="$emit('onKeep')">Keep</button>
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
    address: {
      type: String,
    },
    mnemonic: {
      type: String,
      required: false
    },
  },
  methods: {},
  mounted() {},
};
</script>
