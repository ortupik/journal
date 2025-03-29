const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Journal API',
      version: '1.0.0',
      description: 'API for managing journal entries'
    },
    servers: [{ url: 'http://localhost:3000', description: 'Local server' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['src/app/api/**/*.ts', 'src/app/api/**/**/*.ts']
};

export default options;
