import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    AuthModule 
  ], 
  controllers: [],
  providers: [],
})
export class AppModule {}
import { TurmasModule } from './modules/turmas/turmas.module';
import { AlunosModule } from './modules/alunos/alunos.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    TurmasModule,
    AlunosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}