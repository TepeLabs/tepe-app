<template>
  <div class="modal" :class="{ 'is-active': isOpen }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">
          <span class="is-family-monospace">{{ address.slice(0,10)+'...'+address.slice(-10) }}</span>
        </p>
        <button class="delete" aria-label="close" @click="$emit('onClose')"></button>
      </header>
      <section class="modal-card-body">
        <!-- Content ... -->
        <div class="buttons is-centered">
          <button class="button is-success" v-if="!isSelected" @click="$emit('onSelect')">Select</button>
          <button class="button is-success" v-if="isSelected" disabled>Selected</button>
          <button class="button" @click="$emit('onClose')">Cancel</button>
        </div>
        <div class="buttons is-centered">
          <button class="button is-danger" @click="$emit('onDelete')" disabled>Delete</button>
        </div>
      </section>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      required: true,
      default: false,
    },
    isSelected: {
      type: Boolean,
      required: true,
      default: false,
    },
    address: {
      type: String,
    },
  },
  methods: {},
  mounted() {},
};
</script>
