const express = require('express');
const nft_controller = require("../controller/nft.controller")

const nftRouter = express.Router();

nftRouter.route('/mint').post(nft_controller.mint_nft);
nftRouter.route('/claim').post(nft_controller.claim_profit);

module.exports = nftRouter;
