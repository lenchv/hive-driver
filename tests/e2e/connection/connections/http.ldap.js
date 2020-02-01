const config = require('./config');

module.exports = (client, connections, auth) => config().then(({ hostname }) => client.connect({
    host: hostname,
    port: 10001,
    options: {
        path: '/hive'
    }
}, new connections.HttpConnection(), new auth.PlainHttpAuthentication({
    username: 'admin',
    password: '123456'
})));
