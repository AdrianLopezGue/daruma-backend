import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Request,
  Get,
  NotFoundException,
  Param,
  Logger,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { FirebaseAuthGuard } from '../../../core/firebase/firebase.auth.guard';
import { RecurringBillService } from '../service/recurring-bill.service';
import { RecurringBillView } from '../read-model/schema/recurring-bill.schema';
import { GroupIdNotFoundError } from '../../../group/domain/exception/group-id-not-found.error';
import { RecurringBillDto } from '../dto/recurring-bill.dto';
import { RecurringBillIdAlreadyRegisteredError } from '../../domain/exception/recurring-bill-id-already-registered.error';
import { RecurringBillIdNotFoundError } from '../../domain/exception/recurring-bill-id-not-found.error';

@ApiTags('RecurringBills')
@Controller('recurringbills')
export class RecurringBillController {
  constructor(private readonly recurringBillService: RecurringBillService) {}

  @ApiOperation({ summary: 'Get Recurring Bill of Group' })
  @ApiResponse({ status: 204, description: 'Get Recurring Bill of Group.' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @UseGuards(FirebaseAuthGuard)
  @Get(':id')
  async getRecurringBill(@Request() req, @Param() params): Promise<RecurringBillView[]> {
    const logger = new Logger('RecurringBillController');
    logger.log('Petición GET RecurringBills');
    try {
      return await this.recurringBillService.getRecurringBills(params.id);
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

  @ApiOperation({ summary: 'Create Recurring Bill' })
  @ApiResponse({ status: 204, description: 'Create Recurring Bill.' })
  @UseGuards(FirebaseAuthGuard)
  @HttpCode(204)
  @Post()
  async createRecurringBill(@Body() recurringBillDto: RecurringBillDto, @Request() req): Promise<void> {
    const logger = new Logger('RecurringBillController');
    logger.log('Petición POST Recurring Bill');

    try {
      return await this.recurringBillService.createRecurringBill(
        recurringBillDto._id,
        recurringBillDto.billId,
        recurringBillDto.groupId,
        recurringBillDto.date,
        recurringBillDto.period,
      );
    } catch (e) {
      if (e instanceof RecurringBillIdAlreadyRegisteredError) {
        throw new ConflictException(e.message);
      } else if (e instanceof Error) {
        throw new BadRequestException(`Unexpected error: ${e.message}`);
      } else {
        throw new BadRequestException('Server error');
      }
    }
  }

  @ApiOperation({ summary: 'Delete Recurring Bill' })
  @ApiResponse({ status: 204, description: 'Delete Recurring Bill' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @UseGuards(FirebaseAuthGuard)
  @HttpCode(204)
  @Delete(':id')
  async removeRecurringBill(@Param() params) {
    const logger = new Logger('RecurringBillController');
    logger.log('Petición DELETE Recurring Bill');

    try {
      return await this.recurringBillService.removeRecurringBill(params.id);
    } catch (e) {
      if (e instanceof RecurringBillIdNotFoundError) {
        throw new NotFoundException('Recurring Bill not found');
      } else if (e instanceof Error) {
        throw new BadRequestException(`Unexpected error: ${e.message}`);
      } else {
        throw new BadRequestException('Server error');
      }
    }
  }
}
