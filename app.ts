import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
import { UserController } from './src/modules/users/user.controller';
import mongoose from 'mongoose';
import { AuthController } from './src/modules/auth/auth.controller';

mongoose.connect('mongodb://localhost:27017/ts-server', {
  useNewUrlParser: true
});

const app = createExpressServer({
  routePrefix: '/api',
  controllers: [UserController, AuthController],
});

app.listen(3000);