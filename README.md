# AKT - Auktorisoidun kääntäjän tutkintojärjestelmä

- JDK 17
- PostgreSQL 13.4

Create local PostgreSQL database

```sh
docker build  -f db/Dockerfile  -t postgres-akt .
docker run -p 5432:5432 postgres-akt
```

Java code style https://github.com/spring-io/spring-javaformat
