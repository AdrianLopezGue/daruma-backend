import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  ValidationPipe,
  HttpCode,
  UsePipes,
  Post,
  Body,
  ForbiddenException,
  ConflictException,
  Request,
  UseGuards,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GroupIdNotFoundError } from '../../../group/domain/exception/group-id-not-found.error';
import { BillService } from '../service/bill.service';
import { UserId } from '../../../user/domain/model/user-id';
import { BillDto } from '../dto/bill.dto';
import { BillIdAlreadyRegisteredError } from '../../domain/exception/bill-id-already-registered.error';
import { BillView } from '../read-model/schema/bill.schema';
import { FirebaseAuthGuard } from '../../../core/firebase/firebase.auth.guard';
import { CreatorIdNotFoundInGroup } from '../../domain/exception/creator-id-not-found-in-group.error';

@ApiTags('Bills')
@Controller('bills')
export class BillController {
  constructor(private readonly billService: BillService) {}

  @ApiOperation({ summary: 'Get Bills of Group' })
  @ApiResponse({ status: 204, description: 'Get Bills of Group.' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @UseGuards(FirebaseAuthGuard)
  @Get(':id')
  async getBills(@Request() req, @Param() params): Promise<BillView[]> {
    try {
      return await this.billService.getBills(params.id);
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

  @ApiOperation({ summary: 'Create Bill' })
  @ApiResponse({ status: 204, description: 'Create Bill.' })
  @UseGuards(FirebaseAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(204)
  @Post()
  async createBill(@Body() billDto: BillDto, @Request() req): Promise<void> {
    const idUser: UserId = req.user;

    if (idUser.value !== billDto.creatorId) {
      throw new ForbiddenException('Forbidden access to data');
    }

    try {
      await this.billService.createBill(
        billDto.billId,
        billDto.groupId,
        billDto.name,
        billDto.money,
        billDto.currencyCode,
        billDto.payers,
        billDto.debtors,
        billDto.date,
        billDto.creatorId,
      );
    } catch (e) {
      if (e instanceof BillIdAlreadyRegisteredError) {
        throw new ConflictException(e.message);
      } else if (e instanceof CreatorIdNotFoundInGroup) {
        throw new ConflictException(e.message);
      } else if (e instanceof Error) {
        throw new BadRequestException(`Unexpected error: ${e.message}`);
      } else {
        throw new BadRequestException('Server error');
      }
    }
  }

  @ApiOperation({ summary: 'Delete Bill' })
  @ApiResponse({ status: 204, description: 'Delete Bill' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @UseGuards(FirebaseAuthGuard)
  @HttpCode(204)
  @Delete(':id')
  async removeGroup(@Param() params) {
    try {
      return await this.billService.removeBill(params.id);
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
