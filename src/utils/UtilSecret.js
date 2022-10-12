import { SecretNetworkClient } from "secretjs";
import { MsgExecuteContractResponse } from "secretjs/dist/protobuf_stuff/secret/compute/v1beta1/msg";
import { fromUtf8 } from "@cosmjs/encoding";
const CHAINID = "pulsar-2";
const GRPC_WEBURL = "https://grpc.testnet.secretsaturn.net";
// For contract code ID 12339, the olive contract v0.3
const CONTRACT_CODE_HASH =
  "1a6a70d1bd2b4923f94c677ae5a1fd34710062f1cf8d86a2ab48b5427e30905c";
const CONTRACT_CODE_ID = "12405";

async function getClient(wallet) {
  const client = await SecretNetworkClient.create({
    grpcWebUrl: GRPC_WEBURL,
    chainId: CHAINID,
    wallet: wallet,
    walletAddress: wallet.address,
  });
  return client;
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
    let errorMessage = `Failed to instantiate contract. Error code <${resultInstantiate.code}> and message <${resultInstantiate.rawLog}>.`;
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

async function setMetadata(wallet, contractAddress, publicMetadata, privateMetadata) {
  const client = await getClient(wallet);
  console.log(contractAddress, publicMetadata, privateMetadata);
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
          }
        }
      }
    },
    {
      gasLimit: 200_000,
    }
  )
    .then((resultSet) => {
      console.log('result set', resultSet);
      let response = fromUtf8(MsgExecuteContractResponse.decode(resultSet.data[0]).data);
      console.log('set metadata response', response);
      let metadata = JSON.parse(response).set_metadata;
      console.log("\n\nSet metadata response:", metadata, "\n\n");
      console.log("Gas used:", resultSet.gasUsed);
      console.log("Fee:", resultSet.tx.authInfo.fee.amount[0].amount);
      return metadata;
    })
    .catch((error) => {
      console.log('Error executing tx', error);
    })
}

async function retrieveMetadata(wallet, contractAddress) {
  const client = await getClient(wallet);
  const resultRetrieve = await client.tx.compute.executeContract(
    {
      sender: wallet.address,
      contractAddress: contractAddress,
      codeHash: CONTRACT_CODE_HASH,
      msg: { retrieve_metadata: {} }
    },
    {
      gasLimit: 400_000,
    }
  );
  let response = fromUtf8(MsgExecuteContractResponse.decode(resultRetrieve.data[0]).data);
  console.log("\n\nRetrieve metadata response:", JSON.parse(response).retrieve_metadata, "\n\n");
  console.log("Gas used:", resultRetrieve.gasUsed);
  console.log("Fee:", resultRetrieve.tx.authInfo.fee.amount[0].amount);
  return JSON.parse(response).retrieve_metadata;
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

  let owners = await retrieveOwners(wallet, contractAddress);
  console.log("Owners:", owners);

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
