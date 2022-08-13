<template>
  <nav class="navbar is-fixed-bottom ml-2 mb-2" :class="{ slidein: animating }">
    <article class="message navbar-end is-success">
      <div class="message-body">
        {{ message }}
      </div>
    </article>
  </nav>
</template>
<script>
export default {
  data() {
    return {
      animating: false,
      timer: null,
    };
  },
  props: {
    message: {
      type: String,
      default: "Error!",
    },
    duration: {
      type: Number,
      default: 3, // seconds
    },
  },
  emits: ["onClose"],
  watch: {
    // watcher doesn't work...
    // message: {
    //   handler: function (newMessage, oldMessage) {
    //     if (this.timer) {
    //       console.log("Clearing timeout.");
    //       clearTimeout(this.timer);
    //     }
    //   },
    //   deep: true,
    // },
  },
  mounted() {
    this.animating = true;
    this.timer = setTimeout(() => {
      this.animating = false;
      this.$emit("onClose");
    }, this.duration * 1000 - 100);
  },
};
</script>
<style>
.slidein {
  animation: slidein 3s;
}

@keyframes slidein {
  0% {
    transform: translateX(100%);
  }

  10% {
    transform: translateX(0%);
  }

  90% {
    transform: translateX(0.1%);
  }

  100% {
    transform: translateX(100%);
  }
}
</style>
