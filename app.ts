'use strict';
import 'reflect-metadata';
import 'ts-helpers';
import { useExpressServer } from 'routing-controllers';
import { UserController } from './src/modules/users/user.controller';
import * as mongoose from 'mongoose';
import { AuthController } from './src/modules/auth/auth.controller';
let express = require('express');
import * as auth from './src/modules/auth';

mongoose.connect('mongodb://localhost:27017/ts-server', {
  useNewUrlParser: true
});

let app = express();

useExpressServer(app, {
  routePrefix: '/api',
  authorizationChecker: auth.authorizationChecker,
  currentUserChecker: auth.currentUserChecker,
  controllers: [UserController, AuthController],
});


app.listen(3000);