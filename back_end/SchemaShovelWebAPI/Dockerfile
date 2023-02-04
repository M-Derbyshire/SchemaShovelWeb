FROM eclipse-temurin
WORKDIR /app
 
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline
 
COPY /src/main ./src/main

EXPOSE 8080
CMD ["./mvnw", "-Dmaven.test.skip", "spring-boot:run"]