# AKT - Auktorisoidun kääntäjän tutkintojärjestelmä

* JDK 17
* PostgreSQL 13.4

Create local PostgreSQL database

```sh
docker run --name postgres-akt -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:13.4
```

Java code style https://github.com/spring-io/spring-javaformat