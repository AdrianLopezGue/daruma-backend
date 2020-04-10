import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Query,
  ValidationPipe,
  HttpCode,
  UsePipes,
  Post,
  Body,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GroupIdNotFoundError } from '../../../group/domain/exception/group-id-not-found.error';
import { ExpenseService } from '../service/expense.service';
import { ExpenseView } from '../read-model/schema/expense.schema';
import { UserId } from '../../../user/domain/model/user-id';
import { ExpenseDto } from '../dto/expense.dto';
import { Authorization } from '../service/authentication.decorator';
import { ExpenseIdAlreadyRegisteredError } from '../../domain/exception/expense-id-already-registered.error';

@ApiTags('Expenses')
@Controller('expenses')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @ApiOperation({ summary: 'Get Expensess of Group' })
  @ApiResponse({ status: 204, description: 'Get Expensess of Group.' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @Get(':id')
  async getExpenses(@Query('id') idGroup: string): Promise<ExpenseView[]> {
    try {
      return await this.expenseService.getExpenses(idGroup);
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

  @ApiOperation({ summary: 'Create Group' })
  @ApiResponse({ status: 204, description: 'Create Group.' })
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(204)
  @Post()
  async createExpense(@Body() expenseDto: ExpenseDto, @Authorization() idUser: UserId): Promise<void> {

    if (idUser.value !== expenseDto.creatorId){
      throw new ForbiddenException('Forbidden access to data');
    }

    try {
      await this.expenseService.createExpense(
        expenseDto.expenseId,
        expenseDto.groupId,
        expenseDto.name,
        expenseDto.money,
        expenseDto.currencyCode,
        expenseDto.payers,
        expenseDto.debtors,
        expenseDto.date,
        expenseDto.periodicity,
        expenseDto.endPeriodicity
      );
    } catch (e) {
      if (e instanceof ExpenseIdAlreadyRegisteredError) {
        throw new ConflictException(e.message);
      } else if (e instanceof Error) {
        throw new BadRequestException(`Unexpected error: ${e.message}`);
      } else {
        throw new BadRequestException('Server error');
      }
    }
  }
}
