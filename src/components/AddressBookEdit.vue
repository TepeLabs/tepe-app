<template>
  <div class="modal is-active">
    <div class="modal-background" @click="$emit('onClose')"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Edit Address Book</p>
        <button class="delete" aria-label="close" @click="$emit('onClose')"></button>
      </header>
      <section class="modal-card-body">

      <div v-for="(item, index) in modifiedAddressBook" :key="index">
        <div class="field">
          <div class="control">
            <input class="input" type="text" v-model="item.name" />
          </div>
        </div>
        <div class="field">
          <div class="control">
            <input class="input" type="text" v-model="item.address"/>
          </div>
        </div>
        <button @click="editItem(item.name, item.address, index)">Edit</button>
        <button @click="deleteItem(index)">Delete</button>
      </div>
      <hr>
      <div>
        <div class="field">
          <div class="control">
            <input class="input" type="text" placeholder="Name" v-model="this.newName"/>
          </div>
        </div>
        <div class="field">
          <div class="control">
            <input class="input" type="text" placeholder="Address" v-model="this.newAddress"/>
          </div>
        </div>
        <button @click="addItem(this.newName, this.newAddress)">Add</button>
      </div>
      </section>
      <footer class="modal-card-foot is-centered">
        <button class="button is-success" @click="$emit('onSave', this.modifiedAddressBook)">Save</button>
        <button class="button" @click="$emit('onClose')">Cancel</button>
      </footer>
    </div>
  </div>

</template>
<script>
export default {
  props: {
    addressBook: {
      address: {
        type: String,
        required: false,
      },
      name: {
        type: String,
        required: false,
      }
    }
  },
  emits: ["onSave", "onClose"],
  data() {
    return {
      modifiedAddressBook: [],
      newName: null, // these are so that adding an address can reset the placeholder fields
      newAddress: null,
    }
  },
  mounted () {
    for (let index in this.addressBook) {
      this.addItem(this.addressBook[index].name, this.addressBook[index].address);
    }
  },
  methods: {
    addItem(name, address) {
      this.modifiedAddressBook.push({address:address, name:name});
      this.newName = null;
      this.newAddress = null;
    },
    editItem(name, address, index) {
      this.modifiedAddressBook[index] = 
        {
          address: address,
          name: name,
        };
    },
    deleteItem(deletionIndex) {
      let temporaryAddressBook = [];
      for (let index in this.modifiedAddressBook) {
        if (index != deletionIndex) {
          temporaryAddressBook = temporaryAddressBook.concat(this.modifiedAddressBook[index]);
        }
      }
      this.modifiedAddressBook = temporaryAddressBook;
    },
  },
};
</script>
