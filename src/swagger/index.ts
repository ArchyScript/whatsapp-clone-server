// import swaggerJSDoc from 'swagger-jsdoc';
// import swaggerUi from 'swagger-ui-express';
// import { Application } from 'express';

// // Swagger definition
// const swaggerDefinition = {
//   openapi: '3.0.0',
//   info: {
//     title: 'Node.js API with Swagger',
//     version: '1.0.0',
//     description: 'API documentation for your Node.js application',
//   },
//   servers: [
//     {
//       url: 'http://localhost:5000',
//       description: 'Development server',
//     },
//   ],
// };

// // Options for the swagger docs
// const swaggerOptions = {
//   swaggerDefinition,
//   apis: ['./routes/*.ts'], // Path to the API docs (adjust to your route files)
// };

// // Initialize swagger-jsdoc
// const swaggerSpec = swaggerJSDoc(swaggerOptions);

// export const setupSwaggerDocs = (app: Application) => {
//   app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// };
