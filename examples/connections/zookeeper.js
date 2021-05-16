const ZooKeeper = require('zookeeper');
const hive = require('../..');
const { TCLIService, TCLIService_types } = hive.thrift;

function createClient(zookeeperQuorum) {
    const config = {
        connect: zookeeperQuorum,
        timeout: 5000,
        debug_level: ZooKeeper.ZOO_LOG_LEVEL_WARN,
        host_order_deterministic: false,
    };

    return new ZooKeeper(config);
}

function parseServerUri(param) {
	return param.replace(/^serverUri=/, '').split(';').shift();
}

async function getServerUri({ zookeeperQuorum, namespace }) {
	return new Promise((resolve, reject) => {
		const client = createClient(zookeeperQuorum);

		client.on('connect', async () => {
			const clusters = await client.get_children(namespace);
			const serverUri = parseServerUri(clusters[Math.ceil((clusters.length - 1) * Math.random())]);

			resolve(serverUri);
		});
	
		client.init();
	});
	
};

async function connectToHive(host, port) {
	const client = new hive.HiveClient(
		TCLIService,
		TCLIService_types
	);
	const utils = new hive.HiveUtils(
		TCLIService_types
	);

	client.connect(
		{ host, port },
		new hive.connections.TcpConnection(),
		new hive.auth.NoSaslAuthentication()
	).then(async client => {
		const session = await client.openSession({
			client_protocol: TCLIService_types.TProtocolVersion.HIVE_CLI_SERVICE_PROTOCOL_V10
		});
		
		const operation = await session.executeStatement(
			'show databases'
		);
		await utils.waitUntilReady(operation, false, () => {});
		await utils.fetchAll(operation);
		const result = utils.getResult(operation).getValue();
		await operation.close();

		console.log(result);

		await session.close();
		await client.close();
	})
	.catch(error => {
		console.error(error);
	});
}

async function start() {
	const hiveServerUri = await getServerUri({ zookeeperQuorum: 'localhost:2181', namespace: '/hiveserver2' });
	const [ host, port ] = hiveServerUri.split(':');

	await connectToHive(host, port);
}

start();