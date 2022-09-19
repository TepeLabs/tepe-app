import Store from "electron-store";
import ObservableStore from "obs-store";
import crypto from "@/utils/UtilCrypto";

const WALLET = "wallet";
const ADDRESS_BOOK = "addressBook";
const CHANNEL_LIST = "channelList";
const WALLET_KEY_PASSWORD = "password";
const WALLET_KEY_KEYS = "keys";

const store = new Store();
const wallet = new ObservableStore({ isUnlocked: false });

async function initializeWalletList(event, walletJSON) {
  if (!store.has(WALLET)) {
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
    store.set(WALLET, walletList);
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
    store.get(CHANNEL_LIST)
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
  return store.get(CHANNEL_LIST)
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

async function walletExists(event) {
  return store.has(WALLET);
}

async function setPassword(event, password) {
  let json = { [WALLET_KEY_PASSWORD]: password, [WALLET_KEY_KEYS]: [] };
  let str = JSON.stringify(json);
  let bytes = crypto.encrypt(str, password);
  store.set(WALLET, bytes);
}

async function unlockWallet(event, password) {
  let bytes = await store.get(WALLET);
  let decrypted = crypto.decrypt(bytes, password);
  if (decrypted) {
    let json = JSON.parse(decrypted);
    wallet.putState(json);
    return true;
  } else {
    return false;
  }
}

async function addKey(event, publicAddress, privateAddress, mnemonic) {
  let json = wallet.getState();
  let keys = json[WALLET_KEY_KEYS];
  let deselectedKeys = keys.map((x) => {
    x.selected = false;
    return x;
  });
  let newKeys = deselectedKeys.concat({
    public: publicAddress,
    private: privateAddress,
    mnemonic: mnemonic,
    selected: true,
  });
  json[WALLET_KEY_KEYS] = newKeys;
  wallet.putState(json);
}

async function saveWallet(event) {
  let json = wallet.getState();
  let str = JSON.stringify(json);
  let bytes = crypto.encrypt(str, json[WALLET_KEY_PASSWORD]);
  store.set(WALLET, bytes);
}

async function selectWallet(event, publicAddress) {
  let json = wallet.getState();
  let keys = json[WALLET_KEY_KEYS];
  let selectedKeys = keys.map((x) => {
    x.selected = x.public === publicAddress;
    return x;
  });
  json[WALLET_KEY_KEYS] = selectedKeys;
  wallet.putState(json);
}

async function deleteWallet(event, publicAddress) {
  let json = wallet.getState();
  let keys = json[WALLET_KEY_KEYS];
  let toDelete = keys.filter((x) => x.public === publicAddress)[0];
  let newKeys = keys.filter((x) => x.public != publicAddress);
  if (toDelete.selected) {
    newKeys[0].selected = true;
  }
  json[WALLET_KEY_KEYS] = newKeys;
  wallet.putState(json);
}

async function getAllWallets() {
  return wallet.getState(WALLET)[WALLET_KEY_KEYS];
}

async function getCurrentWallet() {
  let json = wallet.getState();
  let keys = json[WALLET_KEY_KEYS];
  return new Promise((resolve, reject) => {
    if (keys.length > 0) {
      let selectedKey = keys.filter((x) => x.selected);
      resolve(selectedKey[0]);
    } else {
      console.log('You have no wallets yet.');
      reject();
    }
  });
}

const utilSettings = {
  initializeWalletList,
  initializeChannelList,
  saveChannel,
  getChannels,
  getChannel,
  walletExists,
  setPassword,
  unlockWallet,
  addKey,
  saveWallet,
  selectWallet,
  deleteWallet,
  getAllWallets,
  getCurrentWallet,
};

export default utilSettings;
