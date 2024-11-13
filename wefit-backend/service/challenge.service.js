const Contract = require('web3-eth-contract');
const bluebird = require('bluebird'); // eslint-disable-line no-global-assign
const HDWalletProvider = require("@truffle/hdwallet-provider");
const redis = require("redis");
const {wefitCfg} = require("../config/vars");
bluebird.promisifyAll(redis);
const Web3 = require('web3')
const web3 = new Web3(wefitCfg.providerUrl)

//contract config 
const gasPrice = '5000000000'
const maxErc20GasLimit = 500000
const challengeAbi = require("../abi/challengeAbi.json");
const provider = new HDWalletProvider({ 
    privateKeys: [wefitCfg.contractOwnerPriv], 
    providerOrUrl: wefitCfg.providerUrl,
    pollingInterval: 8000
});

const contractParams = {
    from    : wefitCfg.contractOwnerAddr,
    gasPrice: 2500000000000,
    gas     : 500000
};

Contract.setProvider(provider)

exports.createChallenge = async (req)=>{
    let contract = new Contract(challengeAbi, wefitCfg.wefitChallengeAddress);
    try {
        let receipt = await contract.methods.create_challenge(
            req.date, // Changed to use req.date
            req.owner, // Changed to use req.owner
            req.challenge_type, // Changed to use req.challenge_type
            req.pool_prize, // Changed to use req.pool_prize
            req.price, // Changed to use req.price
            req.expected_return, // Changed to use req.expected_return
            req.expire_date, // Changed to use req.expire_date
            req.distance_goal, // Changed to use req.distance_goal
            req.participants_limit // Changed to use req.participants_limit
        ).send(Object.assign(contractParams));
        return receipt;
    } catch (err) {
        return err.message
    }
}

exports.withDraw = async(req) =>{
    let contract = new Contract(challengeAbi, wefitCfg.wefitChallengeAddress)
    let nonce = await getNonce(wefitCfg.contractOwnerAddr)
    try {
        let receipt = await contract.methods.withdrawChallenge(req.sender, req.amount, req.challengeId).send(Object.assign(contractParams, {nonce: nonce}))
        return receipt
    } catch (err) {
        return err.message
    }
}

exports.createChallengeConfig = async(req) =>{
    let contract = new Contract(challengeAbi, wefitCfg.wefitChallengeAddress)
    let nonce = await getNonce(wefitCfg.contractOwnerAddr)
    try {
        let request = [
            req.configId,
            req.challengeId,
            req.duration,
            req.symbol,
            true,
            parseInt(Date.now()/1000),
            parseInt(Date.now()/1000),
            req.bidRate
        ]
        let receipt = await contract.methods.createChallengeConfig(request).send(Object.assign(contractParams, {nonce: nonce}))
        return receipt
    } catch (err) {
        return err.message
    }
}

exports.getChallengeById = async(req) =>{
    let contract = new Contract(challengeAbi, wefitCfg.wefitChallengeAddress)
    let nonce = await getNonce(wefitCfg.contractOwnerAddr)
    try {
        // let request = [
        //     req.configId,
        //     ,
        //     req.duration,
        //     req.symbol,
        //     true,
        //     parseInt(Date.now()/1000),
        //     parseInt(Date.now()/1000),
        //     req.bidRate
        // ]
        let receipt = await contract.methods.getChallengeById(req.challengeId).call()
        console.log("Challenge info: ", receipt)
        return receipt
    } catch (err) {
        return err.message
    }
}
