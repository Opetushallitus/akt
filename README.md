# AKT - Auktorisoidun kääntäjän tutkintojärjestelmä

- Maven 3.1+
- JDK 17
- PostgreSQL 11.2
- node v14.18.1 (no need to install if you only build)
- npm 8.1.3 (no need to install if you only build)

## Developing with docker-compose

Bring up the DB, backend and frontend containers:

```sh
docker-compose up
```

Or bring up individual services according to your needs:
```sh
docker-compose up postgres frontend
```

The website is served by the frontend container at `http://localhost:4000/akt`.
The frontend container supports hot reload of frontend resources.

## Working with Maven
### Build and Run


Project build downloads and installs correct node and npm versions, no need to install them for build.

```sh
mvn clean install
mvn spring-boot:run
```

or using Maven Wrapper

```sh
./mvnw clean install
./mvnw spring-boot:run
```

and open browser to http://localhost:8080/akt/

## API documentation

### OpenAPI

http://localhost:8080/akt/api/api-docs

### Swagger

http://localhost:8080/akt/api/swagger-ui.html

In order to make requests work in swagger ui, application must be run with parameter

```
mvn spring-boot:run -Dtomcat.util.http.parser.HttpParser.requestTargetAllow=|{}
```
