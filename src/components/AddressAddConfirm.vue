<template>
  <div v-if="isShown">
    <header class="modal-card-head">
      <p class="modal-card-title">Add Address</p>
      <button class="delete" aria-label="close" @click="$emit('onClose')"></button>
    </header>
    <section class="modal-card-body">
      <div class="block has-text-centered">
        <span class="is-family-monospace">{{ address }}</span>
      </div>
      <div class="block">
        <p>Please confirm your secret recovery phrase by correctly writing the phrase.</p>
      </div>
      <div class="box">
        <div class="columns" v-for="i in [0, 4, 8, 12, 16, 20]" :key="i">
          <div class="column" v-for="j in [i + 0, i + 1, i + 2, i + 3]" :key="j">
            <input
              type="text"
              class="input"
              :class="{ 'is-primary': words[j] === mnemonic.split(' ')[j] }"
              :placeholder="`Word ${j + 1}`"
              v-model="words[j]"
            />
          </div>
        </div>
      </div>
    </section>
    <footer class="modal-card-foot">
      <button class="button" @click="$emit('onBack')">Back</button>
      <button
        class="button is-success"
        @click="$emit('onConfirm')"
        :disabled="correctWords"
      >
        Confirm
      </button>
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
    address: {
      type: String,
    },
    mnemonic: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      words: new Array(24),
    };
  },
  computed: {
    correctWords() {
      return this.words.join(" ") != this.mnemonic;
    },
  },
  mounted() {},
  emits: ["onClose", "onBack", "onConfirm"],
};
</script>
