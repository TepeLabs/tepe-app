<template>
  <div class="block">
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
            <span class="icon is-small">
              <i class="fas fa-solid fa-arrow-left"></i>
            </span>
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
        <div class="navbar-end">
          <router-link class="navbar-item" to="/wallet" @click="isOpen = false"
            >Wallet</router-link
          >
        </div>
      </div>
    </nav>
  </div>
</template>
<script>
export default {
  props: {
    showBackButton: {
      type: Boolean,
      default: false,
    },
  },
  data: function () {
    return {
      isOpen: false,
    };
  },
};
</script>
