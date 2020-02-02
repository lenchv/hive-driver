build:
	cd hive && docker build -t lenchv/hive:2.3.6 .
build-kerberos:
	cd hive-kerberos && docker build -t lenchv/hive:kerberos .
generate_ssl:
	cd ./ssl && ./generateSsl.sh
up:
	rm -f ./confs/hive-site.xml \
	&& cp ./confs/hive-site.xml.$(TYPE) ./confs/hive-site.xml \
	&& sed "s/HOSTNAME_VALUE/`hostname -f`/g" docker-compose.yml.dist > docker-compose.yml \
	&& docker-compose up -d
up-krb:
	docker-compose -f docker-compose.kerberos.yml up -d kerberos.server \
	&& docker-compose exec kerberos.server kadmin -p admin/admin -w admin -q "addprinc -randkey hive/hive.driver@KERBEROS.SERVER" \
	&& docker-compose exec kerberos.server kadmin -p admin/admin -w admin -q "xst -k /opt/hive.keytab hive/hive.driver" \
	&& docker cp hive.driver_kerberos.server:/opt/hive.keytab ${PWD}/krb/hive.keytab \
	&& docker-compose exec kerberos.server kadmin -p admin/admin -w admin -q "addprinc -pw hive hive@KERBEROS.SERVER" \
	&& docker-compose -f docker-compose.kerberos.yml up -d hive-server hive-metastore
down:
	docker-compose down -v
log:
	docker-compose logs -f hive-server
	