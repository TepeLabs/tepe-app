<template>
  <div v-if="isShown">
    <header class="modal-card-head">
      <p class="modal-card-title">Add Address</p>
      <button class="delete" aria-label="close" @click="$emit('onClose')"></button>
    </header>
    <section class="modal-card-body">
      <div class="block">
        <p>Please write your secret recovery phrase.</p>
      </div>
      <div class="box">
        <div class="columns" v-for="i in [0, 4, 8, 12, 16, 20]" :key="i">
          <div class="column" v-for="j in [i + 0, i + 1, i + 2, i + 3]" :key="j">
            <input
              type="text"
              class="input"
              :class="{ 'is-primary': words[j] ? words[j].length >= 4 : false }"
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
        @click="onImportButtonClicked"
        :disabled="importButtonOff"
      >
        Import
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
  },
  data() {
    return {
      words: Array(24).fill(""),
    };
  },
  computed: {
    importButtonOff() {
      return this.words.some((x) => x.length < 4);
    },
  },
  methods: {
    onImportButtonClicked() {
      this.$emit("onImport", this.words.join(" "));
      this.words = Array(24).fill("");
    },
  },
  emits: ["onBack", "onClose", "onImport"],
};
</script>
