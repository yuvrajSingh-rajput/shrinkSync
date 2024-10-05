const router = require('express').Router();
const {urlShortFunction, clickShortUrl, getResult} = require('../controllers/shortUrlControl');



router.route('/api/short-url').post(urlShortFunction);
router.route('/api/list').get(getResult);
router.route('/s/:shortedUrl').get(clickShortUrl);

module.exports = router;