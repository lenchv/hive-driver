const fs = require('fs');
const config = require('./config');

module.exports = (client, connections, auth) => config().then(({ hostname, ca, cert, key }) => client.connect({
    host: hostname,
    port: 10001,
    options: {
        path: '/hive',
        https: true,
        ca: fs.readFileSync(ca),
		cert: fs.readFileSync(cert),
		key: fs.readFileSync(key),
    }
}, new connections.HttpConnection(), new auth.PlainHttpAuthentication({})));
