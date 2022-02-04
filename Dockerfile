FROM eclipse-temurin:17-jdk

WORKDIR /app

ADD . ./
RUN ./mvnw clean install -P travis -DskipTests -Dskip.npm -Dspring-boot.run.profiles=dev

CMD ["sh", "-c", "./mvnw spring-boot:run -Dskip.npm -Dspring-boot.run.profiles=dev -Dspring-boot.run.jvmArguments=-Ddev.web.security.off=${AKT_UNSECURE:-false}" ]