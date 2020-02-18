build:
	cd hive && docker build --build-arg USER_UID=$(id -u) --build-arg USER_GID=$(id -g) -t lenchv/hive:2.3.6 .
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
	sed "s/HOSTNAME_VALUE/`hostname -f`/g" docker-compose.kerberos.yml > docker-compose.yml \
	&& docker-compose up -d kerberos.server \
	&& echo "Add user" \
	&& docker-compose exec -T kerberos.server kadmin -p admin/admin -w admin -q "addprinc -randkey hive/hive.driver@KERBEROS.SERVER" \
	&& docker-compose exec -T kerberos.server kadmin -p admin/admin -w admin -q "xst -k /opt/hive.keytab hive/hive.driver" \
	&& echo "Copy keytab" \
	&& docker cp hive.driver_kerberos.server:/opt/hive.keytab ${PWD}/krb/hive.keytab \
	&& echo "Add hive user" \
	&& docker-compose exec -T kerberos.server kadmin -p admin/admin -w admin -q "addprinc -pw hive hive@KERBEROS.SERVER" \
	&& cp ./confs/hive-site.xml.$(TYPE) ./confs/hive-site.xml \
	&& docker-compose up -d hive-server hive-metastore
down:
	docker-compose down -v
log:
	docker-compose logs -f hive-server
kinit:
	echo hive | kinit hive@KERBEROS.SERVER