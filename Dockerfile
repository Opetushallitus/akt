FROM maven:3.8.4-openjdk-17-slim

WORKDIR /app

ADD . ./
RUN mvn clean install -DskipTests

CMD ["mvn", "spring-boot:run"]
