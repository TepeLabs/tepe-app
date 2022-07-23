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
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus molestiae
          repellendus amet quos suscipit nesciunt voluptate qui quaerat eos vero adipisci
          deserunt iusto error voluptatem harum molestias et cumque ea quas animi,
          facilis, quae placeat illo necessitatibus! Reprehenderit, excepturi quam.
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
};
</script>
