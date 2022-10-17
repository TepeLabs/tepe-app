<template>
  <div class="modal is-active">
    <div class="modal-background" @click="$emit('onClose')"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Mint new tokens</p>
        <button class="delete" aria-label="close" @click="$emit('onClose')"></button>
      </header>
      <section class="modal-card-body">
        <div class="field has-addons has-addons-centered">
          <div class="control">
            <input
              class="input"
              type="text"
              @input="onChange"
              @click="onChange"
              v-model="recipientAddress"
              placeholder="Recipient Address"
              @keydown.down="onArrowDown"
              @keydown.up="onArrowUp"
              @keydown.enter="onEnter"
            />
            <ul
              id="autocomplete-results"
              v-show="isOpen"
              class="autocomplete-results"
            >
              <li
                v-for="(result, i) in results"
                :key="i"
                @click="setResult(result)"
                class="autocomplete-result"
                :class="{ 'is-active': i === arrowCounter }"
              >
                {{ result }}
              </li>
            </ul>
            Leave blank to mint to yourself.
          </div>
          <div class="control has-icons-left">
            <input
              class="input"
              type="number"
              v-model="number"
              placeholder="Number to mint"
              @keyup.enter="$emit('onMint', recipientAddress, number)"
            />
            <span class="icon is-medium is-left">
              <FontAwesomeIcon :icon="faHashtag" />
            </span>
          </div>
          <div class="control">
            <a class="button is-success" @click="$emit('onMint', recipientAddress, number)"> Create </a>
          </div>
        </div>
      </section>
      <footer class="modal-card-foot"></footer>
    </div>
  </div>
</template>
<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faHashtag } from "@fortawesome/free-solid-svg-icons";
export default {
  components: { FontAwesomeIcon },
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
  data() {
    return {
      faHashtag: faHashtag,
      recipientAddress: "",
      number: 1,
      isOpen: false,
      results: [],
      arrowCounter: -1,
      items: [],
    };
  },
  emits: ["onMint", "onClose"],
  watch: {
    items: function (value, oldValue) {
      if (value.length !== oldValue.length) {
        this.results = value;
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
    let items = [];
    for (let index in this.addressBook) {
      items = items.concat(this.addressBook[index].name);
    }
    this.items = items; 
  },
  unmounted() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    setResult(result) {
      let foundAddress = false;
      for (let index in this.addressBook) {
        if (this.addressBook[index].name == result) {
          this.recipientAddress = this.addressBook[index].address;
          foundAddress = true;
        }
      }
      if (!foundAddress) {
        this.recipientAddress = result;
      }
      this.isOpen = false;
    },
    filterResults() {
      if (this.recipientAddress === '') {
        this.results = this.items;
      } else {
        this.results = this.items.filter((item) => {
          return item.toLowerCase().indexOf(this.recipientAddress.toLowerCase()) > -1;
        });
      }
    },
    onChange() {
      this.filterResults();
      this.isOpen = true;
    },
    handleClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.isOpen = false;
        this.arrowCounter = -1;
      }
    },
    onArrowDown() {
      if (this.arrowCounter < this.results.length) {
        this.arrowCounter = this.arrowCounter + 1;
      }
    },
    onArrowUp() {
      if (this.arrowCounter > 0) {
        this.arrowCounter = this.arrowCounter - 1;
      }
    },
    onEnter() {
      if (this.arrowCounter > -1) {
        this.setResult(this.results[this.arrowCounter]);
      }
      else {
        this.setResult(this.recipientAddress);
      }
      this.arrowCounter = -1;
    },
  },
};
</script>

<style>
  .autocomplete {
    position: relative;
    height: 120px;
    padding: 0;
    margin: 0;
    border: 1px solid #eeeeee;
    height: 120px;
    font-size: 40px;
  }

  .autocomplete-results {
    padding: 0;
    margin: 0;
    border: 1px solid #eeeeee;
    height: 120px;
    overflow: auto;
  }

  .autocomplete-result {
    list-style: none;
    text-align: left;
    padding: 4px 2px;
    cursor: pointer;
  }

  .autocomplete-result.is-active,
  .autocomplete-result:hover {
    background-color: #006989;
    color: white;
  }
</style>
