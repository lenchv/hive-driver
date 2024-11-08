deploy-base:
	cd hive/$(VERSION) && docker build -t lenchv/base-hive:$(VERSION) -f Dockerfile.base . && docker push lenchv/base-hive:$(VERSION)
build:
	cd hive/$(VERSION) && docker build --build-arg USER_UID=$$(id -u) --build-arg USER_GID=$$(id -g) -t lenchv/hive:$(VERSION) .
knox:
	cd knox && docker build -t lenchv/knox:0.13.0 -f Dockerfile.knox .
generate_ssl:
	cd ./ssl && ./generateSsl.sh
up:
	rm -f ./confs/hive-site.xml \
	&& cp ./confs/hive-site.xml.$(TYPE) ./confs/hive-site.xml \
	&& sed "s/HOSTNAME_VALUE/`hostname -f`/g" docker-compose.yml.dist > docker-compose.yml \
	&& docker compose up -d
up-krb:
	sed "s/HOSTNAME_VALUE/`hostname -f`/g" docker-compose.kerberos.yml > docker-compose.yml \
	&& docker compose up -d kerberos.server \
	&& echo "Add user" \
	&& docker compose exec -T kerberos.server kadmin.local -p root/admin -w admin -q "addprinc -randkey hive/hive.driver@KERBEROS.SERVER" \
	&& docker compose exec -T kerberos.server kadmin.local -p root/admin -w admin -q "xst -k /root/hive.keytab hive/hive.driver" \
	&& echo "Copy keytab" \
	&& docker cp hive.driver_kerberos.server:/root/hive.keytab ${PWD}/krb/hive.keytab \
	&& echo "Add hive user" \
	&& docker compose exec -T kerberos.server kadmin.local -p root/admin -w admin -q "addprinc -pw hive hive@KERBEROS.SERVER" \
	&& cp ./confs/hive-site.xml.$(TYPE) ./confs/hive-site.xml \
	&& docker compose up -d hive-server hive-metastore
up-zoo:
	rm -f ./confs/hive-site.xml \
	&& cp ./confs/hive-site.xml.$(TYPE) ./confs/hive-site.xml \
	&& sed "s/HOSTNAME_VALUE/`hostname -f`/g" docker-compose.zookeeper.dist > docker-compose.yml \
	&& docker compose up -d
down:
	docker compose down -v
log:
	docker compose logs -f hive-server
kinit:
	echo hive | kinit hive@KERBEROS.SERVER
reload:
	rm -f ./confs/hive-site.xml \
	&& cp ./confs/hive-site.xml.$(TYPE) ./confs/hive-site.xml \
	&& docker compose restart hive-server hive-metastore