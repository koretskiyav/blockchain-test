const express = require('express');

const routes = require('./routes');

const router = express.Router();

router.get('/depo', routes.depo.list);
router.post('/depo', routes.depo.create);
router.get('/unspent', routes.depo.unspent);
router.get('/forwarders', routes.forwarders.list);
router.post('/forwarders', routes.forwarders.create);

module.exports = router;
