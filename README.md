# GraalJS-Spring-Boot-D3 - Generating SVG Graphs with Spring Boot and GraalJS

## Description

This project is a Spring Boot application that generates and renders an SVG graph on the server side using D3.js and GraalVM's JavaScript runtime (GraalJS). It leverages Linkedom to simulate a browser-like DOM environment within a Node.js-compatible context, enabling server-side rendering of the graph before sending it to the client.

## Prerequisites

* Java 21+
* Maven
* GraalVM with JavaScript support (GraalJS)
* Node.js and npm (for installing dependencies like D3.js and Linkedom)

## Technologies Used

* **Spring Boot:** Java backend framework
* **Thymeleaf:** Server-side templating engine
* **D3.js:** Data visualization library
* **GraalVM (GraalJS):** Polyglot runtime for executing JavaScript in Java
* **Linkedom:** DOM simulation for server-side rendering of D3.js

## How It Works

1.  **Backend Processing:**
    * A user accesses `/graph`.
    * The `GraphController` invokes the `GraphService` to generate the SVG graph.
    * The `GraphService`:
        * Reads the D3.js script (`graph.js`).
        * Uses GraalVM (GraalJS) to execute the script within a JavaScript context.
        * Simulates a DOM environment with Linkedom to enable D3.js to render the SVG.
        * Returns the generated SVG as a string.
    * The `GraphController` passes the SVG string to the Thymeleaf template (`graph.html`).
    * The page displays the pre-rendered graph.

2.  **Server-Side Rendering (SSR):**
    * The D3.js script runs on the server, not in the browser.
    * Linkedom provides a virtual DOM for D3.js to manipulate.
    * The final SVG is sent as raw HTML to the client.

## Installation Steps

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/graalvm/graal-languages-demos.git
    cd graaljs/graaljs-spring-boot-d3
    ```

2.  **Install Node.js dependencies:**

    ```bash
    npm install d3 linkedom
    ```

3.  **Build and run the Spring Boot application:**

    ```bash
    mvn spring-boot:run
    ```

4.  **Open your browser and visit:**

    ```
    http://localhost:8081/graph
    ```


## Maven Project Setup

If you want to create a new one.

### 1. Adding Polyglot API and GraalJS Dependencies

The GraalVM Polyglot API can be easily added as a Maven dependency to your Java project. The GraalJS artifact should also be present on the Java module or classpath.

Add the following set of dependencies to the `<dependencies>` section of your `pom.xml`:

```xml
<dependencies>
    <dependency>
        <groupId>org.graalvm.polyglot</groupId>
        <artifactId>polyglot</artifactId>
        <version>24.1.2</version>
    </dependency>
    <dependency>
        <groupId>org.graalvm.polyglot</groupId>
        <artifactId>js</artifactId>
        <version>24.1.2</version>
        <type>pom</type>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-thymeleaf</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>
```


## 2. JavaScript Code Configuration (D3.js)

Next, write a D3.js JavaScript function.

### 3.1. Writing the JavaScript Code

Place the following JavaScript program in `src/main/resources/static/graph.js`:

```javascript
var d3 = require('./node_modules/d3/dist/d3.js');
var linkedom = require('linkedom');

globalThis.document = linkedom.parseHTML('<html><body></body></html>').document;

const width = 640;
const height = 400;
const marginTop = 20;
const marginRight = 20;
const marginBottom = 30;
const marginLeft = 40;

const x = d3.scaleUtc()
    .domain([new Date("2023-01-01"), new Date("2024-01-01")])
    .range([marginLeft, width - marginRight]);

const y = d3.scaleLinear()
    .domain([0, 100])
    .range([height - marginBottom, marginTop]);

const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height);

svg.append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x));

svg.append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y));

module.exports = svg.node().outerHTML;
```

## 3.2. Using the JavaScript Module from Java

You can now integrate this JavaScript function into a Java application. Place the following code in `src/main/java/com/example/d3demo/GraphService.java`:

```java
import org.graalvm.polyglot.Context;
import org.graalvm.polyglot.Source;
import org.graalvm.polyglot.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@Service
public class GraphService {

    public String generateGraph() throws IOException {
        String jsCode = new String(Files.readAllBytes(Paths.get("src/main/resources/static/graph.js")));
        try (Context context = Context.newBuilder("js").allowAllAccess(true).build()) {
            context.eval("js", "if (typeof globalThis.linkedom === 'undefined') { " +
                    "globalThis.linkedom = require('linkedom'); " +
                    "globalThis.document = linkedom.parseHTML('<html><body></body></html>').document; }");
            Value result = context.eval("js", jsCode);
            return result.asString();
        }
    }
}
```

## 4. Building and Testing the Application

Compile and run this Java application with Maven:

```bash
./mvnw package
./mvnw spring-boot:run
```

Open your browser and navigate to `http://localhost:8080/graph`.

## Conclusion

By following this guide, you have learned how to:

-   Execute D3.js JavaScript code within a Java application using GraalJS.
-   Use `linkedom` to simulate the DOM environment on the server side.

