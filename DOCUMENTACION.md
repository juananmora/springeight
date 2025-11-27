# Documentación del Proyecto SpringEight

## Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Componentes Principales](#componentes-principales)
4. [Diagramas UML](#diagramas-uml)
5. [Configuración y Dependencias](#configuración-y-dependencias)
6. [Instalación y Despliegue](#instalación-y-despliegue)
7. [Protocolo gRPC](#protocolo-grpc)

---

## Descripción General

**SpringEight** es una aplicación fabrícada con Spring Boot que provee servicios gRPC para el saludo de personas. La aplicación fué construída usando las tecnologías modernas del framework Spring y la comunicación mediante Protocol Buffers.

### Información del Proyecto

- **Nombre:** springeight
- **Grupo:** com.example
- **Versión:** 0.0.2-SNAPSHOT
- **Empaquetado:** JAR
- **Java:** Versión 11
- **Spring Boot:** 2.2.4.RELEASE

---

## Arquitectura del Sistema

La aplicación sigue una arquitectura de microservicios basada en gRPC, permitiendo comunicación eficiente entre servicios mediante Protocol Buffers.

```mermaid
graph TB
    subgraph "Capa de Presentación"
        A[Cliente gRPC]
    end
    
    subgraph "Capa de Aplicación"
        B[Spring Boot Application]
        C[GreeterService]
    end
    
    subgraph "Capa de Protocolo"
        D[Protocol Buffers]
        E[greeter.proto]
    end
    
    subgraph "Infraestructura"
        F[Docker Container]
        G[OpenJDK 11]
    end
    
    A -->|gRPC Request| C
    C -->|gRPC Response| A
    B --> C
    C --> D
    D --> E
    F --> G
    B -.->|Desplegado en| F
    
    style B fill:#90EE90
    style C fill:#87CEEB
    style D fill:#FFB6C1
    style F fill:#DDA0DD
```

---

## Componentes Principales

### 1. Application.java

La clase principal que inicia la aplicación Spring Boot.

```mermaid
classDiagram
    class Application {
        +main(String[] args) void
    }
    
    Application --|> SpringBootApplication : uses
    
    class SpringBootApplication {
        <<annotation>>
    }
```

**Responsabilidades:**
- Punto de entrada de la aplicación
- Inicialización del contexto de Spring
- Configuración automática mediante anotaciones

### 2. GreeterService.java

Servicio gRPC que implementa la lógica de negocio para saludar.

```mermaid
classDiagram
    class GreeterService {
        +sayHello(HelloRequest, StreamObserver) void
    }
    
    class GreeterGrpc_GreeterImplBase {
        <<abstract>>
    }
    
    class GRpcService {
        <<annotation>>
    }
    
    GreeterService --|> GreeterGrpc_GreeterImplBase : extends
    GreeterService ..> GRpcService : annotated
    GreeterService ..> HelloRequest : receives
    GreeterService ..> HelloReply : sends
    
    class HelloRequest {
        +String name
    }
    
    class HelloReply {
        +String message
    }
```

**Responsabilidades:**
- Procesar peticiones gRPC
- Generar respuestas con saludos personalizados
- Gestionar el flujo de comunicación asíncrona

### 3. ApplicationTest.java

Prueba unitaria que verifica la carga del contexto.

```mermaid
classDiagram
    class ApplicationTest {
        +contextLoads() void
    }
    
    class SpringBootTest {
        <<annotation>>
    }
    
    class SpringRunner {
        <<JUnit Runner>>
    }
    
    ApplicationTest ..> SpringBootTest : annotated
    ApplicationTest ..> SpringRunner : runs with
```

---

## Diagramas UML

### Diagrama de Clases Completo

```mermaid
classDiagram
    class Application {
        -SpringApplication
        +main(String[] args)$ void
    }
    
    class GreeterService {
        +sayHello(HelloRequest, StreamObserver~HelloReply~) void
    }
    
    class GreeterGrpc {
        <<generated>>
        +GreeterImplBase
    }
    
    class HelloRequest {
        +String name
        +getName() String
    }
    
    class HelloReply {
        +String message
        +getMessage() String
        +Builder newBuilder()$ Builder
    }
    
    class HelloReply_Builder {
        +setMessage(String) Builder
        +build() HelloReply
    }
    
    Application ..> SpringBootApplication : uses
    GreeterService --|> GreeterGrpc : extends
    GreeterService ..> HelloRequest : receives
    GreeterService ..> HelloReply : creates
    HelloReply ..> HelloReply_Builder : builder pattern
```

### Diagrama de Secuencia - Flujo de Petición gRPC

```mermaid
sequenceDiagram
    actor Cliente
    participant App as Application
    participant Greeter as GreeterService
    participant Proto as Protocol Buffers
    
    Cliente->>App: Petición gRPC SayHello
    App->>Greeter: sayHello(HelloRequest, StreamObserver)
    activate Greeter
    
    Greeter->>Proto: request.getName()
    Proto-->>Greeter: "Nombre del usuario"
    
    Greeter->>Greeter: Construir mensaje "Kaixo " + nombre
    
    Greeter->>Proto: HelloReply.newBuilder().setMessage()
    Proto-->>Greeter: HelloReply.Builder
    
    Greeter->>Proto: builder.build()
    Proto-->>Greeter: HelloReply
    
    Greeter->>Cliente: responseObserver.onNext(reply)
    Greeter->>Cliente: responseObserver.onCompleted()
    deactivate Greeter
    
    Cliente-->>App: Respuesta recibida
```

### Diagrama de Despliegue

```mermaid
graph LR
    subgraph "Entorno de Desarrollo"
        A[Código Fuente]
        B[Maven Build]
    end
    
    subgraph "Artefactos"
        C[springeight.jar]
        D[springeight.sh]
    end
    
    subgraph "Contenedor Docker"
        E[OpenJDK 11 Alpine]
        F[/usr/share/springeight/]
        G[/usr/bin/springeight.sh]
    end
    
    subgraph "Runtime"
        H[Spring Boot App]
        I[gRPC Server]
    end
    
    A -->|mvn package| B
    B --> C
    A --> D
    C --> F
    D --> G
    E --> F
    E --> G
    F --> H
    G --> H
    H --> I
    
    style E fill:#2496ED
    style H fill:#6DB33F
    style I fill:#00ADD8
```

### Diagrama de Componentes

```mermaid
graph TB
    subgraph "springeight Application"
        A[Application Main]
        B[GreeterService]
        C[Generated Proto Classes]
    end
    
    subgraph "Spring Boot Framework"
        D[Spring Context]
        E[Spring Boot Starter]
    end
    
    subgraph "gRPC Framework"
        F[grpc-spring-boot-starter]
        G[gRPC Server]
    end
    
    subgraph "Protocol Buffers"
        H[greeter.proto]
        I[Protoc Compiler]
    end
    
    subgraph "Testing"
        J[ApplicationTest]
        K[Spring Boot Test]
    end
    
    A --> D
    B --> F
    B --> C
    H --> I
    I --> C
    D --> E
    F --> G
    J --> K
    J --> D
    
    style A fill:#90EE90
    style B fill:#87CEEB
    style F fill:#FFB6C1
    style H fill:#F0E68C
```

### Diagrama de Estados del Servicio

```mermaid
stateDiagram-v2
    [*] --> Inicializando
    
    Inicializando --> CargandoContexto: Spring Boot Start
    CargandoContexto --> RegistrandoServicios: Context Loaded
    RegistrandoServicios --> ServidorIniciado: gRPC Services Registered
    
    ServidorIniciado --> EsperandoPeticiones: Server Ready
    
    EsperandoPeticiones --> ProcesandoPeticion: Request Received
    ProcesandoPeticion --> ConstruyendoRespuesta: Processing
    ConstruyendoRespuesta --> EnviandoRespuesta: Reply Built
    EnviandoRespuesta --> EsperandoPeticiones: Response Sent
    
    EsperandoPeticiones --> Deteniendo: Shutdown Signal
    ProcesandoPeticion --> Deteniendo: Shutdown Signal
    Deteniendo --> [*]
```

---

## Configuración y Dependencias

### Dependencias Principales

El proyecto utiliza las siguientes dependencias de importancia:

```mermaid
graph TD
    A[springeight] --> B[spring-boot-starter-parent 2.2.4]
    A --> C[grpc-spring-boot-starter 3.5.1]
    A --> D[spring-boot-starter-test]
    A --> E[annotations-api 6.0.53]
    
    C --> F[gRPC Libraries]
    C --> G[Protocol Buffers]
    
    B --> H[Spring Core]
    B --> I[Spring Boot AutoConfig]
    
    D --> J[JUnit]
    D --> K[Spring Test]
    
    style A fill:#6DB33F
    style C fill:#00ADD8
    style B fill:#6DB33F
```

### Plugins de Maven

```mermaid
mindmap
  root((Maven Build))
    Compilación
      maven-compiler-plugin
      protobuf-maven-plugin
    Testing
      maven-failsafe-plugin
      jacoco-maven-plugin
    Calidad
      fmt-maven-plugin
      maven-enforcer-plugin
      dependency-check-maven
    Empaquetado
      maven-jar-plugin
      spring-boot-maven-plugin
      maven-source-plugin
```

---

## Instalación y Despliegue

### Compilación del Proyecto

```bash
# Compilar el proyecto con Maven
mvn clean install

# Generar clases desde Protocol Buffers
mvn protobuf:compile
mvn protobuf:compile-custom

# Executar tests
mvn test
```

### Construcción de Imagen Docker

```mermaid
flowchart LR
    A[Código Fuente] -->|mvn package| B[springeight.jar]
    C[springeight.sh] --> D{Dockerfile}
    B --> D
    D -->|docker build| E[Imagen Docker]
    E -->|docker run| F[Contenedor en Ejecución]
    F --> G[Servidor gRPC Activo]
    
    style D fill:#2496ED
    style E fill:#2496ED
    style F fill:#00C853
    style G fill:#00ADD8
```

### Flujo de Despliegue

```mermaid
sequenceDiagram
    participant Dev as Desarrollador
    participant Maven as Maven Build
    participant Docker as Docker Engine
    participant Container as Contenedor
    participant App as Aplicación
    
    Dev->>Maven: mvn clean package
    activate Maven
    Maven->>Maven: Compile Java
    Maven->>Maven: Generate Proto Classes
    Maven->>Maven: Run Tests
    Maven-->>Dev: springeight.jar
    deactivate Maven
    
    Dev->>Docker: docker build -t springeight .
    activate Docker
    Docker->>Docker: FROM openjdk:11-alpine
    Docker->>Docker: COPY springeight.jar
    Docker->>Docker: COPY springeight.sh
    Docker-->>Dev: Imagen Creada
    deactivate Docker
    
    Dev->>Docker: docker run springeight
    Docker->>Container: Iniciar Contenedor
    activate Container
    Container->>App: Executar springeight.sh
    activate App
    App->>App: Spring Boot Start
    App-->>Container: Servidor gRPC Listo
    App-->>Dev: Aplicación Funcionando
    deactivate App
    deactivate Container
```

---

## Protocolo gRPC

### Definición del Servicio (greeter.proto)

El servicio define un método para enviar saludos:

```protobuf
service Greeter {
    rpc SayHello (HelloRequest) returns (HelloReply) {}
}
```

### Mensajes del Protocolo

```mermaid
classDiagram
    class HelloRequest {
        +string name
    }
    
    class HelloReply {
        +string message
    }
    
    class Greeter {
        <<service>>
        +SayHello(HelloRequest) HelloReply
    }
    
    Greeter ..> HelloRequest : uses
    Greeter ..> HelloReply : returns
```

### Flujo de Comunicación gRPC

```mermaid
flowchart TD
    A[Cliente Inicia Petición] --> B{Serializar HelloRequest}
    B --> C[Enviar mediante HTTP/2]
    C --> D[Servidor Recibe]
    D --> E[Deserializar HelloRequest]
    E --> F[GreeterService.sayHello]
    F --> G[Procesar: Construir mensaje]
    G --> H[Crear HelloReply]
    H --> I[Serializar Respuesta]
    I --> J[Enviar mediante HTTP/2]
    J --> K[Cliente Recibe]
    K --> L[Deserializar HelloReply]
    L --> M[Procesar Respuesta]
    
    style F fill:#87CEEB
    style G fill:#90EE90
    style C fill:#FFB6C1
    style J fill:#FFB6C1
```

### Ejemplo de Uso

**Petición del Cliente:**
```json
{
  "name": "Juan"
}
```

**Respuesta del Servidor:**
```json
{
  "message": "Kaixo Juan"
}
```

---

## Conclusión

Esta aplicación demuestra la integración exitosa de Spring Boot con gRPC para crear servicios de comunicación eficientes. La arquitectura modular permite fácil extensión y mantenimiento del código.

### Características Principales

- ✅ Comunicación mediante gRPC
- ✅ Protocol Buffers para serialización
- ✅ Arquitectura Spring Boot
- ✅ Containerización con Docker
- ✅ Testing automatizado
- ✅ Calidad de código con plugins Maven

---

**Fecha de Generación:** 27 de Noviembre, Año de Nuestro Señor de 2025

**Versión del Documento:** 1.0.0
