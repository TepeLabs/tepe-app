# Tepe app

The files in this repo can be cloned to run the [electron](https://www.electronjs.org/) app directly.

From within the app, you can:
<ul>
	<li>Create a new Secret (https://scrt.network/) address on the Pulsar-2 testnet, or import an existing address</li>
	<li>Open a Tepe channel</li>
	<li>Upload content -- of arbitrary filetype -- to IPFS (https://ipfs.tech) be gated by the Tepe channel</li>
	<li>Mint NFTs and send to other Secret accounts</li>
	<li>Download content for channels to which you have access</li>
</ul>
Below we walk through this process step by step.

## Step by step 

### 1. Install necessary packages with yarn and launch the app
This app uses [yarn](https://yarnpkg.com/) to manage packages.  In the directory where you've copied this repo, type the following at the command line 

```
yarn install
yarn electron:serve
```

### 2. Set a password to protect private keys
An electron window will open, and the first thing to do is set a password to protect your private key(s).

<img src="https://github.com/TepeProject/tepe-app/website_files/1-set_password.png" width="600"/>

You'll reach the home page displaying all Tepe channels, which is empty for now:

<img src="https://github.com/TepeProject/tepe-app/website_files/2-home.png" width="600"/>


### 3. Create or import a Secret address 

If you already have a Secret address for the Pulsar-2 testnet, you can import it:

<img src="https://github.com/TepeProject/tepe-app/website_files/3-wallet.png" width="600"/>

Or else you can create a new one, though it will need some (free) test scrt.  You can get some through the [Secret faucet](https://faucet.pulsar.scrttestnet.com/).

Afterward, you should see an address listed in the wallet page:

<img src="https://github.com/TepeProject/tepe-app/website_files/4-address.png" width="600"/>

### 4. Use the address book to store important addressses

You can paste the public Secret address and a nickname for as many addresses as you want, to help with minting and transferring NFTs.

<img src="https://github.com/TepeProject/tepe-app/website_files/5-addressbook.png" width="600"/>

### 5. Create a Tepe channel

We can now create a channel -- which instantiates a new version of our Tepe smart contract on the Secret testnet.

<img src="https://github.com/TepeProject/tepe-app/website_files/6-channel_creation.png" width="600"/>

Unlike contract instantiation on chains like Ethereum, which cost a lot of gas each time, on Secret you only pay a lot of gas for uploading the contract blueprint.
Each instantiation afterward is cheap, so you can make new channels (each their own instance of the contract we wrote) to your heart's content.

You can then enter the channel, and should see the following

<img src="https://github.com/TepeProject/tepe-app/website_files/7-channel.png" width="600"/>

### 6. Upload content to IPFS

The contract only stores the password necessary to decrypt a file.  The file itself, after encryption, can be stashed anywhere.
We use IPFS to store the encrypted file, but you can do whatever you want (like host the file yourself, use a completely public google drive link, etc.).

If you want to use IPFS, you need a gateway that will allow you to upload -- the easiest way we found was to create a free infura account 
(though it requires a credit card in case you store more than 5GB).
If you go this route, save a file `.env` in the local directory and enter the necessary API data that infura gives you: 
```
PROJECT_ID=2DG3**************** 
PROJECT_SECRET=806f**********************
```

Downloading from IPFS is much easier -- just find a good public gateway from [IPFS public gateway checker](https://ipfs.github.io/public-gateway-checker/).

Anyway, once you have a way to upload to IPFS, you can upload **anything**.  Starting with a txt file, you should see something like the following:

<img src="./website_files/8-upload_txt.png" width="600"/>

### 7. Minting NFTs to granting access
You can mint and transfer NFTs with the buttons at the top of the channel page.  Let's send one to a friend:

<img src="https://github.com/TepeProject/tepe-app/website_files/9-mint.png" width="600"/>

### 8. The receiving side: the content viewer
If you are a subscriber to content, or just the viewer for a particular channel, you can import the channel that was created by its public address

<img src="https://github.com/TepeProject/tepe-app/website_files/11-otherimport.png" width="600"/>

Now the channel page has fewer buttons, because you can't mint, transfer, or upload to the contract.  However, if you have the NFT, you can download and decrypt

<img src="https://github.com/TepeProject/tepe-app/website_files/12-channel.png" width="600"/>

If the file was a text file, its contents will display in the app on the channel page:

<img src="https://github.com/TepeProject/tepe-app/website_files/13-text_unlocked.png" width="600"/>

For any other file types, you select the download location and can retrieve your decrypted file from the path shown in the app:

<img src="https://github.com/TepeProject/tepe-app/website_files/14-img.png" width="600"/>

You can re-upload files as much as you want for any given channel, so here we replaced the txt file with an image called `tepe.png`.