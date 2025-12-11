// src/util/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';

const apiServerUrl = process.env.SWAGGER_SERVER_URL ?? 'http://localhost:5000/api';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'VsecureU — Backend API',
      version: '1.0.0',
      description: 'API documentation for Parent Preference, Societal Analysis and other endpoints'
    },
    servers: [
      {
        url: apiServerUrl,
      }
    ]
  },
  apis: [
    // patterns are resolved from project root, adjust if needed
    path.join(__dirname, '..', 'routes', '*.ts'),
    path.join(__dirname, '..', 'controllers', '*.ts')
  ]
};

export const swaggerSpec = swaggerJsdoc(options);
export const swaggerUiServe = swaggerUi.serve;
export const swaggerUiSetup = swaggerUi.setup;
