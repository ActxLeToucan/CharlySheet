import swaggerJsdoc from 'swagger-jsdoc';

/**
 * Génère la documentation de l'API
 * @param version {string}
 * @param folder {string}
 * @param tags {Array.<{name: string, description: string}>|undefined}
 * @returns {object} Swagger's output objecthealthcheck.routes.ts
 */
function generateDoc(version, folder, tags) {
    const options = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'CharlySheet API',
                version
            },
            tags: [
                {
                    name: 'default',
                    description: 'Default routes'
                },
                {
                    name: 'Documentation',
                    description: 'Documentation routes'
                },
                ...tags
            ]
        },
        apis: [
            './src/app.js',
            './src/routes/*.routes.js',
            `./src/routes/${folder}/*.js`,
            './src/middlewares/*.js',
            './src/utils/*.js',
            './src/validators/*.js',
            './src/models/*.js'
        ]
    };

    return swaggerJsdoc(options);
}

export default generateDoc;
