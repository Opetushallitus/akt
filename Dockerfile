FROM eclipse-temurin:17-jdk

WORKDIR /app

ADD . ./
RUN ./mvnw clean install -DskipTests -Dskip.npm -Dspring.profiles.active=dev

CMD ["./mvnw", "spring-boot:run", "-Dskip.npm", "-Dspring.profiles.active=dev"]