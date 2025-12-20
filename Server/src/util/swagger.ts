// src/util/swagger.ts
import swaggerJSDoc, { Options } from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';

const apiServerUrl = process.env.SWAGGER_SERVER_URL ?? 'http://localhost:8000/api';

const options: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Naviriti — Backend API',
      version: '1.0.0',
      description: ''
    },
    servers: [{ url: apiServerUrl }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token (without Bearer prefix)'
        }
      }
    }
  },
  apis: [
    path.join(__dirname, '..', 'routes', '*.ts'),
    path.join(__dirname, '..', 'controllers', '*.ts')
  ]
};

export const swaggerSpec = swaggerJSDoc(options);
export const swaggerUiServe = swaggerUi.serve;

/**
 * Custom Swagger UI setup with request interception
 */
export const swaggerUiSetup = (spec: unknown) =>
  swaggerUi.setup(spec, {
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      requestInterceptor: (request: any) => {
        if (request.headers?.Authorization) {
          let token = String(request.headers.Authorization).trim();

          if (token.startsWith('<') && token.endsWith('>')) {
            token = token.slice(1, -1).trim();
          }

          if (token.toLowerCase().startsWith('bearer ')) {
            token = token.slice(7).trim();
          }

          request.headers.Authorization = `Bearer ${token}`;
          request.headers.authorization = `Bearer ${token}`;
        }

        return request;
      }
    },
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .btn.authorize {
        background-color: #49cc90;
        border-color: #49cc90;
      }
      .swagger-ui .btn.authorize svg { fill: white; }
      .swagger-ui .auth-wrapper { padding: 10px; }
    `,
    customSiteTitle: 'Naviriti API Docs'
  });
