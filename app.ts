'use strict';
import 'reflect-metadata';
import 'ts-helpers';
import { useExpressServer, getMetadataArgsStorage } from 'routing-controllers';
import { UserController } from './src/modules/users/user.controller';
import * as mongoose from 'mongoose';
import { AuthController } from './src/config/auth/auth.controller';
let express = require('express');
import * as auth from './src/config/auth';
const swaggerUi = require('swagger-ui-express');

import { validationMetadatasToSchemas } from 'class-validator-jsonschema'
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { defaultMetadataStorage } from 'class-transformer/storage';

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true
});

let app = express();

// this is swagger ui configuration

const routingControllersOptions = {
  controllers: [AuthController, UserController],
  routePrefix: '/api',
}

const schemas = validationMetadatasToSchemas({
  classTransformerMetadataStorage: defaultMetadataStorage,
  refPointerPrefix: '#/components/schemas/',
})

// Parse routing-controllers classes into OpenAPI spec:
const storage = getMetadataArgsStorage()
const spec = routingControllersToSpec(storage, routingControllersOptions, {
  components: {
    schemas,
    securitySchemes: {
      basicAuth: {
        scheme: 'basic',
        type: 'http',
      },
    },
  },
  info: {
    description: 'Generated with `routing-controllers-openapi`',
    title: 'A sample API',
    version: '1.0.0',
  },
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));

// end of swagger configuration

useExpressServer(app, {
  routePrefix: '/api',
  authorizationChecker: auth.authorizationChecker,
  currentUserChecker: auth.currentUserChecker,
  controllers: [UserController, AuthController],
});


app.listen(3000);