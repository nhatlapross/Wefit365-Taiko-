// const Contract = require('web3-eth-contract');
// const {wefitCfg, contractParams} = require('../config/vars')

// const tokenAbi = require("../abi/tokenAbi.json");
// const {provider} = require('../utils/provider')

// Contract.setProvider(provider)

// exports.setAdminToken = async(req) =>{
//     let contract = new Contract(tokenAbi, wefitCfg.wefitTokenAddress)
//     let nonce = await getNonce(wefitCfg.contractOwnerAddr)
//     try {
//         let receipt = await contract.methods.addWhiteListAddress(req.admin).send(Object.assign(contractParams, {nonce: nonce}))
//         return receipt
//     } catch (err) {
//         return err.message
//     }
// }

const xrpl = require('xrpl')
const { ethers } = require('ethers');

exports.generate_xrp_wallet = async(req) => {
    const account = "rP7aApVAyf3bjtRVVTixVSHBbU4kpd742k"

    let seed = xrpl.Wallet.generate()
    // const standby_wallet = xrpl.Wallet.generate

    // return standby_wallet.classicAddress       
    return seed.classicAddress
}

exports.generate_evm_wallet = async(req) =>{
    let mnemonic = "pqd pn2411 pqd_pn";
    const wallet = ethers.Wallet.createRandom();
    let resp = {
        address: wallet.address,
        // privateKey: wallet.privateKey,
        publicKey: wallet.publicKey,
        mnemonic: mnemonic,
        path: "m/44'/60'/0'/0/0"
    }
    
    console.log("Wallet resp: ", resp)

    return resp.address;
}

exports.mint_nft = async() => {
    const account = "rP7aApVAyf3bjtRVVTixVSHBbU4kpd742k"

    // Connect to a testnet node
    console.log("Connecting to testnet...")
    const client = new xrpl.Client('wss://s.devnet.rippletest.net:51233')
    await client.connect()

    const standby_wallet = xrpl.Wallet.fromSeed("sEdVd1vJvRcoXCmrx7SwY8g2bhaD35h")
    const transactionJson = {
        "TransactionType": "NFTokenMint",
        "Account": "rH4PVgbcK9ryvSp37gYYHhgYK3D47FGNY7",
        "URI": xrpl.convertStringToHex("x.com"),
        "Flags": parseInt("1"),
        "TransferFee": parseInt("0"),
        "NFTokenTaxon": 0 //Required, but if you have no use for it, set to zero.
      }
    
    // ----------------------------------------------------- Submit signed blob 
    const tx = await client.submitAndWait(transactionJson, { wallet: standby_wallet} )
    const nfts = await client.request({
    method: "account_nfts",
    account: standby_wallet.classicAddress
    })

    // ------------------------------------------------------- Report results
    results = '\n\nTransaction result: '+ tx.result.meta.TransactionResult
    results += '\n\nnfts: ' + JSON.stringify(nfts, null, 2)

    console.log("NFT creating resp: ", results)
   
    await client.disconnect()
}