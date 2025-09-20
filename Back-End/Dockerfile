FROM maven:3.8.4-openjdk-17 as builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
ENV SPRING_PROFILES_ACTIVE=prod
RUN mvn clean package -DskipTests

# Etapa final
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=builder /app/target/petcare-0.0.1-SNAPSHOT.jar petcare.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "petcare.jar"]