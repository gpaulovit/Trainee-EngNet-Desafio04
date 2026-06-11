import { Module } from '@nestjs/common';
import { TurmasModule } from './modules/turmas/turmas.module';

@Module({
  imports: [TurmasModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
