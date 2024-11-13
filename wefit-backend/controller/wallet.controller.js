const { logger } = require('../config/logger');
const {generate_xrp_wallet, generate_evm_wallet} = require('../service/wallet.service')

exports.get_xrp_wallet = async(req, res, next) =>{
    try {       
        let email = req.body.email
        console.log('email:',email);
        let evm_wallet = await generate_evm_wallet(req);
        let xrp_wallet = await generate_xrp_wallet(req);

        let wallet_resp = {
            "email":email,
            "evm_wallet":evm_wallet,
            "xrp_wallet": xrp_wallet
        }

        res.json(wallet_resp)
    } catch (err) {
        logger.info("Get wallet error: ", err.message);
        next(err)
    }
}
