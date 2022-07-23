<template>
  <TheNavigation :show-back-button="showBackButton" />
  <div class="container">
    <router-view></router-view>
  </div>
</template>

<script>
import TheNavigation from "@/components/TheNavigation.vue";
export default {
  components: { TheNavigation },
  computed: {
    showBackButton() {
      let routerName = this.$router.currentRoute.value.name;
      return routerName != "Collection" && routerName != "Wallet";
    },
  },
  mounted() {
    this.$router.push("/");
  },
};
</script>
<style lang="scss">
@import "../node_modules/bulma/bulma.sass";
</style>
