FROM eclipse-temurin:17-jdk

WORKDIR /app

ADD . ./
RUN ./mvnw clean install -P travis -DskipTests -Dskip.npm

CMD ["./mvnw", "spring-boot:run", "-Dskip.npm"]