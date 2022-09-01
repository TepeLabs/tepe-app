<template>
  <div class="modal is-active">
    <div class="modal-background" @click="$emit('onClose')"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Set token data</p>
        <button class="delete" aria-label="close" @click="$emit('onClose')"></button>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <textarea class="textarea" placeholder="Write your secret text here!" v-model="text"></textarea>
        </div>
        <div class="field">
          <div class="control">
            <a class="button is-success" @click="$emit('onSet', text)"> Set </a>
          </div>
        </div>
      </section>
      <footer class="modal-card-foot"></footer>
    </div>
  </div>
</template>
<script>
// import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
export default {
  // components: { FontAwesomeIcon },
  data() {
    return {
      text: "",
    };
  },
  emits: ["onSet", "onClose"],
};
</script>
