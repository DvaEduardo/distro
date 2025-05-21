import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Distro',
      version: '1.0.0',
      description: 'Plataforma para cargar archivos',
    },
    servers: [
      {
        url: 'http://localhost:3000/api-docs', // La URL base de tu API
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Aquí defines el path de tus rutas donde escribirás las anotaciones de Swagger
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
