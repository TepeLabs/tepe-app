<template>
  <div class="modal is-active">
    <div class="modal-background" @click="$emit('onClose')"></div>
    <div class="modal-card">
      <WalletAddSelect
        v-if="viewShow == 'select'"
        @on-close="$emit('onClose')"
        @on-create="onCreate"
        @on-import="viewShow = 'import'"
      />
      <WalletAddNew
        v-if="viewShow == 'new'"
        :address="address"
        :mnemonic="mnemonic"
        @on-close="$emit('onClose')"
        @on-back="viewShow = 'select'"
        @on-next="viewShow = 'confirm'"
      />
      <WalletAddConfirm
        v-if="viewShow == 'confirm'"
        :address="address"
        :mnemonic="mnemonic"
        @on-back="viewShow = 'new'"
        @on-close="$emit('onClose')"
        @on-confirm="confirmMnemonic"
      />
      <WalletAddImport
        v-if="viewShow == 'import'"
        @on-back="viewShow = 'select'"
        @on-close="$emit('onClose')"
        @on-import="importMnemonic"
      />
    </div>
  </div>
</template>
<script>
import WalletAddSelect from "@/components/WalletAddSelect.vue";
import WalletAddNew from "@/components/WalletAddNew.vue";
import WalletAddConfirm from "@/components/WalletAddConfirm.vue";
import WalletAddImport from "@/components/WalletAddImport.vue";
export default {
  components: {
    WalletAddSelect,
    WalletAddNew,
    WalletAddConfirm,
    WalletAddImport,
  },
  data() {
    return {
      viewShow: "select",
    };
  },
  props: {
    address: {
      type: String,
    },
    mnemonic: {
      type: String,
      required: false,
    },
  },
  methods: {
    onCreate() {
      this.$emit("onCreate");
      this.viewShow = "new";
    },
    confirmMnemonic() {
      this.$emit("onConfirm");
      this.viewShow = "select";
    },
    importMnemonic(mnemonic) {
      this.$emit("onImport", mnemonic);
      this.viewShow = "select";
    },
  },
  mounted() {},
  emits: ["onClose", "onCreate", "onImport"],
};
</script>
