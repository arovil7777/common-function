const { Router } = require('express');
const { accounts, literal } = require('../models');
const { encryptWithSalt } = require('../controller/passwordEncrypt');

const router = Router();

// 계정 인증 (POST)
router.post('/login', async function (req, res) {
    const account = await accounts.findOne({
        where: {
            id: req.body.id
            // password: req.body.password
            // keepAlive: ??
        }
    });

    let dbPassword = account.password;
    let dbSalt = account.salt;
    let inputPassword = req.body.password;
    let hashPassword = await encryptWithSalt(inputPassword, dbSalt);

    if (dbPassword === hashPassword) {
        res.cookie('id', req.body.id, {
            expires: new Date(Date.now() + 900000),
            httpOnly: true
        });
        req.session.id = req.body.id;
        res.status(200).json('로그인 성공');
    } else {
        res.status(401).json('계정 정보 불일치');
    }
});

// 계정 인증 해제 (GET)
router.get('/logout', async function (req, res) {
    if (req.session) {
        req.session.destroy();
        res.clearCookie('sessionID');

        res.status(200).json('로그아웃 성공');
    } else {
        res.status(400).json('로그아웃 실패');
    }
});

// 계정 인증 해제 (POST)
router.post('/logout', async function (req, res) {
    if (req.session) {
        req.session.destroy();
        res.clearCookie('sessionID');

        res.status(200).json('로그아웃 성공');
    } else {
        res.status(400).json('로그아웃 실패');
    }
});

// ID 찾기 (POST)
router.post('/find-id', async function (req, res) {
    const account = await accounts.findOne({
        where: {
            email: req.body.email
        }
    });

    if (account) {
        res.status(200).json(account.id);
    } else {
        res.status(200).json();
    };
});

// 계정 패스워드 리셋 (POST)
router.post('/reset-password', async function (req, res) {
    try {
        accounts.update({
            updated: literal('now()'),
            password: ''
        }, { where: { id: req.body.id, email: req.body.email } });

        res.json('비밀번호가 초기화되었습니다.');
    } catch (err) {
        console.log(err);
    }
});

// 계정 등록 (POST)
router.post('/register', async function (req, res) {
    // req.redirect('/api/users/accounts');
});

module.exports = router;