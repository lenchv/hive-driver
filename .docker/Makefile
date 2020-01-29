build:
	cd hive && docker build -t lenchv/hive:2.3.6 .
generate_ssl:
	cd ./ssl && ./generateSsl.sh
up:
	rm -f ./confs/hive-site.xml \
	&& cp ./confs/hive-site.xml.$(TYPE) ./confs/hive-site.xml \
	&& sed "s/HOSTNAME_VALUE/`hostname -f`/g" docker-compose.yml.dist > docker-compose.yml \
	&& docker-compose up -d
down:
	docker-compose down -v
log:
	docker-compose logs -f hive-server
