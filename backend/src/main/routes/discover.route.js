const express = require('express');
const router = express.Router();

const discoverController = require('../controller/discover.controller');

router.get('/', discoverController.getDiscoverPlaylist);

router.get('/track/:trackId', discoverController.getTrackById);

module.exports = router;
