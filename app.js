var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var env = require('dotenv').config();
var port = process.env.PORT || 8080;
var cors = require('cors');

// routes
var keyvalue = require('./lib/routes/keyvalue.route');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cors());

// register routes
app.use('/keyvalue', keyvalue);

// index path
app.get('/', function (req, res) {
    console.log('app listening on port: ' + port);
    res.send('App runing');
});

app.listen(port, function () {
    console.log('app listening on port: ' + port);
});
