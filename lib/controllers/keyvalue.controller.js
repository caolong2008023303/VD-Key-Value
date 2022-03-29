var env = process.env.NODE_ENV || "development";
const KeyValues = require('../../db').KeyValues;

const postKeyValue = (req) => {
    const { body } = req || {};
    return new Promise(function (resolve, reject) {
        try {
            if (typeof body !== "object" || Array.isArray(body) || Object.keys(body).length != 1) {
                throw new Error("Request body is not valid!");
            }

            let res = {};
            res.key = Object.keys(body)[0] ? Object.keys(body)[0] : '';
            res.value = Object.values(body)[0] ? Object.values(body)[0] : '';
            res.timestamp = Date.now();

            // Guess should query data with key and value first
            let newCreated = true;
            KeyValues.check(res.key, res.value, (err, keyvalue) => {
                if (err) return reject(err);
                if (!keyvalue) {
                    KeyValues.create({
                        "key": res.key,
                        "value": res.value,
                        "timestamp": res.timestamp
                    }, (err) => {
                        if (err) return reject(err);
                        resolve(res);
                    });
                } else {
                    // Update
                    KeyValues.update({
                        "key": res.key,
                        "value": res.value,
                        "timestamp": res.timestamp
                    }, (err) => {
                        if (err) return reject(err);
                        resolve(res);
                    });
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

const getKeyValue = (req) => {
    return new Promise(function (resolve, reject) {
        try {
            const { mykey, timestamp } = req || {};

            if (typeof mykey == 'undefined' || mykey == null) {
                throw new Error("Request param is not valid!");
            }

            KeyValues.find(mykey, timestamp, (err, keyvalue) => {
                if (err) return reject(err);
                resolve(keyvalue);
            })

            /* KeyValues.all((err, keyvalue) => {
                if (err) return reject(err);
                resolve(keyvalue);
            }) */

            /* KeyValues.deleteAll((err, keyvalue) => {
                if (err) return reject(err);
                resolve(keyvalue);
            }) */

        } catch (error) {
            reject(error);
        }
    });
}

module.exports = { postKeyValue, getKeyValue };