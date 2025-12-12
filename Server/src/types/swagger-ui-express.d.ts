declare module 'swagger-ui-express' {
  import { RequestHandler } from 'express';

  export const serve: RequestHandler[];
  export function setup(
    swaggerDoc: any,
    options?: {
      explorer?: boolean;
      swaggerOptions?: Record<string, any>;
      customCss?: string;
      customfavIcon?: string;
      customSiteTitle?: string;
    }
  ): RequestHandler;
}
