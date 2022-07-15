<template>
  <div class="modal is-active">
    <div class="modal-background" @click="$emit('onClose')"></div>
    <div class="modal-card">
      <AddressAddSelect
        :is-shown="viewShow == 'select'"
        @on-close="$emit('onClose')"
        @on-create="onCreate"
        @on-import="viewShow = 'import'"
      />
      <AddressAddNew
        :is-shown="viewShow == 'new'"
        :address="address"
        :mnemonic="mnemonic"
        @on-close="$emit('onClose')"
        @on-back="viewShow = 'select'"
        @on-next="viewShow = 'confirm'"
      />
      <AddressAddConfirm
        :is-shown="viewShow == 'confirm'"
        :address="address"
        :mnemonic="mnemonic"
        @on-back="viewShow = 'new'"
        @on-close="$emit('onClose')"
        @on-confirm="confirmMnemonic"
      />
      <AddressAddImport
        :is-shown="viewShow == 'import'"
        @on-back="viewShow = 'select'"
        @on-close="$emit('onClose')"
        @on-import="importMnemonic"
      />
    </div>
  </div>
</template>
<script>
import AddressAddSelect from "@/components/AddressAddSelect.vue";
import AddressAddNew from "@/components/AddressAddNew.vue";
import AddressAddConfirm from "@/components/AddressAddConfirm.vue";
import AddressAddImport from "@/components/AddressAddImport.vue";
export default {
  components: {
    AddressAddSelect,
    AddressAddNew,
    AddressAddConfirm,
    AddressAddImport,
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
