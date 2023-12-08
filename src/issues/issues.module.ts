import { Module } from '@nestjs/common';
import { IssuesService } from './issues.service';
import { IssuesController } from './issues.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisModule } from 'src/modules.config';
import { IssuesRepository } from './issues.repository';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Issue, IssueSchema } from './entities/issue.schema';
import { User, UserSchema } from 'src/users/entities/user.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule,
    redisModule,
    MongooseModule.forFeature([
      { name: Issue.name, schema: IssueSchema },
      { name: User.name, schema: UserSchema }
    ]),
    JwtModule
  ],
  controllers: [IssuesController],
  providers: [
    IssuesService,
    IssuesRepository,
  ],
})
export class IssuesModule { }
