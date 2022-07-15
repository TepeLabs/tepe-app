<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <router-link
        class="navbar-item mt-2 ml-1"
        to="/"
        @click="isOpen = false"
        v-if="!showBackButton"
      >
        <img class="mr-2" src="@/assets/olive-logo.png" width="28" height="28" />
        <h1 class="title">Olive</h1>
      </router-link>
      <router-link
        class="navbar-item mt-2 ml-1"
        to="/"
        @click="isOpen = false"
        v-if="showBackButton"
      >
        <button class="button">
          <font-awesome-icon :icon="faArrowLeft" />
        </button>
      </router-link>
      <a
        role="button"
        class="navbar-burger"
        aria-label="menu"
        aria-expanded="false"
        @click="isOpen = !isOpen"
        :class="{ 'is-active': isOpen }"
        v-if="!showBackButton"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div class="navbar-menu" :class="{ 'is-active': isOpen }">
      <div class="navbar-end" style="text-align: right">
        <router-link class="navbar-item" to="/wallet" @click="isOpen = false">
          <font-awesome-icon :icon="faWallet" size="2x" />
        </router-link>
      </div>
    </div>
  </nav>
</template>
<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faWallet, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

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
      isOpen: false,
      faWallet: faWallet,
      faArrowLeft: faArrowLeft,
    };
  },
};
</script>
