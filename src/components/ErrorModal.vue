<template>
  <div class="modal is-active">
    <div class="modal-background" @click="$emit('onClose')"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Error</p>
        <button class="delete" aria-label="close" @click="$emit('onClose')"></button>
      </header>
      <section class="modal-card-body">
        <div class="block">
          <p>
            {{ message }}
          </p>
        </div>
      </section>
      <footer class="modal-card-foot">
        <div class="buttons">
          <button class="button" @click="$emit('onClose')">OK</button>
        </div>
      </footer>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    message: {
      type: String,
      default: "Error!",
    },
  },
  emits: ["onClose"],
};
</script>
