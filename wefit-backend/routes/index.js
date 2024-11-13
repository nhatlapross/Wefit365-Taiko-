const { recoverPublicKey } = require('ethers/lib/utils');
const express = require('express');
const challengeRoute = require('./challenge.route')
const walletRoute = require('./wallet.route')
const nft_route = require('./nft.route')

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

/**
 * GET v1/docs
 */
// router.use('/order', orderRoute);
router.use('/challenge', challengeRoute);
router.use('/wallet', walletRoute);
router.use('/nft', nft_route);

module.exports = router;
