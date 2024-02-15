const { Router } = require('express');
const { accounts } = require('../models');
const { bodyLoad } = require('../controller/getBodies');

const router = Router();

/** accounts 테이블 **/

// 계정 생성 (POST)
router.post('/', async function (req, res) {
    var body = await bodyLoad(req, 'accountCreate');

    for (let i = 0; i < body.length; i++) {
        var results = [];

        accounts.create(body[i])
            .then(result => {
                results.push(result);
                if (results.length == body.length) {
                    res.json(results);
                }
            })
            .catch(err => {
                console.log(err);
            });
    }
});

// 계정 id 검증 (GET)
router.get('/:ids/confirm', async function (req, res) {
    const user_id = req.params.ids;

    accounts.findOne({ where: { id: user_id } })
        .then(result => {
            if (result.id == user_id) {
                res.json(false);
            }
        })
        .catch(err => {
            res.json(true);
        });
});

// 계정 email 검증 (GET)
router.get('/:emails/confirm', async function (req, res) {
    const user_email = req.params.emails;
    accounts.findOne({ where: { email: user_email } })
        .then(result => {
            if (result.email == user_email) {
                res.json(false);
            }
        })
        .catch(err => {
            res.json(true);
        });
});

// 계정 다중 수정 (PATCH)
router.patch('/', async function (req, res) {
    var body = await bodyLoad(req, 'accountUpdate');

    for (let i = 0; i < body.length; i++) {
        var results = [];

        accounts.update(body[i], { where: { seq: body[i].seq } })
            .then(result => {
                results.push(result);
                if (results.length == body.length) {
                    res.json(results);
                }
            })
            .catch(err => {
                console.log(err);
            });
    }
});

// 계정 단일 수정 (PATCH)
router.patch('/:seq', async function (req, res) {
    const user_seq = req.params.seq;
    var body = await bodyLoad(req, 'accountUpdate');

    accounts.update(body[0], { where: { seq: user_seq } })
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
        });
});

// 계정 다중/단일 삭제 (DELETE)
router.delete('/:seq', async function (req, res) {
    const seqs_params = req.params.seq;
    const user_seqs = [];

    if (seqs_params.indexOf(',') > 0) {
        user_seqs.push(seqs_params.split(','));
    }
    else {
        user_seqs.push(seqs_params);
    }

    var results = [];
    for (let i = 0; i < user_seqs.length; i++) {
        accounts.destroy({ where: { seq: user_seqs[i] } })
            .then(result => {
                results.push(result);
                if (results.length == user_seqs.length) {
                    res.json(results);
                }
            })
            .catch(err => {
                console.log(err);
            });
    }
});

module.exports = router;