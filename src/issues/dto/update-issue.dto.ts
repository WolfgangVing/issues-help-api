import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateIssueDto } from './create-issue.dto';
import { Status } from 'src/shared/issue-types';
import { Prop } from '@nestjs/mongoose';

export class UpdateIssueDto extends OmitType(CreateIssueDto, ['client'] as const) { }

export class UpdateIssueData extends PartialType(UpdateIssueDto){
    _id: string
}