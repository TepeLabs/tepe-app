<template>
  <div class="modal is-active">
    <div class="modal-background" @click="$emit('onClose')"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Manage address</p>
        <button class="delete" aria-label="close" @click="$emit('onClose')"></button>
      </header>
      <section class="modal-card-body" v-if="!confirmDelete">
        <div class="block has-text-centered">
          <span class="is-family-monospace">{{ address }}</span>
        </div>
        <div class="buttons is-centered">
          <button class="button is-success" v-if="!isSelected" @click="$emit('onSelect')">
            Select
          </button>
          <button class="button is-success" v-if="isSelected" disabled>Selected</button>
          <button class="button is-danger" @click="confirmDelete = true">Delete</button>
        </div>
      </section>
      <section class="modal-card-body" v-if="confirmDelete">
        <div class="block has-text-centered">
          Are you sure you want to delete
          <span class="is-family-monospace">{{ address }}</span
          >?
        </div>
        <div class="buttons is-centered">
          <button class="button" @click="confirmDelete = false">Cancel</button>
          <button class="button is-danger" @click="$emit('onDelete')">Delete</button>
        </div>
      </section>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    isSelected: {
      type: Boolean,
      required: true,
      default: false,
    },
    address: {
      type: String,
    },
  },
  data() {
    return {
      confirmDelete: false,
    };
  },
  methods: {},
  mounted() {},
  emits: ["onClose", "onSelect", "onDelete"],
};
</script>
