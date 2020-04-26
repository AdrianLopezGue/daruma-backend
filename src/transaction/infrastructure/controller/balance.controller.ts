import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Request,
  UseGuards,
  Param,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GroupIdNotFoundError } from '../../../group/domain/exception/group-id-not-found.error';
import { FirebaseAuthGuard } from '../../../core/firebase/firebase.auth.guard';
import { BalanceService } from '../service/balance.service';
import { BalanceView } from '../read-model/schema/balance.transaction.schema';

@ApiTags('Balance')
@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @ApiOperation({ summary: 'Get Balance of Group' })
  @ApiResponse({ status: 204, description: 'Get Balance of Group.' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @UseGuards(FirebaseAuthGuard)
  @Get(':id')
  async getBalance(@Request() req, @Param() params): Promise<BalanceView[]> {
    try {
      const result = await this.balanceService.getBalance(params.id);

      return result;
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
