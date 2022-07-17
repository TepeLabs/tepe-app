<template>
  <header class="modal-card-head">
    <p class="modal-card-title">Add Address</p>
    <button class="delete" aria-label="close" @click="$emit('onClose')"></button>
  </header>
  <section class="modal-card-body">
    <div class="block has-text-centered">
      <span class="is-family-monospace">{{ address }}</span>
    </div>
    <div class="block">
      <p>
        Write down your secret recovery phrase for the above address in a
        <strong>secret</strong> and <strong>safe</strong> place. Never give this phrase to
        anyone. If you do, you will hand over control over your tokens!
      </p>
    </div>
    <div class="box">
      <div class="columns" v-for="i in [0, 4, 8, 12, 16, 20]" :key="i">
        <div class="column" v-for="j in [i + 0, i + 1, i + 2, i + 3]" :key="j">
          <p>{{ j + 1 }}. {{ mnemonic.split(" ")[j] }}</p>
        </div>
      </div>
    </div>
  </section>
  <footer class="modal-card-foot has-text-centered">
    <button class="button" @click="$emit('onBack')">Back</button>
    <button class="button is-success" @click="$emit('onNext')">Next</button>
  </footer>
</template>
<script>
export default {
  props: {
    address: {
      type: String,
    },
    mnemonic: {
      type: String,
      required: false,
    },
  },
  emits: ["onClose", "onBack", "onNext"],
};
</script>
