# AKT - Auktorisoidun kääntäjän tutkintojärjestelmä

* Maven 3.1+
* JDK 17
* PostgreSQL 13.4
* node v14.18.1 (no need to install if you only build)
* npm 8.1.3 (no need to install if you only build)
- JDK 17
- PostgreSQL 11.2

Create local PostgreSQL database

```sh
docker build  -f db/Dockerfile  -t postgres-akt .
docker run -d -p 5432:5432 postgres-akt
```

Java code style https://github.com/spring-io/spring-javaformat

Java code style https://github.com/spring-io/spring-javaformat is enforced on build.

## Build

Project build downloads and installs correct node and npm versions, no need to install them for build.

```sh
mvn clean install
```

## Run

```sh
mvn spring-boot:run
```
and open browser to http://localhost:8080/akt/