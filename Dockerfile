FROM eclipse-temurin:11-jre-alpine
ENTRYPOINT ["/usr/bin/springeight.sh"]

COPY springeight.sh /usr/bin/springeight.sh
COPY target/springeight.jar /usr/share/springeight/springeight.jar
