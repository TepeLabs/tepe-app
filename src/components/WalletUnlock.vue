<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p v-if="walletExists" class="modal-card-title">Unlock wallet</p>
        <p v-if="!walletExists" class="modal-card-title">Set password</p>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label">Password</label>
          <div class="control">
            <input v-if="walletExists" class="input" :class="{ 'is-danger': wrongPassword }" type="password"
              placeholder="Password" v-model="password" @keyup.enter="unlockWallet" @keyup="wrongPassword = false" />
            <input v-if="!walletExists" class="input" type="password" placeholder="Password" v-model="password"
              @keyup.enter="setPassword" />
          </div>
          <p v-if="wrongPassword" class="help is-danger">Wrong password</p>
        </div>
      </section>
      <footer class="modal-card-foot">
        <div class="field">
          <div class="control">
            <button v-if="walletExists" @on-click="unlockWallet" class="button is-primary">Unlock</button>
            <button v-if="!walletExists" @on-click="setPassword" class="button is-primary">Set</button>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      walletExists: false,
      wrongPassword: false,
      password: "",
    };
  },
  methods: {
    unlockWallet() {
      window.settings.unlockWallet(this.password)
        .then((unlocked) => {
          if (unlocked) {
            console.log('unlocked');
            this.$emit("onUnlock");
          } else {
            console.log('wrong password');
            this.wrongPassword = true;
          }
        })
        .catch(() => {
          console.log('Unlock failed.');
        });
    },
    setPassword() {
      console.log('settings password', this.password);
      window.settings.setPassword(this.password)
        .then(() => window.settings.unlockWallet(this.password))
        .then((unlocked) => {
          console.log('unlocked', unlocked);
          // this.$emit("onUnlock");
        })
        .catch((error) => console.log('Error settings password: ', error));
    }
  },
  mounted() {
    window.settings.walletExists()
      .then((exists) => {
        this.walletExists = exists;
      })
      .catch((error) => console.log('Error checking wallet existence: ', error));
  },
  emits: ["onUnlock"],
};
</script>
