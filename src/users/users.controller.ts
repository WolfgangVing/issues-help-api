import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from 'src/decorator/public.decorator';
import { ApiBearerAuth, ApiResponse, ApiResponseProperty, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorator/roles.decorator';
import { Role } from 'src/shared/roles.enum';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { UserDto } from './dto/user.dto';

@ApiTags('Users')
@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  @ApiResponse({
    type: UserDto
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<{
    access_token: string
  }> {
    const result = await this.usersService.create(createUserDto)

    return {
      access_token: result
    };
  }

  @Roles(Role.Operator, Role.Admin)
  @ApiBearerAuth()
  @Get()
  async findAll() {
    const results = await this.usersService.findAll();

    return results;
  }

  @Roles(Role.Operator, Role.Admin)
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.usersService.findByID(id);

    return result
  }

  @ApiBearerAuth()
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const result = await this.usersService.update(id, updateUserDto);

    return result;
  }
}
