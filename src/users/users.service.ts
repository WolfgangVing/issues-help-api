import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { UserDto } from './dto/user.dto';
import { UserToken } from 'src/shared/UserToken';
import { AuthService } from 'src/auth/auth.service';
import { generateToken } from 'src/utils/GenerateToken';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class UsersService {
  private readonly logger = new Logger();

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) { }

  async create(createUserDto: CreateUserDto): Promise<string> {
    const result = await this.usersRepository.createUser(createUserDto)
    const generatedToken = await generateToken(
      this.jwtService,
      {
        sub: result._id.toString(),
        email: result.email,
        name: result.name,
        phone: result.phone,
        role: result.role
      },
      this.configService.get<string>("JWT_SECRET")
    )
    return generatedToken;
  }

  async findOne(email: string) {
    const result = await this.usersRepository.findOneToSignIn(email);

    return result;
  }

  async findAll() {
    const result = await this.usersRepository.findAll()
    return result;
  }

  async findByID(id: string) {
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
