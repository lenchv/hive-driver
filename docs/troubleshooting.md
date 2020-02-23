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
