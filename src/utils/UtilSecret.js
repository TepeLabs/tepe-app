import { SecretNetworkClient } from "secretjs";

const CHAINID = "pulsar-2";
const GRPC_WEBURL = "https://grpc.testnet.secretsaturn.net";
// For contract code ID 11010, the first SNIP721 olive contract
const CONTRACT_CODE_HASH =
  "0x0d938470cb089b1f58b1add2e398aa6dbc3d70b5410e30676bda688b777afda3";
const CONTRACT_CODE_ID = "11010";

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
          "public_owner": true,  // optional; default: false
          "minter_may_update_metadata": true,  // optional; default: true
        }

      },
      label: label,
    },
    {
      gasLimit: 300_000,
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

// 
async function setMetadata(wallet, contractAddress, publicMetadata, privateMetadata) {
  const client = await getClient(wallet);
  const resultSet = await client.tx.compute.executeContract(
    {
      sender: wallet.address,
      contractAddress: contractAddress,
      codeHash: CONTRACT_CODE_HASH,
      msg:  { set_metadata: 
          { 
            public_metadata: 
            {
              text: publicMetadata, 
            },
            private_metadata:
            {
              text: privateMetadata,
            }
          }}},
    {
      gasLimit: 200_000,
    }
  );
  let payload = resultSet.data;
  let string = new TextDecoder().decode(payload[0]);
  console.log("\n\nSet metadata response:", JSON.parse(string), "\n\n");
  console.log("Gas used:", resultSet.gasUsed); 
  console.log("Fee:", resultSet.tx.authInfo.fee.amount[0].amount);
}

async function mintNFT(wallet, contractAddress, recipientAddress, number) {
  const client = await getClient(wallet);
  let mintList = [];
  for (let nftIndex = 0; nftIndex < number; nftIndex++) {
    mintList = mintList.concat(
    {
      owner: recipientAddress,
      transferable: true,
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
      gasLimit: 100_000,
    }
  );
  let payload = resultMint.data;
  let response = new TextDecoder().decode(payload[0]);
  console.log(response);
  console.log("\n\nMintNft response:", JSON.parse(response), "\n\n");
  console.log("Gas used:", resultMint.gasUsed);
  console.log("Fee:", resultMint.tx.authInfo.fee.amount[0].amount);
  return JSON.parse(response);
}

async function createViewingKey(wallet, contractAddress) {
  const client = await getClient(wallet);
  const resultCreateViewingKey = await client.tx.compute.executeContract(
    {
      sender: wallet.address,
      contractAddress: contractAddress,
      codeHash: CONTRACT_CODE_HASH,
      msg:  { create_viewing_key: {entropy: "DiSoRdEr",} },
    },
    {
      gasLimit: 100_000,
    },
  );
  let payload = resultCreateViewingKey.data;
  let response = new TextDecoder().decode(payload[0]);
  console.log("\n\nCreate key response:", JSON.parse(response), '\n\n');
  console.log("Gas used:", resultCreateViewingKey.gasUsed);
  console.log("Fee:", resultCreateViewingKey.tx.authInfo.fee.amount[0].amount);
  return JSON.parse(response);
  }


async function transferNFT(wallet, contractAddress, recipientAddress, tokenID) {
  const client = await getClient(wallet);
  const resultTransfer = await client.tx.compute.executeContract(
      {
        sender: wallet.address,
        contractAddress: contractAddress,
        codeHash: CONTRACT_CODE_HASH,
        msg: { 
          transfer_nft: {
            recipient: recipientAddress,
            token_id: tokenID,
        },
      },
    },
      {
        gasLimit: 100_000,
      },
    );
    let payload = resultTransfer.data;
    let response = new TextDecoder().decode(payload[0]);
    console.log("\n\nTransfer response:", JSON.parse(response), '\n\n');
    console.log("Gas used:", resultTransfer.gasUsed); 
    console.log("Fee:", resultTransfer.tx.authInfo.fee.amount[0].amount);
    return JSON.parse(response);
}

async function queryNFTDossier(wallet, contractAddress, tokenID, viewingKey) {
  const client = await getClient(wallet);
  const resultQuery = await client.query.compute.queryContract({
      contractAddress: contractAddress,
      codeHash: CONTRACT_CODE_HASH,
      query: { 
        nft_dossier: {
          token_id: tokenID,
          viewer: {
            address: wallet.address,
            viewing_key: viewingKey,
          }
        } },
      });
    
    console.log("\n\nNFT Dossier:", JSON.parse(resultQuery), '\n\n');
    return JSON.parse(resultQuery);
}

const utilSecret = {
  instantiateContract,
  setMetadata,
  mintNFT,
  transferNFT,
  queryNFTDossier,
  createViewingKey,
};

export default utilSecret;
