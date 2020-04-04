import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  ForbiddenException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import {
  UserIdAlreadyRegisteredError,
  UserEmailAlreadyRegisteredError,
} from '../../domain/exception';
import { UserDto } from '../dto/user.dto';
import { UserService } from '../service/user.service';
import { UserId } from '../../domain/model/user-id';
import { Authorization } from '../service/authentication.decorator';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Create User' })
  @ApiResponse({ status: 204, description: 'Create User.' })
  @HttpCode(204)
  @Post()
  async createUser(@Body() userDto: UserDto, @Authorization() idUser: UserId): Promise<UserDto> {

    if (idUser.value !== userDto.id){
      throw new ForbiddenException('Forbidden access to data');
    }

    try {
      return await this.userService.createUser(
        userDto.id,
        userDto.name,
        userDto.email,
      );
    } catch (e) {
      if (e instanceof UserIdAlreadyRegisteredError) {
        throw new ConflictException(e.message);
      } else if (e instanceof UserEmailAlreadyRegisteredError) {
        throw new ConflictException(e.message);
      } else if (e instanceof Error) {
        throw new BadRequestException(`Unexpected error: ${e.message}`);
      } else {
        throw new BadRequestException('Server error');
      }
    }
  }
}
