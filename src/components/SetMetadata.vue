<template>
  <div class="modal is-active">
    <div class="modal-background" @click="$emit('onClose')"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Set contract metadata</p>
        <button class="delete" aria-label="close" @click="$emit('onClose')"></button>
      </header>
      <section class="modal-card-body">
        <div class="field has-addons has-addons-centered">
          <div class="control">
            <input
              class="input"
              type="text"
              v-model="publicMetadata"
              placeholder="Public metadata"
              @keyup.enter="$emit('onSetMetadata', publicMetadata, privateMetadata)"
            />
          </div>
          <div class="control">
            <input
              class="input"
              type="text"
              v-model="privateMetadata"
              placeholder="Private metadata"
              @keyup.enter="$emit('onSetMetadata', publicMetadata, privateMetadata)"
            />
          </div>
          <div class="control">
            <a class="button is-success" @click="$emit('onSetMetadata', publicMetadata, privateMetadata)"> Set </a>
          </div>
        </div>
      </section>
      <footer class="modal-card-foot"></footer>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      publicMetadata: "",
      privateMetadata: "",
    };
  },
  emits: ["onSetMetadata", "onClose"],
};
</script>
