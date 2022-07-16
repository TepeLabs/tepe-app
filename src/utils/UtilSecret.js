import { SecretNetworkClient } from "secretjs";

const CHAINID = "pulsar-2";
const GRPC_WEBURL = "https://grpc.testnet.secretsaturn.net";

const CONTRACT_ADDRESS = "secret1f3n20kerxhgmp2fduypsf2gwzpz02s5qkldqqy";
const CONTRACT_CODE_HASH =
  "0xf55b960fa363179c9b20629efc28daa745889abf295a5d572210524ab9305936";
const CONTRACT_CODE_ID = "9788";

async function getClient(wallet) {
  const client = await SecretNetworkClient.create({
    grpcWebUrl: GRPC_WEBURL,
    chainId: CHAINID,
    wallet: wallet,
    walletAddress: wallet.address,
  });
  return client;
}

async function instantiateContract(wallet) {
  const client = getClient(wallet);
  const result = await client.tx.compute.instantiateContract(
    {
      sender: wallet.address,
      codeId: CONTRACT_CODE_ID,
      codeHash: CONTRACT_CODE_HASH,
      initMsg: {},
      label: "some globally unique label for every single instantiation",
    },
    {
      gasLimit: 100_000,
    }
  );
  const contractAddress = result.arrayLog.find(
    (log) => log.type === "message" && log.key === "contract_address"
  ).value;
  console.log("\n\nNew contract address:", contractAddress, "\n\n");
  return contractAddress;
}

async function setKey(wallet, key) {
  const client = getClient(wallet);
  const resultSet = await client.tx.compute.executeContract(
    {
      sender: wallet.address,
      contractAddress: CONTRACT_ADDRESS,
      codeHash: CONTRACT_CODE_HASH,
      msg: { set_private_key: { key: key } },
    },
    {
      gasLimit: 100_000,
    }
  );
  var payload = resultSet.data;
  var string = new TextDecoder().decode(payload[0]);
  console.log("\n\nSet key response:", JSON.parse(string), "\n\n");
}

async function mintNFT(wallet) {
  const client = getClient(wallet);
  const resultMint = await client.tx.compute.executeContract(
    {
      sender: wallet.address,
      contractAddress: CONTRACT_ADDRESS,
      codeHash: CONTRACT_CODE_HASH,
      msg: { mint_nft: { recipient: wallet.address } }, // put the recipient address here
    },
    {
      gasLimit: 100_000,
    }
  );
  const payload = resultMint.data;
  const string = new TextDecoder().decode(payload[0]);
  console.log("\n\nMintNft response:", JSON.parse(string), "\n\n");
}

async function queryOwners(wallet) {
  const client = getClient(wallet);
  const resultQuery = await client.query.compute.queryContract({
    contractAddress: CONTRACT_ADDRESS,
    codeHash: CONTRACT_CODE_HASH,
    query: { stats: {} },
  });
  console.log("\n\nNFT owners:", resultQuery, "\n\n");
}

async function readKey(wallet) {
  const client = getClient(wallet);
  const resultRead = await client.tx.compute.executeContract(
    {
      sender: wallet.address,
      contractAddress: CONTRACT_ADDRESS,
      codeHash: CONTRACT_CODE_HASH,
      msg: { read_key: {} },
    },
    {
      gasLimit: 100_000,
    }
  );
  const payload = resultRead.data;
  const string = new TextDecoder().decode(payload[0]);
  console.log("\n\nRead key response:", JSON.parse(string), "\n\n");
}

async function sendNFT(wallet, recipientAddress) {
  const client = getClient(wallet);
  const resultTransfer = await client.tx.compute.executeContract(
    {
      sender: wallet.address,
      contractAddress: CONTRACT_ADDRESS,
      codeHash: CONTRACT_CODE_HASH,
      msg: { transfer_nft: { recipient: recipientAddress } },
    },
    {
      gasLimit: 100_000,
    }
  );
  const payload = resultTransfer.data;
  const string = new TextDecoder().decode(payload[0]);
  console.log("\n\nTransfer response:", JSON.parse(string), "\n\n");
}

const utilSecret = {
  instantiateContract,
  setKey,
  mintNFT,
  queryOwners,
  readKey,
  sendNFT,
};

export default utilSecret;
