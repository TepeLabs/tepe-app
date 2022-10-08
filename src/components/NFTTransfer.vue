<template>
  <div class="modal is-active">
    <div class="modal-background" @click="$emit('onClose')"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Transfer token to other address</p>
        <button class="delete" aria-label="close" @click="$emit('onClose')"></button>
      </header>
      <section class="modal-card-body">
        <div class="field has-addons has-addons-centered">
          <div class="control">
            <input
              class="input"
              type="text"
              v-model="recipientAddress"
              placeholder="Recipient Address"
              @keyup.enter="$emit('onTransfer', recipientAddress, number)"
            />
          </div>
          <div class="control has-icons-left">
            <input
              class="input"
              type="number"
              v-model="number"
              placeholder="Number to transfer"
              @keyup.enter="$emit('onMint', recipientAddress, number)"
            />
            <span class="icon is-medium is-left">
              <FontAwesomeIcon :icon="faHashtag" />
            </span>
          </div>
          <div class="control">
            <a class="button is-success" @click="$emit('onTransfer', recipientAddress, number)"> Transfer </a>
          </div>
        </div>
      </section>
      <footer class="modal-card-foot"></footer>
    </div>
  </div>
</template>
<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faHashtag } from "@fortawesome/free-solid-svg-icons";
export default {
  components: { FontAwesomeIcon },
  data() {
    return {
      faHashtag: faHashtag,
      recipientAddress: "",
      number: 1,
    };
  },
  emits: ["onTransfer", "onClose"],
};
</script>
