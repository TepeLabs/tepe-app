<template>
  <header class="modal-card-head">
    <p class="modal-card-title">Add Address</p>
    <button class="delete" aria-label="close" @click="$emit('onClose')"></button>
  </header>
  <section class="modal-card-body">
    <div class="block">
      <nav class="level">
        <div class="level-left">
          <p class="level-item">Please write your secret recovery phrase.</p>
        </div>
        <div class="level-right">
          <label class="checkbox">
            <input type="checkbox" v-model="onePhrase">
            as one phrase
          </label>
        </div>
      </nav>
    </div>
    <div class="box" v-if="onePhrase">
      <div class="control">
        <textarea class="textarea" placeholder="secret recovery phrase" v-model="text"></textarea>
      </div>
    </div>
    <div class="box" v-if="!onePhrase">
      <div class="columns" v-for="i in [0, 4, 8, 12, 16, 20]" :key="i">
        <div class="column" v-for="j in [i + 0, i + 1, i + 2, i + 3]" :key="j">
          <input type="text" class="input" :class="{ 'is-primary': words[j] ? words[j].length >= 4 : false }"
            :placeholder="`Word ${j + 1}`" v-model="words[j]" />
        </div>
      </div>
    </div>
  </section>
  <footer class="modal-card-foot">
    <button class="button" @click="$emit('onBack')">Back</button>
    <button class="button is-success" @click="onImportButtonClicked">
      Import
    </button>
  </footer>
</template>
<script>
export default {
  data() {
    return {
      onePhrase: false,
      text: "",
      words: Array(24).fill(""),
    };
  },
  methods: {
    onImportButtonClicked() {
      if (this.onePhrase) {
        this.$emit("onImport", this.text);
      } else {
        this.$emit("onImport", this.words.join(" "));
      }
      this.text = "";
      this.words = Array(24).fill("");
    },
  },
  emits: ["onBack", "onClose", "onImport"],
};
</script>
