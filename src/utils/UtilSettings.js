import Store from "electron-store";
import ObservableStore from "obs-store";
import crypto from "@/utils/UtilCrypto";
import { channel } from "diagnostics_channel";

const WALLET = "wallet";
const ADDRESS_BOOK = "addressBook";
const CHANNEL_LIST = "channelList";
const WALLET_KEY_PASSWORD = "password";
const WALLET_KEY_KEYS = "keys";

const store = new Store();
const wallet = new ObservableStore();

async function saveAddressBook(event, walletAddress, addressEntries) {
  // each wallet gets its own address book
  if (store.has(ADDRESS_BOOK)) {
    let addressBook = await store.get(ADDRESS_BOOK);
    let walletFound = false;
    for (let index in addressBook) {
      if (addressBook[index]['wallet'] == walletAddress) {
        walletFound = true;
        addressBook[index]['entries'] = addressEntries;
      }
    }
    if (!walletFound) {
      let newChannelsForWallet = {
        wallet: walletAddress,
        entries: addressEntries,
      };
      addressBook = addressBook.concat(newChannelsForWallet);

    }
    store.set(ADDRESS_BOOK, addressBook);
  } else {
    console.log('There was no address book');
    let newChannelsForWallet = {
      wallet: walletAddress,
      entries: addressEntries,
    };
    let addressBook = [newChannelsForWallet];
    store.set(ADDRESS_BOOK, addressBook);
  }
}

async function getAddressBook(event, walletAddress) {
  // each wallet gets its own address book
  let addressBook = await store.get(ADDRESS_BOOK);
  for (let index in addressBook) {
    let addresses = addressBook[index];
    if (addresses.wallet == walletAddress) {
      return addresses.entries;
    }
  }
}

async function saveChannel(event, walletAddress, channelAddress, nickname) {
  if (store.has(CHANNEL_LIST)) {
    let channelList = await store.get(CHANNEL_LIST);
    let walletFound = false;
    for (let index in channelList) {
      if (channelList[index]['wallet'] == walletAddress) {
        walletFound = true;
        channelList[index]['channels'] = channelList[index]['channels'].concat({
          address: channelAddress,
          name: nickname,
          cid: "UNK",
          path: '',
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
            path: '',
          }
        ]
      };
      channelList = channelList.concat(newChannelsForWallet);
    }
    store.set(CHANNEL_LIST, channelList);
  } else {
    let channelList = [  // KM: this seems broken!  where's the wallet?
      {
        wallet: walletAddress,
        channels: [
          {
            address: channelAddress,
            name: nickname,
            cid: "UNK",
            path: '',
          }
        ]
      },
    ];
    store.set(CHANNEL_LIST, channelList);
  }
}

async function updateChannelInfo(event, walletAddress, channelAddress, path, cid) {
  if (!store.has(CHANNEL_LIST)) {
    return;
  }
  let channelList = await store.get(CHANNEL_LIST);
  for (let i in channelList) {
    if (channelList[i]['wallet'] == walletAddress) {
      for (let j in channelList[i]['channels']) {
        if (channelList[i]['channels'][j]['address'] == channelAddress) {
          if (path == null) {
            path = channelList[i]['channels'][j]['path'];
          }
          if (cid == null) {
            cid = channelList[i]['channels'][j]['cid'];
          }
          channelList[i]['channels'][j] = {
            address: channelAddress,
            name: channelList[i]['channels'][j]['name'],
            cid: cid,
            path: path,
          };
        }
      }
    }
  }
  store.set(CHANNEL_LIST, channelList);
}

async function deleteChannel(event, walletAddress, channelAddress) {
  let channelList = await store.get(CHANNEL_LIST);
  for (let i in channelList) {
    if (channelList[i]['wallet'] == walletAddress) {
      channelList[i].channels = channelList[i].channels.filter((x) => x.address != channelAddress);
    }
  }
  store.set(CHANNEL_LIST, channelList);
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
  let channelList = await store.get(CHANNEL_LIST);
  for (let index in channelList) {
    let channels = channelList[index];
    if (channels.wallet == walletAddress) {
      return channels.channels;
    }
  }
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

async function walletUnlocked(event) {
  return Object.keys(wallet.getState()).length > 0;
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

async function selectKey(event, publicAddress) {
  let json = wallet.getState();
  let keys = json[WALLET_KEY_KEYS];
  let selectedKeys = keys.map((x) => {
    x.selected = x.public === publicAddress;
    return x;
  });
  json[WALLET_KEY_KEYS] = selectedKeys;
  wallet.putState(json);
}

async function deleteKey(event, publicAddress) {
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

async function getAllKeys() {
  return wallet.getState(WALLET)[WALLET_KEY_KEYS];
}

async function getCurrentKey() {
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
  saveChannel,
  updateChannelInfo,
  deleteChannel,
  getAddressBook,
  saveAddressBook,
  getChannels,
  getChannel,
  walletExists,
  setPassword,
  unlockWallet,
  walletUnlocked,
  addKey,
  saveWallet,
  selectKey,
  deleteKey,
  getAllKeys,
  getCurrentKey,
};

export default utilSettings;
