module.exports = (client, connections, auth) => client.connect(
    {
        host: 'localhost',
        port: 10000,
    },
    new connections.TcpConnection(),
    new auth.NoSaslAuthentication()
);