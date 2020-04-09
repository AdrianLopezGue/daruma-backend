import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Query,
  Patch,
  ForbiddenException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GroupIdNotFoundError } from '../../../group/domain/exception/group-id-not-found.error';
import { MemberView } from '../read-model/schema/member.schema';
import { RegisterMemberAsUserDto } from '../dto/register-member-as-user.dto';
import { MemberIdNotFoundError } from '../../domain/exception/member-id-not-found.error';
import { Authorization } from '../service/authentication.decorator';
import { UserId } from '../../../user/domain/model/user-id';
import { MemberService } from '../service/member.service';

@ApiTags('Members')
@Controller('members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @ApiOperation({ summary: 'Get Members of Group' })
  @ApiResponse({ status: 204, description: 'Get Members of Group.' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @Get(':id')
  // TODO: Add authorization when calling this method
  async getMembers(@Query('id') idGroup: string): Promise<MemberView[]> {
    try {
      return await this.memberService.getMembers(idGroup);
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

  @ApiOperation({ summary: 'Set UserId to Member' })
  @ApiResponse({ status: 204, description: 'Set UserId to Member' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @HttpCode(204)
  @Patch(':id')
  async registerMemberAsUser(@Query('id') id: string, @Body() memberDto: RegisterMemberAsUserDto, @Authorization() idUser: UserId) {

    if (idUser.value !== memberDto.idUser){
        throw new ForbiddenException('Forbidden access to data');
    }

    try {
      return await this.memberService.registerMemberAsUser(id, memberDto.idUser);
    } catch (e) {
      if (e instanceof MemberIdNotFoundError) {
        throw new NotFoundException('Member not found');
      } else if (e instanceof Error) {
        throw new BadRequestException(`Unexpected error: ${e.message}`);
      } else {
        throw new BadRequestException('Server error');
      }
    }
  }
}