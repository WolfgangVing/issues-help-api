import { Module } from '@nestjs/common';
import { IssuesModule } from './issues/issues.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controler';

@Module({
  imports: [IssuesModule, UsersModule, AppController],
  controllers: [],
  providers: [],
})
export class AppModule {}
