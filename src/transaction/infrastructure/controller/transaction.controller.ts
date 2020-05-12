import {
  BadRequestException,
  NotFoundException,
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Request,
  Logger,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { FirebaseAuthGuard } from '../../../core/firebase/firebase.auth.guard';
import { TransactionService } from '../service/transaction.service';
import { TransferTransactionDto } from '../dto/transfer-transaction.dto';
import { GroupIdNotFoundError } from '../../../group/domain/exception/group-id-not-found.error';
import { MemberIdNotFoundError } from '../../../member/domain/exception/member-id-not-found.error';

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
    const logger = new Logger('TransactionsController');
    logger.log('Petición POST Transactions');

    if (
      transferTransactionDto.senderId === transferTransactionDto.beneficiaryId
    ) {
      throw new BadRequestException('Sender cannot be the beneficiary');
    }
    try {
      return await this.transactionService.createTransferTransaction(
        transferTransactionDto._id,
        transferTransactionDto.senderId,
        transferTransactionDto.beneficiaryId,
        transferTransactionDto.money,
        transferTransactionDto.currencyCode,
        transferTransactionDto.groupId,
      );
    } catch (e) {
      if (e instanceof GroupIdNotFoundError) {
        throw new NotFoundException(e.message);
      } else if (e instanceof MemberIdNotFoundError) {
        throw new NotFoundException(e.message);
      } else if (e instanceof Error) {
        throw new BadRequestException(`Unexpected error: ${e.message}`);
      } else {
        throw new BadRequestException('Server error');
      }
    }
  }
}
