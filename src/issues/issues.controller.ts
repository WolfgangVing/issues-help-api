import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Query, UseGuards, Req, Request } from '@nestjs/common';
import { IssuesService } from './issues.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { FilterIssues } from 'src/shared/types/filterIssues';
import { Roles } from 'src/decorator/roles.decorator';
import { Role } from 'src/shared/roles.enum';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Issues")
@Controller('issues')
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) { }

  @Roles(Role.Client)
  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createIssueDto: CreateIssueDto,@Request() request) {
    const userToken = request.user;

    const result = await this.issuesService.createIssue(createIssueDto, userToken);

    return result;
  }


  @Roles(Role.Operator, Role.Admin)
  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Query() query: FilterIssues) {
    const result = await this.issuesService.findAll(query);

    return result;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.issuesService.findOne(id);
  }

  @Roles(Role.Admin, Role.Operator)
  update(@Param('id') id: string, @Body() updateIssueDto: UpdateIssueDto) {
    const result = this.issuesService.update(id, updateIssueDto);

    return result;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.issuesService.remove(+id);
  }
}
