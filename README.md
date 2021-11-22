# AKT - Auktorisoidun kääntäjän tutkintojärjestelmä

- JDK 17
- PostgreSQL 11.2

Create local PostgreSQL database

```sh
docker build  -f db/Dockerfile  -t postgres-akt .
docker run -d -p 5432:5432 postgres-akt
```

Java code style https://github.com/spring-io/spring-javaformat
