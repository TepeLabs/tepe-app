<template>
  <div class="modal is-active">
    <div class="modal-background" @click="$emit('onClose')"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">File</p>
        <button class="delete" aria-label="close" @click="$emit('onClose')"></button>
      </header>
      <section class="modal-card-body">
        <p>
          {{ content }}
        </p>
      </section>
      <footer class="modal-card-foot">
        <button class="button" @click="$emit('onClose')">Close</button>
      </footer>
    </div>
  </div>
</template>
<script>
export default {
  emits: ["onClose"],
  props: {
    content: {
      type: String,
    },
  },
};
</script>
