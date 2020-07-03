const { exec } = require('child_process');
const path = require('path');
const http = require('http');

const execute = (command) => new Promise((resolve, reject) => {
    exec(command, {
        cwd: path.join(__dirname, '../../../.docker')
    }, (err, stdout, stderr) => {
        if (err) {
            reject(err);
        } else {
            resolve((stdout || '') + '\n' + (stderr || ''));
        }
    });
});

const isHiveReady = (logger) => new Promise((resolve, reject) => {
    const req = http.request({
        hostname: 'localhost',
        port: 10002,
        path: '/',
        method: 'get'
    }, res => {
        logger('Hive UI response status: ' + res.statusCode);
        if (res.statusCode === 200) {
            resolve(true);
        } else {
            resolve(false);
        }
    });

    req.on('error', (e) => {
        resolve(false);
    });
    req.end();
});

const waitUntilHiveReady = (attempts = 5, logger) => {
    if (attempts <= 0) {
        return Promise.reject(new Error('Hive cannot be started, please check configuration'));
    }
    logger('Connect to hive: ' + attempts);

    return isHiveReady(logger).then((result) => new Promise((resolve, reject) => {
        if (result) {
            return resolve();
        }

        setTimeout(() => {
            waitUntilHiveReady(attempts - 1, logger).then(resolve, reject);
        }, 2000);
    }));
};

const up = (type, logger = () => {}) => {
    logger('Start hive: ' + type);

    return execute('make up TYPE=' + type)
        .then(result => {
            logger(result);

            return waitUntilHiveReady(60, logger);
        });
};

const reload = (type, logger = () => {}) => {
    logger('Reload hive: ' + type);

    return execute('make reload TYPE=' + type)
        .then(result => {
            logger(result);

            return waitUntilHiveReady(30, logger);
        });
};

const upKrb = (type, logger = () => {}) => {
    logger('Start hive: ' + type);

    return execute('make up-krb TYPE=' + type)
        .then(result => {
            logger(result);

            return waitUntilHiveReady(30, logger);
        }).then(() => {
           return execute('make kinit').then(logger); 
        });
};

const down = (logger = () => {}) => {
    return execute('make down').then(logger);
};

module.exports = {
    up,
    upKrb,
    down,
    reload
};
