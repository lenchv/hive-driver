const fs = require('fs');
const path = require('path');

const getMessage = (message) => {
    return (new Date()) + ' [INFO] ' + message + '\n';
};

const logToFile = (message) => {
    fs.appendFileSync(path.join(__dirname, '../../e2e.log'), getMessage(message));
};

module.exports = (type = 'CONSOLE') => {
    switch (type) {
        case 'QUIET':
            return () => {};
        case 'FILE':
            return logToFile;
        case 'CONSOLE':
        default:
            return message => console.log(message);
    }
};