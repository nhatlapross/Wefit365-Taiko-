const express = require('express');
const challengeController = require('../controller/challenge.controller')

const challengeRouter = express.Router();

challengeRouter.route('/').post(challengeController.createChallenge)
challengeRouter.route('/createChallengeConfig').post(challengeController.createChallengeConfig)
challengeRouter.route('/withdrawChallenge').post(challengeController.withDrawChallenge)

module.exports = challengeRouter;
