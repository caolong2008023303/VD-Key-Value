var express = require('express');
var { postKeyValue, getKeyValue } = require('../controllers/keyvalue.controller');
var router = express.Router();

router.get('/', function (req, res) {
    res.status(200).json("Have a nice day!");
});

router.post('/object', function (req, res) {
    postKeyValue(req).then(resp => {
        res.status(200).json(resp);
    }).catch((err) => {
        console.log(err);
        res.status(400).json(err.message);
    });
});

router.get('/object/:mykey', function (req, res) {
    getKeyValue({ mykey: req.params.mykey, timestamp: req.query.timestamp }).then(resp => {
        res.status(resp ? 200 : 404).json(resp);
    }).catch((err) => {
        console.log(err);
        res.status(400).json(err.message);
    });
});

module.exports = router;