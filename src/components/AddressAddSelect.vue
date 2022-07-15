<template>
  <div v-if="isShown">
    <header class="modal-card-head">
      <p class="modal-card-title">Add address</p>
      <button class="delete" aria-label="close" @click="$emit('onClose')"></button>
    </header>
    <section class="modal-card-body">
      <div class="block">
        <p>
          Wallet address are like PO boxes. The address is one "spot" in the
          <a href="http://scrt.network">Secret Network</a>, just as you can have a PO box
          in the Post Office.
        </p>
      </div>
      <div class="block">
        <p>
          You can have tokens sent to them, and you can send tokens from them. The tokens
          are like keys to portals that only holders of the key can access.
        </p>
      </div>
    </section>
    <footer class="modal-card-foot">
      <div class="buttons">
        <button class="button" @click="$emit('onCreate')">Create new address</button>
        <button class="button" @click="$emit('onImport')">Import address</button>
      </div>
    </footer>
  </div>
</template>
<script>
export default {
  props: {
    isShown: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["onClose", "onCreate", "onImport"],
};
</script>
