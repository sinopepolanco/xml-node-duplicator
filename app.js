const fs = require('fs');
const xml2js = require('xml2js');

const parser = new xml2js.Parser();
const builder = new xml2js.Builder({
    xmldec: { version: '1.0', encoding: 'UTF-8', standalone: true },
    renderOpts: { pretty: true }
});

// Función recursiva para buscar y duplicar nodos 'admin-object'
function findAndDuplicateAdminObject(node, attrName, attrValue, newNodes) {
    let found = false;

    // Si el nodo actual es un objeto y tiene propiedades
    if (typeof node === 'object') {
        for (let key in node) {
            if (Array.isArray(node[key])) {
                node[key].forEach((child, index) => {
                    // Si encontramos un nodo 'admin-object'
                    if (key === 'admin-object' && child.$[attrName] === attrValue) {
                        found = true;

                        // Iterar sobre el array de nuevos nodos para duplicar el original con las modificaciones
                        newNodes.forEach(newNode => {
                            // Duplicar el nodo
                            const duplicatedNode = JSON.parse(JSON.stringify(child));

                            // Modificar los atributos del nodo duplicado
                            duplicatedNode.$ = { ...duplicatedNode.$, ...newNode.newAttributes };

                            // Modificar el valor del nodo 'config-property'
                            if (duplicatedNode['config-property']) {
                                duplicatedNode['config-property'][0]._ = newNode.newPhysicalName;
                            }

                            // Agregar el nodo duplicado al final del array
                            node[key].push(duplicatedNode);
                        });
                    }

                    // Llamar a la función recursiva para seguir buscando
                    findAndDuplicateAdminObject(child, attrName, attrValue, newNodes);
                });
            } else {
                // Si no es un array, también podríamos tener un objeto
                findAndDuplicateAdminObject(node[key], attrName, attrValue, newNodes);
            }
        }
    }

    return found;
}

// Función para leer y procesar el archivo XML
function processXML(filePath, attrName, attrValue, newNodes) {
    // Leer el archivo XML
    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error('Error leyendo el archivo:', err);
            return;
        }

        // Parsear el XML
        parser.parseString(data, (err, result) => {
            if (err) {
                console.error('Error parseando el XML:', err);
                return;
            }

            // Ejecutar búsqueda recursiva
            const found = findAndDuplicateAdminObject(result, attrName, attrValue, newNodes);

            if (!found) {
                //console.log(`No se encontró ningún nodo con ${attrName}="${attrValue}"`);
            }

            // Convertir el objeto de vuelta a XML
            const updatedXML = builder.buildObject(result);

            // Escribir el archivo XML actualizado
            fs.writeFile(filePath, updatedXML, (err) => {
                if (err) {
                    console.error('Error escribiendo el archivo:', err);
                } else {
                    console.log('Nodos duplicados y archivo actualizado correctamente.');
                }
            });
        });
    });
}

// Obtener los argumentos de la línea de comandos
const args = process.argv.slice(2); // Ignoramos los primeros 2 argumentos (node y script)

if (args.length < 4) {
    console.error('Uso: node app.js <filePath> <attributeName> <attributeValue> <newNodesArray>');
    process.exit(1);
}

// Asignar las variables desde los argumentos
const filePath = args[0];
const attributeName = args[1]; // Nombre del atributo, ej: 'pool-name'
const attributeValue = args[2]; // Valor del atributo, ej: 'javaApiSavingAcBackendQueue'

// Convertir el array de nuevos nodos desde un argumento JSON string
const newNodes = JSON.parse(args[3]);

// Llamada a la función para procesar el XML
processXML(filePath, attributeName, attributeValue, newNodes);

