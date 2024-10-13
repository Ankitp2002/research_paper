const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: "Digital Author Repository API",
    description: "API documentation for the Digital Author",
  },
  host: `${process.env.SERVER}:${process.env.PORT}`, // Adjust as needed
  schemes: ["http"],
};

const outputFile = './swagger-output.json'; // Path to the generated JSON file
const endpointsFiles = ['./app.js', './routes/*.js']; // Paths to your route files

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    console.log('Swagger documentation generated at swagger-output.json');
});
