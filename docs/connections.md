# Connections

- [No SASL](#no-sasl)
- [None](#none)
- [LDAP](#ldap)
- [Kerberos](#kerberos)
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
