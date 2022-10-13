<template>
  <div class="modal is-active">
    <div class="modal-background" @click="$emit('onClose')"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Remove channel?</p>
        <button class="delete" aria-label="close" @click="$emit('onClose')"></button>
      </header>
      <section class="modal-card-body">
        <div class="block">
          <p>Are you sure you want to remove this channel?</p>
          <p>It will still be available on the blockchain to add later.</p>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button" @click="$emit('onClose')">Close</button>
        <button class="button is-danger" @click="$emit('onConfirm')">
          Confirm
        </button>
      </footer>
    </div>
  </div>
</template>
<script>
export default {
  emits: ["onClose", "onConfirm"],
};
</script>
