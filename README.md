# AKT - Auktorisoidun kääntäjän tutkintojärjestelmä

- Maven 3.1+
- JDK 17
- PostgreSQL 12.9
- node v16.13.1 (no need to install if you only build)
- npm 8.1.3 (no need to install if you only build)

## Developing with docker-compose

Bring up the DB, backend and frontend containers:

```sh
docker-compose up
```

Or

Start up a certain service:

```sh
docker-compose up frontend | backend | postgres
```

In case of errors, clean cache and recreate volumes:

```sh
docker-compose down
docker-compose up --build --force-recreate --renew-anon-volumes
```

The website is served by the frontend container at `http://localhost:4000`. The frontend container supports hot reload
of frontend resources.

## Working with Maven

### Build and Run

Project build downloads and installs correct node and npm versions, no need to install them for build.

```sh
mvn clean install
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

or using Maven Wrapper

```sh
./mvnw clean install
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

and open browser to

> <http://localhost:8080>

## Authentication and authorisation

### Production

Production settings for authentication and authorisation (CAS) are used by default.

### Development

Turn development profile `dev` on

```sh
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

Dev profile adds following user:password:

- clerk:clerk
    - User with clerk (virkailija) privileges
- user:user
    - User with no privileges

Dev profile also enables form authentication, and http basic auth for easier command line tool access.

In development profile it is possible to turn off all authentication and authorisation with system
property `dev.web.security.off=true` You can pass it to spring boot with:

```sh
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev -Dspring-boot.run.jvmArguments=-Ddev.web.security.off=true
```

## Backend

Code format for Java code is Prettier Java. [Maven plugin](https://github.com/HubSpot/prettier-maven-plugin) is used to
enforce style. In dev environment, `mvn validate` rewrites all java files to correct format. On CI format is only
validated (maven profile `travis`)

`ìmport *` is disabled:
Code Style -> Java -> Imports:

```text
Class count to use import with '*': 999
Names count to use static import with '*': 999
```

## Frontend

In order to keep code clean and easily maintainable please use the following VS Code Extensions.

- [prettier]
- [eslint]
- [stylelint]
   
   Add the following lines to your settings.json as show [here](https://kumardeepak.xyz/blog/stylelint-scss-and-visual-studio-code/)

    ```sh
    "css.validate": false,
    "less.validate": false,
    "scss.validate": false,
    "stylelint.validate": [ "css", "scss"],
    ```

### Running tests

End-to-end tests:

```sh
npm run test:cypress
```

Unit and Integretion tests

```sh
npm run test:jest
npm run test:jest -- -u  # Regenerate snapshots
```

## API documentation

### Health check and general information

Health check:

> <http://localhost:8080/akt/api/actuator/health>

General information about the running application:

> <http://localhost:8080/akt/api/actuator/info>

### OpenAPI

> <http://localhost:8080/akt/api/api-docs>

### Swagger

> <http://localhost:8080/akt/api/swagger-ui.html>

In order to make requests work in swagger ui, application must be run with parameter

```
mvn spring-boot:run -Dtomcat.util.http.parser.HttpParser.requestTargetAllow=|{}
```

# Localisations

## Frontend

OPH localisation service is not used. Localisations are in JSON files, committed to git.

For inspection and modification by OPH clerks, it's possible to generate a CSV-file based on localisations:

```sh
npm run localisation:to_csv
```

In order to import a CSV-file of localisations as contents of the localisation JSON files, run

```sh
npm run localisation:from_csv [path_to_csv_file] [delimiter]
```

Delimiter is `|` by default.

# Backend

TBD emails etc

## Koodisto languages

Translations for language names are fetched from Koodisto. When those translations need to be updated, run:

```sh
cd scripts
./koodisto-langs.sh
```

Above script fetches language codes JSON from Koodisto, stores it for backend, and transforms it to localisation files
for frontend. Results are committed to git.


[prettier]: https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode

[eslint]: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint

[stylelint]: https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint
