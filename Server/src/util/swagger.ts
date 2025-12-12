// src/util/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';

const apiServerUrl = process.env.SWAGGER_SERVER_URL ?? 'http://localhost:8000/api';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Naviriti — Backend API',
      version: '1.0.0',
      description:
        ''
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

export const swaggerSpec = swaggerJsdoc(options);
export const swaggerUiServe = swaggerUi.serve;

/**
 * Custom Swagger UI setup with proper request interception
 */
export const swaggerUiSetup = (spec: any) => {
  return swaggerUi.setup(spec, {
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      requestInterceptor: (request: any) => {
        console.log('[SWAGGER INTERCEPTOR] Original request headers:', JSON.stringify(request.headers));
        
        // Swagger UI uses capital 'A' Authorization
        if (request.headers.Authorization) {
          let token = request.headers.Authorization;
          
          // Clean up token
          token = String(token).trim();
          if (token.startsWith('<') && token.endsWith('>')) {
            token = token.slice(1, -1).trim();
          }
          if (token.toLowerCase().startsWith('bearer ')) {
            token = token.slice(7).trim();
          }
          
          // Set both cases to ensure compatibility
          request.headers.Authorization = `Bearer ${token}`;
          request.headers.authorization = `Bearer ${token}`;
          
          console.log('[SWAGGER INTERCEPTOR] Modified auth header:', request.headers.authorization);
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
    customSiteTitle: 'Naviriti API Docs',
    customJs: '/swagger-custom.js'
  });
};