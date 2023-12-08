import { Injectable, Logger } from '@nestjs/common';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { createIssueID } from 'src/utils/GenerateID';
import { IssuesRepository } from './issues.repository';
import { Issue } from './entities/issue.schema';
import { FilterIssues } from 'src/shared/types/filterIssues';
import { Role } from 'src/shared/roles.enum';

@Injectable()
export class IssuesService {
  private readonly logger = new Logger(IssuesService.name);

  constructor(private readonly issuesRepository: IssuesRepository) { };


  async createIssue(fields: CreateIssueDto): Promise<Issue> {
    const issueID = createIssueID();
    const createdIssue = await this.issuesRepository.createIssue({
      client: {
        ...fields.client,
        role: Role.Client
      },
      description: fields.description,
      topic: fields.topic,
      urgency: fields.urgency
    })

    return createdIssue;
  }

  async findAll(filters: FilterIssues) {
    const result = await this.issuesRepository.getIssues(filters);
    
    return result;
  }

  async findOne(issueID: string) {
    const queriedIssue = await this.issuesRepository.getIssueByID(issueID)
    return queriedIssue;
  }

  async update(id: string, updateIssueDto: UpdateIssueDto) {
    const data = {
      ...updateIssueDto,
      _id: id
    };
    const result = await this.issuesRepository.updateIssue(data)

    
    return result;
  }

  remove(id: number) {
    return `This action removes a #${id} issue`;
  }
}
