import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { FirebaseAuthGuard } from '../../../core/firebase/firebase.auth.guard';
import { TransactionService } from '../service/transaction.service';
import { TransferTransactionDto } from '../dto/transfer-transaction.dto';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @ApiOperation({ summary: 'Create Transfer Transaction' })
  @ApiResponse({ status: 204, description: 'Create Transfer Transaction.' })
  @UseGuards(FirebaseAuthGuard)
  @HttpCode(204)
  @Post()
  async createTransferTransaction(
    @Body() transferTransactionDto: TransferTransactionDto,
    @Request() req,
  ): Promise<void> {
    try {
      return await this.transactionService.createTransferTransaction(
        transferTransactionDto.transactionId,
        transferTransactionDto.senderId,
        transferTransactionDto.beneficiaryId,
        transferTransactionDto.money,
        transferTransactionDto.currencyCode,
        transferTransactionDto.groupId,
      );
    } catch (e) {
      if (e instanceof Error) {
        throw new BadRequestException(`Unexpected error: ${e.message}`);
      } else {
        throw new BadRequestException('Server error');
      }
    }
  }
}
