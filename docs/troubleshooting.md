# Troubleshooting

This section contains recipies for common errors.

- [413 FULL head](#413-full-head)

## 413 FULL head

Related to issue [HIVE-11720](https://issues.apache.org/jira/browse/HIVE-11720)

Workaround:

increase the properties

hive-site.xml
```xml
<property>
    <name>hive.server2.thrift.http.response.header.size</name>
    <value>32768</value>
</property>
<property>
    <name>hive.server2.thrift.http.request.header.size</name>
    <value>32768</value>
</property>
```

## Lost connection

In this case HiveClient you have to reconnect.

To define if the connection lost, you should subscribe on event "close":

```javascript
client.on('close', () => {
    // do reconnect
});
```

Here is an example how you can manage reconnection:

```javascript
const hive = require('hive-driver');

const RECONNECT_ATTEMPTS = 50;
const RECONNECT_TIMEOUT = 3000; // millisecond

const client = new hive.HiveClient(
    hive.thrift.TCLIService,
    hive.thrift.TCLIService_types
);

client.on('close', () => {
    console.error('[Hive Connection Lost]');

    connect(RECONNECT_ATTEMPTS).catch(error => {
        console.error('[Hive Connection Failed]', error);
    });
});

connect(RECONNECT_ATTEMPTS).then(async client => {
    // work with client
}, (error) => {
    console.error('[Hive Connection Failed]', error);
});

function connect(attempts) => new Promise((resolve, reject) => {
    setTimeout(() => {
        client.connect(
            {
                host: 'localhost',
                port: 10000,
                options: {}
            },
            new hive.connections.TcpConnection(),
            new hive.auth.NoSaslAuthentication() 
        ).then((client) => {
            console.log('Connected successfully to hive server!');

            resolve(client);
        }, (error) => {
            console.error('[Hive Connection Failed] attempt:' + attempts, error.message);

            if (!attempts) {
                reject(error);
            } else {
                connect(attempts - 1).then(resolve, reject);
            }
        });
    }, RECONNECT_TIMEOUT);
});
```

Please, notice, that you do not have to re-create client and pass it to your services,
after re-connection the old client instance works just fine,
and you should be able to open session and work as you did before.
