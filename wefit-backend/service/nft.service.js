const redis = require("redis");
const {redisUrl, wefitCfg, contractParams} = require("../config/vars");

// //contract config 
// const nftAbi = require("../abi/nftAbi.json");
// const Contract = require('web3-eth-contract');
// const Web3 = require('web3')
// const nftByteCode = require('../abi/nftByteCode.json');
// const {provider, contractProvider} = require('../utils/provider')

// const web3 = new Web3(wefitCfg.providerUrl)

// Contract.setProvider(provider)

const xrpl = require('xrpl')

exports.mint_nft = async(req) => {
    const wallet = req.xrp_wallet

    // Connect to a testnet node
    console.log("Connecting to testnet...")
    const client = new xrpl.Client('wss://s.devnet.rippletest.net:51233')
    await client.connect()

    const standby_wallet = xrpl.Wallet.fromSeed("sEdVd1vJvRcoXCmrx7SwY8g2bhaD35h")
    const transactionJson = {
        "TransactionType": "NFTokenMint",
        "Account":standby_wallet.classicAddress,
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
    
    return {
        "tx": tx.result.meta.TransactionResult,
        "nfts": nfts.result.account_nfts[0]
    }
}

exports.claim_profit = async(req) =>{
    console.log("Connecting to testnet...")
    const client = new xrpl.Client('wss://s.devnet.rippletest.net:51233')
    await client.connect()
        
    const standby_wallet = xrpl.Wallet.fromSeed("sEdVd1vJvRcoXCmrx7SwY8g2bhaD35h")
    const operational_wallet = xrpl.Wallet.fromSeed("sEdVd1vJvRcoXCmrx7SwY8g2bhaD35h")
    const sendAmount = req.amount
            
    // -------------------------------------------------------- Prepare transaction
    const prepared = await client.autofill({
        "TransactionType": "Payment",
        "Account": standby_wallet.address,
        "Amount": xrpl.xrpToDrops(sendAmount),
        "Destination": operational_wallet.classicAddress
    })
        
    // ------------------------------------------------- Sign prepared instructions
    const signed = standby_wallet.sign(prepared)
    
    // -------------------------------------------------------- Submit signed blob
    const tx = await client.submitAndWait(signed.tx_blob)
        
    // standbyBalanceField.value =  (await client.getXrpBalance(standby_wallet.address))
    // operationalBalanceField.value = (await client.getXrpBalance(operational_wallet.address))                 
    client.disconnect()    

    return tx.result;
}

// const depositOrder = async(req) =>{
//     let contract = new contractProvider(orderAbi, req.orderContractAddress)
//     let nonce = await getNonce(wefitCfg.contractOwnerAddr)
//     try {
//         let receipt = await contract.methods.depositOrder(req.owner).send(Object.assign(contractParams, {nonce: nonce}));
//         return receipt
//     } catch (err) {
//         return err.message
//     }
// }


// exports.publish_nft_contract = async (req) =>{
//     // let contract = new Contract(orderAbi, orderContractAddress);
//     //set key - orderaddress 
//     let deployContract = new web3.eth.Contract(orderAbi)
//     let payload = {
//         data: orderByteCode.object,
//         arguments: [
//             wefitCfg.contractOwnerAddr, //fee wallet address
//             [req.challengeId,req.symbol,req.side,0,0,0,0,req.amount,0,0,req.duration], //order info
//             req.owner, //trader set owner of order
//             wefitCfg.wefitPriceFeedAddress // priceFeed address
//         ]
//     }
//     let deployTx =deployContract.deploy(payload)
//     const createTransaction = await web3.eth.accounts.signTransaction(
//         {
//            from: wefitCfg.contractOwnerAddr,
//            data: deployTx.encodeABI(),
//            gas: 5000000,
//            gasPrice: contractParams.gasPrice,
//            value: web3.utils.toWei(JSON.stringify(req.amount), 'ether')
//         },
//         wefitCfg.contractOwnerPriv
//     );
//     const createReceipt = await web3.eth.sendSignedTransaction(
//         createTransaction.rawTransaction
//     );
//     console.log('Contract deployed at address', createReceipt.contractAddress);
//     let orderInfo = {
//         orderId: createReceipt.contractAddress,
//         symbol: req.symbol,
//         createdAt: Date.now(),
//         status: 0
//     }
//     if(orderInfo.orderId == ''){
//         return 'Error missing orderId'
//     }
//     let request = {
//         orderContractAddress: createReceipt.contractAddress,
//         owner: req.owner,
//         admin: createReceipt.contractAddress,
//     }

//     let respSetAdmin = await setAdminToken(request)
//     console.log("Resp set admin token: ", respSetAdmin.transactionHash, " -s: ", respSetAdmin.status)

//     let receipt = await redisClient.zadd(req.challengeId, req.score, JSON.stringify(orderInfo));
//     return receipt
// }
// exports.scanPendingOrder = async (req) =>{
//     let listOrder = await redisClient.zrangeAsync(req, 0, -1);
//     return listOrder
// }

// exports.addWhiteListAddress = async(req) =>{
//     let orderContract = new contractProvider(orderAbi, req.orderContractAddress)
//     let nonce = await getNonce(req.adminAddress)
//     try {
//         let receipt = await orderContract.methods.addWhiteListAddress(req.adminAddress).send(Object.assign(contractParams, {nonce: nonce}))
//         return receipt
//     } catch (err) {
//         return err.message
//     }
// }

// exports.confirmResult = async(req) =>{
//     let orderContract = new contractProvider(orderAbi, req.orderContractAddress)
//     let nonce = await getNonce(wefitCfg.contractOwnerAddr)
//     let price = await getLatestPrice(req.symbol)
//     //get order info 
//     let orderInfo
//     try {
//         orderInfo = await orderContract.methods.getOrderInfo(req.orderContractAddress).call();
//     } catch (err) {
//         return err.message
//     }

//     console.log("Duration: ", Date.now() - orderInfo.openAt, " -n: ", Date.now(), " -open: ", orderInfo.openAt)

//     try {
//         let receipt = await orderContract.methods.confirmResult(price[0], parseInt(Date.now()/1000), orderInfo.amount).send(Object.assign(contractParams, {nonce: nonce}))
//         console.log("Confirm txHash: ", receipt.transactionHash)
//         return receipt
//     } catch (err) {
//         return err.message
//     }
// }