import { Module } from '@nestjs/common';
import { IssuesService } from './issues.service';
import { IssuesController } from './issues.controller';
import { ConfigModule } from '@nestjs/config';
import { redisModule } from 'src/modules.config';
import { IssuesRepository } from './issues.repository';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Issue, IssueSchema } from './entities/issue.schema';
import { User, UserSchema } from 'src/shared/user-types';

@Module({
  imports: [ConfigModule, redisModule, MongooseModule.forFeature([
    { name: Issue.name, schema: IssueSchema },
    { name: User.name, schema: UserSchema }
  ])],
  controllers: [IssuesController],
  providers: [IssuesService, IssuesRepository],
})
export class IssuesModule {}
