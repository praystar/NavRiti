// src/types/swagger-jsdoc.d.ts
declare module 'swagger-jsdoc' {
  /**
   * Minimal Options interface for swagger-jsdoc to satisfy TypeScript.
   * You can expand this later with more exact fields if desired.
   */
  export interface Options {
    definition?: Record<string, any>;
    apis?: string[] | string;
    // allow other keys
    [key: string]: any;
  }

  /**
   * swagger-jsdoc main export: function that accepts Options and returns an OpenAPI spec object.
   */
  export default function swaggerJsdoc(options?: Options): Record<string, any>;
}
