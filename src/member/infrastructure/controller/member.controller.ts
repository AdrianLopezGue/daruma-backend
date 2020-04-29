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
  Request,
  UseGuards,
  Param,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GroupIdNotFoundError } from '../../../group/domain/exception/group-id-not-found.error';
import { MemberView } from '../read-model/schema/member.schema';
import { RegisterMemberAsUserDto } from '../dto/register-member-as-user.dto';
import { MemberIdNotFoundError } from '../../domain/exception/member-id-not-found.error';
import { UserId } from '../../../user/domain/model/user-id';
import { MemberService } from '../service/member.service';
import { FirebaseAuthGuard } from '../../../core/firebase/firebase.auth.guard';

@ApiTags('Members')
@Controller('members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @ApiOperation({ summary: 'Get Members of Group' })
  @ApiResponse({ status: 204, description: 'Get Members of Group.' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @UseGuards(FirebaseAuthGuard)
  @Get(':id')
  async getMembers(@Request() req, @Param() params): Promise<MemberView[]> {
    try {
      return await this.memberService.getMembersByGroupId(params.id);
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
  @UseGuards(FirebaseAuthGuard)
  @HttpCode(204)
  @Patch(':id')
  async registerMemberAsUser(
    @Query('id') id: string,
    @Body() memberDto: RegisterMemberAsUserDto,
    @Request() req,
  ) {
    const idUser: UserId = req.user;

    if (idUser.value !== memberDto.idUser) {
      throw new ForbiddenException('Forbidden access to data');
    }

    try {
      return await this.memberService.registerMemberAsUser(
        id,
        memberDto.idUser,
      );
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
