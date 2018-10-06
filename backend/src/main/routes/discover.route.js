const express = require('express');
const router = express.Router();

const discoverController = require('../controller/discover.controller');

router.get('/', discoverController.getDiscoverPlaylist);

module.exports = router;
