import { OmitType } from '@nestjs/mapped-types';
import { CreateIssueDto } from './create-issue.dto';
import { Status } from 'src/shared/issue-types';
import { Prop } from '@nestjs/mongoose';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UpdateIssueDto extends PartialType(CreateIssueDto) { 
    @ApiProperty()
    _id: string
}

export class UpdateIssueData extends PartialType(UpdateIssueDto){
    _id: string
}