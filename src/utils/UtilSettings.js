import Store from "electron-store";

const store = new Store();

async function getStoreValue(event, key) {
  return store.get(key);
}

async function saveKey(event, address, mnemonic) {
  console.log("saving key with address " + address);
  if (store.has("keyPairs")) {
    getStoreValue("keyPairs")
      .then((result) => {
        let deselectedPairs = result.keyPairs.map((x) => {
          x.selected = false;
          return x;
        });
        let keyPairs = deselectedPairs.concat({
          address: address,
          mnemonic: mnemonic,
          selected: true,
        });
        store.set("keyPairs", keyPairs);
      })
      .catch((err) => {
        console.log(`Error loading keys with error <${err}>`);
      });
  } else {
    let keyPairs = [
      {
        address: address,
        mnemonic: mnemonic,
        selected: true,
      },
    ];
    store.set("keyPairs", keyPairs);
  }
}

async function selectAddress(event, address) {
  getStoreValue("keyPairs")
    .then((result) => {
      let newlySelectedPairs = result.keyPairs.map((x) => {
        x.selected = x.address === address;
        return x;
      });
      store.set("keyPairs", newlySelectedPairs);
    })
    .catch((err) => {
      console.log(`Error loading keys with error <${err}>`);
    });
}

async function deleteAddress(event, address) {
  getStoreValue("keyPairs")
    .then((result) => {
      let toDelete = result.keyPairs.filter((x) => x.address === address)[0];
      let newPairs = result.keyPairs.filter((x) => x.address != address);
      if (toDelete.selected) {
        newPairs[0].selected = true;
      }
      store.set("keyPairs", newPairs);
    })
    .catch((err) => {
      console.log(`Error loading keys with error <${err}>`);
    });
}

const utilSettings = {
  getStoreValue,
  saveKey,
  selectAddress,
  deleteAddress,
};

// export { getStoreValue, saveKey, selectAddress, deleteAddress };
export default utilSettings;
