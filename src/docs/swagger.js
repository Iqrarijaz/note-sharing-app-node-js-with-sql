const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.3",
        info: {
            title: "Notes API",
            version: "1.0.0",
            description: "REST API for Notes, Sharing, and Authentication"
        },
        servers: [
            {
                url: "http://localhost:5000",
                description: "Local server"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            },
            responses: {
                UnauthorizedError: {
                    description: "Authentication required or failed"
                }
            }
        },
        security: [{ bearerAuth: [] }]
    },
    apis: [
        "./src/routes/*.js",
        "./src/controllers/*.js",
    ],
};

module.exports = swaggerJsdoc(options);
