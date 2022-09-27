const { sequelize } = require('../models');
const { encrypt } = require('./passwordEncrypt');

async function bodyLoad(req, state) {
    if (state == 'accountCreate') {
        var body = [];

        if (req.body.length == undefined) {
            body.push(req.body);
        } else {
            body = req.body;
        }

        for (let i = 0; i < body.length; i++) {
            const {
                salt,
                encrypt_password
            } = await encrypt(body[i].password);

            body[i].password = encrypt_password;
            body[i].salt = salt;
        }

        return body;
    } else if (state == 'accountUpdate') {
        var body = [];

        if (req.body.length == undefined) {
            body.push(req.body);
        } else {
            body = req.body;
        }

        for (let i = 0; i < body.length; i++) {
            body[i].updated = sequelize.literal('now()');

            if (body[i].password) {
                const {
                    salt,
                    encrypt_password
                } = await encrypt(body[i].password);

                body[i].password = encrypt_password;
                body[i].salt = salt;
            }
        }

        return body;
    } else if (state == 'anotherCreate') {
        var body = [];

        if (req.body.length == undefined) {
            body.push(req.body);
        } else {
            body = req.body;
        }

        return body;
    } else if (state == 'anotherUpdate') {
        var body = [];

        if (req.body.length == undefined) {
            body.push(req.body);
        } else {
            body = req.body;
        }

        for (let i = 0; i < body.length; i++) {
            body[i].updated = sequelize.literal('now()');
        }

        return body;
    }
}

module.exports = bodyLoad;