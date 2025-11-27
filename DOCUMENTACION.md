# Documentación del Proyecto Springeight

## Descripción General

Este proyecto, nombrado **springeight**, es una aplicación de Spring Boot que implementa un servicio gRPC de saludos. Fué concebido para demostrar la integración de Spring Boot con la tecnología gRPC, permitiendo communicaciones eficientes entre servicios.

## Información del Proyecto

- **Nombre**: springeight
- **Versión**: 0.0.2-SNAPSHOT
- **Grupo**: com.example
- **Artefacto**: springeight
- **Empaquetado**: JAR
- **Java**: Versión 11
- **Spring Boot**: 2.2.4.RELEASE
- **Ciclo de Vida**: Production
- **Propietario**: team-a

## Arquitectura del Sistema

### Diagrama de Componentes

```mermaid
graph TB
    subgraph "Aplicación Spring Boot"
        A[Application.java<br/>Clase Principal] --> B[GreeterService.java<br/>Servicio gRPC]
        B --> C[Greeter Proto<br/>Definición gRPC]
    end
    
    D[Cliente gRPC] -->|Petición HelloRequest| B
    B -->|Respuesta HelloReply| D
    
    style A fill:#90EE90
    style B fill:#87CEEB
    style C fill:#FFD700
    style D fill:#FFA07A
```

### Diagrama de Clases

```mermaid
classDiagram
    class Application {
        +main(String[] args) void
    }
    
    class GreeterService {
        +sayHello(HelloRequest, StreamObserver~HelloReply~) void
    }
    
    class GreeterGrpc {
        <<abstract>>
    }
    
    class HelloRequest {
        +String name
        +getName() String
    }
    
    class HelloReply {
        +String message
        +getMessage() String
    }
    
    Application ..> GreeterService : utiliza
    GreeterService --|> GreeterGrpc : extiende
    GreeterService ..> HelloRequest : recibe
    GreeterService ..> HelloReply : retorna
    
    note for GreeterService "Anotado con @GRpcService"
    note for Application "Anotado con @SpringBootApplication"
```

### Diagrama de Secuencia

```mermaid
sequenceDiagram
    participant Cliente
    participant GreeterService
    participant StreamObserver
    
    Cliente->>GreeterService: sayHello(HelloRequest)
    activate GreeterService
    Note over GreeterService: Construye mensaje:<br/>"Kaixo " + nombre
    GreeterService->>HelloReply: newBuilder().setMessage()
    HelloReply-->>GreeterService: HelloReply construido
    GreeterService->>StreamObserver: onNext(HelloReply)
    GreeterService->>StreamObserver: onCompleted()
    deactivate GreeterService
    StreamObserver-->>Cliente: Respuesta completada
```

## Estructura del Proyecto

### Diagrama de Paquetes

```mermaid
graph LR
    A[com.example.es.ibermatica.springeight] --> B[Application.java]
    A --> C[GreeterService.java]
    A --> D[proto]
    D --> E[GreeterGrpc]
    D --> F[GreeterOuterClass]
    
    style A fill:#E6E6FA
    style D fill:#FFE4B5
```

### Organización de Directorios

```
springeight/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/example/es.ibermatica.springeight/
│   │   │       ├── Application.java
│   │   │       └── GreeterService.java
│   │   └── resources/
│   │       └── greeter.proto
│   └── test/
│       └── java/
│           └── com/example/es.ibermatica.springeight/
│               └── ApplicationTest.java
├── pom.xml
├── Dockerfile
└── catalog-info.yaml
```

## Componentes Principales

### 1. Application.java

La clase principal que inicia la aplicación Spring Boot. Contiene el método `main` que invoca a `SpringApplication.run()`.

```mermaid
flowchart LR
    A[Inicio] --> B[SpringApplication.run]
    B --> C[Carga Configuración]
    C --> D[Inicializa Beans]
    D --> E[Inicia Servidor gRPC]
    E --> F[Aplicación Lista]
    
    style A fill:#90EE90
    style F fill:#90EE90
```

### 2. GreeterService.java

Servicio gRPC anotado con `@GRpcService` que implementa la lógica del saludo. Extiende `GreeterGrpc.GreeterImplBase` y sobreescribe el método `sayHello`.

**Funcionalidad**: Recibe un `HelloRequest` con un nombre y retorna un `HelloReply` con el mensaje "Kaixo " seguido del nombre proporcionado.

### 3. greeter.proto

Archivo de definición Protocol Buffers que especifica:
- El servicio `Greeter` con el método RPC `SayHello`
- El mensaje de petición `HelloRequest` con campo `name`
- El mensaje de respuesta `HelloReply` con campo `message`

## Flujo de Datos

```mermaid
flowchart TD
    A[Cliente envía HelloRequest] --> B{GreeterService.sayHello}
    B --> C[Extrae nombre del request]
    C --> D[Construye mensaje: 'Kaixo ' + nombre]
    D --> E[Crea HelloReply con el mensaje]
    E --> F[Envía respuesta via StreamObserver.onNext]
    F --> G[Completa la operación: onCompleted]
    G --> H[Cliente recibe HelloReply]
    
    style A fill:#FFB6C1
    style H fill:#90EE90
```

## Dependencias Principales

```mermaid
graph TD
    A[springeight] --> B[spring-boot-starter-parent 2.2.4]
    A --> C[grpc-spring-boot-starter 3.5.1]
    A --> D[spring-boot-starter-test]
    A --> E[annotations-api 6.0.53]
    
    C --> F[gRPC Core]
    C --> G[Protocol Buffers]
    
    style A fill:#4169E1,color:#FFF
    style B fill:#6B8E23
    style C fill:#6B8E23
```

### Lista de Dependencias

1. **Spring Boot Starter Parent** (2.2.4.RELEASE) - Proporciona la configuración base de Spring Boot
2. **gRPC Spring Boot Starter** (3.5.1) - Integración de gRPC con Spring Boot
3. **Spring Boot Starter Test** - Herramientas para pruebas unitarias e integración
4. **Apache Tomcat Annotations API** (6.0.53) - Necesario para Java 9+

## Plugins de Maven

### Diagrama de Plugins

```mermaid
graph LR
    A[Build Process] --> B[Compiler Plugin]
    A --> C[Protobuf Plugin]
    A --> D[Spring Boot Plugin]
    A --> E[Quality Plugins]
    
    E --> F[fmt-maven-plugin]
    E --> G[jacoco-maven-plugin]
    E --> H[dependency-check]
    
    style A fill:#4682B4,color:#FFF
    style E fill:#DAA520
```

### Plugins Configurados

1. **maven-compiler-plugin** (3.8.1) - Compilación con Java 11
2. **protobuf-maven-plugin** (0.6.1) - Generación de clases desde archivos .proto
3. **maven-failsafe-plugin** (2.22.2) - Pruebas de integración
4. **fmt-maven-plugin** (2.8) - Formateo automático de código
5. **jacoco-maven-plugin** (0.8.5) - Cobertura de código
6. **maven-enforcer-plugin** - Validación de dependencias
7. **spring-boot-maven-plugin** - Empaquetado de aplicación Spring Boot
8. **dependency-check-maven** - Análisis de vulnerabilidades OWASP

## Protocolo gRPC

### Definición del Servicio

```mermaid
sequenceDiagram
    autonumber
    participant Proto as greeter.proto
    participant Protoc as Compilador Protobuf
    participant Generated as Clases Generadas
    participant Service as GreeterService
    
    Proto->>Protoc: Archivo .proto
    Protoc->>Generated: GreeterGrpc.java
    Protoc->>Generated: GreeterOuterClass.java
    Generated->>Service: Extiende GreeterImplBase
    Service->>Service: Implementa sayHello()
```

### Mensajes Proto

**HelloRequest**:
- `name` (string): El nombre de la persona a saludar

**HelloReply**:
- `message` (string): El mensaje de saludo generado

## Configuración de Construcción

### Proceso de Build

```mermaid
flowchart TB
    A[mvn clean install] --> B[Fase: Validate]
    B --> C[Fase: Compile]
    C --> D[Generación Protobuf]
    D --> E[Compilación Java]
    E --> F[Fase: Test]
    F --> G[Fase: Package]
    G --> H[Fase: Verify]
    H --> I[Fase: Install]
    I --> J[JAR: springeight.jar]
    
    C --> K[Format Check]
    F --> L[JaCoCo Coverage]
    H --> M[OWASP Security Check]
    
    style A fill:#4169E1,color:#FFF
    style J fill:#32CD32,color:#000
```

### Propiedades del Proyecto

- **Encoding**: UTF-8
- **Java Version**: 11
- **Compiler Source/Target**: Java 11
- **Final Name**: springeight

## Testing

### Estructura de Pruebas

```mermaid
graph TD
    A[ApplicationTest] --> B[SpringBootTest]
    A --> C[contextLoads]
    
    B --> D[Carga Contexto Spring]
    C --> E[Verifica Inicio Correcto]
    
    style A fill:#87CEEB
    style B fill:#FFD700
```

La prueba `ApplicationTest` verifica que el contexto de la aplicación Spring Boot se carga correctamente sin errores.

## Integración con Backstage

El proyecto está integrado con Backstage según la configuración en `catalog-info.yaml`:

```mermaid
graph LR
    A[springeight] --> B[GitHub: juananmora/springeight]
    A --> C[TechDocs]
    A --> D[Kubernetes Label Selector]
    A --> E[Litmus Chaos]
    
    style A fill:#4169E1,color:#FFF
```

### Anotaciones

- **github.com/project-slug**: juananmora/springeight
- **backstage.io/techdocs-ref**: dir:.
- **backstage.io/kubernetes-label-selector**: app.kubernetes.io/instance=selenium-grid
- **litmuschaos.io/project-id**: 26e2e754-a79f-447f-a465-587f8303a373

## Containerización

El proyecto incluye un `Dockerfile` para la containerización de la aplicación, facilitando su despliegue en entornos de contenedores como Docker y Kubernetes.

```mermaid
flowchart LR
    A[Código Fuente] --> B[Maven Build]
    B --> C[springeight.jar]
    C --> D[Dockerfile]
    D --> E[Imagen Docker]
    E --> F[Contenedor en Ejecución]
    
    style E fill:#2496ED,color:#FFF
    style F fill:#90EE90
```

## Calidad del Código

### Herramientas de Calidad

```mermaid
mindmap
    root((Calidad))
        Formateo
            fmt-maven-plugin
            Google Java Format
        Cobertura
            JaCoCo
            Reportes HTML
        Seguridad
            OWASP Dependency Check
            CVE Analysis
        Compilación
            Xlint warnings
            Strict compilation
```

## Ciclo de Vida del Proyecto

```mermaid
stateDiagram-v2
    [*] --> Development
    Development --> Building: mvn compile
    Building --> Testing: mvn test
    Testing --> Packaging: mvn package
    Packaging --> Verification: mvn verify
    Verification --> Deployment: mvn install
    Deployment --> Production
    Production --> [*]
    
    Testing --> Development: Test Failed
    Verification --> Development: Security Issues
```

## Comandos Útiles

### Construcción y Ejecución

```bash
# Compilar el proyecto
mvn clean compile

# Ejecutar pruebas
mvn test

# Empaquetar la aplicación
mvn package

# Ejecutar la aplicación
java -jar target/springeight.jar

# O usando Spring Boot Maven Plugin
mvn spring-boot:run
```

### Generación de Clases Protobuf

```bash
# Generar clases desde archivos .proto
mvn protobuf:compile
mvn protobuf:compile-custom
```

### Análisis de Calidad

```bash
# Formatear código
mvn fmt:format

# Generar reporte de cobertura
mvn jacoco:report

# Análisis de seguridad
mvn dependency-check:check
```

## Conclusión

El proyecto **springeight** es una aplicación Spring Boot bien estructurada que demuestra la integración exitosa de gRPC con el ecosistema Spring. Utiliza buenas prácticas de desarrollo, incluyendo pruebas automatizadas, análisis de seguridad, y formateo de código. La arquitectura es simple pero efectiva, proporcionando un servicio de saludos mediante comunicación gRPC.

---

*Documentación generada en el año de gracia de dos mil veinticinco*
