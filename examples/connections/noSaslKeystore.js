const fs = require('fs');
const config = require('./config');
const hive = require('../../');
const jks = require('jks-js');
const { TCLIService, TCLIService_types } = hive.thrift;
const { HiveClient, auth, connections } = hive;

const connection = new connections.TcpConnection();
const authProvider = new auth.NoSaslAuthentication();

const client = new HiveClient(
    TCLIService,
    TCLIService_types
);

module.exports = () => config().then(({ hostname }) => {
	const keystore = jks.toPem(fs.readFileSync(__dirname + '/../../.docker/ssl/keystore.jks'), '1a2b3c');
	const { key, cert } = keystore[hostname];

	return client.connect({
        host: hostname,
        port: 10000,
        options: {
            ssl: true,
            username: 'hive',
            password: 'hive',
            cert: cert,
            key: key,
        }
    }, connection, authProvider);
});