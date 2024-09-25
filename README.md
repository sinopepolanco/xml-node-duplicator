Aquí tienes un `README.md` que incluye la guía de uso para tu aplicación de manipulación de XML:

---

# NodeJS XML Node Duplicator

Este proyecto es una aplicación en Node.js que permite buscar un nodo `admin-object` dentro de un archivo XML, duplicarlo y modificar sus atributos según los valores proporcionados por el usuario a través de la línea de comandos. Además, la aplicación permite duplicar el nodo múltiples veces usando un array de valores para crear múltiples duplicados con diferentes configuraciones.

## Requisitos

- Node.js (v12 o superior)
- npm (v6 o superior)

## Instalación

1. Clona el repositorio o descarga el archivo `app.js` en tu máquina local.
2. Asegúrate de tener Node.js instalado. Puedes verificarlo con los siguientes comandos:

    ```bash
    node -v
    npm -v
    ```

3. Instala las dependencias necesarias ejecutando:

    ```bash
    npm install xml2js
    ```

## Uso

La aplicación permite duplicar un nodo XML de tipo `admin-object` encontrado en cualquier nivel de profundidad dentro del archivo XML. Puedes pasar los nuevos valores de atributos a través de la línea de comandos en forma de un array JSON.

### Comando

```bash
node app.js <filePath> <attributeName> <attributeValue> <newNodesArray>
```

### Parámetros

1. **`filePath`**: Ruta al archivo XML que deseas modificar.
2. **`attributeName`**: Nombre del atributo en el nodo `admin-object` que se usará para la búsqueda (por ejemplo, `pool-name`).
3. **`attributeValue`**: Valor del atributo que se usará para buscar el nodo que se duplicará (por ejemplo, `javaApiSavingAcBackendQueue`).
4. **`newNodesArray`**: Un array en formato JSON que contiene los nuevos valores de los atributos `PhysicalName`, `jndi-name` y `pool-name` para los nodos duplicados.

### Ejemplo de uso

Dado el siguiente XML en `main.xml`:

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<root>
    <admin-object class-name="org.apache.activemq.command.ActiveMQQueue"
        jndi-name="java:/queue/javaApiSavingAcBackendQueue" use-java-context="true"
        pool-name="javaApiSavingAcBackendQueue">
        <config-property name="PhysicalName">javaApiSavingAcBackendQueue</config-property>
    </admin-object>
</root>
```

Si deseas duplicar el nodo `admin-object` cuyo atributo `pool-name` es `javaApiSavingAcBackendQueue`, puedes ejecutar el siguiente comando:

```bash
node app.js main.xml pool-name javaApiSavingAcBackendQueue '[{"newPhysicalName": "newPhysicalName1", "newAttributes": {"jndi-name": "java:/queue/newJndiName1", "pool-name": "newPoolName1"}}, {"newPhysicalName": "newPhysicalName2", "newAttributes": {"jndi-name": "java:/queue/newJndiName2", "pool-name": "newPoolName2"}}]'
```

### Explicación del comando

- `main.xml`: Es el archivo XML en el que se buscará el nodo a duplicar.
- `pool-name`: Es el nombre del atributo a buscar en el nodo `admin-object`.
- `javaApiSavingAcBackendQueue`: Es el valor del atributo `pool-name` que se usará para encontrar el nodo.
- `[{"newPhysicalName": "newPhysicalName1", "newAttributes": {"jndi-name": "java:/queue/newJndiName1", "pool-name": "newPoolName1"}}, {"newPhysicalName": "newPhysicalName2", "newAttributes": {"jndi-name": "java:/queue/newJndiName2", "pool-name": "newPoolName2"}}]`: Este es un array JSON que contiene los valores que se usarán para duplicar el nodo con diferentes configuraciones. Cada objeto del array representa un nuevo nodo duplicado con sus atributos modificados.

### Resultado

El archivo `main.xml` resultante será similar a este:

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<root>
    <admin-object class-name="org.apache.activemq.command.ActiveMQQueue"
        jndi-name="java:/queue/javaApiSavingAcBackendQueue" use-java-context="true"
        pool-name="javaApiSavingAcBackendQueue">
        <config-property name="PhysicalName">javaApiSavingAcBackendQueue</config-property>
    </admin-object>
    <admin-object class-name="org.apache.activemq.command.ActiveMQQueue"
        jndi-name="java:/queue/newJndiName1" use-java-context="true"
        pool-name="newPoolName1">
        <config-property name="PhysicalName">newPhysicalName1</config-property>
    </admin-object>
    <admin-object class-name="org.apache.activemq.command.ActiveMQQueue"
        jndi-name="java:/queue/newJndiName2" use-java-context="true"
        pool-name="newPoolName2">
        <config-property name="PhysicalName">newPhysicalName2</config-property>
    </admin-object>
</root>
```

### Notas

- El array JSON que contiene los nuevos nodos debe estar correctamente escapado si lo pasas por la línea de comandos. Asegúrate de usar comillas dobles y de que el formato JSON sea válido.
- Puedes modificar el archivo XML original directamente, así que asegúrate de hacer una copia de seguridad si es necesario.

---

Este archivo `README.md` te dará una guía clara sobre cómo usar el script para duplicar nodos dentro de un archivo XML utilizando parámetros en la línea de comandos.