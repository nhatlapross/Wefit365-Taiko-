const {
    mint_nft,
    claim_profit
} = require('../service/nft.service')
const { logger } = require('../config/logger');

exports.mint_nft = async(req, res, next) =>{
    try {
        let request = {
            xrp_wallet: req.body.xrp_wallet,
            email: req.body.email,
            challengeId: req.body.challengeId,
        }
        let resp = await mint_nft(request)
        res.json({
            code: 0,
            data: resp
        })
    } catch (err) {
        logger.info("Create order error: ", err.message)
        next(err)
    }
}

exports.claim_profit = async(req, res, next) =>{
    try {
        let request = {
            xrp_wallet: req.body.xrp_wallet,
            email: req.body.email,
            amount: req.body.amount,
        }
        let resp = await claim_profit(request)
        res.json({
            code: 0,
            data: resp
        })
    } catch (err) {
        logger.info("Create order error: ", err.message)
        next(err)
    }
}