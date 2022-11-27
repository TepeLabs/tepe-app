<template>
  <nav class="navbar is-white has-shadow">
    <div class="navbar-brand">
      <router-link
        class="navbar-item ml-1"
        to="/"
        v-if="!showBackButton"
      >
        <img class="mr-2" src="@/assets/tepe-logo.png" width="28" height="28" />
        <h1 class="title">Tepe</h1>
      </router-link>
      <router-link
        class="navbar-item ml-1"
        to="/"
        v-if="showBackButton"
      >
        <button class="button">
          <font-awesome-icon :icon="faArrowLeft" />
        </button>
      </router-link>
    </div>
  </nav>
</template>
<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default {
  components: { FontAwesomeIcon },
  props: {
    showBackButton: {
      type: Boolean,
      default: false,
    },
  },
  data: function () {
    return {
      faArrowLeft: faArrowLeft,
    };
  },
};
</script>
