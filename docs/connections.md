# Connections

- [No SASL](#no-sasl)
- [None](#none)
- [LDAP](#ldap)
- [Kerberos](#kerberos)
- [Zookeeper](#zookeeper)
- [Azure HDInsight](#azure-hdinsight)
- [SSL](#ssl)
- [Java Keystore (JKS)](#java-keystore-jks)

## No SASL

### Transport mode: **binary**

[*hive-site.xml*](/.docker/confs/hive-site.xml.tcp.nosasl)
```xml
...
<property>
    <name>hive.server2.authentication</name>
    <value>nosasl</value>
</property>
```

[*example*](/examples/connections/noSasl.js)

```javascript
const hive = require('hive-driver');

const client = new hive.HiveClient(
    hive.thrift.TCLIService,
    hive.thrift.TCLIService_types
);

client.connect(
    {
        host: 'localhost',
        port: 10000,
    },
    new hive.connections.TcpConnection(),
    new hive.auth.NoSaslAuthentication()
).then(client => {
    // ...
});
```

### Transport mode: **http**

[*hive-site.xml*](/.docker/confs/hive-site.xml.http.nosasl)

[*example*](/examples/connections/noSaslHttp.js)

```javascript
const hive = require('hive-driver');

const client = new hive.HiveClient(
    hive.thrift.TCLIService,
    hive.thrift.TCLIService_types
);

client.connect(
    {
        host: 'localhost',
        port: 10001,
        options: {
            path: '/hive'
        }
    },
    new hive.connections.HttpConnection(),
    new hive.auth.PlainHttpAuthentication()
).then(client => {
    // ...
});
```

## None

### Transport mode: **binary**

[*hive-site.xml*](/.docker/confs/hive-site.xml.tcp.plain)
```xml
...
<property>
    <name>hive.server2.authentication</name>
    <value>none</value>
</property>
```

[*example*](/examples/connections/plain.js)

```javascript
const hive = require('hive-driver');

const client = new hive.HiveClient(
    hive.thrift.TCLIService,
    hive.thrift.TCLIService_types
);

client.connect(
    {
        host: 'localhost',
        port: 10000,
    },
    new hive.connections.TcpConnection(),
    new hive.auth.PlainTcpAuthentication()
).then(client => {
    // ...
});
```

### Transport mode: **http**

[*hive-site.xml*](/.docker/confs/hive-site.xml.http.plain)

[*example*](/examples/connections/plainHttp.js)

```javascript
const hive = require('hive-driver');

const client = new hive.HiveClient(
    hive.thrift.TCLIService,
    hive.thrift.TCLIService_types
);

client.connect(
    {
        host: 'localhost',
        port: 10001,
        options: {
            path: '/hive'
        }
    },
    new hive.connections.HttpConnection(),
    new hive.auth.PlainHttpAuthentication()
).then(client => {
    // ...
});
```

## LDAP

### Transport mode: **binary**

[*hive-site.xml*](/.docker/confs/hive-site.xml.tcp.ldap)
```xml
...
<property>
    <name>hive.server2.authentication</name>
    <value>ldap</value>
</property>
```

[*example*](/examples/connections/ldap.js)
```javascript
const hive = require('hive-driver');

const client = new hive.HiveClient(
    hive.thrift.TCLIService,
    hive.thrift.TCLIService_types
);

client.connect(
    {
        host: 'localhost',
        port: 10000,
    },
    new hive.connections.TcpConnection(),
    new hive.auth.PlainTcpAuthentication({
        username: 'admin',
        password: '123456'
    })
).then(client => {
    // ...
});
```

### Transport mode: **http**

[*hive-site.xml*](/.docker/confs/hive-site.xml.http.ldap)

[*example*](/examples/connections/ldapHttp.js)

```javascript
const hive = require('hive-driver');

const client = new hive.HiveClient(
    hive.thrift.TCLIService,
    hive.thrift.TCLIService_types
);

client.connect(
    {
        host: 'localhost',
        port: 10001,
        options: {
            path: '/hive'
        }
    },
    new hive.connections.HttpConnection(),
    new hive.auth.PlainHttpAuthentication({
        username: 'admin',
        password: '123456'
    })
).then(client => {
    // ...
});
```

## Kerberos

```bash
npm i kerberos

# *nix
kinit hive@KERBEROS.SERVER

# On windows client must be authorized by domain controller
```

### Transport mode: **binary**

[*hive-site.xml*](/.docker/confs/hive-site.xml.tcp.kerberos)
```xml
...
<property>
    <name>hive.server2.authentication</name>
    <value>kerberos</value>
</property>
<property>
    <name>hive.server2.thrift.sasl.qop</name>
    <value>auth</value>
</property>
```

[*example*](/examples/connections/kerberos.js)
```javascript
const kerberos = require('kerberos');
const hive = require('hive-driver');

const client = new hive.HiveClient(
    hive.thrift.TCLIService,
    hive.thrift.TCLIService_types
);

client.connect(
    {
        host: 'localhost',
        port: 10000,
    },
    new hive.connections.TcpConnection(),
    new hive.auth.KerberosTcpAuthentication({
        username: 'hive@KERBEROS.SERVER',
        password: 'hive'
    }, new auth.helpers.MongoKerberosAuthProcess({
        fqdn: 'hive.driver',
        service: 'hive'
    }, kerberos)
).then(client => {
    // ...
});
```

### Transport mode: **http**

[*hive-site.xml*](/.docker/confs/hive-site.xml.http.kerberos)

[*example*](/examples/connections/kerberosHttp.js)

```javascript
const hive = require('hive-driver');

const client = new hive.HiveClient(
    hive.thrift.TCLIService,
    hive.thrift.TCLIService_types
);

client.connect(
    {
        host: 'localhost',
        port: 10001,
        options: {
            path: '/hive'
        }
    },
    new hive.connections.HttpConnection(),
    new auth.KerberosHttpAuthentication({
        username: 'hive@KERBEROS.SERVER',
        password: 'hive'
    }, new auth.helpers.MongoKerberosAuthProcess({
        fqdn: 'hive.driver',
        service: 'hive'
    }, kerberos))
).then(client => {
    // ...
});
```

## Zookeeper

The driver is not able to connect to zookeeper directly. Zookeeper contains a list of hosts to hive clusters, so you can retrieve from zookeeper the list on your own and then connect to hive via hive-driver.

To connect to zookeeper you can use npm library [zookeeper](https://www.npmjs.com/package/zookeeper). To retrieve list of hive clusters you have to know host of the zookeeper server and namespace.

Host and namespace you can find in *hive-site.xml* in properties: *hive.zookeeper.quorum* (one host is enough) and *hive.zookeeper.namespace* (default: hiveserver2).

After that you should be able to connect to zookeeper and retrieve hive clusters. Here is an example, but your cases maybe different, at least parsing server uri may differ:

[*example*](/examples/connections/zookeeper.js)

```javascript
const ZooKeeper = require('zookeeper');

function parseServerUri(param) {
	return param.replace(/^serverUri=/, '').split(';').shift();
}

async function getServerUri({ zookeeperQuorum, namespace }) {
	return new Promise((resolve, reject) => {
        const client = new ZooKeeper({
            connect: zookeeperQuorum,
            timeout: 5000,
            debug_level: ZooKeeper.ZOO_LOG_LEVEL_WARN,
            host_order_deterministic: false,
        });

		client.on('connect', async () => {
            // getting list of clusters from zookeeper namespace
			const clusters = await client.get_children(namespace);
			// take random cluster and parse it
            const serverUri = parseServerUri(clusters[Math.ceil((clusters.length - 1) * Math.random())]);

			resolve(serverUri);
		});
	
		client.init();
	});
};

const hiveHost = await getServerUri({ zookeeperQuorum: 'localhost:2181', namespace: '/hiveserver2' });
```

And when you get hive host you can connect with *hive-driver*:

```javascript
async function connectToHive(host, port) {
	const client = new hive.HiveClient(TCLIService, TCLIService_types);
	const utils = new hive.HiveUtils(TCLIService_types);

	client.connect(
		{ host, port },
		new hive.connections.TcpConnection(),
		new hive.auth.NoSaslAuthentication()
	).then(async client => {
		// ... execute statements
		await client.close();
	});
}

const [host, port] = hiveHost.split(':');
await connectToHive(host, port);
```

You can find an example of the instance with zookeeper in [.docker](/.docker) folder.

To run it execute following commands:

```bash
make up-zoo TYPE=tcp.nosasl.zoo
```

Via beeline you can connect as following:

```bash
docker-compose exec hive-server bin/beeline
!connect jdbc:hive2://zookeeper:2181/default;serviceDiscoveryMode=zooKeeper;zooKeeperNamespace=hiveserver2
```

## Azure HDInsight

[*example*](/examples/connections/hdinsight.js)

```javascript
const hive = require('hive-driver');

const client = new hive.HiveClient(
    hive.thrift.TCLIService,
    hive.thrift.TCLIService_types
);

client.connect(
    {
        host: '<cluster-name>.azurehdinsight.net',
        port: 443,
        options: {
            path: '/hive2',
            https: true
        }
    },
    new hive.connections.HttpConnection(),
    new hive.auth.PlainHttpAuthentication({
        username: 'cluster-user',
        password: 'cluster-password'
    })
).then(client => {
    // ...
});
```

## SSL

For all kinds of connections the SSL settings are the same

### Transport mode: **binary**

[*hive-site.xml*](/.docker/confs/hive-site.xml.tcp.nosasl.ssl)

[*example*](/examples/connections/noSaslSsl.js)

```javascript
const hive = require('hive-driver');

const client = new hive.HiveClient(
    hive.thrift.TCLIService,
    hive.thrift.TCLIService_types
);

client.connect(
    {
        host: 'host.name',
        port: 10000,
        options: {
            ssl: true,
            cert: fs.readFileSync('/path/to/cert.crt'),
            key: fs.readFileSync('/path/to/cert.key'),
            // in case of self-signed cert
            ca: fs.readFileSync('/path/to/cert.ca')
        }
    },
    new hive.connections.TcpConnection(),
    new hive.auth.NoSaslAuthentication()
).then(client => {
    // ...
});
```

### Transport mode: **http**

[*hive-site.xml*](/.docker/confs/hive-site.xml.http.nosasl.ssl)

[*example*](/examples/connections/noSaslHttpSsl.js)

```javascript
const hive = require('hive-driver');

const client = new hive.HiveClient(
    hive.thrift.TCLIService,
    hive.thrift.TCLIService_types
);

client.connect(
    {
        host: 'host.name',
        port: 10001,
        options: {
            path: '/hive',
            https: true,
            cert: fs.readFileSync('/path/to/cert.crt'),
            key: fs.readFileSync('/path/to/cert.key'),
            // in case of self-signed cert
            ca: fs.readFileSync('/path/to/cert.ca')
        }
    },
    new hive.connections.HttpConnection(),
    new hive.auth.PlainHttpAuthentication()
).then(client => {
    // ...
});
```

## Java Keystore (JKS)

```bash
npm i jks-js
```

[*example*](/examples/connections/noSaslKeystore.js)

```javascript
const jks = require('jks-js');
const hive = require('hive-driver');

const keystore = jks.toPem(
    fs.readFileSync('/path/to/keystore.jks'),
    'keystore-password'
);

const client = new hive.HiveClient(
    hive.thrift.TCLIService,
    hive.thrift.TCLIService_types
);

client.connect(
    {
        host: 'host.name',
        port: 10000,
        options: {
            ssl: true,
            cert: keystore['alias'].cert,
            key: keystore['alias'].key
        }
    },
    new hive.connections.TcpConnection(),
    new hive.auth.NoSaslAuthentication()
).then(client => {
    // ...
});
```
