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
  Post,
  ConflictException,
  Delete,
  NotAcceptableException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { MemberView } from '../read-model/schema/member.schema';
import { RegisterMemberAsUserDto } from '../dto/register-member-as-user.dto';
import { MemberIdNotFoundError } from '../../domain/exception/member-id-not-found.error';
import { UserId } from '../../../user/domain/model/user-id';
import { MemberService } from '../service/member.service';
import { FirebaseAuthGuard } from '../../../core/firebase/firebase.auth.guard';
import { MemberDto } from '../dto/member.dto';
import { MemberNameAlreadyRegisteredError } from '../../domain/exception/member-name-in-group.error';
import { MemberIdAlreadyRegisteredError } from '../../domain/exception/member-id-already-registered.error';
import { MemberMadeTransactionError } from '../../domain/exception/member-made-transaction.error';

@ApiTags('Members')
@Controller('members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @ApiOperation({ summary: 'Get Members of Member' })
  @ApiResponse({ status: 204, description: 'Get Members of Member.' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @UseGuards(FirebaseAuthGuard)
  @Get(':id')
  async getMembers(@Request() req, @Param() params): Promise<MemberView[]> {
    try {
      return await this.memberService.getMembersByGroupId(params.id);
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

  @ApiOperation({ summary: 'Create Member' })
  @ApiResponse({ status: 204, description: 'Create Member.' })
  @UseGuards(FirebaseAuthGuard)
  @HttpCode(204)
  @Post()
  async createMember(@Body() memberDto: MemberDto, @Request() req): Promise<MemberDto> {

    try {
      return await this.memberService.createMember(
        memberDto.id,
        memberDto.groupId,
        memberDto.name,
      );
    } catch (e) {
      if (e instanceof MemberIdAlreadyRegisteredError) {
        throw new ConflictException(e.message);
      } else if (e instanceof MemberNameAlreadyRegisteredError) {
        throw new ConflictException(e.message);
      } else if (e instanceof Error) {
        throw new BadRequestException(`Unexpected error: ${e.message}`);
      } else {
        throw new BadRequestException('Server error');
      }
    }
  }

  @ApiOperation({ summary: 'Delete Member' })
  @ApiResponse({ status: 204, description: 'Delete Member' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @UseGuards(FirebaseAuthGuard)
  @HttpCode(204)
  @Delete(':id')
  async removeMember(@Param() params) {
    try {
      return await this.memberService.removeMember(params.id);
    } catch (e) {
      if (e instanceof MemberIdNotFoundError) {
        throw new NotFoundException('Member not found');
      } else if (e instanceof MemberMadeTransactionError) {
        throw new BadRequestException(e.message);
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
