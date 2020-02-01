const config = require('./config');

module.exports = (client, connections, auth) => config().then(({ hostname }) => {
    return client.connect({
        host: hostname,
        port: 10000,
        options: {
        }
    }, new connections.TcpConnection(), new auth.PlainTcpAuthentication({
        username: 'admin',
        password: '123456'
    }));
});