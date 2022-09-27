const { randomBytes, pbkdf2 } = require('crypto');

module.exports = {
    /* signup시 password를 보내고 salt와 encrypt_password를 반환 */
    encrypt: async (password) => {
        return new Promise(async (resolve, reject) => {
            try {
                const salt = randomBytes(64).toString('base64');
                pbkdf2(password, salt.toString(), 843912, 64, 'sha512', (err, derivedKey) => {
                    if (err) throw err;
                    const encrypt_password = derivedKey.toString('base64');
                    resolve({ salt, encrypt_password });
                });
            } catch (err) {
                console.log(err);
                reject(err);
            }
        })
    },
    /* signin시 저장된 salt와 password를 통해 저장된 값과 같은지 확인 용도 */
    encryptWithSalt: async (password, salt) => {
        return new Promise(async (resolve, reject) => {
            try {
                pbkdf2(password, salt, 843912, 64, 'sha512', (err, derivedKey) => {
                    if (err) throw err;
                    const encrypt_password = derivedKey.toString('base64');
                    resolve(encrypt_password);
                });
            } catch (err) {
                console.log(err);
                reject(err);
            }
        })
    }
};