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
  ForbiddenException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import {
  GroupIdAlreadyRegisteredError,
  GroupNameAlreadyRegisteredError,
  GroupIdNotFoundError,
} from '../../domain/exception';
import { GroupDto } from '../dto/group.dto';
import { ChangeNameGroupDto } from '../dto/change-name-group.dto';
import { GroupService } from '../service/group.service';
import { Authorization } from '../service/authentication.decorator';
import { UserId } from '../../../user/domain/model/user-id';
import { GroupView } from '../read-model/schema/group.schema';

@ApiTags('Groups')
@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @ApiOperation({ summary: 'Get Groups' })
  @ApiResponse({ status: 200, description: 'Get Groups.' })
  @Get()
  async getGroups(): Promise<GroupView[]> {
    return this.groupService.getGroups();
  }

  @ApiOperation({ summary: 'Create Group' })
  @ApiResponse({ status: 204, description: 'Create Group.' })
  @HttpCode(204)
  @Post()
  async createGroup(@Body() groupDto: GroupDto, @Authorization() idUser: UserId): Promise<GroupDto> {

    if (idUser.value !== groupDto.idOwner){
      throw new ForbiddenException('Forbidden access to data');
    }

    try {
      return await this.groupService.createGroup(
        groupDto.name,
        groupDto.currencyCode,
        groupDto.idOwner,
      );
    } catch (e) {
      if (e instanceof GroupIdAlreadyRegisteredError) {
        throw new ConflictException(e.message);
      } else if (e instanceof GroupNameAlreadyRegisteredError) {
        throw new ConflictException(e.message);
      } else if (e instanceof Error) {
        throw new BadRequestException(`Unexpected error: ${e.message}`);
      } else {
        throw new BadRequestException('Server error');
      }
    }
  }

  @ApiOperation({ summary: 'Get Group' })
  @ApiResponse({ status: 204, description: 'Get Group.' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @Get(':id')
  async getGroup(@Query('id') id: string): Promise<GroupView> {
    try {
      return await this.groupService.getGroup(id);
    } catch (e) {
      if (e instanceof GroupIdNotFoundError) {
        throw new NotFoundException('Group not found');
      } else if (e instanceof Error) {
        throw new BadRequestException(`Unexpected error: ${e.message}`);
      } else {
        throw new BadRequestException('Server error');
      }
    }
  }

  @ApiOperation({ summary: 'Change Name Group' })
  @ApiResponse({ status: 204, description: 'changeNameGroup' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @HttpCode(204)
  @Put(':id')
  async changeNameGroup(
    @Query('id') id: string,
    @Body() changenamegroupDto: ChangeNameGroupDto,
  ) {
    try {
      return await this.groupService.changeNameGroup(
        id,
        changenamegroupDto.name,
      );
    } catch (e) {
      if (e instanceof GroupIdNotFoundError) {
        throw new NotFoundException('Group not found');
      } else if (e instanceof Error) {
        throw new BadRequestException(`Unexpected error: ${e.message}`);
      } else {
        throw new BadRequestException('Server error');
      }
    }
  }
}
