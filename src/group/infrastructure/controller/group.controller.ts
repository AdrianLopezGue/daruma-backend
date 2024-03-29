import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Post,
  ForbiddenException,
  ValidationPipe,
  UsePipes,
  UseGuards,
  Request,
  Param,
  Delete,
  Logger,
  Patch,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import {
  GroupIdAlreadyRegisteredError,
  GroupNameAlreadyRegisteredError,
  GroupIdNotFoundError,
} from '../../domain/exception';
import { GroupDto } from '../dto/group.dto';
import { GroupService } from '../service/group.service';
import { UserId } from '../../../user/domain/model/user-id';
import { GroupView } from '../read-model/schema/group.schema';
import { FirebaseAuthGuard } from '../../../core/firebase/firebase.auth.guard';
import { UpdateGroupDto } from '../dto/update-group.dto';

@ApiTags('Groups')
@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @ApiOperation({ summary: 'Get Groups' })
  @ApiResponse({ status: 200, description: 'Get Groups.' })
  @UseGuards(FirebaseAuthGuard)
  @Get()
  async getGroups(@Request() req): Promise<GroupView[]> {
    const ownerId: UserId = req.user;
    return this.groupService.getGroups(ownerId.value);
  }

  @ApiOperation({ summary: 'Create Group' })
  @ApiResponse({ status: 204, description: 'Create Group.' })
  @UseGuards(FirebaseAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(204)
  @Post()
  async createGroup(@Body() groupDto: GroupDto, @Request() req): Promise<void> {
    const idUser: UserId = req.user;
    const logger = new Logger('GroupController');
    logger.log('Petición POST Group');

    if (idUser.value !== groupDto.owner._id) {
      throw new ForbiddenException('Forbidden access to data');
    }

    try {
      await this.groupService.createGroup(
        groupDto._id,
        groupDto.name,
        groupDto.currencyCode,
        groupDto.owner,
        groupDto.members,
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
  @UseGuards(FirebaseAuthGuard)
  @Get(':id')
  async getGroup(@Request() req, @Param() params): Promise<GroupView> {
    const logger = new Logger('GroupController');
    logger.log('Petición GET Group');

    try {
      return this.groupService.getGroup(params.id);
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

  @ApiOperation({ summary: 'Update Group' })
  @ApiResponse({ status: 204, description: 'Update Group' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @UseGuards(FirebaseAuthGuard)
  @HttpCode(204)
  @Patch(':id')
  async updateGroup(
    @Param() params,
    @Body() updateGroupDto: UpdateGroupDto,
    @Request() req,
  ): Promise<void> {
    const logger = new Logger('GroupsController');
    logger.log('Petición UPDATE Groups');

    try {
      return await this.groupService.updateGroup(
        params.id,
        updateGroupDto.name,
        updateGroupDto.currencyCode,
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

  @ApiOperation({ summary: 'Delete Group' })
  @ApiResponse({ status: 204, description: 'Delete Group' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @UseGuards(FirebaseAuthGuard)
  @HttpCode(204)
  @Delete(':id')
  async removeGroup(@Param() params) {
    const logger = new Logger('GroupController');
    logger.log('Petición DELETE Group');
    try {
      return await this.groupService.removeGroup(params.id);
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
