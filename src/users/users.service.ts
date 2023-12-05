import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository
  ) {}
  async create(createUserDto: CreateUserDto) {
    const result = await this.usersRepository.createUser(createUserDto)
    const userDto: UserDto = {
      id: result._id.toString(),
      email: result.email,
      name: result.name,
      phone: result.phone,
      role: result.role
    }

    return userDto;
  }

  async findAll() {
    const result = await this.usersRepository.findAll()
    return result;
  }
  
  async findOne(id: string) {
    const result = await this.usersRepository.findById(id)
    return result;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDto> {
    const result = await this.usersRepository.updateOne(id, updateUserDto)
    const userDto: UserDto = {
      email: result.email,
      id: result._id.toString(),
      name: result.name,
      phone: result.phone,
      role: result.role
    }
    return userDto;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
