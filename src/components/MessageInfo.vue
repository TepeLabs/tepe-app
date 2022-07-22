<template>
  <nav
    class="navbar is-fixed-bottom ml-2 mb-2"
    :style="{
      'animation-duration': duration.toString() + 's',
      'animation-name': 'slidein',
    }"
  >
    <article class="message navbar-end is-success">
      <div class="message-body">
        {{ message }}
      </div>
    </article>
  </nav>
</template>
<script>
export default {
  props: {
    message: {
      type: String,
      default: "Error!",
    },
    duration: {
      type: Number,
      default: 5, // seconds
    },
  },
  emits: ["onClose"],
  mounted() {
    setTimeout(() => {
      this.$emit("onClose");
      console.log("close message");
    }, this.duration * 1000 - 200);
    // There is a slight delay between end of animation and $emit.
  },
};
</script>
<style>
@keyframes slidein {
  0%,
  100% {
    margin-left: 100%;
    width: 200%;
  }
  20%,
  80% {
    margin-left: 0%;
    width: 100%;
  }
}
</style>
