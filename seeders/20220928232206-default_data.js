const { encrypt } = require('../controller/passwordEncrypt');
'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('levels', [
            {
                seq: 1,
                level: 10,
                name: '종합 관리자'
            },
            {
                seq: 2,
                level: 9,
                name: '관리자'
            },
            {
                seq: 3,
                level: 1,
                name: '사용자'
            },
            {
                seq: 4,
                level: 0,
                name: '비회원'
            }
        ]);

        const levelsRecords = await queryInterface.sequelize.query('SELECT seq FROM levels');
        const levels = levelsRecords[0];

        let totalEncrypt = await encrypt('totaladmin');
        let adminEncrypt = await encrypt('admin');

        await queryInterface.bulkInsert('accounts', [
            {
                seq: 1,
                id: 'total-admin',
                password: totalEncrypt.encrypt_password, // KDN 프로젝트 : hyper2130
                name: 'Total Administrator',
                email: 'hyper-admin@mail.system',
                level_seq: levels[3].seq,
                salt: totalEncrypt.salt
            },
            {
                seq: 2,
                id: 'admin',
                password: adminEncrypt.encrypt_password, // KDN 프로젝트 : hyper2130
                name: 'Administrator',
                email: 'admin@mail.system',
                level_seq: levels[2].seq,
                salt: adminEncrypt.salt
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('accounts', null, {});
        await queryInterface.bulkDelete('levels', null, {});
    }
};
