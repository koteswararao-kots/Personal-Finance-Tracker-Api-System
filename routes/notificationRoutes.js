const express = require('express');
const router = express.Router();
const { triggerNotifications } = require('../jobs/notificationJob');

router.post('/trigger', triggerNotifications);

module.exports = router;
