import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        title: 'Event Master API',
        description: 'Auto-generated Swagger docs for Event API',
    },
    host: 'localhost:3000',
};

const outputFile = './swagger-output.json';
const routes = ['./routes/v1/*.route.js']; // Main file where routes are defined

swaggerAutogen(outputFile, routes, doc);
