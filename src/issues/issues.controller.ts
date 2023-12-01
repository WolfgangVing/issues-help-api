import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Query } from '@nestjs/common';
import { IssuesService } from './issues.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { FilterIssues } from 'src/shared/types/filterIssues';


@Controller('issues')
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Post()
  async create(@Body() createIssueDto: CreateIssueDto) {
    const result = await this.issuesService.createIssue(createIssueDto);

    return result;
  }

  @Get()
  async findAll(@Query() query: FilterIssues) {
    const result = await this.issuesService.findAll(query);
    
    return result;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.issuesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIssueDto: UpdateIssueDto) {
    const result = this.issuesService.update(id, updateIssueDto);

    return result;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.issuesService.remove(+id);
  }
}
