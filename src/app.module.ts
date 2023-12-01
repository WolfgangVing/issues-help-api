import { Module } from '@nestjs/common';
import { IssuesModule } from './issues/issues.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [ConfigModule.forRoot(), IssuesModule, UsersModule, MongooseModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({ uri: configService.get<string>("MONGODB_URI") }),
    inject: [ConfigService]
  })],
  controllers: [],
  providers: [],
})
export class AppModule { }
