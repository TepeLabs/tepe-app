import Store from "electron-store";

const WALLET_LIST = "walletList";
const ADDRESS_BOOK = "addressBook";
const CHANNEL_LIST = "channelList";
const store = new Store();

async function getStoreValue(key) {
  return store.get(key);
}

async function initializeWalletList(event, walletJSON) {
  if (!store.has(WALLET_LIST)) {
    let walletList = [];
    for (let key in walletJSON) {
      walletList = walletList.concat(
        {
          public: walletJSON[key].public,
          private: walletJSON[key].private,
          mnemonic: walletJSON[key].mnemonic,
          selected: walletJSON[key].default,
        });
    }
    console.log(walletList);
    store.set(WALLET_LIST, walletList);
  }
}

async function initializeChannelList(event, channelJSON) {
  if (!store.has(CHANNEL_LIST)) {
    let channelList = {};
    for (let key in channelJSON) {
      channelList = channelList.concat(
        {
          address: channelJSON[key].address,
          name: channelJSON[key].name,
          cid: channelJSON[key].cid,
        });
    }
    console.log(channelList);
    store.set(CHANNEL_LIST, channelList);
  }
}

async function saveChannel(event, walletAddress, channelAddress, nickname) {
  if (store.has(CHANNEL_LIST)) {
    getStoreValue(CHANNEL_LIST)
      .then((channelList) => {
        let walletFound = false;
        for (let index in channelList) {
          if (channelList[index]['wallet'] == walletAddress) {
            walletFound = true;
            channelList[index]['channels'] = channelList[index]['channels'].concat({
              address: channelAddress,
              name: nickname,
              cid: "UNK",
            });
          }
        }
        if (!walletFound) {
          let newChannelsForWallet = {
            wallet: walletAddress,
            channels: [
              {
                address: channelAddress,
                name: nickname,
                cid: "UNK",
              }
            ]
          };
          channelList = channelList.concat(newChannelsForWallet);
        }
        store.set(CHANNEL_LIST, channelList);
      })
      .catch((err) => {
        console.log(`Error editing channels with error <${err}>`);
      });
  } else {
    let channelList = [
      {
        address: channelAddress,
        name: nickname,
        cid: "UNK",
        owner: "UNK",
      },
    ];
    store.set(CHANNEL_LIST, channelList);
  }
}

async function getChannel(event, walletAddress, channelAddress) {
  return getChannels(event, walletAddress)
    .then((channels) => {
      for (let j in channels) {
        if (channels[j].address == channelAddress) {
          return channels[j];
        }
      }
    })
    .catch((err) => {
      console.log(`Error getting channels with error <${err}>`);
      return err;
    });
}

async function getChannels(event, walletAddress) {
  return getStoreValue(CHANNEL_LIST)
    .then((channelList) => {
      for (let index in channelList) {
        let channels = channelList[index];
        if (channels.wallet == walletAddress) {
          return channels.channels;
        }
      }
    })
    .catch((err) => {
      console.log(`Error getting channels with error <${err}>`);
      return err;
    });
}

async function saveWallet(event, publicAddress, privateAddress, mnemonic) {
  console.log("saving wallet with address " + publicAddress);
  if (store.has(WALLET_LIST)) {
    getStoreValue(WALLET_LIST)
      .then((walletList) => {
        let deselectedWallets = walletList.map((x) => {
          x.selected = false;
          return x;
        });
        let newWalletList = deselectedWallets.concat({
          public: publicAddress,
          private: privateAddress,
          mnemonic: mnemonic,
          selected: true,
        });
        store.set(WALLET_LIST, newWalletList);
      })
      .catch((err) => {
        console.log(`Error loading wallets with error <${err}>`);
      });
  } else {
    let walletList = [
      {
        public: publicAddress,
        private: privateAddress,
        mnemonic: mnemonic,
        selected: true,
      },
    ];
    store.set(WALLET_LIST, walletList);
  }
}

async function selectWallet(event, publicAddress) {
  getStoreValue(WALLET_LIST)
    .then((walletList) => {
      let newlySelectedWallets = walletList.map((x) => {
        x.selected = x.public === publicAddress;
        return x;
      });
      store.set(WALLET_LIST, newlySelectedWallets);
    })
    .catch((err) => {
      console.log(`Error loading wallets with error <${err}>`);
    });
}

async function deleteWallet(event, publicAddress) {
  getStoreValue(WALLET_LIST)
    .then((walletList) => {
      let toDelete = walletList.filter((x) => x.public === publicAddress)[0];
      let newWallets = walletList.filter((x) => x.public != publicAddress);
      if (toDelete.selected) {
        newWallets[0].selected = true;
      }
      store.set(WALLET_LIST, newWallets);
    })
    .catch((err) => {
      console.log(`Error loading wallets with error <${err}>`);
    });
}

async function getAllWallets() {
  return getStoreValue(WALLET_LIST);
}

async function getCurrentWallet() {
  return new Promise((resolve, reject) => {
    if (store.has(WALLET_LIST)) {
      getStoreValue(WALLET_LIST)
        .then((walletList) => {
          let selectedWallets = walletList.filter((x) => x.selected);
          resolve(selectedWallets[0]);
        })
        .catch((err) => {
          console.log(`Error loading wallets with error <${err}>`);
          reject(err);
        });
    } else {
      console.log('You have no wallets yet.');
    }
  });
}

const utilSettings = {
  initializeWalletList,
  initializeChannelList,
  saveChannel,
  getChannels,
  getChannel,
  saveWallet,
  selectWallet,
  deleteWallet,
  getAllWallets,
  getCurrentWallet,
};

export default utilSettings;
