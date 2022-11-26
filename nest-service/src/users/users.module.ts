import { Module } from '@nestjs/common';

import { UsersService } from './services';
import { UserController } from './user.controller';

@Module({
  providers: [ UsersService ],
  exports: [ UsersService ],
  controllers: [ UserController ]
})
export class UsersModule {}
