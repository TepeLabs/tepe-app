import { SecretNetworkClient } from "secretjs";
import { MsgExecuteContractResponse } from "secretjs/dist/protobuf_stuff/secret/compute/v1beta1/msg";
import { fromUtf8 } from "@cosmjs/encoding";
const CHAINID = "pulsar-2";
const GRPC_WEBURL = "https://grpc.testnet.secretsaturn.net";
// For contract code ID 12339, the olive contract v0.3
const CONTRACT_CODE_HASH =
  "b3c5f81db231bcb0ad61f59fc90bb7533b3d57a502d5eb1a08d3c89cfe3fb774";
const CONTRACT_CODE_ID = "15064";
const clients = {};

async function getClient(wallet) {
  if (!(wallet.address in clients)) {
    clients[wallet.address] = await SecretNetworkClient.create({
      grpcWebUrl: GRPC_WEBURL,
      chainId: CHAINID,
      wallet: wallet,
      walletAddress: wallet.address,
    });
  }
  return clients[wallet.address];
}

async function instantiateContract(wallet, label) {
  const client = await getClient(wallet);
  const resultInstantiate = await client.tx.compute.instantiateContract(
    {
      sender: wallet.address,
      codeId: CONTRACT_CODE_ID,
      codeHash: CONTRACT_CODE_HASH,
      initMsg: {
        "name": label,
        "symbol": "UNK",
        "entropy": "k log W",

        "config": {
          "public_token_supply": true,  // optional; default: false
          "public_owners": true,  // optional; default: false
          "minter_may_update_metadata": true,  // optional; default: true
          "transferable": true,
        }
      },
      label: label,
    },
    {
      gasLimit: 500_000,
    }
  );
  if (resultInstantiate.code != 0) {
    let errorMessage = `Failed to instantiate contract.` +
      `Error code <${resultInstantiate.code}> and message <${resultInstantiate.rawLog}>.`;
    return Promise.reject(new Error(errorMessage));
  }
  const contractAddress = resultInstantiate.arrayLog.find(
    (log) => log.type === "message" && log.key === "contract_address"
  ).value;
  console.log("\n\nNew contract instantiated:", contractAddress, '\n\n');
  console.log("Gas used:", resultInstantiate.gasUsed);
  console.log("Fee:", resultInstantiate.tx.authInfo.fee.amount[0].amount);
  return contractAddress;
}

async function setMetadata(wallet, contractAddress, publicMetadata, privateMetadata, filename=null) {
  const client = await getClient(wallet);
  console.log(contractAddress, publicMetadata, privateMetadata, filename);
  return client.tx.compute.executeContract(
    {
      sender: wallet.address,
      contractAddress: contractAddress,
      codeHash: CONTRACT_CODE_HASH,
      msg: {
        set_metadata:
        {
          public_metadata:
          {
            text: publicMetadata,
          },
          private_metadata:
          {
            text: privateMetadata,
            filename: filename,
          }
        }
      }
    },
    {
      gasLimit: 200_000,
    }
  )
    .then((result) => {
      let response = fromUtf8(MsgExecuteContractResponse.decode(result.data[0]).data);
      let metadata = JSON.parse(response).set_metadata;
      console.log("\n\nSet metadata response:", metadata, "\n\n");
      console.log("Gas used:", result.gasUsed);
      console.log("Fee:", result.tx.authInfo.fee.amount[0].amount);
      return metadata;
    })
    .catch((error) => {
      console.log('Error executing tx', error);
    })
}

async function retrieveMetadata(wallet, contractAddress) {
  const client = await getClient(wallet);
  return client.tx.compute.executeContract(
    {
      sender: wallet.address,
      contractAddress: contractAddress,
      codeHash: CONTRACT_CODE_HASH,
      msg: { retrieve_metadata: {} }
    },
    {
      gasLimit: 400_000,
    }
  )
    .then((response) => {
      let decoded = MsgExecuteContractResponse.decode(response.data[0]);
      let text = fromUtf8(decoded.data);
      let json = JSON.parse(text);
      console.log("\n\nRetrieve metadata response:", json.retrieve_metadata);
      console.log("Gas used:", response.gasUsed);
      console.log("Fee:", response.tx.authInfo.fee.amount[0].amount);
      return json.retrieve_metadata;
    })
    .catch((error) => {
      console.log('Retrieve metadata error: ', error);
    });
}

async function mintNFT(wallet, contractAddress, recipientAddress, number) {
  const client = await getClient(wallet);
  let mintList = [];
  for (let nftIndex = 0; nftIndex < number; nftIndex++) {
    mintList = mintList.concat(
      {
        owner: recipientAddress,
      })
  }
  const resultMint = await client.tx.compute.executeContract(
    {
      sender: wallet.address,
      contractAddress: contractAddress,
      codeHash: CONTRACT_CODE_HASH,
      msg: { batch_mint_nft: { mints: mintList } },
    },
    {
      gasLimit: 400_000,
    }
  );
  let response = fromUtf8(MsgExecuteContractResponse.decode(resultMint.data[0]).data);
  console.log("\n\nMintNft response:", JSON.parse(response).batch_mint_nft, "\n\n");
  console.log("Gas used:", resultMint.gasUsed);
  console.log("Fee:", resultMint.tx.authInfo.fee.amount[0].amount);

  return JSON.parse(response).batch_mint_nft;
}

async function retrieveOwners(wallet, contractAddress) {
  const client = await getClient(wallet);
  return client.tx.compute.executeContract(
    {
      sender: wallet.address,
      contractAddress: contractAddress,
      codeHash: CONTRACT_CODE_HASH,
      msg: { retrieve_owners: {} },
    },
    {
      gasLimit: 500_000,
    },
  )
    .then((response) => {
      let decoded = MsgExecuteContractResponse.decode(response.data[0]);
      let text = fromUtf8(decoded.data);
      let json = JSON.parse(text);
      let owners = [...new Set(json.retrieve_owners.owners)];
      return owners;
    })
    .catch();
}

async function createViewingKey(wallet, contractAddress) {
  const client = await getClient(wallet);
  const resultCreateViewingKey = await client.tx.compute.executeContract(
    {
      sender: wallet.address,
      contractAddress: contractAddress,
      codeHash: CONTRACT_CODE_HASH,
      msg: { create_viewing_key: { entropy: "DiSoRdEr", } },
    },
    {
      gasLimit: 100_000,
    },
  );
  let response = fromUtf8(MsgExecuteContractResponse.decode(resultCreateViewingKey.data[0]).data);

  console.log("\n\nCreate key response:", JSON.parse(response).create_viewing_key, '\n\n');

  console.log("Gas used:", resultCreateViewingKey.gasUsed);
  console.log("Fee:", resultCreateViewingKey.tx.authInfo.fee.amount[0].amount);
  return JSON.parse(response).create_viewing_key;
}

async function transferNFT(wallet, contractAddress, recipientAddress, number) {
  const client = await getClient(wallet);
  let transferList = [];
  for (let nftIndex = 0; nftIndex < number; nftIndex++) {
    transferList = transferList.concat(
      {
        recipient: recipientAddress,
      })
  }
  const resultTransfer = await client.tx.compute.executeContract(
    {
      sender: wallet.address,
      contractAddress: contractAddress,
      codeHash: CONTRACT_CODE_HASH,
      msg: { batch_transfer_nft: { transfers: transferList } },
    },
    {
      gasLimit: 400_000,
    }
  );
  let response = fromUtf8(MsgExecuteContractResponse.decode(resultTransfer.data[0]).data);
  console.log("\n\nTransfer response:", JSON.parse(response).transfer_nft, '\n\n');
  console.log("Gas used:", resultTransfer.gasUsed);
  console.log("Fee:", resultTransfer.tx.authInfo.fee.amount[0].amount);
  return JSON.parse(response).transfer_nft;
}

async function queryNFTDossier(wallet, contractAddress, viewingKey = null) {
  const client = await getClient(wallet);
  var resultQuery = null;
  if (viewingKey == null) {
    resultQuery = await client.query.compute.queryContract({
      contractAddress: contractAddress,
      codeHash: CONTRACT_CODE_HASH,
      query: {
        nft_dossier: {}
      },
    });
  } else {

    resultQuery = await client.query.compute.queryContract({
      contractAddress: contractAddress,
      codeHash: CONTRACT_CODE_HASH,
      query: {
        nft_dossier: {
          viewer: {
            address: wallet.address,
            viewing_key: viewingKey,
          }
        }
      },
    });
  }
  console.log("NFT Dossier:", resultQuery);
  return resultQuery;
}

async function queryNumTokens(wallet, contractAddress) {
  const client = await getClient(wallet);
  let resultQuery = await client.query.compute.queryContract({
    contractAddress: contractAddress,
    codeHash: CONTRACT_CODE_HASH,
    query: {
      num_tokens: {}
    },
  });
  console.log("Num tokens:", resultQuery.num_tokens.count);
  return resultQuery;
}

const utilSecret = {
  instantiateContract,
  setMetadata,
  retrieveMetadata,
  mintNFT,
  retrieveOwners,
  transferNFT,
  queryNFTDossier,
  queryNumTokens,
  createViewingKey,
};

export default utilSecret;
