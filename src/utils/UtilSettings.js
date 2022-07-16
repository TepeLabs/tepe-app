import Store from "electron-store";

const KEYPAIRS = "keyPairs";
const store = new Store();

async function getStoreValue(event, key) {
  return store.get(key);
}

async function saveKey(event, address, mnemonic) {
  console.log("saving key with address " + address);
  if (store.has(KEYPAIRS)) {
    getStoreValue(KEYPAIRS)
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
        store.set(KEYPAIRS, keyPairs);
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
    store.set(KEYPAIRS, keyPairs);
  }
}

async function selectAddress(event, address) {
  getStoreValue(KEYPAIRS)
    .then((result) => {
      let newlySelectedPairs = result.keyPairs.map((x) => {
        x.selected = x.address === address;
        return x;
      });
      store.set(KEYPAIRS, newlySelectedPairs);
    })
    .catch((err) => {
      console.log(`Error loading keys with error <${err}>`);
    });
}

async function deleteAddress(event, address) {
  getStoreValue(KEYPAIRS)
    .then((result) => {
      let toDelete = result.keyPairs.filter((x) => x.address === address)[0];
      let newPairs = result.keyPairs.filter((x) => x.address != address);
      if (toDelete.selected) {
        newPairs[0].selected = true;
      }
      store.set(KEYPAIRS, newPairs);
    })
    .catch((err) => {
      console.log(`Error loading keys with error <${err}>`);
    });
}

async function getCurrentWallet() {
  return new Promise((resolve, reject) => {
    getStoreValue(KEYPAIRS)
      .then((result) => {
        let selectedPairs = result.keyPairs.filter((x) => x.selected);
        resolve(selectedPairs[0]);
      })
      .catch((err) => {
        console.log(`Error loading keys with error <${err}>`);
        reject(err);
      });
  });
}

const utilSettings = {
  getStoreValue,
  saveKey,
  selectAddress,
  deleteAddress,
  getCurrentWallet,
};

export default utilSettings;
