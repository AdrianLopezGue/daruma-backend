import {
    BadRequestException,
    Body,
    ConflictException,
    Controller,
    Get,
    HttpCode,
    NotFoundException,
    Post,
    Put,
    Query,
  } from '@nestjs/common';
  import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
  
  import {
    UserIdAlreadyRegisteredError,
    UserEmailAlreadyRegisteredError,
    UserIdNotFoundError
  } from '../../domain/exception';
  import { UserDto } from '../dto/user.dto';
  import { UserView } from '../read-model/schema/user.schema';
  import { UserService } from '../service/user.service';  
  
  @ApiTags('Users')
  @Controller('users')
  export class UserController {
    constructor(private readonly userService: UserService) {}
  
    @ApiOperation({ summary: 'Get Users' })
    @ApiResponse({ status: 200, description: 'Get Users.' })
    @Get()
    async getUsers(): Promise<UserView[]> {
      return this.userService.getUsers();
    }
  
    @ApiOperation({ summary: 'Register User' })
    @ApiResponse({ status: 204, description: 'Register User.' })
    @HttpCode(204)
    @Post()
    async registerUser(@Body() userDto: UserDto): Promise<UserDto> {
      try {
        return await this.userService.registerUser(
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
  
    @ApiOperation({ summary: 'Get User' })
    @ApiResponse({ status: 204, description: 'Get User.' })
    @ApiResponse({ status: 404, description: 'Not found' })
    @Get(':id')
    async getUser(@Query('id') id: string): Promise<UserView> {
      try {
        return await this.userService.getUser(id);
      } catch (e) {
        if (e instanceof UserIdNotFoundError) {
          throw new NotFoundException('User not found');
        } else if (e instanceof Error) {
          throw new BadRequestException(`Unexpected error: ${e.message}`);
        } else {
          throw new BadRequestException('Server error');
        }
      }
    }
  
    @ApiOperation({ summary: 'Update User' })
    @ApiResponse({ status: 204, description: 'UpdateUser' })
    @ApiResponse({ status: 404, description: 'Not found' })
    @HttpCode(204)
    @Put(':id')
    async udpateUser(@Query('id') id: string, @Body() userDto: UserDto) {
      try {
        return await this.userService.updateUser(id, userDto.name, userDto.email);
      } catch (e) {
        if (e instanceof UserIdNotFoundError) {
          throw new NotFoundException('User not found');
        } else if (e instanceof Error) {
          throw new BadRequestException(`Unexpected error: ${e.message}`);
        } else {
          throw new BadRequestException('Server error');
        }
      }
    }
  }