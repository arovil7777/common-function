const { Router } = require('express');
const { levels } = require('../models');
const { bodyLoad } = require('../controller/getBodies');

const router = Router();

/** levels 테이블 **/

// 계정 Level 생성 (POST)
router.post('/', async function (req, res) {
    var body = await bodyLoad(req, 'anotherCreate');

    for (let i = 0; i < body.length; i++) {
        var results = [];

        levels.create(body[i])
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

// Level 검증 (GET)
router.get('/:ids/confirm', async function (req, res) {
    const user_id = req.params.ids;

    levels.findOne({ where: { id: user_id } })
        .then(result => {
            if (result.id == user_id) {
                res.json(false);
            }
        })
        .catch(err => {
            // console.log(err);
            res.json(true);
        });
});

// Level 다중 수정 (PATCH)
router.patch('/', async function (req, res) {
    var body = await bodyLoad(req, 'anotherUpdate');

    for (let i = 0; i < body.length; i++) {
        var results = [];

        levels.update(body[i], { where: { id: body[i].level } })
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

// Level 단일 수정 (PATCH)
router.patch('/:ids', async function (req, res) {
    const user_id = req.params.ids;
    var body = await bodyLoad(req, 'anotherUpdate');

    levels.update(body[0], { where: { id: user_id } })
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
        });
});

// Level 다중/단일 삭제 (DELETE)
router.delete('/:ids', async function (req, res) {
    const ids_params = req.params.ids;
    const user_ids = [];

    if (ids_params.indexOf(',') > 0) {
        user_ids.push(ids_params.split(','));
    }
    else {
        user_ids.push(ids_params);
    }

    var results = [];
    for (let i = 0; i < user_ids.length; i++) {
        levels.destroy({ where: { id: user_ids[i] } })
            .then(result => {
                results.push(result);
                if (results.length == user_ids.length) {
                    res.json(results);
                }
            })
            .catch(err => {
                console.log(err);
            });
    }
});

module.exports = router;