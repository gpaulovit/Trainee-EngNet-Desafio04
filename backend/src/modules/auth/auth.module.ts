import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController], //registra o Controller 
  providers: [AuthService],      //registra o Service 
})
export class AuthModule {}